import React, { useState } from 'react';
import { Trophy, Medal, Crown, Search, TrendingUp, Clock, Star, ArrowUpRight, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function Leaderboards() {
  const [filter, setFilter] = useState('hours'); // 'hours' or 'sessions'

  const topStudents = [
    { id: 1, name: 'Adrian Mercado', course: 'BSCS 3', value: '142.5', trend: '+12%', avatar: 'AM', rank: 1 },
    { id: 2, name: 'Sophia Villarante', course: 'BSIT 4', value: '128.0', trend: '+5%', avatar: 'SV', rank: 2 },
    { id: 3, name: 'James Yap', course: 'BSCS 2', value: '115.2', trend: '+18%', avatar: 'JY', rank: 3 },
  ];

  const rankings = [
    { id: 4, name: 'Emily Wong', course: 'BSIT 2', value: '98.5', avatar: 'EW', rank: 4 },
    { id: 5, name: 'Marcus Chen', course: 'BSCS 4', value: '85.0', avatar: 'MC', rank: 5 },
    { id: 6, name: 'Sarah Johnson', course: 'BSIT 3', value: '72.4', avatar: 'SJ', rank: 6 },
    { id: 7, name: 'John Doe', course: 'BSCS 1', value: '68.0', avatar: 'JD', rank: 7 },
    { id: 8, name: 'Jane Smith', course: 'BSCS 3', value: '55.5', avatar: 'JS', rank: 8 },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        
        {/* ───── HEADER ───── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border pb-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/10 shadow-lg">
                <Trophy className="h-5 w-5 text-brand-sand" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Academic Recognition</p>
            </div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              Lab Engagement <span className="text-primary-hover">Leaderboards</span>
            </h1>
            <p className="text-primary-light text-sm max-w-2xl leading-relaxed font-medium">
              Celebrating our most dedicated computing students. Rankings are based on total validated sit-in hours and laboratory session frequency.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-border shadow-sm">
            <button 
              onClick={() => setFilter('hours')}
              className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === 'hours' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary-light hover:text-primary'}`}
            >
              Total Hours
            </button>
            <button 
              onClick={() => setFilter('sessions')}
              className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === 'sessions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary-light hover:text-primary'}`}
            >
              Session Count
            </button>
          </div>
        </div>

        {/* ───── PODIUM (TOP 3) ───── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {topStudents.map((student, i) => (
            <Card key={student.id} className={`p-0 overflow-hidden bg-white border-primary/5 shadow-xl relative group transition-all duration-500 hover:-translate-y-2 ${student.rank === 1 ? 'ring-2 ring-primary/20' : ''}`}>
               {student.rank === 1 && (
                 <div className="absolute top-0 right-0 p-4">
                   <Crown className="h-6 w-6 text-brand-sand animate-bounce" />
                 </div>
               )}
               <div className={`h-2 w-full ${student.rank === 1 ? 'bg-primary' : student.rank === 2 ? 'bg-primary/60' : 'bg-primary/30'}`} />
               
               <div className="p-10 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-2xl font-black border-4 border-white shadow-2xl transition-transform group-hover:rotate-6 ${student.rank === 1 ? 'bg-primary text-brand-sand' : 'bg-bg-secondary text-primary'}`}>
                      {student.avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white border border-border shadow-lg flex items-center justify-center">
                       {student.rank === 1 ? <Trophy className="h-5 w-5 text-brand-sand fill-brand-sand" /> : <Medal className={`h-5 w-5 ${student.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`} />}
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-black text-primary tracking-tight uppercase">{student.name}</h3>
                    <p className="text-[10px] font-black text-primary-light/60 uppercase tracking-widest">{student.course}</p>
                  </div>

                  <div className="w-full pt-6 border-t border-border/50 flex items-center justify-between">
                     <div className="text-left">
                        <p className="text-[8px] font-black text-primary-light uppercase tracking-widest mb-1">Accumulated</p>
                        <p className="text-2xl font-black text-primary tracking-tighter">{student.value}<span className="text-[10px] ml-1 uppercase">hrs</span></p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Weekly Trend</p>
                        <p className="text-xs font-black text-emerald-600 flex items-center gap-1">
                           <TrendingUp className="h-3 w-3" /> {student.trend}
                        </p>
                     </div>
                  </div>
               </div>
            </Card>
          ))}
        </div>

        {/* ───── FULL RANKINGS TABLE ───── */}
        <Card className="p-0 overflow-hidden bg-white border-primary/5 shadow-2xl mb-20">
          <div className="px-8 py-6 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                <Filter className="h-4 w-4 text-primary-hover" /> Detailed Global Rankings
             </h2>
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-light group-focus-within:text-primary" />
                <input 
                  type="text" 
                  placeholder="SEARCH STUDENT..." 
                  className="pl-9 pr-4 py-2 bg-white border border-border rounded-xl text-[9px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-48 lg:w-64"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-8 py-5 text-[9px] font-black text-primary-light uppercase tracking-[0.2em]">Rank</th>
                  <th className="px-8 py-5 text-[9px] font-black text-primary-light uppercase tracking-[0.2em]">Student Profile</th>
                  <th className="px-8 py-5 text-[9px] font-black text-primary-light uppercase tracking-[0.2em]">Academic Path</th>
                  <th className="px-8 py-5 text-[9px] font-black text-primary-light uppercase tracking-[0.2em] text-right">Total Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {rankings.map((student) => (
                  <tr key={student.id} className="hover:bg-bg-secondary/50 transition-colors group">
                    <td className="px-8 py-5">
                       <span className="text-xs font-black text-primary/40 group-hover:text-primary transition-colors">#{student.rank}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-border flex items-center justify-center text-[10px] font-black text-primary group-hover:bg-white group-hover:shadow-md transition-all">
                          {student.avatar}
                        </div>
                        <span className="text-sm font-black text-primary tracking-tight uppercase">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">{student.course}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-secondary border border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                         <Clock className="h-3 w-3 opacity-40" />
                         <span className="text-xs font-black tracking-tight">{student.value} hrs</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-bg-secondary/20 border-t border-border text-center">
             <button className="text-[9px] font-black text-primary-light uppercase tracking-widest hover:text-primary transition-colors">
                Load Full Directory (Top 100)
             </button>
          </div>
        </Card>

        {/* ───── RECOGNITION CALLOUT ───── */}
        <div className="bg-primary rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-sand/10 rounded-full -ml-40 -mb-40 blur-3xl" />
           
           <div className="text-center md:text-left relative z-10 space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-brand-sand">
                 <Star className="h-4 w-4 fill-brand-sand" />
                 <Star className="h-4 w-4 fill-brand-sand" />
                 <Star className="h-4 w-4 fill-brand-sand" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Want to climb the ranks?</h2>
              <p className="text-primary-light/80 text-[10px] font-black uppercase tracking-[0.2em] max-w-xl leading-loose">Consistency is key. Regular sit-in sessions not only boost your ranking but ensure you master your technical coursework. Validated hours are updated every 24 hours.</p>
           </div>
           <button className="px-12 py-5 bg-brand-sand text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-2xl shrink-0 relative z-10 flex items-center gap-3">
              Start a Session <ArrowUpRight className="h-4 w-4" />
           </button>
        </div>

      </div>
    </div>
  );
}
