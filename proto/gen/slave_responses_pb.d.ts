// package: 
// file: slave_responses.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as basetypes_pb from "./basetypes_pb";

export class ExecutionResponse extends jspb.Message { 

    hasTask(): boolean;
    clearTask(): void;
    getTask(): basetypes_pb.Task | undefined;
    setTask(value?: basetypes_pb.Task): ExecutionResponse;

    hasResult(): boolean;
    clearResult(): void;
    getResult(): ExecutionResult | undefined;
    setResult(value?: ExecutionResult): ExecutionResponse;
    getMsg(): string;
    setMsg(value: string): ExecutionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionResponse): ExecutionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionResponse;
    static deserializeBinaryFromReader(message: ExecutionResponse, reader: jspb.BinaryReader): ExecutionResponse;
}

export namespace ExecutionResponse {
    export type AsObject = {
        task?: basetypes_pb.Task.AsObject,
        result?: ExecutionResult.AsObject,
        msg: string,
    }
}

export class ExecutionResult extends jspb.Message { 
    getResult(): number;
    setResult(value: number): ExecutionResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionResult.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionResult): ExecutionResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionResult;
    static deserializeBinaryFromReader(message: ExecutionResult, reader: jspb.BinaryReader): ExecutionResult;
}

export namespace ExecutionResult {
    export type AsObject = {
        result: number,
    }
}
