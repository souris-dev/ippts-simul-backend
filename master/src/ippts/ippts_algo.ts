import {
  PrankArray,
  PrankArrayElem,
  PredictCostMatrix as PCM,
  RankPcmArray,
  LhetMatrix,
  ServerAssArray,
  ServerAssMap,
  EftMatrixMap,
  LheadMatrixMap,
} from "../types/ipptstypes";
import { SlaveServer, Task } from "../../../common/src/types/basetypes";
import {
  TaskGraphAdjMatrix,
  ComputationCostMatrix,
  ComputationCost,
  TaskGraphAdjMatrixMap,
} from "../../../common/src/types/inittypes";

import {
  calculatePCM,
  calculateRankPcms,
  calculatePranks,
  calculateLhetMat,
  getImmediateSuccessorTasks,
} from "./ippts";

import { MaxPriorityQueue } from "datastructures-js";

// utility functions

const serverAssMapToArray = (sam: ServerAssMap): ServerAssArray => {
  const ntasks: number = Object.keys(sam).length;
  let saa: ServerAssArray = [];

  for (let i = 0; i < ntasks; i++) {
    saa.push(sam[i]);
  }

  return saa;
};

// Convert a task graph map (mapppish type) to arrayish type
// TODO: refactor to use generics and club with other similar funcs
const taskGraphMapToArray = (
  taskGraphMap: TaskGraphAdjMatrixMap
): TaskGraphAdjMatrix => {
  const ntasks: number = Object.keys(taskGraphMap).length;
  let taskGraphArr: TaskGraphAdjMatrix = [];

  for (let i = 0; i < ntasks; i++) {
    taskGraphArr.push(taskGraphMap[i]);
  }

  return taskGraphArr;
};

/* Returns a graph where the directed edges are reversed */
const createPredecessorGraph = (
  taskGraph: TaskGraphAdjMatrix
): TaskGraphAdjMatrix => {
  let predGraph: TaskGraphAdjMatrixMap = <TaskGraphAdjMatrixMap>{};
  let ntasks: number = taskGraph.length;

  // initialize the map first:
  for (let i = 0; i < ntasks; i++) {
    predGraph[i] = taskGraph[i];

    // clear all communication weights to 0
    for (let j = 0; j < predGraph[i].commCosts.length; i++) {
      predGraph[i].commCosts[j].weight = 0;
    }
  }

  // update weights with edge directions reversed
  taskGraph.forEach(({ task: ti, commCosts: tiTo }) => {
    tiTo.forEach(({ task: tj, weight: wt }) => {
      // add reverse edge
      predGraph[tj.taskId].commCosts[ti.taskId] = tiTo[tj.taskId];
    });
  });

  return taskGraphMapToArray(predGraph);
};

/* Ensure that the task graph passed to this function has the edges reversed 
   The successor tasks in a predecessor graph would be the predecessor tasks. */
const getImmediatePredecessorTasks = (
  reverseTaskGraph: TaskGraphAdjMatrix,
  taskId: number
): Array<Task> => getImmediateSuccessorTasks(reverseTaskGraph, taskId);

// IPPTS algorithm

