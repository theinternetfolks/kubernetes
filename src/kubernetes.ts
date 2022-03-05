import {
  KubernetesBootstrapMethod,
  TIFKubernetesClient,
} from "./kubernetes/client";
import { Deployment } from "./kubernetes/deployment";
import { Ingress } from "./kubernetes/ingress";
import { Pod } from "./kubernetes/pod";
import { StatefulSet } from "./kubernetes/stateful_set";

const resources = {
  Ingress,
  Deployment,
  Pod,
  StatefulSet,
};

export class Kubernetes {
  public client: TIFKubernetesClient;

  Ingress: Ingress;
  Deployment: Deployment;
  Pod: Pod;
  StatefulSet: StatefulSet;

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
