import * as k8s from "@kubernetes/client-node";
import {
  V1HorizontalPodAutoscaler,
  V1HorizontalPodAutoscalerList,
  V1Status,
} from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";

export class HorizontalPodAutoscaler {
  constructor(private client: TIFKubernetesClient) {
    //
  }

  /**
   * lists all the available HPAs in the cluster
   *
   */
  async getAll(
    namespace: string = "default"
  ): Promise<V1HorizontalPodAutoscalerList> {
    const api = this.client.kc.makeApiClient(k8s.AutoscalingV2beta2Api);
    return (await api.listNamespacedHorizontalPodAutoscaler(namespace)).body;
  }

  /**
   * get details of the available HPAs in the cluster
   *
   */
  async get(
    name: string,
    namespace: string = "default"
  ): Promise<V1HorizontalPodAutoscaler> {
    const api = this.client.kc.makeApiClient(k8s.AutoscalingV2beta2Api);
    return (await api.readNamespacedHorizontalPodAutoscaler(name, namespace))
      .body;
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
    const api = this.client.kc.makeApiClient(k8s.AutoscalingV2beta2Api);
    return (
      await api.deleteNamespacedHorizontalPodAutoscaler(
        name,
        namespace,
        null,
        null,
        gracePeriodSeconds
      )
    ).body;
  }
}
