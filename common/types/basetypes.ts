export interface Task {
    expression: string,
    taskId: number
}

export interface SlaveServer {
    url: string,
    serverId?: number
}
