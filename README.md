# Backend for IPPTS Algorithm simulation

[![CircleCI](https://circleci.com/gh/souris-dev/ippts-simul-backend.svg?style=svg)](https://circleci.com/gh/souris-dev/ippts-simul-backend)

Simulation of the IPPTS algorithm (task scheduling algorithm) using a distributed system of servers. This repository has the code for the master and slave servers.

Repository for the frontend: https://github.com/Malika01/ippts-simul-frontend

## Directory Structure

A simplified view (with important files and directories) is:

```
project root
--- master (subproject)
    |--- src
    |--- test
    |--- package.json
    |--- tsconfig.json
--- slave (subproject)
    |--- src
    |--- test
    |--- package.json
    |--- tsconfig.json
--- common
    |--- src
         |--- types
    |--- tsconfig.json
--- proto
--- scripts
--- package.json
--- tsconfig.json
```

The `master` and `slave` directories are typescript subprojects for the master server and the slave servers respectively.
The `common` folder has common type definitions for slave and master. The `proto` folder has the ProtoBuf definitions for gRPC; these files will be used by both the master and the slaves.
The `scripts` directory contains useful OS-specific scripts for generating typescript definitions from the .proto files in the proto directory. These scripts need not be invoked directly (running `npm run build` from the *project root directory* runs them automatically).

The `master` and `slave` subprojects have their own `package.json` and their own dependencies. This project as a whole also has some dependencies common to both of them (mostly typescript type definitions) that can be found in the package.json file of the root folder of the repository.

This separation into subprojects allows working on them in an easier way, and also allows separate dependency management.

## Building

First of all, you would want to run `npm install` in the project root folder, in the `master` folder and in the `slave` folder. So run from the *project root directory*:

```sh
npm install
cd master
npm install
cd ../slave
npm install
```

Then, to build `master` and `slave` subprojects both, run this from the *project root directory*:

```sh
npm run build
```

To build a single subproject (like the `master` subproject), do this from the *project root directory*:

For master subproject (from project root directory):
```sh
cd master
npm run build
```

For slave subproject (from project root directory):
```sh
cd slave
npm run build
```

***Note***:
1. If there are any changes in the proto folder (like new .proto files or modifications to existing ones), then please run `npm run proto-gen` from the *project root directory* to generate updated typescript definitions from the .proto files. 
2. If you run `npm run build` from the *project root directory*, then `npm run proto-gen` is executed automatically before building the `master` and `slave` projects. However, it will not be executed if `npm run build` is run from within the `master` or the `slave` folder.
3. Currently, `npm run proto-gen` only works on Windows systems. An equivalent shell script for POSIX based systems will be added soon.

## Testing

The `master` and `slave` subprojects have their own tests for now (integration tests may be added later) that use mocha and chai.

To run all tests in `master` and `slave`, run the following from the project root directory:

```sh
npm run test
```

To run tests for a subproject, `cd` into that folder and then run `npm test` (after installing dependencies).

So, from the project root directory, for running the slave server tests, run:

```sh
cd slave
npm run test
```

And for running the master server tests, from the project root directory, run:

```sh
cd master
npm run test
```

## Docker Images

This section describes how you can create a docker image, run a container using that image, and push the image
to docker hub.

Currently, these scripts are set up only for the slave server subproject (since its development is complete), but will also be set up for the master server subproject very soon.

***Note***: Ensure that docker is set up on your system and you are logged in with your Docker Hub account if you want to push to and pull images from Docker Hub.

*The steps below describe the steps using the docker CLI. You can, of course, use a GUI for the same too (like Docker Desktop).*

### Manually Building the Docker Image

#### Slave server

1. From the *project root directory*, go to the slave subproject directory using:

```sh
cd slave
```

2. Now run the following based on what you want to do:
    - To build a docker image, run:

    ```sh
    npm run docker:build
    ```

    - To run a container using the built image, run:

    ```sh
    npm run docker:run
    ```

    The docker container binds to ***0.0.0.0:50051*** by default if you use this command.

    - To push a built image of the slave server to docker hub, run:

    ```sh
    npm run docker:push
    ```

### Getting the Docker Image from Docker Hub

Alternatively, instead of building the docker image manually, you can pull the docker image from Docker Hub.
(This may or may not be a little outdated though.)


See [the Docker Hub repository for the backend](https://hub.docker.com/r/sachett/ippts_simul_backend) and run the pull command there to pull the image. *Use the tag `slave` for pulling a docker image of the slave server.*

So, run this to pull the docker image of the slave server:

```sh
docker pull sachett/ippts_simul_backend:slave
```

When the `master` tag is added for the master server, you can pull the master server image using:

```sh
docker pull sachett/ippts_simul_backend:master
```
