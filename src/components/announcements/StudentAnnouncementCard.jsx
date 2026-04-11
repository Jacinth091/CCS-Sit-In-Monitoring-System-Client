import React, { useState } from 'react';
import { Calendar, Pin, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * @typedef {Object} Announcement
 * @property {number|string} id
 * @property {string} title
 * @property {string} body
 * @property {string} date
 * @property {string} authorName
 * @property {string} authorInitials
 * @property {boolean} isPinned
 * @property {boolean} isUnread
 */

/**
 * StudentAnnouncementCard
 * @param {Object} props
 * @param {Announcement} props.announcement
 */
export default function StudentAnnouncementCard({ announcement }) {
  const { title, body, date, authorName, authorInitials, isPinned, isUnread } = announcement;
  const [isExpanded, setIsExpanded] = useState(false);
  
  const bodyIsLong = body.length > 200;

  return (
    <div 
      className={`relative rounded-2xl border p-6 shadow-sm transition-all duration-300 bg-white hover:shadow-md hover:-translate-y-0.5 ${
        isPinned ? 'border-amber-100 ring-1 ring-amber-50' : 'border-[#6A9AB0]/15'
      }`}
    >
      {/* Pinned Badge */}
      {isPinned && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
          <Pin className="h-3 w-3 text-amber-500 fill-amber-500 rotate-45" />
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pinned</span>
        </div>
      )}

      {/* Unread Indicator */}
      {isUnread && !isPinned && (
        <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3A6D8C] shadow-sm animate-pulse" />
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold text-[#6A9AB0] flex items-center gap-1 bg-[#6A9AB0]/5 px-2 py-1 rounded-lg uppercase tracking-widest">
          <Calendar className="h-3 w-3" /> {date}
        </span>
      </div>

      <h3 className="text-lg font-extrabold text-[#001F3F] leading-tight mb-3">
        {title || 'Administrative Update'}
      </h3>
      
      <div className={`text-sm text-[#001F3F]/70 leading-relaxed transition-all duration-300 whitespace-pre-wrap ${!isExpanded && bodyIsLong ? 'line-clamp-3' : ''}`}>
        {body}
      </div>

      {bodyIsLong && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-[11px] font-extrabold text-[#3A6D8C] uppercase tracking-widest flex items-center gap-1 hover:text-[#001F3F] transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Read Full Story <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#6A9AB0]/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A6D8C] to-[#001F3F] p-0.5">
           <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-extrabold text-[#3A6D8C]">
             {authorInitials}
           </div>
        </div>
        <div>
           <p className="text-[11px] font-extrabold text-[#001F3F] leading-none mb-0.5">{authorName}</p>
           <p className="text-[9px] font-bold text-[#6A9AB0] uppercase tracking-widest">Lab Administrator</p>
        </div>
      </div>
    </div>
  );
}
