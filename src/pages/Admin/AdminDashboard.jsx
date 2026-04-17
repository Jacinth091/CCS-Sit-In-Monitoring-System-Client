import React, { useState, useEffect } from 'react';
import { Users, UserCheck, ClipboardList, Loader2 } from 'lucide-react';
import adminService from '../../services/admin.service';

/* ── Pie / Donut chart (pure SVG) ── */
function DonutChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-[#6A9AB0]/60 italic text-center py-10">No data available.</p>;
  }

  const COLORS = ['#3A6D8C', '#6A9AB0', '#EAD8B1', '#001F3F', '#8FBDD3'];

  const total = data.reduce((s, d) => s + parseInt(d.count, 10), 0);
  let cumulative = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d, i) => (
          <div key={`${d.label}-${i}`} className="flex items-center gap-1.5 text-xs text-[#001F3F]/70">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            {d.label} ({d.count})
          </div>
        ))}
      </div>

      <svg viewBox="0 0 100 100" className="w-56 h-56 -rotate-90">
        {data.map((d, i) => {
          const val = parseInt(d.count, 10);
          const dash = (val / total) * circumference;
          const gap = circumference - dash;
          const offset = (cumulative / total) * circumference;
          cumulative += val;
          return (
            <circle
              key={`${d.label}-${i}`}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth="14"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              className="transition-all duration-700 hover:opacity-80 cursor-pointer"
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ── Simple CSS Bar Chart ── */
function SimpleBarChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-[#6A9AB0]/60 italic text-center py-10">No data available.</p>;
  }

  // Purely visual representation mapping the same data if no new data exists.
  // We'll use the course distribution data to render the bars just to show the UI.
  const max = Math.max(...data.map(d => parseInt(d.count, 10)));
  
  return (
    <div className="space-y-4 mt-6">
      {data.map((d, i) => {
        const percentage = Math.round((parseInt(d.count, 10) / max) * 100);
        return (
          <div key={`${d.label}-${i}`}>
            <div className="flex justify-between text-xs font-bold text-[#001F3F]/70 mb-1">
              <span>{d.label}</span>
              <span>{d.count}</span>
            </div>
            <div className="w-full bg-[#EAD8B1]/20 rounded-full h-3">
              <div 
                className="bg-[#3A6D8C] h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-[#6A9AB0]/15 px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-xl shrink-0"
        style={{ backgroundColor: `${accent}15` }}
      >
        <Icon className="h-6 w-6" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-[#001F3F]">{value}</p>
        <p className="text-xs font-bold tracking-wider uppercase text-[#6A9AB0] mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_students: 0,
    current_sitin: 0,
    total_sitin: 0,
    purpose_distribution: [],
    student_course_distribution: [],
    total_labs: 0,
    recent_sessions: [],
    lab_usage: []
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsData = await adminService.getDashboardStats();
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setIsStatsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3A6D8C]" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-[#001F3F] mb-2">Analytics Dashboard</h1>
      <p className="text-sm text-[#6A9AB0] mb-8">An overview of the entire system metrics.</p>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.total_students || 0}
          accent="#3A6D8C"
        />
        <StatCard
          icon={UserCheck}
          label="Currently Sit-in"
          value={stats.current_sitin || 0}
          accent="#6A9AB0"
        />
        <StatCard
          icon={ClipboardList}
          label="Lifetime Sit-in Logs"
          value={stats.total_sitin || 0}
          accent="#001F3F"
        />
        <StatCard
          icon={ClipboardList}
          label="Total Labs"
          value={stats.total_labs || 0}
          accent="#EAD8B1"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graph 1 */}
        <div className="bg-white rounded-xl border border-[#6A9AB0]/15 p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#001F3F]/60 mb-8 self-start">
            Student Course Distribution
          </h3>
          <div className="flex-1 flex items-center justify-center w-full">
             <DonutChart data={stats.student_course_distribution} />
          </div>
        </div>

        {/* Graph 2 */}
        <div className="bg-white rounded-xl border border-[#6A9AB0]/15 p-6 shadow-sm">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#001F3F]/60 mb-2">
            Usage by Programming Purpose
          </h3>
          <p className="text-xs text-[#6A9AB0] mb-6">Bar representation of the laboratory usage reasons</p>
          <SimpleBarChart data={stats.purpose_distribution} />
        </div>
      </div>

      {/* Lab Usage & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lab Usage List */}
        <div className="bg-white rounded-xl border border-[#6A9AB0]/15 p-6 shadow-sm h-fit">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#001F3F]/60 mb-6">
            Laboratory Usage
          </h3>
          <div className="space-y-4">
            {stats.lab_usage && stats.lab_usage.length > 0 ? (
              stats.lab_usage.filter(lab => parseInt(lab.count, 10) > 0 || true).slice(0, 6).map((lab, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-[#001F3F]/80 font-medium">{lab.label}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAD8B1]/30 text-[#001F3F] text-xs font-bold">
                    {lab.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6A9AB0]/60 italic">No lab usage data.</p>
            )}
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#6A9AB0]/15 p-6 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#001F3F]/60 mb-6">
            Recent Sit-in Sessions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#6A9AB0]/10">
                  <th className="pb-3 text-xs font-bold text-[#6A9AB0] uppercase tracking-wider">Student</th>
                  <th className="pb-3 text-xs font-bold text-[#6A9AB0] uppercase tracking-wider">Lab</th>
                  <th className="pb-3 text-xs font-bold text-[#6A9AB0] uppercase tracking-wider">Purpose</th>
                  <th className="pb-3 text-xs font-bold text-[#6A9AB0] uppercase tracking-wider">Time In</th>
                  <th className="pb-3 text-xs font-bold text-[#6A9AB0] uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6A9AB0]/5">
                {stats.recent_sessions && stats.recent_sessions.length > 0 ? (
                  stats.recent_sessions.map((session, idx) => (
                    <tr key={idx} className="hover:bg-[#EAD8B1]/5 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="text-sm font-bold text-[#001F3F]">
                          {session.first_name} {session.last_name}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-[#001F3F]/80">{session.lab_name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs bg-[#3A6D8C]/10 text-[#3A6D8C] px-2 py-0.5 rounded w-fit">
                          {session.purpose}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-[#6A9AB0]">
                          {new Date(session.time_in).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          session.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-[#6A9AB0]/10 text-[#6A9AB0]'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-sm text-[#6A9AB0]/60 italic">
                      No recent sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
