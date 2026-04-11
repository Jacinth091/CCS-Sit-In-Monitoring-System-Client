import React from 'react';

export default function AnnouncementCard({ announcement, isSelected, onClick }) {
  const { title, body, status, date, authorInitials, authorName } = announcement;
  
  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border p-4 shadow-sm transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-[#3A6D8C] bg-[#3A6D8C]/5 ring-1 ring-[#3A6D8C]/30' 
          : 'border-[#6A9AB0]/15 bg-white hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
        }`}>
          {status}
        </span>
        <span className="text-[10px] font-medium text-[#6A9AB0]">
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
