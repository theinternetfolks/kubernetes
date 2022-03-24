import { V1HorizontalPodAutoscaler, V1HorizontalPodAutoscalerList, V1Status } from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";
export declare class HorizontalPodAutoscaler {
    private client;
    constructor(client: TIFKubernetesClient);
    /**
     * lists all the available HPAs in the cluster
     *
     */
    getAll(namespace?: string): Promise<V1HorizontalPodAutoscalerList>;
    /**
     * get details of the available HPAs in the cluster
     *
     */
    get(name: string, namespace?: string): Promise<V1HorizontalPodAutoscaler>;
    /**
     * remove pod in the cluster
     *
     */
    remove(name: string, namespace?: string, gracePeriodSeconds?: number): Promise<V1Status>;
}
//# sourceMappingURL=hpa.d.ts.map