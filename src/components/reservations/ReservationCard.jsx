import React from 'react';
import { Calendar, Clock, ChevronRight, Monitor, MapPin } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';
import Badge from '../ui/Badge';

/* ── Helpers ── */
const formatRelativeTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    if (diffInHours < 1) return "Just now";
    return `${Math.floor(diffInHours)} hours ago`;
  }
  return formatDate(date);
};

const statusStyles = {
  pending: {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Pending"
  },
  approved: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Approved"
  },
  rejected: {
    bar: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
    label: "Rejected"
  },
  rescheduled: {
    bar: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    label: "Rescheduled"
  },
  cancelled: {
    bar: "bg-primary-light/20",
    badge: "bg-primary/5 text-primary border-primary/15",
    label: "Cancelled"
  },
  used: {
    bar: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    label: "Used"
  },
  fulfilled: {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Fulfilled"
  },
};

const ReservationCard = ({
  reservation = {},
  // Individual props for backward compatibility
  id: propId,
  pcNumber: propPcNumber,
  labCode: propLabCode,
  labName: propLabName,
  date: propDate,
  time: propTime,
  status: propStatus,
  purpose: propPurpose,
  created_at: propCreatedAt,
  isExpanded = false,
  onToggle = () => {},
  children,
  className = "",
  compact = false
}) => {
  const {
    id = propId,
    pc_number = propPcNumber,
    lab_code = propLabCode,
    name = propLabName,
    reserved_date = propDate,
    reserved_time = propTime,
    time_slot = propTime,
    status = propStatus || "pending",
    purpose = propPurpose,
    created_at = propCreatedAt
  } = reservation;

  const style = statusStyles[status.toLowerCase()] || statusStyles.pending;
  const displayName = name || "Laboratory";
  const displayTime = reserved_time || time_slot;
  const displayPc = pc_number?.toString().startsWith('PC') ? pc_number : `PC ${pc_number}`;

  return (
    <div
      className={`group relative border border-border rounded-xl p-0 transition-all duration-300 bg-white overflow-hidden ${
        isExpanded
          ? "shadow-md ring-1 ring-primary/10 border-primary/20"
          : "hover:shadow-sm hover:border-primary-hover/35"
      } ${className}`}
    >
      {/* Status Accent Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 scale-y-100 transition-colors duration-300 ${style.bar}`}
      />

      {/* Main Card Header (Clickable) */}
      <button
        onClick={onToggle}
        className={`w-full text-left flex flex-col sm:flex-row sm:items-start justify-between gap-3 ml-1 focus:outline-none ${
          compact ? "px-4 py-3" : "px-5 py-4 sm:px-6 sm:py-5"
        }`}
      >
        <div className="flex-1">
          <div className={`flex items-start justify-between gap-4 ${compact ? "mb-1.5" : "mb-3"}`}>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`${compact ? "text-sm" : "text-lg"} font-bold text-primary leading-tight`}>
                  {displayPc}
                </span>
                {lab_code && (
                  <span className={`px-1.5 py-0.5 rounded bg-primary/5 ${compact ? "text-[8px]" : "text-[10px]"} font-bold text-primary-light border border-primary/10`}>
                    {lab_code}
                  </span>
                )}
              </div>
              <p className={`${compact ? "text-[10px]" : "text-[12px]"} font-bold text-primary-light leading-tight`}>
                {displayName}
              </p>
            </div>
          </div>
          
          <div className={`flex flex-wrap items-center gap-2 text-primary-light ${compact ? "text-[9px]" : "text-[11px] font-bold"}`}>
            <span className={`flex items-center gap-1.5 bg-bg-secondary px-2 py-1 rounded-lg text-primary border border-border/50`}>
              <Calendar className={`${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} />
              {formatDate(reserved_date)}
            </span>
            <span className={`flex items-center gap-1.5 bg-bg-secondary px-2 py-1 rounded-lg text-primary border border-border/50`}>
              <Clock className={`${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} />
              {formatTime(displayTime)}
            </span>
            {created_at && !compact && (
              <span className="flex items-center gap-1.5 bg-bg-secondary/60 px-2.5 py-1.5 rounded-lg text-primary-light border border-border/60 text-[10px] font-extrabold tracking-wide">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(created_at)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end justify-center self-stretch min-w-[70px]">
          <span className={`px-2 py-0.5 rounded-lg ${compact ? "text-[8px]" : "text-[10px]"} font-extrabold border ${style.badge}`}>
            {style.label}
          </span>
        </div>
      </button>

      {/* Expanded Details View */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 ml-1 border-t border-dashed border-border/50 animate-fade-in-up bg-bg-secondary/30">
          {children}
          
          {!children && (
             <div className="space-y-5 mt-2">
                <div className="p-4 rounded-lg bg-bg-secondary/40 border border-border flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-bold text-primary-light">
                      Purpose
                    </span>
                    <p className="text-sm font-bold text-primary italic">
                      "{purpose}"
                    </p>
                  </div>
                  <div className="sm:text-right space-y-1">
                    <span className="text-[11px] font-bold text-primary-light block">
                      Reference ID
                    </span>
                    <span className="text-[12px] font-bold text-primary">
                      #RSV-{id?.toString().padStart(4, "0")}
                    </span>
                  </div>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
