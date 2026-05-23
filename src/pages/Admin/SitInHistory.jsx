import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Database,
  Filter,
  Loader2,
  MessageCircle,
  MessageSquarePlus,
  Search,
  User,
  X,
  Copy,
  Clock,
  MoreVertical,
  Eye,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { ASSET_URL } from "../../config";
import { toast } from "sonner";
import FeedbackModal from "../../components/modals/FeedbackModal";
import SitInMetricCards from "../../components/sit-in/SitInMetricCards";
import { SITIN_PURPOSES } from "../../constants/app.constants";
import sitinService from "../../services/sitin.service";
import { formatDate, formatTime, formatDuration, calcDuration } from "../../utils/dateUtils";

function StatusBadge({ status }) {
  const isOngoing = status?.toLowerCase() === "ongoing";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
        isOngoing
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
          : "bg-primary/5 text-primary-light border border-primary/10"
      }`}
    >
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
            <h3 className="text-lg font-black text-primary tracking-tight">
              Log Details
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest opacity-60">
                ID: {record.log_id?.slice(0, 18) || record.id?.slice(0, 18)}...
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(record.log_id || record.id);
                  toast.success("ID copied!");
                }}
                className="p-1 hover:bg-primary/5 rounded-md text-primary-light hover:text-primary transition-colors cursor-pointer"
                title="Copy Full ID"
              >
                <Copy className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-primary-light hover:text-primary transition-colors border border-transparent hover:border-border cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-6 border-b border-border bg-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-sm">
              <div className="w-full h-full rounded-[0.65rem] bg-white flex items-center justify-center overflow-hidden">
                {record.profile_pic ? (
                  <img
                    src={`${ASSET_URL}/${record.profile_pic}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
            </div>
            <div>
              <p className="text-lg font-black text-primary tracking-tighter leading-none">
                {record.first_name} {record.last_name}
              </p>
              <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mt-1.5">
                {record.student_id} • {record.course}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-bg-secondary/10 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">
                Laboratory
              </p>
              <p className="text-xs font-black text-primary uppercase">
                {record.lab_code ? `${record.lab_code} - ${record.name}` : record.name || "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">
                Status
              </p>
              <StatusBadge status={record.status} />
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">
                Authorization
              </p>
              <p className="text-xs font-black text-primary">
                {formatTime(record.time_in)}
              </p>
              <p className="text-[9px] font-bold text-primary-light/40 uppercase mt-0.5">
                {formatDate(record.time_in)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
              <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">
                Termination
              </p>
              <p className="text-xs font-black text-primary">
                {record.time_out ? formatTime(record.time_out) : "Active"}
              </p>
              <p className="text-[9px] font-bold text-primary-light/40 uppercase mt-0.5">
                {record.time_out ? formatDate(record.time_out) : "Ongoing"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
            <p className="text-[8px] font-black uppercase text-primary-light/60 tracking-widest mb-1">
              Purpose
            </p>
            <p className="text-xs font-bold text-primary uppercase">
              {record.purpose || "—"}
            </p>
          </div>

          {duration && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
              <Clock className="h-3.5 w-3.5 text-primary-hover" />
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                Logged Duration:{" "}
                <span className="text-primary-hover">{duration}</span>
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 bg-bg-secondary border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-[10px] font-black uppercase text-primary-light hover:text-primary transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RowDropdown({ record, onDetails, onFeedback }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-bg-secondary text-primary-light hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
        title="Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-xl shadow-lg z-50 py-1 flex flex-col overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              onDetails(record);
            }}
            className="w-full text-left px-3 py-2 text-[11px] font-bold text-primary hover:bg-bg-secondary flex items-center gap-2 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" /> View Details
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onFeedback(record);
            }}
            className="w-full text-left px-3 py-2 text-[11px] font-bold text-primary hover:bg-bg-secondary flex items-center gap-2 cursor-pointer border-t border-border/50"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" /> Feedback & Remarks
          </button>
        </div>
      )}
    </div>
  );
}

