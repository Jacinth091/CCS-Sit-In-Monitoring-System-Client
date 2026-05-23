import React from 'react';
import { X, Quote, Calendar, Star, MessageSquare, User } from 'lucide-react';

export default function FeedbackViewModal({ isOpen, onClose, feedback }) {
  if (!isOpen || !feedback) return null;

  const { adminRemark, studentRating, studentComment, date, adminName } = feedback;

  const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][studentRating] || '';

  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-border">

        {/* ── Header ── */}
        <div className="px-6 py-5 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-primary tracking-tight">Session Summary</h3>
            {date && (
              <p className="text-xs font-bold text-primary-light mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {date}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-primary-light hover:text-primary hover:bg-bg-secondary border border-transparent hover:border-border transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Your Rating ── */}
          <div className="p-5 rounded-2xl bg-bg-secondary/40 border border-border space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-primary-light">Your Rating</p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`h-6 w-6 transition-colors ${s <= (studentRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                ))}
              </div>
              {ratingLabel && (
                <span className="text-sm font-bold text-primary">{ratingLabel}</span>
              )}
            </div>

            {studentComment ? (
              <div className="bg-white rounded-xl p-4 border border-border">
                <p className="text-sm text-primary/80 leading-relaxed italic">"{studentComment}"</p>
              </div>
            ) : studentRating ? (
              <p className="text-sm text-primary-light italic">No comment provided.</p>
            ) : (
              <p className="text-sm text-primary-light italic">You haven't rated this session yet.</p>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* ── Admin Remarks ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary-light uppercase tracking-widest">Admin Remarks</p>
                <p className="text-sm font-black text-primary">{adminName || 'Lab Supervisor'}</p>
              </div>
            </div>

            {adminRemark ? (
              <div className="relative pl-5 border-l-2 border-brand-sand bg-bg-secondary/30 py-3 pr-4 rounded-r-xl">
                <Quote className="absolute -top-2 left-2 h-5 w-5 text-brand-sand/30" />
                <p className="text-sm text-primary/80 leading-relaxed font-medium">{adminRemark}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-4 px-3 rounded-xl border border-dashed border-border">
                <MessageSquare className="h-4 w-4 text-primary-light/40" />
                <p className="text-sm font-bold text-primary-light italic">No remarks from admin yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 bg-bg-secondary/20 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
