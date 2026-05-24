import React, { useState, useEffect } from 'react';
import aiService from '../services/ai.service';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BarChart2, Lightbulb, AlertTriangle, TrendingUp, Loader2, RefreshCw } from 'lucide-react';

export default function AIAnalyticsInsights() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quota, setQuota] = useState(null);

  const fetchQuota = async () => {
    try {
      const res = await aiService.getQuotaStatus();
      if (res.status === 'success' && res.data?.admin_insights) {
        setQuota(res.data.admin_insights);
      }
    } catch (err) {
      console.warn("Failed to fetch quota status:", err);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  useEffect(() => {
    if (userId) {
      const saved = localStorage.getItem(`admin_insights_${userId}`);
      if (saved) {
        setInsights(JSON.parse(saved));
      } else {
        setInsights(null);
      }
    }
  }, [userId]);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await aiService.getAdminInsights();
      if (res.status === 'success' && Array.isArray(res.data)) {
        setInsights(res.data);
        if (userId) {
          localStorage.setItem(`admin_insights_${userId}`, JSON.stringify(res.data));
        }
        fetchQuota();
      } else {
        throw new Error(res.message || 'No insights returned.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Operational analytics failed to generate. Please try again.';
      setError(msg);
      fetchQuota();
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'utilization':
        return <BarChart2 className="h-4 w-4 text-indigo-600" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-emerald-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-rose-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary-hover" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'utilization':
        return 'bg-indigo-50 border-indigo-100';
      case 'recommendation':
        return 'bg-emerald-50 border-emerald-100';
      case 'alert':
        return 'bg-amber-50 border-amber-100';
      case 'trend':
        return 'bg-rose-50 border-rose-100';
      default:
        return 'bg-bg-secondary border-border';
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'utilization':
        return 'bg-indigo-100 text-indigo-800';
      case 'recommendation':
        return 'bg-emerald-100 text-emerald-800';
      case 'alert':
        return 'bg-amber-100 text-amber-800';
      case 'trend':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col p-6 space-y-6 mt-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.20em] uppercase text-primary-light">
            AI Operations Hub {quota && `(${quota.remaining}/${quota.quota} left)`}
          </h3>
          <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest mt-0.5">
            System Diagnostics & Predictive Trends
          </p>
        </div>
        <div className="flex items-center gap-4">
          {insights && !isLoading && (
            <button
              onClick={fetchInsights}
              className="text-[10px] font-bold text-primary-light hover:text-primary flex items-center gap-1.5 transition-colors cursor-pointer print:hidden"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-Diagnose
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
            <Sparkles className="h-4 w-4 text-primary-hover animate-pulse" />
          </div>
        </div>
      </div>

      {/* ─── INITIAL UNGENERATED STATE ─── */}
      {!insights && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-xl mx-auto space-y-5 print:hidden">
          <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-hover" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary tracking-tight">Run System Diagnostic Engine</h4>
            <p className="text-xs text-primary-light font-medium leading-relaxed mt-1">
              Extract intelligence regarding peak laboratory occupancy, reservation load balancing opportunities, system alerts, and weekly usage surge predictions.
            </p>
          </div>
          <button
            onClick={fetchInsights}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover shadow-sm transition-all duration-300 w-full sm:w-auto cursor-pointer active:scale-[0.98]"
          >
            Run System Diagnosis
          </button>
        </div>
      )}

      {/* ─── LOADING STATE ─── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 text-primary-hover animate-spin" />
          <p className="text-[10px] font-black text-primary-light uppercase tracking-widest animate-pulse">
            Analyzing database traffic metrics...
          </p>
        </div>
      )}

      {/* ─── ERROR STATE ─── */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-sm mx-auto space-y-4 print:hidden">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="text-xs font-bold text-red-600">{error}</p>
          <button
            onClick={fetchInsights}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-secondary cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Retry Diagnosis
          </button>
        </div>
      )}

      {/* ─── LOADED STATE ─── */}
      {insights && !isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {insights.map((card, idx) => (
            <div 
              key={idx}
              className={`p-4.5 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md ${getBgColor(card.type)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-inner border border-white/60 shrink-0">
                  {getIcon(card.type)}
                </div>
                <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getBadgeClass(card.type)}`}>
                  {card.type}
                </span>
              </div>

              <div className="space-y-1 mt-1 grow">
                <h5 className="text-xs font-bold text-primary uppercase tracking-tight line-clamp-1">
                  {card.title}
                </h5>
                <p className="text-[10.5px] text-primary/80 font-medium leading-relaxed">
                  {card.description}
                </p>
              </div>

              {card.value && (
                <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[9px] font-black text-primary-light uppercase tracking-widest">
                    metric status
                  </span>
                  <span className="text-xs font-black text-primary bg-white/70 px-2.5 py-1 rounded-md border border-white/90">
                    {card.value}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
