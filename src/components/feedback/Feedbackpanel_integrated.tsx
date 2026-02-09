"use client";

import { Smile, MessageSquare, Star, ThumbsUp, Send } from "lucide-react";
import { getSentimentColor, getSentimentBgColor, formatDate, getRelativeTime } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchReceivedFeedback, submitFeedback, fetchTeamMembers, type Feedback, type TeamMember } from "@/lib/api";
import { useSession } from "next-auth/react";

// ============================================
// FEEDBACK RECEIVED COMPONENT
// ============================================

export function FeedbackReceived() {
  const { data: session } = useSession();
  const user = session?.user;
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeedback() {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchReceivedFeedback(user.id);
        setFeedback(data);
      } catch (err) {
        setError("Unable to load feedback. Please refresh.");
        console.error("Error loading feedback:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, [user?.id]);

  const positive = feedback.filter((f) => f.sentiment === "POSITIVE").length;
  const constructive = feedback.filter((f) => f.sentiment === "CONSTRUCTIVE").length;

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <div className="h-6 w-40 bg-secondary/50 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-secondary/50 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (feedback.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Feedback Received</h3>
          <p className="text-sm text-muted-foreground">Insights from your team</p>
        </div>
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No feedback received yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Keep up the great work! Feedback will appear here.
          </p>
        </div>
      </div>
    );
  }

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
            <p className="text-lg font-bold text-purple-600">{feedback.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border transition ${item.sentiment === "POSITIVE"
              ? "bg-green-500/10 border-green-500/30"
              : "bg-blue-500/10 border-blue-500/30"
              }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-700/50 flex items-center justify-center text-sm font-semibold text-foreground">
                {item.isAnonymous ? "?" : item.sender?.name?.substring(0, 2).toUpperCase() || "??"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-foreground text-sm">
                    {item.isAnonymous ? "Anonymous" : item.sender?.name || "Unknown"}
                  </p>
                  {item.sentiment && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${getSentimentBgColor(
                        item.sentiment
                      )} ${getSentimentColor(item.sentiment)}`}
                    >
                      {item.sentiment}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= item.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-400"
                        }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{getRelativeTime(new Date(item.createdAt))}</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-3 leading-relaxed">{item.comment}</p>

            {item.category && (
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground">
                  {item.category}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// GIVE FEEDBACK FORM COMPONENT
// ============================================

export function GiveFeedbackForm() {
  const { data: session } = useSession();
  const user = session?.user;
  const [peers, setPeers] = useState<TeamMember[]>([]);
  const [loadingPeers, setLoadingPeers] = useState(true);
  const [selectedPeer, setSelectedPeer] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sentiment, setSentiment] = useState<"POSITIVE" | "NEUTRAL" | "CONSTRUCTIVE">("POSITIVE");
  const [category, setCategory] = useState("COLLABORATION");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadPeers() {
      if (!user?.projectId) return;
      try {
        setLoadingPeers(true);
        const members = await fetchTeamMembers(user.projectId);
        // Exclude self if possible, but for simplicity showing all
        setPeers(members.filter(m => m.id !== user.id));
      } catch (err) {
        console.error("Error loading peers:", err);
      } finally {
        setLoadingPeers(false);
      }
    }
    loadPeers();
  }, [user?.projectId, user?.id]);

  const categories = ["COLLABORATION", "COMMUNICATION", "TECHNICAL", "LEADERSHIP", "OTHER"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPeer || rating === 0 || content.length < 10) {
      setError("Please fill in all required fields (min 10 characters for comment)");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await submitFeedback({
        receiverId: selectedPeer, // In real app, this should be user ID
        rating,
        comment: content,
        sentiment,
        category,
        isAnonymous,
      });

      setSuccess(true);
      // Reset form
      setSelectedPeer("");
      setRating(0);
      setContent("");
      setIsAnonymous(false);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      console.error("Error submitting feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Give Feedback</h3>
        <p className="text-sm text-muted-foreground">Help your teammates grow through constructive feedback</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-600 text-sm">
          ✓ Feedback submitted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Peer Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Give feedback to: <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPeer}
            onChange={(e) => setSelectedPeer(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            required
            disabled={loadingPeers || submitting}
          >
            <option value="">{loadingPeers ? "Loading teammates..." : "Select a teammate..."}</option>
            {peers.map((peer) => (
              <option key={peer.id} value={peer.id}>
                {peer.name} ({peer.role})
              </option>
            ))}
          </select>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Rating: <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${star <= (hoverRating || rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-400"
                    }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                {rating} / 5
              </span>
            )}
          </div>
        </div>

        {/* Sentiment */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sentiment:</label>
          <div className="grid grid-cols-3 gap-2">
            {(["POSITIVE", "NEUTRAL", "CONSTRUCTIVE"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSentiment(s)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${sentiment === s
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
          <label className="block text-sm font-medium text-foreground mb-2">
            Your feedback: <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share specific observations and suggestions... (min 10 characters)"
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            required
            minLength={10}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {content.length} / 10 minimum characters
          </p>
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
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}