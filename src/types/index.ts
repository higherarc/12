import { Task, Category, User, Priority, RepeatType } from '@/generated/prisma'

export type { Task, Category, User, Priority, RepeatType }

export interface TaskWithDetails extends Task {
  category?: Category | null
  assignees: (TaskAssignee & { user: User })[]
  repeatRule?: RepeatRule | null
}

export interface TaskAssignee {
  id: string
  taskId: string
  userId: string
  user: User
}

export interface RepeatRule {
  id: string
  type: RepeatType
  interval: number
  days?: string | null
  endDate?: Date | null
  createdAt: Date
  updatedAt: Date
  taskId: string
}

export interface CreateTaskData {
  title: string
  description?: string
  categoryId?: string
  priority?: Priority
  dueDate?: Date
  isToday?: boolean
  assigneeIds?: string[]
  repeatRule?: {
    type: RepeatType
    interval?: number
    days?: number[]
    endDate?: Date
  }
}

export interface UpdateTaskData {
  title?: string
  description?: string
  categoryId?: string
  priority?: Priority
  dueDate?: Date
  isToday?: boolean
  isCompleted?: boolean
  assigneeIds?: string[]
}

export interface CreateCategoryData {
  name: string
  color?: string
}

export interface FilterOptions {
  categoryId?: string
  assigneeId?: string
  priority?: Priority
  isToday?: boolean
  isCompleted?: boolean
  search?: string
}
