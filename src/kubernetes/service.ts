import * as k8s from "@kubernetes/client-node";
import { V1Service, V1ServiceList, V1Status } from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";

export class Service {
  constructor(private client: TIFKubernetesClient) {
    //
  }

  /**
   * lists all the available pods in the cluster
   *
   */
  async getAll(namespace: string = "default"): Promise<V1ServiceList> {
    const api = this.client.kc.makeApiClient(k8s.CoreV1Api);
    return (await api.listNamespacedService(namespace)).body;
  }

  /**
   * get details of the available pods in the cluster
   *
   */
  async get(name: string, namespace: string = "default"): Promise<V1Service> {
    const api = this.client.kc.makeApiClient(k8s.CoreV1Api);
    return (await api.readNamespacedService(name, namespace)).body;
  }

  /**
   * remove pod in the cluster
   *
   */
  async remove(
    name: string,
    namespace: string = "default",
    gracePeriodSeconds: number = 0
  ): Promise<V1Status> {
    const api = this.client.kc.makeApiClient(k8s.CoreV1Api);
    return (
      await api.deleteNamespacedService(
        name,
        namespace,
        null,
        null,
        gracePeriodSeconds
      )
    ).body;
  }
}
