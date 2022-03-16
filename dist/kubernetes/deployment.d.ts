import { V1Deployment, V1DeploymentList, V1Status } from "@kubernetes/client-node";
import * as k8s from "@kubernetes/client-node";
import { TIFKubernetesClient } from "./client";
export declare class Deployment {
    private client;
    constructor(client: TIFKubernetesClient);
    /**
     * lists all the available deployments in the cluster
     *
     */
    getAll(namespace?: string): Promise<V1DeploymentList>;
    /**
     * get details of the available deployments in the cluster
     *
     */
    get(name: string, namespace?: string): Promise<V1Deployment>;
    /**
     * remove deployments in the cluster
     *
     */
    remove(name: string, namespace?: string): Promise<V1Status>;
    /**
     * Replicate the functionality of `kubectl apply`.  That is, create the resources defined in the `specString` if they do
     * not exist, patch them if they do exist.
     *
     * @param specString File system path to a YAML Kubernetes spec.
     * @return Array of resources created
     */
    apply(specString: string | k8s.KubernetesObject[]): Promise<k8s.KubernetesObject[]>;
}
//# sourceMappingURL=deployment.d.ts.map