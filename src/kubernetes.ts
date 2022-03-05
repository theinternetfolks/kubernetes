import * as k8s from "@kubernetes/client-node";
import {
  V1Deployment,
  V1DeploymentList,
  V1Ingress,
  V1IngressList,
  V1Pod,
  V1PodList,
  V1StatefulSet,
  V1StatefulSetList,
} from "@kubernetes/client-node";
import * as yaml from "js-yaml";

type KubernetesBootstrapMethod =
  | "string"
  | "file"
  | "options"
  | "default"
  | "cluster";

export class Kubernetes {
  static kc = new k8s.KubeConfig();

  static disconnect() {
    Kubernetes.kc = new k8s.KubeConfig();
  }

  /**
   * Connect to the Kubernetes cluster.
   * @param config - kubeconfig string, options or file
   * @param method - method to load kubernetes cluster
   * @returns
   */
  static bootstrap(
    config: any = null,
    method: KubernetesBootstrapMethod = "default"
  ): void {
    if (config !== null) {
      if (method === "string") {
        return Kubernetes.kc.loadFromString(config);
      } else if (method === "options") {
        return Kubernetes.kc.loadFromOptions(config);
      } else if (method === "file") {
        return Kubernetes.kc.loadFromFile(config);
      }
    } else {
      if (method === "default") {
        return Kubernetes.kc.loadFromDefault();
      } else if (method === "cluster") {
        return Kubernetes.kc.loadFromCluster();
      }
    }
    throw new Error("Invalid Bootstrap Configurations or Methods.");
  }

  /**
   * lists all the available pods in the cluster
   *
   */
  static async getAllPod(namespace: string = "default"): Promise<V1PodList> {
    const api = Kubernetes.kc.makeApiClient(k8s.CoreV1Api);
    return (await api.listNamespacedPod(namespace)).body;
  }

  /**
   * get details of the available pods in the cluster
   *
   */
  static async getPod(
    name: string,
    namespace: string = "default"
  ): Promise<V1Pod> {
    const api = Kubernetes.kc.makeApiClient(k8s.CoreV1Api);
    return (await api.readNamespacedPod(name, namespace)).body;
  }

  /**
   * lists all the available deployments in the cluster
   *
   */
  static async getAllDeployment(
    namespace: string = "default"
  ): Promise<V1DeploymentList> {
    const api = Kubernetes.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.listNamespacedDeployment(namespace)).body;
  }

  /**
   * get details of the available deployments in the cluster
   *
   */
  static async getDeployment(
    name: string,
    namespace: string = "default"
  ): Promise<V1Deployment> {
    const api = Kubernetes.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.readNamespacedDeployment(name, namespace)).body;
  }

  /**
   * lists all the available deployments in the cluster
   *
   */
  static async getAllStatefulSet(
    namespace: string = "default"
  ): Promise<V1StatefulSetList> {
    const api = Kubernetes.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.listNamespacedStatefulSet(namespace)).body;
  }

  /**
   * get details of the available deployments in the cluster
   *
   */
  static async getStatefulSet(
    name: string,
    namespace: string = "default"
  ): Promise<V1StatefulSet> {
    const api = Kubernetes.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.readNamespacedStatefulSet(name, namespace)).body;
  }

  /**
   * lists all the available deployments in the cluster
   *
   */
  static async getAllIngress(
    namespace: string = "default"
  ): Promise<V1IngressList> {
    const api = Kubernetes.kc.makeApiClient(k8s.NetworkingV1Api);
    return (await api.listNamespacedIngress(namespace)).body;
  }

  /**
   * get details of the available deployments in the cluster
   *
   */
  static async getIngress(
    name: string,
    namespace: string = "default"
  ): Promise<V1Ingress> {
    const api = Kubernetes.kc.makeApiClient(k8s.NetworkingV1Api);
    return (await api.readNamespacedIngress(name, namespace)).body;
  }

  /**
   * Replicate the functionality of `kubectl apply`.  That is, create the resources defined in the `specString` if they do
   * not exist, patch them if they do exist.
   *
   * @param specString File system path to a YAML Kubernetes spec.
   * @return Array of resources created
   */
  static async apply(specString: string): Promise<k8s.KubernetesObject[]> {
    const client = k8s.KubernetesObjectApi.makeApiClient(Kubernetes.kc);

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
