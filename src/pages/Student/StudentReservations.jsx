import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarPlus,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  Cpu,
  FlaskConical,
  Info,
  Loader2,
  MapPin,
  Monitor,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import labService from "../../services/lab.service";
import pcService from "../../services/pc.service";
import reservationService from "../../services/reservation.service";
import { formatDate, formatTime } from "../../utils/dateUtils";

/* ── Helpers ── */
const formatRelativeTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    if (diffInHours < 1) return "Just now";
    return `${Math.floor(diffInHours)} hours ago`;
  }
  return formatDate(date);
};

/* ── Integrated PC Map Component ── */
function IntegratedPCMap({
  lab,
  labPcs = [],
  occupiedPcs = [],
  selectedPc,
  onSelect,
  isLoading,
}) {
  const capacity = Number(lab?.capacity || 30);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 bg-bg-secondary/30 rounded-xl border border-dashed border-border">
        <div className="w-8 h-8 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
        <p className="text-[11px] font-bold text-primary-light">
          Scanning Availability...
        </p>
      </div>
    );
  }

  const availability = Array.isArray(occupiedPcs)
    ? { occupied: occupiedPcs, reserved: [], unavailable: [] }
    : {
        occupied: occupiedPcs?.occupied || [],
        reserved: occupiedPcs?.reserved || [],
        unavailable: occupiedPcs?.unavailable || [],
      };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(capacity)].map((_, i) => {
          const pcNum = i + 1;
          const pcData =
            labPcs.find((p) => Number(p.pc_number) === pcNum) || {};

          // Determine statuses based on business rules
          const pcStatus = (pcData.pc_status || "active").toLowerCase();
          const adminResStatus = (
            pcData.reservation_status || "open"
          ).toLowerCase();

          // Temporal Check
          const isOccupiedTemporally = availability.occupied.some(
            (pc) => String(pc) === String(pcNum) || String(pc?.pc_number) === String(pcNum)
          );
          const isReservedTemporally = availability.reserved.some(
            (pc) => String(pc) === String(pcNum) || String(pc?.pc_number) === String(pcNum)
          );
          const isUnavailableTemporally = availability.unavailable.some(
            (pc) => String(pc) === String(pcNum) || String(pc?.pc_number) === String(pcNum)
          );

          // Final Logic
          const isBroken =
            pcStatus === "disabled" || pcStatus === "under maintenance";
          const isUnavailable =
            isBroken || isUnavailableTemporally || adminResStatus === "unavailable";
          const isOccupied =
            !isUnavailable && (isOccupiedTemporally || adminResStatus === "occupied");
          const isReserved =
            !isUnavailable && !isOccupied && (isReservedTemporally || adminResStatus === "reserved");
          const isSelected = selectedPc === pcNum;

          // Visual Styles
          let buttonClass = "";
          let iconContent = <Monitor className="h-6 w-6 mb-2" />;
          let statusText = "Available";

          if (isUnavailable) {
            buttonClass =
              "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-90";
            iconContent = <XCircle className="h-6 w-6 mb-2 text-slate-300" />;
            statusText = String(pcStatus || "Unavailable").replace(/\b\w/g, (c) => c.toUpperCase());
          } else if (isOccupied) {
            buttonClass =
              "bg-red-500 text-white border-red-600 cursor-not-allowed shadow-sm";
            statusText = "Occupied";
          } else if (isReserved) {
            buttonClass =
              "bg-amber-500 text-white border-amber-600 cursor-not-allowed shadow-sm";
            statusText = "Reserved";
          } else if (isSelected) {
            buttonClass =
              "bg-primary text-white border-primary shadow-lg scale-105 z-10 ring-4 ring-primary/20";
            statusText = "Selected";
          } else {
            buttonClass =
              "bg-white text-primary border-border hover:border-primary/40 hover:bg-primary/5 active:scale-95 cursor-pointer hover:shadow-sm";
          }

          return (
            <button
              key={pcNum}
              type="button"
              disabled={isUnavailable || isOccupied || isReserved}
              onClick={() => onSelect(pcNum)}
              className={`
                w-full py-3 rounded-xl flex flex-col items-center justify-center transition-all duration-200 border-2
                ${buttonClass}
              `}
            >
              {iconContent}
              <span className="text-[11px] font-bold mb-1 leading-none">
                PC {pcNum}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded text-center leading-tight line-clamp-1 ${
                  isBroken
                    ? "bg-slate-200 text-slate-600"
                    : isOccupied
                      ? "bg-red-600 text-white/90"
                        : isReserved
                          ? "bg-amber-600 text-white/90"
                      : isSelected
                        ? "bg-brand-sand text-primary"
                        : "bg-bg-secondary text-primary-light"
                }`}
              >
                {statusText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-border/50 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-white border-2 border-border" />
          <span className="text-[11px] font-bold text-primary-light">
            Available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-red-500 border-2 border-red-600 shadow-sm" />
          <span className="text-[11px] font-bold text-primary-light">
            Occupied
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-amber-500 border-2 border-amber-600 shadow-sm" />
          <span className="text-[11px] font-bold text-primary-light">
            Reserved
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-slate-50 border-2 border-slate-200" />
          <span className="text-[11px] font-bold text-primary-light">
            Unavailable
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Step-Based Booking Modal ── */
function BookingWizard({ isOpen, onClose, labs, onSubmit }) {
  const [step, setStep] = useState(1);
  const [searchSoftware, setSearchSoftware] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    lab_id: "",
    reserved_date: "",
    reserved_time: "",
    pc_number: "",
    purpose: "",
  });

  const [occupiedPcs, setOccupiedPcs] = useState({
    occupied: [],
    reserved: [],
    unavailable: [],
  });
  const [labPcs, setLabPcs] = useState([]);
  const [isLoadingPcs, setIsLoadingPcs] = useState(false);

  const filteredLabs = useMemo(() => {
    if (!searchSoftware) return labs;
    return labs.filter(
      (lab) =>
        lab.software?.some((sw) =>
          sw.name.toLowerCase().includes(searchSoftware.toLowerCase()),
        ) || lab.name.toLowerCase().includes(searchSoftware.toLowerCase()),
    );
  }, [labs, searchSoftware]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSearchSoftware("");
      setFormData({
        lab_id: "",
        reserved_date: "",
        reserved_time: "",
        pc_number: "",
        purpose: "",
      });
      setOccupiedPcs({ occupied: [], reserved: [], unavailable: [] });
      setLabPcs([]);
    }
  }, [isOpen]);

  // Fetch PCs for Lab and Occupied PCs for Wizard
  useEffect(() => {
    const fetchData = async () => {
      if (
        !formData.lab_id ||
        !formData.reserved_date ||
        !formData.reserved_time
      ) {
        setOccupiedPcs({ occupied: [], reserved: [], unavailable: [] });
        setLabPcs([]);
        return;
      }
      setIsLoadingPcs(true);
      try {
        const [pcsResult, occupiedResult] = await Promise.all([
          reservationService.getLabPcs(formData.lab_id),
          reservationService.getOccupiedPcs(
            formData.lab_id,
            formData.reserved_date,
            formData.reserved_time,
          ),
        ]);

        if (pcsResult?.data) setLabPcs(pcsResult.data);
        if (occupiedResult?.status === "success") {
          const payload = occupiedResult.data || [];
          if (Array.isArray(payload)) {
            setOccupiedPcs({ occupied: payload, reserved: [], unavailable: [] });
          } else {
            setOccupiedPcs({
              occupied: payload.occupied || [],
              reserved: payload.reserved || [],
              unavailable: payload.unavailable || [],
            });
          }
        }
      } catch {
        // Silent failure for wizard
      } finally {
        setIsLoadingPcs(false);
      }
    };
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [formData.lab_id, formData.reserved_date, formData.reserved_time]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinalSubmit = async () => {
    setSubmitLoading(true);
    await onSubmit(formData);
    setSubmitLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg-secondary/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary text-white text-[11px] font-bold">
                Step {step}/4
              </span>
              <h3 className="text-lg font-bold text-primary tracking-tight">                {step === 1 && "Select Laboratory"}
                {step === 2 && "Schedule Time"}
                {step === 3 && "Assign PC"}
                {step === 4 && "Academic Purpose"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-secondary text-primary transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light" />
                <input
                  type="text"
                  placeholder="Search for required software (e.g., VS Code, NetBeans)..."
                  value={searchSoftware}
                  onChange={(e) => setSearchSoftware(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-border focus:border-primary/20 text-xs font-bold transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredLabs.map((lab) => (
                  <button
                    key={lab.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        lab_id: lab.id,
                        pc_number: "",
                      }))
                    }
                    className={`
                        p-5 rounded-xl border transition-all text-left group
                        ${formData.lab_id === lab.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white hover:border-primary/30"}
                      `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-primary">
                          {lab.lab_code ? `${lab.lab_code} - ${lab.name}` : lab.name}
                        </h4>
                        <p className="text-[11px] font-bold text-primary-light">
                          {lab.lab_type}
                        </p>
                      </div>
                      {formData.lab_id === lab.id && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {lab.software?.slice(0, 3).map((sw) => (
                        <span
                          key={sw.id}
                          className="px-1.5 py-0.5 rounded bg-white border border-border text-[11px] font-bold text-primary-light"
                        >
                          {sw.name}
                        </span>
                      ))}
                      {lab.software?.length > 3 && (
                        <span className="text-[11px] font-black text-primary-light opacity-60 ml-1">
                          +{lab.software.length - 3}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary-light ml-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.reserved_date}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      reserved_date: e.target.value,
                      pc_number: "",
                    }))
                  }
                  className="h-11 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary-light ml-1">
                  Time
                </label>
                <Input
                  type="time"
                  value={formData.reserved_time}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      reserved_time: e.target.value,
                      pc_number: "",
                    }))
                  }
                  className="h-11 font-bold"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              {!formData.lab_id ||
              !formData.reserved_date ||
              !formData.reserved_time ? (
                <div className="py-12 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center space-y-2 bg-bg-secondary/30">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                  <p className="text-[11px] font-bold text-primary-light">
                    Please set date and time first
                  </p>
                </div>
              ) : (
                <IntegratedPCMap
                  lab={labs.find((l) => l.id == formData.lab_id)}
                  labPcs={labPcs}
                  occupiedPcs={occupiedPcs}
                  selectedPc={formData.pc_number}
                  onSelect={(num) =>
                    setFormData((p) => ({ ...p, pc_number: num }))
                  }
                  isLoading={isLoadingPcs}
                />
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary-light ml-1">
                  Activity Purpose
                </label>
                <Input
                  placeholder="e.g. Programming Assignment, Web Development..."
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, purpose: e.target.value }))
                  }
                  className="h-11 font-bold"
                />
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-[12px] font-bold text-amber-800 leading-relaxed">
                  By submitting, you agree to follow laboratory rules.
                  Unauthorized software installation or gaming is prohibited.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-bg-secondary/30 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="h-10 px-5 rounded-lg border border-border text-[11px] font-bold text-primary hover:bg-white transition-all disabled:opacity-30"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={
                (step === 1 && !formData.lab_id) ||
                (step === 2 &&
                  (!formData.reserved_date || !formData.reserved_time)) ||
                (step === 3 && !formData.pc_number)
              }
              className="h-10 px-6 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={submitLoading || !formData.purpose}
              className="h-10 px-6 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Custom Confirmation Modal ── */
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-5 flex flex-col items-center text-center border border-border animate-fade-in-up">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-primary tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-[12px] font-bold text-primary-light leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-bg-secondary text-primary text-[11px] font-bold hover:bg-border transition-all"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-10 rounded-lg bg-red-500 text-white text-[11px] font-bold hover:bg-red-600 transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const RESERVATION_TABS = [
  { id: "all", label: "All", icon: ClipboardList },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle },
  { id: "fulfilled", label: "Fulfilled", icon: CheckCircle },
  { id: "rejected", label: "Rejected", icon: XCircle },
  { id: "rescheduled", label: "Rescheduled", icon: RefreshCw },
];

export default function StudentReservations() {
  const { user } = useAuth();
  const [labs, setLabs] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [isSystemEnabled, setIsSystemEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState("pending");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Expandable Card & Reschedule State
  const [expandedId, setExpandedId] = useState(null);
  const [rescheduleDrafts, setRescheduleDrafts] = useState({});
  const [activeRescheduleId, setActiveRescheduleId] = useState(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(null);

  const [occupiedPcs, setOccupiedPcs] = useState({
    occupied: [],
    reserved: [],
    unavailable: [],
  });
  const [labPcs, setLabPcs] = useState([]);
  const [isLoadingPcs, setIsLoadingPcs] = useState(false);

  // Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [labsRes, reservationsRes, settingsRes] = await Promise.all([
        labService.getAll(),
        reservationService.getMyReservations(),
        reservationService.getSettings(),
      ]);
      setLabs(labsRes.data || []);
      setMyReservations(reservationsRes.data || []);
      setIsSystemEnabled(settingsRes.data.enabled);
    } catch (err) {
      toast.error("Failed to sync reservation data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Occupied PCs for Rescheduling Drafts
  useEffect(() => {
    const fetchData = async () => {
      if (!activeRescheduleId) return;
      const draft = rescheduleDrafts[activeRescheduleId];
      const res = myReservations.find((r) => r.id === activeRescheduleId);

      if (!draft || !res || !draft.reserved_date || !draft.reserved_time) {
        setOccupiedPcs({ occupied: [], reserved: [], unavailable: [] });
        setLabPcs([]);
        return;
      }

      setIsLoadingPcs(true);
      try {
        const [pcsResult, occupiedResult] = await Promise.all([
          pcService.getPcsByLab(res.lab_id),
          reservationService.getOccupiedPcs(
            res.lab_id,
            draft.reserved_date,
            draft.reserved_time,
          ),
        ]);

        if (pcsResult?.data) setLabPcs(pcsResult.data);
        if (occupiedResult?.status === "success") {
          const payload = occupiedResult.data || [];
          if (Array.isArray(payload)) {
            setOccupiedPcs({ occupied: payload, reserved: [], unavailable: [] });
          } else {
            setOccupiedPcs({
              occupied: payload.occupied || [],
              reserved: payload.reserved || [],
              unavailable: payload.unavailable || [],
            });
          }
        }
      } catch (err) {
        toast.error("Failed to load PC availability for reschedule");
      } finally {
        setIsLoadingPcs(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [
    activeRescheduleId,
    rescheduleDrafts[activeRescheduleId]?.reserved_date,
    rescheduleDrafts[activeRescheduleId]?.reserved_time,
    myReservations,
  ]);

  const filteredReservations = useMemo(() => {
    if (activeTab === "all") return myReservations;
    return myReservations.filter((res) => res.status === activeTab);
  }, [myReservations, activeTab]);

  const getStatusCount = (status) => {
    if (status === "all") return myReservations.length;
    return myReservations.filter((res) => res.status === status).length;
  };

  const handleBookingSubmit = async (data) => {
    try {
      const result = await reservationService.create(data);
      if (result.status === "success") {
        toast.success("Reservation request submitted successfully");
        setIsWizardOpen(false);
        fetchInitialData();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      toast.error(backendMessage || err.message || "Failed to submit reservation");
    }
  };

  /* ── Reschedule Logic ── */
  const toggleRescheduleDraft = (res) => {
    if (activeRescheduleId === res.id) {
      setActiveRescheduleId(null);
    } else {
      if (!rescheduleDrafts[res.id]) {
        setRescheduleDrafts((prev) => ({
          ...prev,
          [res.id]: {
            reserved_date: res.reserved_date || "",
            reserved_time: res.reserved_time || res.time_slot || "",
            pc_number: res.pc_number || "",
          },
        }));
      }
      setActiveRescheduleId(res.id);
    }
  };

  const updateRescheduleField = (id, field, value) => {
    setRescheduleDrafts((prev) => {
      const updated = { ...prev[id], [field]: value };
      if (["reserved_date", "reserved_time"].includes(field)) {
        updated.pc_number = "";
      }
      return { ...prev, [id]: updated };
    });
  };

  const handleRescheduleSubmit = async (id) => {
    const draft = rescheduleDrafts[id];
    if (!draft.reserved_date || !draft.reserved_time || !draft.pc_number) {
      return toast.error(
        "Please complete all schedule fields including PC assignment",
      );
    }

    setRescheduleLoading(id);
    try {
      const payload = { ...draft };

      const result = await reservationService.studentReschedule(id, payload);      if (result.status === "success") {
        toast.success("Reservation updated successfully");
        setActiveRescheduleId(null);
        fetchInitialData();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to update reservation");
    } finally {
      setRescheduleLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20",
      rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20",
      rescheduled: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-500 dark:border-sky-500/20",
      cancelled: "bg-primary/5 text-primary border-primary/15 dark:bg-white/5 dark:text-primary-light dark:border-white/10",
      used: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-500 dark:border-indigo-500/20",
      fulfilled: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/20",
    };
    const label = String(status || "unknown")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
      <span
        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${styles[status] || styles.cancelled}`}
      >
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
        <p className="text-[11px] font-bold text-primary-light animate-pulse">
          Syncing Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-20 bg-bg-secondary min-h-screen">
      {/* ───── PREMIUM HERO BANNER ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary hero-banner border border-border shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-sand/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <Link
                to="/student/dashboard"
                className="inline-flex items-center gap-2 text-[11px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors tracking-wide"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Laboratory Reservations
              </h1>
              <p className="text-primary-light/80 text-sm font-medium max-w-lg">
                Secure a workstation in advance. Browse available laboratories,
                check software requirements, and manage your current bookings.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-white ${user?.session > 0 ? "bg-emerald-500/30" : "bg-red-500/80"}`}>
                    {user?.session ?? 0}
                  </span>
                  Remaining Sessions
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
                <div
                  className={`w-2 h-2 rounded-full ${isSystemEnabled ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                />
                <span className="text-[11px] font-bold text-white/80">
                  {isSystemEnabled ? "System Online" : "System Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isSystemEnabled && (
        <Card className="bg-amber-50/50 border-amber-200 border-dashed p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900 tracking-tight">
              Reservations Restricted
            </h3>
            <p className="text-sm font-bold text-amber-800/70">
              The online booking module is currently offline for maintenance.
              Please coordinate with the Lab Supervisor.
            </p>
          </div>
        </Card>
      )}

      {/* ───── MAIN CONTENT GRID ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: My Reservations */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[450px]">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-border bg-bg-secondary/30 p-1">
              {RESERVATION_TABS.map(({ id, label, icon: TabIcon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setExpandedId(null);
                    setActiveRescheduleId(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold transition-all duration-300 rounded-lg cursor-pointer ${
                    activeTab === id
                      ? "bg-primary text-white shadow-md"
                      : "text-primary-light hover:text-primary hover:bg-white"
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {label}
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === id ? "bg-white/20 text-white" : "bg-bg-secondary text-primary-light"}`}
                  >
                    {getStatusCount(id)}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 grow flex flex-col">
              {filteredReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center grow">
                  <Calendar className="h-10 w-10 text-primary-light/20 mb-3" />
                  <p className="text-sm text-primary-light font-bold">
                    No {activeTab} reservations found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReservations.map((res) => {
                    const isExpanded = expandedId === res.id;
                    const isRescheduling = activeRescheduleId === res.id;
                    const matchedLab = labs.find(
                      (lab) => String(lab.id) === String(res.lab_id),
                    );
                    const labCode = res.lab_code || matchedLab?.lab_code;
                    const labName = res.name || matchedLab?.name || "Laboratory";

                    return (
                      <div
                        key={res.id}
                        className={`group relative border border-border rounded-xl p-0 transition-all duration-300 bg-white overflow-hidden ${
                          isExpanded
                            ? "shadow-md ring-1 ring-primary/10 border-primary/20"
                            : "hover:shadow-sm hover:border-primary-hover/35"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 scale-y-100 transition-colors duration-300 ${
                            res.status === "approved"
                              ? "bg-emerald-500"
                              : res.status === "pending"
                                ? "bg-amber-500"
                                : res.status === "rescheduled"
                                  ? "bg-sky-500"
                                  : "bg-primary-light/20"
                          }`}
                        />

                        {/* Clickable Header */}
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : res.id)
                          }
                          className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ml-1 focus:outline-none"
                        >
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3 gap-4">
                              <div className="space-y-1">
                                <h4 className="text-lg font-bold text-primary leading-tight">
                                  PC {res.pc_number}
                                </h4>
                                <p className="text-[12px] font-bold text-primary-light leading-tight">
                                  {labCode ? `${labCode} - ${labName}` : labName}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold text-primary-light">
                              <span className="flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1.5 rounded-lg text-primary border border-border/50">
                                <Calendar className="h-3.5 w-3.5" />{" "}
                                {formatDate(res.reserved_date)}
                              </span>
                              <span className="flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1.5 rounded-lg text-primary border border-border/50">
                                <Clock className="h-3.5 w-3.5" />{" "}
                                {formatTime(res.reserved_time || res.time_slot)}
                              </span>
                              <span className="flex items-center gap-1.5 bg-bg-secondary/60 px-2.5 py-1.5 rounded-lg text-primary-light border border-border/60 text-[10px] font-extrabold tracking-wide">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(res.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between self-stretch sm:py-1.5 min-w-[88px]">
                            {getStatusBadge(res.status)}
                            <ChevronRight
                              className={`h-5 w-5 text-primary-light/55 transition-transform duration-300 ${isExpanded ? "rotate-90 text-primary-light/80" : ""}`}
                            />
                          </div>
                        </button>

                        {/* Expanded Details View */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 ml-1 border-t border-dashed border-border/50 animate-fade-in-up bg-bg-secondary/30">
                            {/* Rescheduling Inline UI */}
                            {isRescheduling && (
                              <div className="mb-6 p-5 rounded-xl border border-primary/20 bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-[11px] font-bold text-primary flex items-center gap-2">
                                    <RefreshCw className="h-3.5 w-3.5" /> Adjust
                                    Schedule
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-primary-light ml-1">
                                      New Date
                                    </label>
                                    <Input
                                      type="date"
                                      value={
                                        rescheduleDrafts[res.id]?.reserved_date
                                      }
                                      onChange={(e) =>
                                        updateRescheduleField(
                                          res.id,
                                          "reserved_date",
                                          e.target.value,
                                        )
                                      }
                                      className="h-10 text-[11px] font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-primary-light ml-1">
                                      New Time
                                    </label>
                                    <Input
                                      type="time"
                                      value={
                                        rescheduleDrafts[res.id]?.reserved_time
                                      }
                                      onChange={(e) =>
                                        updateRescheduleField(
                                          res.id,
                                          "reserved_time",
                                          e.target.value,
                                        )
                                      }
                                      className="h-10 text-[11px] font-bold"
                                    />
                                  </div>
                                </div>

                                <div className="mb-6 p-4 rounded-xl border border-border bg-bg-secondary/20">
                                  <label className="text-[11px] font-bold text-primary-light block mb-3">
                                    Re-assign PC
                                  </label>
                                  <IntegratedPCMap
                                    lab={labs.find((l) => l.id == res.lab_id)}
                                    labPcs={labPcs}
                                    occupiedPcs={occupiedPcs}
                                    selectedPc={
                                      rescheduleDrafts[res.id]?.pc_number
                                    }
                                    onSelect={(num) =>
                                      updateRescheduleField(
                                        res.id,
                                        "pc_number",
                                        num,
                                      )
                                    }
                                    isLoading={isLoadingPcs}
                                  />
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      handleRescheduleSubmit(res.id)
                                    }
                                    disabled={rescheduleLoading === res.id}
                                    className="flex-1 h-10 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                                  >
                                    {rescheduleLoading === res.id ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-3.5 w-3.5" />
                                    )}
                                    Confirm Updates
                                  </button>
                                  <button
                                    onClick={() => toggleRescheduleDraft(res)}
                                    className="px-6 h-10 rounded-lg border border-border text-primary-light text-[11px] font-bold hover:bg-bg-secondary transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="space-y-5">
                              <div className="p-4 rounded-lg bg-bg-secondary/40 border border-border flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 space-y-1">
                                  <span className="text-[11px] font-bold text-primary-light">
                                    Purpose
                                  </span>
                                  <p className="text-sm font-bold text-primary italic">
                                    "{res.purpose}"
                                  </p>
                                </div>
                                <div className="sm:text-right space-y-1">
                                  <span className="text-[11px] font-bold text-primary-light block">
                                    Reference ID
                                  </span>
                                  <span className="text-[12px] font-bold text-primary">
                                    #RSV-{res.id.toString().padStart(4, "0")}
                                  </span>
                                </div>
                              </div>

                              {res.admin_note && (
                                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/50 relative overflow-hidden">
                                  <ShieldCheck className="absolute -right-2 -top-2 h-16 w-16 text-amber-500/10" />
                                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-500 block mb-1">
                                    Administrative Feedback
                                  </span>
                                  <p className="text-[12px] font-bold text-amber-900 dark:text-amber-400/90 leading-relaxed relative z-10">
                                    {res.admin_note}
                                  </p>
                                </div>
                              )}

                              {["pending", "approved", "rescheduled"].includes(
                                res.status,
                              ) &&
                                !isRescheduling && (
                                  <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                                    <button
                                      onClick={() => toggleRescheduleDraft(res)}
                                      className="h-9 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 text-[11px] font-bold transition-all flex items-center gap-2"
                                    >
                                      <RefreshCw className="h-3 w-3" />{" "}
                                      Reschedule
                                    </button>
                                    <button
                                      onClick={() =>
                                        setConfirmModal({
                                          isOpen: true,
                                          id: res.id,
                                        })
                                      }
                                      className="h-9 px-4 rounded-lg border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] font-bold transition-all flex items-center gap-2 ml-auto"
                                    >
                                      <Trash2 className="h-3 w-3" /> Cancel
                                      Session
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Lab Directory & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Action Card */}
          <div className="bg-gradient-to-br from-primary-hover to-primary rounded-xl p-6 shadow-lg text-white relative overflow-hidden border border-primary-hover/20">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <CalendarPlus className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-2">
                Need a Workstation?
              </h3>
              <p className="text-sm font-bold text-white/70 mb-6 leading-relaxed">
                Reserve a computer in advance. Find the right lab equipped with
                the software you need for your assignments.
              </p>
              <button
                onClick={() => setIsWizardOpen(true)}
                disabled={!isSystemEnabled}
                className="w-full h-11 rounded-lg bg-brand-sand text-primary text-[11px] font-bold hover:bg-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CalendarPlus className="h-4 w-4" /> Craft New Schedule
              </button>
            </div>
          </div>

          {/* Technical Directory */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-brand-sand" /> Lab
                Directory
              </h4>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {labs.map((lab) => (
                <div
                  key={lab.id}
                  className="p-5 rounded-xl border border-border hover:border-primary-hover/30 transition-all group bg-bg-secondary/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h5 className="text-lg font-bold text-primary leading-tight">
                        {lab.lab_code ? `${lab.lab_code} - ${lab.name}` : lab.name}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-primary-light">
                        <span className="px-1.5 py-0.5 rounded bg-primary/5 border border-primary/10">
                          {lab.lab_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Monitor className="h-3 w-3" /> {lab.capacity} PCs
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                      <Cpu className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] flex-1 bg-border" />
                      <p className="text-[11px] font-bold text-primary-light">
                        Equipped Software
                      </p>
                      <div className="h-[1px] flex-1 bg-border" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.software?.length > 0 ? (
                        lab.software.map((sw) => (
                          <span
                            key={sw.id}
                            className="px-2 py-1 rounded bg-white border border-border text-[11px] font-bold text-primary transition-all hover:border-primary/20 hover:shadow-sm cursor-default flex items-center gap-1.5"
                          >
                            <Sparkles className="h-2.5 w-2.5 text-brand-sand" />
                            {sw.name}
                          </span>
                        ))
                      ) : (
                        <div className="w-full py-3 rounded-lg border border-dashed border-border flex items-center justify-center gap-2 bg-white/50">
                          <Info className="h-3.5 w-3.5 text-primary-light" />
                          <span className="text-[11px] font-bold text-primary-light italic">
                            Standard OS Utilities Only
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-primary-light">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Main Campus
                      </span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ───── WIZARDS & MODALS ───── */}
      <BookingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        labs={labs}
        onSubmit={handleBookingSubmit}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={async () => {
          setCancelLoading(true);
          try {
            await reservationService.cancel(confirmModal.id);
            toast.success("Reservation cancelled");
            setConfirmModal({ isOpen: false, id: null });
            fetchInitialData();
          } catch (e) {
            toast.error("Failed to cancel reservation");
          } finally {
            setCancelLoading(false);
          }
        }}
        isLoading={cancelLoading}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? The workstation will be released immediately."
      />
    </div>
  );
}
