"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Check, X } from "lucide-react";

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
  },
  modalBody: {
    padding: "16px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  datePickerWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  dateInput: {
    width: "100%",
    padding: "8px 12px",
    paddingLeft: "36px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "0.875rem",
  },
  calendarIcon: {
    position: "absolute",
    left: "12px",
    color: "#6b7280",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "16px",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    accentColor: "red",
  },
  checkboxLabel: {
    fontSize: "0.875rem",
    color: "#374151",
    display: "flex",
    alignItems: "center",
  },
  leaveBalance: {
    marginLeft: "8px",
    fontSize: "0.75rem",
    backgroundColor: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#4b5563",
  },
  submitButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
  successModalContent: {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  successIcon: {
    backgroundColor: "#ecfdf5",
    color: "#10b981",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px auto",
  },
  successTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  successMessage: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "24px",
  },
  closeSuccessButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    width: "100%",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "8px",
  },
  loadingText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    fontStyle: "italic",
  },
  dateNoticeMessage: {
    fontSize: "0.75rem",
    color: "#ef4444",
    marginTop: "4px",
    fontStyle: "italic",
  },
  daysSelectedMessage: {
    fontSize: "0.875rem",
    color: "#4b5563",
    backgroundColor: "#f3f4f6",
    padding: "8px 12px",
    borderRadius: "6px",
    marginTop: "12px",
    marginBottom: "16px",
    textAlign: "center",
    fontWeight: "500",
  },
  weekendNotice: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "4px",
    fontStyle: "italic",
  },
};

