'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface StudentHealth {
    userId: string;
    email: string;
    name?: string;
    status: 'EXCELLENT' | 'NORMAL' | 'AT_RISK';
    engagementScore: number;
    taskCompletion: number;
    feedbackScore: number;
    lastActive: string;
    flags: string[];
}

export default function SquadHealthPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [students, setStudents] = useState<StudentHealth[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSquadHealth();
    }, [user?.projectId]);

    const loadSquadHealth = async () => {
        if (!user?.projectId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/engagement/squad?projectId=${user.projectId}`);

            if (!response.ok) throw new Error('Failed to fetch squad health');

            const data = await response.json();
            setStudents(data.students || []);
        } catch (err: any) {
            console.error('Error loading squad health:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'AT_RISK': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user?.projectId) {
        return (
            <div className="space-y-6 p-6">
                <h1 className="text-3xl font-bold">Squad Health</h1>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">No project yet</p>
                            <p className="text-sm text-muted-foreground">Create a project to see your squad health metrics</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const avgEngagement = students.length > 0
        ? Math.round(students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length)
        : 0;

    const atRiskCount = students.filter(s => s.status === 'AT_RISK').length;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Squad Health</h1>
                    <p className="text-muted-foreground">Monitor team engagement and performance</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">Active collaborators</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{avgEngagement}%</div>
                        <p className="text-xs text-muted-foreground">Squad activity level</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-500">{atRiskCount}</div>
                        <p className="text-xs text-muted-foreground">Members need attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                    {students.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No team members yet. Invite collaborators to your project.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {students.map((student) => (
                                <div key={student.userId} className="p-4 border rounded-lg hover:bg-muted/50 transition">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                                                {(student.name || student.email)[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium">{student.name || student.email.split('@')[0]}</p>
                                                <p className="text-xs text-muted-foreground">{student.email}</p>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(student.status)}>
                                            {student.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full transition-all"
                                                    style={{ width: `${student.engagementScore}%` }}
                                                />
                                            </div>
                                            <p className="text-xs font-medium mt-1">{student.engagementScore}%</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full transition-all"
                                                    style={{ width: `${student.taskCompletion}%` }}
                                                />
                                            </div>
                                            <p className="text-xs font-medium mt-1">{student.taskCompletion}%</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Feedback</p>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full transition-all"
                                                    style={{ width: `${student.feedbackScore}%` }}
                                                />
                                            </div>
                                            <p className="text-xs font-medium mt-1">{student.feedbackScore}%</p>
                                        </div>
                                    </div>

                                    {student.flags.length > 0 && (
                                        <div className="mt-3 space-y-1">
                                            {student.flags.map((flag, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-orange-600">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    <span>{flag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
