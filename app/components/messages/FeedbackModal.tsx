import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

//@ts-ignore
export function FeedbackComponent({ sessionId, requestId, appName }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const [lastFeedbackType, setLastFeedbackType] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  //@ts-ignore
  const handleFeedback = async (feedbackType) => {
    setIsSubmitting(true);
    setLastFeedbackType(feedbackType);

    try {
      const feedbackData = {
        session_id: sessionId,
        request_id: requestId,
        app_name: appName,
        feedback: feedbackType,
        metadata: {
          comment: "",
        },
      };

      console.log("Sending feedback:", feedbackData);

      const response = await fetch(
        "https://ai.microland.com/logger/feedback/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(feedbackData),
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Feedback API response:", responseData);
      setFeedbackSubmitted(true);

      // Optional: Show a confirmation message or toast notification
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      setShowCommentModal(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        session_id: sessionId,
        request_id: requestId,
        app_name: appName,
        feedback: lastFeedbackType, // Use the previously submitted feedback type
        metadata: {
          comment: comment,
        },
      };

      console.log("Sending comment feedback:", feedbackData);

      const response = await fetch(
        "https://ai.microland.com/logger/feedback/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(feedbackData),
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Comment API response:", responseData);
      setComment("");
      setShowCommentModal(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-4">
        <button
          className={`p-2 rounded-full ${
            feedbackSubmitted && lastFeedbackType === "like"
              ? "bg-green-100"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleFeedback("like")}
          disabled={isSubmitting}
          aria-label="Like"
        >
          <ThumbsUp
            size={20}
            className={
              feedbackSubmitted && lastFeedbackType === "like"
                ? "text-green-600"
                : "text-gray-600"
            }
          />
        </button>

        <button
          className={`p-2 rounded-full ${
            feedbackSubmitted && lastFeedbackType === "dislike"
              ? "bg-red-100"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleFeedback("dislike")}
          disabled={isSubmitting}
          aria-label="Dislike"
        >
          <ThumbsDown
            size={20}
            className={
              feedbackSubmitted && lastFeedbackType === "dislike"
                ? "text-red-600"
                : "text-gray-600"
            }
          />
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={openCommentModal}
          disabled={isSubmitting}
          aria-label="Add comment"
        >
          <MessageSquare size={20} className="text-gray-600" />
        </button>

        {isSubmitting && (
          <span className="text-sm text-gray-500">Submitting...</span>
        )}
        {feedbackSubmitted && !isSubmitting && (
          <span className="text-sm text-green-500">
            Thank you for your feedback!
          </span>
        )}
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Additional Comments</h3>

            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4 h-32"
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                onClick={() => setShowCommentModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackComponent;
