# Development Guidelines - Project Vanguard Frontend

## 🎯 Code Standards

### TypeScript
```typescript
// ✅ DO: Use explicit types
const handleSubmit = async (data: FormData): Promise<void> => {
  // implementation
};

// ❌ DON'T: Use `any` type
const handleSubmit = async (data: any) => {
  // implementation
};

// ✅ DO: Use interfaces for component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

// ✅ DO: Use enums for constants
enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
```

### React Components
```typescript
// ✅ DO: Use functional components with hooks
export function MyComponent(): JSX.Element {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// ✅ DO: Add TypeScript to props
interface Props {
  title: string;
  onClick: () => void;
}

export function Button({ title, onClick }: Props): JSX.Element {
  return <button onClick={onClick}>{title}</button>;
}

// ✅ DO: Use React.FC or explicit return type
export function Card(): JSX.Element {
  return <div>Card</div>;
}

// ❌ DON'T: Use old class components
class MyComponent extends React.Component {}
```

### File Naming
```
ComponentName.tsx      ✅ Component files (PascalCase)
utils.ts              ✅ Utility files (kebab-case)
types.ts              ✅ Type definition files
api.ts                ✅ API files
page.tsx              ✅ Next.js page files (required)
layout.tsx            ✅ Next.js layout files (required)
```

### Tailwind CSS
```tsx
// ✅ DO: Use utility classes
<div className="flex items-center gap-4 p-6 rounded-lg border">

// ✅ DO: Use responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// ✅ DO: Use the cn() utility for conditional classes
import { cn } from "@/lib/utils";
className={cn(
  "base-class",
  isActive && "active-class",
  disabled && "disabled-class"
)}

// ❌ DON'T: Write custom CSS (when Tailwind can do it)
<style>{`
  .custom { color: blue; }
`}</style>

// ❌ DON'T: Use inline styles
<div style={{ color: "blue" }}>
```

---

## 📁 Project Structure Rules

### Pages (`src/app/`)
```
/app
├── /auth
│   ├── /login/page.tsx
│   └── /signup/page.tsx
├── /mentor
│   ├── /dashboard/page.tsx
│   ├── /teams/page.tsx
│   ├── /projects/page.tsx
│   └── /analytics/page.tsx
├── /dashboard/page.tsx
├── /tasks/page.tsx
├── /feedback/page.tsx
├── /team/page.tsx
├── /profile/page.tsx
├── /progress/page.tsx
├── /settings/page.tsx
├── layout.tsx
└── page.tsx (home/root)
```

### Components (`src/components/`)
```
/components
├── /layout           - Layout-only components (Header, Sidebar)
├── /student          - Student-specific components
├── /mentor           - Mentor-specific components
├── /tasks            - Task-related components
├── /feedback         - Feedback system components
├── /team             - Team collaboration components
└── /common           - Reusable across app
```

### Library (`src/lib/`)
```
/lib
├── types.ts          - TypeScript type definitions
├── api.ts            - API client functions
├── utils.ts          - Helper functions
└── constants.ts      - Application constants
```

---

## 🔄 Data Flow Patterns

### API Call Pattern
```typescript
// In component or server component
import { projectAPI } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectAPI.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Show error toast/notification
      }
    };

    fetchProjects();
  }, []);

  return <div>{/* render projects */}</div>;
}
```

### Component Props Pattern
```typescript
// Parent passes typed props to child
interface ProjectCardProps {
  project: Project;
  onSelect: (id: string) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div onClick={() => onSelect(project.id)}>
      {project.name}
    </div>
  );
}

// Usage
<ProjectCard
  project={project}
  onSelect={(id) => console.log(id)}
/>
```

---

## 🎨 Component Creation Checklist

When creating a new component:

- [ ] Create file in appropriate directory
- [ ] Define TypeScript interfaces for props
- [ ] Add `"use client"` directive if using hooks
- [ ] Import required dependencies
- [ ] Create functional component with explicit return type
- [ ] Add JSDoc comments for public components
- [ ] Use Tailwind classes for styling
- [ ] Handle error states
- [ ] Add loading states where applicable
- [ ] Test responsiveness

