import {
  TaskGraphAdjMatrix,
  ComputationCostMatrix,
} from "../../common/src/types/inittypes";

import {
  PredictCostMatrix,
  PrankArray,
  RankPcmArray,
  ServerAssArray,
} from "../src/types/ipptstypes";

import * as ip from "../src/ippts/ippts";
import * as ipalgo from "../src/ippts/ippts_algo"

import * as taskGraphInput from "./test_data/test_inp_taskgraph.json";
import * as ccMatInput from "./test_data/test_inp_ccmat.json";

import * as pcmOut from "./test_data/test_out_pcm.json";
import * as rankPcmOut from "./test_data/test_out_rankpcm.json";
import * as prankOut from "./test_data/test_out_prank.json";

import { expect } from "chai";
import { inspect } from "util";

/* Load test input data */
const taskGraphMat: TaskGraphAdjMatrix = taskGraphInput;
const compCostSample: ComputationCostMatrix = ccMatInput;

let sam: ServerAssArray = ipalgo.assignTasksToServers(taskGraphMat, compCostSample);

console.log(inspect(sam, { depth: null }))