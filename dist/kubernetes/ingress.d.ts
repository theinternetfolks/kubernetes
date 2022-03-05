import { V1Ingress, V1IngressList, V1Status } from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";
export declare class Ingress {
    private client;
    constructor(client: TIFKubernetesClient);
    /**
     * lists all the available ingress in the cluster
     *
     */
    getAll(namespace?: string): Promise<V1IngressList>;
    /**
     * get details of the available ingress in the cluster
     *
     */
    get(name: string, namespace?: string): Promise<V1Ingress>;
    /**
     * remove ingress in the cluster
     *
     */
    remove(name: string, namespace?: string): Promise<V1Status>;
    apply(specString: string | V1Ingress, namespace?: string): Promise<V1Ingress>;
}
//# sourceMappingURL=ingress.d.ts.map