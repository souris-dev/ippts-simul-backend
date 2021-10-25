import * as basetypes from "../../../common/src/types/basetypes";

/* Predict cost matrix will be of the shape:
{
    0: {
        task: basetypes.Task,
        predictedCosts: [
            0: { server: instance of basetypes.Server, predictedCost: 3 },
            1: { server: instance of basetypes.Server, predictedCost: 5 },
            2: { server: instance of basetypes.Server, predictedCost: 2 }
        ]
    },
    ...
}
*/

interface PredictCostMatrixWeightElem {
  server: basetypes.SlaveServer;
  predictedCost: number;
}

interface PredictedCostWeights extends Array<PredictCostMatrixWeightElem> {
  [server: number]: PredictCostMatrixWeightElem;
}

interface PredictCostMatrixElem {
  task: basetypes.Task;
  predictedCosts: PredictedCostWeights;
}

export interface PredictCostMatrix extends Array<PredictCostMatrixElem> {
  [taskId: number]: PredictCostMatrixElem;
}

interface TaskPrankArrayElem {
  task: basetypes.Task;
  prank: number;
}

export interface TaskPrankArray extends Array<TaskPrankArrayElem> {
  [taskId: number]: TaskPrankArrayElem;
}

interface RankPcmArrayElem {
  task: basetypes.Task;
  rankPcm: number;
}

export interface RankPcmArray extends Array<RankPcmArrayElem> {
  [taskId: number]: RankPcmArrayElem;
}