export function assignTasksToServers(
  taskGraph: TaskGraphAdjMatrix,
  compCostMat: ComputationCostMatrix
): ServerAssArray {
  let sam: ServerAssMap = <ServerAssMap>{};
  let pcm: PCM = calculatePCM(taskGraph, compCostMat);
  let rankPcmArr: RankPcmArray = calculateRankPcms(pcm);
  let prankArr: PrankArray = calculatePranks(rankPcmArr, taskGraph);
  let lhetMat: LhetMatrix = calculateLhetMat(pcm, compCostMat);
  let predecessorGraph: TaskGraphAdjMatrix = createPredecessorGraph(taskGraph);

  let ntasks = pcm.length;
  let nservers = pcm[0].predictedCosts.length;

  let taskQ: MaxPriorityQueue<PrankArrayElem> =
    new MaxPriorityQueue<PrankArrayElem>({
      priority: (taskElem: PrankArrayElem) => taskElem.prank,
    });

  taskQ.enqueue(prankArr[0]); // enqueue first task

  let eftMatMap: EftMatrixMap = <EftMatrixMap>{};
  let lheadEftMatMap: LheadMatrixMap = <LheadMatrixMap>{};

  // find the successor tasks of each task:
  let successorTasks: Map<number, { task: Task; successors: Array<Task> }> =
    new Map<number, { task: Task; successors: Array<Task> }>();

  // fill the successorTasks map
  pcm.forEach(({ task: task }) => {
    successorTasks[task.taskId] = {
      task: task,
      successors: getImmediateSuccessorTasks(taskGraph, task.taskId),
    };
  });

  // find the predecessor tasks of each task
  let predecessorTasks: Map<number, { task: Task; predecessors: Array<Task> }> =
    new Map<number, { task: Task; predecessors: Array<Task> }>();

  // fill the predecessorTasks map
  pcm.forEach(({ task: task }) => {
    predecessorTasks[task.taskId] = {
      task: task,
      predecessors: getImmediatePredecessorTasks(predecessorGraph, task.taskId),
    };
  });

  // -----------------------------------------------------------
  // start assigning processors
  // -----------------------------------------------------------

  // stores the finish time of the last task assigned to each server
  let lastTaskFinishTime: Array<number> = [];

  // initialize it as 0 for all servers
  for (let i: number = 0; i < nservers; i++) {
    lastTaskFinishTime.push(0);
  }

  let isFirstTask: boolean = true;

  while (!taskQ.isEmpty()) {
    let { task: ti } = taskQ.dequeue() as PrankArrayElem;

    // calculate EFT(ti, pj) for j in range [0, nservers]
    if (isFirstTask) {
      isFirstTask = false;
      // for first task, EFTs are same as the computation costs on the servers
      eftMatMap[ti.taskId] = {
        task: ti,
        efts: compCostMat[ti.taskId].compCosts.map((cc: ComputationCost) => {
          return { server: cc.server, eft: cc.cost };
        }),
      };

      lheadEftMatMap[ti.taskId] = {
        task: ti,
        lheads: eftMatMap[ti.taskId].efts.map(({ server: s, eft: eft }) => {
          return {
            server: s,
            lhead: eft + lhetMat[ti.taskId].lhets[s.serverId].lhet,
          };
        }),
      };
    }
    // If not first task:
    else {
      /* Steps to find EFT(ti, sj):

      1. Find maxprev = max(predec efts + commcost respectively for each, same server last task eft + 0), where commcost = 0 when same servers.
      2. EFT(ti, sj) = maxprev + computationcost

      */

      // find the efts of this task:
      let predTasks: Array<Task> = predecessorTasks[ti.taskId];

      eftMatMap[ti.taskId] = { task: ti, efts: [] };

      for (let server = 0; server < nservers; server++) {
        let eft: number;
        let maxEst: number = 0;

        for (let j = 0; j < predTasks.length; j++) {
          let predTaskId: number = predTasks[j].taskId;
          let est: number = eftMatMap[predTaskId].efts[server].eft;

          // if not same server, add communication cost
          if (server != sam[predTaskId].server.serverId) {
            est += taskGraph[predTaskId].commCosts[ti.taskId].weight;
          }

          if (est > maxEst) {
            maxEst = est;
          }
        }

        // also consider same server last task eft
        if (lastTaskFinishTime[server] > maxEst) {
          maxEst = lastTaskFinishTime[server];
        }

        eft = maxEst + compCostMat[ti.taskId].compCosts[server].cost;
        eftMatMap[ti.taskId].efts.push({
          server: compCostMat[ti.taskId].compCosts[server].server,
          eft: eft,
        });
      }
    }

    // find lhead_eft(ti, sj):
    lheadEftMatMap[ti.taskId] = {
      task: ti,
      lheads: eftMatMap[ti.taskId].efts.map(({ server: s, eft: eft }) => {
        return {
          server: s,
          lhead: eft + lhetMat[ti.taskId].lhets[s.serverId].lhet,
        };
      }),
    };

    // find the server with the minimum lheadEft
    // TODO: what about when one or more servers have same lhead?
    let minLheadServer: SlaveServer = lheadEftMatMap[ti.taskId].lheads.reduce(
      (acc, b) => (acc.lhead < b.lhead ? acc : b)
    ).server;

    let eft: number = eftMatMap[ti.taskId].efts[minLheadServer.serverId].eft;
    let w: number =
      compCostMat[ti.taskId].compCosts[minLheadServer.serverId].cost;
    let est: number = eft - w;

    // assign this task to the server with min lhead
    sam[ti.taskId] = { task: ti, server: minLheadServer, est: est, eft: eft };
    lastTaskFinishTime[minLheadServer.serverId] = eft;

    // push successor tasks of ti into the priority queue
    successorTasks[ti.taskId].successors.forEach((successor: Task) => {
      // note that the priority queue stores tasks as PrankArrayElem
      taskQ.enqueue(prankArr[ti.taskId] as PrankArrayElem);
      // 'as' typecast is not needed but here just for making it self-documenting code
    });
  }

  return serverAssMapToArray(sam);
}
