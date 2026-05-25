import React, { useState, useEffect } from 'react';
import { 
  Settings, Sparkles, Loader2, Shield, ArrowLeft,
  Activity, RefreshCw, BarChart2, ShieldAlert, Cpu, 
  Database, AlertCircle, CheckCircle2, Lock, AlertTriangle, XCircle
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import aiService from '../../services/ai.service';

export default function AdminSettings() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const getUsedPercentage = (remaining, limit) => {
    if (!limit || limit === 'N/A') return 0;
    const r = parseFloat(remaining);
    const l = parseFloat(limit);
    if (isNaN(r) || isNaN(l) || l <= 0) return 0;
    return Math.max(0, Math.min(100, ((l - r) / l) * 100));
  };

  const renderHealthBadge = (limitData) => {
    const status = limitData?.status || 'operational';
    const httpCode = limitData?.http_code || 200;
    const retryUntil = limitData?.retry_until;
    const updatedAt = limitData?.updated_at || 'Just now';

    // Calculate remaining cooldown seconds
    let cooldownSeconds = 0;
    if (retryUntil) {
      cooldownSeconds = Math.max(0, Math.ceil(retryUntil - Math.floor(Date.now() / 1000)));
    }

    if (status === 'rate_limited' || cooldownSeconds > 0) {
      return (
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center gap-2.5 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          <div>
            <h4 className="text-[11px] font-bold text-red-800">Rate Limited (429)</h4>
            <p className="text-[9.5px] text-red-700 font-medium">
              {cooldownSeconds > 0 ? `Requests paused. Retry in ${cooldownSeconds}s.` : 'Temporary request pause active.'}
            </p>
          </div>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center gap-2.5">
          <XCircle className="h-4 w-4 text-red-600 shrink-0" />
          <div>
            <h4 className="text-[11px] font-bold text-red-800">Error State (HTTP {httpCode})</h4>
            <p className="text-[9.5px] text-red-700 font-medium">
              API responded with error code. Checked: {updatedAt}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2.5">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold text-emerald-800">Operational &amp; Online</h4>
          <p className="text-[9.5px] text-emerald-700 font-medium">
            Telemetry active. Checked: {updatedAt}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await aiService.getSettings();
      if (res.status === 'success') {
        setAiEnabled(res.data.ai_enabled);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await aiService.getAdminDashboardStats();
      if (res.status === 'success') {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleToggle = async () => {
    const newValue = !aiEnabled;
    setToggling(true);
    try {
      const res = await aiService.updateSettings(newValue);
      if (res.status === 'success') {
        setAiEnabled(res.data.ai_enabled);
        toast.success(
          newValue
            ? 'AI features enabled — live inference is now active across all modules.'
            : 'AI features disabled — all modules have switched to sandbox mode.'
        );
        fetchStats();
      } else {
        throw new Error(res.message || 'Failed to toggle setting');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update AI settings. Please try again.');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">
              Administration
            </p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">
              System Settings
            </h1>
          </div>
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-primary-light text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-bg-secondary transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* AI Feature Toggle Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
            <Sparkles className="h-4 w-4 text-primary-hover" />
          </div>
          <div>
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
              AI Integration Module
            </h3>
            <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest mt-0.5">
              Groq Chatbot &amp; Gemini Analytics Engine
            </p>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-6 w-6 text-primary-hover animate-spin" />
              <p className="text-[10px] font-black text-primary-light uppercase tracking-widest">
                Loading settings...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Toggle Row */}
              <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-bg-secondary/20">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300 ${
                    aiEnabled
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Sparkles className={`h-5 w-5 transition-colors duration-300 ${
                      aiEnabled ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary tracking-tight">
                      AI-Powered Features
                    </h4>
                    <p className="text-[10.5px] text-primary-light font-medium mt-0.5">
                      {aiEnabled
                        ? 'Live inference is active — Chatbot, Insights, and Report Summaries are using real AI models.'
                        : 'Sandbox mode — All AI modules are returning pre-built demo responses.'
                      }
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  className="relative shrink-0 cursor-pointer"
                  aria-label="Toggle AI features"
                >
                  <div className={`w-[52px] h-[28px] rounded-full transition-colors duration-300 ${
                    aiEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}>
                    <div className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-all duration-300 flex items-center justify-center ${
                      aiEnabled ? 'left-[27px]' : 'left-[3px]'
                    }`}>
                      {toggling && <Loader2 className="h-3 w-3 text-primary-light animate-spin" />}
                    </div>
                  </div>
                </button>
              </div>

              {/* Status Detail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  aiEnabled ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`h-3.5 w-3.5 ${aiEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-light">
                      Chatbot
                    </span>
                  </div>
                  <p className="text-xs font-bold text-primary">Groq Llama-3</p>
                  <p className="text-[10px] text-primary-light font-medium mt-1">
                    {aiEnabled ? 'Live — Real-time conversational AI' : 'Sandbox — Demo responses only'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  aiEnabled ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`h-3.5 w-3.5 ${aiEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-light">
                      Analytics
                    </span>
                  </div>
                  <p className="text-xs font-bold text-primary">Gemini Flash</p>
                  <p className="text-[10px] text-primary-light font-medium mt-1">
                    {aiEnabled ? 'Live — Data-driven insight generation' : 'Sandbox — Static sample cards'}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  aiEnabled ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`h-3.5 w-3.5 ${aiEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-light">
                      Report Summary
                    </span>
                  </div>
                  <p className="text-xs font-bold text-primary">Gemini Flash</p>
                  <p className="text-[10px] text-primary-light font-medium mt-1">
                    {aiEnabled ? 'Live — Executive report digest' : 'Sandbox — Placeholder summary'}
                  </p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                    Security Notice
                  </h5>
                  <p className="text-[10.5px] text-amber-700 font-medium mt-1 leading-relaxed">
                    API keys are stored server-side in your <code className="font-mono text-[10px] bg-amber-100 px-1 rounded">.env</code> file and are never exposed to clients.
                    Enabling AI features requires valid <code className="font-mono text-[10px] bg-amber-100 px-1 rounded">GROQ_API_KEY</code> and <code className="font-mono text-[10px] bg-amber-100 px-1 rounded">GEMINI_API_KEY</code> values.
                    Without valid keys, live requests will fail gracefully with a 502 error.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI System Diagnostics & Rate limits */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
              <Activity className="h-4 w-4 text-primary-hover animate-pulse" />
            </div>
            <div>
              <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                AI System Diagnostics &amp; Rate Limits
              </h3>
              <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest mt-0.5">
                Real-time API quota, rate metrics, and security monitors
              </p>
            </div>
          </div>
          <button
            onClick={fetchStats}
            disabled={statsLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-primary-light text-[9px] font-black uppercase tracking-wider hover:text-primary hover:bg-bg-secondary transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh Diagnostics
          </button>
        </div>

        <div className="p-6 space-y-6">
          {statsLoading && !stats ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-6 w-6 text-primary-hover animate-spin" />
              <p className="text-[10px] font-black text-primary-light uppercase tracking-widest">
                Compiling diagnostics...
              </p>
            </div>
          ) : (
            <>
              {/* API Provider Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Groq Primary API Diagnostics */}
                <div className="p-5 rounded-xl border border-border bg-bg-secondary/10 relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-5">
                    <Cpu className="w-16 h-16" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Groq Primary Health
                    </span>
                    <span className="text-[9.5px] text-primary-light font-bold">
                      Model: {stats?.provider_limits?.groq_primary?.model || 'llama-3.3-70b-versatile'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Dynamic health status badge */}
                    {renderHealthBadge(stats?.provider_limits?.groq_primary)}

                    {/* Requests progress */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-primary mb-1.5">
                        <span>Requests Used (RPD)</span>
                        <span>
                          {stats?.provider_limits?.groq_primary?.limit_requests && stats?.provider_limits?.groq_primary?.limit_requests !== 'N/A'
                            ? `${parseInt(stats.provider_limits.groq_primary.limit_requests) - parseInt(stats.provider_limits.groq_primary.remaining_requests)} / ${stats.provider_limits.groq_primary.limit_requests} (${stats.provider_limits.groq_primary.remaining_requests} left)`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" 
                          style={{ width: `${getUsedPercentage(stats?.provider_limits?.groq_primary?.remaining_requests, stats?.provider_limits?.groq_primary?.limit_requests)}%` }}
                        />
                      </div>
                    </div>

                    {/* Tokens progress */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-primary mb-1.5">
                        <span>Tokens Used (TPM)</span>
                        <span>
                          {stats?.provider_limits?.groq_primary?.limit_tokens && stats?.provider_limits?.groq_primary?.limit_tokens !== 'N/A'
                            ? `${parseInt(stats.provider_limits.groq_primary.limit_tokens) - parseInt(stats.provider_limits.groq_primary.remaining_tokens)} / ${stats.provider_limits.groq_primary.limit_tokens} (${stats.provider_limits.groq_primary.remaining_tokens} left)`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                          style={{ width: `${getUsedPercentage(stats?.provider_limits?.groq_primary?.remaining_tokens, stats?.provider_limits?.groq_primary?.limit_tokens)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-primary-light font-bold uppercase tracking-wider">
                      <div>
                        <span className="block text-[8px] text-slate-400">Request Reset</span>
                        <span>{stats?.provider_limits?.groq_primary?.reset_requests || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400">Token Reset</span>
                        <span>{stats?.provider_limits?.groq_primary?.reset_tokens || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Groq Fallback (Llama 4 Scout) Diagnostics */}
                <div className="p-5 rounded-xl border border-border bg-bg-secondary/10 relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-5">
                    <Cpu className="w-16 h-16" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 border border-orange-500/20">
                      Groq Fallback Health
                    </span>
                    <span className="text-[9.5px] text-primary-light font-bold truncate max-w-[140px]">
                      {stats?.provider_limits?.groq_fallback?.model ? 'Llama 4 Scout 17B' : 'Standby / Idle'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Dynamic health status badge */}
                    {renderHealthBadge(stats?.provider_limits?.groq_fallback)}

                    {/* Requests progress */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-primary mb-1.5">
                        <span>Requests Used (RPD)</span>
                        <span>
                          {stats?.provider_limits?.groq_fallback?.limit_requests && stats?.provider_limits?.groq_fallback?.limit_requests !== 'N/A'
                            ? `${parseInt(stats.provider_limits.groq_fallback.limit_requests) - parseInt(stats.provider_limits.groq_fallback.remaining_requests)} / ${stats.provider_limits.groq_fallback.limit_requests} (${stats.provider_limits.groq_fallback.remaining_requests} left)`
                            : '0 / 1000 (1000 left)'
                          }
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500" 
                          style={{ width: `${getUsedPercentage(stats?.provider_limits?.groq_fallback?.remaining_requests || 1000, stats?.provider_limits?.groq_fallback?.limit_requests || 1000)}%` }}
                        />
                      </div>
                    </div>

                    {/* Tokens progress */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-primary mb-1.5">
                        <span>Tokens Used (TPM)</span>
                        <span>
                          {stats?.provider_limits?.groq_fallback?.limit_tokens && stats?.provider_limits?.groq_fallback?.limit_tokens !== 'N/A'
                            ? `${parseInt(stats.provider_limits.groq_fallback.limit_tokens) - parseInt(stats.provider_limits.groq_fallback.remaining_tokens)} / ${stats.provider_limits.groq_fallback.limit_tokens} (${stats.provider_limits.groq_fallback.remaining_tokens} left)`
                            : '0 / 30000 (30000 left)'
                          }
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500" 
                          style={{ width: `${getUsedPercentage(stats?.provider_limits?.groq_fallback?.remaining_tokens || 30000, stats?.provider_limits?.groq_fallback?.limit_tokens || 30000)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-primary-light font-bold uppercase tracking-wider">
                      <div>
                        <span className="block text-[8px] text-slate-400">Request Reset</span>
                        <span>{stats?.provider_limits?.groq_fallback?.reset_requests || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400">Token Reset</span>
                        <span>{stats?.provider_limits?.groq_fallback?.reset_tokens || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gemini API Diagnostics */}
                <div className="p-5 rounded-xl border border-border bg-bg-secondary/10 relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-5">
                    <Database className="w-16 h-16" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Gemini API Health
                    </span>
                    <span className="text-[9.5px] text-primary-light font-bold">
                      Model: {stats?.provider_limits?.gemini?.model || 'gemini-2.5-flash'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Dynamic health status badge */}
                    {renderHealthBadge(stats?.provider_limits?.gemini)}

                    {/* Local requests budget progress */}
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-primary mb-1.5">
                        <span>Daily Request Quota Used (Local)</span>
                        <span>
                          {stats?.provider_limits?.gemini?.limit_requests
                            ? `${parseInt(stats.provider_limits.gemini.limit_requests) - parseInt(stats.provider_limits.gemini.remaining_requests)} / ${stats.provider_limits.gemini.limit_requests} (${stats.provider_limits.gemini.remaining_requests} left)`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                          style={{ width: `${getUsedPercentage(stats?.provider_limits?.gemini?.remaining_requests, stats?.provider_limits?.gemini?.limit_requests)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-primary-light font-bold uppercase tracking-wider">
                      <div>
                        <span className="block text-[8px] text-slate-400">Quota Resets In</span>
                        <span>{stats?.provider_limits?.gemini?.reset_requests || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400">Token Quota</span>
                        <span>{stats?.provider_limits?.gemini?.limit_tokens || '4,000,000 (TPM)'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telemetry Diagnostics Audit Card */}
              {stats?.telemetry_audit && (
                <div className={`p-5 rounded-xl border ${stats.telemetry_audit.triggered ? 'border-amber-200 bg-amber-500/[0.03]' : 'border-border bg-slate-500/[0.02]'} overflow-hidden relative transition-all duration-300`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg flex items-center justify-center border ${stats.telemetry_audit.triggered ? 'bg-amber-100/50 border-amber-200 text-amber-600 animate-pulse' : 'bg-slate-100 border-border text-slate-500'}`}>
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-light">
                          AI-Narrated Diagnostic Audit
                        </h4>
                        <span className={`text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${stats.telemetry_audit.triggered ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'}`}>
                          {stats.telemetry_audit.triggered ? 'Stress Alert Triggered' : 'System Nominal'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed max-w-4xl">
                        {stats.telemetry_audit.summary}
                      </p>
                      <div className="pt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Urgent Recommendation:</span>
                        <span className="text-[10.5px] font-bold text-indigo-600 uppercase tracking-wider">
                          {stats.telemetry_audit.urgent_action}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Global Daily Budget Progress */}
              <div className="p-5 rounded-xl border border-border">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-4">
                  Global System Daily Quotas &amp; Budgets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Chat */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-primary mb-1.5">
                      <span>Daily Chat Limit</span>
                      <span>{stats?.global_limits?.chat?.used || 0} / {stats?.global_limits?.chat?.limit || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-primary transition-all duration-500" 
                        style={{ width: `${(stats?.global_limits?.chat?.used / stats?.global_limits?.chat?.limit) * 100 || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Analysis */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-primary mb-1.5">
                      <span>Daily Insights Limit</span>
                      <span>{stats?.global_limits?.analysis?.used || 0} / {stats?.global_limits?.analysis?.limit || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                        style={{ width: `${(stats?.global_limits?.analysis?.used / stats?.global_limits?.analysis?.limit) * 100 || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-primary mb-1.5">
                      <span>Daily Summary Limit</span>
                      <span>{stats?.global_limits?.summary?.used || 0} / {stats?.global_limits?.summary?.limit || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" 
                        style={{ width: `${(stats?.global_limits?.summary?.used / stats?.global_limits?.summary?.limit) * 100 || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Protection State & Abuse logs */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-light">
                    Intrusion Prevention &amp; Security Logs
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-600 border border-red-500/20">
                    {stats?.active_blocks || 0} active client blocks (last 15m)
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-bg-secondary/40 border-b border-border text-[9px] font-black uppercase tracking-widest text-primary-light">
                        <th className="p-3.5 pl-5">Timestamp</th>
                        <th className="p-3.5">Identifier / User</th>
                        <th className="p-3.5">IP Address</th>
                        <th className="p-3.5">Violation Type</th>
                        <th className="p-3.5 pr-5">Mitigation Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs font-medium text-primary">
                      {!stats?.abuse_logs || stats.abuse_logs.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-primary-light font-bold uppercase tracking-wider">
                            No security incidents logged.
                          </td>
                        </tr>
                      ) : (
                        stats.abuse_logs.map((log) => (
                          <tr key={log.id} className="hover:bg-bg-secondary/20 transition-colors">
                            <td className="p-3.5 pl-5 font-mono text-[10.5px] text-primary-light">
                              {log.attempted_at}
                            </td>
                            <td className="p-3.5 font-bold">
                              {log.identifier}
                            </td>
                            <td className="p-3.5 font-mono text-[11px]">
                              {log.ip_address}
                            </td>
                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                log.failure_type === 'prompt_injection'
                                  ? 'bg-red-50 text-red-700 border border-red-100'
                                  : log.failure_type === 'fingerprint_mismatch'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-slate-50 text-slate-700 border border-slate-100'
                              }`}>
                                <ShieldAlert className="h-3 w-3 shrink-0" />
                                {log.failure_type.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3.5 pr-5 font-bold text-red-600">
                              {log.failure_type === 'prompt_injection' ? 'Block access (10 min cooldown)' : 'Temporary 15 min IP block'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
