import type { TaskGroup as TaskGroupType } from './types'
import { useEffect, useRef, useState } from 'react'
import TaskGroup from './components/TaskGroup'
import { TaskManager } from './services/TaskManager'
import { createTaskGroups } from './services/taskScheduler'
import 'virtual:uno.css'
import { TestOneRequest } from './TestOneRequest'

function App() {
  const [taskGroups, setTaskGroups] = useState<TaskGroupType[]>([])
  const [isRunning, setIsRunning] = useState(false)
  // 任务管理器引用
  const taskManagerRef = useRef<TaskManager | null>(null)

  // 初始化任务管理器
  useEffect(() => {
    // 创建任务管理器
    const manager = new TaskManager(createTaskGroups())
    taskManagerRef.current = manager

    // 设置状态更新监听器
    manager.addEventListener('statusChange', (data) => {
      if ('taskGroups' in data && data.taskGroups) {
        setTaskGroups(data.taskGroups)
      }
      if ('isRunning' in data && data.isRunning !== undefined) {
        setIsRunning(data.isRunning)
      }
    })

    // 将初始任务组状态同步到React状态
    setTaskGroups(manager.getTaskGroups())

    // 任务完成时，确保状态更新
    manager.addEventListener('allComplete', () => {
      setIsRunning(false)
    })

    // 500ms后自动开始任务
    const timer = setTimeout(() => {
      console.log('自动开始执行任务')
      manager.startAllTasks()
    }, 500)

    // 组件卸载时清理
    return () => {
      clearTimeout(timer)
      if (taskManagerRef.current) {
        taskManagerRef.current.stopAllTasks()
      }
    }
  }, [])

  // 重置并重新开始执行任务
  const handleRestartTasks = () => {
    if (!taskManagerRef.current)
      return

    const manager = taskManagerRef.current

    // 确保任务已停止
    manager.stopAllTasks()

    // 重置任务组
    manager.resetTaskGroups(createTaskGroups())

    // 延迟一下再开始
    setTimeout(() => {
      manager.startAllTasks()
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">埋点测试应用</h1>
          <p className="text-gray-600">
            此应用模拟发送各类埋点请求，用于测试 Cypher 浏览器插件
          </p>
        </header>

        <TestOneRequest />

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">埋点任务执行状态</h2>

          <div className="space-y-4">
            {taskGroups.map(group => (
              <TaskGroup key={group.id} group={group} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors"
              onClick={handleRestartTasks}
              disabled={isRunning}
            >
              {isRunning ? '任务执行中...' : '重新执行所有任务'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>安装 Cypher 浏览器扩展</li>
            <li>打开浏览器开发者工具</li>
            <li>切换到 Cypher 面板</li>
            <li>观察埋点请求的捕获和分析</li>
            <li>尝试使用过滤功能按埋点类型筛选请求</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App
