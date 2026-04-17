import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, Clock, X, ChevronLeft, ChevronRight, Filter, Calendar, FlaskConical, CheckCircle2, TimerReset, Copy } from 'lucide-react';
import { toast } from 'sonner';
import sitinService from '../../services/sitin.service';

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
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOngoing
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-[#EAD8B1]/30 text-[#001F3F]/60'
      }`}>
      {isOngoing
        ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
        : <CheckCircle2 className="h-3 w-3" />
      }
      {status}
    </span>
  );
}

function RecordDetailModal({ record, onClose }) {
  if (!record) return null;

  const duration = calcDuration(record.time_in, record.time_out);

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#6A9AB0]/15 bg-[#EAD8B1]/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#001F3F]">Sit-In Record</h3>
            {/* Copyable UUID */}
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-xs font-mono text-[#3A6D8C] truncate max-w-[260px]">
                {record.log_id}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(record.log_id);
                  toast.success('Record ID copied!');
                }}
                className="shrink-0 text-[#6A9AB0] hover:text-[#3A6D8C] transition-colors cursor-pointer"
                title="Copy full ID"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Student Info */}
        <div className="px-6 py-5 border-b border-[#6A9AB0]/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center shrink-0 overflow-hidden">
              {record.profile_pic ? (
                <img
                  src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${record.profile_pic}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-[#3A6D8C]" />
              )}
            </div>
            <div>
              <p className="text-base font-extrabold text-[#001F3F]">
                {record.first_name} {record.last_name}
              </p>
              <p className="text-xs font-semibold text-[#3A6D8C]">{record.student_id}</p>
              <p className="text-xs text-[#6A9AB0] mt-1 leading-tight">
                {record.course}
              </p>
              <p className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-wider mt-0.5">
                {record.course_level}
              </p>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Laboratory</p>
              <p className="text-sm font-bold text-[#3A6D8C]">{record.lab_name || '—'}</p>
            </div>

            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Status</p>
              <StatusBadge status={record.status} />
            </div>

            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Time In</p>
              <p className="text-sm font-bold text-[#001F3F]">{formatTime(record.time_in)}</p>
              <p className="text-[10px] text-[#6A9AB0] mt-0.5">{formatDate(record.time_in)}</p>
            </div>

            <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Time Out</p>
              <p className="text-sm font-bold text-[#001F3F]">{formatTime(record.time_out)}</p>
              <p className="text-[10px] text-[#6A9AB0] mt-0.5">{record.time_out ? formatDate(record.time_out) : 'Still ongoing'}</p>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-[#EAD8B1]/10 rounded-xl p-3 border border-[#EAD8B1]/30">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-1">Purpose</p>
            <p className="text-sm font-semibold text-[#001F3F]">{record.purpose || '—'}</p>
          </div>

          {/* Duration */}
          {duration && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#3A6D8C]/5 rounded-xl border border-[#3A6D8C]/10">
              <Clock className="h-4 w-4 text-[#3A6D8C] shrink-0" />
              <p className="text-xs text-[#001F3F]">
                Session lasted <span className="font-bold text-[#3A6D8C]">{duration}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EAD8B1]/10 border-t border-[#6A9AB0]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-[#6A9AB0]/30 text-sm font-bold text-[#001F3F] hover:bg-[#EAD8B1]/25 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SitInRecords() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await sitinService.getAllRecords();
      // The API returns { status, message, data: { records: [], meta: {} } }
      const recordsArray = res.data?.records || [];
      setRecords(recordsArray);
      setFiltered(recordsArray);
    } catch (err) {
      toast.error('Failed to load sit-in records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  useEffect(() => {
    let result = [...records];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.student_id?.toLowerCase().includes(q) ||
        r.first_name?.toLowerCase().includes(q) ||
        r.last_name?.toLowerCase().includes(q) ||
        r.lab_name?.toLowerCase().includes(q) ||
        r.purpose?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status?.toLowerCase() === statusFilter);
    }

    if (dateFilter) {
      result = result.filter(r => {
        if (!r.time_in) return false;
        return new Date(r.time_in).toISOString().slice(0, 10) === dateFilter;
      });
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, records]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const totalCount = records.length;
  const completedCount = records.filter(r => r.status?.toLowerCase() === 'completed').length;
  const ongoingCount = records.filter(r => r.status?.toLowerCase() === 'ongoing').length;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFilter;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001F3F]">Sit-In Records</h1>
          <p className="text-sm text-[#6A9AB0]">Full history of all laboratory sit-in sessions.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6A9AB0]" />
          <input
            type="text"
            placeholder="Search name, ID, lab, purpose..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#6A9AB0]/20 bg-white text-sm text-[#001F3F] placeholder:text-[#6A9AB0]/40 focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] transition"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#3A6D8C]/10 flex items-center justify-center shrink-0">
            <FlaskConical className="h-5 w-5 text-[#3A6D8C]" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50">Total Records</p>
            <p className="text-2xl font-extrabold text-[#001F3F] leading-tight">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50">Completed</p>
            <p className="text-2xl font-extrabold text-[#001F3F] leading-tight">{completedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#EAD8B1]/30 flex items-center justify-center shrink-0">
            <TimerReset className="h-5 w-5 text-[#3A6D8C]" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50">Ongoing</p>
            <p className="text-2xl font-extrabold text-[#001F3F] leading-tight">{ongoingCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-white border border-[#6A9AB0]/20 rounded-lg px-3 py-2">
          <Filter className="h-3.5 w-3.5 text-[#6A9AB0]" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm text-[#001F3F] font-medium bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#6A9AB0]/20 rounded-lg px-3 py-2">
          <Calendar className="h-3.5 w-3.5 text-[#6A9AB0]" />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="text-sm text-[#001F3F] font-medium bg-transparent focus:outline-none cursor-pointer"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        )}

        {hasActiveFilters && !isLoading && (
          <span className="text-xs text-[#6A9AB0] font-medium ml-auto">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EAD8B1]/10 border-b border-[#6A9AB0]/15 whitespace-nowrap">
                {/* # instead of Record ID */}
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">#</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Student</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Purpose</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Laboratory</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Time In</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Time Out</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60 text-center">Duration</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6A9AB0]/10">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#3A6D8C] mx-auto" />
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FlaskConical className="h-8 w-8 text-[#6A9AB0]/30" />
                      <p className="text-sm text-[#6A9AB0]/60 italic">No records found.</p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-1 text-xs text-[#3A6D8C] font-bold underline underline-offset-2 cursor-pointer"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // ↓ index added here
                currentRows.map((record, index) => {
                  const duration = calcDuration(record.time_in, record.time_out);
                  return (
                    <tr key={`${record.log_id || 'rec'}-${index}`} className="hover:bg-[#EAD8B1]/5 transition-colors group text-sm">

                      {/* Row number — clean, no UUID clutter */}
                      <td className="py-3 px-6 font-mono text-[#3A6D8C] font-semibold text-sm whitespace-nowrap">
                        #{indexOfFirst + index + 1}
                      </td>

                      {/* Student */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {record.profile_pic ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${record.profile_pic}`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-[#3A6D8C]" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#001F3F]">{record.first_name} {record.last_name}</p>
                            <p className="text-[11px] text-[#6A9AB0] font-medium">{record.student_id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Purpose */}
                      <td className="py-3 px-6 text-[#6A9AB0] whitespace-nowrap max-w-[180px] truncate">
                        {record.purpose || '—'}
                      </td>

                      {/* Lab */}
                      <td className="py-3 px-6 font-bold text-[#3A6D8C] whitespace-nowrap">
                        {record.lab_name || '—'}
                      </td>

                      {/* Time In */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        <p className="font-semibold text-[#001F3F]">{formatTime(record.time_in)}</p>
                        <p className="text-[10px] text-[#6A9AB0] font-medium">{formatDate(record.time_in)}</p>
                      </td>

                      {/* Time Out */}
                      <td className="py-3 px-6 whitespace-nowrap">
                        {record.time_out ? (
                          <>
                            <p className="font-semibold text-[#001F3F]">{formatTime(record.time_out)}</p>
                            <p className="text-[10px] text-[#6A9AB0] font-medium">{formatDate(record.time_out)}</p>
                          </>
                        ) : (
                          <span className="text-xs text-[#6A9AB0]/50 italic">In progress</span>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-6 text-center">
                        {duration ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAD8B1]/20 text-[#001F3F]">
                            <Clock className="h-3 w-3" />
                            {duration}
                          </span>
                        ) : (
                          <span className="text-xs text-[#6A9AB0]/40">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-6">
                        <StatusBadge status={record.status} />
                      </td>

                      {/* View Details */}
                      <td className="py-3 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#6A9AB0]/20 text-[#3A6D8C] text-[11px] font-bold uppercase tracking-wider hover:bg-[#3A6D8C] hover:text-white hover:border-[#3A6D8C] transition-colors cursor-pointer"
                        >
                          View
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-[#6A9AB0]/15 bg-[#EAD8B1]/5 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-[#6A9AB0] font-medium">
              Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filtered.length)} of {filtered.length} records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold text-[#001F3F] bg-white border border-[#6A9AB0]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EAD8B1]/30 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-[#6A9AB0]">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors cursor-pointer ${currentPage === item
                            ? 'bg-[#3A6D8C] text-white'
                            : 'bg-white border border-[#6A9AB0]/20 text-[#001F3F] hover:bg-[#EAD8B1]/30'
                          }`}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold text-[#001F3F] bg-white border border-[#6A9AB0]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EAD8B1]/30 transition-colors cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}