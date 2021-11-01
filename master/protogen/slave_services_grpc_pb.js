// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var master_requests_pb = require('./master_requests_pb.js');
var slave_responses_pb = require('./slave_responses_pb.js');

function serialize_ExecutableTask(arg) {
  if (!(arg instanceof master_requests_pb.ExecutableTask)) {
    throw new Error('Expected argument of type ExecutableTask');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ExecutableTask(buffer_arg) {
  return master_requests_pb.ExecutableTask.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ExecutableTaskQueue(arg) {
  if (!(arg instanceof master_requests_pb.ExecutableTaskQueue)) {
    throw new Error('Expected argument of type ExecutableTaskQueue');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ExecutableTaskQueue(buffer_arg) {
  return master_requests_pb.ExecutableTaskQueue.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ExecutionResponse(arg) {
  if (!(arg instanceof slave_responses_pb.ExecutionResponse)) {
    throw new Error('Expected argument of type ExecutionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ExecutionResponse(buffer_arg) {
  return slave_responses_pb.ExecutionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// The service below has server-side streaming RPC's 
// because the connection needs to be kept alive till the task finishes
var TaskExecutorService = exports.TaskExecutorService = {
  // For a single task:
executeTask: {
    path: '/TaskExecutor/ExecuteTask',
    requestStream: false,
    responseStream: true,
    requestType: master_requests_pb.ExecutableTask,
    responseType: slave_responses_pb.ExecutionResponse,
    requestSerialize: serialize_ExecutableTask,
    requestDeserialize: deserialize_ExecutableTask,
    responseSerialize: serialize_ExecutionResponse,
    responseDeserialize: deserialize_ExecutionResponse,
  },
  // When there's more than one task to execute one after the other on the same server:
executeTaskQueue: {
    path: '/TaskExecutor/ExecuteTaskQueue',
    requestStream: false,
    responseStream: true,
    requestType: master_requests_pb.ExecutableTaskQueue,
    responseType: slave_responses_pb.ExecutionResponse,
    requestSerialize: serialize_ExecutableTaskQueue,
    requestDeserialize: deserialize_ExecutableTaskQueue,
    responseSerialize: serialize_ExecutionResponse,
    responseDeserialize: deserialize_ExecutionResponse,
  },
};

exports.TaskExecutorClient = grpc.makeGenericClientConstructor(TaskExecutorService);
