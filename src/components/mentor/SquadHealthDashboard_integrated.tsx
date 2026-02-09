"use client";

import { AlertCircle, TrendingDown, Users, CheckCircle } from "lucide-react";
import { getHealthStatusColor, getHealthStatusBgColor, formatPercentage, getRelativeTime } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchSquadHealth, type StudentHealthStatus } from "@/lib/api";
import { useSession } from "next-auth/react";


export function SquadHealthMap() {
  const { data: session } = useSession();
  const user = session?.user;
  const [squadMembers, setSquadMembers] = useState<StudentHealthStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSquadHealth() {
      if (!user?.projectId) return;

      try {
        setLoading(true);
        setError(null);
        const healthData = await fetchSquadHealth(user.projectId);
        setSquadMembers(healthData);
      } catch (err) {
        setError("Unable to load squad health data");
        console.error("Error loading squad health:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSquadHealth();
  }, [user?.projectId]);

  const atRiskCount = squadMembers.filter((m) => m.status === "AT_RISK").length;
  const avgEngagement = squadMembers.length > 0
    ? Math.round(squadMembers.reduce((sum, m) => sum + m.engagementScore, 0) / squadMembers.length)
    : 0;
  const avgCompletion = squadMembers.length > 0
    ? Math.round(squadMembers.reduce((sum, m) => sum + m.taskCompletion, 0) / squadMembers.length)
    : 0;

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-6 w-48 bg-secondary/50 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-secondary/50 rounded animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-secondary/50 rounded animate-pulse" />
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
          <h3 className="text-lg font-semibold mb-1">Squad Health Overview</h3>
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
  if (squadMembers.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Squad Health Overview</h3>
          <p className="text-sm text-muted-foreground">Real-time engagement metrics for your team</p>
        </div>
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No team members found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Team members' health metrics will appear here
          </p>
        </div>
      </div>
    );
  }

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
            className={`p-4 rounded-lg border cursor-pointer transition ${member.status === "AT_RISK"
                ? "bg-red-500/10 border-red-500/50 hover:bg-red-500/20"
                : "bg-secondary/50 border-secondary hover:bg-secondary/80"
              }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full ${getHealthStatusBgColor(
                    member.status
                  )} flex items-center justify-center`}
                >
                  {member.status === "AT_RISK" ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className={`h-5 w-5 ${getHealthStatusColor(member.status)}`} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">Student {member.userId.substring(0, 8)}</p>
                  <p className={`text-xs font-semibold ${getHealthStatusColor(member.status)}`}>
                    {member.status.replace("_", " ")}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                Active {getRelativeTime(new Date(member.lastActive))}
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

// ============================================
// SCORE BAR COMPONENT
// ============================================

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${value >= 80
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

// ============================================
// INTERVENTION TOOLBOX COMPONENT
// ============================================

export function InterventionToolbox() {
  const { data: session } = useSession();
  const user = session?.user;
  const [interventions, setInterventions] = useState<Array<{
    id: string;
    studentId: string;
    severity: "HIGH" | "MEDIUM";
    message: string;
    action: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterventions() {
      if (!user?.projectId) return;

      try {
        setLoading(true);
        const healthData = await fetchSquadHealth(user.projectId);

        // Generate intervention alerts for at-risk students
        const alerts = healthData
          .filter((student) => student.status === "AT_RISK")
          .map((student) => ({
            id: student.userId,
            studentId: student.userId.substring(0, 8),
            severity: student.engagementScore < 40 ? ("HIGH" as const) : ("MEDIUM" as const),
            message:
              student.engagementScore < 40
                ? "Critical: Very low engagement detected. Immediate action needed."
                : "Low engagement detected. Consider scheduling a check-in.",
            action: student.engagementScore < 40 ? "Urgent Meeting" : "Schedule Check-in",
          }));

        setInterventions(alerts);
      } catch (err) {
        console.error("Error loading interventions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadInterventions();
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

  // Empty state
  if (interventions.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Intervention Alerts</h3>
          <p className="text-sm text-muted-foreground">Students who may need support</p>
        </div>
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground">All students are on track!</p>
          <p className="text-sm text-muted-foreground mt-2">No intervention needed at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Intervention Alerts</h3>
        <p className="text-sm text-muted-foreground">
          {interventions.length} student{interventions.length !== 1 ? "s" : ""} need support
        </p>
      </div>

      <div className="space-y-3">
        {interventions.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border ${item.severity === "HIGH"
                ? "bg-red-500/10 border-red-500/50"
                : "bg-yellow-500/10 border-yellow-500/50"
              }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">Student {item.studentId}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${item.severity === "HIGH"
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