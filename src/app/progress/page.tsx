import { TrendingUp, Award, Target, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Progress - Project Vanguard",
  description: "Track your learning progress and achievements",
};

export default function ProgressPage() {
  const projects = [
    {
      name: "Project Vanguard - Squad Portal",
      progress: 75,
      status: "IN_PROGRESS",
      startDate: "Jan 5, 2025",
      endDate: "Feb 17, 2025",
      tasks: 12,
      tasksCompleted: 9,
      teamSize: 5,
    },
    {
      name: "Analytics Dashboard",
      progress: 100,
      status: "COMPLETED",
      startDate: "Dec 1, 2024",
      endDate: "Jan 15, 2025",
      tasks: 8,
      tasksCompleted: 8,
      teamSize: 3,
    },
  ];

  const achievements = [
    { icon: "🔥", title: "On Fire", description: "3-day engagement streak" },
    { icon: "⭐", title: "Task Master", description: "Complete 10 tasks" },
    { icon: "👥", title: "Collaborator", description: "Give 5 pieces of feedback" },
    { icon: "🚀", title: "Early Bird", description: "Complete task 1 day early" },
  ];

  const milestones = [
    { name: "First engagement signal", completed: true },
    { name: "First feedback received", completed: true },
    { name: "First task completed", completed: true },
    { name: "First week active", completed: false },
    { name: "Reach 80% engagement", completed: false },
    { name: "Help team reach 100%", completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate achievements
        </p>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
        {projects.map((project, idx) => (
          <div key={idx} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{project.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{project.startDate} → {project.endDate}</span>
                  <span className={`font-semibold px-2 py-1 rounded ${
                    project.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-600"
                      : "bg-blue-500/20 text-blue-600"
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-bold text-blue-500">{project.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                <p className="text-lg font-bold">
                  <span className="text-green-500">{project.tasksCompleted}</span>
                  <span className="text-muted-foreground text-sm">/{project.tasks}</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Team Size</p>
                <p className="text-lg font-bold text-blue-500">{project.teamSize}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center"
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{achievement.title}</h3>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Milestones</h2>
        <div className="space-y-3">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <input
                type="checkbox"
                checked={milestone.completed}
                readOnly
                className="w-5 h-5 rounded cursor-pointer"
              />
              <span
                className={`text-sm font-medium ${
                  milestone.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {milestone.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Avg. Engagement</h3>
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">72%</p>
          <p className="text-xs text-green-600 mt-2">↑ 5% from last week</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Feedback Sent</h3>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-xs text-muted-foreground mt-2">Great team player!</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Feedback Received</h3>
            <Award className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-xs text-green-600 mt-2">Keep it up!</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Learning Time</h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">18h</p>
          <p className="text-xs text-muted-foreground mt-2">This week</p>
        </div>
      </div>
    </div>
  );
}
