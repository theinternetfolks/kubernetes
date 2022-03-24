import Dockerode, { AuthConfig } from "dockerode";

export interface BuildResponse {
  stream?: string;
  errorDetail?: { message: string };
  error?: string;
}

export interface PushResponse {
  status?: string;
  progressDetail?: { current?: number; total?: number };
  progress?: string;
  id?: string;
  errorDetail?: { message: string };
  error?: string;
  aux?: {
    Tag: string;
    Digest: string;
    Size: number;
  };
}

export interface DockerBuildOptions extends Dockerode.ImageBuildOptions {
  /**
   * Extra hosts to add to /etc/hosts
   */
  extrahosts?: string;
  /**
   * A Git repository URI or HTTP/HTTPS context URI. If the URI points to a single text file, the file’s contents are placed into a file called Dockerfile and the image is built from that file. If the URI points to a tarball, the file is downloaded by the daemon and the contents therein used as the context for the build. If the URI points to a tarball and the dockerfile parameter is also specified, there must be a file with the corresponding path inside the tarball.
   */
  remote?: string;
  /**
   * Do not use the cache when building the image.
   * Default: `false`
   */
  nocache?: boolean;
  /**
   * JSON array of images used for build cache resolution.
   */
  cachefrom?: string;
  /**
   * Attempt to pull the image even if an older image exists locally.
   */
  pull?: string;
  /**
   * Remove intermediate containers after a successful build.
   */
  rm?: boolean;
  /**
   * Always remove intermediate containers, even upon failure.
   */
  forcerm?: boolean;
  /**
   * Set memory limit for build.
   */
  memory?: number;
  /**
   * Total memory (memory + swap). Set as `-1` to disable swap.
   */
  memoryswap?: number;
  /**
   * CPU shares (relative weight).
   */
  cpushares?: number;
  /**
   * CPUs in which to allow execution (e.g., `0-3`, `0,1`).
   */
  cpusetcpus?: number;
  /**
   * The length of a CPU period in microseconds.
   */
  cpuperiod?: number;
  /**
   * Microseconds of CPU time that the container can get in a CPU period.
   */
  cpuquota?: number;
  /**
   * JSON map of string pairs for build-time variables. Users pass these values at build-time. Docker uses the buildargs as the environment context for commands run via the Dockerfile RUN instruction, or for variable expansion in other Dockerfile instructions. This is not meant for passing secret values.
   *
   * For example, the build arg FOO=bar would become {"FOO":"bar"} in JSON. This would result in the query parameter buildargs={"FOO":"bar"}. Note that {"FOO":"bar"} should be URI component encoded.
   *
   * Read more about the buildargs instruction.
   * @link {https://docs.docker.com/engine/reference/builder/#arg}
   */
  buildargs?: { [key: string]: string };
  /**
   * Size of `/dev/shm` in bytes. The size must be greater than 0. If omitted the system uses 64MB.
   */
  shmsize?: number;
  /**
   * Squash the resulting images layers into a single layer. (Experimental release only.)
   */
  squash?: boolean;
  /**
   * Arbitrary key/value labels to set on the image, as a JSON map of string pairs.
   */
  labels?: { [key: string]: string };
  /**
   * Sets the networking mode for the run commands during build. Supported standard values are: `bridge`, `host`, `none`, and `container:<name|id>`. Any other value is taken as a custom network's name to which this container should connect to.
   */
  networkmode?: string;
  /**
   * Platform in the format os[/arch[/variant]]. Default: ""
   */
  platform?: string;
  /**
   * Target build stage. Default: ""
   */
  target?: string;
}

export interface BuildOptions {
  /**
   * The context directory where the Docker image is built from.
   */
  directory?: string;
  /**
   * The files to use.
   */
  files?: string[];
  /**
   * Options to pass to the Docker build command.
   */
  buildOptions?: DockerBuildOptions;
  /**
   * Path within the build context to the Dockerfile. This is ignored if remote is specified and points to an external Dockerfile.
   */
  dockerfile?: string;
}

export interface PullOptions {
  authconfig?: AuthConfig;
}

export interface PullResponse {
  status?: string;
}

export class Docker {
  static instance = new Dockerode();

