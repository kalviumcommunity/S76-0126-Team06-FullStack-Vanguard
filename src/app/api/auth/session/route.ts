import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const session = JSON.parse(sessionCookie.value);

      // Check if session is expired
      if (session.expires && new Date(session.expires) < new Date()) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      return NextResponse.json({ user: session.user || null }, { status: 200 });
    } catch (parseError) {
      console.error('Session parse error:', parseError);
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
