import React from 'react';
import { ShieldAlert, Pin } from 'lucide-react';

export default function AnnouncementCard({ announcement, isSelected, onClick }) {
  const { title, body, status, date, authorInitials, authorName, isImportant, isPinned } = announcement;
  
  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border p-4 shadow-sm transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-primary bg-primary/5 ring-1 ring-primary/30' 
          : 'border-border bg-white hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {isImportant && (
             <div className="w-6 h-6 rounded-lg bg-red-50/50 flex items-center justify-center border border-red-100/50 shadow-sm" title="Priority">
               <ShieldAlert className="h-3 w-3 fill-red-600 text-red-600" />
             </div>
          )}
          {isPinned && (
             <div className="w-6 h-6 rounded-lg bg-amber-50/50 flex items-center justify-center border border-amber-100/50 shadow-sm" title="Pinned">
               <Pin className="h-3 w-3 fill-amber-600 text-amber-600 rotate-45" />
             </div>
          )}
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
            status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
          }`}>
            {status}
          </span>
        </div>
        <span className="text-[9px] font-medium text-primary-light whitespace-nowrap">
          {date}
        </span>
      </div>
      <h3 className="text-sm font-bold text-[#001F3F] leading-snug line-clamp-2 mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#6A9AB0] line-clamp-2 leading-relaxed mb-3">
        {body}
      </p>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#001F3F]/10 flex items-center justify-center text-[10px] font-bold text-[#001F3F]">
          {authorInitials}
        </div>
        <span className="text-[10px] font-bold text-[#6A9AB0]">{authorName}</span>
      </div>
    </div>
  );
}
