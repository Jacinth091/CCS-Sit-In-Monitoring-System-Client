import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import sitinService from '../../services/sitin.service';
import UsageStats from '../../components/student-history/UsageStats';
import SessionTable from '../../components/student-history/SessionTable';
import FeedbackViewModal from '../../components/student-history/FeedbackViewModal';
import { Loader2, ArrowLeft, History } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function MyHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalHours: '0h 0m',
    mostVisitedLab: '—',
    lastSessionDate: '—'
  });

  useEffect(() => {
    if (user?.student_id) {
      fetchHistory();
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await sitinService.getStats(user.student_id);
      if (res.status === 'success') {
        const s = res.data;
        setStats({
          totalSessions: s.total_sessions || 0,
          totalHours: s.total_duration || '0h 0m',
          mostVisitedLab: s.most_visited_lab || '—',
          lastSessionDate: s.last_session_date ? new Date(s.last_session_date).toLocaleDateString() : '—'
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await sitinService.getHistoryByStudent(user.student_id);
      const rawData = res.data || [];
      
      const transformed = rawData.map(s => ({
        id: s.id || s.log_id,
        date: new Date(s.time_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lab_name: s.lab_name,
        purpose: s.purpose,
        start_time: new Date(s.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end_time: s.time_out ? new Date(s.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        duration: s.duration,
        duration_minutes: s.duration_minutes || 0,
        feedback: s.feedback_text ? {
          message: s.feedback_text,
          adminName: s.admin_name || 'Lab Supervisor',
          date: new Date(s.feedback_date || s.time_out || s.time_in).toLocaleDateString()
        } : null
      }));

      setSessions(transformed.reverse());
    } catch (err) {
      toast.error('Failed to load your history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFeedback = (session) => {
    setSelectedFeedback(session.feedback);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative pb-24">
      
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center mb-4">
           <History className="h-8 w-8 text-[#3A6D8C]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#001F3F] tracking-tight">Your Activity Journal</h1>
        <p className="text-sm text-[#6A9AB0] mt-1 max-w-md">
           A comprehensive log of your laboratory usage, hours, and administrative feedback.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-[#3A6D8C]" />
           <p className="text-xs font-bold text-[#3A6D8C] animate-pulse uppercase tracking-widest">Retrieving logs...</p>
        </div>
      ) : (
        <>
          <UsageStats stats={stats} />
          
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 px-2">
               <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-[#001F3F]/60">
                  Detailed Session History
               </h3>
               <span className="text-[10px] font-bold text-[#6A9AB0] bg-white border border-[#6A9AB0]/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  {sessions.length} Records
               </span>
            </div>
            <SessionTable sessions={sessions} onOpenFeedback={handleOpenFeedback} />
          </div>
        </>
      )}

      <FeedbackViewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        feedback={selectedFeedback} 
      />

      <div className="mt-16 pt-8 border-t border-[#6A9AB0]/10 flex justify-center">
         <Link 
            to="/student/dashboard" 
            className="group inline-flex items-center gap-2 text-xs font-bold text-[#3A6D8C] hover:text-[#001F3F] transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Hub
          </Link>
      </div>
    </div>
  );
}
