import React, { useState, useEffect } from 'react';
import { X, Loader2, Star, MessageSquare } from 'lucide-react';

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
    if (isOpen) {
      setFeedbackText(initialRemark || '');
    }
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
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl border border-border w-full max-w-md overflow-hidden transition-all shadow-2xl">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-primary tracking-tight">Session Feedback</h3>
            <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest mt-0.5 opacity-60">For {studentName} ({idNumber})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-primary-light hover:text-primary transition-colors border border-transparent hover:border-border">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-white space-y-6">
          {/* Student Feedback Section */}
          {(studentRating || studentComment) && (
            <div className="bg-brand-sand/5 rounded-xl p-4 border border-border/60">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-3 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-primary-hover" />
                Student's Experience
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= studentRating ? 'fill-amber-400 text-amber-400' : 'text-primary/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">
                    {studentRating ? `${studentRating}/5 Rating` : 'No rating'}
                  </span>
                </div>
                
                {studentComment ? (
                  <p className="text-xs text-primary/80 italic leading-relaxed">
                    "{studentComment}"
                  </p>
                ) : (
                  <p className="text-[9px] text-primary/30 italic uppercase">No comment provided by student.</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary-light ml-1">
                {initialRemark ? 'Update Admin Remarks' : 'Provide Admin Remarks'}
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                maxLength={500}
                rows={5}
                placeholder="Write your session notes..."
                className="w-full rounded-xl border border-border bg-bg-secondary/30 px-4 py-3 text-sm text-primary font-medium placeholder:text-primary-light/40 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all resize-none"
              />
              <div className="flex justify-end">
                <span className="text-[9px] font-black text-primary-light/40 uppercase tracking-widest">{feedbackText.length} / 500</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-border text-[10px] font-black uppercase text-primary-light hover:text-primary transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg active:scale-95 disabled:opacity-50 transition-all"
              >
                {isSubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
                {initialRemark ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
