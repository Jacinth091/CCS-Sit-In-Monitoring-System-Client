import {
  ArrowLeft,
  FlaskConical,
  Loader2,
  Monitor,
  Package,
  Search,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import Card from "../../components/ui/Card";
import backendAPI from "../../services/backendConnection";
import labService from "../../services/lab.service";
import pcService from "../../services/pc.service";
import softwareService from "../../services/software.service";

export default function StudentSoftware() {
  const [activeTab, setActiveTab] = useState("labs"); // 'labs' | 'software'

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 animate-fade-in">
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
                Lab Inventory & Software
              </h1>
              <p className="text-primary-light/80 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
                Browse our laboratories, installed software, and workstation availability in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="w-11 h-11 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                 <Package className="h-5 w-5 text-brand-sand" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("labs")}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === "labs" ? "bg-primary text-white shadow-md" : "bg-bg-secondary text-primary-light hover:text-primary hover:bg-bg-secondary/70"}`}
          >
            Laboratories
          </button>
          <button
            onClick={() => setActiveTab("software")}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === "software" ? "bg-primary text-white shadow-md" : "bg-bg-secondary text-primary-light hover:text-primary hover:bg-bg-secondary/70"}`}
          >
            Software Catalogue
          </button>
        </div>
      </div>

      {activeTab === "labs" ? <LaboratoriesTab /> : <SoftwareTab />}

      <div className="mt-12 flex flex-col items-center">
           <div className="h-1 w-10 bg-brand-sand/30 rounded-full mb-5" />
           <p className="text-[9px] font-bold text-primary-light text-center leading-loose">
             CCS Sit-in Monitoring <br /> 
             <span className="text-primary/40">University of Cebu - CCS Lab Management</span>
           </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// LABORATORIES TAB (View Only)
// -------------------------------------------------------------
function LaboratoriesTab() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [labSearch, setLabSearch] = useState("");
  const [pcs, setPcs] = useState([]);
  const [pcsLoading, setPcsLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const labsRes = await labService.getAll();
      const data = labsRes.data || [];
      setLabs(data);
      if (data.length > 0 && !selectedLab) {
        setSelectedLab(data[0]);
      }
    } catch (e) {
      toast.error("Failed to load laboratories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLab) {
      fetchPcs(selectedLab.id);
    }
  }, [selectedLab]);

  const fetchPcs = async (labId) => {
    setPcsLoading(true);
    try {
      const res = await pcService.getPcsByLab(labId);
      setPcs(res.data || []);
    } catch (e) {
      console.error("Failed to load PCs");
    } finally {
      setPcsLoading(false);
    }
  };

  if (loading && labs.length === 0) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    );
  }

  const filteredLabs = labs.filter(
    (l) =>
      l.name.toLowerCase().includes(labSearch.toLowerCase()) ||
      (l.lab_code &&
        l.lab_code.toLowerCase().includes(labSearch.toLowerCase())),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
      {/* Sidebar List */}
      <Card className="lg:col-span-1 bg-white border-border shadow-sm flex flex-col h-[calc(100vh-350px)] min-h-[400px] max-h-[700px]">
        <div className="p-4 border-b border-border bg-bg-secondary/30">
          <h3 className="text-[10px] font-bold text-primary">
            Lab Directory
          </h3>
        </div>
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-light/50" />
            <input
              type="text"
              placeholder="Search labs..."
              value={labSearch}
              onChange={(e) => setLabSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-bold bg-bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              onClick={() => setSelectedLab(lab)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedLab?.id === lab.id ? "bg-primary border-primary text-white shadow-md" : "bg-white border-border hover:border-primary-light/30 text-primary"}`}
            >
              <div className="flex justify-between items-center gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight truncate">
                    {lab.lab_code ? `${lab.lab_code} - ${lab.name}` : lab.name}
                  </p>
                  <p className={`text-[10px] font-bold truncate mt-0.5 ${selectedLab?.id === lab.id ? "text-white/70" : "text-primary-light"}`}>
                    {lab.lab_code ? lab.name : "Laboratory"}
                  </p>
                </div>
                {!lab.is_active && (
                   <span className="shrink-0 w-2 h-2 rounded-full bg-error animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {selectedLab ? (
          <>
            {/* Lab Stats / Overview */}
            <Card className="p-8 bg-white border-border shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <FlaskConical className="h-32 w-32 text-primary" />
               </div>
               
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary tracking-tight">
                    {selectedLab.lab_code || selectedLab.name}
                  </h2>
                  <p className="text-xs font-bold text-primary-light">
                    {selectedLab.lab_code ? selectedLab.name : "Laboratory Overview"}
                  </p>
                </div>
                {!selectedLab.is_active && (
                   <div className="px-4 py-1.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-error" />
                      <span className="text-[10px] font-bold text-error">Lab Currently Closed</span>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Activity className="h-3.5 w-3.5 text-primary/40" />
                    <p className="text-[9px] font-bold text-primary-light">
                      Traffic Level
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {selectedLab.stats?.total_sessions > 100 ? 'High' : selectedLab.stats?.total_sessions > 30 ? 'Moderate' : 'Low'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary/40" />
                    <p className="text-[9px] font-bold text-primary-light">
                      Avg Session
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {selectedLab.stats?.avg_duration || "0 mins"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Package className="h-3.5 w-3.5 text-primary/40" />
                    <p className="text-[9px] font-bold text-primary-light">
                      Software Suite
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    {selectedLab.software?.length || 0} tools
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Software List */}
               <Card className="overflow-hidden border-border bg-white shadow-sm flex flex-col h-full">
                  <div className="p-5 border-b border-border bg-bg-secondary/30">
                    <h3 className="text-[11px] font-bold text-primary">
                      Installed Software
                    </h3>
                  </div>
                  <div className="p-5 space-y-3 overflow-y-auto max-h-[400px]">
                    {selectedLab.software?.map((sw) => (
                      <div
                        key={sw.id}
                        className="p-3 border border-border rounded-xl flex items-center gap-4 bg-white hover:border-primary/20 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                          {sw.icon_path ? (
                            <img
                              src={backendAPI.defaults.baseURL.replace("/api", "") + sw.icon_path}
                              className="w-6 h-6 object-contain"
                              alt=""
                            />
                          ) : (
                            <Package className="h-5 w-5 text-primary-light/50" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-primary truncate tracking-tight">
                            {sw.name}
                          </p>
                          <p className="text-[9px] font-bold text-primary-light mt-0.5">
                            Version {sw.version || '—'}
                          </p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500/30 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    ))}
                    {(!selectedLab.software || selectedLab.software.length === 0) && (
                        <div className="py-20 text-center opacity-30">
                          <Package className="h-10 w-10 text-primary-light mx-auto mb-3" />
                          <p className="text-[10px] font-bold">No software listed.</p>
                        </div>
                    )}
                  </div>
               </Card>

               {/* Workstation Status */}
               <Card className="overflow-hidden border-border bg-white shadow-sm flex flex-col h-full">
                  <div className="p-5 border-b border-border bg-bg-secondary/30 flex justify-between items-center">
                    <h3 className="text-[11px] font-bold text-primary">
                      Workstation Status
                    </h3>
                    <div className="flex gap-3">
                       <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[8px] font-bold text-primary-light">Free</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                          <span className="text-[8px] font-bold text-primary-light">Busy</span>
                       </div>
                    </div>
                  </div>
                  <div className="p-5 overflow-y-auto max-h-[400px]">
                    {pcsLoading ? (
                      <div className="py-20 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/20" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {pcs
                          .sort((a, b) => parseInt(a.pc_number) - parseInt(b.pc_number))
                          .map((pc) => {
                            const isAvailable = pc.reservation_status === 'open' && pc.pc_status === 'active';
                            return (
                              <div
                                key={pc.id}
                                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${isAvailable ? 'bg-emerald-50/50 border-emerald-100' : 'bg-bg-secondary border-border opacity-60'}`}
                                title={`PC ${pc.pc_number} - ${pc.reservation_status}`}
                              >
                                <Monitor className={`h-4 w-4 ${isAvailable ? 'text-emerald-500' : 'text-primary/30'}`} />
                                <span className={`text-[10px] font-bold ${isAvailable ? 'text-emerald-700' : 'text-primary-light'}`}>
                                  {pc.pc_number}
                                </span>
                              </div>
                            );
                          })}
                        {pcs.length === 0 && (
                          <div className="col-span-full py-20 text-center opacity-30">
                            <Monitor className="h-10 w-10 text-primary-light mx-auto mb-3" />
                            <p className="text-[10px] font-bold">No stations found.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
               </Card>
            </div>
          </>
        ) : (
          <div className="h-full min-h-[400px] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-6 bg-white/50">
            <FlaskConical className="h-12 w-12 text-primary-light/20 mb-4" />
            <p className="text-xs font-bold text-primary-light/50">
              Select a laboratory to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SOFTWARE TAB (View Only)
// -------------------------------------------------------------
function SoftwareTab() {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const swRes = await softwareService.getStudentCatalog();
      setSoftware(swRes.data || []);
    } catch (e) {
      toast.error("Failed to load catalogue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSoftware = software.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading && software.length === 0) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <Card className="bg-white border-border shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-5 border-b border-border bg-bg-secondary/30 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/50" />
            <input
              type="text"
              placeholder="Search software catalogue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-bold bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
            />
          </div>
          <div className="px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg">
             <span className="text-[10px] font-bold text-primary">
                {filteredSoftware.length} Software Assets
             </span>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-secondary/10 whitespace-nowrap">
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light w-1/4">Software Name</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light">Installed In</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light">Version</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredSoftware.length > 0 ? (
                filteredSoftware.map((sw) => (
                  <tr
                    key={sw.id}
                    className="hover:bg-bg-secondary/30 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {sw.icon_path ? (
                            <img
                              src={backendAPI.defaults.baseURL.replace("/api", "") + sw.icon_path}
                              className="w-6 h-6 object-contain"
                              alt=""
                            />
                          ) : (
                            <Package className="h-5 w-5" />
                          )}
                        </div>
                        <span className="font-bold text-primary tracking-tight text-sm">
                          {sw.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                        {sw.labs && sw.labs.length > 0 ? (
                          sw.labs.map((l) => (
                            <span
                              key={l.id}
                              className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-brand-sand/10 text-primary-hover border border-brand-sand/20"
                            >
                              {l.lab_code || l.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] font-bold text-primary-light/40 italic">
                            Reserved System
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                       <span className="px-3 py-1 rounded-lg bg-bg-secondary border border-border text-[10px] font-bold text-primary-light italic">
                          v{sw.version || '—'}
                       </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-primary-light font-bold line-clamp-2 max-w-[300px] opacity-70 italic">
                        {sw.description || 'Global Utility Software'}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <Package className="h-10 w-10 text-primary-light/20 mx-auto mb-3" />
                    <p className="text-[10px] font-bold text-primary-light">
                      No Results Matching Your Search
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
