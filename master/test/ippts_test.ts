import {
  TaskGraphAdjMatrix,
  ComputationCostMatrix,
} from "../../common/src/types/inittypes";

import {
  PredictCostMatrix,
  PrankArray,
  RankPcmArray,
} from "../src/types/ipptstypes";

import * as ip from "../src/ippts/ippts";

import * as taskGraphInput from "./test_data/test_inp_taskgraph.json";
import * as ccMatInput from "./test_data/test_inp_ccmat.json";

import * as pcmOut from "./test_data/test_out_pcm.json";
import * as rankPcmOut from "./test_data/test_out_rankpcm.json";
import * as prankOut from "./test_data/test_out_prank.json";

import { expect } from "chai";

/* Load test input data */
const taskGraphMat: TaskGraphAdjMatrix = taskGraphInput;
const compCostSample: ComputationCostMatrix = ccMatInput;

/* Load test output data */
const outPcm: PredictCostMatrix = pcmOut;
const outRankPcm: RankPcmArray = rankPcmOut;
const outPranks: PrankArray = prankOut;

describe("Calculation of PCM, rankPCM and Pranks: ", () => {
  var pcm: PredictCostMatrix;
  var rankPcm: RankPcmArray;

  it("Is PCM correct", () => {
    pcm = ip.calculatePCM(taskGraphMat, compCostSample);
    expect(pcm).to.deep.equal(outPcm);
  });

  it("Are rankPCMs correct", () => {
    rankPcm = ip.calculateRankPcm(pcm);
    expect(rankPcm).to.deep.equal(outRankPcm);
  });

  it("Are Pranks correct", () => {
    var prankMat: PrankArray = ip.calculatePrank(rankPcm, taskGraphMat);
    expect(prankMat).to.deep.equal(outPranks);
  });
});
