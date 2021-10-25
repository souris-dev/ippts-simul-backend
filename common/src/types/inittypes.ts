import * as basetypes from "./basetypes";

/* Computation cost matrix is of the shape:
{
    0: {
        task: instance of basetypes.Task,
        compcosts: [
            0: { server: i/of basetypes.SlaveServer, cost: number },
            1: { server: i/of basetypes.SlaveServer, cost: number },
            2: { server: i/of basetypes.SlaveServer, cost: number },
        ]
    },
    ...
}
*/

interface ComputationCost {
  server: basetypes.SlaveServer;
  cost: number;
}

interface ComputationCostMatrixWeightsArray extends Array<ComputationCost> {
  [serverId: number]: ComputationCost;
}

interface ComputationCostMatrixElem {
  task: basetypes.Task;
  compCosts: ComputationCostMatrixWeightsArray;
}

export interface ComputationCostMatrix
  extends Array<ComputationCostMatrixElem> {
  [taskId: number]: ComputationCostMatrixElem;
}

/* TaskGraphAdjacencyMatrix is of the shape: 
(note: i/of is short for "instance of type")
{
    0: {
        task: i/of basetypes.Task,
        commCosts: [
            0: { task: i/of basetypes.Task, weight: number },
            1: { task: i/of basetypes.Task, weight: number },
            2: { task: i/of basetypes.Task, weight: number },
            ...
        ]
    },
    ...
}
*/

interface CommCost {
  task: basetypes.Task;
  weight: number;
}

interface CommCostWeightArray extends Array<CommCost> {
  [taskId: number]: CommCost;
}

interface TaskGraphAdjMatrixElem {
  task: basetypes.Task;
  // communication costs:
  commCosts: CommCostWeightArray;
}

export interface TaskGraphAdjMatrix extends Array<TaskGraphAdjMatrixElem> {
  [taskId: number]: TaskGraphAdjMatrixElem;
}
