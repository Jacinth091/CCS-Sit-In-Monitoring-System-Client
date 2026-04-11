import React from 'react';
import { Clock, MessageSquare, Bell, Megaphone } from 'lucide-react';

export default function NotificationCard({ notification }) {
  const { type, actor, message, relativeTimestamp, isUnread } = notification;

  const typeStyles = {
    sit_in: { icon: <Clock className="h-4 w-4 text-purple-600" />, bg: 'bg-purple-100' },
    feedback: { icon: <MessageSquare className="h-4 w-4 text-emerald-600" />, bg: 'bg-emerald-100' },
    system: { icon: <Bell className="h-4 w-4 text-[#6A9AB0]" />, bg: 'bg-[#6A9AB0]/20' },
    announcement: { icon: <Megaphone className="h-4 w-4 text-[#3A6D8C]" />, bg: 'bg-[#3A6D8C]/20' }
  };

  const style = typeStyles[type] || typeStyles.system;

  return (
    <div className={`flex gap-3 p-3 rounded-xl transition-colors duration-150 cursor-pointer ${
      isUnread ? 'bg-[#3A6D8C]/5' : 'bg-white hover:bg-[#EAD8B1]/10'
    }`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${style.bg}`}>
        {style.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#001F3F] leading-snug">
          <span className="font-bold">{actor}</span> {message}
        </p>
        <p className="text-[10px] font-medium text-[#6A9AB0] mt-1">{relativeTimestamp}</p>
      </div>
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-[#3A6D8C] flex-shrink-0 mt-1.5" />
      )}
    </div>
  );
}
