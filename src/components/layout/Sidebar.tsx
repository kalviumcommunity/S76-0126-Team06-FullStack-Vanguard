"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    GraduationCap,
    MessageCircle,
    Zap,
} from "lucide-react";

const studentNavigation = [
    { name: "Squad Health", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Progress", href: "/progress", icon: GraduationCap },
    { name: "Task Board", href: "/tasks", icon: BookOpen },
    { name: "Feedback", href: "/feedback", icon: MessageCircle },
    { name: "Team", href: "/team", icon: Users },
];

const mentorNavigation = [
    { name: "Squad Health", href: "/mentor/dashboard", icon: Zap },
    { name: "Teams", href: "/mentor/teams", icon: Users },
    { name: "Projects", href: "/mentor/projects", icon: BookOpen },
    { name: "Analytics", href: "/mentor/analytics", icon: LayoutDashboard },
];

interface SidebarProps {
    role?: "STUDENT" | "MENTOR";
}

export function Sidebar({ role = "STUDENT" }: SidebarProps) {
    const pathname = usePathname();
    const navigation = role === "STUDENT" ? studentNavigation : mentorNavigation;

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="h-6 w-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600" />
                    <span className="text-lg">Vanguard</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary mb-1",
                                    isActive
                                        ? "bg-secondary text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t p-4 space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-all hover:bg-secondary"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
                <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 transition-all">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
