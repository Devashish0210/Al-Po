import React from "react";

interface HeaderProps {
    onClearChat: () => void;
}

export const Header = ({ onClearChat }: HeaderProps) => {
    return (
        <header
            className="p-4 flex items-center justify-between border-b border-gray-300"
            style={{
                backgroundColor: "black",
                fontFamily: "Proxima Nova, sans-serif",
            }}
        >
            <div className="flex items-center space-x-2">
                <img
                    src='https://aicoedevstatefilestorage.blob.core.windows.net/ml35app/ml-mia-chatbot-logo.png'
                    alt="AI Assistant"
                    className="h-10 w-8"
                />
                <span className="text-white text-lg font-semibold">ASK ML AI</span>
            </div>

            {/* Clear Chat Button */}
            <button
                onClick={onClearChat}
                className="text-white text-sm font-semibold hover:text-red-500 transition-all"
            >
                New Conversation
            </button>
        </header>
    );
};
