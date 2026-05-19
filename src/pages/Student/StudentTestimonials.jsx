import React, { useState } from 'react';
import { MessageCircle, Send, Star, CheckCircle, Heart, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import testimonialService from '../../services/testimonial.service';
import Card from '../../components/ui/Card';

export default function StudentTestimonials() {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length < 10) {
      return toast.error('Please share a bit more about your experience (min. 10 characters)');
    }

    setLoading(true);
    try {
      const result = await testimonialService.create({ content, rating, is_anonymous: isAnonymous });
      if (result.status === 'success') {
        setSubmitted(true);
        toast.success('Thank you for your kind words!');
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-emerald-50">
           <CheckCircle className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-primary tracking-tighter mb-4 text-center">Appreciation recorded!</h1>
        <p className="text-xs font-bold text-primary-light leading-relaxed mb-10 text-center max-w-md">
           Your feedback has been successfully transmitted to the CCS administrative review board. Thank you for contributing to our community!
        </p>
        <button 
          onClick={() => { setSubmitted(false); setContent(''); }}
          className="px-8 py-4 rounded-xl bg-primary text-white text-[10px] font-bold hover:bg-primary-hover shadow-xl transition-all active:scale-95 cursor-pointer"
        >
           Submit another entry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8 pb-20 animate-fade-in">
      
      {/* ───── HERO SECTION ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary hero-banner border border-border shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-sand/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <Link 
                to="/student/dashboard" 
                className="inline-flex items-center gap-2 text-[9px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back to dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                 Share appreciation
              </h1>
              <p className="text-primary-light/80 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
                Highlight positive laboratory experiences or exceptional staff assistance to help us grow as a community.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="w-11 h-11 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                 <Sparkles className="h-5 w-5 text-brand-sand" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Left Side: Policy & Info */}
        <div className="md:col-span-2 space-y-6">
           <Card className="bg-primary p-8 text-white border-none shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <Heart className="h-8 w-8 text-brand-sand mb-6" />
              <h3 className="text-xs font-bold mb-4">Why it matters</h3>
              <p className="text-[13px] font-medium text-brand-sand/80 leading-relaxed mb-8 italic">
                 "Your testimonials are the primary metrics we use to evaluate staff performance and laboratory facility upgrades."
              </p>
              <div className="space-y-4 pt-6 border-t border-white/10">
                 {[
                   "Boosts institutional morale",
                   "Guides facility investments",
                   "Strengthens student-admin bonds"
                 ].map((tip, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-bold text-white/90">{tip}</span>
                   </div>
                 ))}
              </div>
           </Card>

           <div className="p-6 rounded-2xl border-2 border-dashed border-border flex items-center gap-5 group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/5 transition-colors">
                 <Star className="h-6 w-6 text-amber-400 fill-amber-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-bold text-primary-light leading-loose">
                 "One kind word can <br /> change an entire day."
              </p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-3">
           <Card className="p-8 bg-white shadow-2xl border-primary/5 relative">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-bold text-primary-light flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Message composition
                 </h3>
                 <span className="text-[9px] font-bold text-primary-light/40 italic">Encouraging tone required</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[9px] font-bold text-primary-light ml-1">Satisfaction rating</label>
                    <div className="flex items-center gap-3">
                       {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="p-1.5 hover:scale-125 transition-all cursor-pointer"
                          >
                             <Star className={`h-10 w-10 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400 shadow-amber-200' : 'text-border fill-transparent'}`} />
                          </button>
                       ))}
                       <div className="ml-6 px-4 py-2 rounded-xl bg-bg-secondary border border-border shadow-inner">
                          <span className="text-sm font-bold text-primary tracking-tighter">{rating}/5 Rank</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-bold text-primary-light ml-1">Your testimonial</label>
                    <textarea
                       className="w-full h-52 p-6 rounded-2xl border border-border bg-bg-secondary/50 focus:ring-8 focus:ring-primary/5 focus:bg-white focus:border-primary outline-none transition-all font-bold text-sm text-primary placeholder:text-primary-light/30 shadow-inner"
                       placeholder="Share your positive experience here..."
                       value={content}
                       onChange={(e) => setContent(e.target.value)}
                       required
                    />
                    <div className="flex justify-between items-center px-2">
                       <span className={`text-[10px] font-bold transition-colors ${content.length < 10 ? 'text-red-400' : 'text-emerald-500'}`}>
                          {content.length} / 500
                       </span>
                       <span className="text-[8px] font-bold text-primary-light/40 italic">Press publish when ready</span>
                    </div>
                 </div>

                 <div className="p-4 rounded-2xl bg-bg-secondary border border-border flex items-center justify-between group transition-all hover:border-primary/20">
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-bold text-primary">Post anonymously</h4>
                       <p className="text-[9px] font-bold text-primary-light/60">Your name and profile will be hidden from the public</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAnonymous ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnonymous ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full h-14 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                 >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    Broadcast appreciation
                 </button>
              </form>
           </Card>
        </div>
      </div>

      {/* ───── FOOTER ───── */}
      <div className="mt-12 flex flex-col items-center opacity-40">
         <div className="h-0.5 w-8 bg-brand-sand/50 rounded-full mb-4" />
         <p className="text-[8px] font-bold text-primary-light text-center">
           Community appreciation engine <br /> 
           <span className="opacity-60 text-[7px]">Public Sentiment Division - CCS Monitoring</span>
         </p>
      </div>
    </div>
  );
}
