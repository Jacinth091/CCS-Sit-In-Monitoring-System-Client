import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Clock,
  History,
  Loader2,
  Monitor,
  RefreshCw,
  Search,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Select } from "../../components/ui";
import labService from "../../services/lab.service";
import pcService from "../../services/pc.service";
import reservationService from "../../services/reservation.service";
import notificationService from "../../services/notification.service";

const RESERVATION_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "rescheduled", label: "Rescheduled" },
];

const MOBILE_PANELS = [
  { id: "pc", label: "PC Controls", icon: <Monitor className="w-3.5 h-3.5" /> },
  {
    id: "reservations",
    label: "Queue",
    icon: <ClipboardList className="w-3.5 h-3.5" />,
  },
  { id: "logs", label: "Activity", icon: <History className="w-3.5 h-3.5" /> },
];

const EVENT_GROUPS = [
  { id: "pc", label: "PC Status" },
  { id: "reservation", label: "Reservations" },
  { id: "student", label: "Students" },
  { id: "system", label: "System" },
];

const PC_STATUS_FILTERS = [
  { id: "all", label: "All PCs" },
  { id: "active", label: "Active" },
  { id: "disabled", label: "Disabled" },
  { id: "under maintenance", label: "Maintenance" },
];

const RESERVATION_STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "reserved", label: "Reserved" },
  { id: "occupied", label: "Occupied" },
];

const COMMON_RESCHEDULE_REASONS = [
  "PC is currently under maintenance.",
  "Requested PC is already occupied during this slot.",
  "Laboratory has a schedule conflict for the selected time.",
  "Administrative adjustment for equitable lab access.",
  "Please choose a different slot based on current lab availability.",
];

const normalizeList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.items)) return result.data.items;
  if (Array.isArray(result?.data?.logs)) return result.data.logs;
  if (Array.isArray(result?.items)) return result.items;
  return [];
};

const isApiSuccess = (result) =>
  result?.success === true || result?.status === "success";

const getReservationQueueTime = (reservation) => {
  const ts = new Date(
    reservation?.created_at ||
      reservation?.requested_at ||
      reservation?.reservation_date_created ||
      0,
  ).getTime();
  return Number.isNaN(ts) ? 0 : ts;
};

const formatRelativeTime = (value) => {
  if (!value) return "Unknown time";
  const now = Date.now();
  const createdAt = new Date(value).getTime();
  const diff = Math.max(0, now - createdAt);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "N/A";
  try {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timeStr;
  }
};

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "active":
    case "open":
      return "success";
    case "pending":
    case "rescheduled":
    case "under maintenance":
      return "warning";
    case "rejected":
    case "unavailable":
    case "disabled":
      return "error";
    case "occupied":
    case "reserved":
      return "primary";
    default:
      return "secondary";
  }
};

function LoadingRows({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="h-20 rounded-xl border border-border bg-bg-secondary/50 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState({ message, icon: Icon = Activity }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
      <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary-light/40" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-light max-w-[200px]">
        {message}
      </p>
    </div>
  );
}

