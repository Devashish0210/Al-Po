import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import { AIInput } from "../ui/ai-input";
import { MessageContainer } from "./message-container";
import "../../../app/globals.css";

export const Messages = ({
  //@ts-ignore
  messages,
  //@ts-ignore
  input,
  //@ts-ignore
  handleInputChange,
  //@ts-ignore
  handleSubmit,
  //@ts-ignore
  isLoading,
  //@ts-ignore
  requestId,
  //@ts-ignore
  sessionId,
  //@ts-ignore
  leaveBalanceData,
  //@ts-ignore
  identifiedTool,
  //@ts-ignore
  clearChat,
}) => {
  const messagesEndRef = useRef(null);
  const [isSuggestionProcessing, setIsSuggestionProcessing] = useState(false);
  const [thinkingText, setThinkingText] = useState(
    "Please wait while I process your request"
  );
  const [localSuggestions, setLocalSuggestions] = useState([]);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [triggerSubmitAfterSuggestion, setTriggerSubmitAfterSuggestion] =
    useState(false);
  const lastClickedSuggestionRef = useRef<string | null>(null);

  // Start timer when loading begins
  useEffect(() => {
    if (isLoading && !loadingStartTime) {
      //@ts-ignore
      setLoadingStartTime(Date.now());
    } else if (!isLoading) {
      setLoadingStartTime(null);
    }
  }, [isLoading, loadingStartTime]);

  // Determine thinking text message based on message content and timing
  function getThinkingBaseText() {
    // If no messages, this is the initial conversation
    if (!messages || messages.length === 0) {
      return "Please wait while I process your request";
    }

    // Use the identifiedTool from props to determine the thinking text
    if (identifiedTool) {
      if (identifiedTool === "executeSearch") {
        return "Fetching information from Microland policies";
      } else {
        return "Fetching information from MiHR";
      }
    }

    // Initial message with no tool invocations yet
    return "Please wait while I process your request";
  }

  // Set up thinking animation and check for long response time
  useEffect(() => {
    if (!isLoading) return;

    let baseText = getThinkingBaseText();
    const checkLoadingTime = () => {
      if (loadingStartTime && Date.now() - loadingStartTime > 7000) {
        baseText = "Just a couple more moments";
      }
      return baseText;
    };

    const dots = ["", ".", "..", "..."];
    let i = 0;

    const interval = setInterval(() => {
      const currentBaseText = checkLoadingTime();
      setThinkingText(`${currentBaseText}${dots[i % dots.length]}`);
      i++;
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading, loadingStartTime, messages]);

  // Extract suggestions from messages
  useEffect(() => {
    if (!messages || messages.length === 0) {
      setLocalSuggestions([]);
      return;
    }

    const extractSuggestions = () => {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || !lastMessage.content) {
        return [];
      }

      try {
        const match = lastMessage.content.match(/\{.*\}/);
        if (match) {
          const parsedData = JSON.parse(match[0]);
          if (parsedData.suggestions && Array.isArray(parsedData.suggestions)) {
            return parsedData.suggestions;
          }
        }
      } catch (error) {
        console.error("Error parsing suggestions:", error);
      }
      return [];
    };

    // Only update suggestions if they've actually changed
    const newSuggestions = extractSuggestions();
    if (JSON.stringify(newSuggestions) !== JSON.stringify(localSuggestions)) {
      setLocalSuggestions(newSuggestions);
    }
  }, [messages, localSuggestions]);

  // Handle scrolling
  function scrollToBottom() {
    if (messagesEndRef.current) {
      //@ts-ignore
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  // Reset suggestion processing state
  useEffect(() => {
    if (!isLoading && isSuggestionProcessing) {
      setIsSuggestionProcessing(false);
    }
  }, [isLoading, isSuggestionProcessing]);

  // Handle suggestion clicks
  function handleSuggestionClick(suggestion: string) {
    if (isLoading || isSuggestionProcessing) {
      return;
    }
    setIsSuggestionProcessing(true); // To disable buttons immediately

    // Create a synthetic event for handleInputChange
    const syntheticChangeEvent = {
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticChangeEvent);

    // Store suggestion and set trigger for useEffect
    lastClickedSuggestionRef.current = suggestion;
    setTriggerSubmitAfterSuggestion(true);

    // DO NOT call handleSubmit or use setTimeout here directly
  }
  // ---- END: Modified handleSuggestionClick ----

  // ---- START: New useEffect for submitting after input update ----
  useEffect(() => {
    if (
      triggerSubmitAfterSuggestion &&
      input === lastClickedSuggestionRef.current
    ) {
      const syntheticFormEvent = {
        preventDefault: () => {}, // Basic mock for preventDefault
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(syntheticFormEvent);

      // Reset the trigger and ref
      setTriggerSubmitAfterSuggestion(false);
      lastClickedSuggestionRef.current = null;
      // isSuggestionProcessing will be reset by its own useEffect when isLoading becomes false
    }
  }, [input, triggerSubmitAfterSuggestion, handleSubmit, handleInputChange]);

  const areSuggestionsDisabled = isLoading || isSuggestionProcessing;

  // Welcome banner component
  const WelcomeBanner = (
    <div
      className="welcome-banner"
      style={{
        textAlign: "center",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <img
        src="https://aicoedevstatefilestorage.blob.core.windows.net/ml35app/ml-mia-chatbot-logo.png"
        alt="MIA Logo"
        style={{
          width: "50px",
          height: "60px",
          margin: "0 auto 16px",
        }}
      />
      <div
        style={{
          color: "#e53e3e",
          fontSize: "1.3rem",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        {`Hi, I'm MIA,`}
      </div>
      <div style={{ fontSize: "1.20rem", marginBottom: "8px" }}>
        <span style={{ color: "#e53e3e" }}>M</span>
        <span style={{ color: "black" }}>icroland</span>
        <span style={{ color: "#e53e3e" }}> I</span>
        <span style={{ color: "black" }}>ntelligent</span>
        <span style={{ color: "#e53e3e" }}> A</span>
        <span style={{ color: "black" }}>ssistant.</span>
      </div>
      <div style={{ fontSize: "0.9rem", color: "black" }}>
        {`Need Help or Assistance with something? Ask MIA!.`}
      </div>
    </div>
  );

  return (
    <motion.main
      key="chat"
      className="messages-main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="messages-container">
        <div className="messages-scroll-area">
          <div className="messages-content">
            {WelcomeBanner}
            {/* @ts-ignore */}
            {messages.map((message, index) => (
              <MessageContainer
                key={`message-${index}`}
                message={message}
                index={index}
                isLastMessage={isLoading && index === messages.length - 1}
                sessionId={sessionId}
                requestId={requestId}
                leaveBalanceData={leaveBalanceData}
                onSuggestionClick={handleSuggestionClick}
              />
            ))}

            {isLoading && messages.length > 0 && (
              <div className="loading-container">
                <div style={{ fontStyle: "italic", color: "#4B5563" }}>
                  {thinkingText}
                </div>
              </div>
            )}

            {localSuggestions.length > 0 && (
              <div className="suggestions-wrapper">
                {localSuggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`suggestion-button ${
                      areSuggestionsDisabled ? "disabled" : ""
                    }`}
                    disabled={areSuggestionsDisabled}
                    style={{
                      opacity: areSuggestionsDisabled ? 0.6 : 1,
                      cursor: areSuggestionsDisabled
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="input-wrapper">
        <AIInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          clearChat={clearChat}
        />
      </div>
    </motion.main>
  );
};

// Add display name for better debugging
Messages.displayName = "Messages";

export default Messages;
