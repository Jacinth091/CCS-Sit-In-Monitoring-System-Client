import React from 'react';
import { MessageSquare, Users, TrendingUp, Search, Plus, BookOpen, Terminal, X, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function Forums() {
  const categories = [
    { name: 'Sit-In Rules & Policy', count: 24, icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Lab Software Support', count: 142, icon: <Terminal className="h-4 w-4" /> },
    { name: 'Coding Help', count: 356, icon: <MessageSquare className="h-4 w-4" /> },
    { name: 'Hardware Issues', count: 32, icon: <Users className="h-4 w-4" /> },
  ];

  const recentThreads = [
    { title: 'Visual Studio Code extension recommendations for C++', author: 'Mark T.', replies: 14, time: '45m ago', category: 'Lab Software Support' },
    { title: 'Question about remaining sit-in hours calculation', author: 'Sarah K.', replies: 3, time: '2h ago', category: 'Sit-In Rules & Policy' },
    { title: 'Debugging a linked list in Java - anyone around?', author: 'Jason L.', replies: 8, time: '5h ago', category: 'Coding Help' },
    { title: 'Lab 2 Workstation #14 monitor flickering', author: 'Emily D.', replies: 2, time: '1d ago', category: 'Hardware Issues' },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        
        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/10 shadow-lg">
                <MessageSquare className="h-5 w-5 text-brand-sand" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Community Discussions</p>
            </div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              CCS Lab <span className="text-primary-hover">Forums</span>
            </h1>
            <p className="text-primary-light text-sm max-w-2xl leading-relaxed font-medium">
              Discuss laboratory policies, troubleshoot software issues, and collaborate with your peers in a technical environment.
            </p>
          </div>

          <button className="flex items-center justify-center gap-3 bg-primary text-white h-14 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/10 transition-all active:scale-95 shrink-0">
            <Plus className="h-5 w-5" />
            Start Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-light group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH LABORATORY DISCUSSIONS..." 
                className="w-full pl-14 pr-6 h-14 bg-white border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
              />
            </div>

            <Card className="p-0 overflow-hidden bg-white border-primary/5 shadow-2xl">
              <div className="px-8 py-6 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-primary-hover" /> Recent Community Activity
                </h2>
              </div>
              <div className="divide-y divide-border/50">
                {recentThreads.map((thread, idx) => (
                  <div key={idx} className="p-8 hover:bg-bg-secondary/40 transition-all duration-300 cursor-pointer group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <h3 className="text-lg font-black text-primary group-hover:text-primary-hover transition-colors uppercase tracking-tight leading-tight">
                        {thread.title}
                      </h3>
                      <span className="shrink-0 px-3 py-1 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg border border-primary/10">
                        {thread.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[9px] font-black text-primary-light uppercase tracking-widest opacity-60">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[7px] text-primary">
                          {thread.author[0]}
                        </div>
                        {thread.author}
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1.5"><MessageSquare className="h-3 w-3" /> {thread.replies} responses</span>
                      <span>•</span>
                      <span>{thread.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-bg-secondary/50 text-[9px] font-black text-primary-light uppercase tracking-widest hover:text-primary transition-colors border-t border-border">
                Load More Discussions
              </button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="p-8 bg-white border-primary/5 shadow-xl">
              <h2 className="text-[10px] font-black text-primary mb-8 uppercase tracking-[0.2em] border-b border-border pb-4">Topic Taxonomy</h2>
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-secondary transition-all duration-200 cursor-pointer group border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary-hover border border-border">
                        {cat.icon}
                      </div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{cat.name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-[9px] font-black text-primary-light group-hover:bg-white transition-all">
                      {cat.count}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-xs font-black mb-6 uppercase tracking-[0.2em] text-brand-sand">Laboratory Etiquette</h3>
                <ul className="space-y-5">
                  {[
                    "Maintain silence; others are focused on academic tasks.",
                    "Execute proper logout procedures to secure session logs.",
                    "Collaborate constructively without compromising academic integrity."
                  ].map((text, i) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-sand/40 group-hover:bg-brand-sand transition-colors shrink-0" />
                      <p className="text-[10px] font-bold text-primary-light/80 leading-relaxed uppercase tracking-widest">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
