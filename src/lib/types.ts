// User & Authentication
export enum UserRole {
  STUDENT = "STUDENT",
  MENTOR = "MENTOR",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// Projects & Teams
export interface Project {
  id: string;
  name: string;
  description: string;
  teamId: string;
  startDate: Date;
  endDate: Date;
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  mentorId: string;
  projects: Project[];
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  user: User;
  role: "LEAD" | "MEMBER";
  joinedAt: Date;
}

// Engagement Signals
export interface EngagementSignal {
  id: string;
  userId: string;
  projectId: string;
  type: "TASK_UPDATE" | "RESOURCE_VIEW" | "COMMENT" | "FEEDBACK_GIVEN" | "CODE_PUSH";
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  weight: number; // Engagement score weight
}

export interface DailyEngagement {
  userId: string;
  projectId: string;
  date: Date;
  engagementScore: number; // 0-100
  signals: EngagementSignal[];
  taskCount: number;
  feedbackCount: number;
}

// Tasks & Work Items
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  updates: TaskUpdate[];
}

export interface TaskUpdate {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  previousStatus?: string;
  newStatus: string;
  attachments?: string[];
  createdAt: Date;
}

// Peer Feedback
export interface PeerFeedback {
  id: string;
  fromUserId: string;
  toUserId: string;
  projectId: string;
  content: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "CONSTRUCTIVE";
  category: "COLLABORATION" | "COMMUNICATION" | "TECHNICAL" | "LEADERSHIP" | "OTHER";
  isAnonymous: boolean;
  helpful?: boolean; // Recipient can mark if helpful
  createdAt: Date;
  updatedAt: Date;
}

// Squad Health (Mentor View)
export interface SquadHealthMetrics {
  teamId: string;
  overallHealth: number; // 0-100
  engagementTrend: "INCREASING" | "STABLE" | "DECREASING";
  averageEngagement: number;
  atRiskStudents: string[]; // User IDs
  completedTasks: number;
  totalTasks: number;
  deadlineWarnings: Task[];
  lastUpdated: Date;
}

export interface StudentHealthStatus {
  userId: string;
  engagementScore: number; // 0-100
  taskCompletion: number; // 0-100
  feedbackScore: number; // 0-100
  status: "AT_RISK" | "NORMAL" | "EXCELLENT";
  lastActive: Date;
  flags?: string[]; // Issues/warnings
}

// Analytics & Heatmaps
export interface EngagementHeatmap {
  userId: string;
  weekData: {
    date: Date;
    dayOfWeek: string;
    engagementScore: number;
  }[];
  monthlyTotal: number;
  trend: number; // percentage change
}

export interface ProjectAnalytics {
  projectId: string;
  totalEngagement: number;
  memberEngagement: { userId: string; score: number }[];
  taskMetrics: {
    completed: number;
    inProgress: number;
    total: number;
  };
  feedbackMetrics: {
    positive: number;
    neutral: number;
    constructive: number;
  };
  timelineStatus: "ON_TRACK" | "AT_RISK" | "DELAYED";
}

// Notifications & Activity
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resourceType: "TASK" | "PROJECT" | "FEEDBACK" | "TEAM";
  resourceId: string;
  details?: Record<string, any>;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: "TASK_ASSIGNED" | "FEEDBACK_RECEIVED" | "DEADLINE_WARNING" | "TEAM_UPDATE" | "SYSTEM";
  title: string;
  message: string;
  relatedResource?: {
    type: string;
    id: string;
  };
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}
