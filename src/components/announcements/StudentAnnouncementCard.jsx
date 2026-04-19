import React from 'react';
import { Clock, Pin, ChevronRight, ShieldAlert, User } from 'lucide-react';
import RichTextRenderer from '../ui/RichTextRenderer';
import { useNavigate } from 'react-router';

/**
 * @typedef {Object} Announcement
 * @property {number|string} id
 * @property {string} title
 * @property {string} body
 * @property {string} date
 * @property {string} authorName
 * @property {string} author
 * @property {boolean} isPinned
 * @property {boolean} isImportant
 * @property {boolean} isUnread
 */

/**
 * StudentAnnouncementCard
 * @param {Object} props
 * @param {Announcement} props.announcement
 */
export default function StudentAnnouncementCard({ announcement }) {
  const { id, title, body, date, authorName, author, isPinned, isImportant, isUnread } = announcement;
  const navigate = useNavigate();
  const displayAuthor = authorName || author || 'CCS Admin';

  return (
    <div
      onClick={() => navigate(`/student/announcements/${id}`)}
      className={`group relative rounded-xl border p-5 shadow-sm transition-all duration-300 bg-white hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col h-full ${isPinned ? 'border-brand-sand/40 bg-bg-secondary/40' : 'border-border'
        }`}
    >
      {/* Logos Container */}
      <div className="flex items-center gap-2 mb-4">
        {isImportant && (
          <div className="w-7 h-7 rounded-lg bg-red-50/50 flex items-center justify-center border border-red-100/50 shadow-sm" title="Priority Update">
            <ShieldAlert className="h-3.5 w-3.5 fill-red-600 text-red-600" />
          </div>
        )}

        {isPinned && (
          <div className="w-7 h-7 rounded-lg bg-amber-50/50 flex items-center justify-center border border-amber-100/50 shadow-sm" title="Pinned to Top">
            <Pin className="h-3.5 w-3.5 fill-amber-600 text-amber-600 rotate-45" />
          </div>
        )}

        {isUnread && !isPinned && !isImportant && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary-hover ml-1" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-black text-primary leading-tight mb-2 tracking-tight group-hover:text-primary-hover transition-colors">
          {title || 'Administrative Update'}
        </h3>

        <div className="text-xs text-primary/60 font-medium leading-relaxed line-clamp-3 mb-4">
          <RichTextRenderer text={body} />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[9px] font-bold text-primary-light/50 uppercase tracking-widest">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="h-3 w-3 opacity-60" />
            {date}
          </div>
          <span className="opacity-20">•</span>
          <div className="flex items-center gap-1.5 text-primary-hover/60 truncate">
            <User className="h-3 w-3" />
            {displayAuthor}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-black text-primary-hover uppercase tracking-[0.15em] group-hover:gap-2 transition-all">
          Read full story <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
