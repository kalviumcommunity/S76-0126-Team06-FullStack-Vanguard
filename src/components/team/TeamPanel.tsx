"use client";

import { Users, Mail, Calendar, Award, Github, Linkedin } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock data
const team = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "LEAD",
    avatar: "SC",
    engagement: 92,
    tasksCompleted: 8,
    joinedDate: new Date(2025, 0, 5),
    email: "sarah@example.com",
  },
  {
    id: 2,
    name: "Mike Johnson",
    role: "MEMBER",
    avatar: "MJ",
    engagement: 78,
    tasksCompleted: 6,
    joinedDate: new Date(2025, 0, 8),
    email: "mike@example.com",
  },
  {
    id: 3,
    name: "Alex Rivera",
    role: "MEMBER",
    avatar: "AR",
    engagement: 45,
    tasksCompleted: 2,
    joinedDate: new Date(2025, 0, 10),
    email: "alex@example.com",
  },
  {
    id: 4,
    name: "Jordan Lee",
    role: "MEMBER",
    avatar: "JL",
    engagement: 88,
    tasksCompleted: 7,
    joinedDate: new Date(2025, 0, 6),
    email: "jordan@example.com",
  },
];

export function TeamOverview() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Team Members</h3>
        <p className="text-sm text-muted-foreground">Your squad of {team.length} collaborators</p>
      </div>

      <div className="space-y-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-lg border border-secondary/50 hover:border-secondary transition cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {member.avatar}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      member.role === "LEAD"
                        ? "bg-purple-500/20 text-purple-600"
                        : "bg-blue-500/20 text-blue-600"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-3">{member.email}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="font-bold text-sm text-blue-500">{member.engagement}%</p>
                  </div>
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                    <p className="font-bold text-sm text-green-500">{member.tasksCompleted}</p>
                  </div>
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-bold text-sm text-purple-500">{formatDate(member.joinedDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserProfile() {
  const currentUser = {
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "STUDENT",
    avatar: "JL",
    joinedDate: new Date(2025, 0, 6),
    bio: "Passionate about full-stack development and creating impactful projects",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    projects: [
      { name: "Project Vanguard", status: "IN_PROGRESS", progress: 75 },
      { name: "Squad Portal", status: "COMPLETED", progress: 100 },
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
            {currentUser.avatar}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">{currentUser.name}</h2>
            <p className="text-muted-foreground mb-4">{currentUser.bio}</p>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {currentUser.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined {formatDate(currentUser.joinedDate)}
              </div>
            </div>
          </div>

          <button className="px-4 py-2 rounded-lg border border-secondary hover:border-muted-foreground transition text-foreground font-medium">
            Edit Profile
          </button>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-secondary">
          <a
            href={currentUser.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition"
          >
            <Github className="h-4 w-4 text-foreground" />
          </a>
          <a
            href={currentUser.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition"
          >
            <Linkedin className="h-4 w-4 text-foreground" />
          </a>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {currentUser.skills.map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
        <div className="space-y-3">
          {currentUser.projects.map((project) => (
            <div key={project.name} className="p-4 rounded-lg bg-secondary/50 border border-secondary">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{project.name}</p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    project.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-600"
                      : "bg-blue-500/20 text-blue-600"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{project.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
