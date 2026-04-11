import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackModal({ isOpen, onClose, onSubmit, studentName, idNumber, recordId }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(recordId, feedbackText);
      toast.success('Feedback submitted successfully');
      setFeedbackText('');
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transition-all scale-100 opacity-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#6A9AB0]/15 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-lg font-extrabold text-[#001F3F]">Provide Feedback</h3>
            <p className="text-xs text-[#6A9AB0]">For {studentName} ({idNumber})</p>
          </div>
          <button onClick={onClose} className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 bg-white">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-2">
            Feedback Notes
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            maxLength={500}
            rows={5}
            placeholder="Write your feedback for this sit-in session..."
            className="w-full rounded-lg border border-[#6A9AB0]/20 bg-[#EAD8B1]/5 px-4 py-3 text-sm text-[#001F3F] placeholder:text-[#6A9AB0]/40 focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#6A9AB0]">{feedbackText.length} / 500</span>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#6A9AB0]/30 text-sm font-bold text-[#001F3F] hover:bg-[#EAD8B1]/25 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !feedbackText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#001F3F] text-white text-sm font-bold hover:bg-[#001F3F]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
