import * as express from "express";
import {
  TaskGraphAdjMatrix,
  ComputationCostMatrix,
  ServerAssArray,
} from "../../../common/src/types/inittypes";
import { assignTasksToServers } from "../ippts/ippts_algo";

export var router = express.Router();

router.post(
  "/",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    /*
    Route: /ippts
    Method: POST
    Request body:
    {
      "taskGraph":[],
      "computationCost":[],
    }
  */
    var assignmentArray: ServerAssArray = [];
    var status: number;
    var message: string;

    try {
      const taskGraph: TaskGraphAdjMatrix = req.body.taskGraph;
      const computationCost: ComputationCostMatrix =
          req.body.computationCostMatrix;


      //Error checking
      if (
        taskGraph === undefined ||
        computationCost === undefined ||
        taskGraph.length === 0 ||
        computationCost.length === 0
      ) {
        throw new Error("Insufficient Data to Process");
      }

      if (taskGraph.length !== computationCost.length) {
        throw new Error(
          "Task Graph and Computation Cost Matrix are not of same size"
        );
      }

      //IPPTS Algorithm Call
      assignmentArray = assignTasksToServers(taskGraph, computationCost);
      status = 200;
    } catch (err) {
      status = 500;
      message = err.message;
    } finally {
      if (message !== null && status === 500) {
        res.status(status).send({
          Error: message,
        });
      } else if (status === 200) {
        res.send(assignmentArray);
      }
    }
  }
);
