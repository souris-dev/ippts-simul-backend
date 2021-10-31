// package: 
// file: master_requests.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as basetypes_pb from "./basetypes_pb";

export class ExecutableTask extends jspb.Message { 

    hasTask(): boolean;
    clearTask(): void;
    getTask(): basetypes_pb.Task | undefined;
    setTask(value?: basetypes_pb.Task): ExecutableTask;
    getDuration(): number;
    setDuration(value: number): ExecutableTask;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutableTask.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutableTask): ExecutableTask.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutableTask, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutableTask;
    static deserializeBinaryFromReader(message: ExecutableTask, reader: jspb.BinaryReader): ExecutableTask;
}

export namespace ExecutableTask {
    export type AsObject = {
        task?: basetypes_pb.Task.AsObject,
        duration: number,
    }
}
