import React, { useState, useEffect } from 'react';
import { Inbox, Loader2, Search, Filter, ArrowLeft, Megaphone } from 'lucide-react';
import StudentAnnouncementCard from '../../components/announcements/StudentAnnouncementCard';
import announcementService from '../../services/announcement.service';
import { toast } from 'sonner';
import { Link } from 'react-router';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pinned
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });

  useEffect(() => {
    fetchAnnouncements(pagination.page);
  }, [pagination.page]);

  const fetchAnnouncements = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await announcementService.getAll(page);
      
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to fetch announcements');
      }

      const rawData = response.data || [];
      const meta = response.meta || { page: 1, last_page: 1, total: 0 };

      if (!Array.isArray(rawData)) {
        throw new Error('Invalid data format received');
      }

      const transformed = rawData.map(a => ({
        id: a.id,
        title: a.title || 'Administrative Update',
        body: a.content || a.body || '',
        date: a.created_at ? new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
        authorName: a.admin_username || a.author || 'CCS Admin',
        authorInitials: (a.admin_username || a.author || 'CA').toString().split(' ').map(n => n[0]).join('').toUpperCase(),
        isPinned: !!(a.is_pinned || a.isPinned),
        isUnread: true 
      }));

      setAnnouncements(transformed);
      setPagination({
        page: meta.page || 1,
        lastPage: meta.last_page || 1,
        total: meta.total || 0
      });
    } catch (err) {
      console.error("Announcement error:", err);
      toast.error(err.message || 'Failed to load announcements');
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAnnouncements = announcements
    .filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(a => filter === 'all' || (filter === 'pinned' && a.isPinned));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-20">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EAD8B1]/10 border border-[#6A9AB0]/20 mb-4">
           <Megaphone className="h-6 w-6 text-[#3A6D8C]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#001F3F] tracking-tight">University Feed</h1>
        <p className="text-sm text-[#6A9AB0] mt-2 max-w-md mx-auto">
          Official updates, news, and academic policies from the College of Information & Computer Studies.
        </p>
      </div>

      {/* Controls */}
      <div className="sticky top-20 z-30 bg-gray-50/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 rounded-b-2xl border-b border-[#6A9AB0]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6A9AB0]" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6A9AB0]/20 bg-white text-sm text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 transition"
            />
         </div>
         
         <div className="flex bg-white p-1 rounded-xl border border-[#6A9AB0]/10 shadow-sm">
            {[
              { id: 'all', label: 'All Feed' },
              { id: 'pinned', label: 'Important' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  filter === tab.id 
                    ? 'bg-[#001F3F] text-white' 
                    : 'text-[#6A9AB0] hover:text-[#001F3F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
         </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#3A6D8C]" />
            <p className="text-xs font-bold text-[#6A9AB0] animate-pulse uppercase tracking-widest">Updating your feed...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#6A9AB0]/10 shadow-sm px-10">
             <div className="w-20 h-20 rounded-full bg-[#EAD8B1]/10 flex items-center justify-center mx-auto mb-6">
                <Inbox className="h-10 w-10 text-[#6A9AB0]/40" />
             </div>
             <h3 className="text-xl font-extrabold text-[#001F3F]">No Announcements Found</h3>
             <p className="text-sm text-[#6A9AB0] mt-2">
               We couldn't find any announcements matching your current search or filter.
             </p>
             <button 
                onClick={() => { setSearchQuery(''); setFilter('all'); }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#3A6D8C] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#001F3F] transition-all"
             >
               Clear Filters
             </button>
          </div>
        ) : (
          <>
            {filteredAnnouncements.map((ann, idx) => (
              <div key={ann.id} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <StudentAnnouncementCard announcement={ann} />
              </div>
            ))}

            {/* Pagination Controls */}
            {pagination.lastPage > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  className="px-4 py-2 rounded-xl border border-[#6A9AB0]/20 text-xs font-bold uppercase tracking-widest text-[#001F3F] disabled:opacity-30 hover:bg-[#EAD8B1]/10 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-[#6A9AB0]">
                  Page {pagination.page} of {pagination.lastPage}
                </span>
                <button
                  disabled={pagination.page >= pagination.lastPage}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  className="px-4 py-2 rounded-xl border border-[#6A9AB0]/20 text-xs font-bold uppercase tracking-widest text-[#001F3F] disabled:opacity-30 hover:bg-[#EAD8B1]/10 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center">
         <div className="h-1 w-12 bg-[#EAD8B1] mx-auto rounded-full mb-6" />
         <p className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-[0.2em] leading-relaxed">
           University of Cebu <br /> College of Information & Computer Studies
         </p>
      </div>

    </div>
  );
}
