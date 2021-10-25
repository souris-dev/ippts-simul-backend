import { PredictCostMatrix as PCM } from "../types/ipptstypes";
import { Task } from "../../../common/src/types/basetypes";
import {
  TaskGraphAdjMatrix,
  ComputationCostMatrix,
} from "../../../common/src/types/inittypes";

/* Makes the PCM from the given taskGraph and Computation Cost Matrix */

export function generatePCM(
  taskGraph: TaskGraphAdjMatrix,
  computationCostMat: ComputationCostMatrix
): PCM {
  let pcm: PCM;
  let ntasks = taskGraph.length;
  let nservers = computationCostMat[0].compCosts.length;

  // start from the last task (bottom up)
  taskGraph.reverse().forEach((ti, taskId: number): void => {
    if (taskId == ntasks - 1) {
      // last task
      // set the values as equal to those in the computation matrix
      // for the last task (exit task)

      pcm.push({
        task: ti.task,
        predictedCosts: computationCostMat[taskId].compCosts.map((compCost) => {
          return { server: compCost.server, predictedCost: compCost.cost };
        }),
      });

      return;
    }

    // not last task

    let successorTasks: Array<Task>;

    // find the successor tasks (i.e, neighbours)
    ti.commCosts.forEach((elem, taskId: number): void => {
      if (elem.weight > 0) {
        successorTasks.push(elem.task);
      }
    });

    // initialize an entry in the PCM matrix
    pcm[ti.task.taskId] = { task: ti.task, predictedCosts: [] };

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
              pcm[tk.taskId][sy] +
              computationCostMat[ti.task.taskId][sy] +
              computationCostMat[tk.taskId][sy];

            // if sj == sy, then c_ik = 0 (add nothing to value above)
            // else add the edge value from task graph

            if (sj != sy) {
              value += taskGraph[ti.task.taskId][tk.taskId];
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
      pcm[ti.task.taskId].predictedCosts.push({
        // I needed to get the server object from somewhere, so:
        server: computationCostMat[ti.task.taskId].compCosts[sj].server,
        predictedCost: sjMaxVal,
      });
    }
  });

  return pcm;
}
