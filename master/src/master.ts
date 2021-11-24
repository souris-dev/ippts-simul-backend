import * as express from "express";
import * as http from "http";
import * as cors from "cors";
import { Server } from "socket.io";
import { router as ipptsrouter } from "./routes/ippts";
import { simulate } from "./routes/ws/simulate";

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || "5030", 10);
const port_ws: number = parseInt(process.env.PORT_IO || "5031", 10);
const host: string = process.env.HOSTBINDIP || "0.0.0.0";

app.set("port", port);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//api routes
app.use("/ippts", ipptsrouter);

var server: http.Server = http.createServer(app);
var server_ws: http.Server = http.createServer();

const io = new Server(server_ws, {
  path: "/",
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }
});

//web socket routes
io.of("/sim").on("connection", simulate);

server_ws.listen(port_ws, host, () => {
  console.log("Socket listening on port:" + port_ws);
});

server.listen(port, host, () => {
  console.log("Master server listening on port " + port);
});
