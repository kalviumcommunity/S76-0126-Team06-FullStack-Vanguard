import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({
    connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// Helper function to subtract days from current date
function daysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

// Helper function to create random time within a day
function randomTimeInDay(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
}

async function main() {
    console.log('🌱 Starting database seeding with production-ready demo data...\n');

    // Clear existing data (idempotent)
    console.log('🧹 Clearing existing data...');
    await prisma.engagement.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Database cleared\n');

    // ============================================================
    // 1. CREATE USERS (1 Mentor + 3 Students)
    // ============================================================
    console.log('👥 Creating users...');

    const passwordHash = await bcrypt.hash('password123', 10);

    const mentor = await prisma.user.create({
        data: {
            name: 'Dr. Sarah Mitchell',
            email: 'sarah.mitchell@university.edu',
            role: 'MENTOR',
            password: passwordHash,
        },
    });

    const alex = await prisma.user.create({
        data: {
            name: 'Alex Rivera',
            email: 'alex.rivera@student.edu',
            role: 'STUDENT',
            password: passwordHash,
        },
    });

    const jordan = await prisma.user.create({
        data: {
            name: 'Jordan Chen',
            email: 'jordan.chen@student.edu',
            role: 'STUDENT',
            password: passwordHash,
        },
    });

    const morgan = await prisma.user.create({
        data: {
            name: 'Morgan Taylor',
            email: 'morgan.taylor@student.edu',
            role: 'STUDENT',
            password: passwordHash,
        },
    });

    console.log(`✅ Created 4 users: 1 mentor, 3 students\n`);

    // ============================================================
    // 2. CREATE PROJECTS
    // ============================================================
    console.log('📁 Creating projects...');

    const vanguardProject = await prisma.project.create({
        data: {
            name: 'Sprint 1 - Vanguard',
            description: 'Student engagement tracking system',
            members: {
                connect: [{ id: alex.id }, { id: jordan.id }, { id: morgan.id }],
            },
        },
    });

    const dashboardProject = await prisma.project.create({
        data: {
            name: 'Analytics Dashboard',
            description: 'Data visualization for team metrics',
            members: {
                connect: [{ id: alex.id }, { id: jordan.id }],
            },
        },
    });

    console.log(`✅ Created 2 projects\n`);

    // ============================================================
    // 3. CREATE TASKS (12 total with varied statuses)
    // ============================================================
    console.log('✅ Creating tasks...');

    const tasks = await prisma.$transaction([
        // DONE tasks (4)
        prisma.task.create({
            data: {
                title: 'Setup Database Schema',
                status: 'DONE',
                projectId: vanguardProject.id,
                updatedAt: daysAgo(6),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Initialize Git repository and CI/CD',
                status: 'DONE',
                projectId: vanguardProject.id,
                updatedAt: daysAgo(5),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Setup project dependencies',
                status: 'DONE',
                projectId: dashboardProject.id,
                updatedAt: daysAgo(4),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Create API documentation',
                status: 'DONE',
                projectId: vanguardProject.id,
                updatedAt: daysAgo(3),
            },
        }),

        // IN_PROGRESS tasks (3)
        prisma.task.create({
            data: {
                title: 'Implement REST API endpoints',
                status: 'IN_PROGRESS',
                projectId: vanguardProject.id,
                updatedAt: daysAgo(2),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Build data visualization components',
                status: 'IN_PROGRESS',
                projectId: dashboardProject.id,
                updatedAt: daysAgo(1),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Develop authentication middleware',
                status: 'IN_PROGRESS',
                projectId: vanguardProject.id,
                updatedAt: new Date(),
            },
        }),

        // IN_REVIEW tasks (2)
        prisma.task.create({
            data: {
                title: 'Write integration tests',
                status: 'IN_REVIEW',
                projectId: vanguardProject.id,
                updatedAt: daysAgo(1),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Implement user analytics tracking',
                status: 'IN_REVIEW',
                projectId: dashboardProject.id,
                updatedAt: new Date(),
            },
        }),

        // TODO tasks (3)
        prisma.task.create({
            data: {
                title: 'Design feedback UI components',
                status: 'TODO',
                projectId: vanguardProject.id,
                updatedAt: daysAgo(2),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Setup production deployment pipeline',
                status: 'TODO',
                projectId: dashboardProject.id,
                updatedAt: daysAgo(1),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Optimize database queries',
                status: 'TODO',
                projectId: vanguardProject.id,
                updatedAt: new Date(),
            },
        }),
    ]);

    console.log(`✅ Created 12 tasks (4 DONE, 3 IN_PROGRESS, 2 IN_REVIEW, 3 TODO)\n`);

    // ============================================================
    // 4. CREATE PEER FEEDBACK (8 entries)
    // ============================================================
    console.log('💬 Creating feedback...');

    await prisma.feedback.createMany({
        data: [
            // Rating 5 (2 entries)
            {
                rating: 5,
                comment: 'Excellent code reviews, very detail-oriented and catches edge cases before they become issues.',
                senderId: jordan.id,
                receiverId: alex.id,
                createdAt: daysAgo(5),
            },
            {
                rating: 5,
                comment: 'Great team player, always willing to help and shares knowledge generously with the team.',
                senderId: alex.id,
                receiverId: jordan.id,
                createdAt: daysAgo(4),
            },

            // Rating 4 (3 entries)
            {
                rating: 4,
                comment: 'Good work on the API implementation, could improve on documentation and inline comments.',
                senderId: morgan.id,
                receiverId: alex.id,
                createdAt: daysAgo(3),
            },
            {
                rating: 4,
                comment: 'Solid contributions to the dashboard, would benefit from more frequent commits.',
                senderId: alex.id,
                receiverId: morgan.id,
                createdAt: daysAgo(3),
            },
            {
                rating: 4,
                comment: 'Impressive problem-solving skills, timely delivery on assigned tasks.',
                senderId: morgan.id,
                receiverId: jordan.id,
                createdAt: daysAgo(2),
            },

            // Rating 3 (2 entries)
            {
                rating: 3,
                comment: 'Sometimes misses standup meetings, but delivers quality work when engaged.',
                senderId: jordan.id,
                receiverId: morgan.id,
                createdAt: daysAgo(2),
            },
            {
                rating: 3,
                comment: 'Good technical skills but communication could be more proactive within the team.',
                senderId: alex.id,
                receiverId: morgan.id,
                createdAt: daysAgo(1),
            },

            // Rating 2 (1 entry)
            {
                rating: 2,
                comment: 'Needs to communicate blockers earlier. Had to escalate issues that could have been resolved sooner.',
                senderId: jordan.id,
                receiverId: morgan.id,
                createdAt: daysAgo(1),
            },
        ],
    });

    console.log(`✅ Created 8 feedback entries (2×5★, 3×4★, 2×3★, 1×2★)\n`);

    // ============================================================
    // 5. CREATE ENGAGEMENT LOGS (15 entries)
    // ============================================================
    console.log('📊 Creating engagement logs...');

    await prisma.engagement.createMany({
        data: [
            // Alex - Most recent activity (today) - High engagement
            { userId: alex.id, action: 'LOGIN', timestamp: randomTimeInDay(0) },
            { userId: alex.id, action: 'TASK_UPDATED', timestamp: randomTimeInDay(0) },
            { userId: alex.id, action: 'TASK_COMPLETED', timestamp: randomTimeInDay(1) },
            { userId: alex.id, action: 'FEEDBACK_SUBMITTED', timestamp: randomTimeInDay(1) },
            { userId: alex.id, action: 'LOGIN', timestamp: randomTimeInDay(2) },

            // Jordan - Regular activity
            { userId: jordan.id, action: 'LOGIN', timestamp: randomTimeInDay(0) },
            { userId: jordan.id, action: 'TASK_UPDATED', timestamp: randomTimeInDay(1) },
            { userId: jordan.id, action: 'LOGIN', timestamp: randomTimeInDay(2) },
            { userId: jordan.id, action: 'TASK_COMPLETED', timestamp: randomTimeInDay(3) },
            { userId: jordan.id, action: 'FEEDBACK_SUBMITTED', timestamp: randomTimeInDay(4) },

            // Morgan - GAP (last active 3 days ago) - AT RISK indicator
            { userId: morgan.id, action: 'LOGIN', timestamp: randomTimeInDay(3) },
            { userId: morgan.id, action: 'TASK_UPDATED', timestamp: randomTimeInDay(3) },
            { userId: morgan.id, action: 'LOGIN', timestamp: randomTimeInDay(5) },
            { userId: morgan.id, action: 'TASK_COMPLETED', timestamp: randomTimeInDay(6) },
            { userId: morgan.id, action: 'LOGIN', timestamp: randomTimeInDay(7) },
        ],
    });

    console.log(`✅ Created 15 engagement logs\n`);

    // ============================================================
    // SUMMARY
    // ============================================================
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 Summary:');
    console.log('   👥 Users:       4 (1 mentor, 3 students)');
    console.log('   📁 Projects:    2');
    console.log('   ✅ Tasks:       12 (varied statuses)');
    console.log('   💬 Feedback:    8 (peer reviews)');
    console.log('   📊 Engagements: 15 (activity logs)');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n✨ Demo data is ready for presentation!\n');
}

main()
    .catch((e) => {
        console.error('\n❌ Error during seeding:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
