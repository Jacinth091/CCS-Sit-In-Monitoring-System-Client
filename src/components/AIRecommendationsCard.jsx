import React, { useState, useEffect } from 'react';
import aiService from '../services/ai.service';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Clock, MapPin, AlertTriangle, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AIRecommendationsCard() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quota, setQuota] = useState(null);

  const fetchQuota = async () => {
    try {
      const res = await aiService.getQuotaStatus();
      if (res.status === 'success' && res.data?.booking_recommendations) {
        setQuota(res.data.booking_recommendations);
      }
    } catch (err) {
      console.warn("Failed to fetch quota status:", err);
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await aiService.getBookingRecommendations();
      if (res.status === 'success' && res.data && (Array.isArray(res.data.slots) || Array.isArray(res.data.recommended_slots))) {
        setRecommendations(res.data);
        if (userId) {
          localStorage.setItem(`booking_recs_${userId}`, JSON.stringify(res.data));
        }
        fetchQuota();
      } else {
        throw new Error(res.message || 'No recommendations returned.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Could not compile recommendations. Please try again.';
      setError(msg);
      fetchQuota();
    } finally {
      setIsLoading(false);
    }
  };

  const slots = recommendations?.slots || recommendations?.recommended_slots || [];
  const recSummary = recommendations?.summary || '';

  useEffect(() => {
    fetchQuota();
  }, []);

  useEffect(() => {
    if (userId) {
      const saved = localStorage.getItem(`booking_recs_${userId}`);
      if (saved) {
        setRecommendations(JSON.parse(saved));
      } else {
        setRecommendations(null);
      }
    }
  }, [userId]);

  const getOccupancyBadgeColor = (rate) => {
    const r = (rate || '').toLowerCase();
    if (r === 'low') {
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    } else if (r === 'moderate' || r === 'medium') {
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
    return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-hover animate-pulse" />
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">
            AI Schedule Advisor {quota && `(${quota.remaining}/${quota.quota} left)`}
          </h4>
        </div>
        {recommendations && !isLoading && (
          <button 
            onClick={() => fetchRecommendations()}
            className="text-[9px] font-bold text-primary-light hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        )}
      </div>

      {/* ─── INITIAL UNGENERATED STATE ─── */}
      {!recommendations && !isLoading && !error && (
        <div className="text-center py-6 px-2 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
            <Clock className="h-5 w-5 text-primary-hover" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary tracking-tight">Optimize Your Schedule</p>
            <p className="text-[10px] text-primary-light font-medium leading-relaxed mt-1">
              Let AI analyze real-time lab traffic and your reservation history to suggest the best times and workstations for your next session.
            </p>
          </div>
          <button
            onClick={() => fetchRecommendations()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary-hover shadow-sm transition-all duration-300 w-full justify-center cursor-pointer active:scale-[0.98]"
          >
            Generate Recommendations
          </button>
        </div>
      )}

      {/* ─── LOADING STATE ─── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-6 w-6 text-primary-hover animate-spin" />
          <p className="text-[9px] font-black text-primary-light uppercase tracking-widest animate-pulse">
            Analyzing Traffic Patterns...
          </p>
        </div>
      )}

      {/* ─── ERROR STATE ─── */}
      {error && !isLoading && (
        <div className="text-center py-6 px-2 space-y-3">
          <AlertTriangle className="h-6 w-6 text-red-500 mx-auto" />
          <p className="text-xs font-bold text-red-600">{error}</p>
          <button
            onClick={() => fetchRecommendations()}
            className="text-[10px] font-bold text-primary-hover underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ─── LOADED STATE ─── */}
      {recommendations && !isLoading && !error && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Executive Summary Narrative */}
          {recSummary && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent border border-primary/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1 grow">
                  <h5 className="text-[10px] font-black uppercase text-primary-hover tracking-wider">
                    Schedule Advisor Narrative
                  </h5>
                  <p className="text-[11px] text-primary font-medium leading-relaxed">
                    {recSummary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header Title */}
          <div className="flex items-center justify-between mb-2.5">
            <h5 className="text-[10px] font-black uppercase text-primary-light tracking-wider">
              Recommended Workstations & Timeslots
            </h5>
            {recommendations.preference_match && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary animate-pulse">
                <CheckCircle2 className="h-3 w-3" /> Pattern Match
              </span>
            )}
          </div>
            
          {/* Recommended Slots Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {slots.map((slot, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl border border-border bg-bg-secondary/20 hover:border-primary/20 hover:bg-white transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                    <Clock className="h-4 w-4 text-primary-hover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{slot.time}</span>
                      <span className="text-[9px] font-medium text-primary-light">•</span>
                      <span className="text-[10px] font-black text-primary-hover flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {slot.lab}
                      </span>
                    </div>
                    <p className="text-[10px] text-primary-light font-medium mt-0.5 leading-relaxed">
                      {slot.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {slot.available_pcs !== undefined && (
                    <span className="text-[9px] font-bold text-primary-light bg-white/50 px-2 py-0.5 rounded-md border border-white/80">
                      {slot.available_pcs} PCs
                    </span>
                  )}
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${getOccupancyBadgeColor(slot.occupancy_rate)}`}>
                    {slot.occupancy_rate} Traffic
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* PC Warnings */}
          {recommendations.pc_warning && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-2.5 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-[10.5px] font-bold text-amber-700">
                {recommendations.pc_warning}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
