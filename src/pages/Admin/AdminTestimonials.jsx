import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  CheckSquare,
  Clock,
  Layers,
  Loader2,
  MessageSquare,
  RefreshCw,
  Shield,
  Square,
  Star,
  Trash2,
  User,
  XCircle,
  Quote
} from "lucide-react";

import testimonialService from "../../services/testimonial.service";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, approved
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const result = await testimonialService.getAll();
      setTestimonials(result.data || []);
      setSelectedIds(new Set());
    } catch (err) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    setActionLoading(id);
    const newStatus = !currentStatus;
    try {
      await testimonialService.updateStatus(id, newStatus);
      toast.success(`Testimonial ${newStatus ? "published" : "unpublished"}`);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_approved: newStatus ? 1 : 0 } : t))
      );
    } catch (err) {
      toast.error("Failed to update testimonial status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    setActionLoading(id);
    try {
      await testimonialService.delete(id);
      toast.success("Testimonial deleted successfully");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      if (selectedIds.has(id)) {
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
      }
    } catch (err) {
      toast.error("Failed to delete testimonial");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTestimonials.length && filteredTestimonials.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTestimonials.map((t) => t.id)));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.size === 0) return;
    setIsBulkProcessing(true);
    const idsArray = Array.from(selectedIds);
    let successCount = 0;
    let failCount = 0;

    try {
      if (action === "delete") {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} testimonials?`)) {
          setIsBulkProcessing(false);
          return;
        }
      }

      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)}ing ${selectedIds.size} items...`, { id: "bulk-action" });

      for (const id of idsArray) {
        try {
          if (action === "approve") await testimonialService.updateStatus(id, true);
          else if (action === "unapprove") await testimonialService.updateStatus(id, false);
          else if (action === "delete") await testimonialService.delete(id);
          successCount++;
        } catch (e) {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully ${action}d ${successCount} items`, { id: "bulk-action" });
        fetchTestimonials();
      } else {
        toast.error(`Failed to ${action} items`, { id: "bulk-action" });
      }
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "all") return true;
    if (filter === "pending") return !t.is_approved || t.is_approved == 0;
    if (filter === "approved") return t.is_approved == 1 || t.is_approved === true;
    if (filter === "anonymous") return t.is_anonymous == 1 || t.is_anonymous === true;
    return true;
  });

  const getStats = () => {
    const approved = testimonials.filter((t) => t.is_approved == 1 || t.is_approved === true).length;
    const anonymous = testimonials.filter((t) => t.is_anonymous == 1 || t.is_anonymous === true).length;
    const pending = testimonials.length - approved;
    return { total: testimonials.length, approved, pending, anonymous };
  };

  const stats = getStats();

  if (loading && testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-[12px] bg-brand-sand/20 flex items-center justify-center animate-pulse">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-primary-light">
          Retrieving Feedback...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 animate-fade-in font-['Poppins']">

      {/* ───── ADMIN STANDARD HERO BANNER ───── */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-3.5 w-3.5 text-primary-hover" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">Community Management</p>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-primary tracking-tight">Testimonial Moderation</h1>
            <p className="text-[11px] font-bold text-primary-light">Manage and review {stats.total} student feedback entries.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Published', value: stats.approved, icon: CheckCircle, color: 'text-emerald-500' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-bg-secondary min-w-[130px]">
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-primary-light font-black mb-0.5">{item.label}</p>
                  <p className="text-sm font-black text-primary tracking-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTER & ACTION CONTROL BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-[16px] border border-border shadow-sm">
        <div className="flex items-center p-1 bg-bg-secondary/50 rounded-[12px]">
          {[
            { id: "all", label: "All", icon: Layers },
            { id: "pending", label: "Review", icon: Clock },
            { id: "approved", label: "Published", icon: CheckCircle },
            { id: "anonymous", label: "Anonymous", icon: User },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === f.id
                  ? "bg-primary text-white shadow-md scale-[1.02]"
                  : "text-primary-light hover:text-primary hover:bg-white"
                }`}
            >
              <f.icon className={`h-3.5 w-3.5 ${filter === f.id ? "text-brand-sand" : "opacity-70"}`} />
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2">
          <button
            onClick={fetchTestimonials}
            className="p-2.5 bg-white border border-border rounded-[12px] text-primary hover:bg-bg-secondary hover:border-primary-light transition-all shadow-sm group"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 group-hover:rotate-180 transition-transform duration-700 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── METRICS SUMMARY (Subtle Cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Active Feedback", value: stats.approved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Anonymous", value: stats.anonymous, icon: Shield, color: "text-primary-hover", bg: "bg-primary/5" },
          { label: "Global Reach", value: stats.total, icon: MessageSquare, color: "text-primary", bg: "bg-bg-secondary" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-border flex items-center gap-4 group">
            <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0 border border-white group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-80`} />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-primary-light mb-0.5">{stat.label}</p>
              <p className="text-lg font-black text-primary tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── BULK ACTION CONTROL BAR ── */}
      <div className="bg-bg-secondary/40 border border-border rounded-[12px] p-2 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-2 px-3 py-2 text-primary hover:text-primary-hover transition-colors group"
        >
          <div className="bg-white rounded-[7px] border border-border p-1 group-hover:border-primary-hover transition-colors">
            {selectedIds.size === filteredTestimonials.length && filteredTestimonials.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-primary-light/50" />
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em]">
            {selectedIds.size > 0 ? `${selectedIds.size} Selected` : "Bulk Select"}
          </span>
        </button>

        <div className={`flex items-center gap-2 transition-all duration-300 ${selectedIds.size > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
          <button
            disabled={isBulkProcessing}
            onClick={() => handleBulkAction("approve")}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-[7px] text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Publish
          </button>
          <button
            disabled={isBulkProcessing}
            onClick={() => handleBulkAction("unapprove")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary hover:bg-bg-secondary border border-border rounded-[7px] text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" /> Unpublish
          </button>
          <button
            disabled={isBulkProcessing}
            onClick={() => handleBulkAction("delete")}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-[7px] text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* ── UNIFORM GRID ── */}
      {filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredTestimonials.map((t) => {
            const isSelected = selectedIds.has(t.id);
            const isApproved = t.is_approved == 1 || t.is_approved === true;
            const isLoading = actionLoading === t.id;

            return (
              <div
                key={t.id}
                className={`group flex flex-col bg-white rounded-xl transition-all duration-300 relative border shadow-sm hover:shadow-xl overflow-hidden min-h-[320px] ${isSelected
                    ? "border-primary ring-4 ring-primary/5 bg-primary/[0.01]"
                    : "border-border hover:border-primary-light/30"
                  }`}
              >
                {/* Accent Status Top Bar */}
                <div className={`h-1.5 w-full transition-colors ${isApproved ? 'bg-brand-sand' : 'bg-primary-light/20'}`} />

                {/* Card Header & Actions */}
                <div className="px-5 pt-4 pb-2 flex items-start justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSelect(t.id)}
                      className="p-1 rounded-[7px] bg-bg-secondary border border-border hover:border-primary transition-all"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-primary-light/30" />
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-[6px] text-[8px] font-black uppercase tracking-widest border ${isApproved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                        {isApproved ? "Published" : "Review"}
                      </span>
                      {t.is_anonymous == 1 && (
                        <span className="px-2.5 py-1 rounded-[6px] bg-primary/5 text-primary-light border border-primary/10 text-[8px] font-black uppercase tracking-widest">
                          Anonymous
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Individual Actions */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      disabled={isLoading}
                      onClick={() => handleToggleApproval(t.id, isApproved)}
                      className={`p-1.5 rounded-[8px] border transition-colors ${isApproved
                          ? "bg-white border-border text-primary hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 shadow-sm"
                          : "bg-white border-border text-primary hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm"
                        }`}
                      title={isApproved ? "Unpublish" : "Publish"}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-light" />
                      ) : isApproved ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 bg-white border border-border rounded-[8px] text-primary-light hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                      title="Delete Permanently"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="px-6 py-6 flex flex-col gap-6 grow">
                  {/* Highlighted Rating Stars */}
                  <div className="flex flex-col items-center gap-2 py-2 border-y border-bg-secondary/50 bg-bg-secondary/10 rounded-lg">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-light/60">Student Rating</p>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 transition-all duration-300 ${
                            star <= (t.rating || 5)
                              ? "text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] scale-110"
                              : "text-border fill-bg-secondary opacity-30"
                          }`}
                        />

                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <div className="relative text-center px-2">
                    <Quote className="absolute -top-4 -left-2 h-10 w-10 text-primary/5 rotate-180 -z-0" />
                    <p className="text-[14px] text-primary font-bold leading-relaxed italic line-clamp-[6] relative z-10">
                      "{t.content}"
                    </p>
                  </div>
                </div>

                {/* Author Footer (Full Transparency for Admin) */}
                <div className="mt-auto px-5 py-4 bg-bg-secondary/30 border-t border-border rounded-b-xl flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-[10px] bg-white border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-inner p-0.5">
                      {t.profile_pic ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${t.profile_pic}`}
                          className="w-full h-full object-cover rounded-[8px]"
                          alt="Profile"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center rounded-[8px]">
                          <User className="h-4 w-4 text-primary-light" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[12px] font-black text-primary truncate tracking-tight">
                        {t.first_name} {t.last_name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[8px] font-bold text-primary-light uppercase tracking-widest mt-0.5">
                        <span className="text-primary-hover">{t.course || "Verified Student"}</span>
                        <span className="opacity-30">•</span>
                        {new Date(t.created_at).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {t.is_anonymous == 1 && (
                    <div className="px-2 py-1 rounded-md bg-amber-50 border border-amber-100 flex items-center gap-1.5 shrink-0" title="Hidden from Public Landing Page">
                      <Shield className="h-2.5 w-2.5 text-amber-600" />
                      <span className="text-[7px] font-black text-amber-700 uppercase tracking-tighter">Private Anon</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-border rounded-[12px]">
          <div className="w-16 h-16 rounded-[12px] bg-brand-sand/10 border border-brand-sand/20 flex items-center justify-center mb-5">
            <AlertCircle className="h-8 w-8 text-brand-sand" />
          </div>
          <h3 className="text-lg font-black text-primary tracking-tight mb-2">
            No Testimonials Found
          </h3>
          <p className="text-[11px] font-black text-primary-light uppercase tracking-widest max-w-sm leading-relaxed mb-6">
            There are no messages matching your current filter. The list is silent.
          </p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="px-6 py-3 bg-primary text-white rounded-[7px] text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-colors shadow-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
