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
  ServerAss,
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

import { MaxPriorityQueue, PriorityQueueItem } from "datastructures-js";
import { inspect } from "util";

// utility functions

/* Returns a task-server assignment array, with the
tasks ordered in the order of start times (est), given the order of insertion and a server assignment map. */
const serverAssMapToArray = (
  sam: ServerAssMap,
): ServerAssArray => {
  const ntasks: number = Object.keys(sam).length;
  let saa: ServerAssArray = [];

  for (let taskId = 0; taskId < ntasks; taskId++) {
    saa.push(sam[taskId]);
  }

  // sort in (ascending) order of est
  saa.sort((a: ServerAss, b: ServerAss) => a.est - b.est);

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

  // I freaking need a deep copy of the array
  // js you are a big idiot, why the hell is there no builtin method
  // to deep copy an array!!
  let taskGraphCopy: TaskGraphAdjMatrix = JSON.parse(JSON.stringify(taskGraph));
  // initialize the map first:
  for (let i = 0; i < ntasks; i++) {
    predGraph[i] = taskGraphCopy[i];

    // clear all communication weights to 0
    for (let j = 0; j < predGraph[i].commCosts.length; j++) {
      predGraph[i].commCosts[j].weight = 0;
    }
  }

  // update weights with edge directions reversed
  taskGraph.forEach(({ task: ti, commCosts: tiTo }) => {
    tiTo.forEach(({ task: tj, weight: wt }) => {
      // add reverse edge
      predGraph[tj.taskId].commCosts[ti.taskId] = { task: ti, weight: wt };
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

/*  Performs the IPPTS algorithm.
Returns a task-server assignment array, with the
tasks ordered in the order of assignment. */
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

  // keeps track if a task is already enqueued in the priority queue
  let isEnqd: Map<number, boolean> = new Map<number, boolean>();

  for (let task of taskGraph) {
    isEnqd[task.task.taskId] = false;
  }

  let isFirstTask: boolean = true;

  taskQ.enqueue(prankArr[0]); // enqueue first task
  isEnqd[0] = true;

  while (!taskQ.isEmpty()) {
    let { task: ti } = taskQ.dequeue()["element"] as PrankArrayElem;

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
      let { predecessors: predTasks } = predecessorTasks[ti.taskId];

      eftMatMap[ti.taskId] = { task: ti, efts: [] };

      for (let server = 0; server < nservers; server++) {
        let eft: number;
        let maxEst: number = 0;

        for (let j = 0; j < predTasks.length; j++) {
          let predTaskId: number = predTasks[j].taskId;
          let est: number = sam[predTaskId].eft;

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

    successorTasks[ti.taskId].successors.forEach((successor: Task) => {
      // note that the priority queue stores tasks as PrankArrayElem
      // check if that successor is already inserted in the queue
      // to prevent queueing multiple times
      if (!isEnqd[successor.taskId]) {
        taskQ.enqueue(prankArr[successor.taskId]);
        isEnqd[successor.taskId] = true;
      }
      // 'as' typecast is not needed but here just for making it self-documenting code
    });
  }

  return serverAssMapToArray(sam);
}
