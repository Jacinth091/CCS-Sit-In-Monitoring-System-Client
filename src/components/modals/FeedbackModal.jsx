import React, { useState, useEffect } from 'react';
import { X, Loader2, Star, MessageSquare, ShieldCheck } from 'lucide-react';

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  studentName,
  idNumber,
  recordId,
  initialRemark = '',
  studentRating,
  studentComment
}) {
  const [feedbackText, setFeedbackText] = useState(initialRemark);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setFeedbackText(initialRemark || '');
  }, [isOpen, initialRemark]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(recordId, feedbackText);
      onClose();
    } catch {
      // Error handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl border border-border w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">

        {/* ── Header ── */}
        <div className="px-6 py-5 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-primary tracking-tight">Session Feedback</h3>
            <p className="text-xs font-bold text-primary-light mt-0.5">
              {studentName} &nbsp;·&nbsp; <span className="text-primary-light/70">{idNumber}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-primary-light hover:text-primary border border-transparent hover:border-border hover:bg-bg-secondary transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="p-6 space-y-6">

          {/* Student Feedback Section */}
          {(studentRating || studentComment) && (
            <div className="bg-bg-secondary/40 rounded-2xl p-5 border border-border">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary-light mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary-hover" />
                Student's Experience
              </h4>

              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= studentRating ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-primary-light">
                    {studentRating ? `${studentRating} / 5` : 'No rating'}
                  </span>
                </div>

                {studentComment ? (
                  <p className="text-sm text-primary/80 italic leading-relaxed bg-white p-3 rounded-xl border border-border">
                    "{studentComment}"
                  </p>
                ) : (
                  <p className="text-sm text-primary-light italic">No comment provided by student.</p>
                )}
              </div>
            </div>
          )}

          {/* Admin Remarks Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">
                {initialRemark ? 'Update Admin Remarks' : 'Provide Admin Remarks'}
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                maxLength={500}
                rows={5}
                placeholder="Write your session notes, observations, or feedback..."
                className="w-full rounded-xl border border-border bg-bg-secondary/30 px-4 py-3 text-sm text-primary font-medium placeholder:text-primary-light/40 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all resize-none"
              />
              <div className="flex justify-end">
                <span className="text-xs font-bold text-primary-light">{feedbackText.length} / 500</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-primary-light hover:text-primary hover:bg-bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-sm active:scale-95 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {initialRemark ? 'Update Remarks' : 'Submit Remarks'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
