import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  FlaskConical,
  Loader2,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import reservationService from '../../services/reservation.service';
import labService from '../../services/lab.service';
import pcService from '../../services/pc.service';

const RESERVATION_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'rescheduled', label: 'Rescheduled' },
];

const MOBILE_PANELS = [
  { id: 'pc', label: 'PC Controls' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'logs', label: 'Logs' },
];

const EVENT_GROUPS = [
  { id: 'pc', label: 'PC Status' },
  { id: 'reservation', label: 'Reservations' },
  { id: 'student', label: 'Students' },
  { id: 'system', label: 'System' },
];

const PC_STATUS_FILTERS = [
  { id: 'all', label: 'All PCs' },
  { id: 'active', label: 'Active' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'under maintenance', label: 'Maintenance' },
];

const RESERVATION_STATUS_FILTERS = [
  { id: 'all', label: 'All Reservations' },
  { id: 'open', label: 'Open' },
  { id: 'reserved', label: 'Reserved' },
  { id: 'occupied', label: 'Occupied' },
  { id: 'unavailable', label: 'Unavailable' },
];

const COMMON_RESCHEDULE_REASONS = [
  'PC is currently under maintenance.',
  'Requested PC is already occupied during this slot.',
  'Laboratory has a schedule conflict for the selected time.',
  'Administrative adjustment for equitable lab access.',
  'Please choose a different slot based on current lab availability.',
];

const normalizeList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.items)) return result.data.items;
  if (Array.isArray(result?.data?.logs)) return result.data.logs;
  if (Array.isArray(result?.items)) return result.items;
  return [];
};

const isApiSuccess = (result) => result?.success === true || result?.status === 'success';

const formatRelativeTime = (value) => {
  if (!value) return 'Unknown time';
  const now = Date.now();
  const createdAt = new Date(value).getTime();
  const diff = Math.max(0, now - createdAt);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const formatDisplayTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  try {
    // Check if it's already in a recognizable time format or just HH:mm:ss
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return timeStr;
  }
};

const statusBadgeClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'rescheduled':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'cancelled':
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    default:
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
};

const pcStatusBadgeClass = (status) => {
  if (status === 'disabled') return 'bg-red-50 text-red-700 border-red-200';
  if (status === 'under maintenance') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'active') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return 'bg-zinc-100 text-zinc-700 border-zinc-200';
};

const reservationStatusBadgeClass = (status) => {
  if (status === 'open') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'occupied') return 'bg-sky-50 text-sky-700 border-sky-200';
  if (status === 'unavailable') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

const eventBadgeClass = (eventType) => {
  const type = String(eventType || '').toLowerCase();
  if (type.includes('pc')) return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  if (type.includes('student') || type.includes('cancel')) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-sky-50 text-sky-700 border-sky-200';
};

function LoadingRows({ rows = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-16 rounded-xl border border-border bg-bg-secondary animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary-light">
      {message}
    </div>
  );
}

function InlineError({ message, onRetry }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold"
          onClick={onRetry}
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    </div>
  );
}

