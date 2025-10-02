import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateTaskData } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const assigneeId = searchParams.get('assigneeId')
    const priority = searchParams.get('priority')
    const isToday = searchParams.get('isToday')
    const isCompleted = searchParams.get('isCompleted')
    const search = searchParams.get('search')

    const where: any = {}

    if (categoryId) where.categoryId = categoryId
    if (priority) where.priority = priority
    if (isToday !== null) where.isToday = isToday === 'true'
    if (isCompleted !== null) where.isCompleted = isCompleted === 'true'
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (assigneeId) {
      where.assignees = {
        some: {
          userId: assigneeId
        }
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: true,
        assignees: {
          include: {
            user: true
          }
        },
        repeatRule: true,
        creator: true
      },
      orderBy: [
        { isToday: 'desc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateTaskData = await request.json()
    const { assigneeIds, repeatRule, ...taskData } = data

    // Ensure a valid creator exists (no auth yet)
    let creator = await prisma.user.findFirst()
    if (!creator) {
      creator = await prisma.user.create({
        data: { name: '관리자' }
      })
    }

    // Normalize optional fields coming from the client
    const normalizedTaskData: any = {
      ...taskData,
      categoryId: taskData.categoryId || undefined
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        ...normalizedTaskData,
        creatorId: creator.id,
        assignees: assigneeIds ? {
          create: assigneeIds.map(userId => ({
            userId
          }))
        } : undefined,
        repeatRule: repeatRule ? {
          create: {
            type: repeatRule.type,
            interval: repeatRule.interval || 1,
            days: repeatRule.days ? JSON.stringify(repeatRule.days) : null,
            endDate: repeatRule.endDate
          }
        } : undefined
      },
      include: {
        category: true,
        assignees: {
          include: {
            user: true
          }
        },
        repeatRule: true,
        creator: true
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
