import React from 'react';
import { Users, Clock, MonitorPlay, TimerReset, History } from 'lucide-react';

export default function SitInMetricCards({ stats }) {
  const cards = [
    { label: 'Total Records', value: stats.totalRecords, icon: Users, color: 'text-[#3A6D8C]', bg: 'bg-[#3A6D8C]/10' },
    { label: 'Active Right Now', value: stats.activeNow, icon: MonitorPlay, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Average Duration', value: stats.avgDuration, icon: Clock, color: 'text-[#3A6D8C]', bg: 'bg-[#EAD8B1]/30' },
    { label: 'Most Used Lab', value: stats.mostUsedLab, icon: History, color: 'text-[#001F3F]', bg: 'bg-[#001F3F]/10' },
    { label: 'Total Sit-In Time', value: stats.totalDuration, icon: TimerReset, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-[#001F3F]/50 uppercase tracking-wide">{card.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-[#001F3F]">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
