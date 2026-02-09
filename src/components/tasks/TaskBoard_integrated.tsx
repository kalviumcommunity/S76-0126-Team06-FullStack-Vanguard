"use client";

import { Trash2, Edit2, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import { getPriorityColor, getStatusColor, formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchTasks, createTask, updateTask, deleteTask, type Task } from "@/lib/api";
import { useSession } from "next-auth/react";

// ============================================
// TASK CARD COMPONENT
// ============================================

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Task["status"]) => void;
}

function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      className="bg-secondary/50 border border-secondary rounded-lg p-4 space-y-3 cursor-grab active:cursor-grabbing hover:shadow-md transition"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-foreground text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h4>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              /* TODO: Add edit modal */
            }}
            className="p-1 hover:bg-secondary/80 rounded transition"
          >
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-red-500/20 rounded transition"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${task.priority === "CRITICAL"
            ? "bg-red-500/20 text-red-600"
            : task.priority === "HIGH"
              ? "bg-orange-500/20 text-orange-600"
              : task.priority === "MEDIUM"
                ? "bg-yellow-500/20 text-yellow-600"
                : "bg-green-500/20 text-green-600"
            }`}
        >
          {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {task.assignedToId ? `Assigned to: ${task.assignedToId.substring(0, 8)}` : "Unassigned"}
          </span>
          <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
            {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {mounted && formatDate(new Date(task.dueDate))}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// CREATE TASK FORM COMPONENT
// ============================================

interface CreateTaskFormProps {
  projectId: string;
  status: Task["status"];
  onTaskCreated: () => void;
}

function CreateTaskForm({ projectId, status, onTaskCreated }: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("MEDIUM");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        projectId,
        priority,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setIsOpen(false);
      onTaskCreated();
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Error creating task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 w-full py-2 px-4 rounded-lg border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground transition text-sm flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 rounded-lg border border-secondary bg-card space-y-2">
      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full px-2 py-1.5 text-sm rounded bg-secondary/50 border border-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
        autoFocus
        disabled={submitting}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)..."
        rows={2}
        className="w-full px-2 py-1.5 text-sm rounded bg-secondary/50 border border-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 resize-none"
        disabled={submitting}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task["priority"])}
        className="w-full px-2 py-1.5 text-sm rounded bg-secondary/50 border border-secondary text-foreground focus:outline-none focus:border-blue-500"
        disabled={submitting}
      >
        <option value="LOW">Low Priority</option>
        <option value="MEDIUM">Medium Priority</option>
        <option value="HIGH">High Priority</option>
        <option value="CRITICAL">Critical Priority</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
            setDescription("");
            setError(null);
          }}
          disabled={submitting}
          className="px-3 py-1.5 text-sm bg-secondary/50 hover:bg-secondary text-foreground rounded transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ============================================
// MAIN TASK BOARD COMPONENT
// ============================================

export function TaskBoard() {
  const { data: session } = useSession();
  const user = session?.user;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const projectId = user?.projectId || "default-project"; // You'll need to get this from context/props

  const columns = [
    { key: "TODO" as const, label: "To Do", color: "bg-slate-500/20" },
    { key: "IN_PROGRESS" as const, label: "In Progress", color: "bg-blue-500/20" },
    { key: "IN_REVIEW" as const, label: "In Review", color: "bg-purple-500/20" },
    { key: "DONE" as const, label: "Done", color: "bg-green-500/20" },
  ];

  // Load tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks(projectId);
      setTasks(data);
    } catch (err) {
      setError("Unable to load tasks. Please refresh.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  // Handle task deletion
  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      setDeletingTaskId(taskId);
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      alert("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Handle status change via drag-and-drop
  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      alert("Failed to update task status. Please try again.");
      console.error("Error updating task:", err);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      handleStatusChange(taskId, newStatus);
    }
  };

  // Group tasks by status
  const tasksByStatus = columns.reduce(
    (acc, column) => {
      acc[column.key] = tasks.filter((t) => t.status === column.key);
      return acc;
    },
    {} as Record<Task["status"], Task[]>
  );

  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-8 w-48 bg-secondary/50 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-10 bg-secondary/50 rounded animate-pulse" />
              <div className="h-32 bg-secondary/50 rounded animate-pulse" />
              <div className="h-32 bg-secondary/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadTasks}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Project Task Board</h3>
        <p className="text-sm text-muted-foreground">
          Drag tasks to move between columns • {tasks.length} total tasks
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.key}
            className="flex flex-col min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            <div className={`${column.color} px-4 py-2 rounded-t-lg mb-2`}>
              <h4 className="font-semibold text-sm text-foreground">
                {column.label} ({tasksByStatus[column.key]?.length || 0})
              </h4>
            </div>

            <div className="space-y-2 flex-1">
              {tasksByStatus[column.key]?.length > 0 ? (
                tasksByStatus[column.key].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center py-8 border border-dashed border-secondary/50 rounded">
                  No tasks in this column
                </div>
              )}
            </div>

            <CreateTaskForm
              projectId={projectId}
              status={column.key}
              onTaskCreated={loadTasks}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PROJECT TIMELINE (Using Tasks Data)
// ============================================

export function ProjectTimeline() {
  const { data: session } = useSession();
  const user = session?.user;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const projectId = user?.projectId || "default-project";
        const data = await fetchTasks(projectId);
        setTasks(data);
      } catch (err) {
        console.error("Error loading tasks for timeline:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [user?.projectId]);

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-6 w-40 bg-secondary/50 rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-secondary/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Group tasks into milestones (simplified version)
  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const totalCount = tasks.length;

  const milestones = [
    {
      name: "Project Setup",
      status: completedCount > 0 ? "DONE" : "TODO",
      progress: completedCount > 0 ? 100 : 0,
    },
    {
      name: "Development Phase",
      status: inProgressCount > 0 ? "IN_PROGRESS" : "TODO",
      progress: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    },
    {
      name: "Testing & QA",
      status: "TODO",
      progress: 0,
    },
    {
      name: "Deployment",
      status: "TODO",
      progress: 0,
    },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Project Progress</h3>
        <p className="text-sm text-muted-foreground">
          {completedCount} of {totalCount} tasks completed
        </p>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-4 border-card ${milestone.status === "DONE"
                  ? "bg-green-500"
                  : milestone.status === "IN_PROGRESS"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                  }`}
              />
              {i < milestones.length - 1 && <div className="w-1 h-16 bg-slate-700/50 my-1" />}
            </div>

            <div className="flex-1 pb-4">
              <h4 className="font-semibold text-foreground mb-2">{milestone.name}</h4>

              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${milestone.status === "DONE"
                    ? "bg-green-500"
                    : milestone.status === "IN_PROGRESS"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                    }`}
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1">{milestone.progress}% complete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}