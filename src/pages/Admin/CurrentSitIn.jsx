import React, { useState, useEffect } from 'react';
import { Search, Loader2, LogOut, Clock, User, X, Copy, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import sitinService from '../../services/sitin.service';

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Session Detail Modal ───────────────────────────────────────────────────
function SessionDetailModal({ session, onClose, onEndSession }) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#6A9AB0]/15 bg-[#EAD8B1]/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#001F3F]">Session Details</h3>
            {/* Copyable UUID */}
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-xs font-mono text-[#3A6D8C] truncate max-w-[260px]">
                {session.log_id}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(session.log_id);
                  toast.success('Session ID copied!');
                }}
                className="shrink-0 text-[#6A9AB0] hover:text-[#3A6D8C] transition-colors cursor-pointer"
                title="Copy full ID"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Student Info */}
        <div className="px-6 py-5 border-b border-[#6A9AB0]/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center shrink-0 overflow-hidden">
              {session.profile_pic ? (
                <img
                  src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${session.profile_pic}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-[#3A6D8C]" />
              )}
            </div>
            <div>
              <p className="text-base font-extrabold text-[#001F3F]">
                {session.first_name} {session.last_name}
              </p>
              <p className="text-xs font-semibold text-[#3A6D8C]">{session.student_id}</p>
              <p className="text-xs text-[#6A9AB0] mt-0.5">
                {session.course} — {session.course_level}
              </p>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Laboratory</p>
              <p className="text-sm font-bold text-[#3A6D8C]">{session.lab_name || '—'}</p>
            </div>

            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Sessions Left</p>
              <p className={`text-sm font-bold ${session.session > 0 ? 'text-[#3A6D8C]' : 'text-red-500'}`}>
                {session.session}
              </p>
            </div>

            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Time In</p>
              <p className="text-sm font-bold text-[#001F3F]">{formatTime(session.time_in)}</p>
              <p className="text-[10px] text-[#6A9AB0] mt-0.5">{formatDate(session.time_in)}</p>
            </div>

            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Status</p>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                {session.status}
              </span>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Purpose</p>
            <p className="text-sm font-semibold text-[#001F3F]">{session.purpose || '—'}</p>
          </div>

          {/* Duration so far */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#3A6D8C]/5 rounded-xl border border-[#3A6D8C]/10">
            <Clock className="h-4 w-4 text-[#3A6D8C] shrink-0" />
            <p className="text-xs text-[#001F3F]">
              Session started at <span className="font-bold text-[#3A6D8C]">{formatTime(session.time_in)}</span> and is still ongoing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EAD8B1]/10 border-t border-[#6A9AB0]/15 flex justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-[#6A9AB0]/30 text-sm font-bold text-[#001F3F] hover:bg-[#EAD8B1]/25 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEndSession(session.log_id);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-bold hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function CurrentSitIn() {
  const [sessions, setSessions]             = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery]       = useState('');
  const [isLoading, setIsLoading]           = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchActiveSessions = async () => {
    setIsLoading(true);
    try {
      const data = await sitinService.getActiveSessions();
      setSessions(data);
      setFilteredSessions(data);
    } catch (err) {
      toast.error('Failed to load active sit-in sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSessions(sessions);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = sessions.filter(s =>
      s.student_id?.toLowerCase().includes(q) ||
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q)  ||
      s.lab_name?.toLowerCase().includes(q)   ||
      s.purpose?.toLowerCase().includes(q)
    );
    setFilteredSessions(filtered);
  }, [searchQuery, sessions]);

  const handleEndSession = async (logId) => {
    if (!window.confirm('Are you sure you want to end this sit-in session?')) return;
    try {
      await sitinService.endSessionAdmin(logId);
      toast.success('Session ended successfully.');
      fetchActiveSessions();
    } catch (err) {
      toast.error(err.customMessage || 'Failed to end session.');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001F3F]">Current Sit-in Monitoring</h1>
          <p className="text-sm text-[#6A9AB0]">View and manage all active laboratory sessions.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6A9AB0]" />
          <input
            type="text"
            placeholder="Search Lab, Name, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#6A9AB0]/20 bg-white text-sm text-[#001F3F] placeholder:text-[#6A9AB0]/40 focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EAD8B1]/10 border-b border-[#6A9AB0]/15 whitespace-nowrap">
                {/* # instead of UUID */}
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">#</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">ID Number</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Name</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Purpose</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Sit Lab</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60 text-center">Session</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6A9AB0]/10">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#3A6D8C] mx-auto" />
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sm text-[#6A9AB0]/60 italic">
                    No active sit-in sessions right now.
                  </td>
                </tr>
              ) : (
                // ↓ index added here
                filteredSessions.map((session, index) => (
                  <tr key={session.log_id} className="hover:bg-[#EAD8B1]/5 transition-colors group text-sm">

                    {/* Row number */}
                    <td className="py-3 px-6 font-mono text-[#3A6D8C] font-semibold text-sm whitespace-nowrap">
                      #{index + 1}
                    </td>

                    <td className="py-3 px-6 font-bold text-[#001F3F] whitespace-nowrap">
                      {session.student_id}
                    </td>

                    <td className="py-3 px-6 text-[#001F3F] whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {session.profile_pic ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${session.profile_pic}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-[#3A6D8C]" />
                          )}
                        </div>
                        <span className="font-bold">{`${session.first_name} ${session.last_name}`}</span>
                      </div>
                    </td>

                    <td className="py-3 px-6 text-[#6A9AB0] whitespace-nowrap">
                      {session.purpose}
                    </td>

                    <td className="py-3 px-6 font-bold text-[#3A6D8C] whitespace-nowrap">
                      {session.lab_name}
                    </td>

                    <td className="py-3 px-6 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAD8B1]/20 text-[#001F3F]">
                        {session.session}
                      </span>
                    </td>

                    <td className="py-3 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                        {session.status}
                      </span>
                      <div className="text-[10px] text-[#6A9AB0] mt-1 font-medium pl-1">
                        {formatTime(session.time_in)}
                      </div>
                    </td>

                    {/* Actions — View Details + End Session */}
                    <td className="py-3 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#6A9AB0]/20 text-[#3A6D8C] text-[11px] font-bold uppercase tracking-wider hover:bg-[#3A6D8C] hover:text-white hover:border-[#3A6D8C] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          View
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleEndSession(session.log_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          title="End Session"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          End
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onEndSession={handleEndSession}
        />
      )}
    </div>
  );
}