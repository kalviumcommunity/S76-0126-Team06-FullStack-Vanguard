import { NextResponse } from 'next/server';
import { deleteSession, getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * POST /api/auth/logout
 * Logs out the current user by clearing the session cookie
 * 
 * Note: Using POST instead of GET for logout is a security best practice
 * to prevent CSRF attacks via image tags or links
 */
export async function POST() {
  try {
    // ============================================================
    // 1. GET CURRENT USER (Optional - for logging)
    // ============================================================

    const user = await getCurrentUser();

    // ============================================================
    // 2. LOG ENGAGEMENT (Optional)
    // ============================================================

    if (user) {
      try {
        await prisma.engagement.create({
          data: {
            userId: user.id,
            action: 'LOGOUT',
            timestamp: new Date(),
          },
        });
      } catch (engagementError) {
        // Don't fail logout if engagement logging fails
        console.error('[ENGAGEMENT_LOG_ERROR]', engagementError);
      }
    }

    // ============================================================
    // 3. DELETE SESSION COOKIE
    // ============================================================

    await deleteSession();

    // ============================================================
    // 4. RETURN SUCCESS RESPONSE
    // ============================================================

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('[AUTH_LOGOUT_ERROR]', error);

    // Even if there's an error, try to delete the session
    try {
      await deleteSession();
    } catch (deleteError) {
      console.error('[SESSION_DELETE_ERROR]', deleteError);
    }

    // Still return success - logout should always succeed from user perspective
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}

/**
 * GET /api/auth/logout
 * Fallback for GET requests (redirects to POST)
 * Some clients might try GET, so we handle it gracefully
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed. Please use POST request for logout.',
      hint: 'Send a POST request to /api/auth/logout',
    },
    { status: 405 }
  );
}
