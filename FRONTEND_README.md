# Project Vanguard - Frontend

A modern, full-featured Next.js application for real-time educational engagement tracking and team collaboration management.

## 🎯 Overview

Project Vanguard is an Educational Progress & Engagement System that provides real-time visibility into student engagement and project progress. This frontend serves both students and mentors with comprehensive dashboards, analytics, and collaboration tools.

### Key Features

**For Students:**
- 📊 **Engagement Heatmaps** - Visual representation of weekly engagement patterns
- 📈 **Progress Tracking** - Monitor project progress and task completion
- 💬 **Peer Feedback** - Give and receive constructive feedback from teammates
- 📋 **Task Management** - Organized task board with status tracking
- 👥 **Team Collaboration** - View team members and their contributions
- 🎖️ **Achievements** - Earn badges and track milestones

**For Mentors:**
- 🎯 **Squad Health Map** - Real-time team health metrics and status
- ⚠️ **Intervention Alerts** - Identify at-risk students automatically
- 📊 **Analytics Dashboard** - Deep dive into team performance metrics
- 👥 **Team Management** - Oversee multiple student teams
- 📈 **Trend Analysis** - Track engagement trends over time
- 💬 **Team Communication** - Send messages and schedule check-ins

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/                # Student dashboard
│   │   ├── tasks/page.tsx            # Task board
│   │   ├── feedback/page.tsx         # Feedback system
│   │   ├── team/page.tsx             # Team collaboration
│   │   ├── progress/page.tsx         # Progress tracking
│   │   ├── profile/page.tsx          # User profile
│   │   ├── settings/page.tsx         # User settings
│   │   ├── mentor/                   # Mentor dashboard
│   │   │   ├── dashboard/page.tsx    # Squad health overview
│   │   │   ├── teams/page.tsx        # Team management
│   │   │   ├── projects/page.tsx     # Project management
│   │   │   └── analytics/page.tsx    # Advanced analytics
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home/dashboard
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Top navigation
│   │   │   └── Sidebar.tsx           # Navigation sidebar
│   │   ├── student/
│   │   │   ├── EngagementDashboard.tsx
│   │   │   └── ActivityPanel.tsx
│   │   ├── mentor/
│   │   │   └── SquadHealthDashboard.tsx
│   │   ├── tasks/
│   │   │   └── TaskBoard.tsx
│   │   ├── feedback/
│   │   │   └── FeedbackPanel.tsx
│   │   └── team/
│   │       └── TeamPanel.tsx
│   └── lib/
│       ├── types.ts                  # TypeScript definitions
│       ├── utils.ts                  # Utility functions
│       ├── api.ts                    # API client
│       └── constants.ts              # Constants
├── public/                            # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Run development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for production
```bash
npm run build
npm start
```

## 🎨 Design System

