import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Filter, AlertTriangle, Monitor } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function Events() {
  const events = [
    {
      id: 1,
      title: 'Lab 1 Maintenance & System Update',
      date: 'April 15, 2026',
      time: '8:00 AM - 12:00 PM',
      location: 'Laboratory 1',
      description: 'Scheduled server maintenance. Lab 1 will be unavailable for sit-in sessions during this period.',
      category: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=800&auto=format&fit=crop&q=60',
      isUrgent: true
    },
    {
      id: 2,
      title: 'Intro to Java Spring Boot Workshop',
      date: 'April 22, 2026',
      time: '1:00 PM - 5:00 PM',
      location: 'Laboratory 2',
      description: 'A hands-on workshop for junior students. Slots are limited to 40 participants.',
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      title: 'CCS Inter-Lab Hackathon',
      date: 'May 10, 2026',
      time: '24 Hours (Starts 8:00 AM)',
      location: 'All Laboratories',
      description: '24-hour coding challenge. All labs will be reserved for participants only.',
      category: 'Competition',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/10 shadow-lg">
                <Monitor className="h-5 w-5 text-brand-sand" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Lab Schedule & Events</p>
            </div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              Laboratory <span className="text-primary-hover">Calendar</span>
            </h1>
            <p className="text-primary-light text-sm max-w-2xl leading-relaxed font-medium">
              Stay informed about lab maintenance windows, technical workshops, and coding events to plan your sit-in sessions effectively.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {['All Events', 'Maintenance', 'Workshops', 'Competitions'].map((tab, idx) => (
            <button 
              key={tab} 
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-200 border ${
                idx === 0 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                  : 'bg-white text-primary-light border-border hover:border-primary/30 hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="p-0 overflow-hidden bg-white border-primary/5 shadow-xl group hover:shadow-2xl transition-all duration-300">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {event.isUrgent && (
                  <div className="absolute top-4 right-4 animate-fade-in">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg border border-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      Critical
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-6">
                   <span className="text-[9px] font-black text-primary bg-brand-sand px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-primary mb-5 leading-tight tracking-tight group-hover:text-primary-hover transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center gap-4 text-[10px] text-primary-light font-bold uppercase tracking-widest border-b border-border/50 pb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-primary-light font-bold uppercase tracking-widest border-b border-border/50 pb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-primary-light font-bold uppercase tracking-widest border-b border-border/50 pb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.location}
                  </div>
                </div>

                <p className="text-sm text-primary-light/70 mb-8 leading-relaxed font-medium italic">
                  {event.description}
                </p>

                <button className="w-full h-12 bg-bg-secondary text-primary text-[9px] font-black uppercase tracking-widest rounded-xl border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                  Registration Details
                  <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Simplified Reservation Callout */}
        <div className="mt-24 p-10 bg-primary rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sand/10 rounded-full -ml-32 -mb-32 blur-3xl" />
           
           <div className="text-center md:text-left relative z-10 space-y-3">
              <h2 className="text-2xl font-black text-white tracking-tight">Host a Study Group Session?</h2>
              <p className="text-primary-light/80 text-[10px] font-black uppercase tracking-[0.2em] max-w-xl">You can reserve laboratory space for verified academic group work. Subject to administrative approval.</p>
           </div>
           <button className="px-10 py-4 bg-brand-sand text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-xl shrink-0 relative z-10">
              Request Space Reservation
           </button>
        </div>
      </div>
    </div>
  );
}
