import { TeamOverview, UserProfile } from "@/components/team/TeamPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - Project Vanguard",
  description: "View your profile and team information",
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile & Team</h1>
        <p className="text-muted-foreground">
          Manage your profile and collaborate with your teammates
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserProfile />
        </div>
        <TeamOverview />
      </div>
    </div>
  );
}
