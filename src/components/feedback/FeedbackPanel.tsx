"use client";

import { Smile, MessageSquare, Star, ThumbsUp, Send } from "lucide-react";
import { getSentimentColor, getSentimentBgColor, formatDate, getRelativeTime } from "@/lib/utils";
import { useState } from "react";

// Mock data
const receivedFeedback = [
  {
    id: 1,
    from: "Sarah Chen",
    avatar: "SC",
    content:
      "Great work on the API documentation! Your explanations are clear and comprehensive. Really helped the team understand the endpoints.",
    sentiment: "POSITIVE" as const,
    category: "TECHNICAL",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    helpful: true,
  },
  {
    id: 2,
    from: "Anonymous",
    avatar: "?",
    content:
      "I think you could improve your communication during meetings. Sometimes it's hard to understand your suggestions.",
    sentiment: "CONSTRUCTIVE" as const,
    category: "COMMUNICATION",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    helpful: false,
  },
  {
    id: 3,
    from: "Mike Johnson",
    avatar: "MJ",
    content:
      "Your code reviews are always thorough and fair. Great leadership in code quality maintenance!",
    sentiment: "POSITIVE" as const,
    category: "COLLABORATION",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    helpful: true,
  },
  {
    id: 4,
    from: "Anonymous",
    avatar: "?",
    content: "Would be good to take more initiative in suggesting improvements to the project structure.",
    sentiment: "CONSTRUCTIVE" as const,
    category: "LEADERSHIP",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    helpful: null,
  },
];

export function FeedbackReceived() {
  const positive = receivedFeedback.filter((f) => f.sentiment === "POSITIVE").length;
  const constructive = receivedFeedback.filter((f) => f.sentiment === "CONSTRUCTIVE").length;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Feedback Received</h3>
        <p className="text-sm text-muted-foreground mb-4">Insights from your team</p>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50">
            <p className="text-xs text-muted-foreground">Positive</p>
            <p className="text-lg font-bold text-green-600">{positive}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/50">
            <p className="text-xs text-muted-foreground">Constructive</p>
            <p className="text-lg font-bold text-blue-600">{constructive}</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/50">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-purple-600">{receivedFeedback.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {receivedFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className={`p-4 rounded-lg border transition ${
              feedback.sentiment === "POSITIVE"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-blue-500/10 border-blue-500/30"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-700/50 flex items-center justify-center text-sm font-semibold text-foreground">
                {feedback.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-foreground text-sm">{feedback.from}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getSentimentBgColor(feedback.sentiment)} ${getSentimentColor(feedback.sentiment)}`}>
                    {feedback.sentiment}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{getRelativeTime(feedback.date)}</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-3 leading-relaxed">{feedback.content}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground">
                {feedback.category}
              </span>
              <button className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                {feedback.helpful === true ? (
                  <>
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    Helpful
                  </>
                ) : feedback.helpful === false ? (
                  <>
                    <ThumbsUp className="h-4 w-4" />
                    Not helpful
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4" />
                    Mark helpful
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GiveFeedbackForm() {
  const [selectedPeer, setSelectedPeer] = useState("");
  const [sentiment, setSentiment] = useState<"POSITIVE" | "NEUTRAL" | "CONSTRUCTIVE">("POSITIVE");
  const [category, setCategory] = useState("COLLABORATION");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const peers = ["Sarah Chen", "Mike Johnson", "Alex Rivera", "Jordan Lee"];
  const categories = ["COLLABORATION", "COMMUNICATION", "TECHNICAL", "LEADERSHIP", "OTHER"];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Give Feedback</h3>
        <p className="text-sm text-muted-foreground">Help your teammates grow through constructive feedback</p>
      </div>

      <form className="space-y-4">
        {/* Peer Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Give feedback to:</label>
          <select
            value={selectedPeer}
            onChange={(e) => setSelectedPeer(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a teammate...</option>
            {peers.map((peer) => (
              <option key={peer} value={peer}>
                {peer}
              </option>
            ))}
          </select>
        </div>

        {/* Sentiment */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sentiment:</label>
          <div className="grid grid-cols-3 gap-2">
            {["POSITIVE", "NEUTRAL", "CONSTRUCTIVE"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSentiment(s as any)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                  sentiment === s
                    ? s === "POSITIVE"
                      ? "bg-green-600 text-white"
                      : s === "NEUTRAL"
                        ? "bg-gray-600 text-white"
                        : "bg-blue-600 text-white"
                    : "bg-secondary/50 border border-secondary text-foreground hover:border-muted-foreground"
                }`}
              >
                {s === "POSITIVE" ? "😊" : s === "NEUTRAL" ? "😐" : "💡"} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Your feedback:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share specific observations and suggestions..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Anonymous Toggle */}
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded w-4 h-4 bg-secondary border-secondary"
          />
          Send anonymously
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send Feedback
        </button>
      </form>
    </div>
  );
}
