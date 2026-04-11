import React, { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCheck, Trash2, Inbox, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import notificationService from '../../services/notification.service';
import StudentNotificationCard from '../../components/notifications/StudentNotificationCard';
import { toast } from 'sonner';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  const typeConfig = {
    feedback: { icon: '💬', bg: 'bg-purple-50', text: 'text-purple-600' },
    announcement: { icon: '📢', bg: 'bg-blue-50', text: 'text-blue-600' },
    session: { icon: '🕐', bg: 'bg-amber-50', text: 'text-amber-600' },
    system: { icon: '🔔', bg: 'bg-gray-100', text: 'text-gray-600' }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
      toast.success('All marked as read');
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      setNotifications([]);
      toast.success('Inbox cleared');
    } catch (err) {
      toast.error('Failed to clear notifications');
    }
  };

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && n.isUnread));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Link 
            to="/student/dashboard" 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6A9AB0] hover:text-[#001F3F] transition-colors mb-2 uppercase tracking-widest"
          >
            <ArrowLeft className="h-3 w-3" /> Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-[#001F3F] tracking-tight flex items-center gap-3">
             Notifications
             {notifications.filter(n => n.isUnread).length > 0 && (
               <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                 {notifications.filter(n => n.isUnread).length}
               </span>
             )}
          </h1>
          <p className="text-sm text-[#6A9AB0] mt-1">Manage your alerts and stay informed about your lab activities.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllRead}
            disabled={!notifications.some(n => n.isUnread)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#6A9AB0]/20 text-[#001F3F] text-xs font-bold uppercase tracking-widest hover:bg-[#EAD8B1]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
          <button 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#6A9AB0]/15 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-[#6A9AB0]/10 flex gap-4">
           {[
             { id: 'all', label: 'All Notifications' },
             { id: 'unread', label: 'Unread' }
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setFilter(t.id)}
               className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all cursor-pointer ${
                 filter === t.id ? 'text-[#3A6D8C] border-[#3A6D8C]' : 'text-[#6A9AB0] border-transparent hover:text-[#001F3F]'
               }`}
             >
               {t.label}
             </button>
           ))}
        </div>

        {/* List */}
        <div className="divide-y divide-[#6A9AB0]/5 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
               <Loader2 className="h-10 w-10 animate-spin text-[#3A6D8C]" />
               <p className="text-xs font-bold text-[#6A9AB0] uppercase tracking-widest">Fetching your alerts...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-10">
               <div className="w-20 h-20 rounded-full bg-[#EAD8B1]/10 flex items-center justify-center mb-6">
                  <Inbox className="h-10 w-10 text-[#6A9AB0]/30" />
               </div>
               <h3 className="text-xl font-extrabold text-[#001F3F]">You're all caught up!</h3>
               <p className="text-sm text-[#6A9AB0] mt-2 max-w-xs mx-auto">
                 When you receive feedback or important updates, they'll appear here.
               </p>
            </div>
          ) : (
            filtered.map((n) => (
              <StudentNotificationCard 
                key={n.id} 
                notification={n} 
                onClick={() => handleMarkRead(n.id)} 
                typeConfig={typeConfig} 
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}
