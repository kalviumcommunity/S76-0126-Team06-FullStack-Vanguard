"use client";

import { Trash2, Edit2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getPriorityColor, getStatusColor, formatDate } from "@/lib/utils";

// Mock data with fixed dates to prevent hydration mismatch
const getTasksByStatus = () => ({
  TODO: [
    {
      id: 1,
      title: "Setup Database Schema",
      description: "Create PostgreSQL schema for projects and teams",
      priority: "CRITICAL",
      dueDate: new Date(2025, 1, 1),
      assignee: "Alex",
    },
    {
      id: 2,
      title: "Environment Configuration",
      description: "Setup Docker and environment variables",
      priority: "HIGH",
      dueDate: new Date(2025, 1, 2),
      assignee: "Jordan",
    },
  ],
  IN_PROGRESS: [
    {
      id: 3,
      title: "API Routes Implementation",
      description: "Implement REST API routes for teams",
      priority: "HIGH",
      dueDate: new Date(2025, 1, 31),
      assignee: "Sam",
    },
    {
      id: 4,
      title: "Frontend Dashboard",
      description: "Build student engagement dashboard",
      priority: "HIGH",
      dueDate: new Date(2025, 1, 3),
      assignee: "Riley",
    },
  ],
  IN_REVIEW: [
    {
      id: 5,
      title: "Authentication Module",
      description: "Implement role-based authentication",
      priority: "CRITICAL",
      dueDate: new Date(2025, 1, 31),
      assignee: "Morgan",
    },
  ],
  COMPLETED: [
    {
      id: 6,
      title: "Project Repository Setup",
      description: "Initialize GitHub repo and CI/CD",
      priority: "MEDIUM",
      dueDate: new Date(2025, 0, 25),
      assignee: "Casey",
    },
  ],
});

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  priority: string;
  dueDate: Date;
  assignee: string;
  onDelete?: () => void;
}

function TaskCard({ id, title, description, priority, dueDate, assignee, onDelete }: TaskCardProps) {
  const isOverdue = dueDate < new Date();

  return (
    <div className="bg-secondary/50 border border-secondary rounded-lg p-4 space-y-3 cursor-move hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-foreground text-sm leading-tight flex-1 pr-2">{title}</h4>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary/80 rounded transition">
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button onClick={onDelete} className="p-1 hover:bg-red-500/20 rounded transition">
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>

      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            priority === "CRITICAL"
              ? "bg-red-500/20 text-red-600"
              : priority === "HIGH"
                ? "bg-orange-500/20 text-orange-600"
                : priority === "MEDIUM"
                  ? "bg-yellow-500/20 text-yellow-600"
                  : "bg-green-500/20 text-green-600"
          }`}
        >
          {priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{assignee}</span>
        <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
          {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
          {formatDate(dueDate)}
        </span>
      </div>
    </div>
  );
}

export function TaskBoard() {
  const tasksByStatus = getTasksByStatus();
  const columns = [
    { key: "TODO", label: "To Do", color: "bg-slate-500/20" },
    { key: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500/20" },
    { key: "IN_REVIEW", label: "In Review", color: "bg-purple-500/20" },
    { key: "COMPLETED", label: "Done", color: "bg-green-500/20" },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Project Task Board</h3>
        <p className="text-sm text-muted-foreground">Drag to move tasks between columns</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.key} className="flex flex-col">
            <div className={`${column.color} px-4 py-2 rounded-t-lg mb-2`}>
              <h4 className="font-semibold text-sm text-foreground">
                {column.label} ({tasksByStatus[column.key as keyof typeof tasksByStatus]?.length || 0})
              </h4>
            </div>

            <div className="space-y-2 flex-1">
              {tasksByStatus[column.key as keyof typeof tasksByStatus]?.map((task) => (
                <TaskCard key={task.id} {...task} />
              )) || (
                <div className="text-xs text-muted-foreground text-center py-8">No tasks</div>
              )}
            </div>

            <button className="mt-2 w-full py-2 px-4 rounded-lg border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground transition text-sm">
              + Add Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectTimeline() {
  const milestones = [
    { name: "Database Setup", date: new Date(2025, 0, 20), status: "COMPLETED", progress: 100 },
    { name: "API Development", date: new Date(2025, 0, 27), status: "IN_PROGRESS", progress: 75 },
    { name: "Dashboard UI", date: new Date(2025, 1, 3), status: "TODO", progress: 0 },
    { name: "Testing & QA", date: new Date(2025, 1, 10), status: "TODO", progress: 0 },
    { name: "Deployment", date: new Date(2025, 1, 17), status: "TODO", progress: 0 },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Project Timeline</h3>
        <p className="text-sm text-muted-foreground">Sprint 1 Roadmap</p>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-card" />
              {i < milestones.length - 1 && <div className="w-1 h-16 bg-slate-700/50 my-1" />}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{milestone.name}</h4>
                <span className="text-xs text-muted-foreground">{formatDate(milestone.date)}</span>
              </div>

              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${
                    milestone.status === "COMPLETED"
                      ? "bg-green-500"
                      : milestone.status === "IN_PROGRESS"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                  }`}
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1">{milestone.progress}% complete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
