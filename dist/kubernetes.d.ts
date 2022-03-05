import { KubernetesBootstrapMethod, TIFKubernetesClient } from "./kubernetes/client";
import { Deployment } from "./kubernetes/deployment";
import { Ingress } from "./kubernetes/ingress";
import { Pod } from "./kubernetes/pod";
import { StatefulSet } from "./kubernetes/stateful_set";
export declare class Kubernetes {
    client: TIFKubernetesClient;
    Ingress: Ingress;
    Deployment: Deployment;
    Pod: Pod;
    StatefulSet: StatefulSet;
    constructor(config?: any, method?: KubernetesBootstrapMethod);
}
//# sourceMappingURL=kubernetes.d.ts.map