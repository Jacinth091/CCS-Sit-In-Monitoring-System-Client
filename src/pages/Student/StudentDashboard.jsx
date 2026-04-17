import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, GraduationCap, Mail, MapPin, Hash,
  Megaphone, ShieldCheck, ChevronRight, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import announcementService from '../../services/announcement.service';
import sitinService from '../../services/sitin.service';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router';

const RULES = [
  'Maintain silence, decorum, and order inside the laboratory. Turn off or keep on silent mode all mobile phones and personal electronic devices.',
  'Games are strictly NOT allowed inside the laboratory. This includes computer games, mobile games, and any other form of gaming.',
  "Surfing the internet and downloading software, applications, or any files without the instructor's permission is strictly prohibited.",
  'Food and drinks are NOT allowed inside the laboratory at any time.',
  'Students must log in and out of the sit-in monitoring system when entering and leaving the lab.',
  'Report any hardware or software issues to the lab technician or instructor immediately.',
  'Students are responsible for any damage to lab equipment caused by negligence or misuse.',
  'Follow the scheduled lab hours. Unauthorized access outside of scheduled hours is not permitted.',
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalHours: '0h 0m' });

  // Fetch announcements & stats
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [annRes, statsRes] = await Promise.all([
          announcementService.getAll(1),
          sitinService.getStats(user?.student_id)
        ]);

        // Handle announcements
        const rawData = annRes?.data || (Array.isArray(annRes) ? annRes : []);
        const transformed = Array.isArray(rawData) ? rawData.map(a => ({
          id: a.id,
          title: a.title || 'Administrative Update',
          body: a.content || a.body || '',
          date: new Date(a.created_at || a.date).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          author: a.admin_username || a.author || 'CCS Admin'
        })) : [];
        setAnnouncements(transformed);

        // Handle stats
        if (statsRes.status === 'success') {
          const s = statsRes.data;
          setStats({
            totalHours: s.total_duration || '0h 0m'
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.student_id) {
      fetchData();
    }
  }, [user]);

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : 'Student';



  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ───── PREMIUM HERO BANNER (DIGITAL ID CARD) ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary border border-border shadow-md">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-hover opacity-90" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-sand/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary-light/20 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            {/* Left: Avatar & Name */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-primary-hover to-brand-sand p-1 shadow-sm shrink-0">
                <div className="w-full h-full rounded-full bg-primary flex items-center justify-center border-2 border-primary overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary-hover/20" />
                  {user?.profile_pic ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <User className="h-10 w-10 text-brand-sand relative z-10" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-block px-3 py-1 rounded-md bg-bg-primary/10 backdrop-blur-md border border-bg-primary/10 text-[10px] font-bold tracking-wider uppercase text-brand-sand">
                  Student Portal
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {fullName}
                </h1>
                <p className="text-sm sm:text-base font-medium text-primary-light">
                  {user?.course || 'Bachelor of Science in Information Technology'} <span className="mx-2 opacity-50">•</span> {user?.course_level || '1st'} Year
                </p>
              </div>
            </div>

            {/* Right: ID Info Glass Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 lg:pl-8 lg:border-l lg:border-white/10 w-full lg:w-auto">
              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition duration-150">
                <div className="w-9 h-9 rounded-md bg-brand-sand/10 flex items-center justify-center shrink-0">
                  <Hash className="h-4 w-4 text-brand-sand" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-primary-light font-semibold mb-0.5">Student ID</p>
                  <p className="text-sm font-bold text-white truncate">{user?.student_id || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition duration-150">
                <div className="w-9 h-9 rounded-md bg-brand-sand/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-brand-sand" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-primary-light font-semibold mb-0.5">Email Account</p>
                  <p className="text-sm font-bold text-white truncate max-w-[150px]" title={user?.email || ''}>{user?.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition duration-150 sm:col-span-2">
                <div className="w-9 h-9 rounded-md bg-brand-sand/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-brand-sand" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-primary-light font-semibold mb-0.5">Current Address</p>
                  <p className="text-sm font-bold text-white truncate w-full">{user?.address || '—'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ───── TAB SWITCHER + CONTENT ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Tabbed panel (announcements / rules) */}
        <div className="lg:col-span-3">
          <div className="bg-bg-primary rounded-lg border border-border shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {[
                { id: 'announcements', label: 'Announcements', icon: Megaphone },
                { id: 'rules', label: 'Rules & Regulations', icon: ShieldCheck },
              ].map(({ id, label, icon: TabIcon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all duration-150 border-b-2 cursor-pointer ${activeTab === id
                      ? 'border-primary-hover text-primary bg-bg-secondary'
                      : 'border-transparent text-primary-light hover:text-primary hover:bg-bg-secondary'
                    }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5">
              {activeTab === 'announcements' && (
                <div className="space-y-4 pr-1">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-hover" />
                    </div>
                  ) : announcements.length === 0 ? (
                    <p className="text-sm text-primary-light/60 italic py-8 text-center">
                      No announcements yet.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {announcements.slice(0, 3).map((a) => (
                          <div
                            key={a.id}
                            className="group/card relative border border-border rounded-lg px-5 py-4 hover:border-primary-hover/25 hover:shadow-sm transition-all duration-150"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gradient-to-b from-primary-hover to-primary-light" />
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-primary">{a.author || 'CCS Admin'}</span>
                              <span className="w-1 h-1 rounded-full bg-primary-light/40" />
                              <span className="text-[11px] text-primary-light">{a.date}</span>
                            </div>
                            <h4 className="text-sm font-bold text-primary mb-1">{a.title || 'Announcement'}</h4>
                            <p className="text-sm text-primary/75 leading-relaxed line-clamp-2 whitespace-pre-wrap">{a.body}</p>
                          </div>
                        ))}
                      </div>
                      
                      {announcements.length > 3 && (
                        <div className="mt-6 pt-4 border-t border-border">
                          <Link
                            to="/student/announcements" 
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-primary-hover/30 text-primary-hover text-xs font-bold uppercase tracking-wider hover:bg-primary-hover hover:text-white transition-all duration-150 group"
                          >
                            View All Announcements
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-0 max-h-[400px] overflow-y-auto pr-1">
                  <p className="text-[11px] font-medium text-primary-light mb-4">
                    University of Cebu — College of Information &amp; Computer Studies
                  </p>
                  {RULES.map((rule, i) => (
                    <div
                      key={i}
                      className="flex gap-3.5 py-3 border-b border-border last:border-0"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-primary-hover/10 to-primary-light/10 text-[11px] font-bold text-primary-hover mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-primary/75 leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick-access sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hours Logged Counter */}
          <div className="bg-white rounded-lg p-5 shadow-sm text-primary border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Clock className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-primary-light">
                Total Hours in Lab
              </p>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold leading-none text-primary">
                {stats.totalHours}
              </span>
              <span className="text-xs font-bold text-primary-light mb-1 uppercase tracking-widest">Logged</span>
            </div>
          </div>

          {/* Session counter */}
          <div className="bg-gradient-to-br from-primary-hover to-primary rounded-lg p-5 shadow-sm text-white border border-border">
            <p className="text-[10px] font-bold tracking-wider uppercase text-brand-sand/60 mb-1">
              Remaining Sessions
            </p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold leading-none">
                {user?.session || '26'}
              </span>
              <span className="text-sm text-brand-sand/70 mb-1">/ 30</span>
            </div>
            <div className="mt-3 w-full h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-sand transition-all duration-150"
                style={{ width: `${((user?.session || 26) / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-bg-primary rounded-lg border border-border shadow-sm divide-y divide-border">
            {[
              { label: 'View Sit-in History', to: '/student/history' },
              { label: 'Edit Profile', to: '/student/edit-profile' },
              { label: 'Make a Reservation', to: '/student/reservation' },
            ].map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-primary hover:bg-bg-secondary transition-colors duration-150 group"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-primary-light group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>

          {/* Mini profile card */}
          <div className="bg-bg-primary rounded-lg border border-border shadow-sm p-5">
            <h4 className="text-[10px] font-bold tracking-wider uppercase text-primary-light mb-3">
              Your Profile
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-hover/10 flex items-center justify-center overflow-hidden shrink-0">
                {user?.profile_pic ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-primary-hover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary truncate">{fullName}</p>
                <p className="text-[11px] text-primary-light truncate">{user?.email || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}