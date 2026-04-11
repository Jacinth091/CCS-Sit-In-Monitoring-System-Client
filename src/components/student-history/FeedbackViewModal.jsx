import React from 'react';
import { X, Quote, Calendar, User } from 'lucide-react';

export default function FeedbackViewModal({ isOpen, onClose, feedback }) {
  if (!isOpen || !feedback) return null;

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Header (Letterhead style) */}
        <div className="px-6 py-5 border-b border-[#6A9AB0]/10 bg-[#EAD8B1]/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#001F3F]">Laboratory Feedback</h3>
            <p className="text-xs text-[#6A9AB0] mt-0.5 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> {feedback.date}
            </p>
          </div>
          <button onClick={onClose} className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors cursor-pointer p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (Letter Style) */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center">
                <User className="h-5 w-5 text-[#3A6D8C]" />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6A9AB0]">From Administrator</p>
                <p className="text-sm font-extrabold text-[#001F3F]">{feedback.adminName || 'Lab Supervisor'}</p>
             </div>
          </div>

          <div className="relative">
            <Quote className="absolute -top-3 -left-3 h-8 w-8 text-[#EAD8B1]/40 -z-1" />
            <blockquote className="text-sm text-[#001F3F]/80 leading-relaxed font-medium italic pl-4 border-l-2 border-[#EAD8B1]">
              "{feedback.message}"
            </blockquote>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-[#6A9AB0]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#001F3F] text-white text-sm font-bold hover:bg-[#3A6D8C] transition-colors cursor-pointer shadow-sm"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
}