function InlineError({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-700">{message}</p>
          <button
            type="button"
            className="mt-2 text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors flex items-center gap-1.5"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination Component ── */
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="p-2 rounded-lg border border-border bg-white text-primary-light hover:text-primary hover:bg-bg-secondary disabled:opacity-30 transition-all"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg border border-border bg-white text-primary-light hover:text-primary hover:bg-bg-secondary disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {startPage > 1 && <span className="px-1 text-primary-light/40">...</span>}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-8 h-8 rounded-lg text-[10px] font-black transition-all
            ${
              currentPage === page
                ? "bg-primary text-white shadow-md"
                : "bg-white border border-border text-primary-light hover:border-primary/30 hover:text-primary"
            }
          `}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <span className="px-1 text-primary-light/40">...</span>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg border border-border bg-white text-primary-light hover:text-primary hover:bg-bg-secondary disabled:opacity-30 transition-all"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="p-2 rounded-lg border border-border bg-white text-primary-light hover:text-primary hover:bg-bg-secondary disabled:opacity-30 transition-all"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function AdminReservations() {
  const [labs, setLabs] = useState([]);
  const [labsLoading, setLabsLoading] = useState(true);
  const [labsError, setLabsError] = useState("");
  const [selectedLabId, setSelectedLabId] = useState("");
  const [mobilePanel, setMobilePanel] = useState("reservations");

  const [isEnabled, setIsEnabled] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [isAuditCollapsed, setIsAuditCollapsed] = useState(false);

  const [pcs, setPcs] = useState([]);
  const [pcsLoading, setPcsLoading] = useState(false);
  const [pcsError, setPcsError] = useState("");
  const [pcActionId, setPcActionId] = useState(null);
  const [pcStatusFilter, setPcStatusFilter] = useState("all");
  const [pcReservationFilter, setPcReservationFilter] = useState("all");

  const [reservationTab, setReservationTab] = useState("pending");
  const [pendingCount, setPendingCount] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState("");
  const [reservationActionId, setReservationActionId] = useState(null);
  const [expandedReservationId, setExpandedReservationId] = useState(null);
  const [highlightedReservationId, setHighlightedReservationId] =
    useState(null);
  const [approvalWarningId, setApprovalWarningId] = useState(null);
  const [adminNotes, setAdminNotes] = useState({});
  const [selectedReasons, setSelectedReasons] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [auditEntries, setAuditEntries] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState("");
  const [auditFilters, setAuditFilters] = useState({
    eventTypes: [],
    dateFrom: "",
    dateTo: "",
  });
  const [auditPage, setAuditPage] = useState(1);
  const [auditMeta, setAuditMeta] = useState({
    total: 0,
    totalPages: 1,
    perPage: 20,
  });

  const filteredReservations = useMemo(() => {
    const queueOrdered = [...reservations].sort((a, b) => {
      if (reservationTab === "pending") {
        const timeDiff =
          getReservationQueueTime(a) - getReservationQueueTime(b);
        if (timeDiff !== 0) return timeDiff;
        return Number(a?.id || 0) - Number(b?.id || 0);
      }
      return 0;
    });

    if (!searchTerm.trim()) return queueOrdered;
    const term = searchTerm.toLowerCase();
    return queueOrdered.filter(
      (r) =>
        String(r.student_id).toLowerCase().includes(term) ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(term) ||
        String(r.pc_number).includes(term),
    );
  }, [reservations, searchTerm, reservationTab]);

  const filteredPcs = useMemo(() => {
    let list = pcs;
    if (pcStatusFilter !== "all") {
      list = list.filter((pc) => pc.pc_status === pcStatusFilter);
    }
    if (pcReservationFilter !== "all") {
      list = list.filter((pc) => pc.reservation_status === pcReservationFilter);
    }
    return list;
  }, [pcs, pcStatusFilter, pcReservationFilter]);

  const currentLab = useMemo(
    () => labs.find((lab) => String(lab.id) === String(selectedLabId)),
    [labs, selectedLabId],
  );

  useEffect(() => {
    const savedLabId = sessionStorage.getItem("adminReservationActiveLabId");
    void fetchLabs(savedLabId);
    void fetchSettings();
  }, []);

  useEffect(() => {
    if (!selectedLabId) return;
    sessionStorage.setItem(
      "adminReservationActiveLabId",
      String(selectedLabId),
    );
    void fetchPcs(selectedLabId);
  }, [selectedLabId]);

  useEffect(() => {
    void fetchReservations(reservationTab);
  }, [reservationTab]);

  useEffect(() => {
    void fetchAuditLog(auditPage, auditFilters);
  }, [auditPage, auditFilters]);

  useEffect(() => {
    if (!highlightedReservationId) return;
    const timer = setTimeout(() => setHighlightedReservationId(null), 3000);
    return () => clearTimeout(timer);
  }, [highlightedReservationId]);

  const fetchLabs = async (savedLabId) => {
    setLabsLoading(true);
    setLabsError("");
    try {
      const result = await labService.getAll();
      const labList = result?.data || (Array.isArray(result) ? result : []);
      setLabs(labList);
      if (labList.length === 0) {
        setSelectedLabId("");
        return;
      }
      const matched =
        savedLabId &&
        labList.find((lab) => String(lab.id) === String(savedLabId));
      setSelectedLabId(matched ? matched.id : labList[0].id);
    } catch (_error) {
      setLabsError("Failed to load laboratories.");
      toast.error("Failed to load laboratories");
    } finally {
      setLabsLoading(false);
    }
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const result = await reservationService.getSettings();
      const enabled = Boolean(result?.data?.enabled);
      setIsEnabled(enabled);
    } catch {
      toast.error("Failed to load reservation settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchPcs = async (labId, silent = false) => {
    if (!silent) setPcsLoading(true);
    setPcsError("");
    try {
      const result = await pcService.getPcsByLab(labId);
      const pcList = normalizeList(result);
      setPcs(pcList);
    } catch {
      setPcsError("Failed to load PCs for this lab.");
    } finally {
      if (!silent) setPcsLoading(false);
    }
  };

  const fetchReservations = async (tab) => {
    setReservationsLoading(true);
    setReservationsError("");
    try {
      const statusParam = tab === "all" ? "" : tab;
      const [tabResult, pendingResult] = await Promise.all([
        reservationService.getAll(statusParam),
        reservationService.getAll("pending"),
      ]);
      setReservations(normalizeList(tabResult));
      setPendingCount(normalizeList(pendingResult).length);
    } catch {
      setReservationsError("Failed to load reservations.");
    } finally {
      setReservationsLoading(false);
    }
  };

  const fetchAuditLog = async (page, filters) => {
    setAuditLoading(true);
    setAuditError("");
    try {
      const result = await reservationService.getAuditLog(
        {
          entity_type: filters.eventTypes,
          date_from: filters.dateFrom,
          date_to: filters.dateTo,
        },
        page,
        20,
      );
      const payload = result?.data;
      const entries = Array.isArray(payload)
        ? payload
        : payload?.items || payload?.logs || payload?.data || [];

      const total =
        payload?.total ?? payload?.pagination?.total ?? entries.length;
      const totalPages =
        payload?.total_pages ??
        payload?.pagination?.total_pages ??
        Math.max(1, Math.ceil(total / 20));
      setAuditEntries(entries);
      setAuditMeta({ total, totalPages, perPage: 20 });
    } catch {
      setAuditError("Failed to load audit logs.");
    } finally {
      setAuditLoading(false);
    }
  };

  const toggleSettings = async () => {
    const nextValue = !isEnabled;
    try {
      const result = await reservationService.setSettings(nextValue);
      if (!isApiSuccess(result)) {
        toast.error(result?.message || "Failed to update reservation settings");
        return;
      }
      setIsEnabled(nextValue);
      toast.success(`Reservations ${nextValue ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update reservation settings");
    }
  };

  const handlePcStatusChange = async (pc, nextStatus) => {
    setPcActionId(pc.id);
    const previous = {
      pc_status: pc.pc_status,
      reservation_status: pc.reservation_status,
    };
    const forcedReservationStatus = ["disabled", "under maintenance"].includes(
      nextStatus,
    )
      ? "unavailable"
      : pc.reservation_status;
    setPcs((prev) =>
      prev.map((item) =>
        item.id === pc.id
          ? {
              ...item,
              pc_status: nextStatus,
              reservation_status: forcedReservationStatus,
            }
          : item,
      ),
    );

    try {
      const result = await pcService.updatePcStatus(pc.id, nextStatus);
      if (!isApiSuccess(result)) {
        throw new Error(result?.message || "Unable to update PC status");
      }
      toast.success("PC status updated");
      if (selectedLabId) {
        await fetchPcs(selectedLabId, true);
      }
      void fetchAuditLog(1, auditFilters);
      setAuditPage(1);
    } catch (error) {
      setPcs((prev) =>
        prev.map((item) =>
          item.id === pc.id
            ? {
                ...item,
                pc_status: previous.pc_status,
                reservation_status: previous.reservation_status,
              }
            : item,
        ),
      );
      toast.error(error.message || "Failed to update PC status");
    } finally {
      setPcActionId(null);
    }
  };

  const handlePcReservationStatusChange = async (pc, nextStatus) => {
    if (pc.pc_status !== "active") return;
    if (pc.reservation_status === "unavailable") return;
    setPcActionId(pc.id);
    const previous = pc.reservation_status;
    setPcs((prev) =>
      prev.map((item) =>
        item.id === pc.id ? { ...item, reservation_status: nextStatus } : item,
      ),
    );

    try {
      const result = await pcService.updateReservationStatus(pc.id, nextStatus);
      if (!isApiSuccess(result)) {
        throw new Error(
          result?.message || "Unable to update reservation status",
        );
      }
      toast.success("PC reservation status updated");
      if (selectedLabId) {
        await fetchPcs(selectedLabId, true);
      }
      void fetchAuditLog(1, auditFilters);
      setAuditPage(1);
    } catch (error) {
      setPcs((prev) =>
        prev.map((item) =>
          item.id === pc.id ? { ...item, reservation_status: previous } : item,
        ),
      );
      toast.error(error.message || "Failed to update reservation status");
    } finally {
      setPcActionId(null);
    }
  };

  const hasPcConflict = (reservation) => {
    const pcNumber = Number(reservation.pc_number);
    if (!pcNumber || !currentLab) return false;
    const sameLab =
      String(reservation.lab_id || "") === String(currentLab.id) ||
      String(reservation.name || "") === String(currentLab.name || "");
    if (!sameLab) return false;
    const pc = pcs.find((item) => Number(item.pc_number) === pcNumber);
    if (!pc) return false;
    return ["occupied", "reserved"].includes(
      String(pc.reservation_status || "").toLowerCase(),
    );
  };

  const updateReservationStatus = async (
    reservation,
    nextStatus,
    force = false,
  ) => {
    if (nextStatus === "approved" && !force && hasPcConflict(reservation)) {
      setApprovalWarningId(reservation.id);
      setExpandedReservationId(reservation.id);
      return;
    }

    setReservationActionId(reservation.id);
    try {
      const result = await reservationService.updateStatus(
        reservation.id,
        nextStatus,
      );
      if (!isApiSuccess(result)) {
        throw new Error(result?.message || "Failed to update reservation");
      }
      toast.success(`Reservation ${nextStatus}`);

      // Notify Student (Silent fail to avoid blocking main flow)
      try {
        await notificationService.create({
          student_id: reservation.student_id,
          type: 'reservation',
          message: `Your reservation #${reservation.id} for PC ${reservation.pc_number} has been ${nextStatus}.`
        });
      } catch (notifyErr) {
        console.error("Failed to send notification:", notifyErr);
      }

      setApprovalWarningId(null);
      await Promise.all([
        fetchReservations(reservationTab),
        fetchAuditLog(1, auditFilters),
      ]);
      setAuditPage(1);
    } catch (error) {
      toast.error(error.message || "Failed to update reservation");
    } finally {
      setReservationActionId(null);
    }
  };

  const requestStudentReschedule = async (reservation) => {
    const reason = (adminNotes[reservation.id] || "").trim();
    if (!reason) {
      toast.error("Please provide a reason before requesting reschedule");
      return;
    }
    setReservationActionId(reservation.id);
    try {
      const result = await reservationService.updateStatus(
        reservation.id,
        "rescheduled",
        {
          admin_note: reason,
        },
      );
      if (!isApiSuccess(result)) {
        throw new Error(result?.message || "Failed to request reschedule");
      }
      toast.success("Student notified to reschedule");

      // Notify Student (Silent fail)
      try {
        await notificationService.create({
          student_id: reservation.student_id,
          type: 'reservation',
          message: `Administrative adjustment: Please reschedule your reservation #${reservation.id}. Reason: ${reason}`
        });
      } catch (notifyErr) {
        console.error("Failed to send notification:", notifyErr);
      }

      await Promise.all([
        fetchReservations(reservationTab),
        fetchAuditLog(1, auditFilters),
      ]);
      setAuditPage(1);
    } catch (error) {
      toast.error(error.message || "Failed to send reschedule request");
    } finally {
      setReservationActionId(null);
    }
  };

  const onClickAuditEntry = (entry) => {
    const reservationId =
      entry?.reservation_id ||
      (String(entry?.description || "").match(/#(\d+)/)?.[1] ?? null);
    if (!reservationId) return;

    if (reservationTab !== "all") {
      setReservationTab("all");
    }
    setExpandedReservationId(Number(reservationId));
    setHighlightedReservationId(Number(reservationId));

    toast.info(`Locating reservation #${reservationId}...`);
  };

  const renderPcPanel = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border bg-bg-secondary/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5" />
            PC Controls
          </h3>
          <Badge
            variant="secondary"
            className="px-2 py-0.5 scale-90 origin-right"
          >
            {filteredPcs.length} Items
          </Badge>
        </div>

        <div className="space-y-3">
          {" "}
          {/* 1. Reduced from space-y-4 */}
          <Select
            label="Select Laboratory"
            value={selectedLabId}
            onChange={(e) => setSelectedLabId(e.target.value)}
            disabled={labsLoading}
          >
            {labs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.lab_code ? `${lab.lab_code} - ${lab.name}` : lab.name}
              </option>
            ))}
          </Select>
          <div className="space-y-2">
            {" "}
            {/* 2. Tighter spacing between filter rows */}
            {/* PC Status Filters */}
            <div
              className="flex items-center gap-1 p-1 bg-white rounded-xl border border-border overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {PC_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setPcStatusFilter(filter.id)}
                  className={`
                    shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all
                    ${
                      pcStatusFilter === filter.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-primary-light hover:bg-bg-secondary"
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {/* Reservation Status Filters */}
            <div
              className="flex items-center gap-1 p-1 bg-white rounded-xl border border-border overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {RESERVATION_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setPcReservationFilter(filter.id)}
                  className={`
                    shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all
                    ${
                      pcReservationFilter === filter.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-primary-light hover:bg-bg-secondary"
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {labsError && (
          <InlineError
            message={labsError}
            onRetry={() => fetchLabs(selectedLabId)}
          />
        )}
        {!labsError && pcsError && (
          <InlineError
            message={pcsError}
            onRetry={() => fetchPcs(selectedLabId)}
          />
        )}

        {!labsError && !pcsError && (
          <>
            {pcsLoading ? (
              <LoadingRows rows={6} />
            ) : filteredPcs.length === 0 ? (
              <EmptyState
                message="No workstations found matching filter."
                icon={Monitor}
              />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredPcs
                  .sort((a, b) => Number(a.pc_number) - Number(b.pc_number))
                  .map((pc) => {
                    const isFunctionalActive = pc.pc_status === "active";
                    const isBookingDerived =
                      pc.reservation_status === "unavailable";
                    const canEditBookingState =
                      isFunctionalActive && !isBookingDerived;
                    const isProcessing = pcActionId === pc.id;

                    return (
                      <div
                        key={pc.id}
                        className={`
                        p-4 rounded-xl border border-border bg-white transition-all duration-300 group
                        hover:shadow-md hover:border-primary/20
                        ${isProcessing ? "opacity-50 pointer-events-none" : ""}
                      `}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-black shrink-0 transition-colors ${isFunctionalActive ? "bg-primary text-white shadow-sm" : "bg-bg-secondary text-primary-light"}`}
                          >
                            <Monitor className="h-3.5 w-3.5" />
                            <span className="text-[10px] leading-none">
                              {String(pc.pc_number).padStart(2, "0")}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={getStatusVariant(pc.pc_status)}
                                className="px-1.5 py-0.5 text-[8px] uppercase tracking-tighter"
                              >
                                {pc.pc_status}
                              </Badge>
                              <Badge
                                variant={getStatusVariant(
                                  pc.reservation_status,
                                )}
                                className="px-1.5 py-0.5 text-[8px] uppercase tracking-tighter"
                              >
                                {pc.reservation_status === "open"
                                  ? "Available"
                                  : pc.reservation_status}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <select
                                value={pc.pc_status}
                                onChange={(e) =>
                                  handlePcStatusChange(pc, e.target.value)
                                }
                                className="flex-1 text-[10px] font-bold py-1 px-2 rounded-lg border border-border bg-bg-secondary/20 focus:outline-none focus:bg-white transition-colors cursor-pointer"
                              >
                                <option value="active">Active</option>
                                <option value="disabled">Disabled</option>
                                <option value="under maintenance">
                                  Maintenance
                                </option>
                              </select>

                              <select
                                value={
                                  isFunctionalActive
                                    ? pc.reservation_status
                                    : "unavailable"
                                }
                                onChange={(e) =>
                                  handlePcReservationStatusChange(
                                    pc,
                                    e.target.value,
                                  )
                                }
                                disabled={!canEditBookingState}
                                className="flex-1 text-[10px] font-bold py-1 px-2 rounded-lg border border-border bg-bg-secondary/20 focus:outline-none focus:bg-white transition-colors disabled:opacity-30 cursor-pointer"
                              >
                                {!isFunctionalActive ? (
                                  <option value="unavailable">Locked</option>
                                ) : (
                                  <>
                                    <option value="open">Open</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="occupied">Occupied</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>
                          {isProcessing && (
                            <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderReservationPanel = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border bg-bg-secondary/30 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <ClipboardList className="w-3.5 h-3.5" />
            Reservation Queue
          </h3>
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-border">
            {RESERVATION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReservationTab(tab.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200
                  ${
                    reservationTab === tab.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-primary-light hover:bg-bg-secondary hover:text-primary"
                  }
                `}
              >
                {tab.label}
                {tab.id === "pending" && pendingCount > 0 && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${reservationTab === "pending" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-light/40 group-focus-within:text-primary-hover transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student ID or name..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-white text-xs font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-bg-secondary/10">
        {reservationsError && (
          <InlineError
            message={reservationsError}
            onRetry={() => fetchReservations(reservationTab)}
          />
        )}

        {!reservationsError && (
          <>
            {reservationsLoading ? (
              <LoadingRows rows={5} />
            ) : filteredReservations.length === 0 ? (
              <EmptyState
                message={
                  searchTerm
                    ? "No reservations match your search."
                    : reservationTab === "all"
                      ? "No history found."
                      : `No ${reservationTab} reservations at the moment.`
                }
                icon={searchTerm ? Search : ClipboardList}
              />
            ) : (
              <div className="space-y-3">
                {filteredReservations.map((reservation) => {
                  const expanded = expandedReservationId === reservation.id;
                  const showWarning = approvalWarningId === reservation.id;
                  const isHighlighted =
                    highlightedReservationId === reservation.id;
                  const isActioning = reservationActionId === reservation.id;

                  return (
                    <div
                      key={reservation.id}
                      id={`reservation-${reservation.id}`}
                      className={`
                        rounded-2xl border transition-all duration-300 overflow-hidden
                        ${
                          isHighlighted
                            ? "border-primary ring-4 ring-primary/5 bg-white shadow-xl translate-y-[-2px]"
                            : "border-border bg-white hover:border-primary/20 hover:shadow-md"
                        }
                      `}
                    >
                      <button
                        type="button"
                        className="w-full text-left p-4 focus:outline-none group"
                        onClick={() =>
                          setExpandedReservationId(
                            expanded ? null : reservation.id,
                          )
                        }
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4 min-w-0">
                            <div
                              className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-colors ${expanded ? "bg-primary text-white" : "bg-bg-secondary text-primary-light group-hover:bg-primary/5 group-hover:text-primary"}`}
                            >
                              <User className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-black text-primary truncate">
                                  {reservation.first_name}{" "}
                                  {reservation.last_name}
                                </h4>
                                <Badge
                                  variant={getStatusVariant(reservation.status)}
                                  className="uppercase text-[9px] px-2 py-0.5"
                                >
                                  {reservation.status}
                                </Badge>
                              </div>{" "}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-primary-light">
                                <span className="flex items-center gap-1">
                                  <Monitor className="w-3 h-3" />
                                  PC {reservation.pc_number} |{" "}
                                  {reservation.lab_code
                                    ? `${reservation.lab_code} - ${reservation.name}`
                                    : reservation.name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDisplayDate(
                                    reservation.reserved_date,
                                  )}{" "}
                                  @{" "}
                                  {formatDisplayTime(reservation.reserved_time)}
                                </span>
                                <span className="text-[10px] opacity-60 font-medium uppercase tracking-wider">
                                  Ref #{reservation.id}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}
                          >
                            <ChevronRight className="w-5 h-5 text-primary-light/40 group-hover:text-primary-hover" />
                          </div>
                        </div>
                      </button>

                      <div
                        className={`
                        grid transition-all duration-300 ease-in-out
                        ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                      `}
                      >
                        <div className="overflow-hidden">
                          <div className="p-4 pt-0 border-t border-border/50 bg-bg-secondary/30">
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-primary-light mb-1">
                                    Academic Info
                                  </p>
                                  <p className="text-xs font-bold text-primary">
                                    {reservation.course} —{" "}
                                    {reservation.course_level}
                                  </p>
                                  <p className="text-[10px] text-primary-light">
                                    {reservation.student_id}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-primary-light mb-1">
                                    Purpose of Visit
                                  </p>
                                  <p className="text-xs font-bold text-primary italic">
                                    "
                                    {reservation.purpose ||
                                      "General Laboratory Usage"}
                                    "
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-primary-light mb-1">
                                    Request Timeline
                                  </p>
                                  <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    Submitted{" "}
                                    {formatRelativeTime(reservation.created_at)}
                                  </p>
                                </div>
                                {reservation.admin_note && (
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-light mb-1">
                                      System/Admin Note
                                    </p>
                                    <p className="text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                      {reservation.admin_note}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {reservation.status === "pending" ||
                            reservation.status === "approved" ? (
                              <div className="space-y-4 animate-zoom-in">
                                <div className="grid grid-cols-1 gap-3">
                                  <Select
                                    label="Administrative Response"
                                    value={
                                      selectedReasons[reservation.id] || ""
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setSelectedReasons((prev) => ({
                                        ...prev,
                                        [reservation.id]: val,
                                      }));
                                      if (val)
                                        setAdminNotes((prev) => ({
                                          ...prev,
                                          [reservation.id]: val,
                                        }));
                                    }}
                                  >
                                    <option value="">
                                      Quick select response...
                                    </option>
                                    {COMMON_RESCHEDULE_REASONS.map((r) => (
                                      <option key={r} value={r}>
                                        {r}
                                      </option>
                                    ))}
                                  </Select>

                                  <textarea
                                    value={adminNotes[reservation.id] || ""}
                                    onChange={(e) =>
                                      setAdminNotes((prev) => ({
                                        ...prev,
                                        [reservation.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Enter custom message or adjustments..."
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-xs font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[80px]"
                                  />
                                </div>

                                {showWarning && (
                                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 animate-pulse">
                                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-xs font-black text-amber-800 uppercase tracking-tight">
                                        Resource Conflict Detected
                                      </p>
                                      <p className="text-[11px] text-amber-700 font-bold mt-1">
                                        PC {reservation.pc_number} is currently
                                        marked as{" "}
                                        {currentLab
                                          ? "unavailable in the lab controls."
                                          : "busy."}
                                      </p>
                                      <div className="flex gap-2 mt-3">
                                        <button
                                          onClick={() =>
                                            updateReservationStatus(
                                              reservation,
                                              "approved",
                                              true,
                                            )
                                          }
                                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-colors"
                                        >
                                          Force Approve
                                        </button>
                                        <button
                                          onClick={() =>
                                            setApprovalWarningId(null)
                                          }
                                          className="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center gap-2">
                                  {reservation.status === "pending" && (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        updateReservationStatus(
                                          reservation,
                                          "approved",
                                        )
                                      }
                                      loading={isActioning}
                                      icon={
                                        <CheckCircle2 className="w-4 h-4" />
                                      }
                                      className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      Approve
                                    </Button>
                                  )}
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      updateReservationStatus(
                                        reservation,
                                        "rejected",
                                      )
                                    }
                                    loading={isActioning}
                                    icon={<XCircle className="w-4 h-4" />}
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      requestStudentReschedule(reservation)
                                    }
                                    loading={isActioning}
                                    className="border-primary text-primary hover:bg-primary/5"
                                  >
                                    Request Reschedule
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 py-3 px-4 rounded-xl bg-bg-secondary flex items-center gap-3">
                                <Activity className="w-4 h-4 text-primary-light" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-light">
                                  No further actions required for this record.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderAuditPanel = () => {
    return (
      <>
        {/* Collapsed State (Desktop only) */}
        <div
          className={`hidden flex-col h-full bg-white border border-border rounded-2xl shadow-sm transition-all duration-300 w-14 ${isAuditCollapsed ? "lg:flex" : ""}`}
        >
          <div className="p-4 border-b border-border bg-bg-secondary/30 flex justify-center">
            <button
              onClick={() => setIsAuditCollapsed(false)}
              className="p-1 rounded-lg text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors"
              title="Expand Activity Log"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center py-6">
            <p className="rotate-90 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.3em] text-primary-light/40">
              System Activity Log
            </p>
          </div>
          <div className="p-4 border-t border-border flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Expanded State (Desktop default or Mobile always) */}
        <div
          className={`flex flex-col h-full bg-white border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${isAuditCollapsed ? "lg:hidden" : ""}`}
        >
          <div className="p-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              System Activity
            </h3>
            {/* Collapse toggle hidden on mobile */}
            <button
              onClick={() => setIsAuditCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-lg text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors"
              title="Collapse Panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-white border-b border-border space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {EVENT_GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() => {
                    setAuditPage(1);
                    setAuditFilters((prev) => ({
                      ...prev,
                      eventTypes: prev.eventTypes.includes(group.id)
                        ? prev.eventTypes.filter((i) => i !== group.id)
                        : [...prev.eventTypes, group.id],
                    }));
                  }}
                  className={`
                    px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all
                    ${
                      auditFilters.eventTypes.includes(group.id)
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-primary-light border-border hover:border-primary/20"
                    }
                  `}
                >
                  {group.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={auditFilters.dateFrom}
                onChange={(e) => {
                  setAuditPage(1);
                  setAuditFilters((prev) => ({
                    ...prev,
                    dateFrom: e.target.value,
                  }));
                }}
                className="px-2 py-1.5 rounded-lg border border-border bg-white text-[10px] font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/5"
              />
              <input
                type="date"
                value={auditFilters.dateTo}
                onChange={(e) => {
                  setAuditPage(1);
                  setAuditFilters((prev) => ({
                    ...prev,
                    dateTo: e.target.value,
                  }));
                }}
                className="px-2 py-1.5 rounded-lg border border-border bg-white text-[10px] font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/5"
              />
            </div>

            <button
              onClick={() => {
                setAuditPage(1);
                setAuditFilters({ eventTypes: [], dateFrom: "", dateTo: "" });
              }}
              className="w-full py-2 rounded-lg border border-dashed border-border text-[9px] font-black uppercase tracking-[0.15em] text-primary-light hover:bg-bg-secondary transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Activity Filters
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-bg-secondary/5">
            {auditError && (
              <InlineError
                message={auditError}
                onRetry={() => fetchAuditLog(auditPage, auditFilters)}
              />
            )}

            {!auditError && (
              <>
                {auditLoading ? (
                  <LoadingRows rows={8} />
                ) : auditEntries.length === 0 ? (
                  <EmptyState
                    message="No system activity recorded for selected filters."
                    icon={Activity}
                  />
                ) : (
                  <div className="space-y-4">
                    {auditEntries.map((entry, idx) => {
                      const reservationId =
                        entry?.reservation_id ||
                        (String(entry?.description || "").match(
                          /#(\d+)/,
                        )?.[1] ??
                          null);
                      const isLast = idx === auditEntries.length - 1;

                      return (
                        <div key={entry.id} className="relative pl-6 group">
                          {!isLast && (
                            <div className="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-border group-hover:bg-primary/10 transition-colors" />
                          )}
                          <div
                            className={`absolute left-0 top-1.5 w-[16px] h-[16px] rounded-full border-4 border-white shadow-sm transition-colors ${entry.event_type?.includes("reservation") ? "bg-primary" : "bg-primary-light"}`}
                          />

                          <button
                            onClick={() => onClickAuditEntry(entry)}
                            className="w-full text-left bg-white p-3 rounded-xl border border-border hover:shadow-md hover:border-primary/10 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary-light">
                                {entry.event_type || "System"}
                              </span>
                              <span className="text-[10px] font-bold text-primary-light/60">
                                {formatRelativeTime(entry.created_at)}
                              </span>
                            </div>
                            <p className="text-xs font-black text-primary leading-tight group-hover:text-primary-hover transition-colors">
                              {entry.action || entry.description}
                            </p>
                            <p className="text-[11px] text-primary-light/70 mt-1 line-clamp-2 italic">
                              "{entry.description}"
                            </p>
                            <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-primary-light">
                                {entry.admin_first_name || "System"}
                              </span>
                              {reservationId && (
                                <span className="text-primary flex items-center gap-1">
                                  ID #{reservationId}
                                  <ChevronRight className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-4 border-t border-border bg-white flex items-center justify-center">
            <Pagination
              currentPage={auditPage}
              totalPages={auditMeta.totalPages}
              onPageChange={setAuditPage}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full h-[calc(100vh-40px)] px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 animate-fade-in overflow-hidden pb-8">
      {/* ── Standardized Admin Banner ── */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">
              CCS Sit-in Monitoring
            </p>
            <h1 className="text-xl font-black text-primary tracking-tight">
              Reservation Manager
            </h1>
            <p className="text-[11px] font-bold text-primary-light mt-0.5">
              Laboratory workstation management, student booking verification,
              and audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* System Activation Switch */}
            <div
              className={`
              flex items-center gap-4 p-3 rounded-xl border transition-all duration-300
              ${isEnabled ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}
            `}
            >
              <div className="min-w-[100px]">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-light mb-1">
                  Reservation System
                </p>
                <div className="flex items-center gap-2">
                  {settingsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-light" />
                  ) : (
                    <div
                      onClick={toggleSettings}
                      className={`
                        relative w-9 h-5 rounded-full cursor-pointer transition-colors duration-200
                        ${isEnabled ? "bg-emerald-500 shadow-inner" : "bg-red-500 shadow-inner"}
                      `}
                    >
                      <div
                        className={`
                        absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-200
                        ${isEnabled ? "translate-x-4" : ""}
                      `}
                      />
                    </div>
                  )}
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${isEnabled ? "text-emerald-700" : "text-red-700"}`}
                  >
                    {isEnabled ? "Active" : "Closed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary border border-border">
              <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-primary-light">
                  Queue
                </p>
                <p className="text-base font-black text-primary tracking-tighter">
                  {pendingCount}{" "}
                  <span className="text-[8px] font-bold opacity-40 ml-0.5">
                    Pending
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary border border-border">
              <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                <Monitor className="w-4 h-4" />
              </div>
              <div className="max-w-[120px]">
                <p className="text-[8px] font-black uppercase tracking-widest text-primary-light">
                  Current Lab
                </p>
                <p className="text-xs font-black text-primary truncate uppercase tracking-tight">
                  {currentLab?.name || "---"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Panel Switcher */}
      <div className="lg:hidden grid grid-cols-3 gap-2 p-1.5 bg-bg-secondary rounded-2xl border border-border shrink-0">
        {MOBILE_PANELS.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setMobilePanel(panel.id)}
            className={`
              flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300
              ${
                mobilePanel === panel.id
                  ? "bg-white text-primary shadow-md border border-border/50 translate-y-[-2px]"
                  : "text-primary-light hover:text-primary"
              }
            `}
          >
            {panel.icon}
            <span className="text-[9px] font-black uppercase tracking-widest">
              {panel.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div
        className={`grid grid-cols-1 grid-rows-1 ${isAuditCollapsed ? "lg:grid-cols-[1fr_3.4fr_auto]" : "lg:grid-cols-[1fr_2.2fr_1.2fr]"} gap-6 flex-1 min-h-0 items-stretch transition-all duration-500`}
      >
        {/* PC Controls Column */}
        <div
          className={`lg:block ${mobilePanel === "pc" ? "block" : "hidden"} h-full min-h-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm flex flex-col transition-all duration-300`}
        >
          {renderPcPanel()}
        </div>

        {/* Queue Column */}
        <div
          className={`lg:block ${mobilePanel === "reservations" ? "block" : "hidden"} h-full min-h-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm flex flex-col transition-all duration-300`}
        >
          {renderReservationPanel()}
        </div>

        {/* Audit Column */}
        <div
          className={`lg:block ${mobilePanel === "logs" ? "block" : "hidden"} h-full min-h-0 flex flex-col transition-all duration-300`}
        >
          {renderAuditPanel()}
        </div>
      </div>
    </div>
  );
}
