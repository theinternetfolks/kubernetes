import chai from "chai";
import { Kubernetes } from "../src";
import { promises as fs } from "fs";
import path from "path";

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
      Kubernetes.bootstrap();
      chai.expect(Kubernetes.kc.currentContext).to.equal("minikube");
      Kubernetes.disconnect();
      chai.expect(Kubernetes.kc.currentContext).to.be.undefined;
    });

    it("should load config from string", async () => {
      const config = await fs.readFile(
        path.join(process.cwd(), "tests/config"),
        "utf-8"
      );
      Kubernetes.bootstrap(config, "string");
      chai.expect(Kubernetes.kc.currentContext).to.equal("minikube");
      Kubernetes.disconnect();
    });

    it("should load config from file", async () => {
      Kubernetes.bootstrap(path.join(process.cwd(), "tests/config"), "file");
      chai.expect(Kubernetes.kc.currentContext).to.equal("minikube");
    });

    it("should throw error when config is not a valid type with the method", async () => {
      try {
        Kubernetes.bootstrap(null, "file");
      } catch (error) {
        chai
          .expect(error.message)
          .to.equal("Invalid Bootstrap Configurations or Methods.");
      }
    });
  });

  /**
   * Positive Cases
   * - should get all pods
   *
   * Negative Cases
   * - should throw error when cluster is not connected
   */
  describe("getAllPod", () => {
    before(() => {
      Kubernetes.bootstrap();
    });

    it("should get all pods", async () => {
      const pods = await Kubernetes.getAllPod("kube-system");
      chai.expect(pods.items.length).to.not.be.equal(0);
    });

    it("should throw error when cluster is not connected", async () => {
      Kubernetes.disconnect();
      try {
        await Kubernetes.getAllPod("kube-system");
      } catch (e) {
        chai.expect(e.message).to.equal("No active cluster!");
      }
    });
  });

  /**
   * Positive Cases
   * - should get single pod
   */
  describe("getPod", () => {
    before(() => {
      Kubernetes.bootstrap();
    });

    it("should get pods", async () => {
      const pod = await Kubernetes.getPod("etcd-minikube", "kube-system");
      chai.expect(pod).to.not.be.undefined;
      chai.expect(pod.metadata.name).to.equal("etcd-minikube");
    });
  });

  /**
   * Positive Cases
   * - should get deployments
   */
  describe("getAllDeployment", () => {
    before(() => {
      Kubernetes.bootstrap();
    });

    it("should get deployments", async () => {
      const deployments = await Kubernetes.getAllDeployment("kube-system");
      chai.expect(deployments.items.length).to.not.be.equal(0);
    });
  });

  /**
   * Positive Cases
   * - should get single deployment
   */
  describe("getDeployment", () => {
    before(() => {
      Kubernetes.bootstrap();
    });

    it("should get single deployment", async () => {
      const deployment = await Kubernetes.getDeployment(
        "coredns",
        "kube-system"
      );
      chai.expect(deployment).to.not.be.undefined;
      chai.expect(deployment.metadata.name).to.equal("coredns");
    });
  });
});
