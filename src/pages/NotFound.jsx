import React from 'react';
import { Search, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EAD8B1]/10 flex flex-col items-center justify-center p-6 text-center selection:bg-primary/10">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center border border-border shadow-xl relative z-10">
          <Search className="h-10 w-10 text-primary-hover" />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 shadow-lg z-20">
          <span className="text-xl font-black text-red-500 tracking-tighter leading-none">404</span>
        </div>
      </div>
      
      <h1 className="text-4xl font-black text-primary tracking-tighter mb-4">
        Page Not Found
      </h1>
      
      <p className="text-sm font-bold text-primary-light uppercase tracking-widest max-w-md leading-relaxed mb-10">
        The resource you are looking for does not exist or has been moved within the system.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-8 py-4 bg-white border border-border text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-bg-secondary transition-all active:scale-95 group w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10 hover:bg-primary-hover transition-all active:scale-95 group w-full sm:w-auto"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Home Dashboard
        </button>
      </div>
    </div>
  );
}
