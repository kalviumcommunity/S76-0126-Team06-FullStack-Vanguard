import { UserProfile } from "@/components/team/TeamPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Project Vanguard",
  description: "View and manage your profile",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and see your learning journey
        </p>
      </div>

      {/* Profile Content */}
      <UserProfile />
    </div>
  );
}
