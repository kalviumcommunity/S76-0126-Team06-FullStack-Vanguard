#!/usr/bin/env tsx
/**
 * Test script for Engagement Summary API
 * 
 * This script directly tests the engagement calculation logic
 * without requiring HTTP requests or authentication.
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================
// CALCULATION FUNCTIONS (copied from route.ts)
// ============================================================

function calculateEngagementScore(
    completedTasks: number,
    totalTasks: number,
    feedbackCount: number
): number {
    const base = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0;
    const bonus = Math.min(feedbackCount * 10, 40);
    return Math.min(Math.max(base + bonus, 0), 100);
}

function determineStatus(
    lastActiveAt: Date | null,
    completedTasks: number,
    totalTasks: number,
    avgFeedbackRating: number
): 'ON_TRACK' | 'AT_RISK' | 'INACTIVE' {
    const now = new Date();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

    if (!lastActiveAt || now.getTime() - lastActiveAt.getTime() > SEVEN_DAYS_MS) {
        return 'INACTIVE';
    }

    const noRecentActivity = now.getTime() - lastActiveAt.getTime() > FORTY_EIGHT_HOURS_MS;
    const lowCompletionRate = totalTasks > 0 && (completedTasks / totalTasks) < 0.3;
    const lowFeedbackRating = avgFeedbackRating > 0 && avgFeedbackRating < 3.0;

    if (noRecentActivity || lowCompletionRate || lowFeedbackRating) {
        return 'AT_RISK';
    }

    return 'ON_TRACK';
}

// ============================================================
// TEST FUNCTION
// ============================================================

async function testEngagementAPI() {
    console.log('🧪 Testing Engagement Summary API\n');
    console.log('═'.repeat(60));

    try {
        // Fetch all users with their related data
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
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

        console.log(`\n📊 Found ${users.length} users in database\n`);

        // Process each user
        for (const user of users) {
            // Skip mentors for cleaner output
            if (user.role === 'MENTOR') {
                console.log(`👨‍🏫 ${user.name} (MENTOR) - Skipping\n`);
                continue;
            }

            console.log(`👤 ${user.name} (${user.email})`);
            console.log('─'.repeat(60));

            // Flatten tasks
            const allTasks = user.projects.flatMap((project) => project.tasks);

            // Calculate metrics
            const totalTasks = allTasks.length;
            const completedTasks = allTasks.filter((t) => t.status === 'DONE').length;
            const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
            const todoTasks = allTasks.filter((t) => t.status === 'TODO').length;

            const feedbackCount = user.feedbackReceived.length;
            const avgFeedbackRating =
                feedbackCount > 0
                    ? user.feedbackReceived.reduce((sum, f) => sum + f.rating, 0) / feedbackCount
                    : 0;

            // Determine last active
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

            // Display results
            console.log(`\n📈 Task Breakdown:`);
            console.log(`   • Total Tasks:       ${totalTasks}`);
            console.log(`   • ✅ Completed:      ${completedTasks} (${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)`);
            console.log(`   • 🔄 In Progress:    ${inProgressTasks}`);
            console.log(`   • 📝 TODO:           ${todoTasks}`);

            console.log(`\n💬 Feedback:`);
            console.log(`   • Count:             ${feedbackCount}`);
            console.log(`   • Average Rating:    ${avgFeedbackRating.toFixed(1)} / 5.0`);

            console.log(`\n⏰ Activity:`);
            console.log(`   • Last Active:       ${lastActiveAt ? lastActiveAt.toISOString() : 'Never'}`);
            if (lastActiveAt) {
                const hoursAgo = Math.round((Date.now() - lastActiveAt.getTime()) / (1000 * 60 * 60));
                console.log(`   • Hours Since:       ${hoursAgo}h ago`);
            }

            console.log(`\n🎯 Engagement Metrics:`);
            console.log(`   • Score:             ${Math.round(engagementScore)}/100`);

            // Color-coded status
            const statusEmoji = {
                ON_TRACK: '🟢',
                AT_RISK: '🟡',
                INACTIVE: '🔴',
            };
            console.log(`   • Status:            ${statusEmoji[status]} ${status}`);

            // Explain scoring
            const baseScore = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0;
            const bonusScore = Math.min(feedbackCount * 10, 40);
            console.log(`\n📐 Score Calculation:`);
            console.log(`   • Base (tasks):      ${baseScore.toFixed(1)} / 60`);
            console.log(`   • Bonus (feedback):  ${bonusScore.toFixed(1)} / 40`);
            console.log(`   • Total:             ${Math.round(engagementScore)} / 100`);

            console.log('\n' + '═'.repeat(60) + '\n');
        }

        console.log('✅ All tests completed successfully!\n');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

// Run tests
testEngagementAPI();
