'use client'

import { Category } from '@/types'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface CategoryListProps {
  categories: Category[]
  onCategorySelect: (categoryId: string) => void
  selectedCategoryId: string
}

export default function CategoryList({ categories, onCategorySelect, selectedCategoryId }: CategoryListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      })

      if (response.ok) {
        setNewCategoryName('')
        setShowAddForm(false)
        // Refresh the page to get updated categories
        window.location.reload()
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  return (
    <div className="space-y-2">
      {/* All Categories */}
      <button
        onClick={() => onCategorySelect('')}
        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
          selectedCategoryId === ''
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        전체
      </button>

      {/* Category List */}
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            selectedCategoryId === category.id
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span>{category.name}</span>
        </button>
      ))}

      {/* Add Category */}
      {showAddForm ? (
        <div className="px-3 py-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="카테고리 이름"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCategory()
              if (e.key === 'Escape') {
                setShowAddForm(false)
                setNewCategoryName('')
              }
            }}
          />
          <div className="flex gap-1 mt-2">
            <button
              onClick={handleAddCategory}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              추가
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewCategoryName('')
              }}
              className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full text-left px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          <span>카테고리 추가</span>
        </button>
      )}
    </div>
  )
}
