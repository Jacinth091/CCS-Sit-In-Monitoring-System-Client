import React from 'react';
import { History, Clock, MapPin, CalendarDays } from 'lucide-react';

export default function UsageStats({ stats }) {
  const cards = [
    { 
      label: 'Total Sessions', 
      value: stats.totalSessions, 
      icon: History, 
      color: 'text-primary-hover', 
      bg: 'bg-primary-hover/10',
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
      color: 'text-primary', 
      bg: 'bg-primary/10',
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
          <div key={idx} className="bg-bg-primary rounded-none border border-border p-5 transition-all duration-150">
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-3 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-xl font-extrabold text-primary leading-tight uppercase tracking-wider">{card.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-light mt-1">{card.label}</p>
              <p className="text-[9px] font-medium text-primary-light/60 mt-1 uppercase tracking-wider">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
