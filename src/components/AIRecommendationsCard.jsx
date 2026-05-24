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

  const fetchRecommendations = async (force = false) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await aiService.getBookingRecommendations();
      if (res.status === 'success' && res.data && Array.isArray(res.data.recommended_slots)) {
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
            onClick={() => fetchRecommendations(true)}
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
            onClick={() => fetchRecommendations(true)}
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
            onClick={() => fetchRecommendations(true)}
            className="text-[10px] font-bold text-primary-hover underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ─── LOADED STATE ─── */}
      {recommendations && !isLoading && !error && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Header Title */}
          <div>
            <h5 className="text-[10px] font-black uppercase text-primary-light tracking-wider mb-2.5">
              Recommended Workstations & Timeslots
            </h5>
            
            {/* Recommended Slots Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {recommendations.recommended_slots?.map((slot, idx) => (
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

                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border self-start sm:self-center shrink-0 ${getOccupancyBadgeColor(slot.occupancy_rate)}`}>
                    {slot.occupancy_rate} Traffic
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendations Callout */}
          {recommendations.recommendations && recommendations.recommendations.length > 0 && (
            <div className="pt-4 border-t border-border/80">
              <h5 className="text-[10px] font-black uppercase text-primary-light tracking-wider mb-3">
                Advisor Strategic Notes
              </h5>
              <div className="space-y-2.5">
                {recommendations.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-primary/95 font-medium leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
