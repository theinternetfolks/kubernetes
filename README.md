[![The Internet Folks Logo](https://theinternetfolks.com/assets/images/logo.png)](https://theinternetfolks.com)

# @theinternetfolks/kubernetes

[![GitHub license](https://img.shields.io/github/license/theinternetfolks/kubernetes.svg)](https://github.com/theinternetfolks/context/blob/master/LICENSE)
[![Maintainer](https://img.shields.io/badge/maintainer-monkfromearth-green)](https://github.com/monkfromearth)
[![Downloads](https://img.shields.io/npm/dm/@theinternetfolks/kubernetes)](https://www.npmjs.com/package/@theinternetfolks/kubernetes)

Library to help you interact with Docker or Kubernetes cluster in Node-based environments.

## Installation

Install with npm

```bash
  npm install @theinternetfolks/kubernetes
```

Install with yarn

```bash
  yarn add @theinternetfolks/kubernetes
```

## Usage

You initialize Kubernetes with your configuration, and then you can use any resources available.

### Loading from Default

```javascript
import { Kubernetes } from "@theinternetfolks/kubernetes";

const perform = async () => {
  const k8s = new Kubernetes(); // will load from default
  return k8s.Ingress.getAll();
};
```

### Loading from File

```javascript
import { Kubernetes } from "@theinternetfolks/kubernetes";

const perform = async () => {
  const k8s = new Kubernetes("config", "file"); // will load from a `config` file
  return k8s.Ingress.getAll();
};
```

### Loading from String

```javascript
import { Kubernetes } from "@theinternetfolks/kubernetes";

const perform = async () => {
  const config = await fs.readFile("config", "utf-8");
  const k8s = new Kubernetes(config, "string"); // will load from a `config` string
  return k8s.Ingress.getAll();
};
```

## Table Of Content

### Kubernetes

**Kubernetes / Client**

- `constructor(config: any, method: KubernetesBootstrapMethod)`
- `public kc: k8s.KubeConfig`
- `disconnect(): void`

**Kubernetes / Pod**

- `async getAll(namespace: string = "default"): Promise<V1PodList>`
- `async get(name: string, namespace: string = "default"): Promise<V1Pod>`
- `async remove(name: string, namespace: string = "default", gracePeriodSeconds: number = 0): Promise<V1Pod>`

**Kubernetes / Deployment**

- `async getAll(namespace: string = "default"): Promise<V1DeploymentList>`
- `async get(name: string, namespace: string = "default"): Promise<V1Deployment>`
- `async remove(name: string, namespace: string = "default"): Promise<V1Status>`
- `async apply(specString: string): Promise<k8s.KubernetesObject[]>`

**Kubernetes / Ingress**

- `async getAll(namespace: string = "default"): Promise<V1IngressList>`
- `async get(name: string, namespace: string = "default"): Promise<V1Ingress>`
- `async remove(name: string, namespace: string = "default"): Promise<V1Status>`
- `async apply(specString: string | V1Ingress, namespace: string = "default"): Promise<V1Ingress>`

**Kubernetes / StatefulSet**

- `async getAll(namespace: string = "default"): Promise<V1StatefulSetList>`
- `async get(name: string, namespace: string = "default"): Promise<V1StatefulSet>`
- `async remove(name: string, namespace: string = "default"): Promise<V1Status>`

### Docker

#### Build Images

`static async build(tag: string, options: BuildOptions = {})`

returns `Promise<{ status: boolean; message: string; }>`

#### Pull Images

`static async pull(tag: string, options: PullOptions = {})`

returns `Promise<{ status: boolean; message: string; }>`

#### Push Images

`static async push(tag: string, options: Dockerode.ImagePushOptions = {})`

returns `Promise<{ status: boolean; message: string; }>`

## Running Tests

To run tests, run the following command

```bash
  yarn test
```

- Used Mocha with Chai as Unit Tests
- Private Repo and Tokens were used to carry out some pull and push tests in Docker

[Test Coverage](https://theinternetfolks.github.io/kubernetes/coverage/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
