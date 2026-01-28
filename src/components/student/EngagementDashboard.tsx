"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, Target, Clock } from "lucide-react";
import { formatPercentage, getEngagementColor, getEngagementBgColor } from "@/lib/utils";

// Mock data
const weeklyData = [
  { date: "Mon", engagement: 65 },
  { date: "Tue", engagement: 72 },
  { date: "Wed", engagement: 68 },
  { date: "Thu", engagement: 85 },
  { date: "Fri", engagement: 88 },
  { date: "Sat", engagement: 45 },
  { date: "Sun", engagement: 52 },
];

const dailyTasks = [
  { day: "Day 1", completed: 3, total: 5 },
  { day: "Day 2", completed: 4, total: 5 },
  { day: "Day 3", completed: 2, total: 5 },
  { day: "Day 4", completed: 5, total: 5 },
  { day: "Day 5", completed: 4, total: 5 },
];

export function EngagementHeatmap() {
  const avgEngagement = Math.round(weeklyData.reduce((sum, d) => sum + d.engagement, 0) / weeklyData.length);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Weekly Engagement</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getEngagementBgColor(avgEngagement)}`}>
            <Activity className="h-4 w-4" />
            <span className={`font-semibold text-sm ${getEngagementColor(avgEngagement)}`}>
              {formatPercentage(avgEngagement)}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Your engagement trend this week</p>
      </div>

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
    </div>
  );
}

export function TaskProgressChart() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Task Completion Rate</h3>
        <p className="text-sm text-muted-foreground">Tasks completed vs assigned this week</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyTasks} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
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

export function ProgressOverview() {
  const stats = [
    { label: "Overall Progress", value: 76, icon: Target, color: "bg-blue-500" },
    { label: "Engagement Score", value: 72, icon: Activity, color: "bg-purple-500" },
    { label: "Task Completion", value: 84, icon: TrendingUp, color: "bg-green-500" },
    { label: "Hours Logged", value: 18, max: 20, icon: Clock, color: "bg-orange-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
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
                <div
                  className={`h-full ${stat.color} rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="text-xs text-muted-foreground">{formatPercentage(percentage)} complete</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
