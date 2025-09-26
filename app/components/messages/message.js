"use client";
import React from "react";
import { Markdown } from "../ui/markdown";
import { ToolInvocations } from "./tool-invocations";

export const Message = ({ message, leaveBalanceData }) => {
  // console.log("Emp leave bal in message: ", leaveBalanceData);

  // User message handling
  if (message.role === "user") {
    return <div className="user-message">{message.content}</div>;
  }

  let cleanedMessageContent = message.content;

  console.log("Message: ", message);

  try {
    // Remove the entire JSON object containing suggestions
    const jsonMatch = message.content.match(/\{["']suggestions["']:.*\}/s);
    if (jsonMatch) {
      cleanedMessageContent = message.content.replace(jsonMatch[0], "").trim();
    }

    // Additional cleanup to remove any trailing whitespace or newlines
    cleanedMessageContent = cleanedMessageContent.replace(/\s+$/, "");
  } catch (error) {
    console.error("Error processing message content:", error);
  }

  // Check if message has tool invocations
  const hasToolInvocations =
    message.parts &&
    message.parts.some((part) => part.type === "tool-invocation");

  // Check specifically for applyLeave tool
  const hasApplyLeaveTool =
    (hasToolInvocations &&
      message.parts.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation &&
          part.toolInvocation.toolName === "applyLeave"
      )) ||
    (message.toolInvocations &&
      message.toolInvocations.some((tool) => tool.toolName === "applyLeave"));

  // If it's an applyLeave tool invocation, only show the tool UI, not the text
  if (hasApplyLeaveTool) {
    // Check if message has parts with tool invocations
    if (message.parts && message.parts.length > 0) {
      // Filter out tool invocation parts
      const toolInvocationParts = message.parts.filter(
        (part) => part.type === "tool-invocation" && part.toolInvocation
      );

      return (
        <>
          {toolInvocationParts.map((part, index) => (
            <ToolInvocations
              key={`tool-${index}`}
              toolInvocations={[part.toolInvocation]}
              leaveBalanceData={leaveBalanceData}
            />
          ))}
        </>
      );
    } else if (message.toolInvocations) {
      // Handle toolInvocations at the message level
      return (
        <ToolInvocations
          toolInvocations={message.toolInvocations}
          leaveBalanceData={leaveBalanceData}
        />
      );
    }
  }

  // For other tools or no tools at all
  if (message.parts && message.parts.length > 0) {
    // Filter out tool invocation parts
    const toolInvocationParts = message.parts.filter(
      (part) => part.type === "tool-invocation" && part.toolInvocation
    );

    // If tool invocation parts exist, render them
    if (toolInvocationParts.length > 0) {
      return (
        <>
          {toolInvocationParts.map((part, index) => (
            <ToolInvocations
              key={`tool-${index}`}
              toolInvocations={[part.toolInvocation]}
              leaveBalanceData={leaveBalanceData}
            />
          ))}
          {/* Render remaining text parts */}
          {message.parts
            .filter((part) => part.type === "text" && part.text)
            .map((part, index) => (
              <Markdown key={`text-${index}`} content={cleanedMessageContent} />
            ))}
        </>
      );
    }
  }

  // Fallback to rendering content directly
  return <Markdown content={cleanedMessageContent} />;
};
