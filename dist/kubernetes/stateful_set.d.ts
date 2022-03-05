import { V1StatefulSet, V1StatefulSetList, V1Status } from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";
export declare class StatefulSet {
    private client;
    constructor(client: TIFKubernetesClient);
    /**
     * lists all the available stateful sets in the cluster
     *
     */
    getAll(namespace?: string): Promise<V1StatefulSetList>;
    /**
     * get details of the available stateful sets in the cluster
     *
     */
    get(name: string, namespace?: string): Promise<V1StatefulSet>;
    /**
     * remove stateful sets in the cluster
     *
     */
    remove(name: string, namespace?: string): Promise<V1Status>;
}
//# sourceMappingURL=stateful_set.d.ts.map