import {
  TaskGraphAdjMatrix,
  ComputationCostMatrix,
  ServerAssArray,
} from "../../common/src/types/inittypes";

import * as ipalgo from "../src/ippts/ippts_algo";

import * as taskGraphInput from "./test_data/test_inp_taskgraph.json";
import * as ccMatInput from "./test_data/test_inp_ccmat.json";
import * as serverAssignOut from "./test_data/test_out_serverassign.json";

import { inspect } from "util";
import { expect } from "chai";

/* Load test input data */
const taskGraphMat: TaskGraphAdjMatrix = taskGraphInput;
const compCostSample: ComputationCostMatrix = ccMatInput;
const serverAssignOutArr: ServerAssArray = serverAssignOut as ServerAssArray;

describe("Computation of server task assignment array: ", () => {
  it("Server assignments correct and in right order", () => {
    let sam: ServerAssArray = ipalgo.assignTasksToServers(taskGraphMat, compCostSample);
    expect(sam).to.deep.equal(serverAssignOutArr);
  })
})
