"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kubernetes = void 0;
var client_1 = require("./kubernetes/client");
var deployment_1 = require("./kubernetes/deployment");
var ingress_1 = require("./kubernetes/ingress");
var pod_1 = require("./kubernetes/pod");
var stateful_set_1 = require("./kubernetes/stateful_set");
var hpa_1 = require("./kubernetes/hpa");
var service_1 = require("./kubernetes/service");
var resources = {
    Ingress: ingress_1.Ingress,
    Deployment: deployment_1.Deployment,
    Pod: pod_1.Pod,
    StatefulSet: stateful_set_1.StatefulSet,
    HorizontalPodAutoscaler: hpa_1.HorizontalPodAutoscaler,
    Service: service_1.Service,
};
var Kubernetes = /** @class */ (function () {
    function Kubernetes(config, method) {
        if (config === void 0) { config = null; }
        if (method === void 0) { method = "default"; }
        this.client = new client_1.TIFKubernetesClient(config, method);
        for (var resourceName in resources) {
            if (resources.hasOwnProperty(resourceName)) {
                this[resourceName] = new resources[resourceName](this.client);
            }
        }
    }
    return Kubernetes;
}());
exports.Kubernetes = Kubernetes;
//# sourceMappingURL=kubernetes.js.map