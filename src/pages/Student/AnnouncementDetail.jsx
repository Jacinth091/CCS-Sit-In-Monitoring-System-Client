import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, Calendar, User, Megaphone, AlertCircle, Pin, 
  Bookmark, Clock, ChevronRight, Share, MoreHorizontal
} from 'lucide-react';
import announcementService from '../../services/announcement.service';
import RichTextRenderer from '../../components/ui/RichTextRenderer';
import { toast } from 'sonner';
import { formatDate, formatTime } from '../../utils/dateUtils';

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      try {
        const response = await announcementService.getById(id);
        const data = response.data || response;
        if (data) {
          const transformed = {
            ...data,
            date: data.created_at ? `${formatDate(data.created_at)} • ${formatTime(data.created_at)}` : '—',
            authorName: data.admin_username || data.author || 'Lab Administrator',
            authorInitials: (data.admin_username || data.author || 'LA').toString().split(' ').map(n => n[0]).join('').toUpperCase(),
            isImportant: !!(data.is_important || data.isImportant),
            isPinned: !!(data.is_pinned || data.isPinned),
            body: data.content || data.body || ''
          };

          // Calculate reading time
          const wordCount = transformed.body.trim().split(/\s+/).length;
          const readTime = Math.max(1, Math.ceil(wordCount / 200));
          transformed.readingTime = `${readTime} min read`;

          setAnnouncement(transformed);
        } else {
          toast.error('Announcement not found');
          navigate('/student/announcements');
        }
      } catch (err) {
        console.error("Detail Fetch Error:", err);
        toast.error('Failed to load announcement');
        navigate('/student/announcements');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-primary-hover/20 border-t-primary-hover animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-light">Loading...</p>
      </div>
    );
  }

  if (!announcement) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in pb-24">
      
      {/* ───── CONTENT WRAPPER WITH WHITE BACKGROUND ───── */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-border shadow-md overflow-hidden">
        
        {/* Header Section */}
        <div className="px-6 sm:px-10 lg:px-12 pt-10">
          {/* Top Actions & Breadcrumb */}
          <nav className="flex items-center justify-between mb-8">
            <Link 
              to="/student/announcements" 
              className="group flex items-center gap-2 text-[9px] font-bold text-primary-light hover:text-primary transition-colors uppercase tracking-[0.15em]"
            >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> 
              Back to updates
            </Link>

            <div className="flex items-center gap-1.5">
              {announcement.isImportant && (
                <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-widest border border-red-100 rounded">
                  Important
                </span>
              )}
              {announcement.isPinned && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest border border-amber-100 rounded">
                  Pinned
                </span>
              )}
              <span className="px-2 py-0.5 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/10 rounded">
                University Update
              </span>
            </div>
          </nav>

          {/* Title & Metadata */}
          <header className="space-y-5 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary leading-tight tracking-tight">
              {announcement.title}
            </h1>

            <div className="flex items-center justify-between pt-5 border-b border-border pb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-primary-hover/10 flex items-center justify-center text-[10px] font-black text-primary-hover border border-primary-hover/10">
                  {announcement.authorInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-primary uppercase tracking-wide leading-none">{announcement.authorName}</span>
                  <span className="text-[9px] font-bold text-primary-light uppercase tracking-widest mt-1">University Administration</span>
                </div>
              </div>

              <div className="flex items-center gap-5 text-primary-light/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{announcement.date}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{announcement.readingTime}</span>
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Body Content */}
        <div className="px-6 sm:px-10 lg:px-12 pt-10 pb-8">
          <article className="max-w-3xl">
            <div className="text-primary/70 font-normal leading-relaxed text-xs sm:text-sm selection:bg-primary-hover/10">
              <RichTextRenderer text={announcement.body} className="mb-8" />
            </div>
          </article>

          {/* Article Footer */}
          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-5">
            <div className="flex items-center gap-3.5">
               <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors cursor-pointer">Report Issue</button>
               <span className="w-1 h-1 rounded-full bg-border" />
               <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors cursor-pointer">Copy Link</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


