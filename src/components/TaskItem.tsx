'use client'

import { useState } from 'react'
import { TaskWithDetails, User, Priority } from '@/types'
import { 
  Check, 
  Clock, 
  Users, 
  Flag, 
  Calendar, 
  MoreVertical, 
  Edit, 
  Trash2,
  Repeat
} from 'lucide-react'

interface TaskItemProps {
  task: TaskWithDetails
  onUpdate: (taskId: string, updates: any) => void
  onDelete: (taskId: string) => void
  users: User[]
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
}

const priorityIcons = {
  LOW: <Flag size={16} className="text-gray-500" />,
  MEDIUM: <Flag size={16} className="text-blue-500" />,
  HIGH: <Flag size={16} className="text-orange-500" />,
  URGENT: <Flag size={16} className="text-red-500" />
}

export default function TaskItem({ task, onUpdate, onDelete, users }: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const handleComplete = () => {
    onUpdate(task.id, { isCompleted: !task.isCompleted })
  }

  const handleTodayToggle = () => {
    onUpdate(task.id, { isToday: !task.isToday })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setShowMenu(false)
  }

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim() })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('정말로 이 작업을 삭제하시겠습니까?')) {
      onDelete(task.id)
    }
    setShowMenu(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${
      task.category?.color || '#3B82F6'
    } border-l-4`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleComplete}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.isCompleted
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.isCompleted && <Check size={12} />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            ) : (
              <div>
                <h3 className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {/* Priority */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                {priorityIcons[task.priority]}
                <span className="text-xs">
                  {task.priority === 'LOW' && '낮음'}
                  {task.priority === 'MEDIUM' && '보통'}
                  {task.priority === 'HIGH' && '높음'}
                  {task.priority === 'URGENT' && '긴급'}
                </span>
              </div>

              {/* Category */}
              {task.category && (
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: task.category.color }}
                  />
                  <span>{task.category.name}</span>
                </div>
              )}

              {/* Assignees */}
              {task.assignees.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{task.assignees.map(a => a.user.name).join(', ')}</span>
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}

              {/* Repeat Rule */}
              {task.repeatRule && (
                <div className="flex items-center gap-1">
                  <Repeat size={14} />
                  <span>
                    {task.repeatRule.type === 'DAILY' && '매일'}
                    {task.repeatRule.type === 'WEEKDAYS' && '평일'}
                    {task.repeatRule.type === 'WEEKLY' && '매주'}
                    {task.repeatRule.type === 'MONTHLY' && '매월'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Today Toggle */}
            <button
              onClick={handleTodayToggle}
              className={`p-2 rounded-lg transition-colors ${
                task.isToday
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={task.isToday ? '오늘 할 일에서 제거' : '오늘 할 일로 설정'}
            >
              <Calendar size={16} />
            </button>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={14} />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
