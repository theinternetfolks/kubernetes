import Dockerode, { AuthConfig } from "dockerode";
export interface BuildResponse {
    stream?: string;
    errorDetail?: {
        message: string;
    };
    error?: string;
}
export interface PushResponse {
    status?: string;
    progressDetail?: {
        current?: number;
        total?: number;
    };
    progress?: string;
    id?: string;
    errorDetail?: {
        message: string;
    };
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
    buildargs?: {
        [key: string]: string;
    };
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
    labels?: {
        [key: string]: string;
    };
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
    authconfig?: AuthConfig | undefined;
}
export interface PullResponse {
    status?: string;
}
export declare class Docker {
    static instance: Dockerode;
    /**
     * Build an image from a tar archive with a Dockerfile in it.
     * The Dockerfile specifies how the image is built from the tar archive. It is typically in the archive's root, but can be at a different path or have a different name by specifying the dockerfile parameter. See the Dockerfile reference for more information.
     * The Docker daemon performs a preliminary validation of the Dockerfile before starting the build, and returns an error if the syntax is incorrect. After that, each instruction is run one-by-one until the ID of the new image is output.
     * The build is canceled if the client drops the connection by quitting or being killed.
     * @param {string} tag - The tag to build
     * @param {BuildOptions} [options] - The build options
     * @returns
     */
    static build(tag: string, options?: BuildOptions): Promise<{
        status: boolean;
        message: string;
    }>;
    /**
     * Create a new image by either pulling it from a registry
     * @param {string} tag - The tag to pull
     * @param {Dockerode.ImagePushOptions} [options] - The pull options
     * @returns
     */
    static push(tag: string, options?: Dockerode.ImagePushOptions): Promise<{
        status: boolean;
        message: string;
        data: {};
    }>;
    static pull(tag: string, options?: PullOptions): Promise<{
        status: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=docker.d.ts.map