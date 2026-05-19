import React from 'react';
import { Shield, Target, Clock, MapPin, Mail, Monitor, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import ccsLogo from '../assets/images/png/uccslogobg.png';
import Card from '../components/ui/Card';

const policies = [
  {
    icon: Info,
    title: 'Digital Registration',
    desc: "Students must time in through the system using their student ID before occupying any workstation."
  },
  {
    icon: Shield,
    title: 'Proper Decorum',
    desc: 'Keep noise levels low and maintain a professional academic environment at all times.'
  },
  {
    icon: Monitor,
    title: 'Academic Use Only',
    desc: 'Workstations are for academic work. Gaming and non-academic media use are not allowed.'
  },
  {
    icon: Shield,
    title: 'Cleanliness',
    desc: 'Food and drinks are not allowed inside the laboratory.'
  },
  {
    icon: Target,
    title: 'Equipment Responsibility',
    desc: 'Report hardware or software issues immediately. Do not attempt manual repairs.'
  },
  {
    icon: Clock,
    title: 'Official Logout',
    desc: 'Always time out before leaving to ensure your hours are correctly recorded.'
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10 pb-20 animate-fade-in">
        
        {/* Simplified Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/10 shadow-lg">
                   <img src={ccsLogo} alt="CCS Logo" className="w-6 h-6 object-contain" />
                </div>
                <p className="text-[10px] font-bold text-primary">College of Computer Studies</p>
             </div>
             <h1 className="text-4xl font-extrabold text-primary tracking-tight">
               Laboratory Sit-In <span className="text-primary-hover">Monitoring System</span>
             </h1>
             <p className="text-primary-light text-sm max-w-2xl leading-relaxed font-medium">
               A structured platform designed for fair laboratory access, transparent session monitoring, and accurate academic hour tracking for the University of Cebu community.
             </p>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-white border-primary/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <h2 className="text-xs font-bold text-primary mb-6 flex items-center gap-3">
               <Info className="h-4 w-4 text-primary-hover" /> Functional Purpose
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-primary-light font-medium leading-relaxed">
                Sit-in sessions allow students to utilize laboratory resources outside of their regular class schedules for assignments, research projects, and self-directed technical practice.
              </p>
              <p className="text-sm text-primary-light font-medium leading-relaxed italic opacity-70">
                This system facilitates equitable access to workstations while maintaining precise usage logs for both students and administration.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-bg-secondary/50 p-6 flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-extrabold text-primary tracking-tighter">30+</p>
                <p className="text-[9px] font-bold text-primary-light/60 mt-1">Required Hours</p>
              </div>
              <div className="rounded-2xl border border-border bg-bg-secondary/50 p-6 flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-extrabold text-primary tracking-tighter">150+</p>
                <p className="text-[9px] font-bold text-primary-light/60 mt-1">Total Terminals</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-primary/5 shadow-xl flex flex-col justify-between group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary transition-all">
                <Clock className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="mt-6">
                <h3 className="text-[10px] font-bold text-primary mb-2">Hour Tracking</h3>
                <p className="text-xs text-primary-light/70 font-bold leading-relaxed">Automated logging and precise calculation of your laboratory engagement hours.</p>
              </div>
            </Card>
            <Card className="p-6 bg-white border-primary/5 shadow-xl flex flex-col justify-between group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary transition-all">
                <Monitor className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="mt-6">
                <h3 className="text-[10px] font-bold text-primary mb-2">Live Availability</h3>
                <p className="text-xs text-primary-light/70 font-bold leading-relaxed">Real-time terminal visibility allowing you to plan your study sessions effectively.</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <ShieldCheck className="h-5 w-5 text-primary" />
             <h2 className="text-xs font-bold text-primary">Laboratory Conduct Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-border bg-white hover:border-primary/20 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-border text-primary-hover flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-[10px] font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-[11px] font-bold text-primary-light/60 leading-loose italic opacity-80 group-hover:opacity-100 transition-opacity">"{item.desc}"</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary rounded-2xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sand/10 rounded-full -ml-32 -mb-32 blur-2xl" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-brand-sand">Support Hub</p>
              <h2 className="text-2xl font-black text-white tracking-tight">Technical Account Assistance</h2>
              <p className="text-primary-light/80 text-sm max-w-2xl font-medium leading-relaxed italic">
                Encountering discrepancies with your hour logs or login credentials? Our laboratory administrative team is available for session validation and system support.
              </p>
            </div>
            <button className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-brand-sand text-primary text-[10px] font-bold hover:brightness-110 shadow-xl transition-all active:scale-95 shrink-0">
              Contact Support Team
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all">
              <Mail className="h-6 w-6 text-brand-sand mb-4" />
              <p className="text-[9px] font-bold text-primary-light/50">Official Correspondence</p>
              <p className="text-sm font-bold text-white mt-1">ccs-lab@university.edu</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all">
              <MapPin className="h-6 w-6 text-brand-sand mb-4" />
              <p className="text-[9px] font-bold text-primary-light/50">Laboratory Headquarters</p>
              <p className="text-sm font-bold text-white mt-1">CCS Main Wing, 2nd Floor</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
