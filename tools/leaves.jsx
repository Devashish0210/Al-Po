import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  HeartPulseIcon as Heartbeat,
  Home,
  Book,
  Heart,
  Coffee,
  DollarSign,
  Smile,
} from "lucide-react";

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "flex-start", // Align to left
    alignItems: "center",
    // minHeight: '100vh',
    // backgroundColor: "#f4f4f5",
    padding: "0", // Remove padding
    height: "auto",
    marginBottom: "10px",
  },
  mainCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    padding: "14px",
    width: "100%",
    maxWidth: "280px", // Slightly reduced width
    marginLeft: "0", // Ensure left alignment
    marginRight: "auto",
    height: "330px",
  },
  dashboardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#27272a",
    marginBottom: "16px",
  },
  leaveSummaryCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  cardContainer: {
    display: "flex",
    overflowX: "auto",
    gap: "16px",
    width: "100%",
    paddingBottom: "16px",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    "-ms-overflow-style": "none",
    scrollbarWidth: "none",
  },
  leaveCard: {
    flexShrink: 0,
    width: "100%",
    backgroundColor: "white",
    border: "1px solid #e4e4e7",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    height: "200px",
  },
};

const iconStyles = {
  colors: {
    "Annual Leave": "#3b82f6",
    "Sick Leave": "#ef4444",
    "Compensatory Leave": "#f59e0b",
    "Paternity Leave": "#ec4899",
    "Compassionate Leave": "#a855f7",
    "Work From Home": "#22c55e",
    "Unpaid Leave": "#f97316",
    "Study Leave": "#0ea5e9",
  },
};

const iconMap = {
  "Annual Leave": Briefcase,
  "Sick Leave": Heartbeat,
  "Compensation Off": Coffee,
  "Paternity Leave": Heart,
  "Compassionate Leave": Heart,
  "Stretched Hour Comp-Off": Home,
  "Statutory Comp-Off": DollarSign,
  "Service Milestone Leave": Book,
};

export function LeaveDashboard({ data, isLoading }) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const leaveTypes = Object.entries(data.leaves).map(
    ([timeAccountTypeName, balance]) => ({
      timeAccountTypeName,
      entitlements: {
        total: parseFloat(balance) || 0,
        used: 0,
        pending: 0,
        reserved: 0,
        available: parseFloat(balance) || 0,
      },
      externalCode: timeAccountTypeName.replace(/\s+/g, "-").toLowerCase(),
    })
  );

  const totalLeaves = leaveTypes.reduce(
    (acc, leave) => acc + (leave.entitlements.total || 0),
    0
  );
  const usedLeaves = leaveTypes.reduce(
    (acc, leave) => acc + (leave.entitlements.used || 0),
    0
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainCard}>
        <h6 style={styles.dashboardTitle}>Leave Dashboard</h6>

        <div style={styles.leaveSummaryCard}>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#27272a",
            }}
          >
            {usedLeaves} / {totalLeaves} Days Used
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#e4e4e7",
              borderRadius: "20px",
              overflow: "hidden",
              width: "100px",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                backgroundColor: "#3b82f6",
                width: `${(usedLeaves / totalLeaves) * 100}%`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(usedLeaves / totalLeaves) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div style={styles.cardContainer}>
          {leaveTypes.map((leave) => (
            <LeaveCard key={leave.externalCode} leave={leave} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LeaveCard({ leave }) {
  const { total, used, pending, reserved, available } = leave.entitlements;
  const progress = total ? (used / total) * 100 : 0;
  const Icon = iconMap[leave.timeAccountTypeName] || Smile;

  return (
    <div style={styles.leaveCard}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#52525b",
          }}
        >
          {leave.timeAccountTypeName}
        </div>
        <Icon
          style={{
            width: "20px",
            height: "20px",
            color: iconStyles.colors[leave.timeAccountTypeName] || "#71717a",
          }}
        />
      </div>

      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          color: "#18181b",
          marginBottom: "4px",
        }}
      >
        {available ?? "∞"}
      </div>
      <div
        style={{
          color: "#71717a",
          fontSize: "0.75rem",
          marginBottom: "8px",
        }}
      >
        Available Days
      </div>

      {total !== null && (
        <div
          style={{
            height: "8px",
            backgroundColor: "#e4e4e7",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor:
                progress > 75
                  ? "#ef4444"
                  : progress > 50
                  ? "#f59e0b"
                  : "#22c55e",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          fontSize: "0.75rem",
          color: "#71717a",
        }}
      >
        <div>Total: {total ?? "∞"}</div>
        <div>Used: {used}</div>
        <div>Pending: {pending}</div>
        <div>Reserved: {reserved}</div>
      </div>
    </div>
  );
}

export default LeaveDashboard;
