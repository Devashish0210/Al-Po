import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";
import { Message } from "./message";
import "../../../app/globals.css";
import Cookies from "js-cookie";

interface MessageContainerProps {
  message: any;
  index: number;
  isLastMessage?: boolean;
  requestId: string;
  sessionId: string;
  isLoading?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  leaveBalanceData: string;
}

export const MessageContainer = ({
  message,
  index,
  isLastMessage,
  requestId,
  sessionId,
  isLoading,
  onSuggestionClick,
  leaveBalanceData,
}: MessageContainerProps) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"like" | "dislike" | null>(
    null
  );
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [bearerToken, setBearerToken] = useState(null);

  // App name constant
  const APP_NAME = "hr-bot";

  // const validateToken = async (loginToken: string) => {
  //   try {
  //     const response = await fetch(
  //       `/copilot/stg-policy-chatbo/api/validatetoken?LoginToken=${encodeURIComponent(
  //         loginToken
  //       )}`
  //     );
  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || "Token validation failed");
  //     }

  //     if (data.userDetails) {
  //       Cookies.set("userDetails", JSON.stringify(data.userDetails), {
  //         expires: 1,
  //       });
  //       localStorage.setItem("userDetails", JSON.stringify(data.userDetails));
  //       setUserDetails(data.userDetails);
  //       setBearerToken(loginToken);
  //     }

  //     setIsTokenValidated(true);
  //   } catch (error) {
  //     console.error("Token validation error:", error);
  //     setIsTokenValidated(false);
  //   }
  // };

  // // Initial Token Validation
  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     setIsAuthenticating(true);
  //     try {
  //       const urlParams = new URLSearchParams(window.location.search);
  //       const loginToken = urlParams.get("LoginToken");

  //       if (loginToken) {
  //         await validateToken(loginToken);
  //         const newUrl = new URL(window.location.href);
  //         newUrl.searchParams.delete("LoginToken");
  //         window.history.replaceState({}, document.title, newUrl.toString());
  //       } else {
  //         const storedUserDetails = localStorage.getItem("userDetails");
  //         if (storedUserDetails) {
  //           setUserDetails(JSON.parse(storedUserDetails));
  //           setIsTokenValidated(true);
  //         } else {
  //           throw new Error("No valid authentication found");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Authentication error:", error);
  //       setIsTokenValidated(false);
  //     } finally {
  //       setIsAuthenticating(false);
  //     }
  //   };

  //   initializeAuth();
  // }, []);

  // // Function to get profile image URL
  // const getProfileImageUrl = () => {
  //   if (
  //     userDetails &&
  //     userDetails.employee &&
  //     userDetails.employee.profile_picture
  //   ) {
  //     const { base_url, image_path } = userDetails.employee.profile_picture;
  //     return `${base_url}${image_path}`;
  //   }
  //   return null;
  // };

  // const profileImageUrl = getProfileImageUrl();

  // Remove suggestions JSON from the message content
  let cleanedMessageContent = message.content;
  try {
    const match = message.content.match(/\{.*\}/); // Find JSON-like content
    if (match) {
      cleanedMessageContent = message.content.replace(match[0], "").trim(); // Remove it
    }
  } catch (error) {
    console.error("Error processing message content:", error);
  }

  // Parse suggestions from message content if they exist
  const suggestions = message.suggestions || [];

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return; // Prevent action if globally loading
    setSelectedSuggestion(suggestion); // For local styling of the clicked button
    if (onSuggestionClick) {
      onSuggestionClick(suggestion); // Call the handler passed from Messages.tsx
    }
  };

  // Direct feedback submission
  const handleFeedbackButtonClick = async (type: "like" | "dislike") => {
    setIsSubmittingFeedback(true);
    setFeedbackType(type);

    try {
      const feedbackData = {
        session_id: sessionId,
        request_id: requestId,
        app_name: APP_NAME,
        feedback: type,
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
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Open comment modal
  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  // Submit comment
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      setShowCommentModal(false);
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const feedbackData = {
        session_id: sessionId,
        request_id: requestId,
        app_name: APP_NAME,
        feedback: feedbackType || "comment", // Use the previously submitted feedback type or default to "comment"
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
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Determine message positioning classes
  const isAssistant = message.role === "assistant";

  // Avatar component
  const Avatar = ({ isUser = false }) => {
    if (isUser) {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={20} className="text-gray-500" />
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <img
            src="https://aicoedevstatefilestorage.blob.core.windows.net/ml35app/ml-mia-chatbot-logo.png"
            alt="Assistant"
          />
        </div>
      );
    }
  };

  return (
    <div className="message-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`message-container ${isAssistant ? "assistant" : "user"}`}
      >
        {/* Message with avatar on appropriate side */}
        <div
          className={`flex items-start gap-3 w-full ${
            isAssistant ? "" : "flex-row-reverse"
          }`}
        >
          {/* Avatar - will be on left for assistant, right for user */}
          <div className="flex-shrink-0">
            <Avatar isUser={!isAssistant} />
          </div>

          {/* Message Content */}
          <div
            className={`flex flex-col ${
              isAssistant ? "items-start" : "items-end"
            } flex-grow`}
          >
            <div
              className={`message-text ${
                isAssistant ? "assistant-text" : "user-text"
              }`}
              style={{
                backgroundColor: isAssistant ? "#ffffff" : "#f1f1f1",
                borderRadius: "12px",
                padding: "12px 15px",
                maxWidth: "100%",
                wordWrap: "break-word",
              }}
            >
              {isAssistant ? (
                <Message
                  message={{ ...message, content: cleanedMessageContent }}
                  leaveBalanceData={leaveBalanceData}
                />
              ) : (
                message.content
              )}
            </div>

            {/* Only show suggestions and feedback for assistant messages */}
            {isAssistant && (
              <>
                {/* Follow-up Questions */}
                {suggestions.length > 0 && (
                  <div className="suggestions-container mt-2 flex flex-wrap">
                    {suggestions.map((suggestion: string, idx: number) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`suggestion-button ${
                          selectedSuggestion === suggestion ? "selected" : ""
                        }`}
                        disabled={isLoading}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Feedback Section - Direct submission on click */}
                <div className="flex gap-3 mt-2">
                  {feedbackSubmitted ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={18} className="mr-1" />
                      <span>Feedback submitted successfully</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() => handleFeedbackButtonClick("like")}
                        disabled={isSubmittingFeedback}
                        aria-label="Like"
                        onMouseEnter={(e) =>
                          ((
                            e.currentTarget.firstChild as HTMLElement
                          ).style.color = "green")
                        }
                        onMouseLeave={(e) =>
                          ((
                            e.currentTarget.firstChild as HTMLElement
                          ).style.color = "gray")
                        }
                      >
                        <ThumbsUp size={20} className="text-gray-500" />
                      </button>

                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() => handleFeedbackButtonClick("dislike")}
                        disabled={isSubmittingFeedback}
                        aria-label="Dislike"
                        onMouseEnter={(e) =>
                          ((
                            e.currentTarget.firstChild as HTMLElement
                          ).style.color = "red")
                        }
                        onMouseLeave={(e) =>
                          ((
                            e.currentTarget.firstChild as HTMLElement
                          ).style.color = "gray")
                        }
                      >
                        <ThumbsDown size={20} className="text-gray-500" />
                      </button>

                      {/* <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={openCommentModal}
                        disabled={isSubmittingFeedback}
                        aria-label="Add comment"
                      >
                        <MessageSquare size={20} className="text-gray-500" />
                      </button> */}

                      {isSubmittingFeedback && (
                        <span className="text-sm text-gray-500">
                          Submitting...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Comment Modal */}
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
                disabled={isSubmittingFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLastMessage && <hr className="message-divider" />}
    </div>
  );
};

export default MessageContainer;
