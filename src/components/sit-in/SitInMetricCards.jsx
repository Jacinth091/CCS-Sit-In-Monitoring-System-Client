import React from 'react';
import { Users, Clock, MonitorPlay, TimerReset, History } from 'lucide-react';

export default function SitInMetricCards({ stats }) {
  const cards = [
    { label: 'Total Records', value: stats.totalRecords, icon: Users, color: 'text-primary-hover', bg: 'bg-primary-hover/10' },
    { label: 'Active Right Now', value: stats.activeNow, icon: MonitorPlay, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Average Duration', value: stats.avgDuration, icon: Clock, color: 'text-primary-hover', bg: 'bg-brand-sand/30' },
    { label: 'Most Used Lab', value: stats.mostUsedLab, icon: History, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Sit-In Time', value: stats.totalDuration, icon: TimerReset, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-bg-primary rounded-none border border-border p-4 flex flex-col justify-center transition-all duration-150">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-primary/50 uppercase tracking-wider">{card.label}</p>
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-primary">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