### Template
```typescript
"use client";

import { useState } from "react";
import { MyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

/**
 * Brief component description
 * @param title - The component title
 * @param onAction - Optional callback when action occurs
 */
export function MyComponent({ title, onAction }: MyComponentProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Do something
      onAction?.();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "px-4 py-2 rounded-lg bg-blue-600 text-white",
        "hover:bg-blue-700 transition",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      <MyIcon className="h-4 w-4 inline mr-2" />
      {title}
    </button>
  );
}
```

---

## 🚀 Performance Best Practices

### Code Splitting
```typescript
// ✅ DO: Use dynamic imports for heavy components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(
  () => import("@/components/HeavyComponent"),
  { loading: () => <p>Loading...</p> }
);

// Use in component
<HeavyComponent />
```

### Memoization
```typescript
// ✅ DO: Memoize expensive components
import { memo } from "react";

export const ExpensiveComponent = memo(function ExpensiveComponent() {
  // Component code
});

// ✅ DO: Memoize callbacks when needed
const handleClick = useCallback(() => {
  // handler code
}, [dependencies]);
```

### Image Optimization
```typescript
// ✅ DO: Use Next.js Image component
import Image from "next/image";

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  className="rounded-full"
/>

// ❌ DON'T: Use HTML img tag
<img src="/avatar.jpg" alt="User avatar" />
```

---

## 🔐 Security Guidelines

### API Calls
```typescript
// ✅ DO: Use environment variables for API URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ DO: Handle authentication tokens securely
const token = localStorage.getItem("auth_token");
headers.Authorization = `Bearer ${token}`;

// ❌ DON'T: Expose sensitive data in URLs
const url = `http://api.com?password=${password}`

// ❌ DON'T: Commit API keys to repository
const API_KEY = "sk_live_xxxxx";
```

### User Input
```typescript
// ✅ DO: Validate and sanitize input
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ✅ DO: Use TypeScript to enforce types
interface FormData {
  email: string;
  password: string;
}

// ❌ DON'T: Trust user input directly
const userInput = req.query.search; // Could be malicious
```

---

## 🧪 Testing Strategy

### Component Testing
```typescript
// Example test file: Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button Component", () => {
  it("renders with correct label", () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button label="Click me" onClick={onClick} />);
    screen.getByText("Click me").click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

### API Testing
```typescript
// Example: test API calls
import { projectAPI } from "@/lib/api";

describe("Project API", () => {
  it("should fetch projects", async () => {
    const projects = await projectAPI.getProjects();
    expect(Array.isArray(projects)).toBe(true);
  });
});
```

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile First Approach */
/* Small screens (default) */
.container { display: block; }

/* Tablets (md: 768px) */
@media (min-width: 768px) {
  .container { display: flex; }
}

/* Desktops (lg: 1024px) */
@media (min-width: 1024px) {
  .container { gap: 2rem; }
}

/* Large desktops (xl: 1280px) */
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```

In Tailwind:
```tsx
<div className="
  block                  /* Mobile */
  md:flex                /* Tablet */
  md:gap-4              
  lg:grid lg:grid-cols-3 /* Desktop */
  xl:gap-8              /* Large desktop */
">
```

---

## 🎯 State Management Strategy

### Local State (useState)
```typescript
// For component-specific state
const [isOpen, setIsOpen] = useState(false);
```

### Context (useContext)
```typescript
// For data shared between many components
const UserContext = createContext<User | null>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
```

### Server Components
```typescript
// Fetch data at build/request time
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

---

## 🐛 Debugging Tips

### Console Logging
```typescript
// ✅ DO: Use proper logging in development
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", data);
}

// ✅ DO: Use meaningful error messages
throw new Error(`Failed to fetch user ${userId}: ${error.message}`);
```

### Error Boundaries
```typescript
// Create error.tsx in app directory for error handling
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## 📚 Resources & References

- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Lucide Icons: https://lucide.dev

---

## ✅ Pre-Commit Checklist

Before committing code:

- [ ] TypeScript types are correct
- [ ] No `any` types used
- [ ] All imports are used
- [ ] Code is formatted (run linter)
- [ ] No console.logs left (except development)
- [ ] Component is responsive
- [ ] Accessibility is considered
- [ ] Dark mode looks correct
- [ ] No hardcoded strings (use constants)
- [ ] Error handling is implemented
- [ ] Loading states are handled

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feat/new-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feat/new-feature-name

# Create Pull Request on GitHub
# Request review from team
# Once approved, merge to main
```

---

**Last Updated**: January 2025
**Version**: 1.0.0
