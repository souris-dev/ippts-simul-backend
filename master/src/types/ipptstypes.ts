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

// A mappish version of EftMatrix interface for convenience
export interface EftMatrixMap extends Map<number, EftMatrixElem> {
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

/* Lhead_eft Matrix. It has the same shape as the EFT matrix (arrayish).*/

export interface LheadMatrix extends Array<LheadMatrixElem> {
  [taskId: number]: LheadMatrixElem;
}

// A mappish version too for convenience, if needed
export interface LheadMatrixMap extends Map<number, LheadMatrixElem> {
  [taskId: number]: LheadMatrixElem;
}

export interface LheadMatrixElem {
  task: basetypes.Task;
  lheads: LheadMatrixWeightElems;
}

interface LheadMatrixWeightElems extends Array<LheadMatrixWeightElem> {
  [server: number]: LheadMatrixWeightElem;
}

export interface LheadMatrixWeightElem {
  server: basetypes.SlaveServer;
  lhead: number;
}

/* Shape of the ServerAssArray (arrayish) will be as follows:
Note: i/of stands for "instance of type"
[
  {
    task: i/of basetypes.Task,
    server: i/of basetypes.SlaveServer,
    est: number,
    eft: number
  },
  ...
]

Shape of ServerAssMap (mappish) is:
{
  0: {
    task: i/of basetypes.Task,
    server: i/of basetypes.SlaveServer,
    est: number,
    eft: number
  },
  ...
}
*/

/* IMPORTANT NOTE:
The ServerAssArray (arrayish) has the tasks in 
the order of selection and assignment, so its "keys" are actually
the order of execution (i.e., ordered by start time of the task) during the IPPTS algorithm. 

For the ServerAssMap (mappish), the keys are instead the
taskIds for the tasks assigned to the processors. */

export interface ServerAssArray extends Array<ServerAss> {
  [taskOrder: number]: ServerAss;
}

export class ServerAssMap extends Map<number, ServerAss> {
  [taskId: number]: ServerAss;
}

export class ServerAss {
  task: basetypes.Task;
  server: basetypes.SlaveServer;
  est: number; // estimated start time
  eft: number; // estimated finish time
}
