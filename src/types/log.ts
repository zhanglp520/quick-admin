export interface Log {
  id: string | undefined
  type: number
  ip: string
  request: string
  response: string
  execution?: string
  duration: number
  operateId: string
  createTime: string
}
export interface SearchLog {
  startTime?: string
  endTime?: string
  logTime: string
}