export default function AdminReservations() {
  const [labs, setLabs] = useState([]);
  const [labsLoading, setLabsLoading] = useState(true);
  const [labsError, setLabsError] = useState('');
  const [selectedLabId, setSelectedLabId] = useState('');
  const [mobilePanel, setMobilePanel] = useState('reservations');

  const [isEnabled, setIsEnabled] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [isAuditCollapsed, setIsAuditCollapsed] = useState(false);

  const [pcs, setPcs] = useState([]);
  const [pcsLoading, setPcsLoading] = useState(false);
  const [pcsError, setPcsError] = useState('');
  const [pcActionId, setPcActionId] = useState(null);
  const [pcStatusFilter, setPcStatusFilter] = useState('all');
  const [pcReservationFilter, setPcReservationFilter] = useState('all');

  const [reservationTab, setReservationTab] = useState('pending');
  const [pendingCount, setPendingCount] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState('');
  const [reservationActionId, setReservationActionId] = useState(null);
  const [expandedReservationId, setExpandedReservationId] = useState(null);
  const [highlightedReservationId, setHighlightedReservationId] = useState(null);
  const [approvalWarningId, setApprovalWarningId] = useState(null);
  const [adminNotes, setAdminNotes] = useState({});
  const [selectedReasons, setSelectedReasons] = useState({});

  const [auditEntries, setAuditEntries] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState('');
  const [auditFilters, setAuditFilters] = useState({
    eventTypes: [],
    dateFrom: '',
    dateTo: '',
  });
  const [auditPage, setAuditPage] = useState(1);
  const [auditMeta, setAuditMeta] = useState({ total: 0, totalPages: 1, perPage: 20 });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReservations = useMemo(() => {
    if (!searchTerm.trim()) return reservations;
    const term = searchTerm.toLowerCase();
    return reservations.filter(r => 
      String(r.student_id).toLowerCase().includes(term) ||
      `${r.first_name} ${r.last_name}`.toLowerCase().includes(term) ||
      String(r.pc_number).includes(term)
    );
  }, [reservations, searchTerm]);

  const filteredPcs = useMemo(() => {
    let list = pcs;
    if (pcStatusFilter !== 'all') {
      list = list.filter((pc) => String(pc.pc_status).toLowerCase() === pcStatusFilter);
    }
    if (pcReservationFilter !== 'all') {
      list = list.filter((pc) => String(pc.reservation_status).toLowerCase() === pcReservationFilter);
    }
    return list;
  }, [pcs, pcStatusFilter, pcReservationFilter]);

  const currentLab = useMemo(
    () => labs.find((lab) => String(lab.id) === String(selectedLabId)),
    [labs, selectedLabId],
  );

  useEffect(() => {
    const savedLabId = sessionStorage.getItem('adminReservationActiveLabId');
    void fetchLabs(savedLabId);
    void fetchSettings();
  }, []);

  useEffect(() => {
    if (!selectedLabId) return;
    sessionStorage.setItem('adminReservationActiveLabId', String(selectedLabId));
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
    setLabsError('');
    try {
      const result = await labService.getAll();
      const labList = result?.data || (Array.isArray(result) ? result : []);
      setLabs(labList);
      if (labList.length === 0) {
        setSelectedLabId('');
        return;
      }
      const matched = savedLabId && labList.find((lab) => String(lab.id) === String(savedLabId));
      setSelectedLabId(matched ? matched.id : labList[0].id);
    } catch (error) {
      setLabsError('Failed to load laboratories.');
      toast.error('Failed to load laboratories');
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
      toast.error('Failed to load reservation settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchPcs = async (labId) => {
    setPcsLoading(true);
    setPcsError('');
    try {
      const result = await pcService.getPcsByLab(labId);
      const pcList = normalizeList(result);
      setPcs(pcList);
    } catch {
      setPcsError('Failed to load PCs for this lab.');
    } finally {
      setPcsLoading(false);
    }
  };

  const fetchReservations = async (tab) => {
    setReservationsLoading(true);
    setReservationsError('');
    try {
      const statusParam = tab === 'all' ? '' : tab;
      const [tabResult, pendingResult] = await Promise.all([
        reservationService.getAll(statusParam),
        reservationService.getAll('pending'),
      ]);
      setReservations(normalizeList(tabResult));
      setPendingCount(normalizeList(pendingResult).length);
    } catch {
      setReservationsError('Failed to load reservations.');
    } finally {
      setReservationsLoading(false);
    }
  };

  const fetchAuditLog = async (page, filters) => {
    setAuditLoading(true);
    setAuditError('');
    try {
      const result = await reservationService.getAuditLog({
        entity_type: filters.eventTypes,
        date_from: filters.dateFrom,
        date_to: filters.dateTo,
      }, page, 20);
      const payload = result?.data;
      const entries = Array.isArray(payload)
        ? payload
        : payload?.items || payload?.logs || payload?.data || [];

      const total = payload?.total ?? payload?.pagination?.total ?? entries.length;
      const totalPages = payload?.total_pages ?? payload?.pagination?.total_pages ?? Math.max(1, Math.ceil(total / 20));
      setAuditEntries(entries);
      setAuditMeta({ total, totalPages, perPage: 20 });
    } catch {
      setAuditError('Failed to load audit logs.');
    } finally {
      setAuditLoading(false);
    }
  };

  const toggleSettings = async () => {
    const nextValue = !isEnabled;
    try {
      const result = await reservationService.setSettings(nextValue);
      if (!isApiSuccess(result)) {
        toast.error(result?.message || 'Failed to update reservation settings');
        return;
      }
      setIsEnabled(nextValue);
      toast.success(`Reservations ${nextValue ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to update reservation settings');
    }
  };

  const handlePcStatusChange = async (pc, nextStatus) => {
    setPcActionId(pc.id);
    const previous = { pc_status: pc.pc_status, reservation_status: pc.reservation_status };
    const forcedReservationStatus = ['disabled', 'under maintenance'].includes(nextStatus) ? 'unavailable' : pc.reservation_status;
    setPcs((prev) =>
      prev.map((item) => (
        item.id === pc.id
          ? { ...item, pc_status: nextStatus, reservation_status: forcedReservationStatus }
          : item
      )),
    );

    try {
      const result = await pcService.updatePcStatus(pc.id, nextStatus);
      if (!isApiSuccess(result)) {
        throw new Error(result?.message || 'Unable to update PC status');
      }
      toast.success('PC status updated');
      void fetchAuditLog(1, auditFilters);
      setAuditPage(1);
    } catch (error) {
      setPcs((prev) =>
        prev.map((item) => (
          item.id === pc.id
            ? { ...item, pc_status: previous.pc_status, reservation_status: previous.reservation_status }
            : item
        )),
      );
      toast.error(error.message || 'Failed to update PC status');
    } finally {
      setPcActionId(null);
    }
  };

  const handlePcReservationStatusChange = async (pc, nextStatus) => {
    if (pc.pc_status !== 'active') return;
    setPcActionId(pc.id);
    const previous = pc.reservation_status;
    setPcs((prev) =>
      prev.map((item) => (item.id === pc.id ? { ...item, reservation_status: nextStatus } : item)),
    );

    try {
      const result = await pcService.updateReservationStatus(pc.id, nextStatus);
      if (!isApiSuccess(result)) {
        throw new Error(result?.message || 'Unable to update reservation status');
      }
      toast.success('PC reservation status updated');
      void fetchAuditLog(1, auditFilters);
      setAuditPage(1);
    } catch (error) {
      setPcs((prev) =>
        prev.map((item) => (item.id === pc.id ? { ...item, reservation_status: previous } : item)),
      );
      toast.error(error.message || 'Failed to update reservation status');
    } finally {
      setPcActionId(null);
    }
  };

  const hasPcConflict = (reservation) => {
    const pcNumber = Number(reservation.pc_number);
    if (!pcNumber || !currentLab) return false;
    const sameLab = String(reservation.lab_id || '') === String(currentLab.id)
      || String(reservation.lab_name || '') === String(currentLab.lab_name || currentLab.name || '');
    if (!sameLab) return false;
    const pc = pcs.find((item) => Number(item.pc_number) === pcNumber);
    if (!pc) return false;
    return ['occupied', 'reserved'].includes(String(pc.reservation_status || '').toLowerCase());
  };

  const updateReservationStatus = async (reservation, nextStatus, force = false) => {
    if (nextStatus === 'approved' && !force && hasPcConflict(reservation)) {
      setApprovalWarningId(reservation.id);
      setExpandedReservationId(reservation.id);
      return;
    }

    setReservationActionId(reservation.id);
    try {
      const result = await reservationService.updateStatus(reservation.id, nextStatus);
      if (!isApiSuccess(result)) {
        throw new Error(result?.message || 'Failed to update reservation');
      }
      toast.success(`Reservation ${nextStatus}`);
      setApprovalWarningId(null);
      await Promise.all([
        fetchReservations(reservationTab),
        fetchAuditLog(1, auditFilters),
      ]);
      setAuditPage(1);
    } catch (error) {
      toast.error(error.message || 'Failed to update reservation');
    } finally {
      setReservationActionId(null);
    }
  };

  const requestStudentReschedule = async (reservation) => {
    const reason = (adminNotes[reservation.id] || '').trim();
    if (!reason) {
      toast.error('Please provide a reason before requesting reschedule');
      return;
    }
    setReservationActionId(reservation.id);
    try {
      const result = await reservationService.updateStatus(reservation.id, 'rescheduled', {
        admin_note: reason,
      });
      if (!isApiSuccess(result)) {
        throw new Error(result?.message || 'Failed to request reschedule');
      }
      toast.success('Student notified to reschedule');
      await Promise.all([
        fetchReservations(reservationTab),
        fetchAuditLog(1, auditFilters),
      ]);
      setAuditPage(1);
    } catch (error) {
      toast.error(error.message || 'Failed to send reschedule request');
    } finally {
      setReservationActionId(null);
    }
  };

  const onClickAuditEntry = (entry) => {
    const reservationId = entry?.reservation_id
      || (String(entry?.description || '').match(/#(\d+)/)?.[1] ?? null);
    if (!reservationId) return;

    if (reservationTab !== 'all') {
      setReservationTab('all');
    }
    setExpandedReservationId(Number(reservationId));
    setHighlightedReservationId(Number(reservationId));
  };

  const renderPcPanel = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-bg-secondary/30 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <FlaskConical className="h-3.5 w-3.5 text-primary-hover" />
            PC Controls
          </h2>
          <button
            type="button"
            onClick={toggleSettings}
            disabled={settingsLoading}
            className={`rounded-xl border px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${isEnabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}
          >
            {settingsLoading ? 'Loading...' : isEnabled ? 'Reservations: On' : 'Reservations: Off'}
          </button>
        </div>

        <label className="mb-1 block text-[9px] font-black uppercase tracking-widest text-primary-light">Laboratory</label>
        {labsLoading ? (
          <div className="h-10 animate-pulse rounded-md border border-border bg-bg-secondary" />
        ) : (
          <select
            value={selectedLabId}
            onChange={(event) => setSelectedLabId(event.target.value)}
            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-primary"
          >
            {labs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.lab_name || lab.name}
              </option>
            ))}
          </select>
        )}

        <div className="mt-3 space-y-2">
          <div>
            <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-primary-light">PC Status</p>
            <div className="flex flex-wrap gap-1.5">
              {PC_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setPcStatusFilter(filter.id)}
                  className={`rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${pcStatusFilter === filter.id ? 'border-primary bg-primary text-white shadow-sm' : 'border-border bg-white text-primary'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-primary-light">Reservation Status</p>
            <div className="flex flex-wrap gap-1.5">
              {RESERVATION_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setPcReservationFilter(filter.id)}
                  className={`rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${pcReservationFilter === filter.id ? 'border-primary bg-primary text-white shadow-sm' : 'border-border bg-white text-primary'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {labsError && <InlineError message={labsError} onRetry={() => fetchLabs(selectedLabId)} />}

        {!labsError && pcsError && <InlineError message={pcsError} onRetry={() => fetchPcs(selectedLabId)} />}

        {!labsError && !pcsError && pcsLoading && <LoadingRows rows={6} />}

        {!labsError && !pcsError && !pcsLoading && pcs.length === 0 && (
          <EmptyState message="No PCs registered for this lab." />
        )}

        {!labsError && !pcsError && !pcsLoading && pcs.length > 0 && filteredPcs.length === 0 && (
          <EmptyState message="No PCs match the selected filters." />
        )}

        {!labsError && !pcsError && !pcsLoading && filteredPcs.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filteredPcs.map((pc) => {
              const disabledReservationStatus = pc.pc_status !== 'active';
              return (
                <div key={pc.id} className="rounded-xl border border-border bg-white p-2.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-primary">PC {String(pc.pc_number).padStart(2, '0')}</p>
                    {pcActionId === pc.id ? <Loader2 className="h-4 w-4 animate-spin text-primary-light" /> : null}
                  </div>

                  <div className="mb-2 flex flex-wrap gap-1">
                    <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase ${pcStatusBadgeClass(pc.pc_status)}`}>
                      {pc.pc_status}
                    </span>
                    <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase ${reservationStatusBadgeClass(pc.reservation_status)}`}>
                      {pc.reservation_status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <select
                      value={pc.pc_status}
                      onChange={(event) => handlePcStatusChange(pc, event.target.value)}
                      className="w-full rounded-xl border border-border bg-bg-secondary px-2 py-1.5 text-[10px] font-bold text-primary"
                      disabled={pcActionId === pc.id}
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                      <option value="under maintenance">Under Maintenance</option>
                    </select>

                    <select
                      value={pc.reservation_status}
                      onChange={(event) => handlePcReservationStatusChange(pc, event.target.value)}
                      className="w-full rounded-xl border border-border bg-bg-secondary px-2 py-1.5 text-[10px] font-bold text-primary disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={disabledReservationStatus || pcActionId === pc.id}
                    >
                      {pc.pc_status !== 'active' ? (
                        <option value="unavailable">Unavailable</option>
                      ) : (
                        <>
                          <option value="open">Open</option>
                          <option value="occupied">Occupied</option>
                          <option value="reserved">Reserved</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderReservationPanel = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-bg-secondary/30 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          <ClipboardList className="h-3.5 w-3.5 text-primary-hover" />
          Reservation Queue
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {RESERVATION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setReservationTab(tab.id)}
              className={`rounded-xl border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest ${reservationTab === tab.id ? 'border-primary bg-primary text-white shadow-sm' : 'border-border bg-white text-primary'}`}
            >
              {tab.label}
              {tab.id === 'pending' && pendingCount > 0 ? (
                  <span className="ml-1 rounded-lg bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-700">
                  {pendingCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {reservationsError && (
          <InlineError message={reservationsError} onRetry={() => fetchReservations(reservationTab)} />
        )}

        {!reservationsError && reservationsLoading && <LoadingRows rows={5} />}

        {!reservationsError && !reservationsLoading && reservations.length === 0 && (
          <EmptyState message={reservationTab === 'all' ? 'No reservations found.' : `No ${reservationTab} reservations.`} />
        )}

        {!reservationsError && !reservationsLoading && reservations.length > 0 && (
          <div className="space-y-2">
            {reservations.map((reservation) => {
              const expanded = expandedReservationId === reservation.id;
              const showWarning = approvalWarningId === reservation.id;

              return (
                <div
                  key={reservation.id}
                  className={`rounded-xl border bg-white p-3 ${highlightedReservationId === reservation.id ? 'border-sky-400 shadow-sm' : 'border-border'}`}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => {
                      setExpandedReservationId(expanded ? null : reservation.id);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-black text-primary">
                            PC {String(reservation.pc_number || '??').padStart(2, '0')}
                          </span>
                          <p className="truncate text-xs font-black tracking-tight text-primary">
                            {reservation.first_name} {reservation.last_name} · {reservation.student_id}
                          </p>
                        </div>
                        <p className="text-[10px] font-bold text-primary-light">
                          {reservation.lab_name} · {formatDisplayDate(reservation.reserved_date)} · {formatDisplayTime(reservation.reserved_time)}
                        </p>
                        <p className="mt-1 text-[9px] font-medium text-primary-light/70 uppercase tracking-wider">{formatRelativeTime(reservation.created_at)}</p>
                      </div>
                      <span className={`shrink-0 rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-widest ${statusBadgeClass(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </div>
                  </button>

                  {expanded && (
                    <div className="mt-3 space-y-3 border-t border-border pt-3">
                      <div className="grid grid-cols-1 gap-2 text-xs text-primary-light md:grid-cols-2">
                        <p><span className="font-semibold text-primary">Student:</span> {reservation.first_name} {reservation.last_name}</p>
                        <p><span className="font-semibold text-primary">ID:</span> {reservation.student_id}</p>
                        <p><span className="font-semibold text-primary">Course/Year:</span> {reservation.course} ({reservation.course_level})</p>
                        <p><span className="font-semibold text-primary">Purpose:</span> {reservation.purpose || 'N/A'}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-primary-light">
                          Common reason (optional)
                        </label>
                        <select
                          value={selectedReasons[reservation.id] || ''}
                          onChange={(event) => {
                            const nextReason = event.target.value;
                            setSelectedReasons((prev) => ({ ...prev, [reservation.id]: nextReason }));
                            if (!nextReason) return;
                            setAdminNotes((prev) => ({ ...prev, [reservation.id]: nextReason }));
                          }}
                          className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-primary"
                        >
                          <option value="">Select a common reason</option>
                          {COMMON_RESCHEDULE_REASONS.map((reason) => (
                            <option key={reason} value={reason}>{reason}</option>
                          ))}
                        </select>
                      </div>

                      <textarea
                        value={adminNotes[reservation.id] || ''}
                        onChange={(event) => setAdminNotes((prev) => ({ ...prev, [reservation.id]: event.target.value }))}
                        placeholder="Add admin note"
                        className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-xs font-bold text-primary"
                        rows={3}
                      />

                      {showWarning && (
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                          <div className="mb-2 flex items-start gap-2">
                            <ShieldAlert className="h-4 w-4 shrink-0" />
                            <span>
                              PC {reservation.pc_number} in {reservation.lab_name} is currently marked as Reserved or Occupied.
                              Approving may cause a conflict.
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                            className="rounded-lg border border-amber-300 bg-white px-2 py-1 text-[10px] font-black uppercase"
                              onClick={() => updateReservationStatus(reservation, 'approved', true)}
                            >
                              Proceed
                            </button>
                            <button
                              type="button"
                            className="rounded-lg border border-amber-300 bg-white px-2 py-1 text-[10px] font-black uppercase"
                              onClick={() => setApprovalWarningId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {reservation.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => updateReservationStatus(reservation, 'approved')}
                            className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700"
                            disabled={reservationActionId === reservation.id}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                        )}

                        {(reservation.status === 'pending' || reservation.status === 'approved') && (
                          <button
                            type="button"
                            onClick={() => updateReservationStatus(reservation, 'rejected')}
                            className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-700"
                            disabled={reservationActionId === reservation.id}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        )}

                        {(reservation.status === 'pending' || reservation.status === 'approved') && (
                          <button
                            type="button"
                            onClick={() => requestStudentReschedule(reservation)}
                            className="inline-flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-sky-700"
                            disabled={reservationActionId === reservation.id}
                          >
                            Notify Reschedule
                          </button>
                        )}

                        {reservationActionId === reservation.id && (
                          <span className="inline-flex items-center gap-2 text-xs text-primary-light">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </span>
                        )}
                      </div>

                      <p className="rounded-xl border border-border bg-bg-secondary p-2 text-[10px] font-bold text-primary-light">
                        Reschedule details are now completed by the student. Use admin note to provide the reason, then click
                        <span className="font-black text-primary"> Notify Reschedule</span>.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderAuditPanel = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-bg-secondary/30 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          <FileText className="h-3.5 w-3.5 text-primary-hover" />
          Audit Log
        </h2>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {EVENT_GROUPS.map((group) => (
              <label key={group.id} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                <input
                  type="checkbox"
                  checked={auditFilters.eventTypes.includes(group.id)}
                  onChange={(event) => {
                    setAuditPage(1);
                    setAuditFilters((prev) => ({
                      ...prev,
                      eventTypes: event.target.checked
                        ? [...prev.eventTypes, group.id]
                        : prev.eventTypes.filter((item) => item !== group.id),
                    }));
                  }}
                />
                {group.label}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="date"
              value={auditFilters.dateFrom}
              onChange={(event) => {
                setAuditPage(1);
                setAuditFilters((prev) => ({ ...prev, dateFrom: event.target.value }));
              }}
              className="rounded-xl border border-border bg-white px-2 py-1.5 text-[10px] font-bold text-primary"
            />
            <input
              type="date"
              value={auditFilters.dateTo}
              onChange={(event) => {
                setAuditPage(1);
                setAuditFilters((prev) => ({ ...prev, dateTo: event.target.value }));
              }}
              className="rounded-xl border border-border bg-white px-2 py-1.5 text-[10px] font-bold text-primary"
            />
          </div>

          <button
            type="button"
            className="rounded-xl border border-border bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary"
            onClick={() => {
              setAuditPage(1);
              setAuditFilters({ eventTypes: [], dateFrom: '', dateTo: '' });
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {auditError && (
          <InlineError message={auditError} onRetry={() => fetchAuditLog(auditPage, auditFilters)} />
        )}

        {!auditError && auditLoading && <LoadingRows rows={6} />}

        {!auditError && !auditLoading && auditEntries.length === 0 && (
          <EmptyState message="No activity logged yet." />
        )}

        {!auditError && !auditLoading && auditEntries.length > 0 && (
          <div className="space-y-2">
            {auditEntries.map((entry) => {
              const reservationId = entry?.reservation_id
                || (String(entry?.description || '').match(/#(\d+)/)?.[1] ?? null);
              return (
                <button
                  type="button"
                  key={entry.id}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-left hover:bg-bg-secondary"
                  onClick={() => onClickAuditEntry(entry)}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${eventBadgeClass(entry.event_type)}`}>
                      {entry.event_type || 'event'}
                    </span>
                    <span className="text-[10px] text-primary-light">
                      {entry.created_at ? formatRelativeTime(entry.created_at) : 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs font-black text-primary">{entry.action || entry.description}</p>
                  <p className="mt-0.5 text-[10px] text-primary-light">{entry.description}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-primary-light">
                    <span>{entry.admin_first_name || entry.actor_name || 'System'}</span>
                    {reservationId ? <span>Reservation #{reservationId}</span> : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-xl border border-border bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary disabled:opacity-50"
            onClick={() => setAuditPage((prev) => Math.max(1, prev - 1))}
            disabled={auditPage <= 1}
          >
            Prev
          </button>
          <span className="text-xs text-primary-light">
            Page {auditPage} of {auditMeta.totalPages}
          </span>
          <button
            type="button"
            className="rounded-xl border border-border bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary disabled:opacity-50"
            onClick={() => setAuditPage((prev) => Math.min(auditMeta.totalPages, prev + 1))}
            disabled={auditPage >= auditMeta.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative animate-fade-in">
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">Operational Control</p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">Reservation Manager</h1>
          </div>
          <div className="h-9 w-9 rounded-lg border border-border bg-bg-secondary flex items-center justify-center shrink-0">
            <Clock3 className="h-4.5 w-4.5 text-primary-hover" />
          </div>
        </div>
      </div>

      <div className="mb-3 flex rounded-xl border border-border bg-white p-1 lg:hidden">
        {MOBILE_PANELS.map((panel) => (
          <button
            key={panel.id}
            type="button"
            className={`flex-1 rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-widest ${mobilePanel === panel.id ? 'bg-primary text-white' : 'text-primary'}`}
            onClick={() => setMobilePanel(panel.id)}
          >
            {panel.label}
          </button>
        ))}
      </div>

      <div className="hidden h-[calc(100vh-11rem)] grid-cols-[1.1fr_2fr_1.3fr] gap-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm lg:grid">
        <div className="border-r border-border">{renderPcPanel()}</div>
        <div className="border-r border-border">{renderReservationPanel()}</div>
        <div>{renderAuditPanel()}</div>
      </div>

      <div className="h-[calc(100vh-14rem)] overflow-hidden rounded-xl border border-border bg-white shadow-sm lg:hidden">
        {mobilePanel === 'pc' && renderPcPanel()}
        {mobilePanel === 'reservations' && renderReservationPanel()}
        {mobilePanel === 'logs' && renderAuditPanel()}
      </div>
    </div>
  );
}
