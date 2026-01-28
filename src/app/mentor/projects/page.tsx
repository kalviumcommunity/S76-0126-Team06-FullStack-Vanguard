import type { Metadata } from "next";
import { Calendar, Users, TrendingUp, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects - Project Vanguard",
  description: "Manage and track all your student projects",
};

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Project Vanguard - Squad Portal",
      description: "Educational engagement tracking system with real-time dashboards",
      teams: 3,
      status: "IN_PROGRESS",
      progress: 75,
      startDate: "Jan 5, 2025",
      endDate: "Feb 17, 2025",
      priority: "HIGH",
      icon: "🚀",
    },
    {
      id: 2,
      name: "Analytics Dashboard",
      description: "Data visualization platform for team metrics and insights",
      teams: 2,
      status: "IN_PROGRESS",
      progress: 60,
      startDate: "Jan 12, 2025",
      endDate: "Feb 28, 2025",
      priority: "MEDIUM",
      icon: "📊",
    },
    {
      id: 3,
      name: "Mobile App Development",
      description: "Cross-platform mobile application with React Native",
      teams: 2,
      status: "PLANNING",
      progress: 10,
      startDate: "Feb 1, 2025",
      endDate: "Apr 15, 2025",
      priority: "HIGH",
      icon: "📱",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Oversee and manage all student learning projects
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
          + New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button className="px-4 py-2 rounded-full bg-blue-600/20 text-blue-600 font-semibold text-sm border border-blue-600/50 hover:bg-blue-600/30 transition">
          All Projects
        </button>
        <button className="px-4 py-2 rounded-full bg-secondary/50 text-muted-foreground font-semibold text-sm hover:bg-secondary transition">
          In Progress
        </button>
        <button className="px-4 py-2 rounded-full bg-secondary/50 text-muted-foreground font-semibold text-sm hover:bg-secondary transition">
          Planning
        </button>
        <button className="px-4 py-2 rounded-full bg-secondary/50 text-muted-foreground font-semibold text-sm hover:bg-secondary transition">
          Completed
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{project.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded whitespace-nowrap ml-2 ${
                  project.status === "IN_PROGRESS"
                    ? "bg-blue-500/20 text-blue-600"
                    : project.status === "PLANNING"
                      ? "bg-purple-500/20 text-purple-600"
                      : "bg-green-500/20 text-green-600"
                }`}
              >
                {project.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Progress</span>
                <span className="text-xs font-bold text-foreground">{project.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    project.progress >= 75
                      ? "bg-green-500"
                      : project.progress >= 50
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-secondary/50">
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{project.teams} teams</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{project.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span
                  className={`font-semibold ${
                    project.priority === "HIGH"
                      ? "text-red-600"
                      : project.priority === "MEDIUM"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {project.priority}
                </span>
              </div>
            </div>

            {/* Action */}
            <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
              View Details →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
