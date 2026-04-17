import React, { useState, useEffect } from 'react';
import { X, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentFeedbackModal({ isOpen, onClose, onSubmit, recordId, initialRating = 0, initialComment = '' }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [isOpen, initialRating, initialComment]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ sit_in_id: recordId, rating, comment: comment.trim() });
      toast.success('Feedback submitted! Thank you.');
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#6A9AB0]/10 flex items-center justify-between bg-[#3A6D8C]/5">
          <div>
            <h3 className="text-xl font-extrabold text-[#001F3F]">Rate Your Session</h3>
            <p className="text-xs text-[#6A9AB0] mt-1 font-bold uppercase tracking-widest">How was your laboratory experience?</p>
          </div>
          <button onClick={onClose} className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors cursor-pointer p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
          
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-3">
             <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-all duration-200 hover:scale-110 cursor-pointer"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star 
                      className={`h-10 w-10 transition-colors ${
                        (hover || rating) >= star 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-[#6A9AB0]/20'
                      }`} 
                    />
                  </button>
                ))}
             </div>
             <p className="text-xs font-extrabold text-[#3A6D8C] uppercase tracking-[0.2em]">
                {rating === 5 ? 'Excellent!' : 
                 rating === 4 ? 'Very Good' : 
                 rating === 3 ? 'Good' : 
                 rating === 2 ? 'Fair' : 
                 rating === 1 ? 'Poor' : 'Select a rating'}
             </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-3 ml-1">
              Any specific remarks? (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Tell us about the equipment, internet, or environment..."
              className="w-full rounded-2xl border border-[#6A9AB0]/20 bg-[#EAD8B1]/5 px-5 py-4 text-sm text-[#001F3F] placeholder:text-[#6A9AB0]/30 focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] resize-none transition-all"
            />
            <div className="flex justify-end mt-2 px-1">
              <span className="text-[10px] font-bold text-[#6A9AB0]">{comment.length} / 500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#001F3F] text-white text-sm font-bold hover:bg-[#3A6D8C] transition-all shadow-lg shadow-[#001F3F]/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                 <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                 'Submit Rating'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-xs font-bold text-[#6A9AB0] hover:text-[#001F3F] transition-colors cursor-pointer"
            >
              Maybe later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
