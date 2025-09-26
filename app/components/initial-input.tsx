import React, { useEffect, useState, useRef } from "react"; // Added useEffect, useState, useRef
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

import { AIInput } from "./ui/ai-input";
import { cn } from "../../lib/utils";
import "../../app/globals.css";

interface InitialInputProps {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  handleSuggestionSubmit?: (suggestion: string) => void;
  clearChat?: () => void;
  isLoading?: boolean;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const springTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

// Suggestion buttons data
const suggestionButtons = [
  "Create Ticket",
  "How do I return IT assets for CIS NDC?",
  "When can I get my Relieving Letter?",
  "When is F&F settlement processed?",
];

export const InitialInput = ({
  input,
  handleInputChange,
  handleSubmit,
  handleSuggestionSubmit,
  isLoading = false,
  clearChat,
}: InitialInputProps) => {
  // State to trigger submission after input is set by a suggestion
  const [triggerSubmitAfterSuggestion, setTriggerSubmitAfterSuggestion] =
    useState(false);
  const lastClickedSuggestionRef = useRef<string | null>(null);

  // Function to handle suggestion button click
  const handleSuggestionClick = (suggestion: string) => {
    if (handleSuggestionSubmit) {
      // Use the dedicated suggestion handler if available
      handleSuggestionSubmit(suggestion);
    } else {
      // Fallback: Set input and then trigger submit via useEffect
      const syntheticEvent = {
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(syntheticEvent); // This updates the parent's state

      // Store the suggestion and set the trigger for useEffect
      lastClickedSuggestionRef.current = suggestion;
      setTriggerSubmitAfterSuggestion(true);
    }
  };

  // Effect to handle submission after input state is updated from a suggestion
  useEffect(() => {
    // Ensure this effect is triggered only when `triggerSubmitAfterSuggestion` is true
    // and the current `input` prop matches the last clicked suggestion.
    // This confirms the parent state has updated to the suggestion.
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
    }
  }, [input, triggerSubmitAfterSuggestion, handleSubmit]); // Rerun effect if these change

  return (
    <motion.main
      key="initial"
      className="flex-1 flex flex-col items-center justify-between text-center bg-white"
      initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
      transition={springTransition}
      style={{ fontFamily: "Proxima Nova, sans-serif" }}
    >
      {/* Centered Welcome Section */}
      <div className="welcome-section">
        <motion.div
          className="welcome-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...springTransition }}
        >
          <img
            src="https://aicoedevstatefilestorage.blob.core.windows.net/ml35app/ml-mia-chatbot-logo.png"
            alt="Welcome"
            style={{
              marginBottom: "4px",
              marginTop: "-42px",
              height: "80px",
              width: "70px",
            }}
          />
          <div
            style={{
              color: "#e53e3e",
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            Hi, I'm MIA,
          </div>
          <div style={{ fontSize: "1.25rem", marginBottom: "8px" }}>
            <span style={{ color: "#e53e3e" }}>M</span>
            <span style={{ color: "black" }}>icroland</span>
            <span style={{ color: "#e53e3e" }}> I</span>
            <span style={{ color: "black" }}>ntelligent</span>
            <span style={{ color: "#e53e3e" }}> A</span>
            <span style={{ color: "black" }}>ssistant.</span>
          </div>
          <div
            style={{ fontSize: "1rem", color: "black", marginBottom: "32px" }}
          >
            Need Help or Assistance with something? Ask{" "}
            <span style={{ color: "#e53e3e" }}>MIA</span>!
          </div>

          {/* Suggestion Buttons */}
          <motion.div
            className="suggestion-buttons-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...springTransition }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
              maxWidth: "800px",
              margin: "0 auto 100px auto",
              padding: "0 20px",
            }}
          >
            {suggestionButtons.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="suggestion-button"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  //borderRadius: "20px",
                  padding: "8px 16px",
                  fontSize: "0.875rem",
                  color: "#4a5568",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  opacity: isLoading ? 0.6 : 1,
                  minHeight: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                whileHover={
                  !isLoading
                    ? {
                        backgroundColor: "#f7fafc",
                        borderColor: "#e53e3e",
                        color: "#e53e3e",
                        scale: 1.02,
                        boxShadow: "0 2px 8px rgba(229,62,62,0.15)",
                      }
                    : {}
                }
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, ...springTransition }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* AI Input Field at the Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...springTransition }}
        className="w-full p-4 border-t"
      >
        <AIInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          clearChat={clearChat}
        />
      </motion.div>
    </motion.main>
  );
};
