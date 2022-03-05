import * as k8s from "@kubernetes/client-node";
import { V1Deployment, V1DeploymentList, V1Ingress, V1IngressList, V1Pod, V1PodList, V1StatefulSet, V1StatefulSetList, V1Status } from "@kubernetes/client-node";
declare type KubernetesBootstrapMethod = "string" | "file" | "options" | "default" | "cluster";
export declare class Kubernetes {
    static kc: k8s.KubeConfig;
    static disconnect(): void;
    /**
     * Connect to the Kubernetes cluster.
     * @param config - kubeconfig string, options or file
     * @param method - method to load kubernetes cluster
     * @returns
     */
    static bootstrap(config?: any, method?: KubernetesBootstrapMethod): void;
    /**
     * lists all the available pods in the cluster
     *
     */
    static getAllPod(namespace?: string): Promise<V1PodList>;
    /**
     * get details of the available pods in the cluster
     *
     */
    static getPod(name: string, namespace?: string): Promise<V1Pod>;
    /**
     * remove pod in the cluster
     *
     */
    static removePod(name: string, namespace?: string, gracePeriodSeconds?: number): Promise<V1Pod>;
    /**
     * lists all the available deployments in the cluster
     *
     */
    static getAllDeployment(namespace?: string): Promise<V1DeploymentList>;
    /**
     * get details of the available deployments in the cluster
     *
     */
    static getDeployment(name: string, namespace?: string): Promise<V1Deployment>;
    /**
     * remove deployments in the cluster
     *
     */
    static removeDeployment(name: string, namespace?: string): Promise<V1Status>;
    /**
     * lists all the available stateful sets in the cluster
     *
     */
    static getAllStatefulSet(namespace?: string): Promise<V1StatefulSetList>;
    /**
     * get details of the available stateful sets in the cluster
     *
     */
    static getStatefulSet(name: string, namespace?: string): Promise<V1StatefulSet>;
    /**
     * remove stateful sets in the cluster
     *
     */
    static removeStatefulSet(name: string, namespace?: string): Promise<V1Status>;
    /**
     * lists all the available ingress in the cluster
     *
     */
    static getAllIngress(namespace?: string): Promise<V1IngressList>;
    /**
     * get details of the available ingress in the cluster
     *
     */
    static getIngress(name: string, namespace?: string): Promise<V1Ingress>;
    /**
     * remove ingress in the cluster
     *
     */
    static removeIngress(name: string, namespace?: string): Promise<V1Status>;
    /**
     * Replicate the functionality of `kubectl apply`.  That is, create the resources defined in the `specString` if they do
     * not exist, patch them if they do exist.
     *
     * @param specString File system path to a YAML Kubernetes spec.
     * @return Array of resources created
     */
    static apply(specString: string): Promise<k8s.KubernetesObject[]>;
}
export {};
//# sourceMappingURL=kubernetes.d.ts.map