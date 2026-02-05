import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSessionToken, createSession, isValidEmail, validatePassword } from '@/lib/auth';
import { Role } from '@prisma/client';

/**
 * POST /api/auth/signup
 * Creates a new user account and establishes a session
 * 
 * Security considerations:
 * - Rate limiting should be implemented in production (e.g., 5 signups per IP per hour)
 * - Consider adding CAPTCHA for production use
 * - Email verification should be added for production
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // ============================================================
    // 1. INPUT VALIDATION
    // ============================================================

    // Check for required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Validate role (optional field, defaults to STUDENT)
    const validRoles: Role[] = ['STUDENT', 'MENTOR', 'ADMIN'];
    const userRole: Role = role && validRoles.includes(role) ? role : 'STUDENT';

    // ============================================================
    // 2. CHECK IF USER ALREADY EXISTS
    // ============================================================

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // ============================================================
    // 3. HASH PASSWORD
    // ============================================================

    // Using 12 rounds as specified (good balance of security and performance)
    const hashedPassword = await bcrypt.hash(password, 12);

    // ============================================================
    // 4. CREATE USER IN DATABASE
    // ============================================================

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(), // Store emails in lowercase for consistency
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // IMPORTANT: Never select password in responses
      },
    });

    // ============================================================
    // 5. CREATE SESSION
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
    // 6. RETURN SUCCESS RESPONSE
    // ============================================================

    return NextResponse.json(
      {
        success: true,
        user: sessionUser,
        token, // Include token in response for client-side storage if needed
        message: 'Account created successfully',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[AUTH_SIGNUP_ERROR]', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'An error occurred during signup. Please try again.' },
      { status: 500 }
    );
  }
}
