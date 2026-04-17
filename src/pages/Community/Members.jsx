import React from 'react';
import { Search, Mail, MessageCircle, Star, ShieldCheck, User, HardDrive } from 'lucide-react';

export default function Members() {
  const members = [
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Lab Administrator', specialty: 'Network Infrastructure', avatar: 'SJ', status: 'online' },
    { id: 2, name: 'Engr. Marcus Chen', role: 'Technical Staff', specialty: 'System Maintenance', avatar: 'MC', status: 'away' },
    { id: 3, name: 'John Doe', role: 'Student Assistant (SA)', specialty: 'Lab 1 Monitor', avatar: 'JD', status: 'online' },
    { id: 4, name: 'Jane Smith', role: 'Student Assistant (SA)', specialty: 'Lab 2 Monitor', avatar: 'JS', status: 'offline' },
    { id: 5, name: 'Alex Rivera', role: 'Regular Sit-in User', specialty: 'BSCS - 3rd Year', avatar: 'AR', status: 'online' },
    { id: 6, name: 'Emily Wong', role: 'Regular Sit-in User', specialty: 'BSIT - 2nd Year', avatar: 'EW', status: 'offline' },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary-hover font-bold uppercase tracking-widest text-[10px] mb-2">
              <User className="h-3 w-3" />
              Laboratory Directory
            </div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight uppercase">Meet the Community</h1>
            <p className="text-primary-light mt-1 text-sm uppercase tracking-wider">Connect with laboratory staff, student assistants, and fellow sit-in users.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light" />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME OR ROLE..." 
              className="w-full pl-11 pr-4 py-2.5 bg-bg-primary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-hover/20 transition-all duration-150 text-sm uppercase tracking-wider"
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-bg-primary rounded-lg border border-border p-6 transition-all duration-150 group relative overflow-hidden">
              {/* Role badge top right */}
              <div className="absolute top-0 right-0 p-4">
                 {member.role.includes('Admin') ? (
                    <ShieldCheck className="h-5 w-5 text-primary-hover/20" />
                 ) : member.role.includes('Assistant') ? (
                    <Star className="h-5 w-5 text-amber-500/20" />
                 ) : (
                    <User className="h-5 w-5 text-primary-light/20" />
                 )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-brand-sand text-lg font-bold border border-primary">
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-bg-primary ${
                    member.status === 'online' ? 'bg-emerald-500' : 
                    member.status === 'away' ? 'bg-amber-500' : 'bg-gray-300'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-primary leading-tight uppercase tracking-tight">{member.name}</h3>
                  <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
                  <div className="p-1.5 bg-bg-primary rounded-md border border-border">
                    <HardDrive className="h-3.5 w-3.5 text-primary-hover" />
                  </div>
                  <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">{member.specialty}</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-brand-sand rounded-md text-xs font-bold uppercase tracking-widest hover:bg-primary-hover transition-colors duration-150 border border-primary">
                    <Mail className="h-3.5 w-3.5" />
                    Contact
                  </button>
                  <button className="p-2.5 bg-bg-secondary text-primary-light rounded-md border border-border hover:border-primary-hover hover:text-primary-hover transition-colors duration-150">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Decorative light gradient removed for minimalist look */}
            </div>
          ))}
        </div>

        {/* Directory Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="p-6 bg-bg-primary rounded-lg border border-border text-center">
              <p className="text-3xl font-extrabold text-primary">12</p>
              <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Lab Staff</p>
           </div>
           <div className="p-6 bg-bg-primary rounded-lg border border-border text-center">
              <p className="text-3xl font-extrabold text-primary">45</p>
              <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Student Assistants</p>
           </div>
           <div className="p-6 bg-bg-primary rounded-lg border border-border text-center">
              <p className="text-3xl font-extrabold text-primary">1.2k</p>
              <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Registered Students</p>
           </div>
        </div>
      </div>
    </div>
  );
}
