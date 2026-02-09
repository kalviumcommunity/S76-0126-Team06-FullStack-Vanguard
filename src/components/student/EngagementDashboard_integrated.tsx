"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, Target, Clock } from "lucide-react";
import { formatPercentage, getEngagementColor, getEngagementBgColor } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  fetchEngagementSummary,
  fetchTasks,
  calculateWeeklyEngagement,
  calculateCompletionRate,
  type EngagementSummary,
  type Task,
} from "@/lib/api";
import { useSession } from "next-auth/react";

// ============================================
// ENGAGEMENT HEATMAP COMPONENT
// ============================================

export function EngagementHeatmap() {
  const { data: session } = useSession();
  const user = session?.user;
  const [weeklyData, setWeeklyData] = useState<Array<{ date: string; engagement: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [avgEngagement, setAvgEngagement] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!user?.id || !user?.projectId) return;

      try {
        setLoading(true);
        // Fetch tasks to calculate weekly engagement
        const tasks = await fetchTasks(user.projectId);
        const weeklyEngagement = calculateWeeklyEngagement(tasks);
        setWeeklyData(weeklyEngagement);

        const avg = Math.round(
          weeklyEngagement.reduce((sum, d) => sum + d.engagement, 0) / weeklyEngagement.length
        );
        setAvgEngagement(avg);
      } catch (err) {
        console.error("Error loading engagement data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id, user?.projectId]);

  if (!mounted || loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-6 w-48 bg-secondary/50 rounded animate-pulse mb-6" />
        <div className="h-64 bg-secondary/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Weekly Engagement</h3>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getEngagementBgColor(
              avgEngagement
            )}`}
          >
            <Activity className="h-4 w-4" />
            <span className={`font-semibold text-sm ${getEngagementColor(avgEngagement)}`}>
              {formatPercentage(avgEngagement)}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Your engagement trend this week</p>
      </div>

      {weeklyData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                }}
                formatter={(value) => `${value}%`}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>No engagement data available yet. Start completing tasks!</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// TASK PROGRESS CHART COMPONENT
// ============================================

export function TaskProgressChart() {
  const { data: session } = useSession();
  const user = session?.user;
  const [chartData, setChartData] = useState<Array<{ day: string; completed: number; total: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      if (!user?.projectId) return;

      try {
        setLoading(true);
        const tasks = await fetchTasks(user.projectId);

        // Group by day of week for the last 5 days
        const now = new Date();
        const dailyData = [];

        for (let i = 4; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));

          const dayTasks = tasks.filter((t) => {
            const updated = new Date(t.updatedAt);
            return updated >= dayStart && updated <= dayEnd;
          });

          const completed = dayTasks.filter((t) => t.status === "DONE").length;

          dailyData.push({
            day: `Day ${5 - i}`,
            completed,
            total: Math.max(dayTasks.length, completed + 1),
          });
        }

        setChartData(dailyData);
      } catch (err) {
        console.error("Error loading task progress data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.projectId]);

  if (!mounted || loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-6 w-48 bg-secondary/50 rounded animate-pulse mb-6" />
        <div className="h-64 bg-secondary/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Task Completion Rate</h3>
        <p className="text-sm text-muted-foreground">Tasks completed vs assigned this week</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: "12px" }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="completed" fill="#10b981" name="Completed" />
            <Bar dataKey="total" fill="#6b7280" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================
// PROGRESS OVERVIEW COMPONENT
// ============================================

export function ProgressOverview() {
  const { data: session } = useSession();
  const user = session?.user;
  const [stats, setStats] = useState({
    overallProgress: 0,
    engagementScore: 0,
    taskCompletion: 0,
    hoursLogged: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user?.id || !user?.projectId) return;

      try {
        setLoading(true);

        // Fetch engagement summary
        const engagement = await fetchEngagementSummary(user.id);

        // Fetch tasks for completion rate
        const tasks = await fetchTasks(user.projectId);
        const { percentage } = calculateCompletionRate(tasks);

        // Calculate overall progress (average of engagement and task completion)
        const overallProgress = Math.round((engagement.engagementScore + percentage) / 2);

        // Simulate hours logged (you can integrate with real time tracking)
        const hoursLogged = Math.min(Math.round(tasks.length * 1.5), 20);

        setStats({
          overallProgress,
          engagementScore: engagement.engagementScore,
          taskCompletion: percentage,
          hoursLogged,
        });
      } catch (err) {
        console.error("Error loading progress stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user?.id, user?.projectId]);

  const displayStats = [
    {
      label: "Overall Progress",
      value: stats.overallProgress,
      icon: Target,
      color: "bg-blue-500",
    },
    {
      label: "Engagement Score",
      value: stats.engagementScore,
      icon: Activity,
      color: "bg-purple-500",
    },
    {
      label: "Task Completion",
      value: stats.taskCompletion,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "Hours Logged",
      value: stats.hoursLogged,
      max: 20,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-card shadow-sm p-6">
            <div className="h-20 bg-secondary/50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat, i) => {
        const Icon = stat.icon;
        const percentage = stat.max ? Math.round((stat.value / stat.max) * 100) : stat.value;
        return (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">{stat.label}</h4>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {stat.value}
                {stat.max && <span className="text-lg text-muted-foreground">/{stat.max}</span>}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${percentage}%` }} />
              </div>

              <div className="text-xs text-muted-foreground">{formatPercentage(percentage)} complete</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}