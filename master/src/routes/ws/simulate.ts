import { Socket } from "socket.io";

export const simulate = (socket: Socket) =>{
  console.log("a user connected");
  socket.on("message", function(message){
    console.log(message.data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}