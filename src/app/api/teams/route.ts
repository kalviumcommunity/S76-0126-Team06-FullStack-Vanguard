import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/teams?projectId={id}
 * Fetch all members of a project with their health/activity stats
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const members = await prisma.user.findMany({
            where: {
                projectId: projectId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                healthStatus: {
                    select: {
                        engagementScore: true,
                        taskCompletion: true,
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        const formattedMembers = members.map(member => ({
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
            engagement: member.healthStatus?.engagementScore || 0,
            tasksCompleted: member.healthStatus?.taskCompletion || 0,
            joinedDate: member.createdAt
        }));

        return NextResponse.json({ members: formattedMembers });
    } catch (error) {
        console.error('GET /api/teams error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