### Colors & Theming
- **Primary**: Blue (#3b82f6)
- **Secondary**: Purple (#a855f7)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)
- **Dark Mode**: Default, optimized for eye comfort

### Components Library
All components are built with:
- **React 19.2** - Latest features and optimizations
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Beautiful SVG icons
- **Recharts** - Data visualization

## 📖 Key Pages

### Student Dashboard (`/dashboard`)
- Weekly engagement heatmap
- Task completion chart
- Progress overview (engagement, tasks, feedback)
- Recent activity feed
- Upcoming tasks widget

### Task Board (`/tasks`)
- Kanban-style task board (Todo → Done)
- Drag-and-drop task management
- Priority and status indicators
- Project timeline with milestones
- Task creation and editing

### Feedback System (`/feedback`)
- View received feedback from peers
- Sentiment analysis visualization
- Give feedback with category selection
- Anonymous feedback option
- Helpful rating system

### Mentor Squad Health (`/mentor/dashboard`)
- Real-time team health metrics
- Individual student status cards
- Intervention alerts for at-risk students
- Team engagement trends
- Quick action buttons

### Analytics (`/mentor/analytics`)
- Engagement trend lines
- Task completion charts
- Feedback distribution pie chart
- Key insights and recommendations
- Comparative team metrics

## 🔄 Data Flow

```
User Input → Components → API Client → Backend API → Database
                ↓
            State Management
                ↓
            Re-render Components
```

## 🔐 Authentication Flow

1. User navigates to `/auth/login` or `/auth/signup`
2. Credentials are sent to backend
3. JWT token is received and stored
4. User is redirected to dashboard
5. All subsequent API calls include the token
6. Token is validated on the backend

## 📱 Responsive Design

- **Mobile**: Single column layout, touch-optimized
- **Tablet**: Two-column layout
- **Desktop**: Full multi-column layout with sidebar
- **Large screens**: Extended layouts with advanced analytics

## 🛠️ Development Tips

### Adding a New Page
1. Create file in `src/app/[feature]/page.tsx`
2. Import necessary components
3. Add metadata export for SEO
4. Create corresponding component in `src/components/[feature]/`

### Adding a New Component
1. Create component file in `src/components/[category]/`
2. Use TypeScript for type safety
3. Import icons from `lucide-react`
4. Use utility functions from `src/lib/utils.ts`
5. Apply Tailwind classes for styling

### Styling Guidelines
- Use Tailwind utilities for styling
- Apply dark mode classes (`dark:` prefix)
- Use semantic color names for consistency
- Keep component styles scoped and composable

## 📚 Type Definitions

All types are defined in `src/lib/types.ts`:

```typescript
- User & Authentication types
- Project & Team types
- Engagement Signal types
- Task types
- Feedback types
- Analytics types
- Notification types
```

## 🔌 API Integration

API calls are made through `src/lib/api.ts`:

```typescript
import { authAPI, engagementAPI, projectAPI } from "@/lib/api";

// Example usage
const user = await authAPI.getCurrentUser();
const heatmap = await engagementAPI.getEngagementHeatmap(userId);
```

## 📊 Charts & Visualizations

Using Recharts library:
- **LineChart** - Engagement trends
- **BarChart** - Task completion metrics
- **PieChart** - Feedback distribution
- Responsive containers for mobile compatibility

## 🎯 State Management Strategy

Currently using:
- React hooks (useState, useContext) for local state
- Server-side caching with Next.js
- Consider Redux/Zustand for complex global state

Future enhancement: Implement global state management for:
- User authentication
- Current team/project context
- Real-time notifications

## 🔄 Real-time Features (Future)

Prepared infrastructure for:
- WebSocket connections for live updates
- Engagement signal streaming
- Real-time feedback notifications
- Live collaboration features

## 📦 Dependencies

Key packages:
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `recharts` - Charts
- `@prisma/client` - DB client

## 🧪 Testing Strategy

To implement:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Create test files alongside components:
```
ComponentName.tsx
ComponentName.test.tsx
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project on Vercel
3. Set environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📖 Documentation

- API Documentation: See backend README
- Tailwind: https://tailwindcss.com/docs
- Next.js: https://nextjs.org/docs
- React: https://react.dev

## 🤝 Contributing

1. Create a feature branch
2. Make changes following the structure
3. Test thoroughly
4. Create a pull request

## 📝 Notes

- All dates are stored as ISO 8601 strings
- Engagement scores are 0-100 percentage values
- Status enums use UPPERCASE with underscores
- Colors follow accessibility standards (WCAG AA)

## 🐛 Known Issues

- Charts may need responsiveness tweaks on very small screens
- Real-time updates require backend WebSocket implementation

## 🎓 Learning Outcomes

By building this project, you'll learn:
- Modern Next.js with App Router
- TypeScript best practices
- Tailwind CSS at scale
- Component composition
- API integration patterns
- Data visualization with Recharts
- Responsive design
- User authentication flows
- State management strategies

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Review documentation
3. Create a new issue with details

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Status**: Active Development
