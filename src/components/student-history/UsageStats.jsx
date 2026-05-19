import React from 'react';
import { History, Clock, MapPin, CalendarDays, Timer, TrendingUp } from 'lucide-react';

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
      label: 'Avg Session', 
      value: stats.avgDuration || '—', 
      icon: Timer, 
      color: 'text-violet-500', 
      bg: 'bg-violet-500/5',
      description: "Average duration"
    },
    { 
      label: 'Longest Session', 
      value: stats.longestSession || '—', 
      icon: TrendingUp, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/5',
      description: "Peak session"
    },
    { 
      label: 'Your Go-to Lab', 
      value: stats.mostVisitedLab || '—', 
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-xl border border-border p-4.5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-xl font-black text-primary leading-tight tracking-tight">{card.value}</p>
              <p className="text-[10px] font-bold text-primary-light mt-1.5">{card.label}</p>
              <p className="text-[9px] font-medium text-primary-light/40 mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
