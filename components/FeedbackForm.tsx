"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { submitFeedback } from "@/lib/telemetry";
import { Star, MessageSquare } from "lucide-react";

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
      setErrorMsg("Please add a short comment about your experience.");
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
      // Automatically reset to idle after 4 seconds
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit feedback. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6 max-w-2xl mx-auto shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-900/40 text-purple-400">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Share Your Feedback</h3>
          <p className="text-sm text-gray-400">
            Tell us about your experience using the BuilderBoard platform.
          </p>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-6 border border-dashed border-[#2a2a4a] rounded-lg bg-[#0f0f1a]/50">
          <p className="text-gray-400 text-sm mb-4">
            You must connect your Stellar wallet to leave feedback.
          </p>
          <button
            onClick={() => setShowPicker(true)}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all shadow-md"
          >
            🔗 Connect Wallet
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition-colors focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating ?? rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600 hover:text-gray-400"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-400 ml-2 font-medium">
                {rating === 5
                  ? "Love it! (5/5)"
                  : rating === 4
                  ? "Very Good (4/5)"
                  : rating === 3
                  ? "Average (3/5)"
                  : rating === 2
                  ? "Disliked (2/5)"
                  : "Terrible (1/5)"}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
              Your Review / Message
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What do you think of our Stellar wallet connection, leaderboard features, and smart contract counter?"
              className="w-full bg-[#0f0f1a] border border-[#2a2a4a] focus:border-purple-500 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none text-sm transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500 font-mono break-all max-w-[60%]">
              Posting as: {publicKey ? `${publicKey.slice(0, 10)}...${publicKey.slice(-10)}` : ""}
            </span>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-6 py-2 bg-[#7c3aed] hover:bg-[#9d4edd] disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-all shadow-md"
            >
              {status === "submitting" ? "Sending..." : "Submit Feedback"}
            </button>
          </div>

          {status === "success" && (
            <div className="p-3 bg-green-950/40 border border-green-800 rounded-lg text-sm text-green-400">
              🎉 Thank you! Your feedback has been saved to our telemetry dashboard.
            </div>
          )}

          {status === "error" && errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-sm text-red-400">
              {errorMsg}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
