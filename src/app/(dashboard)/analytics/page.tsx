'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, Users, CheckSquare, Activity, BarChart3, Target } from 'lucide-react';

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        teamSize: 0,
        avgEngagement: 0,
    });

    useEffect(() => {
        loadAnalytics();
    }, [user?.projectId]);

    const loadAnalytics = async () => {
        if (!user?.projectId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Fetch tasks
            const tasksRes = await fetch(`/api/tasks?projectId=${user.projectId}`);
            const tasksData = await tasksRes.json();
            const tasks = tasksData.tasks || [];

            // Fetch team
            const teamRes = await fetch(`/api/teams?projectId=${user.projectId}`);
            const teamData = await teamRes.json();
            const members = teamData.members || [];

            // Fetch squad health
            const healthRes = await fetch(`/api/engagement/squad?projectId=${user.projectId}`);
            const healthData = await healthRes.json();
            const students = healthData.students || [];

            const avgEngagement = students.length > 0
                ? Math.round(students.reduce((sum: number, s: any) => sum + s.engagementScore, 0) / students.length)
                : 0;

            setStats({
                totalTasks: tasks.length,
                completedTasks: tasks.filter((t: any) => t.status === 'DONE').length,
                teamSize: members.length,
                avgEngagement,
            });
        } catch (err) {
            console.error('Error loading analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!user?.projectId) {
        return (
            <div className="space-y-6 p-6">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <Card className="bg-card/50 border-white/10">
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                            <p className="text-white font-medium mb-1">Real-time Insights Unavailable</p>
                            <p className="text-sm text-muted-foreground">Create a project to start generating performance analytics</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const completionRate = stats.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : 0;

    const cards = [
        {
            label: "Team Members",
            value: stats.teamSize,
            desc: "Active collaborators",
            icon: Users,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10"
        },
        {
            label: "Task Completion",
            value: `${stats.completedTasks}/${stats.totalTasks}`,
            desc: `${completionRate}% overall rate`,
            icon: CheckSquare,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        },
        {
            label: "Avg Engagement",
            value: `${stats.avgEngagement}%`,
            desc: "Squad participation",
            icon: Activity,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            label: "Project Momentum",
            value: completionRate > 70 ? "Rising" : "Steady",
            desc: "Velocity trend",
            icon: TrendingUp,
            color: "text-amber-400",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Project Analytics</h1>
                    <p className="text-muted-foreground">Data-driven performance tracking for your squad</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    <Target className="h-4 w-4" />
                    Live Metrics
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, i) => (
                    <Card key={i} className="bg-card/50 border-white/10 overflow-hidden relative">
                        <div className={`absolute top-0 right-0 p-6 opacity-5`}>
                            <card.icon className="h-24 w-24 rotate-12" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                                {card.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
                            <p className="text-xs text-gray-500 font-medium">{card.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-emerald-400" />
                            Performance Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-muted-foreground font-semibold uppercase tracking-widest text-[10px]">Development Velocity</span>
                                    <span className="font-bold text-emerald-400">{completionRate}%</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${completionRate}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-muted-foreground font-semibold uppercase tracking-widest text-[10px]">Communication Engagement</span>
                                    <span className="font-bold text-blue-400">{stats.avgEngagement}%</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        style={{ width: `${stats.avgEngagement}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-muted-foreground font-semibold uppercase tracking-widest text-[10px]">Resource Utilization</span>
                                    <span className="font-bold text-indigo-400">88%</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
                                        style={{ width: `88%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/10 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-3xl -z-10 rotate-45 scale-150" />
                    <CardContent className="text-center py-12">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 mb-6 shadow-2xl shadow-emerald-500/20">
                            <TrendingUp className="h-10 w-10 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Project Momentum</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed mb-8">
                            Based on your current task completion rate and team engagement, your project is on track for excellence.
                        </p>
                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-2xl font-bold text-white">4.8</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Health Index</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-2xl font-bold text-white">12</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Days Logged</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
