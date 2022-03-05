import { V1Pod, V1PodList } from "@kubernetes/client-node";
import * as k8s from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";

export class Pod {
  constructor(private client: TIFKubernetesClient) {
    //
  }

  /**
   * lists all the available pods in the cluster
   *
   */
  async getAll(namespace: string = "default"): Promise<V1PodList> {
    const api = this.client.kc.makeApiClient(k8s.CoreV1Api);
    return (await api.listNamespacedPod(namespace)).body;
  }

  /**
   * get details of the available pods in the cluster
   *
   */
  async get(name: string, namespace: string = "default"): Promise<V1Pod> {
    const api = this.client.kc.makeApiClient(k8s.CoreV1Api);
    return (await api.readNamespacedPod(name, namespace)).body;
  }

  /**
   * remove pod in the cluster
   *
   */
  async remove(
    name: string,
    namespace: string = "default",
    gracePeriodSeconds: number = 0
  ): Promise<V1Pod> {
    const api = this.client.kc.makeApiClient(k8s.CoreV1Api);
    return (
      await api.deleteNamespacedPod(
        name,
        namespace,
        null,
        null,
        gracePeriodSeconds
      )
    ).body;
  }
}
