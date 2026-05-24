import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileType,
  Filter,
  FlaskConical,
  Loader2,
  Search,
  User,
  Sparkles,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import Select from "../../components/ui/Select";
import labService from "../../services/lab.service";
import reportService from "../../services/report.service";
import aiService from "../../services/ai.service";
import { formatDate, formatDuration, formatTime } from "../../utils/dateUtils";

export default function AdminReports() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    lab_id: "",
    purpose: "",
    student_id: "",
  });
  const [labs, setLabs] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadRef = useRef(null);

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleSummarize = async () => {
    if (!reports || reports.length === 0) return;
    setSummaryLoading(true);
    try {
      const res = await aiService.summarizeReport(reports);
      if (res.status === "success" && res.data) {
        setSummary(res.data);
      } else {
        throw new Error(res.message || "Failed to generate report summary");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "AI report summary could not be compiled.";
      toast.error(msg);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();

    function handleClickOutside(event) {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLabs = async () => {
    try {
      const result = await labService.getAll();
      const labsData = result.data || (Array.isArray(result) ? result : []);
      setLabs(labsData);
    } catch (err) {
      toast.error("Failed to load laboratories");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset page on filter change
  };

  const generateReport = async (page = 1, silent = false) => {
    const validPage = Math.max(1, parseInt(page) || 1);
    setLoading(true);
    try {
      const result = await reportService.generate(filters, validPage, 20);
      console.log("Full API result:", result);

      if (result.status === "success") {
        const logsData =
          result.data?.records ||
          (Array.isArray(result.data) ? result.data : []);
        console.log("Processed logs data:", logsData);
        setReports(logsData);
        setSummary(null);

        // Use the new pagination metadata
        const pagination =
          result.data?.pagination || result.pagination || result.meta || null;

        if (pagination) {
          const total = Number(pagination.total_pages) || 1;
          const totalRec = Number(pagination.total) || logsData.length;
          const pg = Number(pagination.page) || validPage;
          console.log("Pagination parsed:", { total, totalRec, pg });
          setTotalPages(total);
          setTotalRecords(totalRec);
          setCurrentPage(pg);
        } else {
          console.warn("No pagination metadata found, defaulting");
          setTotalRecords(logsData.length);
          setTotalPages(1);
          setCurrentPage(1);
        }

        if (!silent) {
          toast.success(result.message || "Report generated");
        }
      } else {
        if (!silent) {
          toast.error(result.message || "Error generating report");
        }
      }
    } catch (err) {
      console.error("Report generation error:", err);
      if (!silent) {
        toast.error(err.customMessage || "Failed to generate report");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    const validPage = Math.max(1, newPage);
    setCurrentPage(validPage);
    generateReport(validPage, true); // Suppress toasts for pagination
  };

  const [downloadLoading, setDownloadLoading] = useState(false);

  const downloadReport = async (type) => {
    setDownloadOpen(false);
    setDownloadLoading(true);
    try {
      await reportService.downloadReport(filters, type);
      toast.success(`${type.toUpperCase()} downloaded successfully`);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error(
        err.customMessage || `Failed to download ${type.toUpperCase()} report`,
      );
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative animate-fade-in">
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">
              Data Insights
            </p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">
              Usage Reports
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setDownloadOpen(!downloadOpen)}
                disabled={!reports || reports.length === 0 || downloadLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-primary-light text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-bg-secondary transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {downloadLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloadLoading ? "Exporting..." : "Export"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`}
                />
              </button>

              {downloadOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-md py-2 z-[100] animate-fade-in-up">
                  <button
                    onClick={() => downloadReport("csv")}
                    className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                    Download as Excel (CSV)
                  </button>
                  <button
                    onClick={() => downloadReport("pdf")}
                    className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
                  >
                    <FileType className="h-4 w-4 text-red-500" />
                    Download as PDF
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={generateReport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* ───── FILTER CONTROL BAR ───── */}
      <Card className="p-5 bg-white border-border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> From Date
            </label>
            <Input
              type="date"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              className="h-10 text-xs font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> To Date
            </label>
            <Input
              type="date"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              className="h-10 text-xs font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <FlaskConical className="h-3 w-3" /> Laboratory
            </label>
            <Select
              name="lab_id"
              value={filters.lab_id}
              onChange={handleFilterChange}
              className="h-10 text-xs font-bold"
            >
              <option value="">All Laboratories</option>
              {Array.isArray(labs) &&
                labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.lab_code ? `${lab.lab_code} - ${lab.name}` : lab.name}
                  </option>
                ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <ClipboardList className="h-3 w-3" /> Purpose
            </label>
            <Input
              placeholder="e.g. Programming"
              name="purpose"
              value={filters.purpose}
              onChange={handleFilterChange}
              className="h-10 text-xs font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <User className="h-3 w-3" /> Student ID
            </label>
            <Input
              placeholder="Search ID..."
              name="student_id"
              value={filters.student_id}
              onChange={handleFilterChange}
              className="h-10 text-xs font-bold"
            />
          </div>
        </div>
      </Card>

      {/* ───── RESULTS TABLE ───── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
            Generation Results
          </h3>
          <div className="flex items-center gap-2.5">
            {reports && reports.length > 0 && (
              <button
                onClick={handleSummarize}
                disabled={summaryLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-50"
              >
                {summaryLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3 animate-pulse text-primary-hover" />
                )}
                {summaryLoading ? "Summarizing..." : "Summarize with AI"}
              </button>
            )}
            {totalRecords > 0 && (
              <span className="px-3 py-1 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
                {totalRecords} Logs Compiled
              </span>
            )}
          </div>
        </div>

        {/* AI Compiled Summary Panel */}
        {summary && (
          <div className="px-6 py-5 bg-gradient-to-br from-primary/5 to-bg-secondary/40 border-b border-border/80 relative animate-fade-in">
            <button 
              onClick={() => setSummary(null)}
              className="absolute top-4 right-4 text-primary-light hover:text-primary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary-hover animate-pulse" />
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  AI Executive Digest
                </h4>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-primary uppercase tracking-tight">
                  {summary.headline}
                </h3>
                <p className="text-[11px] text-primary/80 font-medium leading-relaxed max-w-3xl">
                  {summary.summary}
                </p>
              </div>

              {/* Summary Metrics */}
              {summary.metrics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {summary.metrics.map((m, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/80 p-3 rounded-lg border border-border/50 flex flex-col justify-between"
                    >
                      <span className="text-[8.5px] font-black uppercase tracking-widest text-primary-light">
                        {m.label}
                      </span>
                      <span className="text-lg font-black text-primary my-1 tracking-tight">
                        {m.value}
                      </span>
                      <span className="text-[9px] font-bold text-primary-light lowercase">
                        {m.desc}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border">
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
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/20 mx-auto" />
                  </td>
                </tr>
              ) : reports && reports.length > 0 ? (
                reports.map((log, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-bg-secondary/50 transition-colors group text-sm"
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 overflow-hidden">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-bold text-primary truncate leading-tight tracking-tight">
                            {log.student_name}
                          </p>
                          <p className="text-[9px] font-black text-primary-light uppercase tracking-widest">
                            {log.student_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-primary uppercase tracking-tight">
                          {log.name}
                        </span>
                        {log.lab_code && (
                          <span className="text-[9px] font-bold text-primary-light/60 uppercase">
                            {log.lab_code}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-xs font-black text-primary bg-bg-secondary px-2 py-1 rounded-lg border border-border">
                        PC-{String(log.pc_number || "??").padStart(2, "0")}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                        {formatDate(log.date)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        {formatTime(log.time_in || log.time_in_timestamp)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        {formatTime(log.time_out || log.time_out_timestamp)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-xs font-black text-primary bg-bg-secondary px-2 py-1 rounded-lg border border-border">
                        {formatDuration(log.duration_minutes)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center font-bold text-primary-light italic opacity-80">
                      {log.purpose}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          log.status === "completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-40 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Filter className="h-12 w-12 text-primary-light" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Define criteria to extract data
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* PAGINATION ROW - INSIDE CARD */}
      {reports && reports.length > 0 && (
        <div className="px-6 py-3 border-t border-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-primary-light font-black uppercase tracking-widest order-2 sm:order-1">
            Showing {(currentPage - 1) * 20 + 1}—
            {Math.min(currentPage * 20, totalRecords)} of {totalRecords} logs
          </span>
          <div className="flex-shrink-0">
            <Pagination
              currentPage={currentPage || 1}
              totalPages={totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
