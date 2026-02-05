import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/auth/session
 * Returns the current user session
 * Used by the client to check authentication status
 * 
 * This endpoint is useful for:
 * - Checking if user is logged in on page load
 * - Getting current user data for UI rendering
 * - Validating session before performing actions
 */
export async function GET() {
  try {
    // ============================================================
    // 1. GET CURRENT USER FROM SESSION
    // ============================================================

    const user = await getCurrentUser();

    // ============================================================
    // 2. RETURN USER OR 401 IF NOT AUTHENTICATED
    // ============================================================

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          error: 'Not authenticated',
          message: 'No active session found',
        },
        { status: 401 }
      );
    }

    // ============================================================
    // 3. RETURN CURRENT USER DATA
    // ============================================================

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('[AUTH_SESSION_ERROR]', error);

    return NextResponse.json(
      {
        authenticated: false,
        error: 'Session validation failed',
      },
      { status: 401 }
    );
  }
}

/**
 * POST /api/auth/session
 * Validates and refreshes the current session
 * This can be used to extend session expiry time
 */
export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Session is valid - could refresh it here if needed
    // For now, just return current session info

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Session is valid',
    });

  } catch (error) {
    console.error('[AUTH_SESSION_REFRESH_ERROR]', error);

    return NextResponse.json(
      { error: 'Session validation failed' },
      { status: 401 }
    );
  }
}
