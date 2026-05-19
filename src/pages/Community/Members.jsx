import React from 'react';
import { Search, Mail, MessageCircle, Star, ShieldCheck, User, HardDrive, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';

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
    <div className="min-h-screen bg-bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        
        {/* Simplified Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border pb-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-white/10 shadow-lg">
                <User className="h-5 w-5 text-brand-sand" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Community Directory</p>
            </div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              Laboratory <span className="text-primary-hover">Network</span>
            </h1>
            <p className="text-primary-light text-sm max-w-2xl leading-relaxed font-medium">
              Connect with laboratory staff, student assistants, and fellow sit-in users within the CCS ecosystem.
            </p>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME OR ROLE..." 
              className="w-full pl-11 pr-4 h-12 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <Card key={member.id} className="p-0 overflow-hidden bg-white border-primary/5 shadow-xl group hover:shadow-2xl transition-all duration-300">
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-brand-sand text-2xl font-black border-4 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white shadow-lg ${
                      member.status === 'online' ? 'bg-emerald-500 animate-pulse' : 
                      member.status === 'away' ? 'bg-amber-500' : 'bg-gray-300'
                    }`} />
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                     {member.role.includes('Admin') ? (
                        <span className="px-2 py-1 rounded-lg bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/10">Administrator</span>
                     ) : member.role.includes('Assistant') ? (
                        <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest border border-amber-100">Student Staff</span>
                     ) : (
                        <span className="px-2 py-1 rounded-lg bg-bg-secondary text-primary-light text-[8px] font-black uppercase tracking-widest border border-border">User</span>
                     )}
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-black text-primary tracking-tight uppercase">{member.name}</h3>
                  <p className="text-[10px] font-black text-primary-light/60 uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-bg-secondary/50 rounded-xl border border-border/50 group-hover:bg-white group-hover:border-primary/20 transition-all">
                    <div className="p-2 bg-white rounded-lg border border-border shadow-sm">
                      <HardDrive className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest leading-none">{member.specialty}</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 h-12 flex items-center justify-center gap-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all active:scale-[0.98]">
                      <Mail className="h-4 w-4" />
                      Inquire
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center bg-bg-secondary text-primary-light rounded-xl border border-border hover:bg-white hover:text-primary hover:border-primary/30 transition-all group/msg">
                      <MessageCircle className="h-5 w-5 group-hover/msg:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Directory Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
           {[
             { label: 'Lab Support Staff', value: '12', icon: ShieldCheck },
             { label: 'Verified Assistants', value: '45', icon: Star },
             { label: 'Active Terminal Users', value: '1.2k', icon: User }
           ].map((stat, i) => (
             <Card key={i} className="p-8 bg-white border-primary/5 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
                <stat.icon className="h-6 w-6 text-primary/20 mb-4 group-hover:text-primary transition-colors" />
                <p className="text-4xl font-extrabold text-primary tracking-tighter mb-2">{stat.value}</p>
                <p className="text-[10px] font-black text-primary-light/60 uppercase tracking-[0.2em]">{stat.label}</p>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}
