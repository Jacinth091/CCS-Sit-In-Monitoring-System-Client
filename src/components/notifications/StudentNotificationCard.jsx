import React from 'react';
import { Bell, MessageSquare, Megaphone, Clock, Info, CheckCircle2 } from 'lucide-react';

const icons = {
  feedback: <MessageSquare className="h-5 w-5" />,
  announcement: <Megaphone className="h-5 w-5" />,
  session: <Clock className="h-5 w-5" />,
  system: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />
};

export default function StudentNotificationCard({ notification, onClick, typeConfig }) {
  const { type, message, time, isUnread } = notification;
  const cfg = typeConfig[type] || typeConfig.system;
  
  // Use lucide icons instead of emojis for more consistency
  const Icon = icons[type] || icons.system;

  return (
    <div 
      onClick={onClick}
      className={`group relative p-5 sm:p-6 flex gap-4 sm:gap-6 transition-all cursor-pointer border-l-4 ${
        isUnread 
          ? 'bg-primary-hover/5 border-primary-hover' 
          : 'bg-white border-transparent hover:bg-bg-secondary'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm border border-border/50 transition-transform group-hover:scale-105 ${cfg.bg} ${cfg.text}`}>
        {Icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
           <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>
             {type} Alert
           </span>
           <span className="text-[10px] font-semibold text-primary-light uppercase tracking-wider whitespace-nowrap">
             {time}
           </span>
        </div>
        
        <p className={`text-sm leading-relaxed ${
          isUnread ? 'text-primary font-bold' : 'text-primary/70 font-medium'
        }`}>
          {message}
        </p>
      </div>

      {isUnread && (
        <div className="flex-shrink-0 self-center">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-hover shadow-[0_0_10px_rgba(58,109,140,0.4)] animate-pulse" />
        </div>
      )}
    </div>
  );
}
