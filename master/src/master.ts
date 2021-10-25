import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { generatePCM } from "./ippts/ippts"

const PROTO_FOLDER: string = "../../proto"

const options: protoLoader.Options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
}

const stateInitBcastProto: grpc.GrpcObject = grpc.loadPackageDefinition(
    protoLoader.loadSync(PROTO_FOLDER + "/state_init_bcase.proto", options)
);
