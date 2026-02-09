import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { createSessionToken, createSession, isValidEmail } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.string().optional(),
});

/**
 * POST /api/auth/login
 * Authenticates a user and creates a session
 * 
 * Security considerations:
 * - Rate limiting should be implemented in production (e.g., 5 failed attempts per IP per 15 minutes)
 * - Consider implementing account lockout after multiple failed attempts
 * - Log failed login attempts for security monitoring
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
<<<<<<< HEAD
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
=======
    const { email, password } = body;

    // ============================================================
    // 1. INPUT VALIDATION
    // ============================================================

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
>>>>>>> 4de8c1147d8a9ffd4acd0b5780d80706e8c116da
        { status: 400 }
      );
    }

<<<<<<< HEAD
    const { email, password, role } = validation.data;

    // Find user in DB with projects
    const user = await prisma.user.findUnique({
      where: { email },
      const body = await request.json();
      const validation = loginSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input' },
          { status: 400 }
        );
      }
      const { email, password, role } = validation.data;
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }
      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
      // Find user in DB with projects
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          projects: {
            select: { id: true },
            take: 1
          },
          ownedProjects: {
            select: { id: true },
            take: 1
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          createdAt: true,
        }
      });
      // Use generic error message to prevent user enumeration attacks
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
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      // Determine projectId (prioritize owned, then member)
      const projectId = user.ownedProjects?.[0]?.id || user.projects?.[0]?.id;
      // Create session data
      const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        projectId: projectId,
      };
      const token = await createSessionToken(sessionUser);
      await createSession(token);
      try {
        await prisma.engagement.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            timestamp: new Date(),
          },
        });
      } catch (engagementError) {
        console.error('[ENGAGEMENT_LOG_ERROR]', engagementError);
      }
      return NextResponse.json({
        success: true,
        user: sessionUser,
        message: 'Login successful',
      });
    });

<<<<<<< HEAD
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
=======
>>>>>>> 4de8c1147d8a9ffd4acd0b5780d80706e8c116da
  } catch (error) {
    console.error('[AUTH_LOGIN_ERROR]', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
