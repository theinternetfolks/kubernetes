import { V1Pod, V1PodList } from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";
export declare class Pod {
    private client;
    constructor(client: TIFKubernetesClient);
    /**
     * lists all the available pods in the cluster
     *
     */
    getAll(namespace?: string): Promise<V1PodList>;
    /**
     * get details of the available pods in the cluster
     *
     */
    get(name: string, namespace?: string): Promise<V1Pod>;
    /**
     * remove pod in the cluster
     *
     */
    remove(name: string, namespace?: string, gracePeriodSeconds?: number): Promise<V1Pod>;
}
//# sourceMappingURL=pod.d.ts.map