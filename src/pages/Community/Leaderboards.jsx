import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Search, Clock, Star, ArrowUpRight, Filter, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import leaderboardService from '../../services/leaderboard.service';

export default function Leaderboards() {
  const [metric, setMetric] = useState('hours'); // 'hours' or 'sessions'
  const [period, setPeriod] = useState('monthly'); // 'weekly', 'monthly', 'all'
  const [searchTerm, setSearchTerm] = useState('');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await leaderboardService.getLeaderboard(metric, period);
        if (response && response.data) {
          setData(response.data.entries || []);
          setLastUpdated(new Date(response.data.generated_at));
        } else {
          throw new Error('Invalid response format');
        }
      } catch {
        setError('Could not load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [metric, period]);

  const handleRetry = () => {
    setMetric((prev) => prev); // trigger re-render
  };

  const filteredData = data.filter(entry => 
    entry.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topStudents = filteredData.slice(0, 3);
  const rankings = filteredData.slice(3);

  const getInitials = (name) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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
            {lastUpdated && (
              <p className="text-[10px] font-bold text-primary-light/60 flex items-center gap-1.5 uppercase tracking-widest">
                <Clock className="w-3 h-3" /> Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end gap-2 p-1 bg-white rounded-xl border border-border shadow-sm w-fit self-start lg:self-end">
              <button 
                onClick={() => setPeriod('weekly')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${period === 'weekly' ? 'bg-bg-secondary text-primary shadow-sm' : 'text-primary-light hover:text-primary'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setPeriod('monthly')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${period === 'monthly' ? 'bg-bg-secondary text-primary shadow-sm' : 'text-primary-light hover:text-primary'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setPeriod('all')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${period === 'all' ? 'bg-bg-secondary text-primary shadow-sm' : 'text-primary-light hover:text-primary'}`}
              >
                All Time
              </button>
            </div>

            <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-border shadow-sm w-fit self-start lg:self-end">
              <button 
                onClick={() => setMetric('hours')}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${metric === 'hours' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary-light hover:text-primary'}`}
              >
                Total Hours
              </button>
              <button 
                onClick={() => setMetric('sessions')}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${metric === 'sessions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary-light hover:text-primary'}`}
              >
                Session Count
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="p-12 text-center flex flex-col items-center justify-center mb-16 bg-white rounded-2xl border border-red-100 shadow-sm">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-sm font-bold text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-black uppercase tracking-widest"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        ) : loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary-light mb-16">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Syncing Rankings...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary-light mb-16 bg-white rounded-2xl border border-border shadow-sm">
            <Trophy className="w-12 h-12 text-border mb-4" />
            <p className="text-[11px] font-black uppercase tracking-widest">No sessions recorded for this period yet.</p>
          </div>
        ) : (
          <>
            {/* ───── PODIUM (TOP 3) ───── */}
            {topStudents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
                {/* 2nd Place */}
                {topStudents[1] && (
                  <Card className="p-0 overflow-hidden bg-white border-primary/5 shadow-xl relative group transition-all duration-500 hover:-translate-y-2 order-2 md:order-1 h-[90%]">
                    <div className="h-2 w-full bg-primary/60" />
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="relative mb-6 mt-4">
                          <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-xl font-black border-4 border-white shadow-xl transition-transform group-hover:rotate-6 bg-bg-secondary text-primary">
                            {getInitials(topStudents[1].student_name)}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border border-border shadow-lg flex items-center justify-center">
                            <Medal className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                        <div className="space-y-1 mb-6">
                          <h3 className="text-lg font-black text-primary tracking-tight uppercase">{topStudents[1].student_name}</h3>
                          <p className="text-[9px] font-black text-primary-light/60 uppercase tracking-widest">Rank 2</p>
                        </div>
                        <div className="w-full pt-4 border-t border-border/50 flex flex-col items-center">
                          <p className="text-[8px] font-black text-primary-light uppercase tracking-widest mb-1">Accumulated {metric}</p>
                          <p className="text-xl font-black text-primary tracking-tighter">
                            {metric === 'hours' ? topStudents[1].display_value : topStudents[1].value}
                          </p>
                        </div>
                    </div>
                  </Card>
                )}

                {/* 1st Place */}
                {topStudents[0] && (
                  <Card className="p-0 overflow-hidden bg-white border-primary/5 shadow-2xl relative group transition-all duration-500 hover:-translate-y-2 ring-2 ring-primary/20 order-1 md:order-2 z-10">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-amber-100 p-2.5 rounded-full shadow-lg border border-amber-200">
                        <Crown className="h-8 w-8 text-amber-500 fill-amber-500 animate-bounce drop-shadow-md" />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-primary" />
                    <div className="p-10 flex flex-col items-center text-center mt-4">
                        <div className="relative mb-6">
                          <div className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-3xl font-black border-4 border-white shadow-2xl transition-transform group-hover:rotate-6 bg-primary text-brand-sand">
                            {getInitials(topStudents[0].student_name)}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white border border-border shadow-lg flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-brand-sand fill-brand-sand" />
                          </div>
                        </div>
                        <div className="space-y-1 mb-6">
                          <h3 className="text-2xl font-black text-primary tracking-tight uppercase">{topStudents[0].student_name}</h3>
                          <p className="text-[10px] font-black text-primary-light/60 uppercase tracking-widest">Rank 1</p>
                        </div>
                        <div className="w-full pt-6 border-t border-border/50 flex flex-col items-center">
                          <p className="text-[9px] font-black text-primary-light uppercase tracking-widest mb-1">Accumulated {metric}</p>
                          <p className="text-3xl font-black text-primary tracking-tighter">
                            {metric === 'hours' ? topStudents[0].display_value : topStudents[0].value}
                          </p>
                        </div>
                    </div>
                  </Card>
                )}

                {/* 3rd Place */}
                {topStudents[2] && (
                  <Card className="p-0 overflow-hidden bg-white border-primary/5 shadow-xl relative group transition-all duration-500 hover:-translate-y-2 order-3 md:order-3 h-[85%]">
                    <div className="h-2 w-full bg-primary/30" />
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="relative mb-6 mt-4">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black border-4 border-white shadow-xl transition-transform group-hover:rotate-6 bg-bg-secondary text-primary">
                            {getInitials(topStudents[2].student_name)}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border border-border shadow-lg flex items-center justify-center">
                            <Medal className="h-4 w-4 text-amber-700" />
                          </div>
                        </div>
                        <div className="space-y-1 mb-6">
                          <h3 className="text-base font-black text-primary tracking-tight uppercase">{topStudents[2].student_name}</h3>
                          <p className="text-[9px] font-black text-primary-light/60 uppercase tracking-widest">Rank 3</p>
                        </div>
                        <div className="w-full pt-4 border-t border-border/50 flex flex-col items-center">
                          <p className="text-[8px] font-black text-primary-light uppercase tracking-widest mb-1">Accumulated {metric}</p>
                          <p className="text-lg font-black text-primary tracking-tighter">
                            {metric === 'hours' ? topStudents[2].display_value : topStudents[2].value}
                          </p>
                        </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ───── FULL RANKINGS TABLE ───── */}
            {rankings.length > 0 && (
              <Card className="p-0 overflow-hidden bg-white border-primary/5 shadow-2xl mb-20">
                <div className="px-8 py-6 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-3">
                      <Filter className="h-4 w-4 text-primary-hover" /> Detailed Global Rankings
                  </h2>
                  <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-light group-focus-within:text-primary" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        <th className="px-8 py-5 text-[9px] font-black text-primary-light uppercase tracking-[0.2em] text-right">Total Usage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {rankings.map((student) => (
                        <tr key={student.student_id} className="hover:bg-bg-secondary/50 transition-colors group">
                          <td className="px-8 py-5">
                            <span className="text-xs font-black text-primary/40 group-hover:text-primary transition-colors">#{student.rank}</span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-border flex items-center justify-center text-[10px] font-black text-primary group-hover:bg-white group-hover:shadow-md transition-all">
                                {getInitials(student.student_name)}
                              </div>
                              <span className="text-sm font-black text-primary tracking-tight uppercase">{student.student_name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-secondary border border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                              <Clock className="h-3 w-3 opacity-40" />
                              <span className="text-xs font-black tracking-tight">{metric === 'hours' ? student.display_value : student.value + ' sessions'}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}

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
              <p className="text-primary-light/80 text-[10px] font-black uppercase tracking-[0.2em] max-w-xl leading-loose">Consistency is key. Regular sit-in sessions not only boost your ranking but ensure you master your technical coursework. Validated hours are updated every 5 minutes.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
