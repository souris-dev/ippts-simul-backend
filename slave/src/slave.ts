import * as grpc from "@grpc/grpc-js";

import "../protogen/slave_services_pb";
import "../protogen/slave_services_grpc_pb";

import TaskExecutor from "./handlers/task_executor_handler";

// get the variables in .env into process.env
import dotenv = require("dotenv");
dotenv.config();

const port: string | number = process.env.PORT || 50051;
const slaveId: string | number = process.env.SLAVEID || 0;

const server: grpc.Server = new grpc.Server();
server.addService(TaskExecutor.service, TaskExecutor.handler);

server.bindAsync(
  `127.0.0.1:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err: Error, port: number) => {
    if (err != null) {
      console.error(err);
    }
    server.start();
    console.log(`SlaveServer ${slaveId} listening on port ${port}`);
  }
);
