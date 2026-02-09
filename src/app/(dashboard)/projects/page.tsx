'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FolderOpen, Calendar, Users, Plus, X } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
    _count?: {
        members: number;
        tasks: number;
    };
}

export default function ProjectsPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProject();
    }, [user?.projectId]);

    const loadProject = async () => {
        if (!user?.projectId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/projects?projectId=${user.projectId}`);

            if (!response.ok) throw new Error('Failed to load project');

            const data = await response.json();
            setProject(data);
        } catch (err: any) {
            console.error('Error loading project:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        try {
            setCreating(true);
            setError(null);

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: projectName.trim(),
                    description: projectDesc.trim() || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create project');
            }

            await response.json();

            // Close modal
            setShowCreateModal(false);
            setProjectName('');
            setProjectDesc('');

            // Reload page to update session
            window.location.reload();
        } catch (err: any) {
            console.error('Error creating project:', err);
            setError(err.message);
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your active projects</p>
                </div>
                {!project && (
                    <Button onClick={() => setShowCreateModal(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Button>
                )}
            </div>

            {!project ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Project Yet</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Create your first project to start tracking progress
                            </p>
                            <Button onClick={() => setShowCreateModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Project
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-card/50 border-white/10">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">{project.name}</CardTitle>
                                {project.description && (
                                    <p className="text-muted-foreground mt-2 max-w-2xl">{project.description}</p>
                                )}
                            </div>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                ACTIVE
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3 mt-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{project._count?.members || 0}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Members</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <FolderOpen className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{project._count?.tasks || 0}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Tasks</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">
                                        {new Date(project.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Created On</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10 shadow-2xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold">Create New Project</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={creating}
                                    className="rounded-full hover:bg-white/5"
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleCreateProject} className="space-y-5">
                                {error && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">
                                        Project Name <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="e.g., Vanguard Platform"
                                        required
                                        disabled={creating}
                                        className="bg-white/5 border-white/10 rounded-xl px-4 h-12 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 ml-1">
                                        Description
                                    </label>
                                    <Textarea
                                        value={projectDesc}
                                        onChange={(e) => setProjectDesc(e.target.value)}
                                        placeholder="What is this project about?"
                                        rows={4}
                                        disabled={creating}
                                        className="bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none"
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={creating}
                                        className="flex-1 rounded-xl h-12 font-semibold border-white/10 hover:bg-white/5 text-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-1 rounded-xl h-12 font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                    >
                                        {creating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Project'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Add missing icon
import { AlertTriangle } from 'lucide-react';
