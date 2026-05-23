import React, { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCheck, Trash2, Inbox, ArrowLeft, MoreVertical, Filter } from 'lucide-react';
import { Link } from 'react-router';
import notificationService from '../../services/notification.service';
import StudentNotificationCard from '../../components/notifications/StudentNotificationCard';
import { toast } from 'sonner';

import { useNotifications } from '../../hooks/useNotifications';
import { useConfirm } from '../../hooks/useConfirm.jsx';

export default function Notifications() {
  const { notifications, isLoading, unreadCount, markAsRead, markAllRead, refresh } = useNotifications(20000);
  const [filter, setFilter] = useState('all');
  const { confirm, ConfirmModalUI } = useConfirm();

  const typeConfig = {
    feedback: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    announcement: { bg: 'bg-blue-50', text: 'text-blue-600' },
    session: { bg: 'bg-amber-50', text: 'text-amber-600' },
    reservation: { bg: 'bg-sky-50', text: 'text-sky-600' },
    system: { bg: 'bg-slate-100', text: 'text-slate-600' },
    success: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    software: { bg: 'bg-purple-50', text: 'text-purple-600' },
    testimonial: { bg: 'bg-rose-50', text: 'text-rose-600' }
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    await markAllRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    const ok = await confirm({
      title: 'Clear All Notifications?',
      message: 'Your entire notification history will be permanently deleted.',
      variant: 'danger',
      confirmText: 'Yes, Clear All',
    });
    if (!ok) return;
    try {
      await notificationService.deleteAll();
      refresh();
      toast.success('Notification history cleared');
    } catch (err) {
      toast.error('Failed to clear notifications');
    }
  };

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && n.isUnread));

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-20">

        {/* ───── HERO SECTION ───── */}
        <div className="relative overflow-hidden rounded-xl bg-primary hero-banner border border-border shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-sand/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

          <div className="relative z-10 p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-2">
                <Link 
                  to="/student/dashboard" 
                  className="inline-flex items-center gap-2 text-[9px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Dashboard
                </Link>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                   Your Alerts
                   {unreadCount > 0 && (
                     <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-brand-sand text-primary text-[9px] font-bold animate-pulse">
                       {unreadCount} New
                     </span>
                   )}
                </h1>
                <p className="text-primary-light/80 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
                  Stay updated with laboratory announcements, session status, and administrative feedback.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="w-11 h-11 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                   <Bell className="h-5 w-5 text-brand-sand" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───── ACTIONS BAR ───── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
          <div className="flex items-center bg-white border border-border rounded-lg p-1 w-full sm:w-auto shadow-sm">
             {[
               { id: 'all', label: 'All Alerts', icon: Inbox },
               { id: 'unread', label: 'Unread', icon: Bell }
             ].map(t => (
               <button
                 key={t.id}
                 onClick={() => setFilter(t.id)}
                 className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold transition-all cursor-pointer grow sm:grow-0 ${
                   filter === t.id 
                     ? 'bg-primary-hover text-white shadow-md' 
                     : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
                 }`}
               >
                 <t.icon className="h-3 w-3" />
                 {t.label}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-primary-hover/20 bg-white text-primary-hover text-[10px] font-bold hover:bg-primary-hover hover:text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm group"
            >
              <CheckCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" /> Mark All Read
            </button>

            <button 
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="flex items-center justify-center p-2.5 rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-50 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm group"
              title="Clear All Notifications"
            >
              <Trash2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* ───── NOTIFICATIONS LIST ───── */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-5">
                 <div className="relative">
                   <div className="w-12 h-12 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
                   <Bell className="h-5 w-5 text-primary-hover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                 </div>
                 <div className="text-center space-y-1">
                   <p className="text-xs font-bold text-primary">Synchronizing</p>
                   <p className="text-[10px] text-primary-light font-medium">Checking your inbox...</p>
                 </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-10 animate-fade-in">
                 <div className="w-20 h-20 rounded-2xl bg-bg-secondary flex items-center justify-center mb-6 border border-border">
                    <Inbox className="h-8 w-8 text-primary-light/40" />
                 </div>
                 <h3 className="text-xl font-bold text-primary tracking-tight">Your Inbox Is Empty</h3>
                 <p className="text-primary-light font-medium text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                   {filter === 'unread' 
                     ? "Great! You've read all your notifications. Change the filter to see your history." 
                     : "You don't have any notifications at the moment. We'll alert you when something important comes up."}
                 </p>
                 <button 
                   onClick={() => setFilter('all')}
                   className={`mt-6 px-5 py-2 rounded-full border border-primary-hover/30 text-primary-hover text-[10px] font-bold hover:bg-primary-hover hover:text-white transition-all ${filter === 'all' ? 'hidden' : 'block'}`}
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
        <div className="flex items-center justify-center gap-2.5 text-primary-light/60">
          <div className="h-px w-10 bg-border" />
          <span className="text-[9px] font-bold">End Of Inbox</span>
          <div className="h-px w-10 bg-border" />
        </div>

      </div>
      {ConfirmModalUI}
    </>
  );}
