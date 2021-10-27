import * as basetypes from "./basetypes";

/* Computation cost matrix is of the shape:
[
  {
    task: instance of basetypes.Task,
    compcosts: [
        { server: i/of basetypes.SlaveServer, cost: number },
        { server: i/of basetypes.SlaveServer, cost: number },
        { server: i/of basetypes.SlaveServer, cost: number },
    ]
  },
  ...
]
*/

export interface ComputationCost {
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
[
  {
    task: i/of basetypes.Task,
    commCosts: [
        { task: i/of basetypes.Task, weight: number },
        { task: i/of basetypes.Task, weight: number },
        { task: i/of basetypes.Task, weight: number },
        ...
    ]
  },
    ...
]
*/

export interface CommCost {
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

// For convenience, a mappish version of the above
export interface TaskGraphAdjMatrixMap extends Map<number, TaskGraphAdjMatrixElem> {
  [taskId: number]: TaskGraphAdjMatrixElem;
}