import * as grpc from "@grpc/grpc-js";

import { ExecutionResponse } from "../../protogen/slave_responses_pb";
import {
  ExecutableTask,
  ExecutableTaskQueue,
} from "../../protogen/master_requests_pb";
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
    call: grpc.ServerWritableStream<ExecutableTask, ExecutionResponse>
  ) => {
    executeAsync(call.request)
      .then((results: [number, unknown]) => {
        var response: ExecutionResponse = new ExecutionResponse();
        response.setTask(call.request.getTask());
        response.setResult(results[0]);
        response.setMsg("OK");        
        call.write(response);
      })
      .catch((reason: any) => {
        var response: ExecutionResponse = new ExecutionResponse();
        response.setMsg("NOT_OK " + reason.toString());
        call.write(response);
      })
      .finally(() => call.end());
  },

  /**
   * Implements the ExecuteTaskQueue rpc method.
   * Used when there are more than one tasks to be run on the server
   * sequentially.
   */
  executeTaskQueue: async (
    call: grpc.ServerWritableStream<ExecutableTaskQueue, ExecutionResponse>
  ) => {
    var promises: Array<Promise<[number, unknown]>> = [];
    for (var execTask of call.request.getTasksList()) {
      var err: any = null;
      try {
        var [res] = await executeAsync(execTask);
      } catch (error: any) {
        err = error;
      }

      var response: ExecutionResponse = new ExecutionResponse();
      response.setTask(execTask.getTask());
      if (err == null) {
        response.setMsg("OK");
        response.setResult(res);
      } else {
        response.setMsg("NOT_OK " + err.toString());
      }
      call.write(response);
    }

    call.end();
  },
};

/**
 * TaskExecutorService and a Handler implementation for ITaskExecutorServer.
 */
export default {
  service: TaskExecutorService,
  handler: TaskExecutorHandler,
};
