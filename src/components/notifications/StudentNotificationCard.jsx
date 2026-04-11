import React from 'react';

export default function StudentNotificationCard({ notification, onClick, typeConfig }) {
  const { type, message, time, isUnread } = notification;
  const cfg = typeConfig[type] || typeConfig.system;

  return (
    <div 
      onClick={onClick}
      className={`group p-6 flex gap-5 transition-all cursor-pointer relative ${isUnread ? 'bg-[#3A6D8C]/5' : 'hover:bg-gray-50'}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl shadow-sm ${cfg.bg}`}>
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
           <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>
             {type} Alert
           </span>
           <span className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-widest">
             {time}
           </span>
        </div>
        <p className={`text-sm leading-relaxed ${isUnread ? 'text-[#001F3F] font-bold' : 'text-[#001F3F]/70 font-medium'}`}>
          {message}
        </p>
      </div>
      {isUnread && (
        <div className="absolute top-1/2 -translate-y-1/2 right-6 w-2.5 h-2.5 rounded-full bg-[#3A6D8C] shadow-sm animate-pulse" />
      )}
    </div>
  );
}
