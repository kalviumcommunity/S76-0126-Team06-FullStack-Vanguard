'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, CheckSquare, Activity, AlertTriangle, MessageSquare, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatPercentage, getEngagementColor, getEngagementBgColor } from '@/lib/utils';
import { fetchSquadHealth, type StudentHealthStatus } from '@/lib/api';

export default function MentorDashboard() {
    const { data: session, status } = useSession();
    const user = session?.user;
    const authLoading = status === "loading";
    const router = useRouter();
    const [students, setStudents] = useState<StudentHealthStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        } else if (user) {
            if (user.role !== 'MENTOR') {
                router.push('/dashboard');
                return;
            }
            loadSquadHealth();
        }
    }, [user, authLoading, router]);

    const loadSquadHealth = async () => {
        try {
            setLoading(true);
            const data = await fetchSquadHealth(''); // projectId is optional now as it filters by mentorId in backend
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch squad health', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return 'success';
            case 'NORMAL': return 'warning';
            case 'AT_RISK': return 'danger';
            default: return 'default';
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse font-medium">Analyzing squad performance...</p>
                </div>
            </div>
        );
    }

    const totalStudents = students.length;
    const atRiskCount = students.filter(s => s.status === 'AT_RISK').length;
    const avgEngagement = totalStudents > 0
        ? Math.round(students.reduce((acc, s) => acc + s.engagementScore, 0) / totalStudents)
        : 0;
    const avgCompletion = totalStudents > 0
        ? Math.round(students.reduce((acc, s) => acc + s.taskCompletion, 0) / totalStudents)
        : 0;

    return (
        <div className="min-h-screen bg-background pb-10">
            <Navbar />

            <main className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl">
                {/* Premium Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/5 via-background to-background p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mentor Command Center</h1>
                        <p className="text-muted-foreground text-lg">Real-time surveillance of student progress and engagement.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={loadSquadHealth} variant="outline" className="rounded-xl px-6">
                            <Activity className="w-4 h-4 mr-2" />
                            Refresh Intelligence
                        </Button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Assigned Students"
                        value={totalStudents}
                        icon={Users}
                        description="Active student connections"
                    />
                    <StatCard
                        title="Avg. Completion"
                        value={`${avgCompletion}%`}
                        icon={CheckSquare}
                        description="Tasks finalized across squad"
                        variant={avgCompletion > 70 ? 'success' : 'warning'}
                    />
                    <StatCard
                        title="Squad Engagement"
                        value={`${avgEngagement}%`}
                        icon={Activity}
                        description="Daily activity aggregate"
                        variant={avgEngagement > 60 ? 'success' : 'warning'}
                    />
                    <StatCard
                        title="At Risk"
                        value={atRiskCount}
                        icon={AlertTriangle}
                        description="Students needing attention"
                        variant={atRiskCount > 0 ? 'danger' : 'success'}
                    />
                </div>

                {/* Squad Health Table/Grid */}
                <Card className="border-none shadow-2xl bg-muted/5 rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-muted/10 p-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">Student Intelligence Report</CardTitle>
                            <Badge variant="outline" className="text-muted-foreground whitespace-nowrap">
                                {totalStudents} Students Monitored
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-muted/10 text-xs uppercase tracking-wider text-muted-foreground">
                                        <th className="px-6 py-4 text-left font-semibold">Student Identifier</th>
                                        <th className="px-6 py-4 text-left font-semibold">Health Status</th>
                                        <th className="px-6 py-4 text-left font-semibold">Engagement</th>
                                        <th className="px-6 py-4 text-left font-semibold">Tasks Done</th>
                                        <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {students.map((student) => (
                                        <tr key={student.userId} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary ring-2 ring-primary/20">
                                                        {student.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground truncate max-w-[200px]">{student.email.split('@')[0]}</p>
                                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-bold",
                                                        student.status === 'EXCELLENT' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                            student.status === 'NORMAL' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                                'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                    )}
                                                >
                                                    {student.status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1.5 w-32">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                                                        <span>Activity</span>
                                                        <span>{student.engagementScore}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                student.engagementScore > 70 ? "bg-emerald-500" : student.engagementScore > 40 ? "bg-amber-500" : "bg-rose-500"
                                                            )}
                                                            style={{ width: `${student.engagementScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-foreground">
                                                {formatPercentage(student.taskCompletion)}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        Feedback
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="rounded-lg hover:bg-primary/10 hover:text-primary">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Users className="h-12 w-12 text-muted-foreground/30" />
                                                    <p className="text-muted-foreground text-lg">No students assigned to your command.</p>
                                                    <p className="text-sm text-muted-foreground max-w-xs">Contact the administrator to assign students to your mentorship portal.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
