import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:col-span-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Engagement</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">+24%</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Students</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            3 Teams Active
          </p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Latest engagement signals from your teams.
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-secondary"></span>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Student {i}</p>
                  <p className="text-sm text-muted-foreground">
                    Completed task: "Database Schema Design"
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  2m ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Assessment Panel */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">Squad Health</h3>
          <p className="text-sm text-muted-foreground">
            Real-time team performance metrics.
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Team Alpha</span>
              <span className="text-sm text-green-500 font-bold">92%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-full w-[92%] rounded-full bg-green-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Team Beta</span>
              <span className="text-sm text-yellow-500 font-bold">78%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-full w-[78%] rounded-full bg-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
