'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Mail, Calendar } from 'lucide-react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    engagement?: number;
    tasksCompleted?: number;
    joinedDate: string;
}

export default function TeamsPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTeamMembers();
    }, [user?.projectId]);

    const loadTeamMembers = async () => {
        if (!user?.projectId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/teams?projectId=${user.projectId}`);

            if (!response.ok) throw new Error('Failed to load team members');

            const data = await response.json();
            setMembers(data.members || []);
        } catch (err: any) {
            console.error('Error loading team:', err);
            setError(err.message);
        } finally {
            setLoading(false);
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
                <h1 className="text-3xl font-bold">Team</h1>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">No project yet</p>
                            <p className="text-sm text-muted-foreground">Create a project to see your team members</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team</h1>
                    <p className="text-muted-foreground">Your project collaborators</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {members.length} Members
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {members.length === 0 ? (
                    <Card className="col-span-full border-dashed border-white/10 bg-transparent">
                        <CardContent className="pt-6">
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="h-10 w-10 mx-auto mb-4 opacity-20" />
                                <p>No team members yet. Invite collaborators to join your project.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    members.map((member) => (
                        <Card key={member.id} className="bg-card/50 border-white/10 hover:border-emerald-500/30 transition-all group">
                            <CardHeader className="pb-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-400 text-xl group-hover:scale-110 transition-transform">
                                        {member.name ? member.name[0].toUpperCase() : (member.email ? member.email[0].toUpperCase() : "?")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg font-bold truncate text-white">{member.name || "Unnamed User"}</CardTitle>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Badge variant="outline" className="capitalize bg-white/5 border-white/10 text-gray-400">
                                        {member.role.toLowerCase()}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="space-y-4">
                                    {member.engagement !== undefined && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground uppercase tracking-widest font-semibold">Engagement</span>
                                                <span className="font-bold text-emerald-400">{member.engagement}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                                                    style={{ width: `${member.engagement}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm py-2 border-y border-white/5">
                                        <span className="text-muted-foreground">Tasks Completed</span>
                                        <span className="font-bold text-white">{member.tasksCompleted || 0}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest pt-2">
                                        <Calendar className="h-3 w-3" />
                                        Joined {new Date(member.joinedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
