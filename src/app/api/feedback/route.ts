import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Sentiment, FeedbackCategory } from '@prisma/client';

/**
 * GET /api/feedback/received?userId={id}
 * Fetch feedback received by a user
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || session.user.id;

        const feedback = await prisma.feedback.findMany({
            where: { receiverId: userId },
            include: {
                sender: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Handle anonymity: Scrub sender info if isAnonymous is true
        const sanitizedFeedback = feedback.map(f => ({
            ...f,
            sender: f.isAnonymous ? null : f.sender
        }));

        return NextResponse.json({ feedback: sanitizedFeedback });
    } catch (error) {
        console.error('GET /api/feedback error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/feedback/submit
 * Submit feedback
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { receiverId, rating, comment, sentiment, category, isAnonymous } = body;

        // Validation
        if (!receiverId || rating === undefined || !comment || !sentiment || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const feedback = await prisma.feedback.create({
            data: {
                receiverId,
                senderId: session.user.id,
                rating: Number(rating),
                comment,
                sentiment: sentiment as Sentiment,
                category: category as FeedbackCategory,
                isAnonymous: Boolean(isAnonymous),
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        return NextResponse.json({
            success: true,
            feedback: {
                ...feedback,
                sender: feedback.isAnonymous ? null : feedback.sender
            }
        }, { status: 201 });
    } catch (error) {
        console.error('POST /api/feedback/submit error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

