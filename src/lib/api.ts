// lib/api.ts - API Client Utility
// Centralized API functions for all backend calls

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  projectId: string;
  assignedToId?: string;
  createdById: string;
  dueDate?: string | Date;
  updatedAt: string | Date;
  createdAt: string | Date;
  user?: {
    name: string;
    email: string;
  };
}

export interface EngagementSummary {
  userId: string;
  engagementScore: number;
  status: "AT_RISK" | "NORMAL" | "EXCELLENT";
  taskCompletion: number;
  feedbackScore: number;
  lastActive: string | Date;
}

export interface Feedback {
  id: string;
  senderId: string;
  receiverId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  sentiment?: "POSITIVE" | "NEUTRAL" | "CONSTRUCTIVE";
  category?: string;
  isAnonymous?: boolean;
  sender?: {
    email: string;
    name: string;
    id: string;
    role: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "STUDENT" | "MENTOR";
  projectId: string;
  engagement?: number;
  tasksCompleted?: number;
  joinedDate: string | Date;
}

export interface StudentHealthStatus {
  userId: string;
  email: string;
  engagementScore: number;
  taskCompletion: number;
  feedbackScore: number;
  status: "AT_RISK" | "NORMAL" | "EXCELLENT";
  lastActive: string | Date;
  flags?: string[];
}

// ============================================
// API BASE CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || response.statusText };
    }

    if (!response.ok) {
      console.error(`[API Error] ${endpoint} ${response.status}:`, data);
      throw new APIError(
        response.status,
        data.error || data.message || `API Error: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    console.error(`[Network Error] ${endpoint}:`, error);
    throw new Error('Network error. Please check your connection.');
  }
}

// ============================================
// TASK API FUNCTIONS
// ============================================

export async function fetchTasks(projectId: string): Promise<Task[]> {
  const res = await fetchAPI<{ tasks: Task[] }>(`/tasks?projectId=${projectId}`);
  return res.tasks;
}

export async function createTask(data: {
  title: string;
  description?: string;
  projectId: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status?: string;
}): Promise<Task> {
  const res = await fetchAPI<{ success: boolean; task: Task }>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.task;
}

export async function updateTask(
  taskId: string,
  data: Partial<Task>
): Promise<Task> {
  const res = await fetchAPI<{ success: boolean; task: Task }>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.task;
}

export async function deleteTask(taskId: string): Promise<void> {
  return fetchAPI<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

// ============================================
// PROJECT API FUNCTIONS
// ============================================

export async function createProject(name: string, description?: string): Promise<{ id: string; name: string; description?: string }> {
  const res = await fetchAPI<{ success: boolean; project: any }>('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
  return res.project;
}

// ============================================
// ENGAGEMENT API FUNCTIONS
// ============================================


export async function fetchEngagementSummary(
  userId: string
): Promise<EngagementSummary> {
  return fetchAPI<EngagementSummary>(`/engagement/summary?userId=${userId}`);
}

export async function fetchSquadHealth(
  projectId: string
): Promise<StudentHealthStatus[]> {
  const res = await fetchAPI<{ students: StudentHealthStatus[] }>(`/engagement/squad?projectId=${projectId}`);
  return res.students;
}

// ============================================
// FEEDBACK API FUNCTIONS
// ============================================

export async function fetchReceivedFeedback(
  userId: string
): Promise<Feedback[]> {
  const res = await fetchAPI<{ feedback: Feedback[] }>(`/feedback?userId=${userId}`);
  return res.feedback;
}

export async function submitFeedback(data: {
  receiverId: string;
  rating: number;
  comment: string;
  sentiment?: string;
  category?: string;
  isAnonymous?: boolean;
}): Promise<Feedback> {
  const res = await fetchAPI<{ success: boolean; feedback: Feedback }>('/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.feedback;
}

// ============================================
// TEAM/PROJECT API FUNCTIONS
// ============================================

export async function fetchTeamMembers(
  projectId: string
): Promise<TeamMember[]> {
  // Use projects API with query param, which returns the project with members
  const project = await fetchAPI<any>(`/projects?projectId=${projectId}`);
  return project.members || [];
}

export async function fetchUserProfile(userId: string): Promise<any> {
  return fetchAPI(`/users/${userId}`);
}

// ============================================
// HELPER FUNCTIONS FOR DATA TRANSFORMATION
// ============================================

/**
 * Transform tasks into activity feed items
 */
export function tasksToActivities(tasks: Task[]): Array<{
  id: string;
  type: string;
  description: string;
  time: Date;
}> {
  return tasks
    .filter(task => task.status === 'DONE')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10)
    .map(task => ({
      id: task.id,
      type: 'TASK_COMPLETED',
      description: `Completed task: ${task.title}`,
      time: new Date(task.updatedAt),
    }));
}

/**
 * Calculate weekly engagement from tasks
 */
export function calculateWeeklyEngagement(tasks: Task[]): Array<{
  date: string;
  engagement: number;
}> {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const weeklyData: { [key: string]: number } = {};

  // Initialize all days with 0
  days.forEach(day => {
    weeklyData[day] = 0;
  });

  // Count tasks updated each day in the last 7 days
  tasks.forEach(task => {
    const updatedDate = new Date(task.updatedAt);
    const diffDays = Math.floor(
      (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 7) {
      const dayIndex = updatedDate.getDay();
      const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjusted to Mon-Sun
      weeklyData[dayName] = (weeklyData[dayName] || 0) + 20; // Each task = 20% engagement
    }
  });

  return days.map(day => ({
    date: day,
    engagement: Math.min(weeklyData[day] || 0, 100),
  }));
}

/**
 * Calculate task completion rate
 */
export function calculateCompletionRate(tasks: Task[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = tasks.filter(t => t.status === 'DONE').length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}
