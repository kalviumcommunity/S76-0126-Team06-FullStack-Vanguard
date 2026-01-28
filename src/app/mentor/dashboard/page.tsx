import { SquadHealthMap, InterventionToolbox } from "@/components/mentor/SquadHealthDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Squad Health - Project Vanguard",
  description: "Monitor and manage your team's health and engagement",
};

export default function MentorDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Squad Health Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time visibility into your team's engagement and progress
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SquadHealthMap />
        </div>
        <InterventionToolbox />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <button className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition text-left">
          <h3 className="font-semibold text-foreground mb-2">📊 View Analytics</h3>
          <p className="text-sm text-muted-foreground">Deep dive into team metrics</p>
        </button>
        <button className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition text-left">
          <h3 className="font-semibold text-foreground mb-2">📋 Generate Report</h3>
          <p className="text-sm text-muted-foreground">Create sprint summary report</p>
        </button>
        <button className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition text-left">
          <h3 className="font-semibold text-foreground mb-2">💬 Send Message</h3>
          <p className="text-sm text-muted-foreground">Communicate with your team</p>
        </button>
      </div>
    </div>
  );
}
