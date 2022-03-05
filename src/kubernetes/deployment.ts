import {
  V1Deployment,
  V1DeploymentList,
  V1Status,
} from "@kubernetes/client-node";
import * as yaml from "js-yaml";
import * as k8s from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";

export class Deployment {
  constructor(private client: TIFKubernetesClient) {
    //
  }

  /**
   * lists all the available deployments in the cluster
   *
   */
  async getAll(namespace: string = "default"): Promise<V1DeploymentList> {
    const api = this.client.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.listNamespacedDeployment(namespace)).body;
  }

  /**
   * get details of the available deployments in the cluster
   *
   */
  async get(
    name: string,
    namespace: string = "default"
  ): Promise<V1Deployment> {
    const api = this.client.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.readNamespacedDeployment(name, namespace)).body;
  }

  /**
   * remove deployments in the cluster
   *
   */
  async remove(name: string, namespace: string = "default"): Promise<V1Status> {
    const api = this.client.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.deleteNamespacedDeployment(name, namespace)).body;
  }

  /**
   * Replicate the functionality of `kubectl apply`.  That is, create the resources defined in the `specString` if they do
   * not exist, patch them if they do exist.
   *
   * @param specString File system path to a YAML Kubernetes spec.
   * @return Array of resources created
   */
  async apply(specString: string): Promise<k8s.KubernetesObject[]> {
    const client = k8s.KubernetesObjectApi.makeApiClient(this.client.kc);

    const specs: k8s.KubernetesObject[] = yaml.loadAll(
      specString
    ) as k8s.KubernetesObject[];
    const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
    const created: k8s.KubernetesObject[] = [];
    for (const spec of validSpecs) {
      // this is to convince the old version of TypeScript that metadata exists even though we already filtered specs
      // without metadata out
      spec.metadata = spec.metadata || {};
      spec.metadata.annotations = spec.metadata.annotations || {};
      delete spec.metadata.annotations[
        "kubectl.kubernetes.io/last-applied-configuration"
      ];
      spec.metadata.annotations[
        "kubectl.kubernetes.io/last-applied-configuration"
      ] = JSON.stringify(spec);
      try {
        // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
        // block.
        await client.read(spec);
        // we got the resource, so it exists, so patch it
        const response = await client.patch(spec);
        created.push(response.body);
      } catch (e) {
        // we did not get the resource, so it does not exist, so create it
        const response = await client.create(spec);
        created.push(response.body);
      }
    }
    return created;
  }
}
