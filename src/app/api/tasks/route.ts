import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Basic validation for projectId
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Placeholder for session user authentication
    // const session = await getServerSession(authOptions);
    // if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('[TASKS_GET]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Placeholder for session user authentication
    // const session = await getServerSession(authOptions);
    // if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const { title, projectId } = body;

    // Validate required fields
    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Title and Project ID are required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        projectId,
        status: 'TODO', // Default status
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('[TASKS_POST]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Placeholder for session user authentication
    // const session = await getServerSession(authOptions);
    // if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const { id, status } = body;

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Task ID and new status are required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('[TASKS_PATCH]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
