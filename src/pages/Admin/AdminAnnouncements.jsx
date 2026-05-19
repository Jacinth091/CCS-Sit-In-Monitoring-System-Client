import React, { useState, useEffect } from 'react';
import { 
  Plus, Inbox, Send, Loader2, AlertCircle, Pin, Trash2, 
  Megaphone, ShieldAlert, Clock, ChevronRight, ArrowLeft,
  Filter, Search, Hash, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import announcementService from '../../services/announcement.service';
import RichTextRenderer from '../../components/ui/RichTextRenderer';
import { toast } from 'sonner';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });
  
  // View State
  const [showForm, setShowForm] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => { fetchAnnouncements(pagination.page); }, [pagination.page]);

  const fetchAnnouncements = async (page = 1) => {
    setIsListLoading(true);
    try {
      const response = await announcementService.getAdminAnnouncements(page);
      const rawData = response.data || response;
      const meta = response.meta || { page: 1, last_page: 1, total: rawData.length };
      const transformed = Array.isArray(rawData) ? rawData.map(a => ({ 
        id: a.id, 
        title: a.title || 'Update', 
        body: a.content || a.body || '', 
        status: (a.status || 'Published').charAt(0).toUpperCase() + (a.status || 'Published').slice(1), 
        isImportant: !!(a.is_important || a.isImportant), 
        isPinned: !!(a.is_pinned || a.isPinned), 
        date: new Date(a.created_at || a.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }), 
        authorName: a.admin_username || a.author || 'Admin', 
        authorInitials: (a.admin_username || a.author || 'CA').split(' ').map(n => n[0]).join('').toUpperCase() 
      })) : [];
      setAnnouncements(transformed);
      setPagination({ page: meta.page, lastPage: meta.last_page, total: meta.total });
      
      if (window.innerWidth >= 1024 && transformed.length > 0 && !selectedAnnouncement && !showForm) { 
        setSelectedAnnouncement(transformed[0]); 
      }
    } catch (err) { toast.error('Failed to load'); } finally { setIsListLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    setIsSubmitting(true);
    try {
      await announcementService.create({ title: newTitle.trim(), content: newBody.trim(), is_important: isImportant, is_pinned: isPinned });
      toast.success('Posted!');
      setNewTitle(''); setNewBody(''); setIsImportant(false); setIsPinned(false); setShowForm(false);
      setIsMobileDetailOpen(false);
      fetchAnnouncements();
    } catch (err) { toast.error('Failed'); } finally { setIsSubmitting(false); }
  };

  const handleTogglePin = async () => {
    if (!selectedAnnouncement) return;
    setIsUpdating(true);
    try {
      const status = !selectedAnnouncement.isPinned;
      await announcementService.update({ id: selectedAnnouncement.id, is_pinned: status });
      setAnnouncements(prev => prev.map(a => a.id === selectedAnnouncement.id ? { ...a, isPinned: status } : a));
      setSelectedAnnouncement(prev => ({ ...prev, isPinned: status }));
      toast.success(status ? 'Pinned' : 'Unpinned');
    } catch (err) { toast.error('Failed'); } finally { setIsUpdating(false); }
  };

  const handleToggleImportant = async () => {
    if (!selectedAnnouncement) return;
    setIsUpdating(true);
    try {
      const status = !selectedAnnouncement.isImportant;
      await announcementService.update({ id: selectedAnnouncement.id, is_important: status });
      setAnnouncements(prev => prev.map(a => a.id === selectedAnnouncement.id ? { ...a, isImportant: status } : a));
      setSelectedAnnouncement(prev => ({ ...prev, isImportant: status }));
      toast.success(status ? 'Priority set' : 'Priority removed');
    } catch (err) { toast.error('Failed'); } finally { setIsUpdating(false); }
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement || !window.confirm('Delete this announcement?')) return;
    try {
      await announcementService.delete(selectedAnnouncement.id);
      toast.success('Deleted');
      setSelectedAnnouncement(null);
      setIsMobileDetailOpen(false);
      fetchAnnouncements();
    } catch (err) { toast.error('Failed'); }
  };

  const openForm = () => {
    setShowForm(true);
    setSelectedAnnouncement(null);
    setIsMobileDetailOpen(true);
  };

  const selectAnnouncement = (ann) => {
    setSelectedAnnouncement(ann);
    setShowForm(false);
    setIsMobileDetailOpen(true);
  };

  const closeMobileDetail = () => {
    setIsMobileDetailOpen(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col gap-6 overflow-hidden">
      
      <div className={`rounded-xl border border-border bg-white shadow-sm shrink-0 ${isMobileDetailOpen ? 'hidden lg:block' : 'block'}`}>
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">Bulletin Board</p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">Announcements</h1>
          </div>
          <div className="rounded-lg border border-border bg-bg-secondary px-3 py-2">
            <p className="text-[8px] uppercase tracking-[0.2em] text-primary-light/70 font-black mb-0.5">Total Posts</p>
            <p className="text-sm font-black text-primary tracking-tight text-right">{pagination.total}</p>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isSidebarCollapsed ? 'lg:grid-cols-[64px_1fr]' : 'lg:grid-cols-[350px_1fr]'} gap-6 flex-1 min-h-0 overflow-hidden relative transition-all duration-300 ease-in-out`}>
        
        {/* Left Column - List */}
        <div className={`flex flex-col bg-white rounded-xl border border-border shadow-sm overflow-hidden h-full transition-all duration-300 ${isMobileDetailOpen ? 'hidden lg:flex' : 'flex'}`}>
          <div className={`p-3 border-b border-border bg-bg-secondary/30 flex flex-col transition-all ${isSidebarCollapsed ? 'items-center' : ''} gap-3 shrink-0`}>
            <div className="flex justify-between items-center w-full px-1">
              {!isSidebarCollapsed && (
                <>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Post Stream</span>
                  <button onClick={() => setIsSidebarCollapsed(true)} className="p-1 hover:bg-primary/5 rounded-md text-primary-light transition-colors" title="Minimize Stream"><PanelLeftClose className="h-4 w-4" /></button>
                </>
              )}
              {isSidebarCollapsed && (
                <button onClick={() => setIsSidebarCollapsed(false)} className="mx-auto p-1 hover:bg-primary/5 rounded-md text-primary-light transition-colors" title="Expand Stream"><PanelLeftOpen className="h-4 w-4" /></button>
              )}
            </div>
            
            <button 
              onClick={openForm} 
              className={`flex items-center justify-center bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary-hover shadow-lg active:scale-95 transition-all ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-3 gap-2 text-[10px]'}`}
              title="New Announcement"
            >
              <Plus className="h-4 w-4" /> 
              {!isSidebarCollapsed && "New Announcement"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {isListLoading ? (
              <div className="py-20 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary/20" /></div>
            ) : announcements.length === 0 ? (
              <div className="py-20 text-center opacity-30"><Inbox className="h-10 w-10 mx-auto mb-2" /><p className={`text-[10px] font-black uppercase ${isSidebarCollapsed ? 'hidden' : ''}`}>No posts.</p></div>
            ) : announcements.map(ann => (
              <div 
                key={ann.id} 
                onClick={() => selectAnnouncement(ann)} 
                className={`rounded-xl border transition-all cursor-pointer relative group ${isSidebarCollapsed ? 'p-2 flex justify-center' : 'p-4'} ${selectedAnnouncement?.id === ann.id ? 'bg-primary border-primary shadow-md' : 'bg-white border-border hover:bg-bg-secondary'}`}
                title={isSidebarCollapsed ? ann.title : ""}
              >
                {!isSidebarCollapsed ? (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${selectedAnnouncement?.id === ann.id ? 'bg-white/10 text-brand-sand' : 'bg-primary/5 text-primary'}`}>{ann.authorInitials}</span>
                      <span className={`text-[8px] font-bold ${selectedAnnouncement?.id === ann.id ? 'text-white/40' : 'text-primary-light/60'}`}>{ann.date.split(',')[0]}</span>
                    </div>
                    <h4 className={`text-xs font-black truncate ${selectedAnnouncement?.id === ann.id ? 'text-white' : 'text-primary'}`}>{ann.title}</h4>
                    <p className={`text-[10px] line-clamp-1 ${selectedAnnouncement?.id === ann.id ? 'text-white/60' : 'text-primary-light'}`}>{ann.body.replace(/[#*[\]()]/g, '')}</p>
                  </>
                ) : (
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase ${selectedAnnouncement?.id === ann.id ? 'bg-white/10 text-brand-sand' : 'bg-primary/5 text-primary'}`}>
                    {ann.authorInitials}
                  </div>
                )}
                
                {/* Active Indicator bar */}
                {selectedAnnouncement?.id === ann.id && isSidebarCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand-sand" />
                )}
              </div>
            ))}

            {!isSidebarCollapsed && pagination.lastPage > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-border/50 px-1 shrink-0">
                <button disabled={pagination.page <= 1} onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} className="p-2 text-primary-light disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></button>
                <span className="text-[9px] font-black uppercase text-primary-light">{pagination.page} / {pagination.lastPage}</span>
                <button disabled={pagination.page >= pagination.lastPage} onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} className="p-2 text-primary-light disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Detail or Form */}
        <div className={`bg-white rounded-xl border border-border shadow-sm flex flex-col h-full overflow-hidden ${isMobileDetailOpen ? 'flex' : 'hidden lg:flex'}`}>
          
          <div className="lg:hidden p-4 border-b border-border flex items-center gap-4 bg-bg-secondary/30 shrink-0">
            <button onClick={closeMobileDetail} className="p-2 rounded-lg bg-white border border-border text-primary shadow-sm"><ArrowLeft className="h-4 w-4" /></button>
            <span className="text-xs font-black uppercase text-primary tracking-widest">{showForm ? 'New Post' : 'Announcement'}</span>
          </div>

          {showForm ? (
            <div className="p-6 sm:p-8 h-full flex flex-col animate-fade-in overflow-y-auto relative">
              <h2 className="hidden lg:block text-lg font-black text-primary uppercase tracking-tight mb-6">Draft Post</h2>
              <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
                <div><label className="text-[9px] font-black uppercase text-primary-light ml-1">Title</label><input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full rounded-xl border border-border bg-bg-secondary/30 px-4 py-2.5 text-sm font-bold text-primary focus:bg-white transition-all" placeholder="Enter title..." /></div>
                <div><label className="text-[9px] font-black uppercase text-primary-light ml-1">Content</label><textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-bg-secondary/30 px-4 py-2.5 text-sm font-medium text-primary focus:bg-white transition-all resize-none" placeholder="Details..." /></div>
                
                <div className="flex flex-wrap gap-6 px-1">
                  <div onClick={() => setIsImportant(!isImportant)} className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className={`w-8 h-5 rounded-full relative transition-all duration-300 ${isImportant ? 'bg-red-500' : 'bg-primary-light/20'}`}>
                       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isImportant ? 'left-4' : 'left-1'}`} />
                    </div>
                    <span className="text-[9px] font-black text-primary-light uppercase tracking-widest group-hover:text-primary transition-colors">Important</span>
                  </div>

                  <div onClick={() => setIsPinned(!isPinned)} className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className={`w-8 h-5 rounded-full relative transition-all duration-300 ${isPinned ? 'bg-amber-500' : 'bg-primary-light/20'}`}>
                       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isPinned ? 'left-4' : 'left-1'}`} />
                    </div>
                    <span className="text-[9px] font-black text-primary-light uppercase tracking-widest group-hover:text-primary transition-colors">Pin to Top</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => { setShowForm(false); setIsMobileDetailOpen(false); }} className="px-6 py-2 rounded-xl border border-border text-[10px] font-black uppercase text-primary-light hover:text-primary transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting || !newTitle.trim()} className="px-8 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2">
                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    Post Now
                  </button>
                </div>
              </form>
            </div>
          ) : selectedAnnouncement ? (
            <div className="p-6 sm:p-8 h-full flex flex-col animate-fade-in overflow-hidden relative">
              {/* ───── FLOATING HEADER CONTROLS ───── */}
              
              <div className="absolute top-6 left-6 z-10 hidden lg:block">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-sm">
                  <Clock className="h-3 w-3 text-primary-light" />
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">{selectedAnnouncement.date}</span>
                </div>
              </div>

              <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                 <div className="hidden sm:flex gap-1 mr-1">
                    {selectedAnnouncement.isImportant && <span className="px-2 py-1 rounded bg-red-50 text-red-600 text-[8px] font-black uppercase border border-red-100 shadow-sm">Important</span>}
                    {selectedAnnouncement.isPinned && <span className="px-2 py-1 rounded bg-amber-50 text-amber-600 text-[8px] font-black uppercase border border-amber-100 shadow-sm">Pinned</span>}
                 </div>
                 <div className="flex gap-1.5 bg-white/80 backdrop-blur-md p-1 rounded-xl border border-border shadow-sm">
                   <button onClick={handleTogglePin} disabled={isUpdating} className="p-2 rounded-lg text-primary-light hover:text-primary transition-colors" title="Toggle Pin">{isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pin className={`h-4 w-4 ${selectedAnnouncement.isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />}</button>
                   <button onClick={handleToggleImportant} disabled={isUpdating} className="p-2 rounded-lg text-primary-light hover:text-primary transition-colors" title="Toggle Priority">{isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className={`h-4 w-4 ${selectedAnnouncement.isImportant ? 'fill-red-500 text-red-500' : ''}`} />}</button>
                   <button onClick={handleDelete} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-all" title="Delete"><Trash2 className="h-4 w-4" /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pt-10 lg:pt-14">
                <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tighter mb-6 leading-tight max-w-[85%] lg:max-w-[75%]">{selectedAnnouncement.title}</h1>
                <div className="prose prose-sm text-primary/80 leading-relaxed max-w-none pb-20 selection:bg-brand-sand/30">
                  <RichTextRenderer text={selectedAnnouncement.body} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-primary-light/20"><Megaphone className="h-10 w-10 mb-2" /><p className="text-[10px] font-black uppercase tracking-widest">Select an announcement</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
