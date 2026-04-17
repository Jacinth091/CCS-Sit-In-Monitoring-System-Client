import React, { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCheck, Trash2, Inbox, ArrowLeft, MoreVertical, Filter } from 'lucide-react';
import { Link } from 'react-router';
import notificationService from '../../services/notification.service';
import StudentNotificationCard from '../../components/notifications/StudentNotificationCard';
import { toast } from 'sonner';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  const typeConfig = {
    feedback: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    announcement: { bg: 'bg-blue-50', text: 'text-blue-600' },
    session: { bg: 'bg-amber-50', text: 'text-amber-600' },
    system: { bg: 'bg-slate-100', text: 'text-slate-600' },
    success: { bg: 'bg-emerald-50', text: 'text-emerald-600' }
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
      // Optimistic update fallback or silent fail
    }
  };

  const handleMarkAllRead = async () => {
    if (!notifications.some(n => n.isUnread)) return;
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm('Are you sure you want to clear your notification history?')) return;
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      toast.success('Notification history cleared');
    } catch (err) {
      toast.error('Failed to clear notifications');
    }
  };

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && n.isUnread));
  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* ───── HERO SECTION ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary border border-border shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-sand/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <Link 
                to="/student/dashboard" 
                className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors uppercase tracking-[0.2em]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
                 Your Alerts
                 {unreadCount > 0 && (
                   <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-brand-sand text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
                     {unreadCount} New
                   </span>
                 )}
              </h1>
              <p className="text-primary-light/80 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
                Stay updated with laboratory announcements, session status, and administrative feedback.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                 <Bell className="h-8 w-8 text-brand-sand" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── ACTIONS BAR ───── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="flex items-center bg-white border border-border rounded-lg p-1 w-full sm:w-auto shadow-sm">
           {[
             { id: 'all', label: 'All Alerts', icon: Inbox },
             { id: 'unread', label: 'Unread', icon: Bell }
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setFilter(t.id)}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[11px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer grow sm:grow-0 ${
                 filter === t.id 
                   ? 'bg-primary-hover text-white shadow-md' 
                   : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
               }`}
             >
               <t.icon className="h-3.5 w-3.5" />
               {t.label}
             </button>
           ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-primary-hover/20 bg-white text-primary-hover text-[11px] font-black uppercase tracking-[0.15em] hover:bg-primary-hover hover:text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm group"
          >
            <CheckCheck className="h-4 w-4 group-hover:scale-110 transition-transform" /> Mark All Read
          </button>
          
          <button 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="flex items-center justify-center p-3 rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-50 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm group"
            title="Clear All Notifications"
          >
            <Trash2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* ───── NOTIFICATIONS LIST ───── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
               <div className="relative">
                 <div className="w-16 h-16 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
                 <Bell className="h-6 w-6 text-primary-hover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
               <div className="text-center space-y-1">
                 <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Synchronizing</p>
                 <p className="text-[11px] text-primary-light font-medium uppercase tracking-widest">Checking your inbox...</p>
               </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center px-10 animate-fade-in">
               <div className="w-24 h-24 rounded-3xl bg-bg-secondary flex items-center justify-center mb-8 border border-border">
                  <Inbox className="h-10 w-10 text-primary-light/40" />
               </div>
               <h3 className="text-2xl font-black text-primary tracking-tight">Your inbox is empty</h3>
               <p className="text-primary-light font-medium text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                 {filter === 'unread' 
                   ? "Great! You've read all your notifications. Change the filter to see your history." 
                   : "You don't have any notifications at the moment. We'll alert you when something important comes up."}
               </p>
               <button 
                 onClick={() => setFilter('all')}
                 className={`mt-8 px-6 py-2.5 rounded-full border border-primary-hover/30 text-primary-hover text-[11px] font-black uppercase tracking-widest hover:bg-primary-hover hover:text-white transition-all ${filter === 'all' ? 'hidden' : 'block'}`}
               >
                 Show All History
               </button>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filtered.map((n) => (
                <StudentNotificationCard 
                  key={n.id} 
                  notification={n} 
                  onClick={() => handleMarkRead(n.id)} 
                  typeConfig={typeConfig} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ───── FOOTER INFO ───── */}
      <div className="flex items-center justify-center gap-3 text-primary-light/60">
        <div className="h-px w-12 bg-border" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">End of Inbox</span>
        <div className="h-px w-12 bg-border" />
      </div>

    </div>
  );
}
