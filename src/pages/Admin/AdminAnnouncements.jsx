import React, { useState, useEffect } from 'react';
import { Plus, Inbox, Send, Loader2, AlertCircle } from 'lucide-react';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import announcementService from '../../services/announcement.service';
import { toast } from 'sonner';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  useEffect(() => {
    fetchAnnouncements(pagination.page);
  }, [pagination.page]);

  const fetchAnnouncements = async (page = 1) => {
    setIsListLoading(true);
    try {
      const response = await announcementService.getAdminAnnouncements(page);
      const rawData = response.data || response;
      const meta = response.meta || { page: 1, last_page: 1, total: rawData.length };

      const transformed = rawData.map(a => ({
        id: a.id,
        title: a.title || 'Admin Update',
        body: a.content || a.body || '',
        status: (a.status || 'Published').charAt(0).toUpperCase() + (a.status || 'Published').slice(1),
        date: new Date(a.created_at || a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        authorName: a.admin_username || a.author || 'CCS Admin',
        authorInitials: (a.admin_username || a.author || 'CA').split(' ').map(n => n[0]).join('').toUpperCase()
      }));

      setAnnouncements(transformed);
      setPagination({
        page: meta.page,
        lastPage: meta.last_page,
        total: meta.total
      });
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setIsListLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    setIsSubmitting(true);
    try {
      await announcementService.create({
        title: newTitle.trim(),
        content: newBody.trim()
      });
      toast.success('Announcement broadcasted!');
      setNewTitle('');
      setNewBody('');
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to post announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-full min-h-0">
        
        {/* Left Column - List */}
        <div className="flex flex-col bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm overflow-hidden h-full">
          <div className="p-4 border-b border-[#6A9AB0]/15 bg-[#EAD8B1]/5">
            <h2 className="text-lg font-extrabold text-[#001F3F] mb-3">Announcements</h2>
            <button 
              onClick={() => { setShowForm(true); setSelectedAnnouncement(null); }}
              className="w-full flex items-center justify-center gap-2 bg-[#001F3F] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-[#001F3F]/90 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" /> New Announcement
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {isListLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#3A6D8C]" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-[#6A9AB0]/60 italic">No announcements found.</p>
              </div>
            ) : (
              <>
                {announcements.map(ann => (
                  <AnnouncementCard 
                    key={ann.id} 
                    announcement={ann} 
                    isSelected={selectedAnnouncement?.id === ann.id}
                    onClick={() => { setSelectedAnnouncement(ann); setShowForm(false); }} 
                  />
                ))}

                {/* Pagination Controls */}
                {pagination.lastPage > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-6 pt-4 border-t border-[#6A9AB0]/10">
                    <button
                      disabled={pagination.page <= 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      className="p-2 rounded-lg border border-[#6A9AB0]/20 text-xs font-bold text-[#001F3F] disabled:opacity-30 hover:bg-[#EAD8B1]/10 transition-colors"
                    >
                      Prev
                    </button>
                    <span className="text-[10px] font-bold text-[#6A9AB0]">
                      {pagination.page} / {pagination.lastPage}
                    </span>
                    <button
                      disabled={pagination.page >= pagination.lastPage}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      className="p-2 rounded-lg border border-[#6A9AB0]/20 text-xs font-bold text-[#001F3F] disabled:opacity-30 hover:bg-[#EAD8B1]/10 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column - Detail or Form */}
        <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm hidden lg:flex flex-col h-full overflow-hidden">
          {showForm ? (
            <div className="p-8 max-w-2xl">
              <h2 className="text-xl font-extrabold text-[#001F3F] mb-6">Create New Announcement</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Announcement Title"
                    className="w-full rounded-lg border border-[#6A9AB0]/20 bg-white px-4 py-2.5 text-sm text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#001F3F]/50 mb-2">Content</label>
                  <textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    rows={8}
                    placeholder="Write your announcement message here..."
                    className="w-full rounded-lg border border-[#6A9AB0]/20 bg-white px-4 py-2.5 text-sm text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-lg border border-[#6A9AB0]/30 text-sm font-bold text-[#001F3F] hover:bg-[#EAD8B1]/25 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTitle.trim() || !newBody.trim()}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-[#3A6D8C] text-white text-sm font-bold hover:bg-[#001F3F] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Broadcast Now
                  </button>
                </div>
              </form>
            </div>
          ) : selectedAnnouncement ? (
            <div className="p-8 h-full flex flex-col">
              <div className="mb-6 border-b border-[#6A9AB0]/10 pb-6">
                <h1 className="text-2xl font-extrabold text-[#001F3F] mb-2">{selectedAnnouncement.title}</h1>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center text-xs font-bold text-[#3A6D8C]">
                    {selectedAnnouncement.authorInitials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#001F3F]">{selectedAnnouncement.authorName}</p>
                    <p className="text-xs text-[#6A9AB0]">{selectedAnnouncement.date}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto text-sm text-[#001F3F]/90 whitespace-pre-wrap leading-relaxed">
                {selectedAnnouncement.body}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#6A9AB0]/60">
              <Inbox className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-sm font-bold">Select an announcement to view details</p>
              <p className="text-xs mt-1">Or click 'New Announcement' to create one.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
