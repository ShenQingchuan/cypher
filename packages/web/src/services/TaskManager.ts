import type { TaskGroup, TrackerTask } from '../types'
import { executeTask, updateTaskGroupStatus } from './taskScheduler'

// 任务管理器事件数据类型
export interface TaskManagerEventData {
  statusChange: {
    taskGroups?: TaskGroup[]
    isRunning?: boolean
  }
  taskStart: {
    groupId: number
    taskId: number
    task: TrackerTask
  }
  taskComplete: {
    groupId: number
    taskId: number
    task: TrackerTask
    group: TaskGroup
  }
  groupStart: {
    groupId: number
    group: TaskGroup
  }
  groupComplete: {
    groupId: number
    group: TaskGroup
  }
  allComplete: Record<string, never> // 空对象
}

// 任务管理器事件类型
export type TaskManagerEventType = keyof TaskManagerEventData

// 任务管理器事件监听器
export type TaskManagerEventListener =
  (data: TaskManagerEventData[TaskManagerEventType]) => void

/**
 * 任务管理器类 - 负责管理和执行埋点任务
 */
export class TaskManager {
  private taskGroups: TaskGroup[] = []
  private isRunning: boolean = false
  private eventListeners: Map<TaskManagerEventType, Array<TaskManagerEventListener>> = new Map()

  // 初始化任务组
  constructor(initialGroups?: TaskGroup[]) {
    if (initialGroups) {
      this.taskGroups = [...initialGroups]
    }

    // 初始化事件监听器映射
    const eventTypes: TaskManagerEventType[] = [
      'taskStart',
      'taskComplete',
      'groupStart',
      'groupComplete',
      'allComplete',
      'statusChange',
    ]

    eventTypes.forEach((type) => {
      this.eventListeners.set(type, [])
    })
  }

  // 获取所有任务组
  public getTaskGroups(): TaskGroup[] {
    return [...this.taskGroups]
  }

  // 获取运行状态
  public isTaskRunning(): boolean {
    return this.isRunning
  }

  // 初始化/重置任务组
  public resetTaskGroups(groups: TaskGroup[]): void {
    this.taskGroups = [...groups]
    this.triggerEvent('statusChange', { taskGroups: this.taskGroups })
  }

  // 添加事件监听器
  public addEventListener(
    eventType: TaskManagerEventType,
    listener: TaskManagerEventListener,
  ): void {
    const listeners = this.eventListeners.get(eventType) || []
    listeners.push(listener)
    this.eventListeners.set(eventType, listeners)
  }

  // 移除事件监听器
  public removeEventListener(
    eventType: TaskManagerEventType,
    listener: TaskManagerEventListener,
  ): void {
    const listeners = this.eventListeners.get(eventType) || []
    const index = listeners.indexOf(listener)
    if (index !== -1) {
      listeners.splice(index, 1)
      this.eventListeners.set(eventType, listeners)
    }
  }

  // 触发事件
  private triggerEvent(
    eventType: TaskManagerEventType,
    data: TaskManagerEventData[TaskManagerEventType],
  ): void {
    const listeners = this.eventListeners.get(eventType) || []
    listeners.forEach(listener => listener(data))
  }

  // 更新任务组
  private updateTaskGroup(index: number, updatedGroup: TaskGroup): void {
    if (index >= 0 && index < this.taskGroups.length) {
      this.taskGroups = [
        ...this.taskGroups.slice(0, index),
        updatedGroup,
        ...this.taskGroups.slice(index + 1),
      ]
      this.triggerEvent('statusChange', { taskGroups: this.taskGroups })
    }
  }

  // 开始执行所有任务组
  public async startAllTasks(): Promise<void> {
    if (this.isRunning) {
      console.log('任务已在运行中，无法再次启动')
      return
    }

    console.log('开始执行所有任务组')
    this.isRunning = true
    this.triggerEvent('statusChange', { isRunning: true })

    // 按照不同延迟启动三个任务组
    await Promise.all([
      this.scheduleTaskGroup(1, 0), // 立即执行第一组
      this.scheduleTaskGroup(2, 2500), // 2.5秒后执行第二组
      this.scheduleTaskGroup(3, 5000), // 5秒后执行第三组
    ])

    // 所有任务组完成后
    console.log('所有任务组完成')
    this.isRunning = false
    this.triggerEvent('allComplete', {})
    this.triggerEvent('statusChange', { isRunning: false })
  }

  // 调度任务组执行
  private async scheduleTaskGroup(groupId: number, delay: number): Promise<void> {
    // 等待指定延迟
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    // 如果已经停止运行，不继续执行
    if (!this.isRunning)
      return

    // 执行任务组
    await this.executeTaskGroup(groupId)
  }

  // 执行单个任务组
  private async executeTaskGroup(groupId: number): Promise<void> {
    console.log(`准备执行任务组 ${groupId}`)

    // 查找任务组
    const groupIndex = this.taskGroups.findIndex(g => g.id === groupId)
    if (groupIndex === -1) {
      console.log(`找不到任务组 ${groupId}`)
      return
    }

    // 获取任务组
    const group = this.taskGroups[groupIndex]

    // 如果任务组已经完成，不再执行
    if (group.status === 'completed') {
      console.log(`任务组 ${groupId} 已完成，跳过执行`)
      return
    }

    // 更新任务组状态为运行中
    const updatedGroup = {
      ...group,
      status: 'running' as const,
    }
    this.updateTaskGroup(groupIndex, updatedGroup)

    // 触发任务组开始事件
    this.triggerEvent('groupStart', { groupId, group: updatedGroup })

    // 执行所有未完成的任务
    for (const task of group.tasks) {
      // 如果已停止运行或任务已完成，跳过
      if (!this.isRunning || task.completed)
        continue

      try {
        // 触发任务开始事件
        this.triggerEvent('taskStart', { groupId, taskId: task.id, task })

        // 执行任务
        console.log(`执行任务 ${task.id}, 类型: ${task.type}`)
        await executeTask(task)

        // 更新任务状态
        const taskGroup = this.taskGroups[groupIndex]
        const updatedTaskGroup = updateTaskGroupStatus(
          taskGroup,
          task.id,
          true,
        )

        // 更新任务组
        this.updateTaskGroup(groupIndex, updatedTaskGroup)

        // 触发任务完成事件
        this.triggerEvent('taskComplete', {
          groupId,
          taskId: task.id,
          task,
          group: updatedTaskGroup,
        })
      }
      catch (error) {
        console.error(`任务执行失败: ${task.id}`, error)
        // 继续执行下一个任务
      }
    }

    // 任务组执行完成
    const finalGroup = this.taskGroups[groupIndex]
    if (finalGroup.status === 'completed') {
      console.log(`任务组 ${groupId} 所有任务已完成`)
      this.triggerEvent('groupComplete', { groupId, group: finalGroup })
    }
  }

  // 停止所有任务
  public stopAllTasks(): void {
    console.log('停止所有任务')
    this.isRunning = false
    this.triggerEvent('statusChange', { isRunning: false })
  }
}
