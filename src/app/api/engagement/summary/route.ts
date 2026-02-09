import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || session.user.id;

        // Permission check
        if (session.user.role === 'STUDENT' && userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const healthStatus = await prisma.healthStatus.findUnique({
            where: { userId: userId },
        });

        if (!healthStatus) {
            // Fallback: Return defaults if no background job has run yet
            return NextResponse.json({
                engagementScore: 0,
                taskCompletion: 0,
                feedbackScore: 0,
                status: 'NORMAL',
                lastActive: new Date(),
            });
        }

        return NextResponse.json({
            engagementScore: healthStatus.engagementScore,
            taskCompletion: healthStatus.taskCompletion,
            feedbackScore: healthStatus.feedbackScore,
            status: healthStatus.status,
            lastActive: healthStatus.lastActive,
        });
    } catch (error) {
        console.error('[Engagement Summary API Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

