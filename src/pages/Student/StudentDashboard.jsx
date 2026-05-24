import React, { useState, useEffect } from 'react';
import { ASSET_URL } from '../../config';
import {
  User, BookOpen, GraduationCap, Mail, MapPin, Hash,
  Megaphone, ShieldCheck, ChevronRight, Clock, Calendar, ArrowRight, AlertCircle, History, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import announcementService from '../../services/announcement.service';
import sitinService from '../../services/sitin.service';
import studentService from '../../services/student.service';
import labService from '../../services/lab.service';
import AIInsightsCard from '../../components/AIInsightsCard';
import RichTextRenderer from '../../components/ui/RichTextRenderer';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { COURSES } from '../../constants/app.constants';
import { formatDate, formatTime } from '../../utils/dateUtils';

export default function StudentDashboard() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [labRules, setLabRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalHours: '0h 0m',
    totalSessions: 0,
    mostVisitedLab: '—',
    lastSession: '—'
  });

  const defaultRules = [
    'Maintain silence, decorum, and order inside the laboratory. Turn off or keep on silent mode all mobile phones and personal electronic devices.',
    'Games are strictly NOT allowed inside the laboratory. This includes computer games, mobile games, and any other form of gaming.',
    "Surfing the internet and downloading software, applications, or any files without the instructor's permission is strictly prohibited.",
    'Food and drinks are NOT allowed inside the laboratory at any time.',
    'Students must log in and out of the sit-in monitoring system when entering and leaving the lab.',
    'Report any hardware or software issues to the lab technician or instructor immediately.',
    'Students are responsible for any damage to lab equipment caused by negligence or misuse.',
    'Follow the scheduled lab hours. Unauthorized access outside of scheduled hours is not permitted.',
  ];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [annRes, statsRes, profileRes, rulesRes] = await Promise.all([
          announcementService.getAll(1),
          sitinService.getDashboardStats(),
          studentService.getProfile(),
          labService.getRules()
        ]);

        // Sync fresh profile to context
        if (profileRes) {
          login({ ...user, ...profileRes, role: 'student' });
        }

        // Handle announcements
        const rawData = annRes?.data || (Array.isArray(annRes) ? annRes : []);
        const transformed = Array.isArray(rawData) ? rawData.map(a => ({
          id: a.id,
          title: a.title || 'Administrative Update',
          body: a.content || a.body || '',
          isImportant: a.is_important,
          date: `${formatDate(a.created_at || a.date)} • ${formatTime(a.created_at || a.date)}`,
          author: a.admin_username || a.author || 'CCS Admin'
        })) : [];
        setAnnouncements(transformed);

        // Handle stats
        const isStatsSuccess = statsRes.status === 'success' || statsRes.success === true;
        if (isStatsSuccess) {
          const s = statsRes.data || statsRes;
          setStats({
            totalHours: s.total_duration || '0h 0m',
            totalSessions: s.total_sessions ?? s.count ?? 0,
            mostVisitedLab: s.most_visited_lab || '—',
            lastSession: formatDate(s.last_session_date)
          });
        }

        // Handle rules
        if (rulesRes.status === 'success' && rulesRes.data?.length > 0) {
          setLabRules(rulesRes.data.map(r => r.description));
        } else {
          setLabRules(defaultRules);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setLabRules(defaultRules);
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.student_id) {
      fetchData();
    }
  }, [user?.student_id]);

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : 'Student';

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-20">

      {/* ───── PREMIUM HERO BANNER (DIGITAL ID CARD) ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary hero-banner border border-border shadow-md">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-sand/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            {/* Left: Avatar & Name */}
            <div className="flex items-center gap-5 sm:gap-7">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-[0.9rem] bg-primary flex items-center justify-center border border-primary overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary-hover/20" />
                  {user?.profile_pic ? (
                    <img 
                      src={`${ASSET_URL}/${user.profile_pic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <User className="h-7 w-7 text-brand-sand relative z-10" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
                  {fullName}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-primary-light/80">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                    <GraduationCap className="h-4 w-4 text-brand-sand" /> 
                    {user?.course || COURSES[0]}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                    <BookOpen className="h-3.5 w-3.5 text-brand-sand" /> 
                    {user?.course_level || '1st'} Year
                  </div>
                </div>
              </div>
            </div>

            {/* Right: ID Info Glass Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:pl-8 lg:border-l lg:border-white/10 w-full lg:w-auto">
              {[
                { label: 'Student ID', value: user?.student_id || '—', icon: Hash },
                { label: 'Email Account', value: user?.email || '—', icon: Mail, truncate: true },
                { label: 'Current Address', value: user?.address || '—', icon: MapPin, full: true }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 group ${item.full ? 'sm:col-span-2' : ''}`}
                >
                    <div className="w-8 h-8 rounded-lg bg-brand-sand/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="h-3.5 w-3.5 text-brand-sand" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-primary-light font-bold mb-0.5">{item.label}</p>
                    <p className={`text-xs font-bold text-white ${item.truncate ? 'truncate max-w-[160px]' : ''}`} title={item.value}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ───── TAB SWITCHER + CONTENT ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Tabbed panel (announcements / rules) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[450px]">
            {/* Tabs */}
            <div className="flex border-b border-border bg-bg-secondary/30">
              {[
                { id: 'announcements', label: 'Announcements', icon: Megaphone },
                { id: 'rules', label: 'Rules & Regulations', icon: ShieldCheck },
              ].map(({ id, label, icon: TabIcon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-6 py-3.5 text-[10px] font-bold transition-all duration-300 border-b-2 cursor-pointer ${activeTab === id
                      ? 'border-primary-hover text-primary bg-white shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]'
                      : 'border-transparent text-primary-light hover:text-primary hover:bg-bg-secondary'
                    }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 grow flex flex-col">
              {activeTab === 'announcements' && (
                <div className="space-y-5 grow">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 grow">
                      <div className="w-10 h-10 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
                      <p className="text-[9px] font-bold text-primary-light">Syncing feed...</p>
                    </div>
                  ) : announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center grow">
                      <Megaphone className="h-10 w-10 text-primary-light/20 mb-3" />
                      <p className="text-xs text-primary-light font-bold">
                        No announcements at the moment
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        {announcements.slice(0, 3).map((a) => (
                          <div
                            key={a.id}
                            onClick={() => navigate(`/student/announcements/${a.id}`)}
                            className="group/card relative border border-border rounded-xl p-4.5 hover:border-primary-hover/30 hover:shadow-md transition-all duration-300 bg-white cursor-pointer"
                          >
                            <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-primary-hover scale-y-0 group-hover/card:scale-y-100 transition-transform duration-300" />
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-primary-hover bg-primary-hover/5 px-2 py-0.5 rounded-md">{a.author || 'CCS Admin'}</span>
                                {a.isImportant && (
                                  <span className="flex items-center gap-1 bg-red-50 text-red-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-red-100 animate-pulse">
                                    <AlertCircle className="h-2 w-2" />
                                    Important
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary-light">
                                <Clock className="h-3 w-3" /> {a.date}
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-primary mb-1.5 tracking-tight group-hover:card:text-primary-hover transition-colors">{a.title || 'Announcement'}</h4>
                            <div className="text-xs text-primary-light font-medium leading-relaxed line-clamp-2">
                               <RichTextRenderer text={a.body} />
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-[9px] font-bold text-primary-hover opacity-0 group-hover/card:opacity-100 transition-opacity">
                               Read Full Story <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {announcements.length > 3 && (
                        <div className="mt-auto pt-6">
                          <Link
                            to="/student/announcements" 
                            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border-2 border-primary-hover/10 text-primary-hover text-[10px] font-bold transition-all duration-300 group shadow-sm active:scale-[0.98]"
                          >
                            Explore University Feed
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar grow">
                  <div className="flex items-center gap-2.5 mb-5 p-3.5 rounded-xl bg-primary/5 border border-primary/10">
                    <ShieldCheck className="h-4 w-4 text-primary-hover" />
                    <div>
                      <p className="text-[10px] font-bold text-primary">Laboratory Policy</p>
                      <p className="text-[9px] font-bold text-primary-light">University of Cebu - CCS Lab Management</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {labRules.map((rule, i) => (
                      <div
                        key={i}
                        className="flex gap-3.5 p-3.5 rounded-xl border border-border/60 hover:border-primary-hover/20 hover:bg-bg-secondary/30 transition-all duration-200"
                      >
                        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-white text-[10px] font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-[13px] text-primary/80 font-medium leading-relaxed">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick-access sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Hours Logged Counter */}
            <div className="bg-white rounded-xl p-5 shadow-sm text-primary border border-border relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Clock className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-primary-light">
                    Total Lab Time
                  </p>
                </div>
                <div className="flex items-end gap-2.5">
                  <span className="text-3xl font-bold leading-none text-primary tracking-tighter">
                    {stats.totalHours}
                  </span>
                  <span className="text-[9px] font-bold text-primary-light mb-1">Accumulated</span>
                </div>
              </div>
            </div>

            {/* Sessions Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm text-primary border border-border relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <History className="w-20 h-20" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-bold text-primary-light mb-1.5">
                      Total Sessions
                   </p>
                   <span className="text-3xl font-bold leading-none text-primary tracking-tighter">
                      {stats.totalSessions}
                   </span>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[10px] font-bold text-primary-light mb-1.5">
                      Most Visited
                   </p>
                   <span className="text-xs font-bold text-primary-hover tracking-tight">
                      {stats.mostVisitedLab}
                   </span>
                </div>
              </div>
            </div>

            {/* Session counter */}
            <div className="bg-gradient-to-br from-primary-hover to-primary rounded-xl p-5 shadow-lg shadow-primary-hover/10 text-white relative overflow-hidden group border border-primary-hover/20">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-0.5">
                   <p className="text-[10px] font-bold text-brand-sand/80">
                      Remaining Credits
                   </p>
                   <p className="text-[9px] font-bold text-brand-sand/70">Last: {stats.lastSession}</p>
                </div>
                <div className="flex items-end gap-2.5">
                  <span className="text-4xl font-bold leading-none tracking-tighter">
                    {user?.session ?? 0}
                  </span>
                  <span className="text-base font-bold text-brand-sand/70 mb-1">/ 30</span>
                </div>
                <div className="mt-4 w-full h-2 rounded-full bg-white/20 overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full bg-brand-sand shadow-[0_0_16px_rgba(211,188,143,0.55)] transition-all duration-500"
                    style={{ width: `${((user?.session ?? 0) / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden divide-y divide-border">
            {[
              { label: 'View Sit-In History', to: '/student/history', icon: History },
              { label: 'Edit Account Profile', to: '/student/edit-profile', icon: User },
              { label: 'Laboratory Reservation', to: '/student/reservations', icon: MapPin },
              { label: 'Share Appreciation', to: '/student/testimonials', icon: MessageCircle },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="flex items-center justify-between px-5 py-3.5 text-[10px] font-bold text-primary hover:bg-bg-secondary transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  <ChevronRight className="h-3.5 w-3.5 text-primary-hover group-hover:translate-x-1 transition-transform" />
                  {item.label}
                </span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>

          <AIInsightsCard />

          {/* Mini profile card */}
          <div className="bg-bg-primary rounded-xl border border-border shadow-sm p-5">
            <h4 className="text-[9px] font-bold text-primary-light mb-4 ml-1">
              Account Overview
            </h4>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-primary-hover/10 flex items-center justify-center overflow-hidden shrink-0 border border-primary-hover/10">
                {user?.profile_pic ? (
                    <img 
                      src={`${ASSET_URL}/${user.profile_pic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-primary-hover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary truncate tracking-tight">{fullName}</p>
                <p className="text-[10px] font-bold text-primary-light truncate">{user?.email || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
