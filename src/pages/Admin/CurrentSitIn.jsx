import React, { useState, useEffect } from 'react';
import {
  Search, Loader2, LogOut, Clock, User, X,
  Copy, ChevronRight, FlaskConical, Activity,
  ShieldCheck, AlertCircle, Users, LayoutDashboard,
  Calendar, MapPin, RotateCcw, UserCheck, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import sitinService from '../../services/sitin.service';
import { SITIN_PURPOSES } from '../../constants/app.constants';

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function SessionDetailModal({ session, onClose, onEndSession }) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border">
        <div className="px-5 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-primary tracking-tight">Session Details</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest opacity-60">ID: {session.log_id.slice(0, 18)}...</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(session.log_id);
                  toast.success('ID copied!');
                }}
                className="p-1 hover:bg-primary/5 rounded-md text-primary-light hover:text-primary transition-colors cursor-pointer"
                title="Copy Full ID"
              >
                <Copy className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-primary-light hover:text-primary transition-colors border border-transparent hover:border-border"><X className="h-4 w-4" /></button>
        </div>

        <div className="px-6 py-6 border-b border-border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-sm">
              <div className="w-full h-full rounded-[0.65rem] bg-white flex items-center justify-center overflow-hidden">
                {session.profile_pic ? <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${session.profile_pic}`} alt="" className="w-full h-full object-cover" /> : <User className="h-6 w-6 text-primary" />}
              </div>
            </div>
            <div>
              <p className="text-lg font-black text-primary tracking-tighter leading-none">{session.first_name} {session.last_name}</p>
              <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mt-1.5">{session.student_id} • {session.course}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-bg-secondary/10">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Laboratory</p>
              <p className="text-xs font-black text-primary uppercase">{session.lab_name || '—'}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Session Pool</p>
              <p className="text-xs font-black text-primary">{session.session} <span className="text-[9px] opacity-40">Left</span></p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Login Time</p>
              <p className="text-xs font-black text-primary">{formatTime(session.time_in)}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Current Status</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">{session.status}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
            <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Purpose</p>
            <p className="text-xs font-bold text-primary uppercase">{session.purpose || '—'}</p>
          </div>
        </div>

        <div className="px-5 py-4 bg-bg-secondary border-t border-border flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase text-primary-light hover:text-primary transition-all">Cancel</button>
          <button onClick={() => { onClose(); onEndSession(session.log_id); }} className="px-6 py-2 rounded-xl bg-red-50 text-red-500 text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95">End Session</button>
        </div>
      </div>
    </div>
  );
}

export default function CurrentSitIn() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchActiveSessions = async () => {
    setIsLoading(true);
    try {
      const data = await sitinService.getActiveSessions();
      setSessions(data);
      setFilteredSessions(data);
    } catch (err) { toast.error('Load failed'); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchActiveSessions(); }, []);

  useEffect(() => {
    let result = [...sessions];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.student_id?.toLowerCase().includes(q) || s.first_name?.toLowerCase().includes(q) || s.last_name?.toLowerCase().includes(q) || s.lab_name?.toLowerCase().includes(q));
    }
    if (purposeFilter !== 'all') {
      if (purposeFilter === 'Other') {
        const predefined = SITIN_PURPOSES.filter(p => p !== 'Other');
        result = result.filter(s => !predefined.includes(s.purpose));
      } else {
        result = result.filter(s => s.purpose === purposeFilter);
      }
    }
    setFilteredSessions(result);
  }, [searchQuery, purposeFilter, sessions]);

  const handleEndSession = async (logId) => {
    if (!window.confirm('End session?')) return;
    try { await sitinService.endSessionAdmin(logId); toast.success('Ended'); fetchActiveSessions(); } catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative">
      <div className="relative overflow-hidden rounded-xl bg-primary border border-border shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-light/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-sand/5 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-xl bg-primary flex items-center justify-center border-2 border-primary relative overflow-hidden">
                  <Activity className="h-8 w-8 text-brand-sand relative z-10" />
                  <div className="absolute inset-0 bg-primary-hover/20" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-brand-sand uppercase tracking-[0.2em] flex items-center gap-2">
                    Monitoring
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none">Current Sit-in</h1>
                <p className="text-xs font-bold text-primary-light/80 max-w-md leading-relaxed">Overview of currently active student sessions in the laboratories.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {[{ label: 'Active Now', val: sessions.length, icon: UserCheck, color: 'text-emerald-400' }].map((st, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all min-w-[160px] group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <st.icon className={`h-4 w-4 ${st.color}`} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-primary-light/60 font-black mb-0.5">{st.label}</p>
                    <p className="text-lg font-black text-white tracking-tighter">{st.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/40 group-focus-within:text-primary-hover transition-colors" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-5 py-3 rounded-xl border border-border bg-white text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" />
          </div>

          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-primary-light" />
            <select
              value={purposeFilter}
              onChange={e => setPurposeFilter(e.target.value)}
              className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent outline-none cursor-pointer"
            >
              <option value="all">All Purposes</option>
              {SITIN_PURPOSES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-[10px] font-black text-primary-light uppercase tracking-widest whitespace-nowrap">
            {filteredSessions.length} Results
          </div>
        </div>

        <button onClick={fetchActiveSessions} className="px-4 py-3 rounded-xl bg-bg-secondary border border-border text-primary-light hover:text-primary transition-all flex items-center gap-2 group cursor-pointer font-black text-[10px] uppercase tracking-widest"><RotateCcw className="h-4 w-4" /> Refresh</button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">#</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">ID Number</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Name</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Purpose</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Sit Lab</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Session</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Status</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (<tr><td colSpan="8" className="py-32 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary/20 mx-auto" /></td></tr>) : filteredSessions.length === 0 ? (<tr><td colSpan="8" className="py-32 text-center text-sm text-primary-light font-bold uppercase opacity-40">No active sit-ins.</td></tr>) : (
                filteredSessions.map((session, index) => (
                  <tr key={session.log_id} className="hover:bg-bg-secondary/50 transition-colors group text-sm">
                    <td className="py-3 px-6 font-bold text-primary-light/40">{index + 1}</td>
                    <td className="py-3 px-6 font-bold text-primary-hover">{session.student_id}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">{session.profile_pic ? <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${session.profile_pic}`} alt="" className="w-full h-full object-cover rounded-md" /> : <User className="h-4 w-4 text-primary" />}</div>
                        <span className="font-bold text-primary">{session.first_name} {session.last_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-primary-light">{session.purpose}</td>
                    <td className="py-3 px-6 text-center font-bold text-primary-hover">{session.lab_name}</td>
                    <td className="py-3 px-6 text-center"><span className="bg-brand-sand/10 border border-brand-sand/20 px-2 py-1 rounded text-xs font-black">{session.session}</span></td>
                    <td className="py-3 px-6 text-center"><span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600">{session.status}</span></td>
                    <td className="py-3 px-6 text-right"><div className="flex justify-end gap-1"><button onClick={() => setSelectedSession(session)} className="px-4 py-1.5 rounded-lg border border-border text-[10px] font-black uppercase text-primary hover:bg-bg-secondary transition-all">Details</button><button onClick={() => handleEndSession(session.log_id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all"><LogOut className="h-4 w-4" /></button></div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedSession && <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} onEndSession={handleEndSession} />}
    </div>
  );
}
