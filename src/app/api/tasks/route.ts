import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { TaskStatus, Priority } from '@prisma/client';

// Schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  assignedToId: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z.string().optional(), // Expected as ISO string
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validation = createTaskSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { title, description, projectId, assignedToId, priority, dueDate } = validation.data;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        createdById: session.user.id,
        assignedToId: assignedToId || session.user.id, // Default to creator if not specified
        priority: priority || Priority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

