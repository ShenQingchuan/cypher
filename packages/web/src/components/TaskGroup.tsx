import type { TaskGroup as TaskGroupType } from '../types'
import { AlertCircle, Check, Clock } from 'lucide-react'
import React from 'react'

interface TaskGroupProps {
  group: TaskGroupType
}

const TaskGroup: React.FC<TaskGroupProps> = ({ group }) => {
  // 根据状态获取颜色
  const getStatusColor = () => {
    switch (group.status) {
      case 'pending': return 'bg-warning-100 border-warning text-warning-700'
      case 'running': return 'bg-primary-100 border-primary text-primary-700'
      case 'completed': return 'bg-success-100 border-success text-success-700'
      default: return 'bg-gray-100 border-gray-300 text-gray-700'
    }
  }

  // 获取状态图标
  const StatusIcon = () => {
    switch (group.status) {
      case 'pending': return <Clock className="w-5 h-5 text-warning" />
      case 'running': return <AlertCircle className="w-5 h-5 text-primary animate-pulse" />
      case 'completed': return <Check className="w-5 h-5 text-success" />
      default: return null
    }
  }

  return (
    <div className={`rounded-lg border-2 p-4 mb-4 ${getStatusColor()}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <StatusIcon />
          <h3 className="text-lg font-medium ml-2">{group.name}</h3>
        </div>
        <div className="text-sm">
          {group.completedTasks}
          /
          {group.totalTasks}
          {' '}
          任务完成
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            group.status === 'completed'
              ? 'bg-success'
              : group.status === 'running'
                ? 'bg-primary'
                : 'bg-warning'
          }`}
          style={{ width: `${group.progress}%` }}
        />
      </div>

      <div className="mt-3 space-y-2">
        {group.tasks.map(task => (
          <div key={task.id} className="flex items-center text-sm">
            {task.completed
              ? <Check className="w-4 h-4 text-success mr-2" />
              : <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-2" />}
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.type}
              {' '}
              埋点任务
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskGroup
