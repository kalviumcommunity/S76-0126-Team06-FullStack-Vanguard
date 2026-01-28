"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const engagementData = [
  { week: "Week 1", "Squad A": 85, "Squad B": 62, "Squad C": 78 },
  { week: "Week 2", "Squad A": 88, "Squad B": 65, "Squad C": 82 },
  { week: "Week 3", "Squad A": 92, "Squad B": 58, "Squad C": 80 },
  { week: "Week 4", "Squad A": 94, "Squad B": 62, "Squad C": 85 },
];

const taskCompletionData = [
  { name: "Squad A", completed: 45, pending: 5 },
  { name: "Squad B", completed: 28, pending: 12 },
  { name: "Squad C", completed: 38, pending: 8 },
];

const feedbackDistribution = [
  { name: "Positive", value: 65, fill: "#10b981" },
  { name: "Neutral", value: 20, fill: "#6b7280" },
  { name: "Constructive", value: 15, fill: "#3b82f6" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Deep dive into your teams' performance metrics
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Teams</p>
          <p className="text-3xl font-bold text-foreground">3</p>
          <p className="text-xs text-blue-600 mt-2">All active</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Students</p>
          <p className="text-3xl font-bold text-foreground">15</p>
          <p className="text-xs text-green-600 mt-2">Engaged</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm text-muted-foreground mb-2">Avg Engagement</p>
          <p className="text-3xl font-bold text-foreground">75%</p>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last week</p>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm text-muted-foreground mb-2">Tasks Completed</p>
          <p className="text-3xl font-bold text-foreground">111</p>
          <p className="text-xs text-green-600 mt-2">89% completion rate</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engagement Trend */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Squad A" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Squad B" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Squad C" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Task Completion</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" fill="#ef4444" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feedback Distribution */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Feedback Distribution</h3>
        <div className="h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={feedbackDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {feedbackDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">🎯 Key Insights</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Squad A shows excellent engagement trajectory</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-600 font-bold">!</span>
              <span>Squad B needs intervention - declining engagement</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Overall feedback sentiment is positive (65%)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">→</span>
              <span>Task completion rate improved 12% from Week 1</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">📋 Recommendations</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="text-purple-600">→</span>
              <span>Schedule check-in with Squad B lead about low engagement</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600">→</span>
              <span>Share best practices from Squad A with other teams</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600">→</span>
              <span>Increase peer feedback sessions for better collaboration</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600">→</span>
              <span>Celebrate achievements with personalized recognition</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
