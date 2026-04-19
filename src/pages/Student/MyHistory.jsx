import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import sitinService from '../../services/sitin.service';
import UsageStats from '../../components/student-history/UsageStats';
import SessionTable from '../../components/student-history/SessionTable';
import FeedbackViewModal from '../../components/student-history/FeedbackViewModal';
import StudentFeedbackModal from '../../components/modals/StudentFeedbackModal';
import { Loader2, ArrowLeft, History, Clock, FlaskConical } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function MyHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Feedback view modal state
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Student feedback entry modal state
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [initialFeedback, setInitialFeedback] = useState({ rating: 0, comment: '' });

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
        
        // Robust duration formatting
        let displayDuration = '0h 0m';
        if (s.total_duration) {
          displayDuration = s.total_duration;
        } else if (s.total_minutes !== undefined) {
          const mins = parseInt(s.total_minutes);
          displayDuration = `${Math.floor(mins / 60)}h ${mins % 60}m`;
        } else if (s.total_hours !== undefined) {
          const totalMins = Math.round(parseFloat(s.total_hours) * 60);
          displayDuration = `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
        }

        setStats({
          totalSessions: s.total_sessions || 0,
          totalHours: displayDuration,
          mostVisitedLab: s.most_visited_lab || '—',
          lastSessionDate: s.last_session_date ? new Date(s.last_session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
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
      
      const transformed = rawData.map(s => {
        // Calculate duration if not provided by backend or if we want a nice string
        let durationStr = s.duration;
        if (!durationStr && s.duration_minutes) {
          const mins = parseInt(s.duration_minutes);
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          durationStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
        }

        return {
          id: s.id || s.log_id,
          date: new Date(s.time_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lab_name: s.lab_name,
          purpose: s.purpose,
          status: s.status,
          start_time: new Date(s.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          end_time: s.time_out ? new Date(s.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          duration: durationStr,
          duration_minutes: s.duration_minutes || 0,
          studentRating: s.student_rating,
          studentComment: s.student_comment,
          adminRemark: s.admin_remark,
          adminName: s.admin_name || 'Lab Supervisor'
        };
      });

      setSessions(transformed);
    } catch (err) {
      toast.error('Failed to load your history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFeedback = (session) => {
    setSelectedFeedback({
      adminRemark: session.adminRemark,
      studentRating: session.studentRating,
      studentComment: session.studentComment,
      date: session.date,
      adminName: session.adminName
    });
    setIsViewModalOpen(true);
  };

  const handleOpenEntry = (session) => {
    setSelectedSessionId(session.id);
    setInitialFeedback({
      rating: session.studentRating || 0,
      comment: session.studentComment || ''
    });
    setIsEntryModalOpen(true);
  };

  const handleSubmitFeedback = async (payload) => {
    try {
      await sitinService.submitStudentFeedback(payload);
      fetchHistory(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-20">
      
      {/* ───── HERO SECTION ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary border border-border shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-sand/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <Link 
                to="/student/dashboard" 
                className="inline-flex items-center gap-2 text-[9px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors uppercase tracking-[0.2em]"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                 Activity Journal
              </h1>
              <p className="text-primary-light/80 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
                A comprehensive log of your laboratory usage, hours, and administrative feedback.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="w-14 h-14 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                 <History className="h-7 w-7 text-brand-sand" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
           <div className="relative">
             <div className="w-12 h-12 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
             <Clock className="h-5 w-5 text-primary-hover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
           </div>
           <div className="text-center space-y-1">
             <p className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Retrieving Logs</p>
             <p className="text-[10px] text-primary-light font-medium uppercase tracking-widest">Compiling your history...</p>
           </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <UsageStats stats={stats} />
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
               <h3 className="text-[10px] font-black tracking-[0.15em] uppercase text-primary-light">
                  Detailed Session History
               </h3>
               <div className="flex items-center gap-2.5 text-primary-light">
                <div className="h-px w-6 bg-border" />
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
                  {sessions.length} Records
                </span>
              </div>
            </div>
            <SessionTable 
              sessions={sessions} 
              onOpenFeedback={handleOpenFeedback} 
              onOpenEntry={handleOpenEntry}
            />
          </div>
        </div>
      )}

      <FeedbackViewModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        feedback={selectedFeedback} 
      />

      <StudentFeedbackModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        recordId={selectedSessionId}
        initialRating={initialFeedback.rating}
        initialComment={initialFeedback.comment}
      />

      {/* ───── FOOTER INFO ───── */}
      {!isLoading && (
        <div className="mt-12 flex flex-col items-center">
           <div className="h-1 w-10 bg-brand-sand/30 rounded-full mb-5" />
           <p className="text-[9px] font-bold text-primary-light uppercase tracking-[0.2em] text-center leading-loose">
             CCS Sit-In Monitoring <br /> 
             <span className="text-primary/40">University Of Cebu - CCS Lab Management</span>
           </p>
        </div>
      )}
    </div>
  );
}
