            status: healthStatus.status,
            lastActive: healthStatus.lastActive,
        });
    } catch (error) {
        console.error('[Engagement Summary API Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

=======
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ============================================================
// TYPES
// ============================================================

type EngagementStatus = 'ON_TRACK' | 'AT_RISK' | 'INACTIVE';

interface EngagementSummary {
    userId: string;
    userName: string;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    feedbackCount: number;
    avgFeedbackRating: number;
    lastActiveAt: Date | null;
    engagementScore: number;
    status: EngagementStatus;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate engagement score based on task completion and feedback
 * Formula: base (60% max from task completion) + bonus (40% max from feedback)
 */
function calculateEngagementScore(
    completedTasks: number,
    totalTasks: number,
    feedbackCount: number
): number {
    // Base score: 60 points max from task completion ratio
    const base = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0;

    // Bonus score: 40 points max from feedback (10 points per feedback, capped at 4)
    const bonus = Math.min(feedbackCount * 10, 40);

    // Clamp final score between 0-100
    return Math.min(Math.max(base + bonus, 0), 100);
}

/**
 * Determine engagement status based on activity and metrics
 */
function determineStatus(
    lastActiveAt: Date | null,
    completedTasks: number,
    totalTasks: number,
    avgFeedbackRating: number
): EngagementStatus {
    const now = new Date();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

    // INACTIVE: No activity or inactive for 7+ days
    if (!lastActiveAt || now.getTime() - lastActiveAt.getTime() > SEVEN_DAYS_MS) {
        return 'INACTIVE';
    }

    // AT_RISK conditions
    const noRecentActivity = now.getTime() - lastActiveAt.getTime() > FORTY_EIGHT_HOURS_MS;
    const lowCompletionRate = totalTasks > 0 && (completedTasks / totalTasks) < 0.3;
    const lowFeedbackRating = avgFeedbackRating > 0 && avgFeedbackRating < 3.0;

    if (noRecentActivity || lowCompletionRate || lowFeedbackRating) {
        return 'AT_RISK';
    }

    // Default: ON_TRACK
    return 'ON_TRACK';
}

/**
 * Fetch and calculate engagement summary for a single user
 */
async function getUserEngagementSummary(userId: string): Promise<EngagementSummary | null> {
    // Fetch user with all related data in a single efficient query
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            // Task aggregations
            projects: {
                select: {
                    tasks: {
                        select: {
                            id: true,
                            status: true,
                            updatedAt: true,
                        },
                    },
                },
            },
            // Feedback aggregation
            feedbackReceived: {
                select: {
                    rating: true,
                },
            },
            // Engagement logs
            engagementLogs: {
                orderBy: {
                    timestamp: 'desc',
                },
                take: 1,
                select: {
                    timestamp: true,
                },
            },
        },
    });

    if (!user) {
        return null;
    }

    // Flatten tasks from all projects
    const allTasks = user.projects.flatMap((project) => project.tasks);

    // Calculate task metrics
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((task) => task.status === 'DONE').length;
    const inProgressTasks = allTasks.filter((task) => task.status === 'IN_PROGRESS').length;

    // Calculate feedback metrics
    const feedbackCount = user.feedbackReceived.length;
    const avgFeedbackRating =
        feedbackCount > 0
            ? user.feedbackReceived.reduce((sum, f) => sum + f.rating, 0) / feedbackCount
            : 0;

    // Determine last active time (latest of task update or engagement log)
    const latestTaskUpdate = allTasks.length > 0
        ? new Date(Math.max(...allTasks.map((t) => t.updatedAt.getTime())))
        : null;
    const latestEngagement = user.engagementLogs[0]?.timestamp || null;

    let lastActiveAt: Date | null = null;
    if (latestTaskUpdate && latestEngagement) {
        lastActiveAt = latestTaskUpdate > latestEngagement ? latestTaskUpdate : latestEngagement;
    } else {
        lastActiveAt = latestTaskUpdate || latestEngagement;
    }

    // Calculate derived metrics
    const engagementScore = calculateEngagementScore(completedTasks, totalTasks, feedbackCount);
    const status = determineStatus(lastActiveAt, completedTasks, totalTasks, avgFeedbackRating);

    return {
        userId: user.id,
        userName: user.name || 'Unknown User',
        totalTasks,
        completedTasks,
        inProgressTasks,
        feedbackCount,
        avgFeedbackRating: Math.round(avgFeedbackRating * 10) / 10, // Round to 1 decimal
        lastActiveAt,
        engagementScore: Math.round(engagementScore),
        status,
    };
}

/**
 * Fetch engagement summaries for all users
 */
async function getAllUsersEngagementSummary(): Promise<EngagementSummary[]> {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            projects: {
                select: {
                    tasks: {
                        select: {
                            id: true,
                            status: true,
                            updatedAt: true,
                        },
                    },
                },
            },
            feedbackReceived: {
                select: {
                    rating: true,
                },
            },
            engagementLogs: {
                orderBy: {
                    timestamp: 'desc',
                },
                take: 1,
                select: {
                    timestamp: true,
                },
            },
        },
    });

    return users.map((user) => {
        // Flatten tasks from all projects
        const allTasks = user.projects.flatMap((project) => project.tasks);

        // Calculate task metrics
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter((task) => task.status === 'DONE').length;
        const inProgressTasks = allTasks.filter((task) => task.status === 'IN_PROGRESS').length;

        // Calculate feedback metrics
        const feedbackCount = user.feedbackReceived.length;
        const avgFeedbackRating =
            feedbackCount > 0
                ? user.feedbackReceived.reduce((sum, f) => sum + f.rating, 0) / feedbackCount
                : 0;

        // Determine last active time
        const latestTaskUpdate = allTasks.length > 0
            ? new Date(Math.max(...allTasks.map((t) => t.updatedAt.getTime())))
            : null;
        const latestEngagement = user.engagementLogs[0]?.timestamp || null;

        let lastActiveAt: Date | null = null;
        if (latestTaskUpdate && latestEngagement) {
            lastActiveAt = latestTaskUpdate > latestEngagement ? latestTaskUpdate : latestEngagement;
        } else {
            lastActiveAt = latestTaskUpdate || latestEngagement;
        }

        // Calculate derived metrics
        const engagementScore = calculateEngagementScore(completedTasks, totalTasks, feedbackCount);
        const status = determineStatus(lastActiveAt, completedTasks, totalTasks, avgFeedbackRating);

        return {
            userId: user.id,
            userName: user.name || 'Unknown User',
            totalTasks,
            completedTasks,
            inProgressTasks,
            feedbackCount,
            avgFeedbackRating: Math.round(avgFeedbackRating * 10) / 10,
            lastActiveAt,
            engagementScore: Math.round(engagementScore),
            status,
        };
    });
}

// ============================================================
// API ROUTE HANDLER
// ============================================================

/**
 * GET /api/engagement/summary?userId=xxx
 * 
 * Returns engagement summary for a specific user or all users
 * 
 * Query Parameters:
 * - userId (optional): Specific user ID. If omitted, returns all users.
 * 
 * Response:
 * - Single user: EngagementSummary object
 * - All users: Array of EngagementSummary objects
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // Single user query
        if (userId) {
            const summary = await getUserEngagementSummary(userId);

            if (!summary) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(summary, { status: 200 });
        }

        // All users query (mentor/admin view)
        const summaries = await getAllUsersEngagementSummary();

        return NextResponse.json(summaries, { status: 200 });
    } catch (error) {
        console.error('Error fetching engagement summary:', error);

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
>>>>>>> 4de8c1147d8a9ffd4acd0b5780d80706e8c116da
