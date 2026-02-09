import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { taskId } = await params;

        const json = await request.json();
        const validation = updateTaskSchema.safeParse(json);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Permission check: Task owner or Mentor of the task owner
        const isOwner = task.userId === session.user.id;
        const isMentor = task.project.user.mentorId === session.user.id;

        if (!isOwner && !isMentor) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: validation.data,
            include: {
                user: { select: { email: true } }
            }
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Failed to update task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { taskId } = await params;

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Only owner can delete
        if (task.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden: Only owner can delete' }, { status: 403 });
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

