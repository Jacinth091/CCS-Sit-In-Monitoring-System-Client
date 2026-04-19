import React from 'react';
import { Eye, Clock, FlaskConical, MessageSquare, Star, Plus } from 'lucide-react';

export default function SessionTable({ sessions, onOpenFeedback, onOpenEntry }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-secondary/50 border-b border-border whitespace-nowrap">
              <th className="py-3 px-4 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">Date</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">Lab Room</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">Purpose</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">Time In/Out</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light">Duration</th>
              <th className="py-3 px-4 text-[9px] font-black tracking-[0.2em] uppercase text-primary-light text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16 text-center bg-gray-50/10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center border border-border">
                       <FlaskConical className="h-8 w-8 text-primary-light/30" />
                    </div>
                    <div className="max-w-xs mx-auto px-4">
                       <h4 className="text-lg font-black text-primary tracking-tight">No history found</h4>
                       <p className="text-xs text-primary-light font-medium mt-1 leading-relaxed">
                          You haven't had any sit-in sessions yet. Visit a laboratory to get started!
                       </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sessions.map((session, idx) => {
                const isActive = session.status === 'ongoing';
                const hasRated = !!session.studentRating;
                const hasAdminRemark = !!session.adminRemark;

                return (
                  <tr key={session.id || idx} className="hover:bg-bg-secondary/30 transition-colors group">
                    <td className="py-3 px-4 font-bold text-primary whitespace-nowrap text-xs">
                      {session.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/5 text-primary-hover text-[9px] font-black uppercase tracking-widest border border-primary/10">
                        {session.lab_name || 'Lab'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-primary-light max-w-[150px] truncate font-bold text-[11px] uppercase tracking-wide">
                      {session.purpose}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary">{session.start_time}</span>
                        {isActive ? (
                           <span className="inline-flex items-center gap-1 text-emerald-600 font-black uppercase tracking-widest text-[8px] mt-0.5 animate-pulse">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" /> Ongoing
                           </span>
                        ) : (
                           <span className="text-[10px] font-bold text-primary-light">{session.end_time}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                       {session.duration ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-brand-sand/10 text-primary border border-brand-sand/20">
                             <Clock className="h-3 w-3 text-primary/60" />
                             {session.duration}
                          </span>
                       ) : (
                          <span className="text-[10px] font-bold text-primary-light/40">—</span>
                       )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                       <div className="flex items-center justify-end gap-2.5">
                          {!isActive && (
                             <button
                               onClick={() => onOpenEntry(session)}
                               className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95 ${
                                 hasRated 
                                   ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-amber-200/20' 
                                   : 'border-border bg-white text-primary-light hover:text-primary hover:bg-bg-secondary'
                               }`}
                               title={hasRated ? "Edit your rating" : "Rate this session"}
                             >
                                {hasRated ? (
                                   <div className="flex items-center gap-1">
                                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                      <span>{session.studentRating}</span>
                                   </div>
                                ) : (
                                   <Plus className="h-2.5 w-2.5" />
                                )}
                                {hasRated ? 'Rated' : 'Rate'}
                             </button>
                          )}
                          
                          {(hasRated || hasAdminRemark) && (
                             <button
                               onClick={() => onOpenFeedback(session)}
                               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all cursor-pointer shadow-md shadow-primary/10 active:scale-95"
                             >
                                <Eye className="h-3 w-3" />
                                Details
                             </button>
                          )}
                       </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
