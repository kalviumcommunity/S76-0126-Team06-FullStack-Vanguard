import { ProgressOverview, EngagementHeatmap, TaskProgressChart } from "@/components/student/EngagementDashboard";
import { RecentActivity, UpcomingTasks } from "@/components/student/ActivityPanel";

export const metadata = {
  title: "Dashboard - Project Vanguard",
  description: "Your engagement and progress dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground">
          Here's your engagement and progress summary for this sprint.
        </p>
      </div>

      {/* Progress Overview */}
      <ProgressOverview />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EngagementHeatmap />
        <TaskProgressChart />
      </div>

      {/* Activity Panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <UpcomingTasks />
      </div>
    </div>
  );
}
