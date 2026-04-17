import React from 'react';
import { MessageSquare, Users, TrendingUp, Search, Plus, BookOpen, Terminal } from 'lucide-react';

export default function Forums() {
  const categories = [
    { name: 'Sit-In Rules & Policy', count: 24, icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Lab Software Support', count: 142, icon: <Terminal className="h-5 w-5" /> },
    { name: 'Coding Help', count: 356, icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Hardware Issues', count: 32, icon: <Users className="h-5 w-5" /> },
  ];

  const recentThreads = [
    { title: 'Visual Studio Code extension recommendations for C++', author: 'Mark T.', replies: 14, time: '45m ago', category: 'Lab Software Support' },
    { title: 'Question about remaining sit-in hours calculation', author: 'Sarah K.', replies: 3, time: '2h ago', category: 'Sit-In Rules & Policy' },
    { title: 'Debugging a linked list in Java - anyone around?', author: 'Jason L.', replies: 8, time: '5h ago', category: 'Coding Help' },
    { title: 'Lab 2 Workstation #14 monitor flickering', author: 'Emily D.', replies: 2, time: '1d ago', category: 'Hardware Issues' },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight uppercase">CCS Lab Community</h1>
            <p className="text-primary-light mt-1 text-sm uppercase tracking-wider">Discuss lab policies, software, and collaborate with other sit-in students.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-primary text-brand-sand px-5 py-2.5 rounded-none font-bold uppercase tracking-widest hover:bg-primary-hover transition-all duration-150 border border-primary active:scale-95">
            <Plus className="h-5 w-5" />
            Start Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-light" />
              <input 
                type="text" 
                placeholder="SEARCH LAB DISCUSSIONS..." 
                className="w-full pl-12 pr-4 py-3 bg-bg-primary border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary-hover/20 transition-all duration-150 uppercase tracking-wider text-sm"
              />
            </div>

            <div className="bg-bg-primary rounded-none border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-brand-sand/5 flex items-center justify-between">
                <h2 className="font-bold text-primary uppercase tracking-widest text-sm">Recent Activity</h2>
                <TrendingUp className="h-4 w-4 text-primary-hover" />
              </div>
              <div className="divide-y divide-border">
                {recentThreads.map((thread, idx) => (
                  <div key={idx} className="p-6 hover:bg-bg-secondary transition-colors duration-150 cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-primary group-hover:text-primary-hover transition-colors duration-150 uppercase tracking-tight">
                        {thread.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-primary-hover/10 text-primary-hover rounded-none border border-primary-hover/20 uppercase tracking-widest">
                        {thread.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-primary-light uppercase tracking-widest">
                      <span className="text-primary/70">{thread.author}</span>
                      <span>•</span>
                      <span>{thread.replies} responses</span>
                      <span>•</span>
                      <span>{thread.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-bg-primary rounded-none border border-border p-6">
              <h2 className="font-bold text-primary mb-6 uppercase tracking-widest text-sm">Topic Categories</h2>
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-none hover:bg-brand-sand/10 transition-colors duration-150 cursor-pointer group border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-bg-secondary rounded-none group-hover:bg-bg-primary transition-colors duration-150 text-primary-hover border border-border">
                        {cat.icon}
                      </div>
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">{cat.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary rounded-none p-8 text-white relative overflow-hidden border border-border">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-4 uppercase tracking-tight text-brand-sand">Laboratory Etiquette</h3>
                <ul className="text-[10px] font-bold text-primary-light space-y-4 uppercase tracking-widest">
                  <li className="flex gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-none bg-brand-sand flex-shrink-0" />
                    <p>Keep the volume low; others are studying.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-none bg-brand-sand flex-shrink-0" />
                    <p>Logout properly to save your progress.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-none bg-brand-sand flex-shrink-0" />
                    <p>Help peers but don't do their work.</p>
                  </li>
                </ul>
              </div>
              {/* Decorative circle removed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
