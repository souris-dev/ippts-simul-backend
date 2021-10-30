// package: 
// file: slave_services.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as slave_services_pb from "./slave_services_pb";
import * as master_requests_pb from "./master_requests_pb";
import * as slave_responses_pb from "./slave_responses_pb";

interface IExecutorServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    executeTask: IExecutorServiceService_IExecuteTask;
}

interface IExecutorServiceService_IExecuteTask extends grpc.MethodDefinition<master_requests_pb.ExecutableTask, slave_responses_pb.ExecutionResponse> {
    path: "/ExecutorService/ExecuteTask";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<master_requests_pb.ExecutableTask>;
    requestDeserialize: grpc.deserialize<master_requests_pb.ExecutableTask>;
    responseSerialize: grpc.serialize<slave_responses_pb.ExecutionResponse>;
    responseDeserialize: grpc.deserialize<slave_responses_pb.ExecutionResponse>;
}

export const ExecutorServiceService: IExecutorServiceService;

export interface IExecutorServiceServer {
    executeTask: grpc.handleUnaryCall<master_requests_pb.ExecutableTask, slave_responses_pb.ExecutionResponse>;
}

export interface IExecutorServiceClient {
    executeTask(request: master_requests_pb.ExecutableTask, callback: (error: grpc.ServiceError | null, response: slave_responses_pb.ExecutionResponse) => void): grpc.ClientUnaryCall;
    executeTask(request: master_requests_pb.ExecutableTask, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: slave_responses_pb.ExecutionResponse) => void): grpc.ClientUnaryCall;
    executeTask(request: master_requests_pb.ExecutableTask, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: slave_responses_pb.ExecutionResponse) => void): grpc.ClientUnaryCall;
}

export class ExecutorServiceClient extends grpc.Client implements IExecutorServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public executeTask(request: master_requests_pb.ExecutableTask, callback: (error: grpc.ServiceError | null, response: slave_responses_pb.ExecutionResponse) => void): grpc.ClientUnaryCall;
    public executeTask(request: master_requests_pb.ExecutableTask, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: slave_responses_pb.ExecutionResponse) => void): grpc.ClientUnaryCall;
    public executeTask(request: master_requests_pb.ExecutableTask, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: slave_responses_pb.ExecutionResponse) => void): grpc.ClientUnaryCall;
}
