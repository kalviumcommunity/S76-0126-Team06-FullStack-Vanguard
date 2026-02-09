"use client";

import { Users, Mail, Calendar, Award, Github, Linkedin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchTeamMembers, type TeamMember } from "@/lib/api";
import { useSession } from "next-auth/react";

// ============================================
// TEAM OVERVIEW COMPONENT
// ============================================

export function TeamOverview() {
  const { data: session } = useSession();
  const user = session?.user;
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeam() {
      if (!user?.projectId) return;

      try {
        setLoading(true);
        setError(null);
        const members = await fetchTeamMembers(user.projectId);
        setTeam(members);
      } catch (err) {
        setError("Unable to load team members");
        console.error("Error loading team:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, [user?.projectId]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="h-6 w-40 bg-secondary/50 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Team Members</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (team.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Team Members</h3>
          <p className="text-sm text-muted-foreground">Your squad collaborators</p>
        </div>
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No team members found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Team members will appear here once added to the project
          </p>
        </div>
      </div>
    );
  }

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {member.avatar || getInitials(member.name)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${member.role === "MENTOR"
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
                    <p className="font-bold text-sm text-blue-500">
                      {member.engagement ? `${member.engagement}%` : "N/A"}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                    <p className="font-bold text-sm text-green-500">
                      {member.tasksCompleted || 0}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-secondary/50">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-bold text-sm text-purple-500">
                      {formatDate(new Date(member.joinedDate))}
                    </p>
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

// ============================================
// USER PROFILE COMPONENT
// ============================================

export function UserProfile() {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-center text-muted-foreground">Please log in to view your profile</p>
      </div>
    );
  }

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock data for now - you can fetch real data from API
  const profileData = {
    bio: "Passionate about full-stack development and creating impactful projects",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    projects: [
      { name: "Project Vanguard", status: "IN_PROGRESS" as const, progress: 75 },
      { name: "Squad Portal", status: "COMPLETED" as const, progress: 100 },
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {getInitials(user.name)}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">{user.name}</h2>
            <p className="text-muted-foreground mb-4">{profileData.bio}</p>

            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4" />
                {user.role}
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
            href={profileData.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition"
          >
            <Github className="h-4 w-4 text-foreground" />
          </a>
          <a
            href={profileData.social.linkedin}
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
          {profileData.skills.map((skill) => (
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
          {profileData.projects.map((project) => (
            <div key={project.name} className="p-4 rounded-lg bg-secondary/50 border border-secondary">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{project.name}</p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${project.status === "COMPLETED"
                    ? "bg-green-500/20 text-green-600"
                    : "bg-blue-500/20 text-blue-600"
                    }`}
                >
                  {project.status.replace("_", " ")}
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