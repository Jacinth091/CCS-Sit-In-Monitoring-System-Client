import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import sitinService from '../../services/sitin.service';
import UsageStats from '../../components/student-history/UsageStats';
import SessionTable from '../../components/student-history/SessionTable';
import FeedbackViewModal from '../../components/student-history/FeedbackViewModal';
import StudentFeedbackModal from '../../components/modals/StudentFeedbackModal';
import { Loader2, ArrowLeft, History, Clock, FlaskConical, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { formatDate, formatDuration, formatTime } from '../../utils/dateUtils';
import Pagination from '../../components/ui/Pagination';

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

  // Pagination & View Mode state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewMode, setViewMode] = useState('card');

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalHours: '0h 0m',
    mostVisitedLab: '—',
    lastSessionDate: '—',
    avgDuration: '—',
    longestSession: '—'
  });

  useEffect(() => {
    if (user?.student_id) {
      fetchHistory();
    }
  }, [user, currentPage]);

  useEffect(() => {
    if (user?.student_id) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await sitinService.getStats(user.student_id);
      if (res.status === 'success') {
        const s = res.data;
        
        // Use central utility for duration formatting
        let displayDuration = '0h 0m';
        if (s.total_duration) {
           displayDuration = s.total_duration;
        } else if (s.total_minutes !== undefined) {
           displayDuration = formatDuration(s.total_minutes);
        } else if (s.total_hours !== undefined) {
           displayDuration = formatDuration(Math.round(parseFloat(s.total_hours) * 60));
        }

        setStats({
          totalSessions: s.total_sessions || 0,
          totalHours: displayDuration,
          mostVisitedLab: s.most_visited_lab || '—',
          lastSessionDate: formatDate(s.last_session_date),
          avgDuration: s.avg_duration || '—',
          longestSession: s.longest_duration || '—'
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await sitinService.getHistoryByStudent(user.student_id, {
        page: currentPage,
        per_page: 8
      });
      const rawData = res.data || [];
      const meta = res.meta || {};

      setTotalPages(meta.last_page || 1);
      setTotalRecords(meta.total || 0);
      
      const transformed = rawData.map(s => {
        // Use central utility for duration if we have minutes
        let durationStr = s.duration;
        if (!durationStr && s.duration_minutes) {
          durationStr = formatDuration(s.duration_minutes);
        }

        return {
          id: s.id || s.log_id,
          date: formatDate(s.time_in),
          name: s.name,
          lab_code: s.lab_code,
          pc_number: s.pc_number,
          purpose: s.purpose,
          status: s.status,
          start_time: formatTime(s.time_in),
          end_time: s.time_out ? formatTime(s.time_out) : null,
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
      <div className="relative overflow-hidden rounded-xl bg-primary hero-banner border border-border shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-sand/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <Link 
                to="/student/dashboard" 
                className="inline-flex items-center gap-2 text-[9px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                 Activity Journal
              </h1>
              <p className="text-primary-light/80 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
                A comprehensive log of your laboratory usage, hours, and administrative feedback.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="w-11 h-11 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                 <History className="h-5 w-5 text-brand-sand" />
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
             <p className="text-xs font-bold text-primary">Retrieving Logs</p>
             <p className="text-[10px] text-primary-light font-medium">Compiling your history...</p>
           </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <UsageStats stats={stats} />
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
               <h3 className="text-[10px] font-bold text-primary-light">
                  Detailed Session History
               </h3>
               <div className="flex items-center gap-4 text-primary-light">
                 {/* View Mode Toggle */}
                 <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-lg border border-border">
                   <button
                     onClick={() => setViewMode('card')}
                     className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'card' ? 'bg-white text-primary shadow-sm border border-border/30' : 'text-primary-light/60 hover:text-primary'}`}
                     title="Card View"
                   >
                     <LayoutGrid className="h-3.5 w-3.5" />
                   </button>
                   <button
                     onClick={() => setViewMode('list')}
                     className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-primary shadow-sm border border-border/30' : 'text-primary-light/60 hover:text-primary'}`}
                     title="List View"
                   >
                     <List className="h-3.5 w-3.5" />
                   </button>
                 </div>

                 <div className="flex items-center gap-2.5">
                   <div className="h-px w-6 bg-border" />
                   <span className="text-[9px] font-bold whitespace-nowrap">
                     {totalRecords} records
                   </span>
                 </div>
               </div>
            </div>
            <SessionTable 
              sessions={sessions} 
              viewMode={viewMode}
              onOpenFeedback={handleOpenFeedback} 
              onOpenEntry={handleOpenEntry}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                <span className="text-[10px] text-primary-light font-bold uppercase tracking-wider">
                  Showing {(currentPage - 1) * 8 + 1}—{Math.min(currentPage * 8, totalRecords)} of {totalRecords} records
                </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
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
           <p className="text-[9px] font-bold text-primary-light text-center leading-loose">
             CCS Sit-In Monitoring <br /> 
             <span className="text-primary/40">University of Cebu - CCS Lab Management</span>
           </p>
        </div>
      )}
    </div>
  );
}
