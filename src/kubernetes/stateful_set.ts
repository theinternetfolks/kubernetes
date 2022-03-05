import {
  V1StatefulSet,
  V1StatefulSetList,
  V1Status,
} from "@kubernetes/client-node";
import * as k8s from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";

export class StatefulSet {
  constructor(private client: TIFKubernetesClient) {
    //
  }

  /**
   * lists all the available stateful sets in the cluster
   *
   */
  async getAll(namespace: string = "default"): Promise<V1StatefulSetList> {
    const api = this.client.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.listNamespacedStatefulSet(namespace)).body;
  }

  /**
   * get details of the available stateful sets in the cluster
   *
   */
  async get(
    name: string,
    namespace: string = "default"
  ): Promise<V1StatefulSet> {
    const api = this.client.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.readNamespacedStatefulSet(name, namespace)).body;
  }

  /**
   * remove stateful sets in the cluster
   *
   */
  async remove(name: string, namespace: string = "default"): Promise<V1Status> {
    const api = this.client.kc.makeApiClient(k8s.AppsV1Api);
    return (await api.deleteNamespacedStatefulSet(name, namespace)).body;
  }
}
