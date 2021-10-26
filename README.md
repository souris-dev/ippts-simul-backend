# Backend for IPPTS Algorithm simulation

[![CircleCI](https://circleci.com/gh/souris-dev/ippts-simul-backend.svg?style=svg)](https://circleci.com/gh/souris-dev/ippts-simul-backend)

Simulation of the IPPTS algorithm (task scheduling algorithm) using a distributed system of servers. This repository has the code for the master and slave servers.

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
--- package.json
--- tsconfig.json
```

The `master` and `slave` directories are typescript subprojects for the master server and the slave servers respectively.
The `common` folder has common type definitions for slave and master. The `proto` folder has the ProtoBuf definitions for gRPC; these files will be used by both the master and the slaves.

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
npm build
```

To build a single subproject (like the `master` subproject), do this from the *project root directory*:

For master subproject (from project root directory):
```sh
cd master
npm build
```

For slave subproject (from project root directory):
```sh
cd slave
npm build
```

## Testing

The `master` and `slave` subprojects have their own tests for now (integration tests may be added later) that use mocha and chai.

To run all tests in `master` and `slave`, run the following from the project root directory:

```sh
npm test
```

To run tests for a subproject, `cd` into that folder and then run `npm test` (after installing dependencies).

So, from the project root directory, for running the slave server tests, run:

```sh
cd slave
npm test
```

And for running the master server tests, from the project root directory, run:

```sh
cd master
npm test
```
