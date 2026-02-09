'use client';

import * as React from "react"
import { CalendarIcon, CheckCircle2, Circle, Clock } from "lucide-react"

import { cn, getRelativeTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Task {
    id: string
    title: string
    description?: string | null
    status: string
    priority: string
    projectId: string
    creatorId: string
    createdAt: Date | string
    creator?: {
        name?: string | null
        email: string
    }
}

interface TaskCardProps {
    task: Task
    onStatusChange: (taskId: string, newStatus: string) => void
    showActions?: boolean
}

export function TaskCard({ task, onStatusChange, showActions = true }: TaskCardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "TODO":
                return <Badge variant="outline" className="bg-slate-100 text-slate-700">To Do</Badge>
            case "IN_PROGRESS":
                return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
            case "COMPLETED":
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "CRITICAL": return "text-red-500"
            case "HIGH": return "text-orange-500"
            case "MEDIUM": return "text-yellow-500"
            case "LOW": return "text-green-500"
            default: return "text-gray-500"
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{task.creator?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {getRelativeTime(new Date(task.createdAt))}
                            </span>
                        </div>
                    </div>
                    {getStatusBadge(task.status)}
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description || "No description provided."}
                </p>
            </CardContent>
            {showActions && task.status !== "COMPLETED" && (
                <CardFooter className="pt-0 flex justify-end gap-2">
                    {task.status === "TODO" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8"
                            onClick={() => onStatusChange(task.id, "IN_PROGRESS")}
                        >
                            Start Task
                        </Button>
                    )}
                    {task.status === "IN_PROGRESS" && (
                        <Button
                            size="sm"
                            className="text-xs h-8 bg-green-600 hover:bg-green-700"
                            onClick={() => onStatusChange(task.id, "COMPLETED")}
                        >
                            Complete
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}
