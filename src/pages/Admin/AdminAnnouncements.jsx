import React, { useState, useEffect } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import announcementService from '../../services/announcement.service';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const annData = await announcementService.getAll();
        setAnnouncements(annData);
      } catch (err) {
        console.error("Failed to load announcements", err);
      } finally {
        setIsAnnouncementsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await announcementService.create({
        title: 'Admin Update',
        body: newAnnouncement.trim()
      });

      const annData = await announcementService.getAll();
      setAnnouncements(annData);
      setNewAnnouncement('');
    } catch (err) {
      setError('Failed to post announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-[#001F3F] mb-2">Announcements</h1>
      <p className="text-sm text-[#6A9AB0] mb-8">Post updates and view historical announcements made by administrators.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Make Announcement */}
        <div>
          <div className="bg-white rounded-xl border border-[#6A9AB0]/15 p-6 shadow-sm sticky top-20">
            <h3 className="text-sm font-bold tracking-wide uppercase text-[#001F3F]/80 mb-4">
              Post a New Announcement
            </h3>
            {error && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded bg-red-50 text-red-700 text-sm border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                rows={5}
                placeholder="What do you want to tell the students?"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#6A9AB0]/20 bg-[#EAD8B1]/5 px-4 py-3 text-sm text-[#001F3F] placeholder:text-[#6A9AB0]/40 focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] transition resize-none disabled:opacity-50"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newAnnouncement.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#3A6D8C] text-[#EAD8B1] text-sm font-bold hover:bg-[#001F3F] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Broadcast Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Feed */}
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-[#001F3F]/80 mb-4 px-1">
            Announcement History
          </h3>

          {isAnnouncementsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#3A6D8C]" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm">
              <p className="text-sm text-[#6A9AB0]/60 italic">No announcements have been posted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="bg-white border hover:border-[#3A6D8C]/30 border-[#6A9AB0]/15 rounded-xl p-5 shadow-sm transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#3A6D8C]">{a.author || 'CCS Admin'}</span>
                    <span className="text-[10px] text-[#6A9AB0]">•</span>
                    <span className="text-[10px] text-[#6A9AB0] font-medium">{a.date}</span>
                  </div>
                  <p className="text-sm text-[#001F3F]/90 leading-relaxed whitespace-pre-wrap">{a.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
