import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Basic validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database authentication
    // For now, using mock authentication
    const mockUsers = [
      { email: 'student@vanguard.com', password: 'student123', role: 'student', name: 'John Student' },
      { email: 'mentor@vanguard.com', password: 'mentor123', role: 'mentor', name: 'Jane Mentor' },
    ];

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials or role' },
        { status: 401 }
      );
    }

    // Create session data
    const session = {
      user: {
        id: user.email, // In production, use actual user ID
        email: user.email,
        name: user.name,
        role: user.role,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // In production, set httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: session.user,
      message: 'Login successful',
    });

    // Set session cookie
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
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
