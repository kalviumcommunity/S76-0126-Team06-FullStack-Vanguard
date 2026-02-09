import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// // Date & Time Utilities
// export function formatDate(date: Date | string): string {
//     return new Date(date).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//     });
// }

// export function formatDateTime(date: Date | string): string {
//     return new Date(date).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// }

// export function formatTime(date: Date | string): string {
//     return new Date(date).toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// }

// export function getRelativeTime(date: Date | string): string {
//     const now = new Date();
//     const targetDate = new Date(date);
//     const diffMs = now.getTime() - targetDate.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return formatDate(targetDate);
// }

// // Engagement & Score Utilities
// export function getEngagementColor(score: number): string {
//     if (score >= 80) return "text-green-600";
//     if (score >= 60) return "text-yellow-600";
//     if (score >= 40) return "text-orange-600";
//     return "text-red-600";
// }

// export function getEngagementBgColor(score: number): string {
//     if (score >= 80) return "bg-green-100";
//     if (score >= 60) return "bg-yellow-100";
//     if (score >= 40) return "bg-orange-100";
//     return "bg-red-100";
// }

// export function getHealthStatusColor(status: StudentHealthStatus["status"]): string {
//     switch (status) {
//         case "EXCELLENT":
//             return "text-emerald-600";
//         case "NORMAL":
//             return "text-blue-600";
//         case "AT_RISK":
//             return "text-red-600";
//         default:
//             return "text-gray-600";
//     }
// }

// export function getHealthStatusBgColor(status: StudentHealthStatus["status"]): string {
//     switch (status) {
//         case "EXCELLENT":
//             return "bg-emerald-100";
//         case "NORMAL":
//             return "bg-blue-100";
//         case "AT_RISK":
//             return "bg-red-100";
//         default:
//             return "bg-gray-100";
//     }
// }

// // Priority & Status Colors
// export function getPriorityColor(priority: string): string {
//     switch (priority) {
//         case "CRITICAL":
//             return "text-red-600";
//         case "HIGH":
//             return "text-orange-600";
//         case "MEDIUM":
//             return "text-yellow-600";
//         case "LOW":
//             return "text-green-600";
//         default:
//             return "text-gray-600";
//     }
// }

// export function getStatusColor(status: string): string {
//     switch (status) {
//         case "COMPLETED":
//         case "APPROVED":
//             return "text-green-600";
//         case "IN_PROGRESS":
//         case "IN_REVIEW":
//             return "text-blue-600";
//         case "TODO":
//             return "text-gray-600";
//         default:
//             return "text-gray-600";
//     }
// }

// // Format Utilities
// export function formatPercentage(value: number): string {
//     return `${Math.round(value)}%`;
// }

// export function formatInitials(name: string): string {
//     return name
//         .split(" ")
//         .map((part) => part.charAt(0).toUpperCase())
//         .join("");
// }

// // Sentiment Utilities
// export function getSentimentColor(sentiment: string): string {
//     switch (sentiment) {
//         case "POSITIVE":
//             return "text-green-600";
//         case "NEUTRAL":
//             return "text-gray-600";
//         case "CONSTRUCTIVE":
//             return "text-blue-600";
//         default:
//             return "text-gray-600";
//     }
// }

// export function getSentimentBgColor(sentiment: string): string {
//     switch (sentiment) {
//         case "POSITIVE":
//             return "bg-green-100";
//         case "NEUTRAL":
//             return "bg-gray-100";
//         case "CONSTRUCTIVE":
//             return "bg-blue-100";
//         default:
//             return "bg-gray-100";
//     }
// }

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function getEngagementColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

export function getEngagementBgColor(score: number): string {
  if (score >= 80) return "bg-green-500/20";
  if (score >= 60) return "bg-yellow-500/20";
  return "bg-red-500/20";
}

export function getHealthStatusColor(status: string): string {
  switch (status) {
    case "EXCELLENT": return "text-green-600";
    case "NORMAL": return "text-blue-600";
    case "AT_RISK": return "text-red-600";
    default: return "text-gray-600";
  }
}

export function getHealthStatusBgColor(status: string): string {
  switch (status) {
    case "EXCELLENT": return "bg-green-500/20";
    case "NORMAL": return "bg-blue-500/20";
    case "AT_RISK": return "bg-red-500/20";
    default: return "bg-gray-500/20";
  }
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "POSITIVE": return "text-green-600";
    case "NEUTRAL": return "text-gray-600";
    case "CONSTRUCTIVE": return "text-blue-600";
    default: return "text-gray-600";
  }
}

export function getSentimentBgColor(sentiment: string): string {
  switch (sentiment) {
    case "POSITIVE": return "bg-green-500/20";
    case "NEUTRAL": return "bg-gray-500/20";
    case "CONSTRUCTIVE": return "bg-blue-500/20";
    default: return "bg-gray-500/20";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "CRITICAL": return "text-red-600";
    case "HIGH": return "text-orange-600";
    case "MEDIUM": return "text-yellow-600";
    case "LOW": return "text-green-600";
    default: return "text-gray-600";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "COMPLETED":
    case "APPROVED":
      return "text-green-600";
    case "IN_PROGRESS":
    case "IN_REVIEW":
      return "text-blue-600";
    case "TODO":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}