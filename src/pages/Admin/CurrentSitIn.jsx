import React, { useState, useEffect } from 'react';
import { Search, Loader2, LogOut, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import sitinService from '../../services/sitin.service';

export default function CurrentSitIn() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSessions(sessions);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = sessions.filter(s => 
      s.student_id?.toLowerCase().includes(q) ||
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.lab_name?.toLowerCase().includes(q) ||
      s.purpose?.toLowerCase().includes(q)
    );
    setFilteredSessions(filtered);
  }, [searchQuery, sessions]);

  const handleEndSession = async (logId) => {
    if (!window.confirm("Are you sure you want to end this sit-in session?")) return;
    
    try {
      await sitinService.endSession(logId);
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
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Sit ID Number</th>
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
                filteredSessions.map(session => (
                  <tr key={session.log_id} className="hover:bg-[#EAD8B1]/5 transition-colors group text-sm">
                    <td className="py-3 px-6 font-mono text-[#3A6D8C] font-semibold whitespace-nowrap">
                      SIT-{String(session.log_id).padStart(4, '0')}
                    </td>
                    <td className="py-3 px-6 font-bold text-[#001F3F] whitespace-nowrap">
                      {session.student_id}
                    </td>
                    <td className="py-3 px-6 text-[#001F3F] whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {session.profile_pic ? (
                            <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${session.profile_pic}`} alt="" className="w-full h-full object-cover"/>
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
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                        {session.status}
                      </span>
                      <div className="text-[10px] text-[#6A9AB0] mt-1 font-medium pl-1">
                        {new Date(session.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleEndSession(session.log_id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        title="End Session"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        End Session
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
