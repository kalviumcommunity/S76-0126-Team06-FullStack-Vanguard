# Engagement Summary API

## Overview

Production-ready analytics API that calculates real-time engagement metrics from existing database data. Powers dashboard analytics and at-risk student detection.

**Endpoint**: `GET /api/engagement/summary`

---

## Features

✅ **Efficient Data Aggregation** - Single optimized Prisma query per user  
✅ **Smart Calculations** - Engagement scoring with 0-100 scale  
✅ **Risk Detection** - Automatic AT_RISK/INACTIVE status detection  
✅ **Flexible Queries** - Single user or all users (mentor view)  
✅ **Type-Safe** - Full TypeScript support  
✅ **Edge-Case Handling** - Division by zero, null dates, empty data  

---

## API Usage

### Get Single User Summary

```bash
GET /api/engagement/summary?userId=<USER_ID>
```

**Example Request:**
```bash
curl -H "Cookie: session=<YOUR_TOKEN>" \
  "http://localhost:3000/api/engagement/summary?userId=cm6d2e3f40000abcdef123456"
```

**Response:**
```json
{
  "userId": "cm6d2e3f40000abcdef123456",
  "userName": "Alex Rivera",
  "totalTasks": 8,
  "completedTasks": 5,
  "inProgressTasks": 2,
  "feedbackCount": 3,
  "avgFeedbackRating": 4.3,
  "lastActiveAt": "2026-02-04T08:30:15.000Z",
  "engagementScore": 67,
  "status": "ON_TRACK"
}
```

### Get All Users Summary (Mentor View)

```bash
GET /api/engagement/summary
```

**Example Request:**
```bash
curl -H "Cookie: session=<YOUR_TOKEN>" \
  "http://localhost:3000/api/engagement/summary"
```

**Response:**
```json
[
  {
    "userId": "cm6d2e3f40000abcdef123456",
    "userName": "Alex Rivera",
    "totalTasks": 8,
    "completedTasks": 5,
    "inProgressTasks": 2,
    "feedbackCount": 3,
    "avgFeedbackRating": 4.3,
    "lastActiveAt": "2026-02-04T08:30:15.000Z",
    "engagementScore": 67,
    "status": "ON_TRACK"
  },
  {
    "userId": "cm6d2e3f40001xyzabc789012",
    "userName": "Morgan Taylor",
    "totalTasks": 6,
    "completedTasks": 1,
    "inProgressTasks": 1,
    "feedbackCount": 4,
    "avgFeedbackRating": 2.8,
    "lastActiveAt": "2026-02-01T14:20:00.000Z",
    "engagementScore": 50,
    "status": "AT_RISK"
  }
]
```

---

## Calculation Logic

### 1. Engagement Score (0-100)

Formula: **Base (60% max) + Bonus (40% max)**

```
Base Score = (completedTasks / totalTasks) × 60
  - If totalTasks = 0, base = 0
  - Examples:
    - 5/10 tasks done → 30 points
    - 8/10 tasks done → 48 points

Bonus Score = min(feedbackCount × 10, 40)
  - Each feedback = 10 points
  - Capped at 4 feedbacks (40 points max)
  - Examples:
    - 2 feedbacks → 20 points
    - 5 feedbacks → 40 points (capped)

Final Score = Base + Bonus (clamped 0-100)
```

**Example Calculations:**

| Completed | Total | Feedback | Base | Bonus | Score |
|-----------|-------|----------|------|-------|-------|
| 5         | 10    | 3        | 30   | 30    | **60** |
| 8         | 10    | 2        | 48   | 20    | **68** |
| 0         | 5     | 4        | 0    | 40    | **40** |
| 10        | 10    | 5        | 60   | 40    | **100** |

### 2. Status Determination

Flow chart:

```
1. Check INACTIVE (highest priority)
   ├─ lastActiveAt is null → INACTIVE
   └─ lastActiveAt > 7 days ago → INACTIVE

2. Check AT_RISK (medium priority)
   ├─ No activity in last 48 hours → AT_RISK
   ├─ Completion rate < 30% → AT_RISK
   └─ Average feedback < 3.0 stars → AT_RISK

3. Default → ON_TRACK
```

**Status Matrix:**

| Last Active | Completion % | Avg Rating | Status |
|-------------|--------------|------------|--------|
| 10 days ago | 80%          | 4.5        | **INACTIVE** |
| 3 days ago  | 20%          | 4.0        | **AT_RISK** (low completion) |
| 1 day ago   | 50%          | 2.5        | **AT_RISK** (low rating) |
| 1 hour ago  | 60%          | 4.2        | **ON_TRACK** |

---

## Data Sources

The API derives all metrics from existing Prisma models:

