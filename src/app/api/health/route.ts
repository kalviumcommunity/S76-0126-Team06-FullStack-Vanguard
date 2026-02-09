import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Health check endpoint to verify database connectivity
 * GET /api/health
 */
export async function GET() {
    try {
        // Test database connection by counting users
        const userCount = await prisma.user.count();
        const projectCount = await prisma.project.count();
        const taskCount = await prisma.task.count();

        return NextResponse.json({
            status: 'healthy',
            database: 'connected',
            provider: 'Neon PostgreSQL',
            data: {
                users: userCount,
                projects: projectCount,
                tasks: taskCount,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[HEALTH_CHECK]', error);
        return NextResponse.json(
            {
                status: 'unhealthy',
                database: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 503 }
        );
    }
}
