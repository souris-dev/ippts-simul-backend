// package: 
// file: slave_services.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as slave_services_pb from "./slave_services_pb";
import * as master_requests_pb from "./master_requests_pb";
import * as slave_responses_pb from "./slave_responses_pb";

interface ITaskExecutorService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    executeTask: ITaskExecutorService_IExecuteTask;
    executeTaskQueue: ITaskExecutorService_IExecuteTaskQueue;
}

interface ITaskExecutorService_IExecuteTask extends grpc.MethodDefinition<master_requests_pb.ExecutableTask, slave_responses_pb.ExecutionResponse> {
    path: "/TaskExecutor/ExecuteTask";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<master_requests_pb.ExecutableTask>;
    requestDeserialize: grpc.deserialize<master_requests_pb.ExecutableTask>;
    responseSerialize: grpc.serialize<slave_responses_pb.ExecutionResponse>;
    responseDeserialize: grpc.deserialize<slave_responses_pb.ExecutionResponse>;
}
interface ITaskExecutorService_IExecuteTaskQueue extends grpc.MethodDefinition<master_requests_pb.ExecutableTaskQueue, slave_responses_pb.ExecutionResponse> {
    path: "/TaskExecutor/ExecuteTaskQueue";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<master_requests_pb.ExecutableTaskQueue>;
    requestDeserialize: grpc.deserialize<master_requests_pb.ExecutableTaskQueue>;
    responseSerialize: grpc.serialize<slave_responses_pb.ExecutionResponse>;
    responseDeserialize: grpc.deserialize<slave_responses_pb.ExecutionResponse>;
}

export const TaskExecutorService: ITaskExecutorService;

export interface ITaskExecutorServer extends grpc.UntypedServiceImplementation {
    executeTask: grpc.handleServerStreamingCall<master_requests_pb.ExecutableTask, slave_responses_pb.ExecutionResponse>;
    executeTaskQueue: grpc.handleServerStreamingCall<master_requests_pb.ExecutableTaskQueue, slave_responses_pb.ExecutionResponse>;
}

export interface ITaskExecutorClient {
    executeTask(request: master_requests_pb.ExecutableTask, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
    executeTask(request: master_requests_pb.ExecutableTask, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
    executeTaskQueue(request: master_requests_pb.ExecutableTaskQueue, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
    executeTaskQueue(request: master_requests_pb.ExecutableTaskQueue, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
}

export class TaskExecutorClient extends grpc.Client implements ITaskExecutorClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public executeTask(request: master_requests_pb.ExecutableTask, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
    public executeTask(request: master_requests_pb.ExecutableTask, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
    public executeTaskQueue(request: master_requests_pb.ExecutableTaskQueue, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
    public executeTaskQueue(request: master_requests_pb.ExecutableTaskQueue, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<slave_responses_pb.ExecutionResponse>;
}
