import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Filter, AlertTriangle, Monitor } from 'lucide-react';

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
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-primary-hover font-bold uppercase tracking-widest text-xs mb-3">
            <Monitor className="h-4 w-4" />
            Lab Schedule & Events
          </div>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4 uppercase">Laboratory Calendar</h1>
          <p className="text-primary-light max-w-2xl leading-relaxed uppercase tracking-wider text-sm">
            Stay informed about lab maintenance windows, technical workshops, and coding events. Use this to plan your sit-in sessions effectively.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {['All Scheduled', 'Maintenance', 'Workshops', 'Competitions', 'Reserved'].map((tab, idx) => (
            <button 
              key={tab} 
              className={`px-5 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-150 border ${
                idx === 0 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-bg-primary text-primary-light border-border hover:border-primary-hover hover:text-primary-hover'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col bg-bg-primary rounded-none border border-border transition-all duration-150 overflow-hidden relative group">
              {event.isUrgent && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-none text-[10px] font-bold uppercase tracking-wider animate-pulse border border-red-700">
                    <AlertTriangle className="h-3 w-3" />
                    Important
                  </div>
                </div>
              )}
              
              <div className="relative h-44 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-300">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute bottom-4 left-6">
                   <span className="text-[10px] font-bold text-brand-sand bg-primary px-2 py-1 uppercase tracking-widest">
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-4 leading-tight uppercase tracking-tight group-hover:text-primary-hover transition-colors duration-150">
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-3 text-[10px] text-primary-light font-bold uppercase tracking-widest">
                    <Calendar className="h-3.5 w-3.5 text-primary-hover" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-primary-light font-bold uppercase tracking-widest">
                    <Clock className="h-3.5 w-3.5 text-primary-hover" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-primary-light font-bold uppercase tracking-widest">
                    <MapPin className="h-3.5 w-3.5 text-primary-hover" />
                    {event.location}
                  </div>
                </div>

                <p className="text-sm text-primary-light mb-8 leading-relaxed uppercase tracking-wider">
                  {event.description}
                </p>

                <button className="w-full py-3 bg-bg-secondary text-primary text-xs font-bold uppercase tracking-widest rounded-none border border-border hover:bg-brand-sand/10 hover:border-primary-hover transition-colors duration-150 flex items-center justify-center gap-2">
                  View Full Details
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-20 p-1 bg-primary border border-border">
          <div className="bg-primary p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Want to host a study group?</h2>
              <p className="text-primary-light text-xs uppercase tracking-widest">You can reserve lab space for approved academic group sessions. Terms apply.</p>
            </div>
            <button className="px-8 py-4 bg-brand-sand text-primary font-extrabold rounded-none hover:brightness-95 transition-all duration-150 active:scale-95 text-xs uppercase tracking-widest border border-brand-sand shadow-none">
              Inquire about Reservations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
