import type { TaskGroup, TrackerTask } from '../types'
import * as tracker from './tracker'

// 创建任务组
export function createTaskGroups(): TaskGroup[] {
  return [
    {
      id: 1,
      name: '页面加载任务组',
      status: 'pending',
      progress: 0,
      totalTasks: 3,
      completedTasks: 0,
      tasks: [
        { id: 1, type: 'page-view', data: { pageName: '首页' }, completed: false },
        { id: 2, type: 'custom', data: { eventName: 'app-init' }, completed: false },
        { id: 3, type: 'custom', data: { eventName: 'user-ready' }, completed: false },
      ],
    },
    {
      id: 2,
      name: '用户交互任务组',
      status: 'pending',
      progress: 0,
      totalTasks: 4,
      completedTasks: 0,
      tasks: [
        { id: 4, type: 'header-click', data: { elementId: 'nav-home' }, completed: false },
        { id: 5, type: 'button-click', data: { elementId: 'btn-search' }, completed: false },
        { id: 6, type: 'form-submit', data: { formId: 'search-form' }, completed: false },
        { id: 7, type: 'error', data: { errorType: 'api-error' }, completed: false },
      ],
    },
    {
      id: 3,
      name: '订单流程任务组',
      status: 'pending',
      progress: 0,
      totalTasks: 3,
      completedTasks: 0,
      tasks: [
        { id: 8, type: 'order-start', data: { orderId: 'ORD-001' }, completed: false },
        { id: 9, type: 'button-click', data: { elementId: 'btn-pay' }, completed: false },
        { id: 10, type: 'order-complete', data: { orderId: 'ORD-001' }, completed: false },
      ],
    },
  ]
}

// 执行任务
export async function executeTask(task: TrackerTask): Promise<void> {
  try {
    switch (task.type) {
      case 'page-view':
        await tracker.trackPageView(task.data.pageName)
        break
      case 'header-click':
        await tracker.trackClick('header', task.data.elementId)
        break
      case 'button-click':
        await tracker.trackClick('button', task.data.elementId)
        break
      case 'order-start':
        await tracker.trackOrder('start', task.data.orderId)
        break
      case 'order-complete':
        await tracker.trackOrder('complete', task.data.orderId, 99.99)
        break
      case 'form-submit':
        await tracker.trackFormSubmit(task.data.formId, { query: 'test' })
        break
      case 'error':
        await tracker.trackError(task.data.errorType, 'An error occurred')
        break
      case 'custom':
        await tracker.trackCustomEvent(task.data.eventName, task.data)
        break
      default:
        console.warn(`未知任务类型: ${task.type}`)
    }
  }
  catch (error) {
    console.error(`执行任务失败: ${task.id}`, error)
    throw error
  }
}

// 更新任务组状态
export function updateTaskGroupStatus(
  group: TaskGroup,
  taskId: number,
  completed: boolean,
): TaskGroup {
  const updatedTasks = group.tasks.map(task =>
    task.id === taskId ? { ...task, completed } : task,
  )

  const completedCount = updatedTasks.filter(t => t.completed).length
  const progress = Math.round((completedCount / group.totalTasks) * 100)

  let status: 'pending' | 'running' | 'completed' = group.status
  if (completedCount === 0) {
    status = 'pending'
  }
  else if (completedCount === group.totalTasks) {
    status = 'completed'
  }
  else {
    status = 'running'
  }

  return {
    ...group,
    tasks: updatedTasks,
    completedTasks: completedCount,
    progress,
    status,
  }
}
