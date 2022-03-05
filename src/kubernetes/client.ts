import * as k8s from "@kubernetes/client-node";

export type KubernetesBootstrapMethod =
  | "string"
  | "file"
  | "options"
  | "default"
  | "cluster";

export class TIFKubernetesClient {
  public kc: k8s.KubeConfig = new k8s.KubeConfig();

  disconnect() {
    this.kc = new k8s.KubeConfig();
  }

  /**
   * Connect to the Kubernetes cluster.
   * @param config - kubeconfig string, options or file
   * @param method - method to load kubernetes cluster
   * @returns
   */
  constructor(
    config: any = null,
    method: KubernetesBootstrapMethod = "default"
  ) {
    if (config !== null) {
      if (method === "string") {
        this.kc.loadFromString(config);
      } else if (method === "options") {
        this.kc.loadFromOptions(config);
      } else if (method === "file") {
        this.kc.loadFromFile(config);
      }
    } else {
      if (method === "default") {
        this.kc.loadFromDefault();
      } else if (method === "cluster") {
        this.kc.loadFromCluster();
      }
    }
  }
}
