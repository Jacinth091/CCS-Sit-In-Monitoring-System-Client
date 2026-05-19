import React from 'react';
import { Search, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-6 text-center selection:bg-primary/10 animate-fade-in">
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center border border-border shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform">
          <Search className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center border border-red-600 shadow-xl z-20 -rotate-12 animate-bounce">
          <span className="text-xl font-black text-white tracking-tighter leading-none">404</span>
        </div>
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
      </div>
      
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-black text-primary tracking-tight uppercase">
          Resource Not Found
        </h1>
        <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.3em] max-w-md leading-relaxed mx-auto opacity-60">
          The terminal you are looking for does not exist or has been relocated within our laboratory network.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-3 px-8 h-14 bg-white border border-border text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-bg-secondary transition-all active:scale-95 group w-full"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Previous Page
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-3 px-8 h-14 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 group w-full"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Back to Terminal
        </button>
      </div>
      
      <div className="mt-16 flex flex-col items-center opacity-30">
        <div className="h-0.5 w-6 bg-primary-light/30 rounded-full mb-4" />
        <p className="text-[8px] font-black uppercase tracking-widest text-primary-light">
          CCS Sit-in Monitoring System
        </p>
      </div>
    </div>
  );
}
