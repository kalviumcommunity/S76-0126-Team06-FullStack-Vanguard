"use client";

import { Bell, Settings, LogOut, User } from "lucide-react";
import { useState } from "react";

export function Header() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications, setNotifications] = useState(3);

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
                        className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold hover:shadow-md transition"
                    >
                        JL
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-card border border-secondary rounded-lg shadow-lg py-2 z-50">
                            <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary">
                                <User className="h-4 w-4" />
                                My Profile
                            </a>
                            <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary">
                                <Settings className="h-4 w-4" />
                                Settings
                            </a>
                            <hr className="my-2 border-secondary" />
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-500/10">
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
