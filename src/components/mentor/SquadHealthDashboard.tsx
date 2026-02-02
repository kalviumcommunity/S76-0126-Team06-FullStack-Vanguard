"use client";

import { AlertCircle, TrendingDown, Users, CheckCircle } from "lucide-react";
import { getHealthStatusColor, getHealthStatusBgColor, formatPercentage } from "@/lib/utils";
import type { StudentHealthStatus } from "@/lib/types";

// Mock data with fixed dates to prevent hydration mismatch
const getSquadMembers = (): StudentHealthStatus[] => [
  {
    userId: "1",
    engagementScore: 92,
    taskCompletion: 95,
    feedbackScore: 88,
    status: "EXCELLENT",
    lastActive: new Date(2025, 0, 30, 15, 30),
    flags: [],
  },
  {
    userId: "2",
    engagementScore: 78,
    taskCompletion: 82,
    feedbackScore: 75,
    status: "NORMAL",
    lastActive: new Date(2025, 0, 30, 14, 0),
    flags: [],
  },
  {
    userId: "3",
    engagementScore: 45,
    taskCompletion: 38,
    feedbackScore: 42,
    status: "AT_RISK",
    lastActive: new Date(2025, 0, 29, 16, 0),
    flags: ["Low engagement", "Missed deadline", "No recent updates"],
  },
  {
    userId: "4",
    engagementScore: 88,
    taskCompletion: 91,
    feedbackScore: 86,
    status: "EXCELLENT",
    lastActive: new Date(2025, 0, 30, 17, 0),
    flags: [],
  },
  {
    userId: "5",
    engagementScore: 52,
    taskCompletion: 55,
    feedbackScore: 48,
    status: "AT_RISK",
    lastActive: new Date(2025, 0, 28, 16, 0),
    flags: ["Declining engagement", "Struggling with implementation"],
  },
];

export function SquadHealthMap() {
  const squadMembers = getSquadMembers();
  const atRiskCount = squadMembers.filter((m) => m.status === "AT_RISK").length;
  const avgEngagement =
    Math.round(squadMembers.reduce((sum, m) => sum + m.engagementScore, 0) / squadMembers.length);
  const avgCompletion =
    Math.round(squadMembers.reduce((sum, m) => sum + m.taskCompletion, 0) / squadMembers.length);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Squad Health Overview</h3>
        <p className="text-sm text-muted-foreground">Real-time engagement metrics for your team</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-secondary/50 border border-secondary">
          <p className="text-xs text-muted-foreground mb-1">Avg Engagement</p>
          <p className="text-2xl font-bold text-blue-500">{formatPercentage(avgEngagement)}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50 border border-secondary">
          <p className="text-xs text-muted-foreground mb-1">Task Completion</p>
          <p className="text-2xl font-bold text-green-500">{formatPercentage(avgCompletion)}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50 border border-secondary">
          <p className="text-xs text-muted-foreground mb-1">At Risk</p>
          <p className="text-2xl font-bold text-red-500">{atRiskCount}</p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground mb-3">Team Members</p>
        {squadMembers.map((member) => (
          <div
            key={member.userId}
            className={`p-4 rounded-lg border cursor-pointer transition ${
              member.status === "AT_RISK"
                ? "bg-red-500/10 border-red-500/50 hover:bg-red-500/20"
                : "bg-secondary/50 border-secondary hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full ${getHealthStatusBgColor(member.status)} flex items-center justify-center`}
                >
                  {member.status === "AT_RISK" ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className={`h-5 w-5 ${getHealthStatusColor(member.status)}`} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">Student {member.userId}</p>
                  <p
                    className={`text-xs font-semibold ${getHealthStatusColor(member.status)}`}
                  >
                    {member.status}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                Active {getRelativeTime(member.lastActive)}
              </span>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <ScoreBar label="Engagement" value={member.engagementScore} />
              <ScoreBar label="Tasks" value={member.taskCompletion} />
              <ScoreBar label="Feedback" value={member.feedbackScore} />
            </div>

            {/* Flags */}
            {member.flags && member.flags.length > 0 && (
              <div className="text-xs space-y-1">
                {member.flags.map((flag, i) => (
                  <div key={i} className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            value >= 80
              ? "bg-green-500"
              : value >= 60
                ? "bg-yellow-500"
                : value >= 40
                  ? "bg-orange-500"
                  : "bg-red-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs font-semibold mt-0.5">{value}%</p>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function InterventionToolbox() {
  const interventions = [
    {
      id: 1,
      student: "Student 3",
      severity: "HIGH",
      message: "Low engagement detected. Consider scheduling a check-in.",
      action: "Schedule Meeting",
    },
    {
      id: 2,
      student: "Student 5",
      severity: "HIGH",
      message: "Not responding to feedback. May need additional support.",
      action: "Send Message",
    },
    {
      id: 3,
      student: "Student 2",
      severity: "MEDIUM",
      message: "Task completion rate is declining.",
      action: "Review Progress",
    },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Intervention Alerts</h3>
        <p className="text-sm text-muted-foreground">Students who may need support</p>
      </div>

      <div className="space-y-3">
        {interventions.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border ${
              item.severity === "HIGH"
                ? "bg-red-500/10 border-red-500/50"
                : "bg-yellow-500/10 border-yellow-500/50"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">{item.student}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                  item.severity === "HIGH"
                    ? "bg-red-500/20 text-red-600"
                    : "bg-yellow-500/20 text-yellow-600"
                }`}
              >
                {item.severity}
              </span>
            </div>
            <button className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition">
              {item.action} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
