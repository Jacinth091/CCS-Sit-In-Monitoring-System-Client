import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, PieChart, BarChart2, Activity, Calendar, Clock, Loader2, ArrowRight, Users, FlaskConical, Hash, Target, RefreshCw, Trophy, ClipboardList, Medal, Crown } from 'lucide-react';
import { toast } from 'sonner';
import analyticsService from '../../services/analytics.service';
import leaderboardService from '../../services/leaderboard.service';
import reservationService from '../../services/reservation.service';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { ASSET_URL } from '../../config';

/* ── Animated Number Counter ── */
function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const target = parseInt(value, 10) || 0;
    if (target === 0) { 
      const t = setTimeout(() => setDisplay(0), 0); 
      return () => clearTimeout(t); 
    }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{display.toLocaleString()}</span>;
}

/* ── Summary Stat Card ── */
function SummaryStatCard({ icon: Icon, label, value, accent, subtitle, rawValue }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-20 h-20" style={{ color: accent }} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-inner" style={{ backgroundColor: `${accent}10` }}>
            <Icon className="h-4 w-4" style={{ color: accent }} />
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary tracking-tighter">
              {rawValue !== undefined ? rawValue : <AnimatedNumber value={value} />}
            </span>
            {subtitle && <span className="text-[8px] font-black text-primary-light/40 uppercase tracking-widest italic">{subtitle}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Custom SVG Donut Chart ── */
function DonutChart({ data, title, subtitle }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-full bg-white border-border shadow-sm min-h-[300px]">
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-30">
          <Activity className="h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Analytics...</p>
        </div>
      </Card>
    );
  }

  const COLORS = ['#001F3F', '#3A6D8C', '#6A9AB0', '#EAD8B1', '#8FBDD3'];
  const total = data.reduce((s, d) => {
    const val = parseInt(d.count || d.value, 10);
    return s + (isNaN(val) ? 0 : val);
  }, 0);
  const safeTotal = total <= 0 ? 1 : total;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="flex flex-col h-full bg-white border-border shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <PieChart className="h-24 w-24 text-primary" />
      </div>

      <div className="p-4 border-b border-border bg-bg-secondary/20 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">{title}</h3>
          <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
          <PieChart className="h-4 w-4 text-primary-hover" />
        </div>
      </div>

      <div className="p-5 grow flex flex-col items-center justify-center gap-6">
        <div className="relative w-40 h-40 group/chart shrink-0 mt-2">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-lg overflow-visible">
            {data.reduce((acc, d, i) => {
              const rawVal = parseInt(d.count || d.value, 10);
              const val = isNaN(rawVal) ? 0 : rawVal;
              const dash = (val / safeTotal) * circumference;
              const gap = circumference - dash;
              const offset = (acc.cumulative / safeTotal) * circumference;
              const displayLabel = d.lab_code ? `${d.lab_code} - ${d.label || d.name || d.purpose}` : (d.label || d.name || d.purpose);
              const isHovered = hoveredItem?.label === displayLabel;

              acc.circles.push(
                <circle
                  key={`${displayLabel}-${i}`}
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={isHovered ? "14" : "10"}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-100 opacity-80 cursor-pointer"
                  style={{ filter: isHovered ? `drop-shadow(0 0 6px ${COLORS[i % COLORS.length]}40)` : 'none' }}
                  onMouseEnter={() => setHoveredItem({ label: displayLabel, count: val })}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              );
              acc.cumulative += val;
              return acc;
            }, { circles: [], cumulative: 0 }).circles}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`font-black text-primary tracking-tighter transition-all duration-500 ${hoveredItem ? 'text-3xl' : 'text-4xl'}`}>
              {hoveredItem ? hoveredItem.count : total}
            </span>
            <span className="text-[10px] font-black text-primary-light uppercase tracking-widest text-center max-w-[100px] line-clamp-2 italic opacity-60 leading-tight">
              {hoveredItem ? hoveredItem.label : 'Compiled Logs'}
            </span>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-border/60">
          {data.map((d, i) => {
            const label = d.lab_code ? `${d.lab_code} - ${d.label || d.name || d.purpose}` : (d.label || d.name || d.purpose);
            const rawCount = d.count || d.value;
            const count = isNaN(parseInt(rawCount, 10)) ? 0 : parseInt(rawCount, 10);
            const percentage = Math.round((count / safeTotal) * 100);
            const isHovered = hoveredItem?.label === label;

            return (
              <div
                key={`${label}-${i}`}
                className="flex items-center gap-3 group/item cursor-pointer"
                onMouseEnter={() => setHoveredItem({ label, count })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm transition-all duration-500 ${isHovered ? 'scale-125 ring-primary/10' : ''}`}
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-tight transition-colors line-clamp-1 ${isHovered ? 'text-primary' : 'text-primary-light/60'}`}>
                      {label}
                    </span>
                    <span className="text-[8px] font-bold text-primary-light/40 italic">{percentage}%</span>
                  </div>
                  <span className={`text-xs font-black transition-colors ${isHovered ? 'text-primary-hover' : 'text-primary'}`}>
                    {count} <span className="text-[8px] font-normal opacity-40">logs</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ── Custom Stacked Progress Distribution ── */
function StackedDistribution({ data, title, subtitle }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-full bg-white border-border shadow-sm min-h-[300px]">
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-30">
          <Activity className="h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest">No data...</p>
        </div>
      </Card>
    );
  }

  const COLORS = ['#001F3F', '#3A6D8C', '#6A9AB0', '#EAD8B1', '#8FBDD3', '#cbd5e1'];
  const total = data.reduce((s, d) => s + (parseInt(d.count || d.value, 10) || 0), 0);
  const safeTotal = total <= 0 ? 1 : total;

  return (
    <Card className="flex flex-col h-full bg-white border-border shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-secondary/20 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">{title}</h3>
          <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
          <BarChart2 className="h-4 w-4 text-primary-hover" />
        </div>
      </div>

      <div className="p-6 grow flex flex-col justify-center gap-8">
        <div className="w-full h-10 rounded-full flex overflow-hidden shadow-inner border border-border/50">
          {data.map((d, i) => {
            const val = parseInt(d.count || d.value, 10) || 0;
            const percentage = (val / safeTotal) * 100;
            const isHovered = hoveredIdx === i;
            return (
              <div 
                key={i} 
                className={`h-full border-r border-white/20 last:border-0 transition-all duration-300 cursor-pointer ${isHovered ? 'brightness-125 scale-y-110' : 'opacity-90'}`}
                style={{ width: `${percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {data.map((d, i) => {
            const label = d.lab_code ? `${d.lab_code} - ${d.label || d.name || d.purpose}` : (d.label || d.name || d.purpose);
            const val = parseInt(d.count || d.value, 10) || 0;
            const percentage = Math.round((val / safeTotal) * 100);
            const isHovered = hoveredIdx === i;
            return (
              <div 
                key={i} 
                className="flex items-start gap-3 cursor-pointer group/leg"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className={`w-3 h-3 rounded mt-0.5 transition-transform ${isHovered ? 'scale-125 shadow-md' : ''}`} style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest line-clamp-1 transition-colors ${isHovered ? 'text-primary' : 'text-primary-light'}`}>{label}</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-black text-primary">{val}</span>
                    <span className="text-[9px] font-bold text-primary-light/60 italic">{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ── Custom Vertical Bar Chart ── */
function VerticalBarChart({ data, title, subtitle }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-full bg-white border-border shadow-sm min-h-[300px]">
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-30">
          <Activity className="h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest">No data available...</p>
        </div>
      </Card>
    );
  }

  const getAcronym = (name) => {
    if (!name) return '??';
    const words = name.split(/[\s-]+/).filter(Boolean);
    if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  };

  const max = Math.max(...data.map(d => parseInt(d.count || d.value, 10) || 0));
  const safeMax = max <= 0 ? 1 : max;
  
  const padding = { top: 40, right: 30, bottom: 45, left: 40 };
  const width = 1200;  // Greatly expanded width for full-span chart
  const height = 300; 
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const spacing = chartW / Math.max(data.length, 1);
  const barWidth = Math.min(60, spacing * 0.5); // Wider bars

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <Card className="flex flex-col h-full bg-white border-border shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-secondary/20 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">{title}</h3>
          <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
          <BarChart2 className="h-4 w-4 text-primary-hover" />
        </div>
      </div>

      <div className="p-5 grow flex items-center justify-center w-full overflow-x-auto custom-scrollbar">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[700px] overflow-visible">
          <defs>
            <linearGradient id="vBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#001F3F" />
              <stop offset="100%" stopColor="#3A6D8C" />
            </linearGradient>
            <linearGradient id="vBarGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A6D8C" />
              <stop offset="100%" stopColor="#6A9AB0" />
            </linearGradient>
            <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3A6D8C" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Grid lines */}
          {yTicks.map(v => {
            const y = padding.top + chartH - v * chartH;
            return (
              <g key={v}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-[11px] font-black" fill="#94a3b8">{Math.round(v * max)}</text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const rawName = d.label || d.name || d.purpose || '';
            const labCode = d.lab_code || getAcronym(rawName);
            const fullLabel = d.lab_code ? `${d.lab_code} - ${rawName}` : rawName;
            
            const val = parseInt(d.count || d.value, 10) || 0;
            const barH = (val / safeMax) * chartH;
            const x = padding.left + (i * spacing) + (spacing - barWidth) / 2;
            const y = padding.top + chartH - barH;
            const isHovered = hoveredIdx === i;

            // Constrain tooltip X position so it doesn't bleed off edges
            const tooltipW = 160;
            let tooltipX = x + barWidth / 2 - tooltipW / 2;
            if (tooltipX < padding.left) tooltipX = padding.left;
            if (tooltipX + tooltipW > width - padding.right) tooltipX = width - padding.right - tooltipW;

            return (
              <g 
                key={i} 
                onMouseEnter={() => setHoveredIdx(i)} 
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Hit area */}
                <rect x={padding.left + (i * spacing)} y={padding.top} width={spacing} height={chartH} fill="transparent" />
                
                {/* Background Track */}
                <rect 
                  x={x} 
                  y={padding.top} 
                  width={barWidth} 
                  height={chartH} 
                  fill="#f1f5f9" 
                  rx="6" 
                  opacity={isHovered ? 0.8 : 0.4} 
                  className="transition-all duration-300" 
                />

                {/* Actual Data Bar */}
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={barH} 
                  fill={isHovered ? "url(#vBarGradHover)" : "url(#vBarGrad)"}
                  rx="6"
                  filter={isHovered ? "url(#barGlow)" : ""}
                  className="transition-all duration-300"
                />
                
                {/* Tooltip */}
                {isHovered && (
                  <g className="animate-fade-in z-50">
                    <rect x={tooltipX} y={y - 50} width={tooltipW} height={42} rx="8" fill="#001F3F" />
                    <text x={tooltipX + tooltipW / 2} y={y - 32} textAnchor="middle" className="text-[9px] font-black fill-brand-sand uppercase tracking-wider">
                      {fullLabel.length > 25 ? fullLabel.substring(0, 23) + '..' : fullLabel}
                    </text>
                    <text x={tooltipX + tooltipW / 2} y={y - 16} textAnchor="middle" className="text-[13px] font-black fill-white">
                      {val} <tspan className="text-[8px] font-bold opacity-60 uppercase tracking-widest italic">logs</tspan>
                    </text>
                  </g>
                )}
                
                {/* X-axis Label (Short Code only) */}
                <text x={x + barWidth/2} y={padding.top + chartH + 20} textAnchor="middle" className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isHovered ? 'fill-primary' : 'fill-primary-light/60'}`}>{labCode}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

/* ── Actual Podium Leaderboard ── */
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PodiumStep = ({ rank, student }) => {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  
  const heightClass = isFirst ? 'h-28' : isSecond ? 'h-20' : 'h-16';
  const bgClass = isFirst ? 'bg-amber-400' : isSecond ? 'bg-slate-300' : 'bg-amber-700/70';
  const borderClass = isFirst ? 'border-amber-500' : isSecond ? 'border-slate-400' : 'border-amber-800';
  const Icon = isFirst ? Crown : Medal;
  const iconColor = isFirst ? 'text-amber-500 fill-amber-500' : isSecond ? 'text-slate-500 fill-slate-500' : 'text-amber-900 fill-amber-900';

  return (
    <div className="flex flex-col items-center justify-end w-1/3 group">
      <div className="relative mb-3 flex flex-col items-center">
        {isFirst && <Crown className="w-6 h-6 text-amber-500 fill-amber-500 mb-1 animate-bounce" />}
        <div className={`rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-bg-secondary text-primary font-black z-10 relative ${isFirst ? 'w-16 h-16 text-xl' : 'w-12 h-12 text-sm'}`}>
          {student.profile_pic ? (
            <img src={`${ASSET_URL}/${student.profile_pic}`} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
          ) : getInitials(student.student_name)}
        </div>
        <div className="absolute -bottom-2 -right-2 z-20 bg-white rounded-full p-1 shadow-md">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
      </div>
      
      <div className="text-center w-full mb-2">
        <p className="text-[10px] font-black text-primary truncate px-1 uppercase tracking-tight">{student.student_name}</p>
        <p className={`text-[9px] font-black ${isFirst ? 'text-amber-600' : isSecond ? 'text-slate-500' : 'text-amber-800'}`}>
          {student.display_value || student.value}
        </p>
      </div>

      <div className={`w-full rounded-t-xl border-t-2 border-l-2 border-r-2 ${bgClass} ${borderClass} flex items-end justify-center pb-2 ${heightClass} shadow-inner bg-opacity-20`}>
        <span className="text-2xl font-black text-white/50">{rank}</span>
      </div>
    </div>
  );
};

function TopStudentsPodium({ data, title, subtitle }) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-full bg-white border-border shadow-sm min-h-[300px]">
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-30">
          <Trophy className="h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest">No ranking data...</p>
        </div>
      </Card>
    );
  }

  const top5 = [...data].slice(0, 5);

  return (
    <Card className="flex flex-col h-full bg-white border-border shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-secondary/20 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">{title}</h3>
          <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
          <Trophy className="h-4 w-4 text-primary-hover" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-6">
        
        {/* Podium Area */}
        <div className="flex items-end justify-center gap-2 pt-2 px-4 border-b border-border pb-4">
          {top5[1] && <PodiumStep rank={2} student={top5[1]} />}
          {top5[0] && <PodiumStep rank={1} student={top5[0]} />}
          {top5[2] && <PodiumStep rank={3} student={top5[2]} />}
        </div>

        {/* List for 4th and 5th */}
        {top5.length > 3 && (
          <div className="space-y-2 mt-auto">
            {top5.slice(3).map((student, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary/50 border border-border group/row hover:bg-white hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-black text-primary-light shadow-sm">
                    #{i + 4}
                  </div>
                  <span className="text-xs font-black text-primary uppercase tracking-tight group-hover/row:text-primary-hover transition-colors">{student.student_name}</span>
                </div>
                <div className="bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{student.display_value || student.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── Generic Basic List (for Peak Hours) ── */
function BasicLeaderboardList({ data, title, subtitle, icon: Icon = Activity }) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-full bg-white border-border shadow-sm min-h-[300px]">
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-30">
          <Icon className="h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest">No ranking data...</p>
        </div>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => {
    const valA = parseInt(a.count || a.value, 10);
    const valB = parseInt(b.count || b.value, 10);
    return (isNaN(valB) ? 0 : valB) - (isNaN(valA) ? 0 : valA);
  }).slice(0, 5);
  
  const max = Math.max(...sortedData.map(d => parseInt(d.count || d.value, 10) || 0), 1);

  return (
    <Card className="flex flex-col h-full bg-white border-border shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-secondary/20 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">{title}</h3>
          <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
          <Icon className="h-4 w-4 text-primary-hover" />
        </div>
      </div>

      <div className="p-5 grow flex flex-col justify-center gap-4">
        {sortedData.map((d, i) => {
          const label = d.hour ? `${d.hour}:00` : 'Unknown';
          const val = parseInt(d.count || d.value, 10) || 0;
          const percentage = Math.round((val / max) * 100);

          return (
            <div key={i} className="flex items-center gap-4 group/item">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-transform group-hover/item:scale-110 ${i === 0 ? 'bg-[#001F3F] text-brand-sand shadow-md' : i === 1 ? 'bg-[#3A6D8C] text-white shadow-sm' : i === 2 ? 'bg-[#6A9AB0] text-white shadow-sm' : 'bg-bg-secondary text-primary-light border border-border'}`}>
                #{i + 1}
              </div>
              <div className="grow min-w-0 flex flex-col justify-center gap-1.5 mt-0.5">
                <div className="flex justify-between items-end px-0.5">
                  <span className={`text-[10px] font-black uppercase tracking-widest truncate transition-colors ${i < 3 ? 'text-primary' : 'text-primary-light'}`}>
                    {label}
                  </span>
                  <span className={`text-xs font-black transition-colors ${i < 3 ? 'text-primary-hover' : 'text-primary-light'}`}>
                    {val} <span className="text-[8px] font-bold uppercase opacity-50 tracking-widest italic ml-0.5">logs</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${i === 0 ? 'bg-[#001F3F]' : i === 1 ? 'bg-[#3A6D8C]' : i === 2 ? 'bg-[#6A9AB0]' : 'bg-[#8FBDD3]'}`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Custom SVG Line Chart (Bezier Curves) ── */
function LineChart({ data, title, subtitle }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-full bg-white border-border shadow-sm min-h-[300px]">
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-30">
          <Activity className="h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest">No trend data available...</p>
        </div>
      </Card>
    );
  }

  const points = data.map(d => parseInt(d.count || d.value, 10) || 0);
  const labels = data.map(d => d.label || d.date || '');
  const max = Math.max(...points);
  const safeMax = max <= 0 ? 1 : max;
  const totalSessions = points.reduce((a, b) => a + b, 0);
  const avgSessions = points.length ? Math.round(totalSessions / points.length) : 0;

  const padding = { top: 30, right: 35, bottom: 45, left: 45 };
  const width = 640;
  const height = 280;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const stepX = chartW / (points.length - 1 || 1);
  const coords = points.map((p, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + chartH - (p / safeMax) * chartH
  }));

  let pathData = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx = (prev.x + curr.x) / 2;
    pathData += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const areaData = `${pathData} L ${coords[coords.length - 1].x} ${padding.top + chartH} L ${coords[0].x} ${padding.top + chartH} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <Card className="flex flex-col h-full bg-white border-border shadow-sm group hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-secondary/20 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-1">{title}</h3>
          <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden sm:flex items-center gap-4 mr-2">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-primary-light uppercase tracking-widest">Total</span>
              <span className="text-xs font-black text-primary">{totalSessions}</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-primary-light uppercase tracking-widest">Daily Avg</span>
              <span className="text-xs font-black text-primary">{avgSessions}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
            <Activity className="h-4 w-4 text-primary-hover" />
          </div>
        </div>
      </div>

      <div className="p-5 grow flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradientSmooth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A6D8C" stopOpacity="0.25" />
              <stop offset="80%" stopColor="#3A6D8C" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#3A6D8C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradientSmooth" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#001F3F" />
              <stop offset="50%" stopColor="#3A6D8C" />
              <stop offset="100%" stopColor="#EAD8B1" />
            </linearGradient>
          </defs>

          {yTicks.map(v => {
            const y = padding.top + chartH - v * chartH;
            return (
              <g key={v}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#EAD8B1" strokeOpacity="0.25" strokeWidth="1" strokeDasharray={v === 0 ? '0' : '4 3'} />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[9px] font-black" fill="#6A9AB0" fillOpacity="0.8">{Math.round(v * max)}</text>
              </g>
            );
          })}

          <path d={areaData} fill="url(#areaGradientSmooth)" className="animate-fade-in" />
          <path d={pathData} fill="none" stroke="url(#lineGradientSmooth)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {hoveredIdx !== null && (
            <line x1={coords[hoveredIdx].x} y1={padding.top} x2={coords[hoveredIdx].x} y2={padding.top + chartH} stroke="#3A6D8C" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 3" />
          )}

          {coords.map((c, i) => {
            const isHovered = hoveredIdx === i;
            const shortLabel = labels[i] ? (labels[i].length > 5 ? labels[i].slice(5) : labels[i]) : '';
            return (
              <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                <rect x={c.x - stepX / 2} y={padding.top} width={stepX} height={chartH} fill="transparent" />
                {isHovered && <circle cx={c.x} cy={c.y} r="10" fill="#3A6D8C" fillOpacity="0.1" />}
                <circle cx={c.x} cy={c.y} r={isHovered ? 5 : 3.5} fill="white" stroke={isHovered ? '#001F3F' : '#3A6D8C'} strokeWidth={isHovered ? 2.5 : 2} className="transition-all duration-200" />
                {isHovered && (
                  <g>
                    <rect x={c.x - 24} y={c.y - 32} width="48" height="22" rx="6" fill="#001F3F" />
                    <text x={c.x} y={c.y - 17} textAnchor="middle" className="text-[9px] font-black" fill="white">{points[i]}</text>
                  </g>
                )}
                {(i % Math.max(1, Math.floor(points.length / 8)) === 0 || isHovered) && (
                  <text x={c.x} y={padding.top + chartH + 18} textAnchor="middle" className="text-[9px] font-black" fill="#6A9AB0" fillOpacity={isHovered ? 1 : 0.6}>{shortLabel}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reservations, setReservations] = useState({ pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, leaderboardData, pendingRes] = await Promise.all([
        analyticsService.getAnalytics(dateRange.from, dateRange.to),
        leaderboardService.getLeaderboard('hours', 'all'),
        reservationService.getAll('pending')
      ]);
      
      setAnalytics(analyticsData.data);
      setLeaderboard(leaderboardData?.data?.entries || []);
      
      let pendingCount = 0;
      if (Array.isArray(pendingRes)) pendingCount = pendingRes.length;
      else if (Array.isArray(pendingRes?.data)) pendingCount = pendingRes.data.length;
      else if (Array.isArray(pendingRes?.data?.items)) pendingCount = pendingRes.data.items.length;
      else if (Array.isArray(pendingRes?.data?.logs)) pendingCount = pendingRes.data.logs.length;
      
      setReservations({ pending: pendingCount });

    } catch (_err) {
      toast.error('Failed to load comprehensive analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-primary-light animate-pulse">Computing system analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative animate-fade-in">

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">Operational Intelligence</p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">System Analytics</h1>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-secondary p-1.5">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="h-8 text-[10px] border-none bg-transparent w-36 text-primary font-bold uppercase tracking-wider focus:ring-0"
            />
            <ArrowRight className="h-4 w-4 text-primary-light/40" />
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="h-8 text-[10px] border-none bg-transparent w-36 text-primary font-bold uppercase tracking-wider focus:ring-0"
            />
            <button
              onClick={fetchData}
              className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ───── SUMMARY STAT CARDS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-fade-in">
        <SummaryStatCard
          icon={ClipboardList}
          label="Pending Queue"
          value={reservations.pending}
          accent="#F59E0B"
          subtitle="reservations"
        />
        <SummaryStatCard
          icon={Target}
          label="Total Sessions"
          value={analytics?.byPurpose?.reduce((s, d) => s + (parseInt(d.count || d.value || 0, 10) || 0), 0) || 0}
          accent="#3A6D8C"
          subtitle="logged"
        />
        <SummaryStatCard
          icon={FlaskConical}
          label="Active Labs"
          value={analytics?.byLab?.length || 0}
          accent="#6366F1"
          subtitle="tracked"
        />
        <SummaryStatCard
          icon={Users}
          label="Purpose Types"
          value={analytics?.byPurpose?.length || 0}
          accent="#10B981"
          subtitle="categories"
        />
        <SummaryStatCard
          icon={Trophy}
          label="Top Student"
          rawValue={leaderboard.length > 0 ? (leaderboard[0].display_value || leaderboard[0].value || 0) : '0h'}
          value={0}
          accent="#EAB308"
          subtitle="hours"
        />
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500"><TrendingUp className="w-20 h-20" style={{ color: '#EF4444' }} /></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-inner" style={{ backgroundColor: '#EF444410' }}><TrendingUp className="h-4 w-4" style={{ color: '#EF4444' }} /></div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">Peak Hour</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-primary tracking-tighter">
                  {analytics?.peakHours?.length > 0 ? (() => {
                    const peak = analytics.peakHours.reduce((a, b) => {
                      const valA = parseInt(a.count || a.value || 0, 10);
                      const valB = parseInt(b.count || b.value || 0, 10);
                      return (isNaN(valA) ? 0 : valA) > (isNaN(valB) ? 0 : valB) ? a : b;
                    });
                    return (peak.hour || '0') + ':00';
                  })() : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── MAIN ANALYTICS GRID ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChart
            title="Daily Session Trends"
            subtitle="30-Day Volume Snapshot"
            data={analytics?.dailyTrend}
          />
        </div>
        <div className="lg:col-span-1">
          <TopStudentsPodium
            title="Top Ranked Students"
            subtitle="All-Time Validation Leaders"
            data={leaderboard}
          />
        </div>
      </div>

      {/* ───── SECONDARY CHART GRID ───── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BasicLeaderboardList
            title="Peak Engagement"
            subtitle="Top Busiest Hours"
            data={analytics?.peakHours}
            icon={Clock}
          />
        </div>
        <div>
          <VerticalBarChart
            title="Laboratory Traffic"
            subtitle="Frequency of Lab Visits"
            data={analytics?.byLab}
          />
        </div>
        <div>
          <DonutChart
            title="Activity Distribution"
            subtitle="Sit-in Purpose Breakdown"
            data={analytics?.byPurpose}
          />
        </div>
        <div>
          <StackedDistribution
            title="Lab Share"
            subtitle="Proportional Usage"
            data={analytics?.byLab}
          />
        </div>
      </div>

      {/* ───── FOOTER ───── */}
      <div className="mt-10 flex flex-col items-center opacity-50">
        <div className="h-0.5 w-10 bg-brand-sand/50 rounded-full mb-3" />
        <p className="text-[8px] font-black text-primary-light uppercase tracking-[0.2em] text-center">
          Real-time Intelligence Dashboard <br />
          <span className="opacity-70 text-[7px] tracking-[0.1em] mt-1 block">Proprietary Data Systems - CCS Monitoring</span>
        </p>
      </div>
    </div>
  );
}