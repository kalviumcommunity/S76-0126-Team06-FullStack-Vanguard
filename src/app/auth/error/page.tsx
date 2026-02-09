'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-2xl text-center">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>

                <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
                <p className="text-muted-foreground mb-6">
                    {error === 'Configuration' ? 'There is a problem with the server configuration.' :
                        error === 'AccessDenied' ? 'You do not have permission to sign in.' :
                            'An unexpected error occurred during authentication.'}
                </p>

                {error && (
                    <div className="bg-muted p-3 rounded-lg text-xs font-mono mb-8">
                        Error Code: {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Button asChild>
                        <Link href="/auth/login">Try Signing In Again</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/" className="flex items-center justify-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
