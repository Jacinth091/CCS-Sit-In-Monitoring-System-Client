import React, { useState, useEffect } from 'react';
import {
  Search, Loader2, User, Clock, X, ChevronLeft, ChevronRight,
  Filter, Calendar, FlaskConical, CheckCircle2, TimerReset,
  Copy, History, Database, ArrowUpRight, Hash, Activity, ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';
import sitinService from '../../services/sitin.service';
import { SITIN_PURPOSES } from '../../constants/app.constants';

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function calcDuration(timeIn, timeOut) {
  if (!timeIn || !timeOut) return null;
  const diff = Math.floor((new Date(timeOut) - new Date(timeIn)) / 60000);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function StatusBadge({ status }) {
  const isOngoing = status?.toLowerCase() === 'ongoing';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isOngoing
      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      : 'bg-primary/5 text-primary-light border border-primary/10'
      }`}>
      {status}
    </span>
  );
}

function RecordDetailModal({ record, onClose }) {
  if (!record) return null;
  const duration = calcDuration(record.time_in, record.time_out);

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border">
        <div className="px-5 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-primary tracking-tight">Log Details</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest opacity-60">ID: {record.log_id.slice(0, 18)}...</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(record.log_id);
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
                {record.profile_pic ? <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${record.profile_pic}`} alt="" className="w-full h-full object-cover" /> : <User className="h-6 w-6 text-primary" />}
              </div>
            </div>
            <div>
              <p className="text-lg font-black text-primary tracking-tighter leading-none">{record.first_name} {record.last_name}</p>
              <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mt-1.5">{record.student_id} • {record.course}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-bg-secondary/10">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Laboratory</p>
              <p className="text-xs font-black text-primary uppercase">{record.lab_name || '—'}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Status</p>
              <StatusBadge status={record.status} />
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Authorization</p>
              <p className="text-xs font-black text-primary">{formatTime(record.time_in)}</p>
              <p className="text-[9px] font-bold text-primary-light/40 uppercase mt-0.5">{formatDate(record.time_in)}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Termination</p>
              <p className="text-xs font-black text-primary">{record.time_out ? formatTime(record.time_out) : 'Active'}</p>
              <p className="text-[9px] font-bold text-primary-light/40 uppercase mt-0.5">{record.time_out ? formatDate(record.time_out) : 'Ongoing'}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
            <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">Purpose</p>
            <p className="text-xs font-bold text-primary uppercase">{record.purpose || '—'}</p>
          </div>
          {duration && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
              <Clock className="h-3.5 w-3.5 text-primary-hover" />
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">Logged Duration: <span className="text-primary-hover">{duration}</span></p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 bg-bg-secondary border-t border-border flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-[10px] font-black uppercase text-primary-light hover:text-primary transition-all">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function SitInRecords() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
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
        // If purpose is 'Other', we might need to handle it specially on server.
        // For now, we only send exact matches for predefined purposes.
        purpose: (purposeFilter !== 'all' && purposeFilter !== 'Other') ? purposeFilter : undefined
      };

      const res = await sitinService.getAllRecords(params);
      let recordsArray = res.data?.records || [];
      const meta = res.data?.meta || {};

      // If purposeFilter is 'Other', we need to client-side filter for now
      // OR we fetch all and filter. But since we want server-side pagination, 
      // the best way is to support 'Other' in backend.
      // FOR NOW: If 'Other', we'll filter the results we got, but this is still partial.
      // Let's assume most purposes are predefined.
      if (purposeFilter === 'Other') {
        const predefined = SITIN_PURPOSES.filter(p => p !== 'Other');
        recordsArray = recordsArray.filter(r => !predefined.includes(r.purpose));
      }

      setRecords(recordsArray);
      setTotalPages(meta.last_page || 1);
      setTotalRecords(meta.total || 0);
    } catch (err) { 
      toast.error('Failed to load records.'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { 
    fetchRecords(); 
  }, [currentPage, searchQuery, statusFilter, dateFilter, purposeFilter]);

  // Reset to page 1 when filters change
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
                  <Database className="h-8 w-8 text-brand-sand relative z-10" />
                  <div className="absolute inset-0 bg-primary-hover/20" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-brand-sand uppercase tracking-[0.2em]">Archival Logs</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none">Sit-in Records</h1>
                <p className="text-xs font-bold text-primary-light/80 max-w-md leading-relaxed">Full history of all laboratory sit-in sessions. Use filters to find specific logs.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Total Logs', val: records.length, icon: ClipboardList, color: 'text-brand-sand' },
                { label: 'Completed', val: records.filter(r => r.status?.toLowerCase() === 'completed').length, icon: CheckCircle2, color: 'text-emerald-400' }
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[400px] group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/40" /><input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-5 py-3 rounded-xl border border-border bg-white text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all" /></div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm"><Filter className="h-3.5 w-3.5 text-primary-light" /><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent outline-none cursor-pointer"><option value="all">All Status</option><option value="completed">Completed</option><option value="ongoing">Ongoing</option></select></div>
          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm"><Calendar className="h-3.5 w-3.5 text-primary-light" /><input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent outline-none cursor-pointer" /></div>
          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <ClipboardList className="h-3.5 w-3.5 text-primary-light" />
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
          {(searchQuery || statusFilter !== 'all' || dateFilter || purposeFilter !== 'all') && (<button onClick={clearFilters} className="p-3 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all cursor-pointer"><X className="h-4 w-4" /></button>)}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border whitespace-nowrap">
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">#</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Student</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Purpose</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Laboratory</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Time In</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Time Out</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Duration</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Status</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (<tr><td colSpan="9" className="py-32 text-center"><Loader2 className="h-8 w-8 animate-spin text-primary/20 mx-auto" /></td></tr>) : records.length === 0 ? (<tr><td colSpan="9" className="py-32 text-center text-sm text-primary-light font-bold uppercase opacity-40">No matching logs.</td></tr>) : (
                records.map((record, index) => {
                  const duration = calcDuration(record.time_in, record.time_out);
                  const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
                  return (<tr key={`${record.log_id || 'rec'}-${index}`} className="hover:bg-bg-secondary/50 transition-colors group text-sm"><td className="py-3 px-6 font-bold text-primary-light/40">{displayIndex}</td><td className="py-3 px-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">{record.profile_pic ? <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${record.profile_pic}`} alt="" className="w-full h-full object-cover rounded-md" /> : <User className="h-4 w-4 text-primary" />}</div><span className="font-bold text-primary">{record.first_name} {record.last_name}</span></div></td><td className="py-3 px-6 text-primary-light max-w-[150px] truncate">{record.purpose}</td><td className="py-3 px-6 text-center font-bold text-primary-hover">{record.lab_name}</td><td className="py-3 px-6 text-center"><p className="font-bold text-primary">{formatTime(record.time_in)}</p><p className="text-[9px] text-primary-light uppercase font-bold">{formatDate(record.time_in)}</p></td><td className="py-3 px-6 text-center">{record.time_out ? (<><p className="font-bold text-primary">{formatTime(record.time_out)}</p><p className="text-[9px] text-primary-light uppercase font-bold">{formatDate(record.time_out)}</p></>) : (<span className="text-[10px] text-primary-light font-bold italic">Ongoing</span>)}</td><td className="py-3 px-6 text-center">{duration ? (<span className="bg-brand-sand/10 border border-brand-sand/20 px-2 py-1 rounded text-[10px] font-black">{duration}</span>) : '—'}</td><td className="py-3 px-6 text-center"><StatusBadge status={record.status} /></td><td className="py-3 px-6 text-right"><button onClick={() => setSelectedRecord(record)} className="px-4 py-1.5 rounded-lg border border-border text-[10px] font-black uppercase text-primary hover:bg-bg-secondary transition-all shadow-sm">Details</button></td></tr>);
                })
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
      {selectedRecord && <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
}
