import { V1Service, V1ServiceList, V1Status } from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";
export declare class Service {
    private client;
    constructor(client: TIFKubernetesClient);
    /**
     * lists all the available pods in the cluster
     *
     */
    getAll(namespace?: string): Promise<V1ServiceList>;
    /**
     * get details of the available pods in the cluster
     *
     */
    get(name: string, namespace?: string): Promise<V1Service>;
    /**
     * remove pod in the cluster
     *
     */
    remove(name: string, namespace?: string, gracePeriodSeconds?: number): Promise<V1Status>;
}
//# sourceMappingURL=service.d.ts.map