// 埋点记录类型
export type RecordType =
  | 'page-view'
  | 'header-click'
  | 'order-start'
  | 'order-complete'
  | 'button-click'
  | 'form-submit'
  | 'error'
  | 'custom'

// 埋点请求体数据结构
export interface RequestBodyData {
  type: RecordType
  data: any
  timestamp?: number
  userId?: string
  sessionId?: string
}

// 任务组
export interface TaskGroup {
  id: number
  name: string
  status: 'pending' | 'running' | 'completed'
  progress: number
  totalTasks: number
  completedTasks: number
  tasks: TrackerTask[]
}

// 追踪任务
export interface TrackerTask {
  id: number
  type: RecordType
  data: any
  completed: boolean
}
