import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSessionToken, createSession, isValidEmail } from '@/lib/auth';

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
    const { email, password } = body;

    // ============================================================
    // 1. INPUT VALIDATION
    // ============================================================

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

    // ============================================================
    // 2. FIND USER BY EMAIL
    // ============================================================

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true, // We need password for comparison
        role: true,
        createdAt: true,
      },
    });

    // Use generic error message to prevent user enumeration attacks
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ============================================================
    // 3. VERIFY PASSWORD
    // ============================================================

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Generic error message (same as above for security)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ============================================================
    // 4. CREATE SESSION
    // ============================================================

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = await createSessionToken(sessionUser);
    await createSession(token);

    // ============================================================
    // 5. LOG ENGAGEMENT (Optional)
    // ============================================================

    try {
      // Track login event for analytics
      await prisma.engagement.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          timestamp: new Date(),
        },
      });
    } catch (engagementError) {
      // Don't fail login if engagement logging fails
      console.error('[ENGAGEMENT_LOG_ERROR]', engagementError);
    }

    // ============================================================
    // 6. RETURN SUCCESS RESPONSE
    // ============================================================

    // IMPORTANT: Never include password in response
    return NextResponse.json({
      success: true,
      user: sessionUser,
      message: 'Login successful',
    });

  } catch (error) {
    console.error('[AUTH_LOGIN_ERROR]', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
