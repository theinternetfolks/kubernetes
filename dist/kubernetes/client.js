"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIFKubernetesClient = void 0;
var k8s = __importStar(require("@kubernetes/client-node"));
var TIFKubernetesClient = /** @class */ (function () {
    /**
     * Connect to the Kubernetes cluster.
     * @param config - kubeconfig string, options or file
     * @param method - method to load kubernetes cluster
     * @returns
     */
    function TIFKubernetesClient(config, method) {
        if (config === void 0) { config = null; }
        if (method === void 0) { method = "default"; }
        this.kc = new k8s.KubeConfig();
        if (config !== null) {
            if (method === "string") {
                this.kc.loadFromString(config);
            }
            else if (method === "options") {
                this.kc.loadFromOptions(config);
            }
            else if (method === "file") {
                this.kc.loadFromFile(config);
            }
        }
        else {
            if (method === "default") {
                this.kc.loadFromDefault();
            }
            else if (method === "cluster") {
                this.kc.loadFromCluster();
            }
        }
    }
    TIFKubernetesClient.prototype.disconnect = function () {
        this.kc = new k8s.KubeConfig();
    };
    return TIFKubernetesClient;
}());
exports.TIFKubernetesClient = TIFKubernetesClient;
//# sourceMappingURL=client.js.map