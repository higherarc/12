'use client'

import { TaskWithDetails, User } from '@/types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: TaskWithDetails[]
  onTaskUpdate: (taskId: string, updates: any) => void
  onTaskDelete: (taskId: string) => void
  users: User[]
}

export default function TaskList({ tasks, onTaskUpdate, onTaskDelete, users }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-500 text-lg">작업이 없습니다</div>
        <div className="text-gray-400 text-sm mt-2">새로운 작업을 추가해보세요</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
          users={users}
        />
      ))}
    </div>
  )
}
