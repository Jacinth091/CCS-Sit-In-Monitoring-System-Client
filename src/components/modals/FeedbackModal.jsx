import React, { useState, useEffect } from 'react';
import { X, Loader2, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

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
    } catch (error) {
      // Error handled in parent or toast shown here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-bg-primary rounded-none border border-border w-full max-w-lg overflow-hidden transition-all scale-100 opacity-100 shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg-primary">
          <div>
            <h3 className="text-lg font-extrabold text-primary uppercase tracking-wider">Session Feedback</h3>
            <p className="text-xs text-primary-light uppercase tracking-wider">For {studentName} ({idNumber})</p>
          </div>
          <button onClick={onClose} className="text-primary-light hover:text-primary transition-colors duration-150 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-bg-primary space-y-6">
          {/* Student Feedback Section */}
          {(studentRating || studentComment) && (
            <div className="bg-brand-sand/10 rounded-sm p-4 border border-border/50">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-3 flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                Student's Experience
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= studentRating ? 'fill-amber-400 text-amber-400' : 'text-primary/20'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] font-bold text-primary/40 ml-1 uppercase tracking-tighter">
                    {studentRating ? `${studentRating}/5 Rating` : 'No rating'}
                  </span>
                </div>
                
                {studentComment ? (
                  <p className="text-xs text-primary/80 italic leading-relaxed">
                    "{studentComment}"
                  </p>
                ) : (
                  <p className="text-[10px] text-primary/40 italic uppercase">No comment provided by student.</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/50 mb-2">
              {initialRemark ? 'Update Admin Remarks' : 'Provide Admin Remarks'}
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Write your feedback for this sit-in session..."
              className="w-full rounded-sm border border-border bg-brand-sand/5 px-4 py-3 text-sm text-primary placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary-hover/30 focus:border-primary-hover resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-primary-light uppercase tracking-wider">{feedbackText.length} / 500</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm border border-border text-sm font-bold text-primary hover:bg-brand-sand/25 transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {initialRemark ? 'Update Remarks' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
