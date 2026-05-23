import React, { useState, useEffect } from 'react';
import { Shield, Target, Clock, MapPin, Mail, Monitor, Info, ArrowRight, ShieldCheck, BookOpen, Users } from 'lucide-react';
import ccsLogo from '../assets/images/png/uccslogobg.png';
import Card from '../components/ui/Card';
import labService from '../services/lab.service';

// Icon mapping for dynamic rules
const RULE_ICONS = {
  Shield,
  Monitor,
  Target,
  ShieldCheck,
  Info,
  Clock,
  BookOpen,
  Users
};

export default function About() {
  const [labRules, setLabRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultRules = [
    {
      icon_name: 'Info',
      title: 'Digital Registration',
      description: "Students must time in through the system using their student ID before occupying any workstation."
    },
    {
      icon_name: 'Shield',
      title: 'Proper Decorum',
      description: 'Keep noise levels low and maintain a professional academic environment at all times.'
    },
    {
      icon_name: 'Monitor',
      title: 'Academic Use Only',
      description: 'Workstations are for academic work. Gaming and non-academic media use are not allowed.'
    },
    {
      icon_name: 'ShieldCheck',
      title: 'Cleanliness',
      description: 'Food and drinks are not allowed inside the laboratory.'
    },
    {
      icon_name: 'Target',
      title: 'Equipment Responsibility',
      description: 'Report hardware or software issues immediately. Do not attempt manual repairs.'
    },
    {
      icon_name: 'Clock',
      title: 'Official Logout',
      description: 'Always time out before leaving to ensure your hours are correctly recorded.'
    }
  ];

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        const response = await labService.getRules();
        if (response.status === 'success' && response.data?.length > 0) {
          setLabRules(response.data);
        } else {
          setLabRules(defaultRules);
        }
      } catch (error) {
        console.error("Failed to fetch lab rules:", error);
        setLabRules(defaultRules);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10 pb-20 animate-fade-in">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/10 shadow-lg">
                   <img src={ccsLogo} alt="CCS Logo" className="w-6 h-6 object-contain" />
                </div>
                <p className="text-[10px] font-bold text-primary">College of Computer Studies</p>
             </div>
             <h1 className="text-4xl font-extrabold text-primary tracking-tight">
               CCS HUB <span className="text-primary-hover">Monitoring System</span>
             </h1>
             <p className="text-primary-light text-sm max-w-2xl leading-relaxed font-medium">
               The official laboratory management platform of the University of Cebu College of Computer Studies, providing a centralized hub for sit-in sessions, resource allocation, and academic engagement.
             </p>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-white border-primary/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <h2 className="text-xs font-bold text-primary mb-6 flex items-center gap-3">
               <Info className="h-4 w-4 text-primary-hover" /> System Overview
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-primary-light font-medium leading-relaxed">
                The CCS Sit-In Monitoring System was developed to modernize how computer laboratories are utilized outside of standard lecture hours. It serves as a bridge between student needs and administrative oversight, ensuring that every workstation is used effectively for academic development.
              </p>
              <p className="text-sm text-primary-light font-medium leading-relaxed italic opacity-70">
                Our mission is to foster a productive technical environment where students can focus on programming, research, and project implementation with minimal administrative friction.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-bg-secondary/50 p-6 flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-extrabold text-primary tracking-tighter">06</p>
                <p className="text-[9px] font-bold text-primary-light/60 mt-1">Specialized Labs</p>
              </div>
              <div className="rounded-2xl border border-border bg-bg-secondary/50 p-6 flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-extrabold text-primary tracking-tighter">250+</p>
                <p className="text-[9px] font-bold text-primary-light/60 mt-1">High-End Terminals</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-primary/5 shadow-xl flex flex-col justify-between group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary transition-all">
                <Clock className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="mt-6">
                <h3 className="text-[10px] font-bold text-primary mb-2">Automated Logs</h3>
                <p className="text-xs text-primary-light/70 font-bold leading-relaxed">Eliminating manual sign-ins with a digital audit trail of your laboratory usage and sit-in hours.</p>
              </div>
            </Card>
            <Card className="p-6 bg-white border-primary/5 shadow-xl flex flex-col justify-between group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary transition-all">
                <ShieldCheck className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="mt-6">
                <h3 className="text-[10px] font-bold text-primary mb-2">Resource Security</h3>
                <p className="text-xs text-primary-light/70 font-bold leading-relaxed">Protecting laboratory infrastructure through accountability and verified access protocols.</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <Monitor className="h-5 w-5 text-primary" />
             <h2 className="text-xs font-bold text-primary">Core Operational Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {labRules.map((rule, i) => {
              const RuleIcon = RULE_ICONS[rule.icon_name] || Shield;
              return (
                <div key={i} className="p-6 rounded-2xl border border-border bg-white hover:border-primary/20 hover:shadow-lg transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-border text-primary-hover flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <RuleIcon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-[10px] font-bold text-primary">{rule.title}</h3>
                  <p className="mt-2 text-[11px] font-bold text-primary-light/60 leading-loose italic opacity-80 group-hover:opacity-100 transition-opacity">"{rule.description || rule.desc}"</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-primary rounded-2xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sand/10 rounded-full -ml-32 -mb-32 blur-2xl" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-brand-sand">Administration</p>
              <h2 className="text-2xl font-black text-white tracking-tight">Technical Support & Oversight</h2>
              <p className="text-primary-light/80 text-sm max-w-2xl font-medium leading-relaxed italic">
                Our laboratory administrators are available to assist with account verification, system technicalities, and hardware issues. For official concerns regarding sit-in hours, please visit our main office.
              </p>
            </div>
            <button className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-brand-sand text-primary text-[10px] font-bold hover:brightness-110 shadow-xl transition-all active:scale-95 shrink-0">
              Technical Support Desk
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all">
              <Mail className="h-6 w-6 text-brand-sand mb-4" />
              <p className="text-[9px] font-bold text-primary-light/50">Support Email</p>
              <p className="text-sm font-bold text-white mt-1">ccs.support@university.edu.ph</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all">
              <MapPin className="h-6 w-6 text-brand-sand mb-4" />
              <p className="text-[9px] font-bold text-primary-light/50">Physical Location</p>
              <p className="text-sm font-bold text-white mt-1">University of Cebu - Main Campus, CCS Dept.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
