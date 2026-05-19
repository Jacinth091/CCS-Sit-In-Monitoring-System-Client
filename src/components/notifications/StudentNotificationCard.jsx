import React from 'react';
import { Bell, MessageSquare, Megaphone, Clock, Info, CheckCircle2, Calendar } from 'lucide-react';

const icons = {
  feedback: <MessageSquare className="h-4 w-4" />,
  announcement: <Megaphone className="h-4 w-4" />,
  session: <Clock className="h-4 w-4" />,
  reservation: <Calendar className="h-4 w-4" />,
  system: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />
};

export default function StudentNotificationCard({ notification, onClick, typeConfig }) {
  const { type, message, time, isUnread } = notification;
  const cfg = typeConfig[type] || typeConfig.system;
  
  // Use lucide icons instead of emojis for more consistency
  const Icon = icons[type] || icons.system;

  return (
    <div 
      onClick={onClick}
      className={`group relative p-4 sm:p-4.5 flex gap-3.5 sm:gap-4.5 transition-all cursor-pointer border-l-4 ${
        isUnread 
          ? 'bg-primary-hover/5 border-primary-hover' 
          : 'bg-white border-transparent hover:bg-bg-secondary'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm border border-border/50 transition-transform group-hover:scale-105 ${cfg.bg} ${cfg.text}`}>
        {Icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
           <span className={`text-[9px] font-bold capitalize ${cfg.text}`}>
             {type} Alert
           </span>
           <span className="text-[9px] font-semibold text-primary-light whitespace-nowrap">
             {time}
           </span>
        </div>
        
        <p className={`text-xs leading-relaxed ${
          isUnread ? 'text-primary font-bold' : 'text-primary/70 font-medium'
        }`}>
          {message}
        </p>
      </div>

      {isUnread && (
        <div className="flex-shrink-0 self-center">
          <div className="w-2 h-2 rounded-full bg-primary-hover shadow-[0_0_10px_rgba(58,109,140,0.4)] animate-pulse" />
        </div>
      )}
    </div>
  );
}
