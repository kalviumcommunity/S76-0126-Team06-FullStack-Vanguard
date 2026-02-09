import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/projects
 * Fetch project for current user or all assigned students for mentor
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          members: {
            select: { id: true, name: true, email: true, role: true }
          },
          tasks: true
        }
      });
      return NextResponse.json(project);
    }

    let projects;
    if (session.user.role === 'MENTOR') {
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              mentorId: session.user.id
            }
          }
        },
        include: {
          members: {
            select: { id: true, name: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              id: session.user.id
            }
          }
        },
        include: {
          tasks: {
            select: { id: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/projects/create
 * Create a new project and assign creating student to it
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Create project and link student
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        members: {
          connect: { id: session.user.id }
        }
      }
    });

    // Update user's primary projectId for onboarding tracking
    await prisma.user.update({
      where: { id: session.user.id },
      data: { projectId: project.id }
    });

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt
      }
    });
  } catch (error) {
    console.error('POST /api/projects/create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

