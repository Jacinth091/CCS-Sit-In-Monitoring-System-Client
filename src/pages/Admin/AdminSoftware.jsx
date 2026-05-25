import {
  Edit3,
  FileUp,
  FlaskConical,
  Loader2,
  Monitor,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import backendAPI from "../../services/backendConnection";
import labService from "../../services/lab.service";
import pcService from "../../services/pc.service";
import softwareService from "../../services/software.service";
import notificationService from "../../services/notification.service";
import Pagination from "../../components/ui/Pagination";
import { useConfirm } from "../../hooks/useConfirm.jsx";

export default function AdminSoftware() {
  const [activeTab, setActiveTab] = useState("labs"); // 'labs' | 'software' | 'requests'

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 animate-fade-in">
      <div className="rounded-xl border border-border bg-white shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">
              Infrastructure Management
            </p>
            <h1 className="text-xl font-black text-primary tracking-tight">
              Laboratories & Software
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("labs")}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "labs" ? "bg-primary text-white shadow-md" : "bg-bg-secondary text-primary-light hover:text-primary hover:bg-bg-secondary/70"}`}
            >
              Laboratories
            </button>
            <button
              onClick={() => setActiveTab("software")}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "software" ? "bg-primary text-white shadow-md" : "bg-bg-secondary text-primary-light hover:text-primary hover:bg-bg-secondary/70"}`}
            >
              Software Catalog
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "requests" ? "bg-primary text-white shadow-md" : "bg-bg-secondary text-primary-light hover:text-primary hover:bg-bg-secondary/70"}`}
            >
              Software Requests
            </button>
          </div>
        </div>
      </div>

      {activeTab === "labs" ? (
        <LaboratoriesTab />
      ) : activeTab === "software" ? (
        <SoftwareTab />
      ) : (
        <RequestsTab />
      )}

      <div className="mt-8 flex flex-col items-center opacity-40">
        <div className="h-0.5 w-8 bg-brand-sand/50 rounded-full mb-4" />
        <p className="text-[8px] font-black text-primary-light uppercase tracking-[0.3em] text-center">
          Facilities Management Unit <br />
          <span className="opacity-60 text-[7px]">
            Technical Infrastructure Division - CCS
          </span>
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// LABORATORIES TAB
// -------------------------------------------------------------
function LaboratoriesTab() {
  const [labs, setLabs] = useState([]);
  const [globalSoftware, setGlobalSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", lab_code: "", capacity: 30, is_active: true });
  const [labSearch, setLabSearch] = useState("");

  const [pcs, setPcs] = useState([]);
  const [newPcNumber, setNewPcNumber] = useState("");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [assigningLoading, setAssigningLoading] = useState(null);

  const { confirm: confirmDialog, ConfirmModalUI } = useConfirm();

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const [labsRes, swRes] = await Promise.all([
        labService.getAll(),
        softwareService.getAll(),
      ]);
      setLabs(labsRes.data || []);
      setGlobalSoftware(swRes.data || []);
      if (!selectedLab && labsRes.data?.length > 0) {
        setSelectedLab(labsRes.data[0]);
      } else if (selectedLab) {
        const updatedLab = labsRes.data?.find((l) => l.id === selectedLab.id);
        if (updatedLab) setSelectedLab(updatedLab);
      }
    } catch (e) {
      toast.error("Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    if (selectedLab && !isEditing) {
      fetchPcs(selectedLab.id);
    } else {
      setPcs([]);
    }
  }, [selectedLab, isEditing]);

  const fetchPcs = async (labId) => {
    try {
      const res = await pcService.getPcsByLab(labId);
      setPcs(res.data || []);
    } catch (e) {
      toast.error("Failed to load PCs");
    }
  };

  const handleAddPc = async (e) => {
    e.preventDefault();
    if (!newPcNumber) return toast.error("PC number required");
    try {
      await pcService.create({
        lab_id: selectedLab.id,
        pc_number: newPcNumber,
      });
      toast.success("PC added to roster");
      setNewPcNumber("");
      fetchPcs(selectedLab.id);
    } catch (e) {
      toast.error("Failed to add PC. It might already exist.");
    }
  };

  const handleRemovePc = async (id) => {
    const ok = await confirmDialog({
      title: 'Remove Workstation?',
      message: 'This PC will be removed from the lab roster. Any associated data may be affected.',
      variant: 'warning',
      confirmText: 'Yes, Remove',
    });
    if (!ok) return;
    try {
      await pcService.delete(id);
      toast.success("PC removed");
      fetchPcs(selectedLab.id);
    } catch (e) {
      toast.error("Failed to remove PC");
    }
  };

  const handleAssignSoftware = async (swId) => {
    setAssigningLoading(swId);
    try {
      await softwareService.assignToLab(selectedLab.id, swId);
      toast.success("Software assigned to lab");
      fetchLabs();
    } catch (err) {
      toast.error("Failed to assign software. It might already be assigned.");
    } finally {
      setAssigningLoading(null);
    }
  };

  const handleSaveLab = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Laboratory name is required");
    try {
      if (formData.id) {
        await labService.update(formData);
        toast.success("Laboratory updated");
      } else {
        await labService.create(formData);
        toast.success("Laboratory created");
      }
      setIsEditing(false);
      fetchLabs();
    } catch (e) {
      toast.error("Failed to save laboratory");
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirmDialog({
      title: 'Delete Laboratory?',
      message: 'This laboratory and all its data will be permanently deleted.',
      variant: 'danger',
      confirmText: 'Yes, Delete',
    });
    if (!ok) return;
    try {
      await labService.delete(id);
      toast.success("Laboratory deleted");
      if (selectedLab?.id === id) setSelectedLab(null);
      fetchLabs();
    } catch (e) {
      toast.error("Failed to delete laboratory");
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
      <Card className="lg:col-span-1 bg-white border-border shadow-sm flex flex-col h-[calc(100vh-200px)] min-h-[500px] max-h-[800px]">
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg-secondary/30">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
            Lab Directory
          </h3>
          <button
            onClick={() => {
              setFormData({
                name: "",
                lab_code: "",
                capacity: 30,
                is_active: true,
              });
              setIsEditing(true);
              setSelectedLab(null);
            }}
            className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
            title="Add Laboratory"
          >
            <Plus className="h-4 w-4" />
          </button>
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
              onClick={() => {
                setSelectedLab(lab);
                setIsEditing(false);
              }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedLab?.id === lab.id && !isEditing ? "bg-primary border-primary text-white shadow-md" : "bg-white border-border hover:border-primary-light/30 text-primary"}`}
            >
              <div className="flex justify-between items-center gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight truncate">
                    {lab.lab_code ? `${lab.lab_code} - ${lab.name}` : lab.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest truncate ${selectedLab?.id === lab.id && !isEditing ? "text-white/70" : "text-primary-light"}`}
                    >
                      {lab.lab_code ? lab.name : "Laboratory"}
                    </p>
                    {!lab.is_active && (
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${selectedLab?.id === lab.id && !isEditing ? "bg-white/20 text-white" : "bg-error/10 text-error"}`}
                      >
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <Monitor
                  className={`h-4 w-4 shrink-0 ${selectedLab?.id === lab.id && !isEditing ? "text-white/50" : "text-primary-light/30"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {isEditing ? (
          <Card className="p-8 bg-white border-border shadow-sm">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <FlaskConical className="h-4 w-4 text-primary-hover" />
              {formData.id ? "Edit Laboratory" : "New Laboratory"}
            </h3>
            <form onSubmit={handleSaveLab} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1">
                    Official Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Networking Laboratory"
                    className="font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1">
                    Lab Code
                  </label>
                  <Input
                    value={formData.lab_code}
                    onChange={(e) =>
                      setFormData({ ...formData, lab_code: e.target.value })
                    }
                    placeholder="e.g. Lab 526"
                    className="font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1">
                    PC Capacity
                  </label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="font-bold"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col justify-center">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1 block mb-2">
                    Status
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group w-max">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`block w-10 h-6 rounded-full transition-colors ${formData.is_active ? "bg-emerald-500" : "bg-border"}`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? "translate-x-4" : "translate-x-0"}`}
                      ></div>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-primary-hover transition-colors">
                      {formData.is_active ? "Lab is Active" : "Lab is Inactive"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary-light hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-2 transition-all"
                >
                  <Save className="h-3.5 w-3.5" /> Save Laboratory
                </button>
              </div>
            </form>
          </Card>
        ) : selectedLab ? (
          <div className="space-y-6">
            <Card className="p-8 bg-white border-border shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-primary tracking-tight">
                    {selectedLab.lab_code || selectedLab.name}
                  </h2>
                  <p className="text-xs font-black text-primary-light uppercase tracking-[0.2em]">
                    {selectedLab.lab_code ? selectedLab.name : "Laboratory"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(selectedLab);
                      setIsEditing(true);
                    }}
                    className="p-2 rounded-lg bg-bg-secondary text-primary-light hover:text-primary transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedLab.id)}
                    className="p-2 rounded-lg bg-bg-secondary text-primary-light hover:text-error transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light mb-1">
                    Total Sessions
                  </p>
                  <p className="text-xl font-black text-primary">
                    {selectedLab.stats?.total_sessions || 0}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light mb-1">
                    Avg Session
                  </p>
                  <p className="text-xl font-black text-primary">
                    {selectedLab.stats?.avg_duration || "0 mins"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light mb-1">
                    Top Purpose
                  </p>
                  <p className="text-sm font-black text-primary truncate uppercase mt-1">
                    {selectedLab.stats?.top_purpose || "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-border bg-white shadow-sm">
              <div className="p-5 border-b border-border bg-bg-secondary/30 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <div>
                  <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-primary">
                    Installed Software
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black mt-1 inline-block">
                    {selectedLab.software?.length || 0} Assets
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm whitespace-nowrap h-9"
                  >
                    <Plus className="h-3.5 w-3.5" /> Assign Software
                  </button>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedLab.software?.map((sw) => (
                  <div
                    key={sw.id}
                    className="p-3 border border-border rounded-lg flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded bg-bg-secondary flex items-center justify-center shrink-0">
                      {sw.icon_path ? (
                        <img
                          src={
                            backendAPI.defaults.baseURL.replace("/api", "") +
                            sw.icon_path
                          }
                          className="w-5 h-5 object-contain"
                          alt=""
                        />
                      ) : (
                        <Package className="h-4 w-4 text-primary-light/50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primary truncate">
                        {sw.name}
                      </p>
                      <p className="text-[9px] font-black text-primary-light uppercase tracking-widest truncate">
                        v{sw.version}
                      </p>
                    </div>
                  </div>
                ))}
                {(!selectedLab.software ||
                  selectedLab.software.length === 0) && (
                    <div className="col-span-full py-10 text-center opacity-40">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-light">
                        No software linked to this lab.
                      </p>
                    </div>
                  )}
              </div>
            </Card>

            <Card className="overflow-hidden border-border bg-white shadow-sm flex flex-col">
              <div className="p-5 border-b border-border bg-bg-secondary/30 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <div>
                  <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-primary">
                    Workstation Roster
                  </h3>
                  <p className="text-[9px] font-black text-primary-light uppercase tracking-widest mt-1">
                    Capacity: {pcs.length} / {selectedLab.capacity} PCs
                  </p>
                </div>
                <form onSubmit={handleAddPc} className="flex gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary-light uppercase tracking-widest">
                      PC
                    </span>
                    <Input
                      type="number"
                      placeholder="No."
                      value={newPcNumber}
                      onChange={(e) => setNewPcNumber(e.target.value)}
                      className="font-bold h-9 pl-8 pr-3 w-28 text-xs bg-white focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm whitespace-nowrap h-9"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add PC
                  </button>
                </form>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 content-start max-h-[400px] overflow-y-auto">
                {pcs
                  .sort((a, b) => parseInt(a.pc_number) - parseInt(b.pc_number))
                  .map((pc) => (
                    <div
                      key={pc.id}
                      className="relative group p-4 border border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-white hover:border-primary-light/30 hover:shadow-sm transition-all cursor-default"
                    >
                      <Monitor
                        className={`h-6 w-6 ${pc.pc_status === "active" ? "text-emerald-500" : "text-error"}`}
                      />
                      <span className="text-xs font-bold text-primary">
                        PC {pc.pc_number}
                      </span>
                      <button
                        onClick={() => handleRemovePc(pc.id)}
                        className="absolute -top-2 -right-2 bg-white border border-border shadow-sm p-1.5 rounded-full text-error opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/10 cursor-pointer"
                        title="Remove PC"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                {pcs.length === 0 && (
                  <div className="col-span-full py-12 text-center opacity-40">
                    <Monitor className="h-10 w-10 text-primary-light mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-light">
                      No workstations provisioned yet.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="h-full min-h-[400px] rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
            <FlaskConical className="h-10 w-10 text-primary-light/20 mb-4" />
            <p className="text-sm font-black text-primary-light/50 uppercase tracking-widest">
              Select a laboratory
            </p>
          </div>
        )}
      </div>

      {showAssignModal && selectedLab && (
        <div
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setShowAssignModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/30">
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">
                  Assign Software to {selectedLab.lab_code || selectedLab.name}
                </h3>
                <p className="text-xs text-primary-light mt-1 font-bold">
                  Select from the global catalogue to provision to this lab
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-border/50 rounded-lg text-primary-light hover:text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light" />
                <input
                  type="text"
                  placeholder="Search global software catalogue..."
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-bg-secondary/50 border border-border rounded-xl text-xs font-bold text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-bg-secondary/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {globalSoftware
                  .filter(
                    (sw) =>
                      !selectedLab.software?.find(
                        (installed) => installed.id === sw.id,
                      ),
                  )
                  .filter((sw) =>
                    sw.name.toLowerCase().includes(assignSearch.toLowerCase()),
                  )
                  .map((sw) => (
                    <button
                      key={sw.id}
                      onClick={() => handleAssignSoftware(sw.id)}
                      disabled={assigningLoading === sw.id}
                      className="text-left p-4 rounded-xl border border-border bg-white hover:border-primary hover:shadow-md transition-all group flex items-center gap-4 disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                        {sw.icon_path ? (
                          <img
                            src={
                              backendAPI.defaults.baseURL.replace("/api", "") +
                              sw.icon_path
                            }
                            className="w-6 h-6 object-contain"
                            alt=""
                          />
                        ) : (
                          <Package className="h-5 w-5 text-primary-light/50 group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-primary truncate group-hover:text-primary-hover transition-colors">
                          {sw.name}
                        </p>
                        <p className="text-[10px] font-black text-primary-light uppercase tracking-widest truncate">
                          v{sw.version}
                        </p>
                      </div>
                      {assigningLoading === sw.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                      ) : (
                        <Plus className="h-4 w-4 text-primary-light opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      )}
                    </button>
                  ))}
                {globalSoftware
                  .filter(
                    (sw) =>
                      !selectedLab.software?.find(
                        (installed) => installed.id === sw.id,
                      ),
                  )
                  .filter((sw) =>
                    sw.name.toLowerCase().includes(assignSearch.toLowerCase()),
                  ).length === 0 && (
                    <div className="col-span-full py-12 text-center text-primary-light/50">
                      <Package className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        No available software found.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
      {ConfirmModalUI}
    </div>
  );
}

// -------------------------------------------------------------
// SOFTWARE TAB
// -------------------------------------------------------------
function SoftwareTab() {
  const [software, setSoftware] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkData, setBulkData] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // File upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Software form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    description: "",
    lab_ids: [],
    is_active: true,
  });

  const { confirm: confirmDialog, ConfirmModalUI } = useConfirm();

  const [softwarePage, setSoftwarePage] = useState(1);
  const [softwareTotalPages, setSoftwareTotalPages] = useState(1);
  const [softwareTotalRecords, setSoftwareTotalRecords] = useState(0);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [swRes, labRes] = await Promise.all([
        softwareService.getAll({
          page: softwarePage,
          per_page: itemsPerPage,
          search: search.trim() || undefined,
        }),
        labService.getAll(),
      ]);
      const recordsArray = swRes.data?.records || [];
      const meta = swRes.data?.meta || {};
      
      setSoftware(recordsArray);
      setLabs(labRes.data || []);
      setSoftwareTotalPages(meta.last_page || 1);
      setSoftwareTotalRecords(meta.total || 0);
    } catch (e) {
      toast.error("Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [softwarePage, search]);

  useEffect(() => {
    setSoftwarePage(1);
  }, [search]);

  const handleSaveSoftware = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Name is required");
    try {
      if (formData.id) {
        await softwareService.update(formData);
        toast.success("Software updated");
      } else {
        await softwareService.create(formData);
        toast.success("Software added to catalog");
        
        // Notify All Students (Silent fail)
        try {
          notificationService.notifyAllStudents(
            'system', 
            `Infrastructure Update: New software "${formData.name}" v${formData.version} has been added to the university catalogue.`
          );
        } catch (notifyErr) {
          console.error("Failed to notify students:", notifyErr);
        }
      }
      setIsEditing(false);
      fetchData();
    } catch (e) {
      toast.error(e.customMessage || "Failed to save software");
    }
  };

  const handleDeleteSw = async (id) => {
    const ok = await confirmDialog({
      title: 'Remove From Catalog?',
      message: 'This software will be removed from the global catalog and unassigned from all labs.',
      variant: 'danger',
      confirmText: 'Yes, Remove',
    });
    if (!ok) return;
    try {
      await softwareService.delete(id);
      toast.success("Software deleted");
      fetchData();
    } catch (e) {
      toast.error("Failed to delete software");
    }
  };

  const toggleLabAssignment = (labId) => {
    const current = formData.lab_ids || [];
    if (current.includes(labId)) {
      setFormData({
        ...formData,
        lab_ids: current.filter((id) => id !== labId),
      });
    } else {
      setFormData({ ...formData, lab_ids: [...current, labId] });
    }
  };

  const handleBulkImport = async () => {
    if (!bulkData) return toast.error("Please paste JSON data");
    try {
      const items = JSON.parse(bulkData);
      if (!Array.isArray(items)) throw new Error("Data must be an array");
      setActionLoading(true);
      await Promise.all(
        items.map((item) =>
          softwareService.create({
            name: item.name,
            version: item.version,
            description: item.description,
            lab_ids: formData.lab_ids || [],
          }),
        ),
      );
      toast.success(`Successfully imported ${items.length} items`);
      
      // Notify All Students of new catalogue items (Summary notification)
      try {
        notificationService.notifyAllStudents(
          'system', 
          `Infrastructure Update: ${items.length} new software assets have been added to the university catalogue.`
        );
      } catch (notifyErr) {
        console.error("Failed to notify students:", notifyErr);
      }

      setBulkData("");
      setShowBulkImport(false);
      fetchData();
    } catch (err) {
      toast.error(err.customMessage || "Invalid JSON format or import failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["json", "csv"].includes(ext)) {
      toast.error("Only .json and .csv files are accepted");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large. Maximum 2MB.");
      e.target.value = "";
      return;
    }

    setUploadFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        let count = 0;
        if (ext === "json") {
          const parsed = JSON.parse(text);
          count = Array.isArray(parsed) ? parsed.length : 0;
        } else {
          const lines = text.split("\n").filter((l) => l.trim());
          count = Math.max(0, lines.length - 1);
        }
        setUploadPreview({
          filename: file.name,
          type: ext.toUpperCase(),
          entries: count,
          content: text,
        });
      } catch {
        setUploadPreview({
          filename: file.name,
          type: ext.toUpperCase(),
          entries: "?",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadPreview?.content)
      return toast.error("No file selected");
    setUploadLoading(true);
    try {
      let items = [];
      if (uploadPreview.type === "JSON") {
        items = JSON.parse(uploadPreview.content);
      } else {
        const lines = uploadPreview.content.split("\n").filter((l) => l.trim());
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(",").map((v) => v.trim());
          let obj = {};
          headers.forEach((h, idx) => {
            obj[h] = vals[idx] || "";
          });
          items.push(obj);
        }
      }

      await Promise.all(
        items.map((item) =>
          softwareService.create({
            name: item.name || item.software,
            version: item.version,
            description: item.description,
            lab_ids: formData.lab_ids || [],
          }),
        ),
      );
      toast.success(`Imported ${items.length} items successfully`);
      
      // Notify All Students (Summary notification)
      try {
        notificationService.notifyAllStudents(
          'system', 
          `Infrastructure Update: ${items.length} new software entries have been imported into the university catalogue.`
        );
      } catch (notifyErr) {
        console.error("Failed to notify students:", notifyErr);
      }

      setUploadFile(null);
      setUploadPreview(null);
      setShowBulkImport(false);
      fetchData();
    } catch (err) {
      toast.error("File import failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredSoftware = software;

  if (loading && software.length === 0) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in-up">
      {/* Main Catalog */}
      <div className="col-span-full space-y-6">
        {isEditing ? (
          <Card className="p-8 bg-white border-border shadow-sm">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <Package className="h-4 w-4 text-primary-hover" />
              {formData.id ? "Edit Catalog Entry" : "New Software"}
            </h3>
            <form onSubmit={handleSaveSoftware} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1">
                    Software Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. VS Code"
                    className="font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1">
                    Version
                  </label>
                  <Input
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                    placeholder="e.g. 1.84"
                    className="font-bold"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1">
                    Description
                  </label>
                  <Input
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Internal notes or license info"
                    className="font-bold"
                  />
                </div>

                {/* Lab Assignments Tags */}
                <div className="md:col-span-2 pt-4 border-t border-border">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1 block mb-3">
                    Install Locations (Tags)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {labs.map((lab) => {
                      const isSelected = (formData.lab_ids || []).includes(
                        lab.id,
                      );
                      return (
                        <button
                          type="button"
                          key={lab.id}
                          onClick={() => toggleLabAssignment(lab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isSelected ? "bg-primary border-primary text-white shadow-sm" : "bg-bg-secondary border-border text-primary-light hover:border-primary-light/30"}`}
                        >
                          {lab.lab_code || lab.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary-light hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-2 transition-all"
                >
                  <Save className="h-3.5 w-3.5" /> Save Software
                </button>
              </div>
            </form>
          </Card>
        ) : showBulkImport ? (
          <Card className="p-8 bg-white animate-fade-in-up border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-hover via-brand-sand to-primary-hover" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                <Upload className="h-4 w-4 text-primary-hover" /> Batch
                Processing
              </h3>
              <div className="px-3 py-1 rounded-lg bg-bg-secondary border border-border text-[9px] font-black text-primary-light uppercase tracking-widest">
                JSON / CSV
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-border">
              <label className="text-[9px] font-black uppercase tracking-widest text-primary-light ml-1 block mb-3">
                Apply to Locations (Tags)
              </label>
              <div className="flex flex-wrap gap-2">
                {labs.map((lab) => {
                  const isSelected = (formData.lab_ids || []).includes(lab.id);
                  return (
                    <button
                      type="button"
                      key={lab.id}
                      onClick={() => toggleLabAssignment(lab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isSelected ? "bg-primary border-primary text-white shadow-sm" : "bg-bg-secondary border-border text-primary-light hover:border-primary-light/30"}`}
                    >
                      {lab.lab_code || lab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[9px] font-black text-primary-light uppercase tracking-[0.15em] mb-2">
              Option 1: Paste JSON
            </p>
            <textarea
              className="w-full h-36 p-5 rounded-2xl border border-border bg-bg-secondary font-mono text-xs focus:ring-4 focus:ring-primary/5 focus:bg-white outline-none transition-all shadow-inner"
              placeholder='[{"name": "Python", "version": "3.12"}, {"name": "Node.js", "version": "20.10"}]'
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleBulkImport}
                disabled={actionLoading || !bulkData}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import JSON
              </button>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[9px] font-black text-primary-light/40 uppercase tracking-[0.2em]">
                Or
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <p className="text-[9px] font-black text-primary-light uppercase tracking-[0.15em] mb-2">
              Option 2: Upload File
            </p>
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-primary-light/20 bg-bg-secondary hover:border-primary-hover/40 hover:bg-primary-hover/5 transition-all cursor-pointer group">
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <FileUp className="h-8 w-8 text-primary-light/30 group-hover:text-primary-hover transition-colors mb-2" />
              <span className="text-[10px] font-black text-primary-light/50 group-hover:text-primary uppercase tracking-widest">
                {uploadFile ? uploadFile.name : "Click to select .json or .csv"}
              </span>
              <span className="text-[8px] font-bold text-primary-light/30 mt-1 uppercase tracking-widest">
                Max 2MB
              </span>
            </label>

            {uploadPreview && (
              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-hover/10 flex items-center justify-center">
                    <FileUp className="h-5 w-5 text-primary-hover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">
                      {uploadPreview.filename}
                    </p>
                    <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">
                      {uploadPreview.type} · {uploadPreview.entries}{" "}
                      {uploadPreview.entries === 1 ? "entry" : "entries"}{" "}
                      detected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                    }}
                    className="px-3 py-2 rounded-lg border border-border text-[9px] font-black uppercase text-primary-light hover:text-error hover:border-error/30 transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleFileUpload}
                    disabled={uploadLoading}
                    className="px-5 py-2 rounded-lg bg-primary text-white text-[9px] font-black uppercase hover:bg-primary-hover shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30"
                  >
                    {uploadLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    Upload & Import
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowBulkImport(false);
                  setUploadFile(null);
                  setUploadPreview(null);
                }}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary-light hover:text-primary transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </Card>
        ) : (
          <Card className="bg-white border-border shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-5 border-b border-border bg-bg-secondary/30 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/50" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm font-bold bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData({
                      name: "",
                      version: "",
                      description: "",
                      lab_ids: [],
                      is_active: true,
                    });
                    setShowBulkImport(true);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-bg-secondary border border-border text-primary-light text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-bg-secondary/80 hover:text-primary transition-colors shadow-sm whitespace-nowrap"
                >
                  <Upload className="h-3.5 w-3.5" /> Bulk Import
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      name: "",
                      version: "",
                      description: "",
                      lab_ids: [],
                      is_active: true,
                    });
                    setIsEditing(true);
                    setShowBulkImport(false);
                  }}
                  className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Software
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg-secondary/10">
                    <th className="py-3 px-6 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light w-1/3">
                      Software Name
                    </th>
                    <th className="py-3 px-6 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">
                      Deployed Labs
                    </th>
                    <th className="py-3 px-6 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredSoftware.length > 0 ? (
                    filteredSoftware.map((sw) => (
                      <tr
                        key={sw.id}
                        className="hover:bg-bg-secondary/30 transition-colors group"
                      >
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                              {sw.icon_path ? (
                                <img
                                  src={
                                    backendAPI.defaults.baseURL.replace(
                                      "/api",
                                      "",
                                    ) + sw.icon_path
                                  }
                                  className="w-5 h-5 object-contain"
                                  alt=""
                                />
                              ) : (
                                <Package className="h-4.5 w-4.5 text-primary/40" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-primary tracking-tight text-sm block">
                                {sw.name}
                              </span>
                              <span className="text-[10px] font-black text-primary-light uppercase tracking-widest">
                                v{sw.version}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex flex-wrap gap-1.5">
                            {sw.labs && sw.labs.length > 0 ? (
                              sw.labs.map((l) => (
                                <span
                                  key={l.id}
                                  className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-brand-sand/20 text-primary-hover border border-brand-sand/30"
                                >
                                  {l.lab_code || l.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] font-black uppercase text-primary-light/40 tracking-widest">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setFormData({
                                  ...sw,
                                  lab_ids: sw.labs?.map((l) => l.id) || [],
                                });
                                setIsEditing(true);
                              }}
                              className="p-1.5 rounded-lg text-primary hover:bg-primary/10"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSw(sw.id)}
                              className="p-1.5 rounded-lg text-error hover:bg-error/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-32 text-center">
                        <Package className="h-10 w-10 text-primary-light/20 mx-auto mb-3" />
                        <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em]">
                          No software found in catalog
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {softwareTotalPages > 1 && (
              <div className="px-6 py-4 border-t border-border bg-bg-secondary/30 flex items-center justify-center">
                <Pagination
                  currentPage={softwarePage}
                  totalPages={softwareTotalPages}
                  onPageChange={setSoftwarePage}
                />
              </div>
            )}
          </Card>
        )}
      </div>
      {ConfirmModalUI}
    </div>
  );
}

// -------------------------------------------------------------
// SOFTWARE REQUESTS TAB
// -------------------------------------------------------------
function RequestsTab() {
  const [requests, setRequests] = useState([]);
  const [labs, setLabs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);

  // Modal resolving state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalForm, setModalForm] = useState({
    name: "",
    version: "1.0.0",
    description: "",
    lab_ids: [],
    is_active: true,
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [reqRes, labsRes] = await Promise.all([
        softwareService.getRequests(statusFilter === "all" ? null : statusFilter),
        labService.getAll()
      ]);
      setRequests(reqRes.data?.requests || []);
      setSummary(reqRes.data?.summary || null);
      setLabs(labsRes.data || []);
    } catch (e) {
      toast.error("Failed to load software requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const openResolveModal = (req) => {
    setSelectedRequest(req);
    setModalForm({
      name: req.software_name,
      version: req.version || "1.0.0",
      description: `Requested by ${req.first_name} ${req.last_name} (${req.student_id}) for ${req.course}. Reason: ${req.reason || "None specified."}`,
      lab_ids: req.lab_id ? [parseInt(req.lab_id)] : [],
      is_active: true,
    });
  };

  const handleResolveOnly = async (id) => {
    setActionLoading("resolve_only");
    try {
      await softwareService.markRequestsReviewed([id]);
      toast.success("Request marked as reviewed.");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to resolve request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleInstallAndResolve = async (id) => {
    if (!modalForm.name.trim()) {
      toast.error("Software Name is required");
      return;
    }
    if (!modalForm.version.trim()) {
      toast.error("Version is required");
      return;
    }
    setActionLoading("install_resolve");
    try {
      // 1. Create global software and associate with labs
      await softwareService.create({
        name: modalForm.name.trim(),
        version: modalForm.version.trim(),
        description: modalForm.description.trim(),
        is_active: modalForm.is_active,
        lab_ids: modalForm.lab_ids
      });
      
      // 2. Mark request as reviewed
      await softwareService.markRequestsReviewed([id]);
      
      toast.success("Software added to catalogue and request resolved!");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve and install software");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-border shadow-sm flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light mb-1">
              Pending Requests
            </span>
            <span className="text-2xl font-black text-primary">
              {summary.pending_requests || 0}
            </span>
          </div>
          <div className="p-5 rounded-xl bg-white border border-border shadow-sm flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light mb-1">
              Reviewed Requests
            </span>
            <span className="text-2xl font-black text-primary">
              {summary.reviewed_requests || 0}
            </span>
          </div>
          <div className="p-5 rounded-xl bg-white border border-border shadow-sm flex flex-col justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light mb-1">
              Total Request Count
            </span>
            <span className="text-2xl font-black text-primary">
              {summary.total_requests || 0}
            </span>
          </div>
        </div>
      )}

      <Card className="bg-white border-border shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-5 border-b border-border bg-bg-secondary/30 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-primary">
            Student Request Directory
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-primary-light uppercase tracking-widest">
              Filter status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 text-xs font-bold border border-border rounded-lg bg-white text-primary tracking-wide focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="all">All Requests</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-secondary/10 whitespace-nowrap">
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light w-1/4">Requested Software</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light">Requested By</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light">Target Lab</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light">Reason / Purpose</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light text-center">Status</th>
                <th className="py-4 px-6 text-[9px] font-bold text-primary-light text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/20 mx-auto" />
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-bg-secondary/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                          <Package className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <span className="font-bold text-primary tracking-tight text-sm block">
                            {req.software_name}
                          </span>
                          {req.version && (
                            <span className="text-[10px] font-bold text-primary-light/80 block mt-0.5">
                              Version: {req.version}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary text-xs">
                          {req.first_name} {req.last_name}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {req.student_id} • {req.course}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {req.lab_code ? (
                        <div className="flex flex-col">
                          <span className="px-2.5 py-1 rounded text-[9px] font-bold bg-brand-sand/15 text-primary-hover border border-brand-sand/25 w-max">
                            {req.lab_code}
                          </span>
                          <span className="text-[8px] text-primary-light font-bold mt-1 opacity-70">
                            {req.lab_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-primary-light/50 italic">
                          Any Laboratory
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-primary-light font-bold line-clamp-2 max-w-[250px] italic opacity-85">
                        {req.reason || "No reason provided"}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                        req.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex flex-col items-end gap-1.5">
                          {parseInt(req.is_installed) > 0 && (
                            <span className="text-[8px] font-black uppercase text-emerald-600 tracking-wider bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 rounded">
                              Already Catalogued
                            </span>
                          )}
                          <button
                            onClick={() => openResolveModal(req)}
                            className="px-3.5 py-1.5 bg-primary text-white hover:bg-primary-hover text-[9px] font-black uppercase tracking-widest rounded transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            Resolve
                          </button>
                        </div>
                      ) : (
                        // Status is reviewed. Show button only if NOT already installed in catalogue
                        parseInt(req.is_installed) > 0 ? (
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            Reviewed & Catalogue Registered
                          </span>
                        ) : (
                          <button
                            onClick={() => openResolveModal(req)}
                            className="px-3.5 py-1.5 bg-bg-secondary text-primary hover:bg-bg-secondary/70 text-[9px] font-black uppercase tracking-widest rounded border border-border transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
                          >
                            Install / Catalogue
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <Package className="h-10 w-10 text-primary-light/20 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em]">
                      No software requests found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ───── RESOLVE SOFTWARE REQUEST MODAL ───── */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => !actionLoading && setSelectedRequest(null)}
          />
          
          {/* Modal Container */}
          <Card className="relative w-full max-w-lg bg-white border border-border shadow-xl rounded-xl overflow-hidden p-6 z-10">
            <h3 className="text-base font-black text-primary uppercase tracking-wider mb-2">
              {selectedRequest.status === 'pending' ? 'Resolve Software Request' : 'Install Requested Software'}
            </h3>
            <p className="text-[11px] text-primary-light font-bold mb-5 leading-relaxed">
              {selectedRequest.status === 'pending' 
                ? 'You can choose to install this software globally (adding it to the active software catalogue and mapping it to lab workstations) or simply mark the request as reviewed for offline tracking.'
                : 'This request was marked as reviewed. You can register the requested software in the system catalogue now to complete the deployment.'}
            </p>
            
            <div className="space-y-4">
              {/* Info banner */}
              <div className="p-3 bg-bg-secondary rounded-lg border border-border flex flex-col gap-1 text-xs">
                <span className="font-bold text-primary">Student Details:</span>
                <span className="text-primary-light font-bold">
                  {selectedRequest.first_name} {selectedRequest.last_name} ({selectedRequest.student_id}) - {selectedRequest.course}
                </span>
                <span className="font-bold text-primary mt-2">Requested Laboratory:</span>
                <span className="text-primary-light font-bold">
                  {selectedRequest.lab_code ? `${selectedRequest.lab_code} - ${selectedRequest.lab_name}` : "Any / All Laboratories"}
                </span>
                <span className="font-bold text-primary mt-2">Student's Stated Reason:</span>
                <span className="text-primary-light font-bold italic">
                  "{selectedRequest.reason || "No reason provided"}"
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-primary-light ml-1">
                  Software Name (To register in Catalogue)
                </label>
                <input
                  type="text"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold bg-bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  disabled={!!actionLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-primary-light ml-1">
                    Version Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1.0.0"
                    value={modalForm.version}
                    onChange={(e) => setModalForm({ ...modalForm, version: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold bg-bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    disabled={!!actionLoading}
                  />
                </div>
                <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalForm.is_active}
                      onChange={(e) => setModalForm({ ...modalForm, is_active: e.target.checked })}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                      disabled={!!actionLoading}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      Active in Catalogue
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-primary-light ml-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold bg-bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  disabled={!!actionLoading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-primary-light ml-1">
                  Deploy to Laboratories (Check to install)
                </label>
                <div className="border border-border bg-bg-secondary/40 rounded-lg p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-2">
                  {labs.map((lab) => {
                    const isChecked = modalForm.lab_ids.includes(lab.id);
                    return (
                      <label key={lab.id} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-primary">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const nextIds = isChecked
                              ? modalForm.lab_ids.filter((id) => id !== lab.id)
                              : [...modalForm.lab_ids, lab.id];
                            setModalForm({ ...modalForm, lab_ids: nextIds });
                          }}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                          disabled={!!actionLoading}
                        />
                        <span>{lab.lab_code || lab.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                disabled={!!actionLoading}
                className="px-4 py-2 border border-border bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-secondary transition-all rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              {selectedRequest.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleResolveOnly(selectedRequest.id)}
                  disabled={!!actionLoading}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-primary text-[10px] font-black uppercase tracking-widest transition-all rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === "resolve_only" ? "Saving..." : "Mark Reviewed Only"}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleInstallAndResolve(selectedRequest.id)}
                disabled={!!actionLoading}
                className="px-5 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {actionLoading === "install_resolve" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {selectedRequest.status === 'pending' ? 'Install & Resolve' : 'Install to Catalogue'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

