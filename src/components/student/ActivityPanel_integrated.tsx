"use client";

import { CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";
import { getStatusColor, getRelativeTime, getPriorityColor } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchTasks, tasksToActivities, type Task } from "@/lib/api";
import { useSession } from "next-auth/react";

// ============================================
// RECENT ACTIVITY COMPONENT
// ============================================

export function RecentActivity() {
  const { data: session } = useSession();
  const user = session?.user;
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: string;
    description: string;
    time: Date;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadActivities() {
      if (!user?.projectId) return;

      try {
        setLoading(true);
        setError(null);
        const tasks = await fetchTasks(user.projectId);
        const activityFeed = tasksToActivities(tasks);
        setActivities(activityFeed);
      } catch (err) {
        setError("Unable to load activity feed");
        console.error("Error loading activities:", err);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [user?.projectId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "TASK_COMPLETED":
        return { icon: CheckCircle, color: "text-green-500" };
      case "FEEDBACK_RECEIVED":
        return { icon: Zap, color: "text-blue-500" };
      case "DEADLINE_WARNING":
        return { icon: AlertCircle, color: "text-orange-500" };
      case "TASK_ASSIGNED":
        return { icon: Clock, color: "text-purple-500" };
      default:
        return { icon: Clock, color: "text-gray-500" };
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-6 w-40 bg-secondary/50 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 pb-4">
              <div className="w-5 h-5 bg-secondary/50 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-secondary/50 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-secondary/50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Your latest engagement signals</p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (activities.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Your latest engagement signals</p>
        </div>
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent activity</p>
          <p className="text-sm text-muted-foreground mt-2">
            Complete tasks to see your activity here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Your latest engagement signals</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon: Icon, color } = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0">
              <div className="shrink-0 pt-1">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getRelativeTime(activity.time)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// UPCOMING TASKS COMPONENT
// ============================================

export function UpcomingTasks() {
  const { data: session } = useSession();
  const user = session?.user;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUpcomingTasks() {
      if (!user?.projectId) return;

      try {
        setLoading(true);
        setError(null);
        const allTasks = await fetchTasks(user.projectId);

        // Filter for upcoming tasks (due in next 7 days, not completed)
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcoming = allTasks
          .filter((task) => {
            if (task.status === "DONE") return false;
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate >= now && dueDate <= sevenDaysFromNow;
          })
          .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
          .slice(0, 5); // Show max 5 tasks

        setTasks(upcoming);
      } catch (err) {
        setError("Unable to load upcoming tasks");
        console.error("Error loading upcoming tasks:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUpcomingTasks();
  }, [user?.projectId]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-6 w-40 bg-secondary/50 rounded animate-pulse mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-secondary/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Upcoming Tasks</h3>
          <p className="text-sm text-muted-foreground">Tasks due in the next 7 days</p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Upcoming Tasks</h3>
          <p className="text-sm text-muted-foreground">Tasks due in the next 7 days</p>
        </div>
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground">No upcoming deadlines</p>
          <p className="text-sm text-muted-foreground mt-2">
            You're all caught up! 🎉
          </p>
        </div>
      </div>
    );
  }

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
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${task.priority === "CRITICAL"
                  ? "bg-red-500/20 text-red-600"
                  : task.priority === "HIGH"
                    ? "bg-orange-500/20 text-orange-600"
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
                className={`text-xs font-medium px-2 py-1 rounded ${task.status === "DONE"
                  ? "bg-green-500/20 text-green-600"
                  : task.status === "IN_PROGRESS"
                    ? "bg-blue-500/20 text-blue-600"
                    : task.status === "IN_REVIEW"
                      ? "bg-purple-500/20 text-purple-600"
                      : "bg-gray-500/20 text-gray-600"
                  }`}
              >
                {task.status.replace("_", " ")}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {getRelativeTime(new Date(task.dueDate!))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}