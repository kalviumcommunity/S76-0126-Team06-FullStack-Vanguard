import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'MENTOR') {
            return NextResponse.json({ error: 'Unauthorized or not a mentor' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        // Find students associated with this mentor
        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                mentorId: session.user.id,
                ...(projectId ? { projectId } : {})
            },
            include: {
                healthStatus: true
            }
        });

        const squadData = students.map(student => ({
            userId: student.id,
            email: student.email,
            name: student.name,
            status: student.healthStatus?.status || 'NORMAL',
            engagementScore: student.healthStatus?.engagementScore || 0,
            taskCompletion: student.healthStatus?.taskCompletion || 0,
            feedbackScore: student.healthStatus?.feedbackScore || 0,
            lastActive: student.healthStatus?.lastActive || student.createdAt,
            flags: student.healthStatus?.flags || []
        }));

        return NextResponse.json({ students: squadData });
    } catch (error) {
        console.error('[Squad Health API Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

