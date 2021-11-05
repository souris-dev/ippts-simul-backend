import * as express from 'express';
import path = require('path');
import * as http from 'http';
import * as cors from "cors";
import { AddressInfo } from 'net';
import { Server } from 'socket.io';

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || '5030', 10);
const port_io: number = parseInt(process.env.PORT_IO || '5031', 10);

var ipptsrouter = require('./routes/ippts');

app.set('port',port);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/ippts', ipptsrouter);

var server: http.Server = http.createServer(app);
var server_io: http.Server = http.createServer();

const io = new Server(server_io,{
  path: '/',
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

io
.of('/sim')
.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server_io.listen(port_io, () => {
  console.log('Socket listening on port:' + port_io);
});

server.listen(port, () => {
    console.log('Master server listening on port ' + port);
});

server.on('listening', onListening);

function onListening() {
  var addr: string | AddressInfo = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
}