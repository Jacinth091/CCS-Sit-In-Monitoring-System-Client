import React from 'react';
import { Bell, Clock, MessageSquare, Megaphone, Trash2, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router';

export default function StudentNotificationList({ notifications, onClearAll, onRead }) {
  const typeStyles = {
    feedback: { icon: <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />, bg: 'bg-emerald-50/50' },
    session: { icon: <Clock className="h-3.5 w-3.5 text-primary-hover" />, bg: 'bg-primary/5' },
    reservation: { icon: <Calendar className="h-3.5 w-3.5 text-sky-600" />, bg: 'bg-sky-50/50' },
    announcement: { icon: <Megaphone className="h-3.5 w-3.5 text-amber-600" />, bg: 'bg-amber-50/50' },
    system: { icon: <Bell className="h-3.5 w-3.5 text-primary-light" />, bg: 'bg-bg-secondary' }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-primary flex items-center gap-2">
          Notifications
        </h3>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-[9px] font-bold text-primary-light hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-white">
        {notifications.length === 0 ? (
          <div className="py-10 px-6 text-center">
            <Bell className="h-6 w-6 text-primary-light/20 mx-auto mb-2" />
            <p className="text-[10px] font-bold text-primary-light">Inbox Empty</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {notifications.map((n) => {
              const style = typeStyles[n.type] || typeStyles.system;
              return (
                <div 
                  key={n.id} 
                  className={`p-4 flex gap-3.5 hover:bg-bg-secondary/50 transition-colors cursor-pointer relative group ${n.isUnread ? 'bg-primary/[0.02]' : ''}`}
                  onClick={() => onRead(n)}
                >
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border border-border/20 ${style.bg}`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-snug mb-1 pr-4 ${n.isUnread ? 'text-primary font-bold' : 'text-primary/60 font-medium'}`}>
                       {n.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-primary-light/40">{n.time}</span>
                      {n.isUnread && <span className="w-1 h-1 rounded-full bg-primary-hover" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
