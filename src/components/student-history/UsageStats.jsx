import React from 'react';
import { History, Clock, MapPin, CalendarDays } from 'lucide-react';

export default function UsageStats({ stats }) {
  const cards = [
    { 
      label: 'Total Sessions', 
      value: stats.totalSessions, 
      icon: History, 
      color: 'text-primary-hover', 
      bg: 'bg-primary-hover/5',
      description: "Sessions tracked"
    },
    { 
      label: 'Hours in Lab', 
      value: stats.totalHours, 
      icon: Clock, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/5',
      description: "Total time logged"
    },
    { 
      label: 'Your Go-to Lab', 
      value: stats.mostVisitedLab || 'Lab 2', 
      icon: MapPin, 
      color: 'text-primary', 
      bg: 'bg-primary/5',
      description: "Most frequent"
    },
    { 
      label: 'Last Visited', 
      value: stats.lastSessionDate || '—', 
      icon: CalendarDays, 
      color: 'text-amber-600', 
      bg: 'bg-amber-600/5',
      description: "Most recent"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-xl border border-border p-4.5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-xl font-black text-primary leading-tight tracking-tight">{card.value}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light mt-1.5">{card.label}</p>
              <p className="text-[8px] font-bold text-primary-light/40 mt-1 uppercase tracking-widest">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
