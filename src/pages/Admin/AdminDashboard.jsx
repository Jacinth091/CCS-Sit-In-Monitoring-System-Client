import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, ClipboardList, Loader2,
  FlaskConical, Activity, TrendingUp, Calendar,
  ArrowUpRight, Clock, ShieldCheck, ChevronRight, Monitor
} from 'lucide-react';
import adminService from '../../services/admin.service';
import { Link } from 'react-router';
import { formatDate, formatTime } from '../../utils/dateUtils';

/* ── Donut chart ── */
function DonutChart({ data }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
        <Activity className="h-8 w-8 mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest italic">No data detected</p>
      </div>
    );
  }

  const COLORS = ['#001F3F', '#3A6D8C', '#6A9AB0', '#EAD8B1', '#8FBDD3'];
  const total = data.reduce((s, d) => s + parseInt(d.count, 10), 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-48 h-48 group">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-lg overflow-visible">
          {data.reduce((acc, d, i) => {
            const val = parseInt(d.count, 10);
            const dash = (val / total) * circumference;
            const gap = circumference - dash;
            const offset = (acc.cumulative / total) * circumference;

            acc.circles.push(
              <circle
                key={`${d.label}-${i}`}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={hoveredItem?.label === d.label ? "12" : "10"}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-300 hover:opacity-100 opacity-90 cursor-pointer"
                onMouseEnter={() => setHoveredItem(d)}
                onMouseLeave={() => setHoveredItem(null)}
              />
            );
            acc.cumulative += val;
            return acc;
          }, { circles: [], cumulative: 0 }).circles}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-black text-primary tracking-tighter transition-all duration-300 ${hoveredItem ? 'text-xl' : 'text-2xl'}`}>
            {hoveredItem ? hoveredItem.count : total}
          </span>
          <span className="text-[8px] font-black text-primary-light uppercase tracking-widest text-center max-w-[80px] line-clamp-2">
            {hoveredItem ? hoveredItem.label : 'Total'}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            className="flex items-center gap-2 group cursor-pointer"
            onMouseEnter={() => setHoveredItem(d)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ring-2 ring-white shadow-sm transition-transform duration-300 ${hoveredItem?.label === d.label ? 'scale-125' : ''}`}
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <div className="flex flex-col">
              <span className={`text-[9px] font-bold uppercase tracking-tight transition-colors line-clamp-1 ${hoveredItem?.label === d.label ? 'text-primary' : 'text-primary-light'}`}>
                {d.label}
              </span>
              <span className="text-xs font-black text-primary">{d.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bar Chart ── */
function SimpleBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
        <TrendingUp className="h-8 w-8 mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting data...</p>
      </div>
    );
  }
  const max = Math.max(...data.map(d => parseInt(d.count, 10)));
  return (
    <div className="space-y-4 mt-2">
      {data.map((d, i) => {
        const val = parseInt(d.count, 10);
        const percentage = Math.round((val / max) * 100);
        return (
          <div key={`${d.label}-${i}`} className="group">
            <div className="flex justify-between items-end mb-1"><span className="text-[9px] font-black text-primary-light uppercase tracking-widest group-hover:text-primary transition-colors">{d.label}</span><span className="text-xs font-black text-primary">{val}</span></div>
            <div className="w-full bg-brand-sand/10 rounded-full h-2 overflow-hidden border border-primary-light/5"><div className="bg-gradient-to-r from-primary-hover to-primary h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${percentage}%` }}></div></div>
          </div>
        )
      })}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon: StatIcon, label, value, accent, trend }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500"><StatIcon className="w-20 h-20" style={{ color: accent }} /></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-inner" style={{ backgroundColor: `${accent}10` }}><StatIcon className="h-4 w-4" style={{ color: accent }} /></div>
          {trend && <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md"><TrendingUp className="h-3 w-3" />{trend}</div>}
        </div>
        <div className="space-y-0.5"><p className="text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">{label}</p><div className="flex items-baseline gap-2"><span className="text-2xl font-black text-primary tracking-tighter">{value}</span></div></div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_students: 0, current_sitin: 0, total_sitin: 0, purpose_distribution: [], student_course_distribution: [], total_labs: 0, recent_sessions: [], lab_usage: [] });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try { const statsData = await adminService.getDashboardStats(); setStats(statsData); } catch (err) { console.error("Failed to load stats", err); } finally { setIsStatsLoading(false); }
    }
    fetchData();
  }, []);

  if (isStatsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-primary-light animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-hover" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">CCS Sit-in Monitoring</p>
            </div>
            <h1 className="text-xl font-black text-primary tracking-tight">Admin Dashboard</h1>
            <p className="text-[11px] font-bold text-primary-light mt-0.5">Overview of {stats.total_students} students and {stats.total_labs} computer laboratories.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: 'Active Now', value: stats.current_sitin, icon: UserCheck, color: 'text-emerald-500' },
              { label: 'Total Sit-ins', value: stats.total_sitin, icon: ClipboardList, color: 'text-brand-sand' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary border border-border min-w-[150px]">
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-primary-light font-black mb-0.5">{item.label}</p>
                  <p className="text-base font-black text-primary tracking-tighter">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Registered Students" value={stats.total_students || 0} accent="#3A6D8C" trend="+12%" />
        <StatCard icon={UserCheck} label="Active Sit-in" value={stats.current_sitin || 0} accent="#10B981" />
        <StatCard icon={Monitor} label="Active Units" value={stats.current_sitin || 0} accent="#6A9AB0" />
        <StatCard icon={ClipboardList} label="Total Sit-ins" value={stats.total_sitin || 0} accent="#F59E0B" />
        <StatCard icon={FlaskConical} label="Total Labs" value={stats.total_labs || 0} accent="#6366F1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm p-6 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-6"><div><h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">Student Population</h3><p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">By Course</p></div><Activity className="h-4 w-4 text-primary-light/30" /></div>
          <DonutChart data={stats.student_course_distribution} />
        </div>
        <div className="lg:col-span-3 bg-white rounded-xl border border-border shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between w-full mb-6"><div><h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">Sit-in Purpose</h3><p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">Usage Reasons</p></div><TrendingUp className="h-4 w-4 text-primary-light/30" /></div>
          <div className="flex-1 space-y-8">
            <SimpleBarChart data={stats.purpose_distribution} />
            <div className="pt-6 border-t border-border/60 flex items-center justify-between">
              <div className="flex gap-4"><div className="flex flex-col"><span className="text-[8px] font-black text-primary-light uppercase tracking-widest">Top Lab</span><span className="text-xs font-black text-primary uppercase">Lab 542</span></div><div className="w-[1px] h-6 bg-border/60" /><div className="flex flex-col"><span className="text-[8px] font-black text-primary-light uppercase tracking-widest">Avg Duration</span><span className="text-xs font-black text-primary uppercase">1.5 Hours</span></div></div>
              <Link to="/admin/sit-in/records" className="flex items-center gap-1.5 text-[9px] font-black text-primary-hover uppercase tracking-widest hover:translate-x-1 transition-transform group">View All Records <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-border bg-bg-secondary/30">
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary flex items-center gap-2"><FlaskConical className="h-3.5 w-3.5 text-primary-hover" /> Laboratory Usage</h3>
          </div>
          <div className="p-4 space-y-3 grow">
            {stats.lab_usage && stats.lab_usage.length > 0 ? stats.lab_usage.slice(0, 6).map((lab, idx) => (
              <div key={idx} className="flex items-center justify-between group"><div className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-brand-sand/10 flex items-center justify-center text-[10px] font-black text-primary/60 group-hover:bg-primary group-hover:text-white transition-colors">{idx + 1}</span><span className="text-xs text-primary font-bold tracking-tight uppercase">{lab.label}</span></div><div className="flex items-center gap-2"><div className="w-12 h-1 bg-brand-sand/20 rounded-full overflow-hidden"><div className="h-full bg-primary-hover rounded-full" style={{ width: `${Math.min(100, (parseInt(lab.count) / 100) * 100)}%` }} /></div><span className="px-2 py-0.5 rounded-lg bg-bg-secondary text-primary text-[9px] font-black border border-border">{lab.count}</span></div></div>
            )) : <div className="py-10 text-center opacity-30"><p className="text-[10px] font-black uppercase">No active labs</p></div>}
          </div>
          <Link to="/admin/students" className="p-3 bg-bg-secondary/50 border-t border-border text-[9px] font-black text-primary-light uppercase tracking-widest text-center hover:bg-bg-secondary hover:text-primary transition-colors">Manage Student Sessions</Link>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary-hover" /> Recent Activity</h3>
            <Link to="/admin/sit-in" className="flex items-center gap-1.5 text-[9px] font-black text-primary-hover uppercase tracking-widest hover:translate-x-1 transition-transform group">
              Manage Active <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4 space-y-3 grow overflow-y-auto max-h-[500px] custom-scrollbar">
            {stats.recent_sessions && stats.recent_sessions.length > 0 ? (
              stats.recent_sessions.map((session, idx) => {
                const isOngoing = session.status === 'active';
                return (
                  <div
                    key={idx}
                    className="relative border border-border rounded-xl p-0 transition-all duration-300 bg-white overflow-hidden hover:shadow-md hover:border-primary/20"
                  >
                    {/* Status Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOngoing ? 'bg-emerald-500 animate-pulse' : 'bg-primary-light/20'}`} />

                    <div className="px-5 py-4 ml-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary leading-tight">
                                  {session.pc_number ? `PC ${session.pc_number}` : 'No Station'}
                                </span>
                                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/5">
                                  {session.lab_name}
                                </span>
                              </div>
                              <p className="text-[12px] font-bold text-primary-light leading-tight">
                                {session.first_name} {session.last_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold text-primary-light">
                            <span className="flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1.5 rounded-lg text-primary border border-border/50">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(session.time_in)}
                            </span>
                            <span className="flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1.5 rounded-lg text-primary border border-border/50">
                              <Clock className="h-3.5 w-3.5" />
                              {formatTime(session.time_in)}
                            </span>
                            <span className="flex items-center gap-1.5 bg-bg-secondary/60 px-2.5 py-1.5 rounded-lg text-primary-light border border-border/60 text-[10px] font-extrabold tracking-wide">
                              {session.purpose}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between min-w-[88px]">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${isOngoing
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-bg-secondary text-primary-light border-border'
                            }`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center opacity-30">
                <p className="text-[9px] font-black uppercase tracking-widest">No recent logs discovered</p>
              </div>
            )}
          </div>
          <Link to="/admin/sit-in/history" className="px-6 py-3 text-[9px] font-black text-primary-light uppercase tracking-widest hover:text-primary transition-colors border-t border-border text-center">View History</Link>
        </div>
      </div>
    </div>
  );
}
