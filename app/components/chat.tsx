"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { InitialInput } from "./initial-input";
import { Messages } from "../components/messages/messages";
import { Header } from "./header";
import Cookies from "js-cookie";
import { AlertCircle } from "lucide-react";
import { BarLoader } from "react-spinners";
import APILogger from "./APILogger";
import { v4 as uuidv4 } from "uuid";
import DocumentsTab from "../documents/_components/DocumentsTab";
import LinkTabs from "../_components/link-tabs";
import { linkTabsData } from "../_components/link-tabs-data";

export const Chat = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [bearerToken, setBearerToken] = useState(null);

  const logger = new APILogger("https://ai.microland.com/logger");
  const [requestId, setRequestId] = useState(null);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [leaveBalanceData, setLeaveBalanceData] = useState(null);
  const [identifiedTool, setIdentifiedTool] = useState(null);

  const {
    messages: rawMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    maxSteps: 10,
    //api: '/https://alumniservices.microland.com/api/chat',
    api: "/api/chat",
    body: {
      requestId: requestId,
      sessionId: sessionId,
    },
    onResponse: (response: any) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Check for leave balance data in headers
      const leaveBalanceHeader = response.headers.get("X-Leave-Balance");
      if (leaveBalanceHeader) {
        try {
          // Decode the base64 string before parsing as JSON
          const decodedData = atob(leaveBalanceHeader);
          const leaveData = JSON.parse(decodedData);
          setLeaveBalanceData(leaveData);
          console.log("Received leave balance data:", leaveData);
        } catch (e) {
          console.error("Error parsing leave balance data:", e);
          console.error("Raw header value:", leaveBalanceHeader);
        }
      }

      // Get identified tool from headers
      const identifiedToolHeader = response.headers.get("X-Identified-Tool");
      if (identifiedToolHeader) {
        setIdentifiedTool(identifiedToolHeader);
        console.log("Identified tool:", identifiedToolHeader);
      }

      return response;
    },
  });

  // Filter out messages with empty content
  const messages = rawMessages.filter(
    (message) => message.content.trim() !== ""
  );

  console.log("rawMessages:", rawMessages);

  // Token Validation Function
  // const validateToken = async (loginToken: string) => {
  //   try {
  //     const response = await fetch(
  //       // `/api/validatetoken?LoginToken=${encodeURIComponent(loginToken)}`
  //       `/copilot/stg-policy-chatbot/api/validatetoken?LoginToken=${encodeURIComponent(
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

  // Initial Token Validation
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

  // Clear Chat Logic
  const clearChat = () => {
    setMessages([]);
    setLeaveBalanceData(null);
    setIdentifiedTool(null);
  };

  const customHandleSubmit = async () => {
    const newRequestId = uuidv4(); // Generate new requestId
    //@ts-ignore
    setRequestId(newRequestId); // Async update

    await logger
      .logEvent(newRequestId, "hr-bot", sessionId, "initiation", "success")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    await logger
      .logEvent(newRequestId, "hr-bot", sessionId, "preprocess", "success")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    await logger
      .logEvent(newRequestId, "hr-bot", sessionId, "llm-call", "success", {
        query: input,
        environment: "staging",
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    handleSubmit();
  };

  const handleSuggestionSubmit = (suggestion: string) => {
    // Create a synthetic event
    const syntheticEvent = {
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>;

    // Update input
    handleInputChange(syntheticEvent);

    // Force a re-render and then submit
    setTimeout(async () => {
      const newRequestId = uuidv4();
      //@ts-ignore
      setRequestId(newRequestId);

      await logger
        .logEvent(newRequestId, "hr-bot", sessionId, "initiation", "success")
        .then((response) => console.log(response))
        .catch((error) => console.log(error));

      await logger
        .logEvent(newRequestId, "hr-bot", sessionId, "preprocess", "success")
        .then((response) => console.log(response))
        .catch((error) => console.log(error));

      await logger
        .logEvent(newRequestId, "hr-bot", sessionId, "llm-call", "success", {
          query: suggestion,
          environment: "staging",
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));

      handleSubmit();
    }, 50); // Increased timeout to ensure state update
  };

  // Re-run `useChat` when `requestId` updates
  useEffect(() => {
    if (requestId) {
      //console.log("Updated useChat body with requestId: ", requestId);
    }
  }, [requestId]);

  // Show authentication UI if not validated
  // if (!isTokenValidated) {
  //   return (
  //     <div className="fixed inset-0 bg-white flex items-center justify-center">
  //       <div className="flex flex-col items-center text-center space-y-4">
  //         <div className="bg-red-100 p-3 rounded-full">
  //           <AlertCircle className="h-8 w-8 text-red-500" />
  //         </div>
  //         <h2 className="text-xl font-semibold text-gray-900">
  //           Authentication Required
  //         </h2>
  //         <p className="text-gray-600">
  //           Please provide a valid login token to access the chat interface.
  //         </p>
  //         {isAuthenticating && <BarLoader />}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="h-screen bg-gradient-to-b flex flex-col overflow-hidden">
      <LinkTabs
        data={linkTabsData.data}
        style={linkTabsData.style}
        selected={3}
      />
      <AnimatePresence mode="wait">
        {messages.length === 0 ? (
          <InitialInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={customHandleSubmit}
            isLoading={isLoading}
            clearChat={clearChat}
          />
        ) : (
          <Messages
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={customHandleSubmit}
            isLoading={isLoading}
            requestId={requestId}
            sessionId={sessionId}
            leaveBalanceData={leaveBalanceData}
            identifiedTool={identifiedTool}
            clearChat={clearChat}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
