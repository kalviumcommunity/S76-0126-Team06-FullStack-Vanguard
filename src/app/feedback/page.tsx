import { FeedbackReceived, GiveFeedbackForm } from "@/components/feedback/FeedbackPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback - Project Vanguard",
  description: "Give and receive feedback from your team",
};

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Team Feedback</h1>
        <p className="text-muted-foreground">
          Help your teammates grow and celebrate their contributions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FeedbackReceived />
        <GiveFeedbackForm />
      </div>
    </div>
  );
}
