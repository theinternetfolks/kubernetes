import * as k8s from "@kubernetes/client-node";
export declare type KubernetesBootstrapMethod = "string" | "file" | "options" | "default" | "cluster";
export declare class TIFKubernetesClient {
    kc: k8s.KubeConfig;
    disconnect(): void;
    /**
     * Connect to the Kubernetes cluster.
     * @param config - kubeconfig string, options or file
     * @param method - method to load kubernetes cluster
     * @returns
     */
    constructor(config?: any, method?: KubernetesBootstrapMethod);
}
//# sourceMappingURL=client.d.ts.map