import * as express from 'express';
import path = require('path');
import * as http from 'http';
import * as cors from "cors";
import { AddressInfo } from 'net';

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || '5030', 10);

var ipptsrouter = require('./routes/ippts');

app.set('port',port);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/ippts', ipptsrouter);

var server: http.Server = http.createServer(app);

server.listen(port, () => {
    console.log('Master server listening on port ' + port);
});

server.on('listening', onListening);

function onListening() {
  var addr: string | AddressInfo = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

}