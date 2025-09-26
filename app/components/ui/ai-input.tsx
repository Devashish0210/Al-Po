"use client";

import { ChangeEvent, FormEvent } from "react";
import { RotateCcw, Send } from "lucide-react";

interface AIInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
  clearChat?: () => void;
}

export const AIInput = ({
  input,
  handleInputChange,
  handleSubmit,
  isLoading = false,
  clearChat,
  placeholder = "Type a message...",
}: AIInputProps) => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && input.trim()) {
      handleSubmit();
    }
  };

  const handleClearChat = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clearChat && !isLoading) {
      clearChat();
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center gap-2 p-3">
        {/* Clear Chat Button - Positioned outside input */}
        {clearChat && (
          <button
            type="button"
            onClick={handleClearChat}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
            aria-label="Clear conversation"
            disabled={isLoading}
            title="Clear conversation"
          >
            <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        )}

        {/* Input Form */}
        <form onSubmit={onSubmit} className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="w-full p-3 pr-12 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
            aria-label="Message input"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
              input.trim() && !isLoading
                ? "bg-white hover:bg-gray-100"
                : "cursor-not-allowed"
            }`}
            aria-label="Send message"
            disabled={isLoading || !input.trim()}
          >
            <img
              src="https://stg-web.microland.com/assets/images/Send-icon.png"
              alt="Send"
              className="h-5 w-5"
            />
          </button>
        </form>
      </div>
    </div>
  );
};
