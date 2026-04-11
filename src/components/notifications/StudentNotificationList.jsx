import React from 'react';
import { Bell, Clock, MessageSquare, Megaphone, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export default function StudentNotificationList({ notifications, onClearAll, onRead }) {
  const typeStyles = {
    feedback: { icon: <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />, bg: 'bg-emerald-50' },
    session: { icon: <Clock className="h-3.5 w-3.5 text-purple-600" />, bg: 'bg-purple-50' },
    announcement: { icon: <Megaphone className="h-3.5 w-3.5 text-[#3A6D8C]" />, bg: 'bg-[#3A6D8C]/10' },
    system: { icon: <Bell className="h-3.5 w-3.5 text-[#6A9AB0]" />, bg: 'bg-[#6A9AB0]/10' }
  };

  return (
    <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#6A9AB0]/20 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#6A9AB0]/10 bg-[#EAD8B1]/10 flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#001F3F] flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#3A6D8C]" /> Notifications
        </h3>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3 w-3" /> Clear All
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3A6D8C]/10 bg-white">
        {notifications.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EAD8B1]/20 flex items-center justify-center mx-auto mb-3">
               <Bell className="h-6 w-6 text-[#6A9AB0]/40" />
            </div>
            <p className="text-sm font-bold text-[#6A9AB0]">All caught up!</p>
            <p className="text-xs text-[#6A9AB0]/60 mt-1">No new alerts for you right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#6A9AB0]/5">
            {notifications.map((n) => {
              const style = typeStyles[n.type] || typeStyles.system;
              return (
                <div 
                  key={n.id} 
                  className={`p-4 flex gap-3 hover:bg-[#EAD8B1]/5 transition-colors cursor-pointer relative group ${n.isUnread ? 'bg-[#3A6D8C]/5' : ''}`}
                  onClick={() => onRead(n)}
                >
                  <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${style.bg}`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#001F3F] leading-snug font-medium mb-1 pr-4">
                       {n.message}
                    </p>
                    <p className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-wider">{n.time}</p>
                  </div>
                  {n.isUnread && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#3A6D8C] shadow-sm" />
                  )}
                  <div className="absolute right-2 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ChevronRight className="h-4 w-4 text-[#3A6D8C]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-[#6A9AB0]/10 bg-gray-50 text-center">
           <Link to="/student/dashboard" className="text-[10px] font-bold text-[#3A6D8C] hover:text-[#001F3F] uppercase tracking-widest transition-colors">
              View Activity Dashboard
           </Link>
        </div>
      )}
    </div>
  );
}
