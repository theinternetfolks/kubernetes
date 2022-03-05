import { V1Ingress, V1IngressList, V1Status } from "@kubernetes/client-node";
import * as yaml from "js-yaml";
import * as k8s from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";

export class Ingress {
  constructor(private client: TIFKubernetesClient) {
    //
  }

  /**
   * lists all the available ingress in the cluster
   *
   */
  async getAll(namespace: string = "default"): Promise<V1IngressList> {
    const api = this.client.kc.makeApiClient(k8s.NetworkingV1Api);
    return (await api.listNamespacedIngress(namespace)).body;
  }

  /**
   * get details of the available ingress in the cluster
   *
   */
  async get(name: string, namespace: string = "default"): Promise<V1Ingress> {
    const api = this.client.kc.makeApiClient(k8s.NetworkingV1Api);
    return (await api.readNamespacedIngress(name, namespace)).body;
  }

  /**
   * remove ingress in the cluster
   *
   */
  async remove(name: string, namespace: string = "default"): Promise<V1Status> {
    const api = this.client.kc.makeApiClient(k8s.NetworkingV1Api);
    return (await api.deleteNamespacedIngress(name, namespace)).body;
  }

  async apply(
    specString: string | V1Ingress,
    namespace: string = "default"
  ): Promise<V1Ingress> {
    const api = this.client.kc.makeApiClient(k8s.NetworkingV1Api);
    const spec = (
      typeof specString === "string" ? yaml.load(specString) : specString
    ) as V1Ingress;
    try {
      await this.get(spec.metadata.name, namespace);

      spec.metadata = spec.metadata || {};
      spec.metadata.annotations = spec.metadata.annotations || {};
      delete spec.metadata.annotations[
        "kubectl.kubernetes.io/last-applied-configuration"
      ];
      spec.metadata.annotations[
        "kubectl.kubernetes.io/last-applied-configuration"
      ] = JSON.stringify(spec);
      return (
        await api.patchNamespacedIngress(
          spec.metadata.name,
          namespace,
          spec,
          undefined,
          undefined,
          undefined,
          undefined,
          {
            headers: {
              "Content-Type": "application/merge-patch+json",
            },
          }
        )
      ).body;
    } catch (e) {
      return (await api.createNamespacedIngress(namespace, spec)).body;
    }
  }
}
