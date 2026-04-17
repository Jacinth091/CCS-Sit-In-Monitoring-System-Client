import React from 'react';
import { Shield, Target, BookOpen, Clock, MapPin, Phone, Mail, Monitor, Info } from 'lucide-react';
import ccsLogo from '../assets/images/png/uccslogobg.png';

export default function About() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="bg-primary py-16 px-4 text-center relative overflow-hidden border-b border-border">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-none bg-white/10 backdrop-blur-md p-3 border border-white/20">
              <img src={ccsLogo} alt="CCS Logo" className="h-full w-full object-contain grayscale brightness-200" />
            </div>
          </div>
          <p className="text-primary-light font-bold tracking-widest uppercase text-xs mb-3">College of Computer Studies</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight uppercase">
            Laboratory <span className="text-primary-light">Sit-In</span> System
          </h1>
          <p className="text-lg text-primary-light/90 max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-wider">
            Providing a structured and efficient way for students to utilize computer laboratory resources for academic growth and technical practice.
          </p>
        </div>
        {/* Abstract background pattern removed for minimalist look */}
      </section>

      {/* Purpose & Policy */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6 uppercase tracking-tight">What is a "Sit-In"?</h2>
              <div className="space-y-4 text-primary-light leading-relaxed uppercase tracking-wider text-sm">
                <p>
                  A <span className="font-bold text-primary-hover underline decoration-brand-sand">Sit-In session</span> allows students to use the computer laboratories outside of their regularly scheduled classes. This is essential for students who need to work on programming assignments, research projects, or practice technical skills.
                </p>
                <p>
                  Our monitoring system ensures that every student gets fair access to equipment and that laboratory hours are tracked accurately for semester requirements.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-brand-sand/10 rounded-none border border-border">
                  <p className="text-2xl font-bold text-primary">30+</p>
                  <p className="text-xs font-bold text-primary-light uppercase tracking-widest">Required Hours</p>
                </div>
                <div className="p-4 bg-brand-sand/10 rounded-none border border-border">
                  <p className="text-2xl font-bold text-primary">150+</p>
                  <p className="text-xs font-bold text-primary-light uppercase tracking-widest">Workstations</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-bg-primary p-6 rounded-none border border-border">
                <div className="p-3 bg-primary-hover/10 rounded-none w-fit mb-4 border border-primary-hover/20">
                  <Clock className="h-6 w-6 text-primary-hover" />
                </div>
                <h3 className="font-bold text-primary mb-2 uppercase tracking-tight text-sm">Hour Tracking</h3>
                <p className="text-xs text-primary-light uppercase tracking-wider leading-relaxed">Automatic logging of your laboratory usage time for easy monitoring of required hours.</p>
              </div>
              <div className="bg-bg-primary p-6 rounded-none border border-border">
                <div className="p-3 bg-primary-hover/10 rounded-none w-fit mb-4 border border-primary-hover/20">
                  <Monitor className="h-6 w-6 text-primary-hover" />
                </div>
                <h3 className="font-bold text-primary mb-2 uppercase tracking-tight text-sm">Real-time Stats</h3>
                <p className="text-xs text-primary-light uppercase tracking-wider leading-relaxed">Check lab availability and current occupancy before heading to the building.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Rules - Recontextualized */}
      <section className="bg-bg-secondary py-20 px-4 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary uppercase tracking-tight">Laboratory Policies</h2>
            <p className="mt-4 text-primary-light uppercase tracking-widest text-xs font-bold">Strict adherence to these rules is required for all sit-in students.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Info className="h-5 w-5" />, 
                title: "Digital Registration", 
                desc: "Students must 'Time In' through the system using their student ID before occupying any workstation." 
              },
              { 
                icon: <Shield className="h-5 w-5" />, 
                title: "Proper Decorum", 
                desc: "No shouting, loud music, or disruptive behavior. Maintain a professional academic environment." 
              },
              { 
                icon: <Monitor className="h-5 w-5" />, 
                title: "Academic Use Only", 
                desc: "Workstations are for academic purposes. Social media, gaming, and streaming are strictly prohibited." 
              },
              { 
                icon: <Shield className="h-5 w-5" />, 
                title: "Cleanliness", 
                desc: "Eating and drinking inside the computer laboratory is absolutely not allowed." 
              },
              { 
                icon: <Target className="h-5 w-5" />, 
                title: "Equipment Responsibility", 
                desc: "Report any hardware issues to the Lab Administrator immediately. Do not attempt manual repairs." 
              },
              { 
                icon: <Clock className="h-5 w-5" />, 
                title: "Official Logout", 
                desc: "Always 'Time Out' when leaving to ensure your hours are recorded correctly." 
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-bg-primary rounded-none border border-border transition-colors duration-150 hover:bg-bg-secondary">
                <div className="flex-shrink-0 w-10 h-10 rounded-none bg-primary flex items-center justify-center text-brand-sand border border-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1 uppercase tracking-tight text-sm">{item.title}</h3>
                  <p className="text-xs text-primary-light uppercase tracking-wider leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Support */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-hover/10 rounded-none text-primary-hover text-[10px] font-bold mb-6 border border-primary-hover/20 uppercase tracking-widest">
            <Info className="h-3 w-3" />
            Admin Support Available
          </div>
          <h2 className="text-3xl font-bold text-primary mb-6 uppercase tracking-tight">Need Help with your Sit-In?</h2>
          <p className="text-primary-light mb-12 max-w-xl mx-auto uppercase tracking-wider text-sm">
            If you encounter issues with your login, forgotten passwords, or incorrect hour tracking, please reach out to our laboratory staff.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="p-8 rounded-none bg-primary text-white flex flex-col items-center border border-primary">
              <Mail className="h-8 w-8 text-primary-light mb-4" />
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Email Support</p>
              <p className="font-bold uppercase tracking-tight">ccs-lab@university.edu</p>
            </div>
            <div className="p-8 rounded-none border-2 border-primary flex flex-col items-center">
              <MapPin className="h-8 w-8 text-primary mb-4" />
              <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-1">Office Location</p>
              <p className="font-bold text-primary uppercase tracking-tight">CCS Building, 2nd Floor</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