export default function SitInHistory() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRecordForFeedback, setSelectedRecordForFeedback] = useState(null);
  const [selectedRecordForDetails, setSelectedRecordForDetails] = useState(null);
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
        status: statusFilter !== "all" ? statusFilter : undefined,
        date: dateFilter || undefined,
        purpose:
          purposeFilter !== "all" && purposeFilter !== "Other"
            ? purposeFilter
            : undefined,
      };
      const res = await sitinService.getAllRecords(params);
      let recordsArray = res.data?.records || [];
      const meta = res.data?.meta || {};

      if (purposeFilter === "Other") {
        const predefined = SITIN_PURPOSES.filter((p) => p !== "Other");
        recordsArray = recordsArray.filter(
          (r) => !predefined.includes(r.purpose),
        );
      }

      setRecords(recordsArray);
      setTotalPages(meta.last_page || 1);
      setTotalRecords(meta.total || 0);

      // If details modal is open, refresh its data
      if (selectedRecordForDetails) {
        const updatedRecord = recordsArray.find(r => r.id === selectedRecordForDetails.id);
        if (updatedRecord) {
          setSelectedRecordForDetails(updatedRecord);
        }
      }

    } catch (_err) {
      toast.error("Failed to load history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchQuery, statusFilter, dateFilter, purposeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, purposeFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("");
    setPurposeFilter("all");
    setCurrentPage(1);
  };

  const computeStats = () => {
    const total = records.length;
    const ongoing = records.filter(
      (r) => r.status?.toLowerCase() === "ongoing",
    ).length;
    let totalMinutes = 0;
    records.forEach((r) => {
      if (r.time_in && r.time_out) {
        totalMinutes += Math.floor(
          (new Date(r.time_out) - new Date(r.time_in)) / 60000,
        );
      }
    });
    const avgMinutes = total > 0 ? Math.floor(totalMinutes / total) : 0;
    const labCounts = records.reduce((acc, r) => {
      const displayLabel = r.lab_code ? `${r.lab_code} - ${r.name}` : r.name;
      acc[displayLabel] = (acc[displayLabel] || 0) + 1;
      return acc;
    }, {});
    const mostUsedLab =
      Object.entries(labCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    return {
      totalRecords: totalRecords,
      activeNow: ongoing,
      avgDuration: `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`,
      mostUsedLab,
      totalDuration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
    };
  };

  const handleOpenFeedback = (record) => {
    setSelectedRecordForFeedback({
      id: record.id,
      name: `${record.first_name} ${record.last_name}`,
      studentId: record.student_id,
      existingRemark: record.admin_remark,
      studentRating: record.student_rating,
      studentComment: record.student_comment,
    });
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (recordId, text) => {
    try {
      await sitinService.submitFeedback({ log_id: recordId, feedback: text });
      toast.success("Feedback saved!");
      fetchRecords();
    } catch (err) {
      toast.error("Failed to save feedback.");
      throw err;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative animate-fade-in">
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">
              History & Records
            </p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">
              Session History
            </h1>
            <p className="text-[11px] font-bold text-primary-light">
              Review full laboratory sit-in history, duration, and feedback entries.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "Feedback Rate",
                value: `${records.length > 0 ? Math.round((records.filter((r) => r.admin_remark).length / records.length) * 100) : 0}%`,
                icon: MessageCircle,
                color: "text-amber-500",
              },
              {
                label: "Total Logs",
                value: totalRecords,
                icon: ClipboardList,
                color: "text-primary-hover",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-bg-secondary min-w-[140px]"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-primary-light font-black mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-black text-primary tracking-tight">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SitInMetricCards stats={computeStats()} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/40" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-5 py-3 rounded-xl border border-border bg-white text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-primary-light" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent outline-none cursor-pointer"
            />
          </div>

          <div className="bg-white border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Database className="h-3.5 w-3.5 text-primary-light" />
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="text-[10px] font-black text-primary uppercase tracking-widest bg-transparent outline-none cursor-pointer"
            >
              <option value="all">All Purposes</option>
              {SITIN_PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery ||
            statusFilter !== "all" ||
            dateFilter ||
            purposeFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="p-3 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border whitespace-nowrap">
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Student / Account
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Laboratory
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Workstation
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Date
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Time In
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Time Out
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Duration
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Purpose
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Status
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="py-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary/20" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="py-32 text-center text-sm text-primary-light font-bold uppercase opacity-40"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const duration = calcDuration(record.time_in, record.time_out);
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-bg-secondary/50 transition-colors group text-sm"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 relative">
                            <User className="h-4 w-4 text-primary absolute" />
                            {record.profile_pic && (
                              <img
                                src={`${ASSET_URL}/${record.profile_pic}`}
                                alt=""
                                className="w-full h-full object-cover rounded-md relative z-10"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="font-bold text-primary truncate leading-tight tracking-tight">
                              {record.first_name} {record.last_name}
                            </p>
                            <p className="text-[9px] font-black text-primary-light uppercase tracking-widest">
                              {record.student_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-primary uppercase tracking-tight">
                            {record.name}
                          </span>
                          {record.lab_code && (
                            <span className="text-[9px] font-bold text-primary-light/60 uppercase">
                              {record.lab_code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className="text-xs font-black text-primary bg-bg-secondary px-2 py-1 rounded-lg border border-border">
                          PC-{String(record.pc_number || "??").padStart(2, "0")}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                          {formatDate(record.time_in)}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                          {formatTime(record.time_in)}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {record.time_out ? (
                          <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                            {formatTime(record.time_out)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-primary-light font-bold italic">
                            Ongoing
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {duration ? (
                          <span className="text-xs font-black text-primary bg-bg-secondary px-2 py-1 rounded-lg border border-border">
                            {duration}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-6 text-center font-bold text-primary-light italic opacity-80">
                        {record.purpose}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="py-3 px-6 text-right">
                        <RowDropdown
                          record={record}
                          onDetails={setSelectedRecordForDetails}
                          onFeedback={handleOpenFeedback}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && records.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <span className="text-[10px] text-primary-light font-black uppercase tracking-widest order-2 sm:order-1">
              Showing {(currentPage - 1) * itemsPerPage + 1}—
              {Math.min(currentPage * itemsPerPage, totalRecords)} of{" "}
              {totalRecords} logs
            </span>
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-primary hover:bg-white border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
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
                      <button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        className="w-8 h-8 rounded-lg text-[10px] font-black transition-all hover:bg-white border border-transparent hover:border-border text-primary-light cursor-pointer"
                      >
                        1
                      </button>,
                    );
                    if (start > 2)
                      pages.push(
                        <span key="sep1" className="text-primary-light/30 px-1">
                          ...
                        </span>,
                      );
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border cursor-pointer ${
                          currentPage === i
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-primary-light border-border hover:border-primary/30 hover:text-primary"
                        }`}
                      >
                        {i}
                      </button>,
                    );
                  }

                  if (end < totalPages) {
                    if (end < totalPages - 1)
                      pages.push(
                        <span key="sep2" className="text-primary-light/30 px-1">
                          ...
                        </span>,
                      );
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 rounded-lg text-[10px] font-black transition-all hover:bg-white border border-transparent hover:border-border text-primary-light cursor-pointer"
                      >
                        {totalPages}
                      </button>,
                    );
                  }

                  return pages;
                })()}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-primary hover:bg-white border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        studentName={selectedRecordForFeedback?.name}
        idNumber={selectedRecordForFeedback?.studentId}
        recordId={selectedRecordForFeedback?.id}
        initialRemark={selectedRecordForFeedback?.existingRemark}
        studentRating={selectedRecordForFeedback?.studentRating}
        studentComment={selectedRecordForFeedback?.studentComment}
      />

      {selectedRecordForDetails && (
        <RecordDetailModal
          record={selectedRecordForDetails}
          onClose={() => setSelectedRecordForDetails(null)}
        />
      )}
    </div>
  );
}
