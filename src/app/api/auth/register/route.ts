import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['STUDENT', 'MENTOR']),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password, role } = result.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and profile in a transaction
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: role as 'STUDENT' | 'MENTOR',
                },
            });

            if (role === 'STUDENT') {
                await tx.studentProfile.create({
                    data: { userId: newUser.id }
                });
            } else if (role === 'MENTOR') {
                await tx.mentorProfile.create({
                    data: { userId: newUser.id }
                });
            }

            return newUser;
        });

        // Remove password from response safely
        const { password: _password, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
