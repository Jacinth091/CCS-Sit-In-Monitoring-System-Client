import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';

const statusConfig = {
  APPROVED: {
    label: 'APPROVED',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
  },
  REJECTED: {
    label: 'REJECTED',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
  },
  PENDING: {
    label: 'PENDING',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-800',
  },
  COMPLETED: {
    label: 'COMPLETED',
    bgClass: 'bg-navy',
    textClass: 'text-sand',
  },
};

const ReservationCard = ({
  labCode,
  labName,
  purpose,
  pcNumber,
  date,
  time,
  status,
}) => {
  const currentStatus = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className="flex items-center justify-between p-5 rounded-[12px] shadow-md bg-bg-primary border border-[rgba(0,31,63,0.08)] dark:border-[rgba(148,184,209,0.12)] hover:bg-bg-secondary transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center text-primary">
          <Calendar size={24} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-navy text-sand text-[11px] font-black uppercase tracking-wider max-w-[80px] truncate">
              {labCode}
            </span>
            <h3 className="text-[18px] font-bold text-primary leading-none m-0">
              {labName}
            </h3>
          </div>
          <div className="flex items-center text-[11px] font-black uppercase text-label-secondary tracking-wider">
            <span>{purpose}</span>
            <span className="mx-2 font-bold opacity-50">·</span>
            <span>{pcNumber}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end text-right gap-1">
        <div className="flex flex-col text-primary items-end">
          <span className="text-[14px] font-normal leading-tight">
            {formatDate(date)}
          </span>
          <span className="text-[14px] font-normal opacity-80 leading-tight mt-0.5">
            {formatTime(time)}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider mt-1 ${currentStatus.bgClass} ${currentStatus.textClass}`}
        >
          {currentStatus.label}
        </span>
      </div>
    </div>
  );
};

export default ReservationCard;

// Usage Example:
export const ReservationCardExample = () => (
  <div className="flex flex-col gap-4 p-8 bg-bg-secondary min-h-screen font-sans">
    <ReservationCard
      labCode="LAB 525"
      labName="Multimedia and Graphics Lab"
      purpose="Study Group Session"
      pcNumber="PC 8"
      date="2026-05-19"
      time="08:00:00"
      status="REJECTED"
    />
    <ReservationCard
      labCode="LAB 540"
      labName="Cybersecurity Lab"
      purpose="Class Assignment"
      pcNumber="PC 12"
      date="2026-05-19"
      time="19:14:00"
      status="COMPLETED"
    />
  </div>
);
