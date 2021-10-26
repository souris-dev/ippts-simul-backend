import * as basetypes from "../../../common/src/types/basetypes";

/* Predict cost matrix will be of the shape:
[
  {
    task: basetypes.Task,
    predictedCosts: [
      { server: instance of basetypes.Server, predictedCost: 3 },
      { server: instance of basetypes.Server, predictedCost: 5 },
      { server: instance of basetypes.Server, predictedCost: 2 }
    ]
  },
  ...
]
*/

export interface PredictCostMatrixWeightElem {
  server: basetypes.SlaveServer;
  predictedCost: number;
}

interface PredictedCostWeights extends Array<PredictCostMatrixWeightElem> {
  [server: number]: PredictCostMatrixWeightElem;
}

export interface PredictCostMatrixElem {
  task: basetypes.Task;
  predictedCosts: PredictedCostWeights;
}

// Note: For the sake of uniformity, all matrices extend Array
export interface PredictCostMatrix extends Array<PredictCostMatrixElem> {
  [taskId: number]: PredictCostMatrixElem;
}

// This interface has been made to aid in computation
// For other puposes, use PredictCostMatrix
export interface PredictCostMatrixMap extends Map<number, PredictCostMatrixElem> {
  [taskId: number]: PredictCostMatrixElem;
}


/* Shape of PrankArray:
(Note: i/of stands for "instance of type")
[
  {
    task: i/of basetypes.Task,
    prank: number
  },
  ...
]*/

export interface PrankArrayElem {
  task: basetypes.Task;
  prank: number;
}

export interface PrankArray extends Array<PrankArrayElem> {
  [taskId: number]: PrankArrayElem;
}

/* Shape of RankPcmArray:
(Note: i/of stands for "instance of type")
[
  {
    task: i/of basetypes.Task,
    rankPcm: number
  },
  ...
]*/
export interface RankPcmArrayElem {
  task: basetypes.Task;
  rankPcm: number;
}

export interface RankPcmArray extends Array<RankPcmArrayElem> {
  [taskId: number]: RankPcmArrayElem;
}
