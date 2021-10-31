// package: 
// file: basetypes.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Task extends jspb.Message { 
    getTaskid(): number;
    setTaskid(value: number): Task;
    getExpression(): string;
    setExpression(value: string): Task;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Task.AsObject;
    static toObject(includeInstance: boolean, msg: Task): Task.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Task, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Task;
    static deserializeBinaryFromReader(message: Task, reader: jspb.BinaryReader): Task;
}

export namespace Task {
    export type AsObject = {
        taskid: number,
        expression: string,
    }
}

export class SlaveServer extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): SlaveServer;
    getServerid(): number;
    setServerid(value: number): SlaveServer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SlaveServer.AsObject;
    static toObject(includeInstance: boolean, msg: SlaveServer): SlaveServer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SlaveServer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SlaveServer;
    static deserializeBinaryFromReader(message: SlaveServer, reader: jspb.BinaryReader): SlaveServer;
}

export namespace SlaveServer {
    export type AsObject = {
        url: string,
        serverid: number,
    }
}

export class MasterServer extends jspb.Message { 
    getUrl(): string;
    setUrl(value: string): MasterServer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MasterServer.AsObject;
    static toObject(includeInstance: boolean, msg: MasterServer): MasterServer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MasterServer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MasterServer;
    static deserializeBinaryFromReader(message: MasterServer, reader: jspb.BinaryReader): MasterServer;
}

export namespace MasterServer {
    export type AsObject = {
        url: string,
    }
}
