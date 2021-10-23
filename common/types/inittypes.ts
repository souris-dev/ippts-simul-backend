import * as basetypes from "./basetypes"

type ComputationCostMatrix = Array<ComputationCost>

interface ComputationCost {
    task: basetypes.Task,
    server: basetypes.SlaveServer,
    cost: number
}

type TaskGraphAdjMatrix = Array<TaskGraphAdjMatrixEntry>

interface TaskGraphAdjMatrixEntry {
    task: basetypes.Task,
    weights: Array<{
        task: basetypes.Task,
        weight: number
    }>
}
