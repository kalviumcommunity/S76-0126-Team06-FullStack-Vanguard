"use client";

import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
    const { data: session } = useSession();
    const [notifications] = useState(3);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = () => {
        if (!session?.user?.name) return "U";
        return session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md px-6 justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    )}
                </Button>

                {/* User Menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
                    >
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:shadow-emerald-500/20 transition-all border border-white/20">
                            {getInitials()}
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showUserMenu && "rotate-180")} />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-[#0f0f0f] border border-white/10 text-white rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                <p className="text-xs leading-none text-gray-400 mt-1">{session?.user?.email}</p>
                                <div className="mt-2 text-[10px] items-center uppercase tracking-wider font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded w-fit">
                                    {session?.user?.role}
                                </div>
                            </div>

                            <div className="p-1">
                                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </button>
                                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </button>
                            </div>

                            <div className="h-px bg-white/10 my-1" />

                            <div className="p-1">
                                <button
                                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-all font-medium"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Log out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
