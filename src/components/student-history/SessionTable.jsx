import React from 'react';
import { Eye, Clock, FlaskConical, MessageSquare, Star, Plus } from 'lucide-react';

export default function SessionTable({ sessions, onOpenFeedback, onOpenEntry }) {
  return (
    <div className="bg-white rounded-3xl border border-[#6A9AB0]/15 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAD8B1]/10 border-b border-[#6A9AB0]/15 whitespace-nowrap">
              <th className="py-5 px-6 text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60">Date</th>
              <th className="py-5 px-6 text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60">Lab Room</th>
              <th className="py-5 px-6 text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60">Purpose</th>
              <th className="py-5 px-6 text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60">Time In/Out</th>
              <th className="py-5 px-6 text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60">Duration</th>
              <th className="py-5 px-6 text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6A9AB0]/10">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-24 text-center bg-gray-50/30">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#EAD8B1]/10 flex items-center justify-center">
                       <FlaskConical className="h-10 w-10 text-[#6A9AB0]/30" />
                    </div>
                    <div className="max-w-xs mx-auto">
                       <h4 className="text-lg font-extrabold text-[#001F3F]">No history found</h4>
                       <p className="text-sm text-[#6A9AB0] mt-1 leading-relaxed">
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
                  <tr key={session.id || idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 px-6 font-bold text-[#001F3F] whitespace-nowrap text-[13px]">
                      {session.date}
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A6D8C]/10 text-[#3A6D8C] text-[10px] font-bold uppercase tracking-widest">
                        {session.lab_name || 'Lab'}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-[#6A9AB0] max-w-[150px] truncate font-bold text-xs">
                      {session.purpose}
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#001F3F]">{session.start_time}</span>
                        {isActive ? (
                           <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold uppercase tracking-wider text-[9px] mt-0.5 animate-pulse">
                              Ongoing
                           </span>
                        ) : (
                           <span className="text-[11px] font-bold text-[#6A9AB0]">{session.end_time}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                       {session.duration ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#EAD8B1]/20 text-[#001F3F]">
                             <Clock className="h-3.5 w-3.5" />
                             {session.duration}
                          </span>
                       ) : (
                          <span className="text-[11px] font-bold text-[#6A9AB0]/40">—</span>
                       )}
                    </td>
                    <td className="py-5 px-6 text-right whitespace-nowrap">
                       <div className="flex items-center justify-end gap-2">
                          {!isActive && (
                             <button
                               onClick={() => onOpenEntry(session)}
                               className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                                 hasRated 
                                   ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                   : 'border-[#6A9AB0]/30 text-[#6A9AB0] hover:bg-gray-50'
                               }`}
                               title={hasRated ? "Edit your rating" : "Rate this session"}
                             >
                                {hasRated ? (
                                   <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                      <span>{session.studentRating}</span>
                                   </div>
                                ) : (
                                   <Plus className="h-3 w-3" />
                                )}
                                {hasRated ? 'Rated' : 'Rate'}
                             </button>
                          )}
                          
                          {(hasRated || hasAdminRemark) && (
                             <button
                               onClick={() => onOpenFeedback(session)}
                               className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#001F3F] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#3A6D8C] transition-all cursor-pointer shadow-md shadow-[#001F3F]/10"
                             >
                                <Eye className="h-3.5 w-3.5" />
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
