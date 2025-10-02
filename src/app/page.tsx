'use client'

import { useState, useEffect } from 'react'
import { TaskWithDetails, Category, User } from '@/types'
import TaskList from '@/components/TaskList'
import TaskForm from '@/components/TaskForm'
import CategoryList from '@/components/CategoryList'
import FilterBar from '@/components/FilterBar'
import { Plus, Calendar, CheckSquare, Archive } from 'lucide-react'

export default function Home() {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'completed'>('all')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [filters, setFilters] = useState({
    categoryId: '',
    assigneeId: '',
    priority: '',
    search: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, categoriesRes, usersRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/categories'),
        fetch('/api/users')
      ])

      const [tasksData, categoriesData, usersData] = await Promise.all([
        tasksRes.json(),
        categoriesRes.json(),
        usersRes.json()
      ])

      setTasks(tasksData)
      setCategories(categoriesData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'today' && !task.isToday) return false
    if (activeTab === 'completed' && !task.isCompleted) return false
    if (activeTab === 'all' && task.isCompleted) return false

    if (filters.categoryId && task.categoryId !== filters.categoryId) return false
    if (filters.assigneeId && !task.assignees.some(a => a.userId === filters.assigneeId)) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false

    return true
  })

  const handleTaskCreate = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks(prev => [newTask, ...prev])
        setShowTaskForm(false)
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">To-Do 앱</h1>
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              새 작업
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">카테고리</h2>
              <CategoryList 
                categories={categories}
                onCategorySelect={(categoryId) => 
                  setFilters(prev => ({ ...prev, categoryId }))
                }
                selectedCategoryId={filters.categoryId}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium ${
                    activeTab === 'all'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CheckSquare size={20} />
                  모든 작업
                </button>
                <button
                  onClick={() => setActiveTab('today')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium ${
                    activeTab === 'today'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Calendar size={20} />
                  오늘 할 일
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex items-center gap-2 px-6 py-4 font-medium ${
                    activeTab === 'completed'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Archive size={20} />
                  완료된 작업
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              users={users}
              categories={categories}
            />

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              users={users}
            />
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSubmit={handleTaskCreate}
          users={users}
          categories={categories}
        />
      )}
    </div>
  )
}