  /* c8 ignore start */
  /**
   * Build an image from a tar archive with a Dockerfile in it.
   * The Dockerfile specifies how the image is built from the tar archive. It is typically in the archive's root, but can be at a different path or have a different name by specifying the dockerfile parameter. See the Dockerfile reference for more information.
   * The Docker daemon performs a preliminary validation of the Dockerfile before starting the build, and returns an error if the syntax is incorrect. After that, each instruction is run one-by-one until the ID of the new image is output.
   * The build is canceled if the client drops the connection by quitting or being killed.
   * @param {string} tag - The tag to build
   * @param {BuildOptions} [options] - The build options
   * @returns
   */
  /* c8 ignore end */
  static async build(
    tag: string,
    options: BuildOptions = {}
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    if (!tag) {
      throw new Error("Tag is required");
    }

    if (!options.directory) {
      options.directory = process.cwd();
    }
    if (!options.dockerfile) {
      options.dockerfile = "Dockerfile";
    }

    if (!options.files) {
      options.files = [options.dockerfile];
    } else {
      if (!options.files.includes(options.dockerfile)) {
        options.files.push(options.dockerfile);
      }
    }

    if (!options.buildOptions) {
      options.buildOptions = {};
    }

    let status = false,
      message = "Could not build image";

    try {
      const stream = await Docker.instance.buildImage(
        {
          context: options.directory,
          src: options.files,
        },
        {
          t: tag,
          q: true,
          dockerfile: options.dockerfile,
          ...options.buildOptions,
        }
      );

      const buildResponse: BuildResponse[] = await new Promise(
        (resolve, reject) => {
          Docker.instance.modem.followProgress(stream, (err, res) =>
            err ? reject(err) : resolve(res)
          );
        }
      );

      if (buildResponse.length) {
        const buildOutput = buildResponse[buildResponse.length - 1];
        status = typeof buildOutput.error === "undefined";

        if (status) {
          message = buildOutput.stream;
        } else {
          message = buildOutput.error.trim();
        }
      }
    } catch (e) {
      message = e.message.trim();
    }
    return {
      status,
      message,
    };
  }

  /**
   * Create a new image by either pulling it from a registry
   * @param {string} tag - The tag to pull
   * @param {Dockerode.ImagePushOptions} [options] - The pull options
   * @returns
   */
  static async push(tag: string, options: Dockerode.ImagePushOptions = {}) {
    if (!tag) {
      throw new Error("Tag is required");
    }

    let status = false,
      message = "Could not build image",
      data = {};

    try {
      const image = Docker.instance.getImage(tag);
      const pushResponse: PushResponse[] = await new Promise(
        (resolve, reject) => {
          image.push(options, async (err, s) => {
            if (err) {
              reject(err);
            }
            Docker.instance.modem.followProgress(
              s as any,
              (dockerModemError, res) =>
                dockerModemError ? reject(dockerModemError) : resolve(res)
            );
          });
        }
      );

      const pushOutput = pushResponse[pushResponse.length - 1];

      status = typeof pushOutput.error === "undefined";

      if (pushResponse.length) {
        const buildOutput = pushResponse[pushResponse.length - 1];
        status = typeof buildOutput.error === "undefined";

        if (status) {
          message = buildOutput.aux.Digest;
          data = buildOutput.aux;
        } else {
          message = buildOutput.error.trim();
        }
      }
    } catch (e) {
      message = e.message;
    }
    return {
      status,
      message,
      data,
    };
  }

  static async pull(tag: string, options: PullOptions = {}) {
    if (!tag) {
      throw new Error("Tag is required");
    }

    let status = false,
      message = "Could not pull image";

    try {
      const pullResponse: PullResponse[] = await new Promise(
        (resolve, reject) => {
          Docker.instance.pull(tag, options, async (err, s) => {
            if (err) {
              reject(err);
            }
            Docker.instance.modem.followProgress(s, (dockerModemError, res) =>
              dockerModemError ? reject(dockerModemError) : resolve(res)
            );
          });
        }
      );

      if (pullResponse.length) {
        const pullOutput = pullResponse[pullResponse.length - 1];
        status = typeof pullOutput.status !== "undefined";

        if (status) {
          message = pullOutput.status;
        }
      }
    } catch (e) {
      message = e.message.trim();
    }

    return {
      status,
      message,
    };
  }
}
