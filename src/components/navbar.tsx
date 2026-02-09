'use client';

import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const { data: session, status } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/auth/login' });
    };

    if (!user) return null;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4">
                {/* Brand */}
                <div className="flex items-center gap-2 font-bold text-xl text-primary cursor-pointer" onClick={() => router.push(user.role === 'MENTOR' ? '/dashboard/mentor' : '/dashboard/student')}>
                    <span>Vanguard</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-foreground">{user.name}</span>
                        <span className="text-xs uppercase tracking-wider opacity-70">({user.role})</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t bg-background p-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <div className="px-2 py-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                        <Button variant="outline" onClick={handleLogout} className="w-full justify-start gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
