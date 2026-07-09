"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { submitFeedback } from "@/lib/telemetry";
import { Star, MessageSquare } from "lucide-react";

const RATING_LABELS: Record<number, string> = {
  1: "Terrible",
  2: "Disliked",
  3: "Average",
  4: "Very Good",
  5: "Love it!",
};

export default function FeedbackForm() {
  const { publicKey, isConnected, setShowPicker } = useWallet();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      setErrorMsg("Please connect your Stellar wallet first.");
      setStatus("error");
      return;
    }
    if (!comment.trim()) {
      setErrorMsg("Please write a short comment about your experience.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      await submitFeedback(publicKey, rating, comment);
      setStatus("success");
      setComment("");
      setRating(5);
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit feedback. Please try again.");
      setStatus("error");
    }
  };

  const activeRating = hoverRating ?? rating;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 max-w-2xl mx-auto shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="h-4 w-4 text-purple-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Share Your Feedback</h3>
          <p className="text-xs text-gray-500">Tell us about your experience on BuilderBoard.</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-sm text-gray-400 mb-4">Connect your wallet to leave feedback.</p>
          <button
            onClick={() => setShowPicker(true)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-all"
          >
            🔗 Connect Wallet
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= activeRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 hover:text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-2 font-medium">
                {RATING_LABELS[activeRating]} ({activeRating}/5)
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Your Comment
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What do you think of the leaderboard, wallet connection, quests, and smart contract features?"
              className="w-full border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none text-sm transition-all resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400 font-mono">
              {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}` : ""}
            </span>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all"
            >
              {status === "submitting" ? "Sending…" : "Submit Feedback"}
            </button>
          </div>

          {status === "success" && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
              🎉 Thank you! Your feedback has been recorded.
            </div>
          )}

          {status === "error" && errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {errorMsg}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
