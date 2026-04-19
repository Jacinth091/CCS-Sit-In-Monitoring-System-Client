import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MessageSquarePlus, Loader2, FlaskConical,
  User, History, MessageCircle, ArrowUpRight, Clock,
  Calendar, MapPin, Activity, Database, ClipboardList, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import SitInMetricCards from '../../components/sit-in/SitInMetricCards';
import FeedbackModal from '../../components/modals/FeedbackModal';
import sitinService from '../../services/sitin.service';
import { toast } from 'sonner';
import { SITIN_PURPOSES } from '../../constants/app.constants';

export default function SitInHistory() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        search: searchQuery.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        date: dateFilter || undefined,
        purpose: (purposeFilter !== 'all' && purposeFilter !== 'Other') ? purposeFilter : undefined
      };
      const res = await sitinService.getAllRecords(params);
      let recordsArray = res.data?.records || [];
      const meta = res.data?.meta || {};

      if (purposeFilter === 'Other') {
        const predefined = SITIN_PURPOSES.filter(p => p !== 'Other');
        recordsArray = recordsArray.filter(r => !predefined.includes(r.purpose));
      }

      setRecords(recordsArray);
      setTotalPages(meta.last_page || 1);
      setTotalRecords(meta.total || 0);
    } catch (err) { toast.error('Failed to load history.'); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, [currentPage, searchQuery, statusFilter, dateFilter, purposeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, purposeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('');
    setPurposeFilter('all');
    setCurrentPage(1);
  };

  const computeStats = () => {
    // Note: Stats are now only based on the CURRENT PAGE. 
    // In a real app, you'd want a separate /stats endpoint for total overview.
    const total = records.length;
    const ongoing = records.filter(r => r.status?.toLowerCase() === 'ongoing').length;
    let totalMinutes = 0;
    records.forEach(r => { if (r.time_in && r.time_out) { totalMinutes += Math.floor((new Date(r.time_out) - new Date(r.time_in)) / 60000); } });
    const avgMinutes = total > 0 ? Math.floor(totalMinutes / total) : 0;
    const labCounts = records.reduce((acc, r) => { acc[r.lab_name] = (acc[r.lab_name] || 0) + 1; return acc; }, {});
    const mostUsedLab = Object.entries(labCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    return { totalRecords: totalRecords, activeNow: ongoing, avgDuration: `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`, mostUsedLab, totalDuration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` };
  };

  const handleOpenFeedback = (record) => {
    setSelectedRecord({ id: record.id, name: `${record.first_name} ${record.last_name}`, studentId: record.student_id, existingRemark: record.admin_remark, studentRating: record.student_rating, studentComment: record.student_comment });
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (recordId, text) => {
    try { await sitinService.submitFeedback({ log_id: recordId, feedback: text }); toast.success('Feedback saved!'); fetchRecords(); } catch (err) { toast.error('Failed to save feedback.'); throw err; }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative">
      <div className="relative overflow-hidden rounded-xl bg-primary border border-border shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-light/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-sand/5 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-xl bg-primary flex items-center justify-center border-2 border-primary relative overflow-hidden">
                  <History className="h-8 w-8 text-brand-sand relative z-10" />
                  <div className="absolute inset-0 bg-primary-hover/20" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-brand-sand uppercase tracking-[0.2em]">History & Feedback</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none">Sit-in History</h1>
                <p className="text-xs font-bold text-primary-light/80 max-w-md leading-relaxed">Review laboratory sit-in history and student feedback entries.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Feedback Rate', val: `${records.length > 0 ? Math.round((records.filter(r => r.admin_remark).length / records.length) * 100) : 0}%`, icon: MessageCircle, color: 'text-amber-400' },
                { label: 'Total Logs', val: records.length, icon: ClipboardList, color: 'text-brand-sand' }
              ].map((st, i) => (
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

      <SitInMetricCards stats={computeStats()} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/40" /><input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-5 py-3 rounded-xl border border-border bg-white text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" /></div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-primary-light" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>

          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-primary-light" />
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent outline-none cursor-pointer"
            />
          </div>

          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Database className="h-3.5 w-3.5 text-primary-light" />
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

          {(searchQuery || statusFilter !== 'all' || dateFilter || purposeFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="p-3 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-[10px] font-black text-primary-light uppercase tracking-widest">
            {totalRecords} Entries
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">ID Number</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Student Name</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Purpose</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Lab Number</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Sit-In Start</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Sit-In End</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (<tr><td colSpan="7" className="py-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary/20" /></td></tr>) : records.length === 0 ? (<tr><td colSpan="7" className="py-32 text-center text-sm text-primary-light font-bold uppercase opacity-40">No records found.</td></tr>) : (
                records.map(record => (
                  <tr key={record.id} className="hover:bg-bg-secondary/50 transition-colors group text-sm">
                    <td className="py-3 px-6 font-mono text-primary-hover/60 font-bold">{record.student_id}</td>
                    <td className="py-3 px-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">{record.profile_pic ? <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${record.profile_pic}`} alt="" className="w-full h-full object-cover rounded-md" /> : <User className="h-4 w-4 text-primary" />}</div><span className="font-bold text-primary">{record.first_name} {record.last_name}</span></div></td>
                    <td className="py-3 px-6 text-primary-light max-w-[150px] truncate">{record.purpose}</td>
                    <td className="py-3 px-6 text-center font-bold text-primary-hover">{record.lab_name}</td>
                    <td className="py-3 px-6 text-center"><span className="font-black text-primary text-[11px]">{new Date(record.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><p className="text-[9px] font-bold text-primary-light uppercase">{new Date(record.time_in).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p></td>
                    <td className="py-3 px-6 text-center">{record.time_out ? (<><span className="font-black text-primary text-[11px]">{new Date(record.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><p className="text-[9px] font-bold text-primary-light uppercase">{new Date(record.time_out).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p></>) : (<span className="text-[10px] text-emerald-500 font-bold italic">Ongoing</span>)}</td>
                    <td className="py-3 px-6 text-right"><button onClick={() => handleOpenFeedback(record)} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all shadow-sm ${record.admin_remark ? 'bg-primary text-white border-primary' : 'bg-white border-border text-primary hover:bg-bg-secondary'}`}><MessageSquarePlus className="h-3.5 w-3.5" /> {record.admin_remark ? 'View' : 'Add'}</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && records.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] text-primary-light font-black uppercase tracking-widest order-2 sm:order-1">
              Showing {(currentPage - 1) * itemsPerPage + 1}—{(currentPage - 1) * itemsPerPage + records.length} of {totalRecords} logs
            </span>
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-primary hover:bg-white border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let start = Math.max(1, currentPage - 2);
                  let end = Math.min(totalPages, start + maxVisible - 1);

                  if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1);
                  }

                  if (start > 1) {
                    pages.push(
                      <button key={1} onClick={() => setCurrentPage(1)} className="w-8 h-8 rounded-lg text-[10px] font-black transition-all hover:bg-white border border-transparent hover:border-border text-primary-light">1</button>
                    );
                    if (start > 2) pages.push(<span key="sep1" className="text-primary-light/30 px-1">...</span>);
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-primary-light border-border hover:border-primary/30 hover:text-primary'
                          }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push(<span key="sep2" className="text-primary-light/30 px-1">...</span>);
                    pages.push(
                      <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="w-8 h-8 rounded-lg text-[10px] font-black transition-all hover:bg-white border border-transparent hover:border-border text-primary-light">{totalPages}</button>
                    );
                  }

                  return pages;
                })()}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-primary hover:bg-white border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} onSubmit={handleFeedbackSubmit} studentName={selectedRecord?.name} idNumber={selectedRecord?.studentId} recordId={selectedRecord?.id} initialRemark={selectedRecord?.existingRemark} studentRating={selectedRecord?.studentRating} studentComment={selectedRecord?.studentComment} />
    </div>
  );
}
