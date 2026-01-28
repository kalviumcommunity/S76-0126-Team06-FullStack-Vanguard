// Application constants and configuration

// Feature flags
export const FEATURES = {
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_AI_FEEDBACK: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_EXPORT_DATA: true,
};

// Role-based access
export const ROLES = {
  STUDENT: "STUDENT",
  MENTOR: "ADMIN",
  ADMIN: "ADMIN",
} as const;

// Engagement score thresholds
export const ENGAGEMENT_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  AVERAGE: 40,
  LOW: 0,
} as const;

// Task status
export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  COMPLETED: "COMPLETED",
} as const;

// Task priority
export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

// Project status
export const PROJECT_STATUS = {
  PLANNING: "PLANNING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  ON_HOLD: "ON_HOLD",
} as const;

// Feedback sentiment
export const FEEDBACK_SENTIMENT = {
  POSITIVE: "POSITIVE",
  NEUTRAL: "NEUTRAL",
  CONSTRUCTIVE: "CONSTRUCTIVE",
} as const;

// Feedback categories
export const FEEDBACK_CATEGORIES = {
  COLLABORATION: "COLLABORATION",
  COMMUNICATION: "COMMUNICATION",
  TECHNICAL: "TECHNICAL",
  LEADERSHIP: "LEADERSHIP",
  OTHER: "OTHER",
} as const;

// Health status
export const HEALTH_STATUS = {
  EXCELLENT: "EXCELLENT",
  NORMAL: "NORMAL",
  AT_RISK: "AT_RISK",
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: "TASK_ASSIGNED",
  FEEDBACK_RECEIVED: "FEEDBACK_RECEIVED",
  DEADLINE_WARNING: "DEADLINE_WARNING",
  TEAM_UPDATE: "TEAM_UPDATE",
  SYSTEM: "SYSTEM",
} as const;

// Engagement signal types
export const SIGNAL_TYPES = {
  TASK_UPDATE: "TASK_UPDATE",
  RESOURCE_VIEW: "RESOURCE_VIEW",
  COMMENT: "COMMENT",
  FEEDBACK_GIVEN: "FEEDBACK_GIVEN",
  CODE_PUSH: "CODE_PUSH",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Time ranges
export const TIME_RANGES = {
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
} as const;

// Analytics
export const ANALYTICS = {
  UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes
  CACHE_TTL: 60 * 1000, // 1 minute
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "The requested resource was not found",
  SERVER_ERROR: "An unexpected error occurred",
  NETWORK_ERROR: "A network error occurred. Please try again",
  VALIDATION_ERROR: "Please check your input and try again",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Your profile has been updated successfully",
  FEEDBACK_SENT: "Your feedback has been sent successfully",
  TASK_CREATED: "Task has been created successfully",
  SETTINGS_SAVED: "Your settings have been saved",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "vanguard_auth_token",
  USER_PREFERENCES: "vanguard_user_preferences",
  THEME_MODE: "vanguard_theme_mode",
  SIDEBAR_COLLAPSED: "vanguard_sidebar_collapsed",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  ENGAGEMENT: {
    HEATMAP: "/engagement/heatmap",
    SIGNALS: "/engagement/signals",
    SCORE: "/engagement/score",
  },
  PROJECTS: {
    LIST: "/projects",
    CREATE: "/projects",
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
  TASKS: {
    LIST: (projectId: string) => `/projects/${projectId}/tasks`,
    CREATE: (projectId: string) => `/projects/${projectId}/tasks`,
    GET: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
  TEAMS: {
    LIST: "/teams",
    CREATE: "/teams",
    GET: (id: string) => `/teams/${id}`,
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
    MEMBERS: (id: string) => `/teams/${id}/members`,
    HEALTH: (id: string) => `/teams/${id}/health`,
  },
  FEEDBACK: {
    LIST_RECEIVED: (userId: string) => `/feedback/received/${userId}`,
    LIST_SENT: (userId: string) => `/feedback/sent/${userId}`,
    CREATE: "/feedback",
    UPDATE: (id: string) => `/feedback/${id}`,
  },
  ANALYTICS: {
    TEAM: (teamId: string) => `/analytics/teams/${teamId}`,
    PROJECT: (projectId: string) => `/analytics/projects/${projectId}`,
    ENGAGEMENT: "/analytics/engagement",
  },
  USERS: {
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    SETTINGS: (id: string) => `/users/${id}/settings`,
  },
} as const;

// Chart colors
export const CHART_COLORS = {
  PRIMARY: "#3b82f6",
  SECONDARY: "#a855f7",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  DANGER: "#ef4444",
  INFO: "#06b6d4",
  GRAY: "#6b7280",
  LIGHT: "#e5e7eb",
  DARK: "#1f2937",
} as const;

// Sentiment colors
export const SENTIMENT_COLORS = {
  POSITIVE: "#10b981",
  NEUTRAL: "#6b7280",
  CONSTRUCTIVE: "#3b82f6",
} as const;

// Status colors
export const STATUS_COLORS = {
  TODO: "#6b7280",
  IN_PROGRESS: "#3b82f6",
  IN_REVIEW: "#a855f7",
  COMPLETED: "#10b981",
  ON_HOLD: "#f59e0b",
  PLANNING: "#a855f7",
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM d, yyyy",
  DISPLAY_TIME: "MMM d, yyyy HH:mm",
  ISO: "yyyy-MM-dd",
  ISO_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// Limits
export const LIMITS = {
  MAX_FEEDBACK_LENGTH: 500,
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_PROJECT_NAME_LENGTH: 100,
  MAX_TEAM_SIZE: 10,
  MIN_PASSWORD_LENGTH: 8,
} as const;

// Default values
export const DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  ENGAGEMENT_WEIGHT: {
    TASK_UPDATE: 2,
    RESOURCE_VIEW: 1,
    COMMENT: 3,
    FEEDBACK_GIVEN: 4,
    CODE_PUSH: 3,
  },
  POLLING_INTERVAL: 30000, // 30 seconds
} as const;

// External URLs
export const EXTERNAL_URLS = {
  DOCUMENTATION: "https://vanguard.example.com/docs",
  SUPPORT: "https://vanguard.example.com/support",
  GITHUB: "https://github.com/vanguard",
  COMMUNITY: "https://community.vanguard.example.com",
} as const;
