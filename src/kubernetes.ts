import {
  KubernetesBootstrapMethod,
  TIFKubernetesClient,
} from "./kubernetes/client";
import { Deployment } from "./kubernetes/deployment";
import { Ingress } from "./kubernetes/ingress";
import { Pod } from "./kubernetes/pod";
import { StatefulSet } from "./kubernetes/stateful_set";
import { HorizontalPodAutoscaler } from "./kubernetes/hpa";
import { Service } from "./kubernetes/service";

const resources = {
  Ingress,
  Deployment,
  Pod,
  StatefulSet,
  HorizontalPodAutoscaler,
  Service,
};

export class Kubernetes {
  public client: TIFKubernetesClient;

  Ingress: Ingress;
  Deployment: Deployment;
  Pod: Pod;
  StatefulSet: StatefulSet;
  HorizontalPodAutoscaler: HorizontalPodAutoscaler;
  Service: Service;

  constructor(
    config: any = null,
    method: KubernetesBootstrapMethod = "default"
  ) {
    this.client = new TIFKubernetesClient(config, method);
    for (const resourceName in resources) {
      if (resources.hasOwnProperty(resourceName)) {
        this[resourceName] = new resources[resourceName](this.client);
      }
    }
  }
}
