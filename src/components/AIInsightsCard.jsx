import React, { useState, useEffect } from 'react';
import aiService from '../services/ai.service';
import { useAuth } from '../context/AuthContext';
import { Sparkles, BarChart2, Lightbulb, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

export default function AIInsightsCard() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const formatGeneratedTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const isoStr = timeStr.replace(' ', 'T');
      const date = new Date(isoStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return '';
    }
  };

  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quota, setQuota] = useState(null);

  const fetchQuota = async () => {
    try {
      const res = await aiService.getQuotaStatus();
      if (res.status === 'success' && res.data?.student_insights) {
        setQuota(res.data.student_insights);
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
      const saved = localStorage.getItem(`student_insights_${userId}`);
      if (saved) {
        setInsights(JSON.parse(saved));
      } else {
        setInsights(null);
      }
    }
  }, [userId]);

  const [unchangedNotice, setUnchangedNotice] = useState('');

  const fetchInsights = async (bypassCache = false) => {
    setIsLoading(true);
    setError('');
    setUnchangedNotice('');
    try {
      const res = await aiService.getStudentInsights(bypassCache);
      if (res.status === 'success' && res.data && Array.isArray(res.data.cards)) {
        setInsights(res.data);
        if (userId) {
          localStorage.setItem(`student_insights_${userId}`, JSON.stringify(res.data));
        }
        if (res.data._data_unchanged) {
          setUnchangedNotice('Your data has not changed since the last analysis. Showing cached results.');
          setTimeout(() => setUnchangedNotice(''), 6000);
        }
        fetchQuota();
      } else {
        throw new Error(res.message || 'No insights returned.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Could not compile insights. Please try again.';
      setError(msg);
      fetchQuota();
    } finally {
      setIsLoading(false);
    }
  };

  const cards = insights?.cards || (Array.isArray(insights) ? insights : []);
  const summary = insights?.summary || '';

  const getIcon = (type) => {
    switch (type) {
      case 'stat':
        return <BarChart2 className="h-4 w-4 text-emerald-600" />;
      case 'idea':
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary-hover" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'stat':
        return 'bg-emerald-50 border-emerald-100';
      case 'idea':
        return 'bg-blue-50 border-blue-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-bg-secondary border-border';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-hover animate-pulse" />
          <div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.15em] leading-none">
              AI Student Companion {quota && `(${quota.remaining}/${quota.quota} left)`}
            </h4>
            {insights?._generated_at && (
              <p className="text-[8px] text-primary-light font-medium mt-0.5 leading-none">
                Cached at {formatGeneratedTime(insights._generated_at)}
              </p>
            )}
          </div>
        </div>
        {insights && !isLoading && (
          <button 
            onClick={() => fetchInsights(true)}
            className="text-[9px] font-bold text-primary-light hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        )}
      </div>

      {/* ─── DATA UNCHANGED NOTICE ─── */}
      {unchangedNotice && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-semibold mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          {unchangedNotice}
        </div>
      )}

      {/* ─── INITIAL UNGENERATED STATE ─── */}
      {!insights && !isLoading && !error && (
        <div className="text-center py-6 px-2 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="h-5 w-5 text-primary-hover" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary tracking-tight">Unlock Study Analytics</p>
            <p className="text-[10px] text-primary-light font-medium leading-relaxed mt-1">
              Analyze your laboratory hours, session consistency, and traffic patterns to optimize your study pace.
            </p>
          </div>
          <button
            onClick={() => fetchInsights()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary-hover shadow-sm transition-all duration-300 w-full justify-center cursor-pointer active:scale-[0.98]"
          >
            Generate Insights
          </button>
        </div>
      )}

      {/* ─── LOADING STATE ─── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-6 w-6 text-primary-hover animate-spin" />
          <p className="text-[9px] font-black text-primary-light uppercase tracking-widest animate-pulse">
            Consulting model...
          </p>
        </div>
      )}

      {/* ─── ERROR STATE ─── */}
      {error && !isLoading && (
        <div className="text-center py-6 px-2 space-y-3">
          <AlertTriangle className="h-6 w-6 text-red-500 mx-auto" />
          <p className="text-xs font-bold text-red-600">{error}</p>
          <button
            onClick={() => fetchInsights()}
            className="text-[10px] font-bold text-primary-hover underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ─── LOADED STATE ─── */}
      {insights && !isLoading && !error && (
        <div className="space-y-4">
          {summary && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent border border-primary/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1 grow">
                  <h5 className="text-[10px] font-black uppercase text-primary-hover tracking-wider">
                    Executive Lab Activity Summary
                  </h5>
                  <p className="text-xs text-primary font-medium leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {cards.map((card, idx) => (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border flex gap-3 transition-all duration-300 hover:shadow-sm ${getBgColor(card.type)}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-inner border border-white/60 shrink-0">
                  {getIcon(card.type)}
                </div>
                <div className="grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h5 className="text-xs font-bold text-primary truncate tracking-tight uppercase">
                      {card.title}
                    </h5>
                    {card.value && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-white/60 px-1.5 py-0.5 rounded border border-white/80 shrink-0">
                        {card.value}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-primary/80 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
