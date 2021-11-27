import { Socket } from "socket.io";
import * as grpc from "@grpc/grpc-js";

import { TaskExecutorClient } from "../../../protogen/slave_services_grpc_pb";
import { ExecutionResponse } from "../../../protogen/slave_responses_pb";
import { ExecutableTask } from "../../../protogen/master_requests_pb";
import { Task } from "../../../protogen/basetypes_pb";
import { ServerAssArray } from "../../../../common/src/types/inittypes";
import { SimulationResponseData } from "../../../../common/src/types/inittypes";

const host: string = process.env.HOSTBINDIP || "0.0.0.0";
const urls: string[] = ["slave_0:50051", "slave_1:50052", "slave_2:50053"];

const clients: TaskExecutorClient[] = urls.map((element) => {
  return new TaskExecutorClient(element, grpc.ChannelCredentials.createInsecure());
})


export const simulate = (socket: Socket) => {
  socket.on("data", function(data) {

    // received Server Assign Data from Client
    // The following json corresponds to common types
    var receivedData: ServerAssArray = JSON.parse(data);
    var timer: number = 0;
    receivedData.forEach((element,index) => {
      setTimeout(() => {
      var task: Task = new Task();
      task.setTaskid(element.task.taskId);
      task.setExpression(element.task.expression || "0+0");

      var start: Date | string = new Date(Date.now());
      console.log(start);
      socket.emit("simulationprogress", {
        taskId: element.task.taskId,
        result: "running",
        serverTime: start.toUTCString(),
        serverId: element.server.serverId
      });
      var executableTask: ExecutableTask = new ExecutableTask();
      executableTask.setTask(task);

      var duration: number = (element.eft - element.est) * 1000;
      executableTask.setDuration(duration);

      const stream = clients[element.server.serverId].executeTask(executableTask);
      stream.on("data", (response: ExecutionResponse) => {
        var emitData: SimulationResponseData = {
          taskId: response.getTask().getTaskid(),
          result: response.getResult().toString(),
        }
        socket.emit("simulationresponse", emitData);
        var end: Date | string = new Date(Date.now());
        socket.emit("simulationprogress", {
          taskId: element.task.taskId,
          result: "completed",
          serverTime: end.toUTCString(),
          serverId: element.server.serverId,
        });
      })  
      }, element.est*1000);
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}
