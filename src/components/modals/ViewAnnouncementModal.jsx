import React from 'react';
import { X, Calendar, User, Megaphone, AlertCircle, Pin, ExternalLink } from 'lucide-react';
import RichTextRenderer from '../ui/RichTextRenderer';
import { useNavigate } from 'react-router';

export default function ViewAnnouncementModal({ isOpen, onClose, announcement }) {
  const navigate = useNavigate();
  if (!isOpen || !announcement) return null;

  const handleGoToFullPage = () => {
    onClose();
    navigate(`/student/announcements/${announcement.id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 sm:p-6 custom-scrollbar">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-zoom-in border border-border my-auto">
        
        {/* Top Minimal Navigation */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-2.5 text-primary-light/60">
            <div className="w-8 h-8 rounded-xl bg-bg-secondary flex items-center justify-center border border-border">
              <Megaphone className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold">Bulletin Update</span>
          </div>
          <div className="flex items-center gap-2">
            {announcement.isImportant && (
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 shadow-sm animate-pulse" title="Priority Update">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
            )}
            {announcement.isPinned && (
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm" title="Pinned to Top">
                <Pin className="h-4 w-4 text-amber-500 fill-amber-500/20 rotate-45" />
              </div>
            )}
            <div className="w-px h-4 bg-border mx-1" />
            <button 
              onClick={handleGoToFullPage}
              className="p-2 rounded-xl text-primary-light/40 hover:text-primary-hover hover:bg-bg-secondary transition-all cursor-pointer group"
              title="View as Full Page"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-primary-light/40 hover:text-primary hover:bg-bg-secondary transition-all cursor-pointer group"
            >
              <X className="h-5 w-5 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 pb-10">
          <h1 className="text-2xl font-black text-primary leading-tight tracking-tight mt-4 mb-4">
            {announcement.title}
          </h1>

          <div className="flex items-center gap-3 text-[10px] font-bold text-primary-light/50 mb-8 pb-6 border-b border-border/50">
             <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {announcement.date}
             </div>
             <span className="opacity-20">•</span>
             <div className="flex items-center gap-1.5 text-primary-hover">
                <User className="h-3 w-3" />
                {announcement.authorName || announcement.author || 'CCS Admin'}
             </div>
          </div>

          <div className="text-primary/70 font-medium leading-relaxed text-[15px] selection:bg-primary/5">
            <RichTextRenderer text={announcement.body || announcement.content} />
          </div>
        </div>

        {/* Subtle Footer indicator */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      </div>
    </div>
  );
}
