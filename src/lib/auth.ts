import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                }) as any;

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    projectId: user.projectId,
                    mentorId: user.mentorId,
                    createdAt: user.createdAt,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log('[NextAuth] JWT Callback - User:', user.email);
                token.id = user.id;
                token.role = (user as any).role;
                token.projectId = (user as any).projectId || null;
                token.mentorId = (user as any).mentorId || null;
                token.createdAt = (user as any).createdAt;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                console.log('[NextAuth] Session Callback - Role:', token.role);
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.projectId = token.projectId;
                session.user.mentorId = token.mentorId;
                (session.user as any).createdAt = token.createdAt;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || 'supersecretkeyshouldbeenv', // Fallback for dev
};