export function LeaveApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  employeeId,
  isSubmitting = false,
  leaveBalanceData,
}) {
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [daysSelected, setDaysSelected] = useState(0);
  const [weekdaysSelected, setWeekdaysSelected] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setLeaveType("Annual Leave");
      setStartDate("");
      setEndDate("");
      setShowSuccessModal(false);
      setError("");
      setDaysSelected(0);
      setWeekdaysSelected(0);

      // Use leaveBalanceData prop instead of fetching
      if (leaveBalanceData) {
        console.log("Processing leaveBalanceData:", leaveBalanceData);

        // Format the leaveBalanceData to match the expected structure
        const formattedBalances = {
          leaves: {},
        };

        // Handle if leaveBalanceData is in different formats
        if (typeof leaveBalanceData === "string") {
          // If it's a string with lines like "Sick Leave: '3 Days'"
          const lines = leaveBalanceData
            .split("\n")
            .filter((line) => line.trim() !== "");

          lines.forEach((line) => {
            const parts = line.split(":");
            if (parts.length === 2) {
              const leaveType = parts[0].trim();
              const balanceValue = parts[1].trim().replace(/['"]/g, "");
              formattedBalances.leaves[leaveType] = balanceValue;
            }
          });
        } else if (typeof leaveBalanceData === "object") {
          // If it's already an object
          Object.keys(leaveBalanceData).forEach((key) => {
            formattedBalances.leaves[key] = leaveBalanceData[key];
          });
        }

        setLeaveBalances(formattedBalances);
        console.log("Leave balances set from props:", formattedBalances);
      }
    }
  }, [isOpen, leaveBalanceData]);

  // When leave type changes, reset dates if changing to Sick Leave
  useEffect(() => {
    if (leaveType === "Sick Leave") {
      // If current dates are in the future, reset them
      if (startDate > today) {
        setStartDate(today);
      }
      if (endDate > today) {
        setEndDate(today);
      }
    }
  }, [leaveType]);

  // Calculate selected days when start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      calculateDaysSelected();
    } else {
      setDaysSelected(0);
      setWeekdaysSelected(0);
    }
  }, [startDate, endDate]);

  // Function to check if a date is a weekend (Saturday or Sunday)
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  // Calculate weekdays between two dates (excluding weekends)
  const calculateWeekdaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    // Clone the start date
    const current = new Date(start);

    // Loop through each day and count if it's a weekday
    while (current <= end) {
      if (!isWeekend(current)) {
        count++;
      }
      // Move to the next day
      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  const calculateDaysSelected = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in milliseconds
    const diffTime = Math.abs(end - start);
    // Convert to days and add 1 to include both start and end dates
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Calculate weekdays (excluding weekends)
    const weekdays = calculateWeekdaysBetweenDates(start, end);

    setDaysSelected(diffDays);
    setWeekdaysSelected(weekdays);
  };

  const validateForm = () => {
    // Check for required fields
    if (!leaveType) {
      setError("Please select a leave type");
      return false;
    }

    if (!startDate) {
      setError("Please select a start date");
      return false;
    }

    if (!endDate) {
      setError("Please select an end date");
      return false;
    }

    // Validate that leave type is one of the approved values
    if (leaveType !== "Annual Leave" && leaveType !== "Sick Leave") {
      setError('Leave type must be "Annual Leave" or "Sick Leave"');
      return false;
    }

    // For Sick Leave, ensure dates are not in the future
    if (leaveType === "Sick Leave") {
      if (startDate > today) {
        setError("You cannot select future dates for Sick Leave");
        return false;
      }
      if (endDate > today) {
        setError("You cannot select future dates for Sick Leave");
        return false;
      }
    }

    // Ensure start date is not after end date
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj > endDateObj) {
      setError("Start date cannot be after end date");
      return false;
    }

    // Check if any weekdays are selected (not just weekends)
    if (weekdaysSelected === 0) {
      setError(
        "Your selection only includes weekends. Please select at least one weekday."
      );
      return false;
    }

    // Clear any previous errors
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form field
    if (!validateForm()) {
      return;
    }

    // Ensure we have an employee ID
    if (!employeeId) {
      setError("Employee ID is missing. Please try again.");
      return;
    }

    try {
      const result = await onSubmit({
        emp_id: employeeId,
        leave_type: leaveType, // This must be exactly "Annual Leave" or "Sick Leave"
        start_date: startDate,
        end_date: endDate,
      });

      if (result) {
        setShowSuccessModal(true);
      } else {
        setError("Failed to submit leave application. Please try again.");
      }
    } catch (error) {
      console.error("Error in leave application:", error);
      setError(
        `Error: ${error.message || "Failed to submit leave application"}`
      );
    }
  };

  // Helper function to get leave balance for a specific type
  const getLeaveBalance = (type) => {
    if (!leaveBalances || !leaveBalances.leaves) {
      return null;
    }

    // Get the leave balance from the leaves object
    return leaveBalances.leaves[type] || null;
  };

  const annualLeaveBalance = getLeaveBalance("Annual Leave");
  const sickLeaveBalance = getLeaveBalance("Sick Leave");

  // Handle leave type change
  const handleLeaveTypeChange = (newLeaveType) => {
    setLeaveType(newLeaveType);

    // If changing to Sick Leave and current dates are in the future, reset them to today
    if (newLeaveType === "Sick Leave") {
      if (startDate > today) {
        setStartDate(today);
      }
      if (endDate > today) {
        setEndDate(today);
      }
    }
  };

  if (!isOpen) return null;

  if (showSuccessModal) {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.successModalContent}>
          <div style={styles.successIcon}>
            <Check size={24} />
          </div>
          <h3 style={styles.successTitle}>Leave Applied Successfully</h3>
          <p style={styles.successMessage}>
            Your {leaveType} request from {startDate} to {endDate} has been
            submitted for {weekdaysSelected} working day
            {weekdaysSelected !== 1 ? "s" : ""}.
          </p>
          <button
            style={styles.closeSuccessButton}
            onClick={() => {
              setShowSuccessModal(false);
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Apply for Leave</h3>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Leave Type</label>
              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxItem}>
                  <input
                    type="radio"
                    name="leaveType"
                    value="Annual Leave"
                    checked={leaveType === "Annual Leave"}
                    onChange={() => handleLeaveTypeChange("Annual Leave")}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxLabel}>
                    Annual Leave
                    {annualLeaveBalance ? (
                      <span style={styles.leaveBalance}>
                        {annualLeaveBalance}
                      </span>
                    ) : null}
                  </span>
                </label>
                <label style={styles.checkboxItem}>
                  <input
                    type="radio"
                    name="leaveType"
                    value="Sick Leave"
                    checked={leaveType === "Sick Leave"}
                    onChange={() => handleLeaveTypeChange("Sick Leave")}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxLabel}>
                    Sick Leave
                    {sickLeaveBalance ? (
                      <span style={styles.leaveBalance}>
                        {sickLeaveBalance}
                      </span>
                    ) : null}
                  </span>
                </label>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date</label>
              <div style={styles.datePickerWrapper}>
                <Calendar size={16} style={styles.calendarIcon} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={styles.dateInput}
                  required
                  max={leaveType === "Sick Leave" ? today : undefined}
                />
              </div>
              {leaveType === "Sick Leave" && (
                <div style={styles.dateNoticeMessage}>
                  {`You cannot select future dates for Sick Leave. Only today and past dates are allowed.`}
                </div>
              )}
              {leaveType === "Annual Leave" && (
                <div style={styles.weekendNotice}>
                  You can select both past and future dates for Annual Leave
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <div style={styles.datePickerWrapper}>
                <Calendar size={16} style={styles.calendarIcon} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={styles.dateInput}
                  required
                  min={startDate || undefined}
                  max={leaveType === "Sick Leave" ? today : undefined}
                />
              </div>
              {leaveType === "Sick Leave" && (
                <div style={styles.dateNoticeMessage}>
                  {`You cannot select future dates for Sick Leave. Only today and past dates are allowed.`}
                </div>
              )}
            </div>

            {/* Display the number of days selected when both dates are chosen */}
            {startDate && endDate && (
              <div style={styles.daysSelectedMessage}>
                {weekdaysSelected === 0 ? (
                  <span>Your selection only includes weekends</span>
                ) : (
                  <span>
                    {daysSelected} calendar day{daysSelected !== 1 ? "s" : ""}{" "}
                    selected ({weekdaysSelected} working day
                    {weekdaysSelected !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
            )}

            {startDate && endDate && (
              <div style={styles.weekendNotice}>
                Note: Saturdays and Sundays are not counted as working days
              </div>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isSubmitting ? styles.disabledButton : {}),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Apply Leave"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
