"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Docker = void 0;
var dockerode_1 = __importDefault(require("dockerode"));
var Docker = /** @class */ (function () {
    function Docker() {
    }
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
    Docker.build = function (tag, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var status, message, stream_1, buildResponse, buildOutput, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        }
                        else {
                            if (!options.files.includes(options.dockerfile)) {
                                options.files.push(options.dockerfile);
                            }
                        }
                        if (!options.buildOptions) {
                            options.buildOptions = {};
                        }
                        status = false, message = "Could not build image";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Docker.instance.buildImage({
                                context: options.directory,
                                src: options.files,
                            }, __assign({ t: tag, q: true, dockerfile: options.dockerfile }, options.buildOptions))];
                    case 2:
                        stream_1 = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                Docker.instance.modem.followProgress(stream_1, function (err, res) {
                                    return err ? reject(err) : resolve(res);
                                });
                            })];
                    case 3:
                        buildResponse = _a.sent();
                        if (buildResponse.length) {
                            buildOutput = buildResponse[buildResponse.length - 1];
                            status = typeof buildOutput.error === "undefined";
                            if (status) {
                                message = buildOutput.stream;
                            }
                            else {
                                message = buildOutput.error.trim();
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        message = e_1.message.trim();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, {
                            status: status,
                            message: message,
                        }];
                }
            });
        });
    };
    /**
     * Create a new image by either pulling it from a registry
     * @param {string} tag - The tag to pull
     * @param {Dockerode.ImagePushOptions} [options] - The pull options
     * @returns
     */
    Docker.push = function (tag, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var status, message, data, image_1, pushResponse, pushOutput, buildOutput, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tag) {
                            throw new Error("Tag is required");
                        }
                        status = false, message = "Could not build image", data = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        image_1 = Docker.instance.getImage(tag);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                image_1.push(options, function (err, s) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (err) {
                                            reject(err);
                                        }
                                        Docker.instance.modem.followProgress(s, function (err, res) {
                                            return err ? reject(err) : resolve(res);
                                        });
                                        return [2 /*return*/];
                                    });
                                }); });
                            })];
                    case 2:
                        pushResponse = _a.sent();
                        pushOutput = pushResponse[pushResponse.length - 1];
                        status = typeof pushOutput.error === "undefined";
                        if (pushResponse.length) {
                            buildOutput = pushResponse[pushResponse.length - 1];
                            status = typeof buildOutput.error === "undefined";
                            if (status) {
                                message = buildOutput.aux.Digest;
                                data = buildOutput.aux;
                            }
                            else {
                                message = buildOutput.error.trim();
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        message = e_2.message;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {
                            status: status,
                            message: message,
                            data: data,
                        }];
                }
            });
        });
    };
    Docker.pull = function (tag, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var status, message, pullResponse, pullOutput, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tag) {
                            throw new Error("Tag is required");
                        }
                        status = false, message = "Could not pull image";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                Docker.instance.pull(tag, options, function (err, s) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (err) {
                                            reject(err);
                                        }
                                        Docker.instance.modem.followProgress(s, function (err, res) {
                                            return err ? reject(err) : resolve(res);
                                        });
                                        return [2 /*return*/];
                                    });
                                }); });
                            })];
                    case 2:
                        pullResponse = _a.sent();
                        if (pullResponse.length) {
                            pullOutput = pullResponse[pullResponse.length - 1];
                            status = typeof pullOutput.status !== "undefined";
                            if (status) {
                                message = pullOutput.status;
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        message = e_3.message.trim();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {
                            status: status,
                            message: message,
                        }];
                }
            });
        });
    };
    Docker.instance = new dockerode_1.default();
    return Docker;
}());
exports.Docker = Docker;
//# sourceMappingURL=docker.js.map