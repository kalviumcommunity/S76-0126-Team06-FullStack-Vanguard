import { TaskBoard, ProjectTimeline } from "@/components/tasks/TaskBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Board - Project Vanguard",
  description: "View and manage your project tasks",
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Task Board</h1>
        <p className="text-muted-foreground">
          Organize and track your team's work across the project
        </p>
      </div>

      {/* Task Board */}
      <TaskBoard />

      {/* Timeline */}
      <ProjectTimeline />
    </div>
  );
}
