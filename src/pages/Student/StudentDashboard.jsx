import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, GraduationCap, Mail, MapPin, Hash,
  Megaphone, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import announcementService from '../../services/announcement.service';
import { Loader2 } from 'lucide-react';

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

  // Fetch announcements
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const data = await announcementService.getAll();
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : 'Student';



  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ───── PREMIUM HERO BANNER (DIGITAL ID CARD) ───── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#001F3F] border border-[#6A9AB0]/20 shadow-xl">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F] via-[#0a2e54] to-[#3A6D8C] opacity-90" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#EAD8B1]/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#6A9AB0]/20 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            {/* Left: Avatar & Name */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#3A6D8C] to-[#EAD8B1] p-1 shadow-lg shrink-0">
                <div className="w-full h-full rounded-full bg-[#001F3F] flex items-center justify-center border-2 border-[#001F3F] overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#3A6D8C]/20" />
                  {user?.profile_pic ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <User className="h-10 w-10 text-[#EAD8B1] relative z-10" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase text-[#EAD8B1]">
                  Student Portal
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {fullName}
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#6A9AB0]">
                  {user?.course || 'BSIT'} <span className="mx-2 opacity-50">•</span> Year {user?.course_level || '4'}
                </p>
              </div>
            </div>

            {/* Right: ID Info Glass Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 lg:pl-8 lg:border-l lg:border-white/10 w-full lg:w-auto">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition duration-300">
                <div className="w-9 h-9 rounded-lg bg-[#EAD8B1]/10 flex items-center justify-center shrink-0">
                  <Hash className="h-4 w-4 text-[#EAD8B1]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#6A9AB0] font-semibold mb-0.5">Student ID</p>
                  <p className="text-sm font-bold text-white truncate">{user?.student_id || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition duration-300">
                <div className="w-9 h-9 rounded-lg bg-[#EAD8B1]/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-[#EAD8B1]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#6A9AB0] font-semibold mb-0.5">Email Account</p>
                  <p className="text-sm font-bold text-white truncate max-w-[150px]" title={user?.email || ''}>{user?.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition duration-300 sm:col-span-2">
                <div className="w-9 h-9 rounded-lg bg-[#EAD8B1]/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-[#EAD8B1]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#6A9AB0] font-semibold mb-0.5">Current Address</p>
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
          <div className="bg-white rounded-xl border border-[#6A9AB0]/10 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#6A9AB0]/10">
              {[
                { id: 'announcements', label: 'Announcements', icon: Megaphone },
                { id: 'rules', label: 'Rules & Regulations', icon: ShieldCheck },
              ].map(({ id, label, icon: TabIcon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all duration-200 border-b-2 cursor-pointer ${activeTab === id
                      ? 'border-[#3A6D8C] text-[#001F3F] bg-[#EAD8B1]/5'
                      : 'border-transparent text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/5'
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
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-[#3A6D8C]" />
                    </div>
                  ) : announcements.length === 0 ? (
                    <p className="text-sm text-[#6A9AB0]/60 italic py-8 text-center">
                      No announcements yet.
                    </p>
                  ) : (
                    announcements.map((a) => (
                      <div
                        key={a.id}
                        className="group/card relative border border-[#6A9AB0]/10 rounded-xl px-5 py-4 hover:border-[#3A6D8C]/25 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-[#3A6D8C] to-[#6A9AB0]" />
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-[#001F3F]">{a.author || 'CCS Admin'}</span>
                          <span className="w-1 h-1 rounded-full bg-[#6A9AB0]/40" />
                          <span className="text-[11px] text-[#6A9AB0]">{a.date}</span>
                        </div>
                        <p className="text-sm text-[#001F3F]/75 leading-relaxed whitespace-pre-wrap">{a.body}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-0 max-h-[400px] overflow-y-auto pr-1">
                  <p className="text-[11px] font-medium text-[#6A9AB0] mb-4">
                    University of Cebu — College of Information &amp; Computer Studies
                  </p>
                  {RULES.map((rule, i) => (
                    <div
                      key={i}
                      className="flex gap-3.5 py-3 border-b border-[#6A9AB0]/8 last:border-0"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#3A6D8C]/10 to-[#6A9AB0]/10 text-[11px] font-bold text-[#3A6D8C] mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[#001F3F]/75 leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick-access sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Session counter */}
          <div className="bg-gradient-to-br from-[#3A6D8C] to-[#001F3F] rounded-xl p-5 shadow-lg text-white">
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#EAD8B1]/60 mb-1">
              Remaining Sessions
            </p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold leading-none">
                {user?.session || '26'}
              </span>
              <span className="text-sm text-[#EAD8B1]/70 mb-1">/ 30</span>
            </div>
            <div className="mt-3 w-full h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#EAD8B1] transition-all duration-700"
                style={{ width: `${((user?.session || 26) / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl border border-[#6A9AB0]/10 shadow-sm divide-y divide-[#6A9AB0]/8">
            {[
              { label: 'View Sit-in History', to: '/student/history' },
              { label: 'Edit Profile', to: '/student/edit-profile' },
              { label: 'Make a Reservation', to: '/student/reservation' },
            ].map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="flex items-center justify-between px-5 py-3.5 text-sm font-medium text-[#001F3F] hover:bg-[#EAD8B1]/10 transition-colors group"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-[#6A9AB0] group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>

          {/* Mini profile card */}
          <div className="bg-white rounded-xl border border-[#6A9AB0]/10 shadow-sm p-5">
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#6A9AB0] mb-3">
              Your Profile
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center overflow-hidden shrink-0">
                {user?.profile_pic ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-[#3A6D8C]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#001F3F] truncate">{fullName}</p>
                <p className="text-[11px] text-[#6A9AB0] truncate">{user?.email || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
