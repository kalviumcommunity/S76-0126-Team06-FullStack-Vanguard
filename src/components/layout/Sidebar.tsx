"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    MessageSquare,
    TrendingUp,
    Settings,
    LogOut,
    Zap,
    FolderOpen
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const studentNavigation = [
    { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Squad Health", href: "/squad-health", icon: Zap },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
];

const mentorNavigation = [
    { name: "Squad Health", href: "/squad-health", icon: Zap },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const role = session?.user?.role || "STUDENT";
    const navigation = role === "STUDENT" ? studentNavigation : mentorNavigation;

    return (
        <div className="flex h-screen w-64 flex-col border-r border-white/10 bg-[#0a0a0a] text-white">
            <div className="flex h-16 items-center border-b border-white/10 px-6">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl">Vanguard</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-6">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-white/10 text-emerald-400"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400"
                                )} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-white/10 p-4 space-y-1">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                >
                    <Settings className="h-5 w-5 text-gray-500" />
                    Settings
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
