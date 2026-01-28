import { Users, TrendingDown, AlertCircle, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams - Project Vanguard",
  description: "Manage your teams and monitor progress",
};

export default function TeamsPage() {
  const teams = [
    {
      id: 1,
      name: "Squad Alpha",
      members: 5,
      avgEngagement: 85,
      status: "EXCELLENT",
      activeProjects: 2,
      recentActivity: "API documentation completed",
    },
    {
      id: 2,
      name: "Squad Beta",
      members: 4,
      avgEngagement: 62,
      status: "AT_RISK",
      activeProjects: 1,
      recentActivity: "2 members with low engagement",
    },
    {
      id: 3,
      name: "Squad Gamma",
      members: 6,
      avgEngagement: 78,
      status: "NORMAL",
      activeProjects: 3,
      recentActivity: "On track for deadline",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Teams</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your student teams
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
          + New Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 cursor-pointer hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.recentActivity}</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded whitespace-nowrap ml-2 ${
                  team.status === "EXCELLENT"
                    ? "bg-green-500/20 text-green-600"
                    : team.status === "NORMAL"
                      ? "bg-blue-500/20 text-blue-600"
                      : "bg-red-500/20 text-red-600"
                }`}
              >
                {team.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-lg font-bold text-blue-500">{team.members}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Avg Engagement</p>
                <p className="text-lg font-bold text-purple-500">{team.avgEngagement}%</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Active Projects</p>
                <p className="text-lg font-bold text-green-500">{team.activeProjects}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
