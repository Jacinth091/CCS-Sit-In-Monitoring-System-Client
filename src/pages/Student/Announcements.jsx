import React, { useState, useEffect } from 'react';
import { Inbox, Loader2, Search, ArrowLeft, Megaphone, Plus } from 'lucide-react';
import StudentAnnouncementCard from '../../components/announcements/StudentAnnouncementCard';
import announcementService from '../../services/announcement.service';
import { toast } from 'sonner';
import { Link } from 'react-router';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pinned, important
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });

  // Initial load
  useEffect(() => {
    fetchAnnouncements(1, true);
  }, []);

  // Reset and fetch when filter or search changes
  useEffect(() => {
    fetchAnnouncements(1, true);
  }, [filter]);

  const fetchAnnouncements = async (page = 1, isReset = false) => {
    if (isReset) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response = await announcementService.getAll(page);
      
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to fetch announcements');
      }

      const rawData = response.data || [];
      const meta = response.meta || { page: 1, last_page: 1, total: 0 };

      const transformed = rawData.map(a => ({
        id: a.id,
        title: a.title || 'Administrative Update',
        body: a.content || a.body || '',
        date: a.created_at ? new Date(a.created_at).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : '—',
        authorName: a.admin_username || a.author || 'CCS Admin',
        authorInitials: (a.admin_username || a.author || 'CA').toString().split(' ').map(n => n[0]).join('').toUpperCase(),
        isPinned: !!(a.is_pinned || a.isPinned),
        isImportant: !!(a.is_important || a.isImportant),
        isUnread: true 
      }));

      if (isReset) {
        setAnnouncements(transformed);
      } else {
        setAnnouncements(prev => [...prev, ...transformed]);
      }

      setPagination({
        page: meta.page || 1,
        lastPage: meta.last_page || 1,
        total: meta.total || 0
      });
    } catch (err) {
      console.error("Announcement error:", err);
      toast.error(err.message || 'Failed to load announcements');
      if (isReset) setAnnouncements([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.lastPage) {
      fetchAnnouncements(pagination.page + 1);
    }
  };

  const filteredAnnouncements = announcements
    .filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(a => {
      if (filter === 'all') return true;
      if (filter === 'pinned') return a.isPinned;
      if (filter === 'important') return a.isImportant;
      return true;
    });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-20">
      
      {/* ───── HERO SECTION ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary hero-banner border border-border shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-sand/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <Link 
                to="/student/dashboard" 
                className="inline-flex items-center gap-2 text-[9px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                 University Feed
              </h1>
              <p className="text-primary-light/80 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
                Official updates, news, and academic policies from the University of Cebu - CCS Lab Management.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="w-11 h-11 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                 <Megaphone className="h-5 w-5 text-brand-sand" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── ACTIONS & FILTERS BAR ───── */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 py-1">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-light group-focus-within:text-primary-hover transition-colors" />
            <input
              type="text"
              placeholder="Search news & updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-xs text-primary placeholder:text-primary-light/50 focus:outline-none focus:ring-2 focus:ring-primary-hover/20 focus:border-primary-hover transition-all shadow-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-white border border-border rounded-xl p-1 w-full sm:w-auto shadow-sm">
            {[
              { id: 'all', label: 'All Feed' },
              { id: 'pinned', label: 'Pinned' },
              { id: 'important', label: 'Important' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer grow sm:grow-0 ${
                  filter === tab.id 
                    ? 'bg-primary-hover text-white shadow-md' 
                    : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Total Count Display */}
        <div className="hidden lg:flex items-center gap-2.5 text-primary-light">
          <div className="h-px w-6 bg-border" />
          <span className="text-[9px] font-bold whitespace-nowrap">
            Showing {filteredAnnouncements.length} of {pagination.total} updates
          </span>
          <div className="h-px w-6 bg-border" />
        </div>
      </div>

      {/* ───── FEED CONTENT ───── */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
             <div className="relative">
               <div className="w-12 h-12 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
               <Megaphone className="h-5 w-5 text-primary-hover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             <div className="text-center space-y-1">
               <p className="text-xs font-bold text-primary">Synchronizing Feed</p>
               <p className="text-[10px] text-primary-light font-medium">Checking for new updates...</p>
             </div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-10 bg-white rounded-xl border border-border shadow-sm animate-fade-in">
             <div className="w-20 h-20 rounded-2xl bg-bg-secondary flex items-center justify-center mb-6 border border-border">
                <Inbox className="h-8 w-8 text-primary-light/40" />
             </div>
             <h3 className="text-xl font-bold text-primary tracking-tight">No Results Found</h3>
             <p className="text-primary-light font-medium text-xs mt-2 max-w-sm mx-auto leading-relaxed">
               We couldn't find any announcements matching your current search or filter.
             </p>
             <button 
                onClick={() => { setSearchQuery(''); setFilter('all'); }}
                className="mt-6 px-6 py-2.5 rounded-full bg-primary-hover text-white text-[10px] font-bold hover:bg-primary shadow-lg shadow-primary-hover/20 transition-all active:scale-95"
             >
               Clear Filters
             </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAnnouncements.map((ann, idx) => (
                <div key={ann.id} className="animate-fade-in" style={{ animationDelay: `${(idx % 10) * 50}ms` }}>
                  <StudentAnnouncementCard 
                    announcement={ann} 
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {pagination.page < pagination.lastPage && (
              <div className="flex justify-center mt-12 pt-8 border-t border-border/40">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group relative flex items-center justify-center gap-3 px-10 py-3.5 rounded-xl bg-white border-2 border-primary/10 hover:border-primary text-primary transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  
                  <span className="relative z-10 text-[10px] font-bold group-hover:text-white transition-colors">
                    {isLoadingMore ? 'Loading updates...' : 'Discover More Updates'}
                  </span>
                  
                  {isLoadingMore ? (
                    <Loader2 className="relative z-10 h-3.5 w-3.5 animate-spin group-hover:text-white" />
                  ) : (
                    <Plus className="relative z-10 h-3.5 w-3.5 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                  )}
                </button>
              </div>
            )}

            {/* End of Feed Indicator */}
            {pagination.page >= pagination.lastPage && filteredAnnouncements.length > 0 && (
              <div className="flex flex-col items-center justify-center mt-12 pt-8 border-t border-border/40 opacity-40">
                <div className="h-1 w-10 bg-primary-light/30 rounded-full mb-5" />
                <p className="text-[9px] font-bold text-primary-light">
                   End of University Feed
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ───── FOOTER INFO ───── */}
      <div className="mt-12 flex flex-col items-center">
         <p className="text-[9px] font-bold text-primary-light text-center leading-loose">
           University of Cebu <br /> 
           <span className="text-primary/40">University of Cebu - CCS Lab Management</span>
         </p>
      </div>

    </div>
  );
}
