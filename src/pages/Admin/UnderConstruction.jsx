import React from 'react';
import { Hammer, ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-brand-sand/10 flex items-center justify-center mb-8 border border-brand-sand/20 shadow-xl shadow-brand-sand/5 animate-bounce">
        <Construction className="h-10 w-10 text-primary-hover" />
      </div>
      
      <h1 className="text-4xl font-black text-primary tracking-tighter mb-4">
        Under Construction
      </h1>
      
      <p className="text-sm font-bold text-primary-light uppercase tracking-widest max-w-md leading-relaxed mb-10">
        We're currently building this module to provide a better monitoring experience. Please check back later.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10 hover:bg-primary-hover transition-all active:scale-95 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Return to Safety
      </button>
    </div>
  );
}
