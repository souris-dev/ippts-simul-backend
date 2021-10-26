import {
  PrankArray,
  PrankArrayElem,
  PredictCostMatrix as PCM,
  PredictCostMatrixMap,
  PredictCostMatrixWeightElem,
  PredictCostMatrixElem,
  RankPcmArray,
  RankPcmArrayElem,
} from "../types/ipptstypes";
import { Task } from "../../../common/src/types/basetypes";
import {
  TaskGraphAdjMatrix,
  ComputationCostMatrix,
} from "../../../common/src/types/inittypes";

// util functions

const getSuccessorTasks = (
  taskGraph: TaskGraphAdjMatrix,
  taskId: number
): Array<Task> => {
  // find the successor tasks (i.e, neighbours)
  let successorTasks: Array<Task> = [];

  taskGraph[taskId].commCosts.forEach((elem): void => {
    if (elem.weight > 0) {
      successorTasks.push(elem.task);
    }
  });

  return successorTasks;
};

/* Convert a PredictCostMatrixMap (mappish) to PredictCostMatrix (arrayish) */
/* The mapPcm keys need not be in the correct order */
const mapPcmToArrayPcm = (mapPcm: PredictCostMatrixMap): PCM => {
  // mapPcm.size is not working for some weird reason
  const ntasks: number = Object.keys(mapPcm).length
  let pcm: PCM = [];

  for (let i = 0; i < ntasks; i++) {
    pcm.push(mapPcm[i]);
  }

  return pcm;
};

/* Makes the PCM from the given taskGraph and Computation Cost Matrix */

export function calculatePCM(
  taskGraph: TaskGraphAdjMatrix,
  computationCostMat: ComputationCostMatrix
): PCM {
  // this mapPcm will be converted to a PCM 2D array in the end
  let mapPcm: PredictCostMatrixMap = <PredictCostMatrixMap>{};
  const ntasks = taskGraph.length;
  const nservers = computationCostMat[0].compCosts.length;

  // start from the last task (bottom up)
  // slice() is used to create a copy
  // otherwise, its reference is stored
  const reverseGraph: TaskGraphAdjMatrix = taskGraph.reverse().slice();
  taskGraph.reverse(); // reverse it back again

  // reverseGraph's indices are now inconsistent with the actual
  // taskIds of the objects inside, so do not use them

  reverseGraph.forEach((ti): void => {
    // note that we cannot take the second argument of this function
    // as the real taskId because this is the reversed graph


    if (ti.task.taskId == ntasks - 1) {
      // exit task
      // set the values as equal to those in the computation matrix
      // for the last task (exit task)

      mapPcm[ti.task.taskId] = {
        task: ti.task,
        predictedCosts: computationCostMat[ti.task.taskId].compCosts.map(
          (compCost) => {
            return { server: compCost.server, predictedCost: compCost.cost };
          }
        ),
      };

      return;
    }

    // if we're here, then it's not the exit task
    let successorTasks: Array<Task> = getSuccessorTasks(
      taskGraph,
      ti.task.taskId
    );

    // initialize an entry in the PCM matrix
    mapPcm[ti.task.taskId] = { task: ti.task, predictedCosts: [] };

    // find PCM(ti, sj) for each server sj given a task ti

    for (let sj: number = 0; sj < nservers; sj++) {
      // Functional js/ts looks funny doesn't it? :-))
      let sjMaxVal: number = Math.max(
        ...successorTasks.map((tk: Task, tkId: number): number => {
          let innerMin: number = Number.MAX_VALUE;

          // everything functional is weirding me out

          // instead of gamma, I'm using y here
          for (let sy = 0; sy < nservers; sy++) {

            let value: number =
              mapPcm[tk.taskId].predictedCosts[sy].predictedCost +
              computationCostMat[ti.task.taskId].compCosts[sy].cost +
              computationCostMat[tk.taskId].compCosts[sy].cost;

            // if sj == sy, then c_ik = 0 (add nothing to value above)
            // else add the edge value from task graph

            if (sj != sy) {
              value += taskGraph[ti.task.taskId].commCosts[tk.taskId].weight;
            }

            // update the inner minimum
            if (value < innerMin) {
              innerMin = value;
            }
          }

          return innerMin;
        })
      );

      // add the predicted cost for this server into the matrix
      mapPcm[ti.task.taskId].predictedCosts.push({
        // I needed to get the server object from somewhere, so:
        server: computationCostMat[ti.task.taskId].compCosts[sj].server,
        predictedCost: sjMaxVal,
      });
    }
  });

  // since we have inserted them in reverse order
  // reverse it so that the array indices are consistent
  // with the inner taskIds.

  let pcm: PCM = mapPcmToArrayPcm(mapPcm);
  return pcm;
}

export function calculateRankPcm(pcm: PCM): RankPcmArray {
  let rankPcmArray: RankPcmArray = [];
  let nservers: number = pcm[0].predictedCosts.length;

  rankPcmArray = pcm.map((matTaskElem, taskId: number): RankPcmArrayElem => {
    // functional js looks weird doesn't it, lol
    // this just sums values (for each server) the PCM entry for a task
    // and divides by the number of servers
    
    let rankPcm: number =
      matTaskElem.predictedCosts.reduce(
        (acc: number, b: PredictCostMatrixWeightElem): number =>
          acc + b.predictedCost,
        0
      ) / nservers;

    return { task: matTaskElem.task, rankPcm: rankPcm };
  });

  return rankPcmArray;
}

export function calculatePrank(
  rankPcmArr: RankPcmArray,
  taskGraph: TaskGraphAdjMatrix
): PrankArray {
  let prankArr: PrankArray = [];

  prankArr = rankPcmArr.map(
    (rankPcmArrayElem, taskId: number): PrankArrayElem => {
      return {
        task: rankPcmArrayElem.task,

        // recall that outd(ti) = number of successor tasks of ti
        prank:
          rankPcmArrayElem.rankPcm *
          getSuccessorTasks(taskGraph, rankPcmArrayElem.task.taskId).length,
      };
    }
  );

  return prankArr;
}
