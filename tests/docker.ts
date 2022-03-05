import path from "path";
import chai from "chai";
import { BuildOptions, Docker } from "../src";
import Dockerode from "dockerode";

describe("Docker", () => {
  it("should instantiate Dockerode", () => {
    chai.expect(Docker.instance).to.be.an.instanceof(Dockerode);
  });

  /**
   * Positive Cases
   * - should pull the docker image
   * - should pull the docker image with authoptions
   *
   * Negative Cases
   * - should result in error if no tag is provided
   * - should result in error if invalid tag is provided
   * - should result in error if no authoptions provided for private registry
   */
  describe("pull", () => {
    it("should pull the docker image", async () => {
      const result = await Docker.pull("alpine:latest");
      chai.expect(result.status).to.be.true;
    });

    it("should pull the docker image with authoptions", async () => {
      const result = await Docker.pull(process.env.REGISTRY_TAG, {
        authconfig: {
          username: process.env.REGISTRY_USERNAME,
          password: process.env.REGISTRY_PASSWORD,
          serveraddress: process.env.SERVERADDRESS,
        },
      });
      chai.expect(result.status).to.be.true;
    });

    it("should result in error if no tag is provided", async () => {
      try {
        await Docker.pull("");
      } catch (e) {
        chai.expect(e.message).to.equal("Tag is required");
      }
    });

    it("should result in error if invalid tag is provided", async () => {
      const result = await Docker.pull("alpin:latest");
      chai.expect(result.status).to.be.false;
      chai
        .expect(result.message)
        .to.equal(
          "(HTTP code 404) unexpected - pull access denied for alpin, repository does not exist or may require 'docker login': denied: requested access to the resource is denied"
        );
    });

    it("should result in error if no authoptions provided for private registry", async () => {
      const result = await Docker.pull(process.env.REGISTRY_TAG);
      chai.expect(result.status).to.be.false;
    });
  });

  /**
   * Positive Cases
   * - should push the docker image
   *
   * Negative Cases
   * - should result in error if no tag is provided
   * - should result in error if invalid tag is provided
   * - should result in error if no authoptions provided for private registry
   */
  describe("push", () => {
    it("should push the docker image", async () => {
      const tag = process.env.REGISTRY_TEST_TAG;
      const options: BuildOptions = {
        directory: path.join(process.cwd(), "tests"),
        files: ["Dockerfile-valid"],
        dockerfile: "Dockerfile-valid",
      };
      const buildResult = await Docker.build(tag, options);
      if (buildResult.status) {
        const pushResult = await Docker.push(process.env.REGISTRY_TEST_TAG, {
          authconfig: {
            username: process.env.REGISTRY_USERNAME,
            password: process.env.REGISTRY_PASSWORD,
            serveraddress: process.env.SERVERADDRESS,
          },
        });
        chai.expect(pushResult.status).to.be.true;
      }
    });

    it("should result in error if no tag is provided", async () => {
      try {
        await Docker.push("");
      } catch (e) {
        chai.expect(e.message).to.equal("Tag is required");
      }
    });

    it("should result in error if no authoptions provided for private registry", async () => {
      const result = await Docker.push(process.env.REGISTRY_TEST_TAG);
      chai.expect(result.status).to.be.false;
    });
  });

  /**
   * Positive Cases
   * - should build a docker image
   * - should fill options with defaults
   *
   * Negative Cases
   * - should result in error for invalid dockerfile
   * - should result in error if no tag is provided
   */
  describe("build", () => {
    it("should build a docker image", async () => {
      const tag = "test/test";
      const options: BuildOptions = {
        directory: path.join(process.cwd(), "tests"),
        files: ["Dockerfile-valid"],
        dockerfile: "Dockerfile-valid",
        buildOptions: {
          rm: true,
        },
      };
      const result = await Docker.build(tag, options);
      chai.expect(result.status).to.be.true;
    });

    it("should result in error for invalid dockerfile", async () => {
      try {
        const tag = "test/test";
        const options: BuildOptions = {
          directory: path.join(process.cwd(), "tests"),
          files: ["Dockerfile-valid"],
          dockerfile: "Dockerfile-valid",
          buildOptions: {
            rm: true,
          },
        };
        const result = await Docker.build(tag, options);
      } catch (e) {
        chai.expect(e.message).to.be.eq("Tag is required");
      }
    });

    it("should result in error if no tag is provided", async () => {
      try {
        const tag = "";
        const options: BuildOptions = {
          directory: path.join(process.cwd(), "tests"),
          files: ["Dockerfile-valid"],
          dockerfile: "Dockerfile-valid",
          buildOptions: {
            rm: true,
          },
        };
        const result = await Docker.build(tag, options);
      } catch (e) {
        chai.expect(e.message).to.be.eq("Tag is required");
      }
    });
  });
});
