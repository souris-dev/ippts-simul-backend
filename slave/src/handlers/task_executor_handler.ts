import * as grpc from "@grpc/grpc-js";

import { ExecutionResponse } from "../../protogen/slave_responses_pb";
import { ExecutableTask } from "../../protogen/master_requests_pb";
import {
  TaskExecutorService,
  ITaskExecutorServer,
} from "../../protogen/slave_services_grpc_pb";

import { evaluate } from "mathjs";

/**
 * Helper method to execute a task asynchronously.
 * @param task: ExecutableTask
 * @returns a combined promise of result evaluation and sleep duration
 */
const executeAsync = async (task: ExecutableTask) => {
  return Promise.all([
    asyncEval(task.getTask().getExpression()),
    simulateComputationCost(task.getDuration()),
  ]);
};

/**
 * Async method that simulated computation time.
 * @param duration
 */
const simulateComputationCost = (duration: number) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

/**
 * Async method to evaluate an expression.
 * @param expression
 */
const asyncEval = async (exp: string) => {
  return evaluate(exp);
};

/**
 * See https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.1.1/doc/server_impl_signature.md
 */

const TaskExecutorHandler: ITaskExecutorServer = {
  /**
   * Implements the ExecuteTask RPC method.
   * @param call
   * @param callback
   */
  executeTask: (
    call: grpc.ServerUnaryCall<ExecutableTask, ExecutionResponse>,
    callback: grpc.sendUnaryData<ExecutionResponse>
  ) => {
    executeAsync(call.request)
      .then((results: [number, unknown]) => {
        var response: ExecutionResponse = new ExecutionResponse();
        response.setResult(results[0]);
        response.setMsg("OK");
        callback(null, response);
      })
      .catch((reason: any) => {
        var response: ExecutionResponse = new ExecutionResponse();
        response.setMsg("NOT_OK " + reason.toString());
        callback(
          { message: reason.toString() as string, name: "NOT_OK" },
          response
        );
      });
  },
};

/**
 * TaskExecutorService and a Handler implementation for ITaskExecutorServer.
 */
export default {
  service: TaskExecutorService,
  handler: TaskExecutorHandler,
};
