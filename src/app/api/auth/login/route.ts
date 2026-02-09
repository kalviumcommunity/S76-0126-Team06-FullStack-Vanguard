import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password, role } = validation.data;

    // Find user in DB with projects
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        projects: {
          select: { id: true },
          take: 1
        },
        ownedProjects: {
          select: { id: true },
          take: 1
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Role check
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json(
        { error: 'Role mismatch' },
        { status: 401 }
      );
    }

    // Determine projectId (prioritize owned, then member)
    const projectId = user.ownedProjects[0]?.id || user.projects[0]?.id;

    // Create session data
    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase(),
        projectId: projectId, // Include projectId
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    const response = NextResponse.json({
      success: true,
      user: session.user,
      message: 'Login successful',
    });

    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
