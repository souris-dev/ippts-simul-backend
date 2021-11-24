import { Socket } from "socket.io";
import * as grpc from "@grpc/grpc-js";

import { TaskExecutorClient } from "../../../protogen/slave_services_grpc_pb";
import { ExecutableTask } from "../../../protogen/master_requests_pb";
import { Task } from "../../../protogen/basetypes_pb";
import { ServerAssArray } from "../../../../common/src/types/inittypes";

const host: string = process.env.HOSTBINDIP || "0.0.0.0";
const urls: string[] = ["0.0.0.0:50001", "0.0.0.0:50002", "0.0.0.0:50003"];

const clients: TaskExecutorClient[] = urls.map((element) => {
  return new TaskExecutorClient(element, grpc.ChannelCredentials.createInsecure());
})


export const simulate = (socket: Socket) => {
  socket.on("data", function(data) {
    var recievedData: ServerAssArray = data.recievedData;
    recievedData.forEach(element => {
      var task: Task = new Task();
      task.setTaskid(element.task.taskId);
      task.setExpression(element.task.expression || "0+0");

      var executableTask: ExecutableTask = new ExecutableTask();
      executableTask.setTask(task);
      var duration: number = (element.eft - element.est) * 1000;
      executableTask.setDuration(duration);

      clients[element.server.serverId].executeTask(executableTask);
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}
