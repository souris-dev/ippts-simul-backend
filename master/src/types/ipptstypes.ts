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
// Note: For the sake of uniformity, all matrices extend Array
export interface PredictCostMatrix extends Array<PredictCostMatrixElem> {
  [taskId: number]: PredictCostMatrixElem;
}

// This interface has been made to aid in computation
// For other puposes, use PredictCostMatrix
export interface PredictCostMatrixMap
  extends Map<number, PredictCostMatrixElem> {
  [taskId: number]: PredictCostMatrixElem;
}

export interface PredictCostMatrixElem {
  task: basetypes.Task;
  predictedCosts: PredictedCostWeights;
}

interface PredictedCostWeights extends Array<PredictCostMatrixWeightElem> {
  [server: number]: PredictCostMatrixWeightElem;
}

export interface PredictCostMatrixWeightElem {
  server: basetypes.SlaveServer;
  predictedCost: number;
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

export interface PrankArray extends Array<PrankArrayElem> {
  [taskId: number]: PrankArrayElem;
}

export interface PrankArrayElem {
  task: basetypes.Task;
  prank: number;
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

export interface RankPcmArray extends Array<RankPcmArrayElem> {
  [taskId: number]: RankPcmArrayElem;
}

export interface RankPcmArrayElem {
  task: basetypes.Task;
  rankPcm: number;
}

/* Lhet Matrix. The shape for this matrix is same 
as that of PredictCostMatrix (arrayish) */

export interface LhetMatrix extends Array<LhetMatrixElem> {
  [taskId: number]: LhetMatrixElem;
}

export interface LhetMatrixElem {
  task: basetypes.Task;
  lhets: LhetMatrixWeightElems;
}

interface LhetMatrixWeightElems extends Array<LhetMatrixWeightElem> {
  [server: number]: LhetMatrixWeightElem;
}

export interface LhetMatrixWeightElem {
  server: basetypes.SlaveServer;
  lhet: number;
}

/* EFT Matrix. The shape for this matrix is same 
as that of PredictCostMatrix (arrayish) */

export interface EftMatrix extends Array<EftMatrixElem> {
  [taskId: number]: EftMatrixElem;
}

export interface EftMatrixElem {
  task: basetypes.Task;
  efts: EftMatrixWeightElems;
}

interface EftMatrixWeightElems extends Array<EftMatrixWeightElem> {
  [server: number]: EftMatrixWeightElem;
}

export interface EftMatrixWeightElem {
  server: basetypes.SlaveServer;
  eft: number;
}