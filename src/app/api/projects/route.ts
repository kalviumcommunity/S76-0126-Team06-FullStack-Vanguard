import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

/**
 * Extract user ID from session cookie
 */
async function getUserIdFromRequest(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    return session.user?.id || null;
  } catch (error) {
    console.error('Error extracting user ID:', error);
    return null;
  }
}

/**
 * GET /api/projects
 * Fetch all projects where the current user is a member
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project with members
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, memberIds } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (description && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      );
    }

    if (memberIds && !Array.isArray(memberIds)) {
      return NextResponse.json(
        { error: 'memberIds must be an array' },
        { status: 400 }
      );
    }

    // Ensure creator is included in members
    const membersToAdd = Array.isArray(memberIds)
      ? Array.from(new Set([userId, ...memberIds])) // Remove duplicates
      : [userId];

    // Verify all member IDs exist
    const members = await prisma.user.findMany({
      where: {
        id: {
          in: membersToAdd,
        },
      },
      select: { id: true },
    });

    if (members.length !== membersToAdd.length) {
      return NextResponse.json(
        { error: 'One or more member IDs are invalid' },
        { status: 400 }
      );
    }

    // Create project with members
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        members: {
          connect: membersToAdd.map((id) => ({ id })),
        },
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: 'Project created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
