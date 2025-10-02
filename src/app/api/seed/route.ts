import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Create default users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
          name: '관리자',
          email: 'admin@example.com'
        }
      }),
      prisma.user.upsert({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
          name: '김철수',
          email: 'user1@example.com'
        }
      }),
      prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
          name: '이영희',
          email: 'user2@example.com'
        }
      })
    ])

    // Create default categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { id: 'work' },
        update: {},
        create: {
          id: 'work',
          name: '업무',
          color: '#3B82F6',
          order: 1
        }
      }),
      prisma.category.upsert({
        where: { id: 'personal' },
        update: {},
        create: {
          id: 'personal',
          name: '개인',
          color: '#10B981',
          order: 2
        }
      }),
      prisma.category.upsert({
        where: { id: 'shopping' },
        update: {},
        create: {
          id: 'shopping',
          name: '쇼핑',
          color: '#F59E0B',
          order: 3
        }
      })
    ])

    // Create sample tasks
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          title: '프로젝트 기획서 작성',
          description: '새로운 프로젝트의 기획서를 작성하고 검토하기',
          priority: 'HIGH',
          isToday: true,
          categoryId: categories[0].id,
          creatorId: users[0].id,
          assignees: {
            create: [
              { userId: users[0].id },
              { userId: users[1].id }
            ]
          }
        }
      }),
      prisma.task.create({
        data: {
          title: '운동하기',
          description: '헬스장에서 1시간 운동',
          priority: 'MEDIUM',
          isToday: true,
          categoryId: categories[1].id,
          creatorId: users[0].id,
          assignees: {
            create: [{ userId: users[0].id }]
          },
          repeatRule: {
            create: {
              type: 'WEEKDAYS',
              interval: 1
            }
          }
        }
      }),
      prisma.task.create({
        data: {
          title: '장보기',
          description: '주말 장보기 리스트',
          priority: 'LOW',
          categoryId: categories[2].id,
          creatorId: users[0].id,
          assignees: {
            create: [{ userId: users[2].id }]
          },
          repeatRule: {
            create: {
              type: 'WEEKLY',
              interval: 1,
              days: JSON.stringify([0]) // Sunday
            }
          }
        }
      })
    ])

    return NextResponse.json({
      message: 'Database seeded successfully',
      users: users.length,
      categories: categories.length,
      tasks: tasks.length
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
