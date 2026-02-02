// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

// API client helper
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

// Authentication
export const authAPI = {
  login: async (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: async (name: string, email: string, password: string, role: string) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    }),

  logout: async () =>
    apiCall("/auth/logout", {
      method: "POST",
    }),

  getCurrentUser: async () =>
    apiCall("/auth/me", {
      method: "GET",
    }),
};

// Engagement Signals
export const engagementAPI = {
  getEngagementHeatmap: async (userId: string) =>
    apiCall(`/engagement/heatmap/${userId}`, { method: "GET" }),

  getEngagementScore: async (userId: string, projectId: string) =>
    apiCall(`/engagement/score/${userId}/${projectId}`, { method: "GET" }),

  logSignal: async (signal: any) =>
    apiCall("/engagement/signal", {
      method: "POST",
      body: JSON.stringify(signal),
    }),
};

// Projects & Tasks
export const projectAPI = {
  // Project endpoints
  getProjects: async () =>
    apiCall("/projects", { method: "GET" }),

  getProjectById: async (id: string) =>
    apiCall(`/projects/${id}`, { method: "GET" }),

  createProject: async (data: {
    name: string;
    description?: string;
    memberIds?: string[];
  }) =>
    apiCall("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProject: async (
    id: string,
    data: { name?: string; description?: string }
  ) =>
    apiCall(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProject: async (id: string) =>
    apiCall(`/projects/${id}`, {
      method: "DELETE",
    }),

  // Task endpoints
  getTasks: async (projectId: string) =>
    apiCall(`/projects/${projectId}/tasks`, { method: "GET" }),

  createTask: async (projectId: string, task: any) =>
    apiCall(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: async (taskId: string, updates: any) =>
    apiCall(`/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
};

// Teams
export const teamAPI = {
  getTeams: async () =>
    apiCall("/teams", { method: "GET" }),

  getTeamById: async (id: string) =>
    apiCall(`/teams/${id}`, { method: "GET" }),

  getTeamMembers: async (teamId: string) =>
    apiCall(`/teams/${teamId}/members`, { method: "GET" }),

  getSquadHealth: async (teamId: string) =>
    apiCall(`/teams/${teamId}/health`, { method: "GET" }),
};

// Feedback
export const feedbackAPI = {
  getFeedbackReceived: async (userId: string) =>
    apiCall(`/feedback/received/${userId}`, { method: "GET" }),

  getFeedbackSent: async (userId: string) =>
    apiCall(`/feedback/sent/${userId}`, { method: "GET" }),

  giveFeedback: async (feedback: any) =>
    apiCall("/feedback", {
      method: "POST",
      body: JSON.stringify(feedback),
    }),

  markFeedbackHelpful: async (feedbackId: string, helpful: boolean) =>
    apiCall(`/feedback/${feedbackId}/helpful`, {
      method: "PUT",
      body: JSON.stringify({ helpful }),
    }),
};

// Analytics
export const analyticsAPI = {
  getTeamAnalytics: async (teamId: string) =>
    apiCall(`/analytics/teams/${teamId}`, { method: "GET" }),

  getProjectAnalytics: async (projectId: string) =>
    apiCall(`/analytics/projects/${projectId}`, { method: "GET" }),

  getEngagementTrends: async (params?: any) =>
    apiCall(`/analytics/engagement${new URLSearchParams(params).toString()}`, {
      method: "GET",
    }),
};

// User Profile
export const userAPI = {
  getProfile: async (userId: string) =>
    apiCall(`/users/${userId}`, { method: "GET" }),

  updateProfile: async (userId: string, updates: any) =>
    apiCall(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  getSettings: async (userId: string) =>
    apiCall(`/users/${userId}/settings`, { method: "GET" }),

  updateSettings: async (userId: string, settings: any) =>
    apiCall(`/users/${userId}/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};
