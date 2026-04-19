import React from 'react';
import { 
  Users, Clock, MonitorPlay, TimerReset, 
  History, Activity, TrendingUp, Database, MapPin 
} from 'lucide-react';

export default function SitInMetricCards({ stats }) {
  const cards = [
    { label: 'Total Logs', value: stats.totalRecords, icon: Database, color: 'text-[#3A6D8C]', accent: '#3A6D8C' },
    { label: 'Active Now', value: stats.activeNow, icon: Activity, color: 'text-emerald-500', accent: '#10B981' },
    { label: 'Avg Duration', value: stats.avgDuration, icon: Clock, color: 'text-[#3A6D8C]', accent: '#3A6D8C' },
    { label: 'Peak Lab', value: stats.mostUsedLab, icon: MapPin, color: 'text-brand-sand', accent: '#EAD8B1' },
    { label: 'Total Time', value: stats.totalDuration, icon: TrendingUp, color: 'text-primary', accent: '#001F3F' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Icon className="w-12 h-12" style={{ color: card.accent }} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center shadow-inner mb-3"
                style={{ backgroundColor: `${card.accent}10` }}
              >
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="mt-auto space-y-0.5">
                <p className="text-[8px] font-black tracking-[0.2em] uppercase text-primary-light">
                  {card.label}
                </p>
                <p className="text-lg font-black text-primary tracking-tighter truncate">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
