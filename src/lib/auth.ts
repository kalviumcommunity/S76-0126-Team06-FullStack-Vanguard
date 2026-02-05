import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { Role } from '@prisma/client';

// Types
export interface SessionUser {
    id: string;
    name: string | null;
    email: string;
    role: Role;
}

export interface SessionPayload {
    user: SessionUser;
    expires: string;
}

// Configuration
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_SECRET = new TextEncoder().encode(SECRET_KEY);
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const COOKIE_NAME = 'session';

/**
 * Creates a signed JWT session token
 * @param user - User data to include in the session
 * @returns Signed JWT token
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
    const expires = new Date(Date.now() + SESSION_DURATION);

    const token = await new SignJWT({ user })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expires)
        .setIssuedAt()
        .sign(JWT_SECRET);

    return token;
}

/**
 * Verifies and decodes a JWT session token
 * @param token - JWT token to verify
 * @returns Decoded session payload or null if invalid
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return verified.payload as unknown as SessionPayload;
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}

/**
 * Creates a session cookie with the given token
 * @param token - JWT token to store in cookie
 */
export async function createSession(token: string): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION / 1000, // Convert to seconds
        path: '/',
    });
}

/**
 * Deletes the session cookie
 */
export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Gets the current session from the cookie
 * @returns Session payload or null if no valid session exists
 */
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    return await verifySessionToken(token);
}

/**
 * Gets the current user from the session
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
    const session = await getSession();
    return session?.user || null;
}

/**
 * Requires authentication - throws error if not authenticated
 * Use this in API routes or server components that require auth
 * @returns Current user
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}

/**
 * Checks if user has specific role
 * @param user - User to check
 * @param allowedRoles - Roles that are allowed
 * @returns true if user has one of the allowed roles
 */
export function hasRole(user: SessionUser, allowedRoles: Role | Role[]): boolean {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
}

/**
 * Requires specific role - throws error if user doesn't have it
 * @param allowedRoles - Roles that are allowed
 * @throws Error if user doesn't have required role
 */
export async function requireRole(allowedRoles: Role | Role[]): Promise<SessionUser> {
    const user = await requireAuth();

    if (!hasRole(user, allowedRoles)) {
        throw new Error('Forbidden: Insufficient permissions');
    }

    return user;
}

/**
 * Validates email format
 * @param email - Email to validate
 * @returns true if email is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with isValid and error message
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters' };
    }

    // Optional: Add more password requirements
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character

    return { isValid: true };
}
