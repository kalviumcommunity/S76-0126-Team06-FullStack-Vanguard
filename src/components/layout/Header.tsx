"use client";

import { Bell, Settings, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications] = useState(3);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    // Get user initials
    const getInitials = () => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-15 justify-between">
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-secondary">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="h-8 w-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-sm font-bold hover:shadow-md transition"
                    >
                        {getInitials()}
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-card border border-secondary rounded-lg shadow-lg py-2 z-50">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-secondary">
                                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[#10b981]/20 text-[#10b981] capitalize">
                                    {user?.role}
                                </span>
                            </div>
                            
                            <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary">
                                <User className="h-4 w-4" />
                                My Profile
                            </a>
                            <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary">
                                <Settings className="h-4 w-4" />
                                Settings
                            </a>
                            <hr className="my-2 border-secondary" />
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-500/10"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
