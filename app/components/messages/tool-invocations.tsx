"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LeaveDashboard } from "../../../tools/leaves";
import { LeaveApplicationModal } from "../../../tools/LeaveApplicationModal";
import { TicketCreationModal } from "../../../tools/TicketCreationModal";

//@ts-ignore
export const ToolInvocations = ({ toolInvocations, leaveBalanceData }) => {
  // State for tracking leave application modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [currentToolId, setCurrentToolId] = useState(null);
  const [showApplyLeavePrompt, setShowApplyLeavePrompt] = useState(false);

  // State for tracking ticket creation modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [showCreateTicketPrompt, setShowCreateTicketPrompt] = useState(false);

  //console.log('employeeData: ', employeeData);

  // Check if toolInvocations exists and is an array
  if (!toolInvocations || !Array.isArray(toolInvocations)) {
    console.warn("No valid tool invocations found");
    return null;
  }

  // Find tools and set up modals when needed
  useEffect(() => {
    // Check if we have any applyLeave tool invocation, regardless of state
    const applyLeaveTool = toolInvocations.find(
      (tool) => tool.toolName === "applyLeave"
    );
    // Check if we have any createTicket tool invocation
    const createTicketTool = toolInvocations.find(
      (tool) => tool.toolName === "createTicket"
    );

    // Process employee ID from tools
    let empId = "";

    // Try to find employee ID from any available tool
    const toolsWithEmpId = toolInvocations.filter(
      (tool) =>
        (tool.args && tool.args.emp_id) ||
        (tool.parameters && tool.parameters.emp_id)
    );

    if (toolsWithEmpId.length > 0) {
      // Get the first tool with employee ID
      const toolWithEmpId = toolsWithEmpId[0];

      if (toolWithEmpId.args && toolWithEmpId.args.emp_id) {
        empId = toolWithEmpId.args.emp_id;
      } else if (toolWithEmpId.parameters && toolWithEmpId.parameters.emp_id) {
        empId = toolWithEmpId.parameters.emp_id;
      }
    }

    // Update state with the found employee ID
    if (empId) {
      setEmployeeId(empId);
    }

    // Process applyLeave tool if found
    if (applyLeaveTool) {
      console.log("Found applyLeave tool:", applyLeaveTool);

      // Set the current tool ID for submission reference
      setCurrentToolId(applyLeaveTool.toolCallId);

      // Set the apply leave prompt when there's an applyLeave tool
      setShowApplyLeavePrompt(true);
    }

    // Process createTicket tool if found
    if (createTicketTool) {
      console.log("Found createTicket tool:", createTicketTool);

      // Set the create ticket prompt when there's a createTicket tool
      setShowCreateTicketPrompt(true);
    }
  }, [toolInvocations]); // Dependencies properly set to only run when toolInvocations changes

  // Handle direct API call for leave application
  //@ts-ignore
  const submitLeaveDirectly = async (leaveData) => {
    console.log("Submitting leave directly:", leaveData);

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://alumniapi.microland.com/employee/apply-leave",
        {
          method: "POST",
          headers: {
            Authorization: `Token e31a980a14e0fcf1fad52ccc1f9c9fec86dc6f69`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emp_id: leaveData.emp_id,
            leave_type: leaveData.leave_type,
            start_date: leaveData.start_date,
            end_date: leaveData.end_date,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Failed to apply leave: ${response.status} ${response.statusText}${
            errorData ? ": " + JSON.stringify(errorData) : ""
          }`
        );
      }

      const responseData = await response.json();

      // Auto-close the modal after successful submission
      setTimeout(() => setShowLeaveModal(false), 3000);

      return true;
    } catch (error) {
      console.error("Error submitting leave application:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle direct ticket creation (placeholder - you can implement API call here)
  //@ts-ignore
  const submitTicketDirectly = async (ticketData) => {
    console.log("Submitting ticket directly:", ticketData);

    setIsSubmittingTicket(true);

    try {
      // You can implement direct API call here if needed
      // For now, we're using the existing modal's internal submission logic

      // Auto-close the modal after successful submission
      setTimeout(() => setShowTicketModal(false), 3000);

      return true;
    } catch (error) {
      console.error("Error submitting ticket:", error);
      return false;
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Function to handle button click to open the modals
  const handleOpenLeaveModal = () => {
    setShowLeaveModal(true);
  };

  const handleOpenTicketModal = () => {
    setShowTicketModal(true);
  };

  // Prepare data for the dashboard if available
  const dashboardData = toolInvocations.find(
    (tool) =>
      tool.toolName === "fetchFullLeaveBalance" && tool.state === "result"
  );

  return (
    <>
      {/* Tool prompts container */}
      <div className="tool-prompts mt-4 flex flex-col gap-4">
        {/* Render apply leave prompt and button when needed */}
        {showApplyLeavePrompt && (
          <div className="apply-leave-prompt">
            <p className="mb-3 text-lg font-medium">
              I will be happy to assist you with leave application
            </p>
            <button
              onClick={handleOpenLeaveModal}
              style={{
                padding: "2px 8px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                backgroundColor: "white",
                border: "1px solid #f08080",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Apply for Leave
            </button>
          </div>
        )}

        {/* Render create ticket prompt and button when needed */}
        {showCreateTicketPrompt && (
          <div className="create-ticket-prompt">
            <p className="mb-3 text-lg font-medium">
              I can help you create a new support ticket
            </p>
            <button
              onClick={handleOpenTicketModal}
              style={{
                padding: "2px 8px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                backgroundColor: "white",
                border: "1px solid #f08080",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Create Ticket
            </button>
          </div>
        )}
      </div>

      {/* Render leave dashboard if data is available */}
      {dashboardData && (
        <LeaveDashboard
          key={dashboardData.toolCallId}
          isLoading={false}
          data={dashboardData.result}
        />
      )}

      {/* Render leave application modal when needed */}
      <LeaveApplicationModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onSubmit={submitLeaveDirectly}
        employeeId={employeeId}
        isSubmitting={isSubmitting}
        leaveBalanceData={leaveBalanceData}
      />

      {/* Render ticket creation modal when needed */}
      <TicketCreationModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        onSubmit={submitTicketDirectly}
        employeeId={employeeId}
        isSubmitting={isSubmittingTicket}
      />
    </>
  );
};
