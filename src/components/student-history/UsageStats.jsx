import React from 'react';
import { History, Clock, MapPin, CalendarDays } from 'lucide-react';

export default function UsageStats({ stats }) {
  const cards = [
    { 
      label: 'Total Sessions', 
      value: stats.totalSessions, 
      icon: History, 
      color: 'text-[#3A6D8C]', 
      bg: 'bg-[#3A6D8C]/10',
      description: "You've had " + stats.totalSessions + " sessions"
    },
    { 
      label: 'Hours in Lab', 
      value: stats.totalHours, 
      icon: Clock, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50',
      description: stats.totalHours + " logged"
    },
    { 
      label: 'Your Go-to Lab', 
      value: stats.mostVisitedLab || 'Lab 2', 
      icon: MapPin, 
      color: 'text-[#001F3F]', 
      bg: 'bg-[#001F3F]/10',
      description: "Most visited"
    },
    { 
      label: 'Last Visited', 
      value: stats.lastSessionDate || 'Apr 8', 
      icon: CalendarDays, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      description: "Most recent"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-2xl border border-[#6A9AB0]/15 shadow-sm p-5 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-xl font-extrabold text-[#001F3F] leading-tight">{card.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6A9AB0] mt-1">{card.label}</p>
              <p className="text-[9px] font-medium text-[#6A9AB0]/60 mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
