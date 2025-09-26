import React, { useState, useMemo } from "react";
import {
  format,
  parseISO,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  CalendarIcon,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Button } from "../app/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../app/components/ui/table";
import { AttendanceRecord, AttendanceResponse } from "../lib/types";

const statusColors = {
  PRESENT: "bg-green-500/20 text-green-300 border border-green-500/30",
  ABSENT: "bg-red-500/20 text-red-300 border border-red-500/30",
  ON_LEAVE: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  HALF_DAY: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  WFH: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
};

const statusIcons = {
  PRESENT: Check,
  ABSENT: X,
  ON_LEAVE: CalendarIcon,
  HALF_DAY: Clock,
  WFH: Home,
};

const statusLabels = {
  PRESENT: "Present",
  ABSENT: "Absent",
  ON_LEAVE: "On Leave",
  HALF_DAY: "Half Day",
  WFH: "Work From Home",
};

function LoadingSkeleton() {
  return (
    <div className="w-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Loading skeleton content remains the same */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-[240px] h-10 bg-neutral-800 rounded animate-pulse" />
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-neutral-800 rounded animate-pulse" />
            <div className="w-10 h-10 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-3 bg-neutral-800 animate-pulse"
            >
              <div className="h-6 bg-neutral-700 rounded w-20 mb-2" />
              <div className="h-8 bg-neutral-700 rounded w-12" />
            </div>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border border-neutral-700/50 bg-gradient-to-br from-neutral-900/90 to-neutral-800/90">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-700/50">
                <TableHead className="text-neutral-300">Date</TableHead>
                <TableHead className="text-neutral-300">Status</TableHead>
                <TableHead className="text-neutral-300">Check In</TableHead>
                <TableHead className="text-neutral-300">Check Out</TableHead>
                <TableHead className="text-neutral-300">Duration</TableHead>
                <TableHead className="text-neutral-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-neutral-700/50">
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-6 bg-neutral-800 rounded animate-pulse w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}

function organizeByWeeks(
  attendanceData: AttendanceRecord[]
): AttendanceRecord[][] {
  if (!attendanceData?.length) return [];

  // Sort data by date
  const sortedData = [...attendanceData].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  // If we have less than or equal to 5 days, just return as a single week
  if (sortedData.length <= 5) {
    return [sortedData];
  }

  const weeks: AttendanceRecord[][] = [];
  let currentWeek: AttendanceRecord[] = [];

  sortedData.forEach((record, index) => {
    currentWeek.push(record);

    // Start new week after 5 records or at the end
    if (currentWeek.length === 5 || index === sortedData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return weeks;
}

export default function WeeklyAttendanceCalendar({
  data,
  isLoading,
}: {
  data: AttendanceResponse | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data?.d?.results || data.d.results.length === 0) {
    return (
      <div className="w-full p-4 text-center">
        <div className="rounded-xl p-6 bg-gradient-to-br from-red-900/90 to-red-800/90 border border-red-700/50">
          <p className="text-red-200">No attendance data available</p>
        </div>
      </div>
    );
  }

  const attendanceData = data.d.results;
  const weeks = useMemo(
    () => organizeByWeeks(attendanceData),
    [attendanceData]
  );

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    try {
      return parseISO(attendanceData[0].date);
    } catch {
      return new Date();
    }
  });

  const currentWeekIndex = useMemo(() => {
    return Math.max(
      0,
      weeks.findIndex((week) =>
        week.some((day) => isSameDay(parseISO(day.date), selectedDate))
      )
    );
  }, [weeks, selectedDate]);

  const currentWeek = weeks[currentWeekIndex];

  if (!currentWeek) {
    return (
      <div className="w-full p-4 text-center">
        <div className="rounded-xl p-6 bg-gradient-to-br from-yellow-900/90 to-yellow-800/90 border border-yellow-700/50">
          <p className="text-yellow-200">
            No records available for the selected period
          </p>
        </div>
      </div>
    );
  }

  const weekStats = currentWeek.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    if (record.isLate) acc.lateCount = (acc.lateCount || 0) + 1;
    if (record.isEarlyDeparture) acc.earlyCount = (acc.earlyCount || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) {
      const prevWeek = weeks[currentWeekIndex - 1];
      if (prevWeek?.length) {
        setSelectedDate(parseISO(prevWeek[0].date));
      }
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      const nextWeek = weeks[currentWeekIndex + 1];
      if (nextWeek?.length) {
        setSelectedDate(parseISO(nextWeek[0].date));
      }
    }
  };

  const handleRegularize = (date: string) => {
    console.log(`Regularizing attendance for ${date}`);
  };

  const shouldShowTimeInfo = (status: string) => {
    return ["PRESENT", "HALF_DAY", "WFH"].includes(status);
  };

  return (
    <div className="w-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-neutral-400" />
            <h2 className="text-lg font-medium text-neutral-200">
              {format(parseISO(currentWeek[0].date), "MMM d ")} -
              {format(
                parseISO(currentWeek[currentWeek.length - 1].date),
                " MMM d, yyyy"
              )}
            </h2>
          </div>

          {weeks.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                //@ts-ignore
                variant="outline"
                size="sm"
                onClick={handlePreviousWeek}
                disabled={currentWeekIndex === 0}
                className="bg-neutral-900/50 border-neutral-700/50 hover:bg-neutral-800/50 disabled:opacity-50 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Week
              </Button>
              <Button
                //@ts-ignore
                variant="outline"
                size="sm"
                onClick={handleNextWeek}
                disabled={currentWeekIndex === weeks.length - 1}
                className="bg-neutral-900/50 border-neutral-700/50 hover:bg-neutral-800/50 disabled:opacity-50 hover:text-white"
              >
                Next Week
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Weekly Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusLabels).map(([status, label]) => (
            <div
              key={status}
              className={cn(
                "rounded-lg p-3",
                statusColors[status as keyof typeof statusColors],
                "bg-opacity-10"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <span className="text-lg font-semibold">
                  {weekStats[status] || 0}
                </span>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWeekIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl overflow-hidden border border-neutral-700/50 bg-gradient-to-br from-neutral-900/90 to-neutral-800/90"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-700/50 hover:bg-transparent">
                  <TableHead className="text-neutral-300">Date</TableHead>
                  <TableHead className="text-neutral-300">Status</TableHead>
                  <TableHead className="text-neutral-300">Check In</TableHead>
                  <TableHead className="text-neutral-300">Check Out</TableHead>
                  <TableHead className="text-neutral-300">Duration</TableHead>
                  <TableHead className="text-neutral-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentWeek.map((record) => (
                  <TableRow
                    key={record.date}
                    className={cn(
                      "border-neutral-700/50 transition-colors hover:bg-neutral-800/50",
                      !isSameMonth(parseISO(record.date), selectedDate) &&
                        "opacity-50"
                    )}
                  >
                    <TableCell className="text-neutral-200">
                      {format(parseISO(record.date), "EEE, MMM d")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          statusColors[record.status]
                        }`}
                      >
                        {React.createElement(statusIcons[record.status], {
                          className: "w-3 h-3 mr-1",
                        })}
                        {statusLabels[record.status]}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-neutral-200",
                        record.isLate && "text-red-300"
                      )}
                    >
                      {shouldShowTimeInfo(record.status)
                        ? record.checkIn || "N/A"
                        : "-"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-neutral-200",
                        record.isEarlyDeparture && "text-red-300"
                      )}
                    >
                      {shouldShowTimeInfo(record.status)
                        ? record.checkOut || "N/A"
                        : "-"}
                    </TableCell>
                    <TableCell className="text-neutral-200">
                      {shouldShowTimeInfo(record.status)
                        ? record.duration
                          ? `${Math.floor(record.duration / 60)}h ${
                              record.duration % 60
                            }m`
                          : "N/A"
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        //@ts-ignore
                        size="sm"
                        variant="outline"
                        onClick={() => handleRegularize(record.date)}
                        disabled={
                          (record.status === "PRESENT" &&
                            !record.isLate &&
                            !record.isEarlyDeparture) ||
                          record.status === "WFH"
                        }
                        className="bg-neutral-900/50 border-neutral-700/50 hover:bg-neutral-800/50 hover:text-white disabled:opacity-50"
                      >
                        Regularize
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
