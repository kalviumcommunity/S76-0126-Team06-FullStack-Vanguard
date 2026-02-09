'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EngagementHeatmap, TaskProgressChart, ProgressOverview } from '@/components/student/EngagementDashboard_integrated';
import { RecentActivity, UpcomingTasks } from '@/components/student/ActivityPanel_integrated';
import { useSession } from "next-auth/react";
import { Rocket, Plus, Shield, Users, Loader2 } from 'lucide-react';
import { createProject } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
    const { data: session, status } = useSession();
    const user = session?.user;
    const loading = status === "loading";
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        try {
            setIsCreating(true);
            await createProject(projectName, projectDesc);
            // Refresh to get updated session with projectId
            router.refresh();
            window.location.reload(); // Hard reload to ensure all contexts catch the new projectId
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('Failed to create project. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <span className="ml-3 text-muted-foreground">Loading your workspace...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Professional Welcome State */}
            <div className="bg-gradient-to-br from-emerald-600/10 via-indigo-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
                            Welcome back, {user?.name?.split(' ')[0]}
                        </h1>
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-medium uppercase tracking-wider">
                                <Shield className="w-3 h-3 mr-1.5" />
                                Student Portal
                            </span>
                            <span className="inline-flex items-center px-3 py-1 bg-white/5 text-gray-400 rounded-full border border-white/10 text-xs font-medium uppercase tracking-wider">
                                <Users className="w-3 h-3 mr-1.5" />
                                {user?.mentorId ? 'Mentor Assigned' : 'Awaiting Mentor'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {!user?.projectId ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 p-8 transition-all hover:border-emerald-500/30">
                        <div className="h-20 w-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 text-3xl shadow-2xl shadow-emerald-500/20 rotate-3">
                            🚀
                        </div>
                        <h2 className="text-2xl font-bold mb-3 tracking-tight text-white">Initialize Workspace</h2>
                        <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                            Create your target project to unlock the full potential of Vanguard's engagement tracking system.
                        </p>

                        {!showCreateForm ? (
                            <Button
                                onClick={() => setShowCreateForm(true)}
                                className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create My Project
                            </Button>
                        ) : (
                            <form onSubmit={handleCreateProject} className="w-full max-w-sm space-y-4">
                                <Input
                                    placeholder="Project Name (e.g., Vanguard v3)"
                                    className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-white focus:ring-2 focus:ring-emerald-500/50"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required
                                    disabled={isCreating}
                                />
                                <Textarea
                                    placeholder="Small description (optional)"
                                    className="bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 min-h-[100px] resize-none"
                                    value={projectDesc}
                                    onChange={(e) => setProjectDesc(e.target.value)}
                                    disabled={isCreating}
                                />
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 rounded-xl h-12 border-white/10 hover:bg-white/5 text-gray-400"
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                                        disabled={isCreating}
                                    >
                                        {isCreating ? 'Initializing...' : 'Launch Project'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="bg-muted/5 border rounded-3xl p-8 flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">What's next?</h3>
                        <ul className="space-y-4">
                            {[
                                { title: 'Define Objectives', desc: 'Set clear milestones for your project flow.' },
                                { title: 'Assigned Mentorship', desc: 'Collaborate with your mentor via feedback loops.' },
                                { title: 'Track Engagement', desc: 'Keep your activity high to maintain "Excellent" status.' }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">Project Overview</h2>
                            <p className="text-sm text-muted-foreground">Real-time metrics from your active deliverables</p>
                        </div>
                    </div>

                    <ProgressOverview />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <EngagementHeatmap />
                        <TaskProgressChart />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <UpcomingTasks />
                        <RecentActivity />
                    </div>
                </>
            )}
        </div>
    );
}
