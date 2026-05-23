import React from 'react';
import { Calendar, Clock, Monitor, Hash, Star, Plus, Eye, ArrowUpRight } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';

const SessionCard = ({ session, onOpenFeedback, onOpenEntry }) => {
  const isOngoing = session.status === 'ongoing';
  const hasRated = !!session.studentRating;
  const hasAdminRemark = !!session.adminRemark;

  return (
    <div className="group relative border border-border rounded-xl p-0 transition-all duration-300 bg-white overflow-hidden hover:shadow-md hover:border-primary/20">
      {/* Status Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOngoing ? 'bg-emerald-500 animate-pulse' : 'bg-primary-light/20'}`} />

      <div className="px-5 py-4 sm:px-6 sm:py-5 ml-1">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary leading-tight">
                    {session.pc_number ? `PC ${session.pc_number}` : 'No Station'}
                  </span>
                  {session.lab_code && (
                    <span className="px-1.5 py-0.5 rounded bg-primary/5 text-[10px] font-bold text-primary-light border border-primary/10">
                      {session.lab_code}
                    </span>
                  )}
                </div>
                <p className="text-[12px] font-bold text-primary-light leading-tight">
                  {session.name || 'Laboratory Session'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold text-primary-light">
              <span className="flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1.5 rounded-lg text-primary border border-border/50">
                <Calendar className="h-3.5 w-3.5" />
                {session.date}
              </span>
              <span className="flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1.5 rounded-lg text-primary border border-border/50">
                <Clock className="h-3.5 w-3.5" />
                {session.start_time} {session.end_time ? `— ${session.end_time}` : ''}
              </span>
              {session.duration && (
                <span className="flex items-center gap-1.5 bg-bg-secondary px-2.5 py-1.5 rounded-lg text-primary border border-border/50">
                  <Monitor className="h-3.5 w-3.5" />
                  {session.duration}
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-bg-secondary/60 px-2.5 py-1.5 rounded-lg text-primary-light border border-border/60 text-[10px] font-extrabold tracking-wide">
                {session.purpose}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between self-stretch sm:py-1.5 min-w-[88px]">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
              isOngoing 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-bg-secondary text-primary-light border-border'
            }`}>
              {isOngoing ? 'Ongoing' : 'Completed'}
            </span>
          </div>
        </div>

        {/* Actions Row (Slightly separated) */}
        <div className="mt-5 pt-4 border-t border-dashed border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
             {!isOngoing && (
                <button
                  onClick={() => onOpenEntry(session)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95 ${
                    hasRated 
                      ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100' 
                      : 'border-border bg-white text-primary-light hover:text-primary hover:bg-bg-secondary'
                  }`}
                >
                  {hasRated ? (
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                  {hasRated ? `Rated ${session.studentRating}` : 'Add Rating'}
                </button>
             )}
          </div>

          {(hasRated || hasAdminRemark) && (
            <button
              onClick={() => onOpenFeedback(session)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all cursor-pointer shadow-md shadow-primary/10 active:scale-95"
            >
              <Eye className="h-3.5 w-3.5" />
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SessionTable({ sessions, viewMode = 'card', onOpenFeedback, onOpenEntry }) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border border-dashed p-16 text-center shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center border border-border">
             <Monitor className="h-8 w-8 text-primary-light/30" />
          </div>
          <div className="max-w-xs mx-auto px-4">
             <h4 className="text-lg font-black text-primary tracking-tight">Activity Log Empty</h4>
             <p className="text-xs text-primary-light font-medium mt-1 leading-relaxed">
                You haven't had any sit-in sessions yet. Your laboratory activity will appear here once you've logged in.
             </p>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border">
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Station
                </th>
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Laboratory
                </th>
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Date
                </th>
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Time (In/Out)
                </th>
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Duration
                </th>
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Purpose
                </th>
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Status
                </th>
                <th className="py-3.5 px-5 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sessions.map((session, idx) => {
                const isOngoing = session.status === 'ongoing';
                const hasRated = !!session.studentRating;
                const hasAdminRemark = !!session.adminRemark;

                return (
                  <tr key={session.id || idx} className="hover:bg-bg-secondary/40 transition-colors text-xs font-semibold text-primary">
                    {/* Station */}
                    <td className="py-4 px-5">
                      <span className="text-sm font-black text-primary bg-bg-secondary px-2.5 py-1 rounded-lg border border-border">
                        {session.pc_number ? `PC-${String(session.pc_number).padStart(2, '0')}` : 'No PC'}
                      </span>
                    </td>
                    
                    {/* Laboratory */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {session.lab_code && (
                          <span className="px-1.5 py-0.5 rounded bg-primary/5 text-[9px] font-bold text-primary-light border border-primary/10">
                            {session.lab_code}
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-primary-light">{session.name || 'Laboratory Session'}</span>
                      </div>
                    </td>
                    
                    {/* Date */}
                    <td className="py-4 px-5 text-center text-primary-light/80">
                      {session.date}
                    </td>
                    
                    {/* Time */}
                    <td className="py-4 px-5 text-center text-primary-light/85">
                      {session.start_time} {session.end_time ? `— ${session.end_time}` : ''}
                    </td>
                    
                    {/* Duration */}
                    <td className="py-4 px-5 text-center">
                      {session.duration ? (
                        <span className="bg-bg-secondary px-2.5 py-1 rounded-lg border border-border text-[10px] font-bold text-primary">
                          {session.duration}
                        </span>
                      ) : (
                        <span className="text-primary-light/50">—</span>
                      )}
                    </td>
                    
                    {/* Purpose */}
                    <td className="py-4 px-5 text-primary-light/80 italic font-medium">
                      {session.purpose}
                    </td>
                    
                    {/* Status */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        isOngoing 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-bg-secondary text-primary-light border-border'
                      }`}>
                        {isOngoing ? 'Ongoing' : 'Completed'}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        {!isOngoing && (
                          <button
                            onClick={() => onOpenEntry(session)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95 ${
                              hasRated 
                                ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                : 'border-border bg-white text-primary-light hover:text-primary hover:bg-bg-secondary'
                            }`}
                          >
                            {hasRated ? (
                              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                            ) : (
                              <Plus className="h-2.5 w-2.5" />
                            )}
                            {hasRated ? `Rated ${session.studentRating}` : 'Rate'}
                          </button>
                        )}
                        {(hasRated || hasAdminRemark) && (
                          <button
                            onClick={() => onOpenFeedback(session)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Eye className="h-3 w-3" />
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((session, idx) => (
        <SessionCard 
          key={session.id || idx} 
          session={session} 
          onOpenFeedback={onOpenFeedback} 
          onOpenEntry={onOpenEntry} 
        />
      ))}
    </div>
  );
}