### Primary Data
- **User** → userName  
- **Task** → totalTasks, completedTasks, inProgressTasks, lastActiveAt  
- **Feedback** → feedbackCount, avgFeedbackRating  
- **Engagement** → lastActiveAt (engagement logs)  

### Derived Metrics
- **engagementScore** → Calculated from tasks + feedback  
- **status** → Determined by activity + performance  

---

## Performance Optimization

### Query Efficiency
✅ **Single Query Per User** - Uses Prisma's `select` + `include` to fetch all data at once  
✅ **No N+1 Queries** - Tasks are pre-loaded with user in initial query  
✅ **Limited Engagement Logs** - Only fetches most recent log (`take: 1`)  

### Code Example
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    projects: {
      select: {
        tasks: {
          select: { id: true, status: true, updatedAt: true }
        }
      }
    },
    feedbackReceived: { select: { rating: true } },
    engagementLogs: {
      orderBy: { timestamp: 'desc' },
      take: 1,  // ← Only latest log
      select: { timestamp: true }
    }
  }
});
```

---

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| No tasks assigned | `totalTasks = 0`, `engagementScore` uses only feedback bonus |
| No feedback received | `avgFeedbackRating = 0`, no penalty in status logic |
| Never logged in | `lastActiveAt = null` → `INACTIVE` status |
| No engagement logs | Uses task `updatedAt` as fallback for `lastActiveAt` |
| Division by zero | Checked before all division operations |

---

## Integration Examples

### React Dashboard Component

```typescript
import { useEffect, useState } from 'react';

interface EngagementData {
  userId: string;
  userName: string;
  engagementScore: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'INACTIVE';
  // ... other fields
}

function DashboardAnalytics() {
  const [data, setData] = useState<EngagementData[]>([]);

  useEffect(() => {
    fetch('/api/engagement/summary')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      {data.map(user => (
        <div key={user.userId}>
          <h3>{user.userName}</h3>
          <p>Score: {user.engagementScore}/100</p>
          <span className={`status-${user.status.toLowerCase()}`}>
            {user.status}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### At-Risk Student Alert

```typescript
async function getAtRiskStudents() {
  const response = await fetch('/api/engagement/summary');
  const allUsers = await response.json();
  
  return allUsers.filter(user => 
    user.status === 'AT_RISK' || user.status === 'INACTIVE'
  );
}

// Usage in server component
const atRiskStudents = await getAtRiskStudents();
console.log(`🚨 ${atRiskStudents.length} students need attention`);
```

---

## Testing

### Manual Test

```bash
# 1. Login first to get session token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.rivera@student.edu","password":"password123"}' \
  -c cookies.txt

# 2. Use session to query engagement
curl -b cookies.txt http://localhost:3000/api/engagement/summary
```

### Expected Response (All Users)
```json
[
  {
    "userId": "...",
    "userName": "Alex Rivera",
    "totalTasks": 8,
    "completedTasks": 5,
    "inProgressTasks": 2,
    "feedbackCount": 3,
    "avgFeedbackRating": 4.3,
    "lastActiveAt": "2026-02-04T...",
    "engagementScore": 67,
    "status": "ON_TRACK"
  }
  // ... more users
]
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized - Authentication required"
}
```
**Cause**: No valid session token in cookies  
**Fix**: Login via `/api/auth/login` first

### 404 Not Found
```json
{
  "error": "User not found"
}
```
**Cause**: Invalid userId in query parameter  
**Fix**: Verify userId exists in database

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```
**Cause**: Database connection issue or unexpected error  
**Fix**: Check server logs for details

---

## Future Enhancements

Potential improvements for v2:

- [ ] **Redis Caching** - Cache summaries for 5 minutes
- [ ] **Batch Updates** - Websocket for real-time score updates
- [ ] **Historical Tracking** - Store daily snapshots for trend analysis
- [ ] **Percentile Rankings** - Show user's rank vs peers
- [ ] **Predictive Analytics** - ML model to predict future risk status

---

## Technical Stack

- **Runtime**: Next.js 16 App Router
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 7.3.0
- **Auth**: JWT sessions (via middleware)
- **Type Safety**: TypeScript 5

---

## File Structure

```
src/app/api/engagement/summary/
└── route.ts                    # Main API implementation
    ├── Types (lines 8-21)      # TypeScript interfaces
    ├── Helpers (lines 27-71)   # Calculation functions
    ├── Queries (lines 77-221)  # Prisma data fetchers
    └── Handler (lines 227-271) # HTTP GET handler
```

---

## Support

For issues or questions:
1. Check server logs: `npm run dev`
2. Verify database connection: `npx prisma studio`
3. Test queries directly: Use Prisma Studio to inspect data

---

**Author**: Backend Engineering Team  
**Last Updated**: 2026-02-04  
**API Version**: 1.0
