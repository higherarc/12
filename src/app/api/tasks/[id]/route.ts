import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateTaskData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const task = await prisma.task.findUnique({
      where: { id },
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

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data: UpdateTaskData = await request.json()
    const { assigneeIds, ...taskData } = data

    // Handle assignees update
    if (assigneeIds !== undefined) {
      // Delete existing assignees
      await prisma.taskAssignee.deleteMany({
        where: { taskId: id }
      })

      // Create new assignees
      if (assigneeIds.length > 0) {
        await prisma.taskAssignee.createMany({
          data: assigneeIds.map(userId => ({
            taskId: id,
            userId
          }))
        })
      }
    }

    // Update task completion timestamp
    if (data.isCompleted !== undefined) {
      (taskData as any).completedAt = data.isCompleted ? new Date() : null
    }

    const task = await prisma.task.update({
      where: { id },
      data: taskData,
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

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
