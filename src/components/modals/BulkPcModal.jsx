import { X, Monitor, CheckSquare, Square, LayoutGrid, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function BulkPcModal({
  isOpen,
  onClose,
  pcs,
  currentLab,
  onApplyPcStatus,
  onApplyReservationStatus,
}) {
  const [selectedPcIds, setSelectedPcIds] = useState([]);
  const [pcStatus, setPcStatus] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragMode(null);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedPcIds([]);
      setPcStatus("");
      setReservationStatus("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const capacity = Number(currentLab?.capacity || 30);
  const selectedPcs = pcs.filter((pc) => selectedPcIds.includes(pc.id));

  const handleMouseDown = (pcId) => {
    setIsDragging(true);
    const isCurrentlySelected = selectedPcIds.includes(pcId);
    const newMode = isCurrentlySelected ? "deselect" : "select";
    setDragMode(newMode);

    if (newMode === "select") {
      setSelectedPcIds((prev) => [...prev, pcId]);
    } else {
      setSelectedPcIds((prev) => prev.filter((id) => id !== pcId));
    }
  };

  const handleMouseEnter = (pcId) => {
    if (isDragging && dragMode) {
      if (dragMode === "select") {
        setSelectedPcIds((prev) => (prev.includes(pcId) ? prev : [...prev, pcId]));
      } else {
        setSelectedPcIds((prev) => prev.filter((id) => id !== pcId));
      }
    }
  };

  const handleSelectAll = () => {
    setSelectedPcIds(
      pcs
        .filter(
          (pc) =>
            pc.reservation_status !== "occupied" &&
            pc.reservation_status !== "reserved"
        )
        .map((pc) => pc.id)
    );
  };

  const handleDeselectAll = () => {
    setSelectedPcIds([]);
  };

  const handleApplyPcStatus = async () => {
    if (!pcStatus || selectedPcs.length === 0) return;
    setIsApplying(true);
    await onApplyPcStatus(selectedPcs, pcStatus);
    setIsApplying(false);
    setSelectedPcIds([]);
    setPcStatus("");
  };

  const handleApplyReservationStatus = async () => {
    if (!reservationStatus || selectedPcs.length === 0) return;
    setIsApplying(true);
    await onApplyReservationStatus(selectedPcs, reservationStatus);
    setIsApplying(false);
    setSelectedPcIds([]);
    setReservationStatus("");
  };

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-primary tracking-tight leading-tight">
                Bulk PC Management
              </h3>
              <p className="text-[11px] font-bold text-primary-light">
                {currentLab
                  ? `${currentLab.lab_code || currentLab.name} - Capacity: ${capacity}`
                  : "Select a lab first"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-secondary text-primary transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* PC Grid Area */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar border-b md:border-b-0 md:border-r border-border bg-bg-secondary/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Workstations
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-lg bg-white border border-border text-[10px] font-black uppercase tracking-widest text-primary-light hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 rounded-lg bg-white border border-border text-[10px] font-black uppercase tracking-widest text-primary-light hover:text-primary hover:border-primary/30 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Square className="w-3.5 h-3.5" />
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 select-none">
              {[...Array(capacity)].map((_, i) => {
                const pcNum = i + 1;
                const pcData = pcs.find((p) => Number(p.pc_number) === pcNum);
                if (!pcData) return null; // Only show registered PCs

                const isSelected = selectedPcIds.includes(pcData.id);
                const isFunctionalActive = pcData.pc_status === "active";
                const isProtected = pcData.reservation_status === "occupied" || pcData.reservation_status === "reserved";

                return (
                  <button
                    key={pcData.id}
                    disabled={isProtected}
                    onMouseDown={() => { if (!isProtected) handleMouseDown(pcData.id) }}
                    onMouseEnter={() => { if (!isProtected) handleMouseEnter(pcData.id) }}
                    className={`
                      relative p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200
                      ${
                        isProtected
                          ? "bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed"
                          : isSelected
                            ? "bg-primary/5 border-primary shadow-sm ring-2 ring-primary/20 scale-[1.02] cursor-pointer"
                            : "bg-white border-border hover:border-primary/30 hover:shadow-sm cursor-pointer"
                      }
                    `}
                  >
                    <div className="absolute top-2 right-2">
                      {isProtected ? (
                         <Square className="w-4 h-4 text-slate-300" />
                      ) : isSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-primary-light/30" />
                      )}
                    </div>

                    <Monitor
                      className={`w-8 h-8 mb-2 ${isFunctionalActive ? "text-primary" : "text-primary-light/50"}`}
                    />
                    <span className="text-xs font-black text-primary mb-1">
                      PC {pcNum}
                    </span>

                    <div className="flex flex-col gap-1 w-full mt-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-center leading-tight uppercase tracking-widest
                        ${
                          pcData.pc_status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : pcData.pc_status === "disabled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }
                      `}
                      >
                        {pcData.pc_status}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-center leading-tight uppercase tracking-widest
                        ${
                          pcData.reservation_status === "open"
                            ? "bg-emerald-50 text-emerald-700"
                            : pcData.reservation_status === "occupied"
                              ? "bg-primary/10 text-primary"
                              : pcData.reservation_status === "reserved"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-500"
                        }
                      `}
                      >
                        {pcData.reservation_status === "open"
                          ? "Available"
                          : pcData.reservation_status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="w-full md:w-72 p-5 bg-white overflow-y-auto custom-scrollbar flex flex-col gap-6">
            <div>
              <div className="mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                  Selected Items
                </h4>
                <p className="text-3xl font-black text-primary tracking-tighter">
                  {selectedPcIds.length}{" "}
                  <span className="text-xs font-bold text-primary-light uppercase tracking-widest ml-1">
                    PCs
                  </span>
                </p>
              </div>

              {/* PC Status Actions */}
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-bg-secondary/30 border border-border">
                <h5 className="text-[9px] font-black uppercase tracking-[0.1em] text-primary-light flex items-center gap-1.5">
                  <Monitor className="w-3 h-3" /> Hardware Status
                </h5>
                <select
                  value={pcStatus}
                  onChange={(e) => setPcStatus(e.target.value)}
                  className="w-full text-xs font-bold py-2 px-3 rounded-lg border border-border bg-white focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all"
                >
                  <option value="">Select status...</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="under maintenance">Maintenance</option>
                </select>
                <button
                  onClick={handleApplyPcStatus}
                  disabled={
                    !pcStatus || selectedPcIds.length === 0 || isApplying
                  }
                  className="w-full py-2 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                >
                  {isApplying ? "Applying..." : "Apply Hardware Status"}
                </button>
              </div>

              {/* Reservation Status Actions */}
              <div className="space-y-3 p-4 rounded-xl bg-bg-secondary/30 border border-border">
                <h5 className="text-[9px] font-black uppercase tracking-[0.1em] text-primary-light flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Booking Status
                </h5>
                <p className="text-[9px] text-primary-light/70 font-bold mb-2">
                  Note: Only affects active PCs.
                </p>
                <select
                  value={reservationStatus}
                  onChange={(e) => setReservationStatus(e.target.value)}
                  className="w-full text-xs font-bold py-2 px-3 rounded-lg border border-border bg-white focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all"
                >
                  <option value="">Select status...</option>
                  <option value="open">Open (Available)</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                </select>
                <button
                  onClick={handleApplyReservationStatus}
                  disabled={
                    !reservationStatus ||
                    selectedPcIds.length === 0 ||
                    isApplying
                  }
                  className="w-full py-2 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                >
                  {isApplying ? "Applying..." : "Apply Booking Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
