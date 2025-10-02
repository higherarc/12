'use client'

import { useState } from 'react'
import { Category, User, Priority, RepeatType } from '@/types'
import { X, Calendar, Users, Flag, Tag, RotateCcw } from 'lucide-react'

interface TaskFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
  users: User[]
  categories: Category[]
}

export default function TaskForm({ onClose, onSubmit, users, categories }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'MEDIUM' as Priority,
    dueDate: '',
    isToday: false,
    assigneeIds: [] as string[],
    repeatRule: {
      type: 'DAILY' as RepeatType,
      interval: 1,
      days: [] as number[],
      endDate: ''
    }
  })

  const [showRepeatOptions, setShowRepeatOptions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      repeatRule: showRepeatOptions ? {
        ...formData.repeatRule,
        endDate: formData.repeatRule.endDate ? new Date(formData.repeatRule.endDate) : undefined
      } : undefined
    }

    onSubmit(submitData)
  }

  const handleAssigneeToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter(id => id !== userId)
        : [...prev.assigneeIds, userId]
    }))
  }

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      repeatRule: {
        ...prev.repeatRule,
        days: prev.repeatRule.days.includes(day)
          ? prev.repeatRule.days.filter(d => d !== day)
          : [...prev.repeatRule.days, day]
      }
    }))
  }

  const weekDays = [
    { value: 0, label: '일' },
    { value: 1, label: '월' },
    { value: 2, label: '화' },
    { value: 3, label: '수' },
    { value: 4, label: '목' },
    { value: 5, label: '금' },
    { value: 6, label: '토' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">새 작업 추가</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="작업 제목을 입력하세요"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="작업에 대한 자세한 설명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} className="inline mr-1" />
                카테고리
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Flag size={16} className="inline mr-1" />
                우선순위
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">낮음</option>
                <option value="MEDIUM">보통</option>
                <option value="HIGH">높음</option>
                <option value="URGENT">긴급</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                마감일
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Today */}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isToday}
                  onChange={(e) => setFormData(prev => ({ ...prev, isToday: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">오늘 할 일로 설정</span>
              </label>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={16} className="inline mr-1" />
              담당자
            </label>
            <div className="space-y-2">
              {users.map(user => (
                <label key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.assigneeIds.includes(user.id)}
                    onChange={() => handleAssigneeToggle(user.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Repeat Options */}
          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={showRepeatOptions}
                onChange={(e) => setShowRepeatOptions(e.target.checked)}
                className="mr-2"
              />
              <RotateCcw size={16} className="inline mr-1" />
              <span className="text-sm font-medium text-gray-700">반복 설정</span>
            </label>

            {showRepeatOptions && (
              <div className="pl-6 space-y-4 border-l-2 border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    반복 유형
                  </label>
                  <select
                    value={formData.repeatRule.type}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      repeatRule: { ...prev.repeatRule, type: e.target.value as RepeatType }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DAILY">매일</option>
                    <option value="WEEKDAYS">평일</option>
                    <option value="WEEKLY">매주</option>
                    <option value="MONTHLY">매월</option>
                  </select>
                </div>

                {formData.repeatRule.type === 'WEEKLY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      요일 선택
                    </label>
                    <div className="flex gap-2">
                      {weekDays.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`px-3 py-1 rounded-lg text-sm border ${
                            formData.repeatRule.days.includes(day.value)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    반복 종료일 (선택사항)
                  </label>
                  <input
                    type="date"
                    value={formData.repeatRule.endDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      repeatRule: { ...prev.repeatRule, endDate: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              작업 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
