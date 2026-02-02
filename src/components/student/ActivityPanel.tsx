"use client";

import { CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";
import { getStatusColor, getRelativeTime, getPriorityColor } from "@/lib/utils";

// Mock data with fixed dates to prevent hydration mismatch
const getRecentActivities = () => [
  {
    id: 1,
    type: "TASK_COMPLETED",
    description: "Completed task: API Integration",
    time: new Date(2025, 0, 30, 14, 0),
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "FEEDBACK_RECEIVED",
    description: "Received feedback from Sarah on Design Review",
    time: new Date(2025, 0, 30, 12, 0),
    icon: Zap,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "DEADLINE_WARNING",
    description: "Deadline approaching for Frontend Implementation",
    time: new Date(2025, 0, 30, 10, 0),
    icon: AlertCircle,
    color: "text-orange-500",
  },
  {
    id: 4,
    type: "TASK_ASSIGNED",
    description: "New task assigned: Database Schema Design",
    time: new Date(2025, 0, 29, 14, 0),
    icon: Clock,
    color: "text-purple-500",
  },
];

export function RecentActivity() {
  const recentActivities = getRecentActivities();
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Your latest engagement signals</p>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0">
              <div className="shrink-0 pt-1">
                <Icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(activity.time)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UpcomingTasks() {
  const tasks = [
    {
      id: 1,
      title: "API Documentation",
      project: "Squad Portal",
      dueDate: new Date(2025, 1, 1),
      priority: "HIGH",
      status: "IN_PROGRESS",
    },
    {
      id: 2,
      title: "Unit Tests",
      project: "Squad Portal",
      dueDate: new Date(2025, 1, 3),
      priority: "MEDIUM",
      status: "TODO",
    },
    {
      id: 3,
      title: "Code Review Session",
      project: "Analytics Dashboard",
      dueDate: new Date(2025, 1, 31),
      priority: "HIGH",
      status: "TODO",
    },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Upcoming Tasks</h3>
        <p className="text-sm text-muted-foreground">Tasks due in the next 7 days</p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 rounded-lg border bg-secondary/50 hover:bg-secondary/80 transition cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{task.title}</h4>
                <p className="text-xs text-muted-foreground">{task.project}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  task.priority === "HIGH"
                    ? "bg-red-500/20 text-red-600"
                    : task.priority === "MEDIUM"
                      ? "bg-yellow-500/20 text-yellow-600"
                      : "bg-green-500/20 text-green-600"
                }`}
              >
                {task.priority}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  task.status === "COMPLETED"
                    ? "bg-green-500/20 text-green-600"
                    : task.status === "IN_PROGRESS"
                      ? "bg-blue-500/20 text-blue-600"
                      : "bg-gray-500/20 text-gray-600"
                }`}
              >
                {task.status.replace("_", " ")}
              </span>
              <span className="text-xs text-muted-foreground">
                Due {getRelativeTime(task.dueDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
