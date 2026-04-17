import React from 'react';
import { X, Quote, Calendar, User, Star, MessageSquare } from 'lucide-react';

export default function FeedbackViewModal({ isOpen, onClose, feedback }) {
  if (!isOpen || !feedback) return null;

  const { adminRemark, studentRating, studentComment, date, adminName } = feedback;

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#6A9AB0]/10 bg-[#EAD8B1]/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#001F3F]">Session Summary</h3>
            <p className="text-[10px] font-bold text-[#6A9AB0] mt-0.5 flex items-center gap-1.5 uppercase tracking-widest">
              <Calendar className="h-3 w-3" /> {date}
            </p>
          </div>
          <button onClick={onClose} className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors cursor-pointer p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Section 1: Student's Feedback */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3A6D8C] bg-[#3A6D8C]/5 px-3 py-1 rounded-full">Your Rating</span>
                <div className="flex items-center gap-0.5">
                   {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= (studentRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                   ))}
                </div>
             </div>
             {studentComment ? (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                   <p className="text-xs text-[#001F3F]/70 leading-relaxed italic">"{studentComment}"</p>
                </div>
             ) : studentRating ? (
                <p className="text-[10px] text-[#6A9AB0] italic ml-1">No comment provided.</p>
             ) : (
                <p className="text-[10px] text-[#6A9AB0] italic ml-1">You haven't rated this session yet.</p>
             )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#6A9AB0]/20 to-transparent" />

          {/* Section 2: Admin's Remark */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#001F3F]/5 flex items-center justify-center">
                   <User className="h-4 w-4 text-[#001F3F]" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#6A9AB0]">Admin Remarks</p>
                   <p className="text-xs font-extrabold text-[#001F3F]">{adminName || 'Lab Supervisor'}</p>
                </div>
             </div>
             
             {adminRemark ? (
                <div className="relative pl-4 border-l-2 border-[#EAD8B1]">
                   <Quote className="absolute -top-2 -left-2 h-6 w-6 text-[#EAD8B1]/20 -z-1" />
                   <p className="text-sm text-[#001F3F]/80 leading-relaxed font-medium">
                     {adminRemark}
                   </p>
                </div>
             ) : (
                <div className="flex items-center gap-2 text-[#6A9AB0]/50 py-2">
                   <MessageSquare className="h-4 w-4 opacity-20" />
                   <p className="text-[10px] font-bold uppercase tracking-widest italic">No remarks from admin</p>
                </div>
             )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50/50 border-t border-[#6A9AB0]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-[#001F3F] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#3A6D8C] transition-all cursor-pointer shadow-md shadow-[#001F3F]/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
