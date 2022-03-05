import chai from "chai";
import { promises as fs } from "fs";
import path from "path";

import { Kubernetes } from "../src";

/**
 * @todo replace minikube based tests to test pod, deployments, ingress, sts applied using the apply method
 */
describe("Kubernetes", () => {
  /**
   * Positive Cases
   * - should load config from string
   * - should load config from file
   * - should load config from default
   *
   * Negative Cases
   * - should throw error when config is not a valid type with the method
   */
  describe("bootstrap", () => {
    it("should load config from default", () => {
      const k8s = new Kubernetes();
      chai.expect(k8s.client.kc.currentContext).to.equal("minikube");
      k8s.client.disconnect();
      chai.expect(k8s.client.kc.currentContext).to.be.undefined;
    });

    it("should load config from string", async () => {
      const config = await fs.readFile(
        path.join(process.cwd(), "tests/config"),
        "utf-8"
      );
      const k8s = new Kubernetes(config, "string");
      chai.expect(k8s.client.kc.currentContext).to.equal("minikube");
      k8s.client.disconnect();
    });

    it("should load config from file", async () => {
      const k8s = new Kubernetes(
        path.join(process.cwd(), "tests/config"),
        "file"
      );
      chai.expect(k8s.client.kc.currentContext).to.equal("minikube");
    });

    it("should throw error when config is not a valid type with the method", async () => {
      try {
        const k8s = new Kubernetes(null, "file");
      } catch (error) {
        chai
          .expect(error.message)
          .to.equal("Invalid Bootstrap Configurations or Methods.");
      }
    });
  });
});

describe("Pods", () => {
  /**
   * Positive Cases
   * - should get all pods
   *
   * Negative Cases
   * - should throw error when cluster is not connected
   */
  describe("get", () => {
    before(() => {
      const k8s = new Kubernetes();
    });

    it("should get all pods", async () => {
      const k8s = new Kubernetes();
      const pods = await k8s.Pod.getAll("kube-system");
      chai.expect(pods.items.length).to.not.be.equal(0);
    });

    it("should throw error when cluster is not connected", async () => {
      const k8s = new Kubernetes();
      k8s.client.disconnect();
      try {
        await k8s.Pod.getAll("kube-system");
      } catch (e) {
        chai.expect(e.message).to.equal("No active cluster!");
      }
    });
  });

  /**
   * Positive Cases
   * - should get single pod
   */
  describe("get", () => {
    before(() => {
      const k8s = new Kubernetes();
    });

    it("should get pods", async () => {
      const k8s = new Kubernetes();
      const pod = await k8s.Pod.get("etcd-minikube", "kube-system");
      chai.expect(pod).to.not.be.undefined;
      chai.expect(pod.metadata.name).to.equal("etcd-minikube");
    });
  });
});

describe("Deployment", () => {
  /**
   * Positive Cases
   * - should get deployments
   */
  describe("getAll", () => {
    before(() => {
      const k8s = new Kubernetes();
    });

    it("should get deployments", async () => {
      const k8s = new Kubernetes();
      const deployments = await k8s.Deployment.getAll("kube-system");
      chai.expect(deployments.items.length).to.not.be.equal(0);
    });
  });

  /**
   * Positive Cases
   * - should get single deployment
   */
  describe("get", () => {
    before(() => {
      const k8s = new Kubernetes();
    });

    it("should get single deployment", async () => {
      const k8s = new Kubernetes();
      const deployment = await k8s.Deployment.get("coredns", "kube-system");
      chai.expect(deployment).to.not.be.undefined;
      chai.expect(deployment.metadata.name).to.equal("coredns");
    });
  });
});

describe("Ingress", () => {
  describe("apply", () => {
    it("should create an ingress", async () => {
      const k8s = new Kubernetes();
      await k8s.Ingress.apply(
        `
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test-ingress-services
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-buffer-size: "128k"
    nginx.ingress.kubernetes.io/proxy-buffers-number: "4"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - ingress-test.tif
      secretName: tls-secret-services
  rules:
    - host: ingress-test.tif
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: site-pro-svc
                port: 
                  number: 80
        `
      );
    });

    it("should create an ingress with object", async () => {
      const k8s = new Kubernetes();
      await k8s.Ingress.apply({
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: {
          name: "test-ingress-services",
          annotations: {
            "cert-manager.io/cluster-issuer": "letsencrypt-prod",
            "nginx.ingress.kubernetes.io/proxy-buffer-size": "128k",
            "nginx.ingress.kubernetes.io/proxy-buffers-number": "4",
          },
        },
        spec: {
          ingressClassName: "nginx",
          tls: [
            {
              hosts: ["ingress-test.tif"],
              secretName: "tls-secret-services",
            },
          ],
          rules: [
            {
              host: "ingress-test.tif",
              http: {
                paths: [
                  {
                    path: "/",
                    pathType: "Prefix",
                    backend: {
                      service: {
                        name: "site-pro-svc",
                        port: {
                          number: 80,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      });
    });
  });

  describe("getAll", () => {
    it("should get all ingress", async () => {
      const k8s = new Kubernetes();
      const ingresses = await k8s.Ingress.getAll("default");
      chai.expect(ingresses.items.length).to.not.be.equal(0);
      chai
        .expect(ingresses.items[0].metadata.name)
        .to.equal("test-ingress-services");
    });
  });

  describe("get", () => {
    it("should get single ingress", async () => {
      const k8s = new Kubernetes();
      const ingress = await k8s.Ingress.get("test-ingress-services", "default");
      chai.expect(ingress).to.not.be.undefined;
      chai.expect(ingress.metadata.name).to.equal("test-ingress-services");
    });
  });

  describe("remove", () => {
    it("should remove ingress", async () => {
      const k8s = new Kubernetes();
      await k8s.Ingress.remove("test-ingress-services", "default");
    });
  });
});
