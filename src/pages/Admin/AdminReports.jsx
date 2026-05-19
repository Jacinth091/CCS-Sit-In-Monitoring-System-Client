import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Filter, Search, Calendar, FlaskConical, ClipboardList, User, Loader2, ChevronDown, FileJson, FileType } from 'lucide-react';
import { toast } from 'sonner';
import reportService from '../../services/report.service';
import labService from '../../services/lab.service';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function AdminReports() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    lab_id: '',
    purpose: '',
    student_id: ''
  });
  const [labs, setLabs] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadRef = useRef(null);

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
      toast.error('Failed to load laboratories');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const result = await reportService.generate(filters);
      if (result.status === 'success') {
        // Handle both result.data.logs (Module A standard) and result.data (current response)
        const logsData = result.data?.logs || (Array.isArray(result.data) ? result.data : []);
        setReports(logsData);
        
        // Handle metadata from various potential locations
        const total = result.meta?.total_records || result.data?.meta?.total_records || logsData.length;
        setTotalRecords(total);
        
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Report generation error:", err);
      toast.error(err.customMessage || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const [downloadLoading, setDownloadLoading] = useState(false);

  const downloadReport = async (type) => {
    setDownloadOpen(false);
    setDownloadLoading(true);
    try {
      await reportService.downloadReport(filters, type);
      toast.success(`${type.toUpperCase()} downloaded successfully`);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error(err.customMessage || `Failed to download ${type.toUpperCase()} report`);
    } finally {
      setDownloadLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative animate-fade-in">
      
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">Data Insights</p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">Usage Reports</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setDownloadOpen(!downloadOpen)}
                disabled={!reports || reports.length === 0 || downloadLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-primary-light text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-bg-secondary transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {downloadLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {downloadLoading ? 'Exporting...' : 'Export'}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${downloadOpen ? 'rotate-180' : ''}`} />
              </button>

              {downloadOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-border rounded-xl shadow-md py-2 z-[100] animate-fade-in-up">
                  <button
                    onClick={() => downloadReport('csv')}
                    className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
                  >
                    <FileJson className="h-4 w-4 text-emerald-500" />
                    Download as CSV
                  </button>
                  <button
                    onClick={() => downloadReport('pdf')}
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
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
            <Input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="h-10 text-xs font-bold" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> To Date
            </label>
            <Input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="h-10 text-xs font-bold" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <FlaskConical className="h-3 w-3" /> Laboratory
            </label>
            <Select name="lab_id" value={filters.lab_id} onChange={handleFilterChange} className="h-10 text-xs font-bold">
              <option value="">All Laboratories</option>
              {Array.isArray(labs) && labs.map(lab => (
                <option key={lab.id} value={lab.id}>{lab.lab_code ? `${lab.lab_code} - ${lab.name}` : lab.name}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <ClipboardList className="h-3 w-3" /> Purpose
            </label>
            <Input placeholder="e.g. Programming" name="purpose" value={filters.purpose} onChange={handleFilterChange} className="h-10 text-xs font-bold" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light ml-1 flex items-center gap-1.5">
              <User className="h-3 w-3" /> Student ID
            </label>
            <Input placeholder="Search ID..." name="student_id" value={filters.student_id} onChange={handleFilterChange} className="h-10 text-xs font-bold" />
          </div>
        </div>
      </Card>

      {/* ───── RESULTS TABLE ───── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
           <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Generation Results</h3>
           {totalRecords > 0 && (
             <span className="px-3 py-1 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
               {totalRecords} Logs Compiled
             </span>
           )}
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Student / Account</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Laboratory</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Purpose</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Schedule</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Duration</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/20 mx-auto" />
                  </td>
                </tr>
              ) : (reports && reports.length > 0) ? (
                reports.map((log, idx) => (
                  <tr key={idx} className="hover:bg-bg-secondary/50 transition-colors group text-sm">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 overflow-hidden">
                           <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-bold text-primary truncate leading-tight tracking-tight">{log.student_name}</p>
                          <p className="text-[9px] font-black text-primary-light uppercase tracking-widest">{log.student_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-brand-sand/10 text-primary text-[10px] font-black uppercase tracking-widest border border-brand-sand/20">
                        {log.name}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center font-bold text-primary-light italic opacity-80">
                      {log.purpose}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex flex-col items-center leading-tight">
                        <p className="text-[11px] font-black text-primary tracking-tighter italic">
                          {new Date(log.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {log.time_out ? new Date(log.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                        </p>
                        <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">
                          {new Date(log.time_in).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                       <span className="text-xs font-black text-primary bg-bg-secondary px-2 py-1 rounded-lg border border-border">
                         {formatDuration(log.duration_minutes)}
                       </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        log.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-40 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Filter className="h-12 w-12 text-primary-light" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Define criteria to extract data</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───── FOOTER INFO ───── */}
      {!loading && (
        <div className="mt-8 flex flex-col items-center opacity-40">
           <div className="h-0.5 w-8 bg-brand-sand/50 rounded-full mb-4" />
           <p className="text-[8px] font-black text-primary-light uppercase tracking-[0.3em] text-center">
             System Report Generator <br /> 
             <span className="opacity-60 text-[7px]">Property of University of Cebu - CCS</span>
           </p>
        </div>
      )}
    </div>
  );
}
