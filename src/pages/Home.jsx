import { Monitor, BookOpen, Users } from 'lucide-react';
import ccsLogo from '../assets/images/png/uccslogobg.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EAD8B1]/10 flex flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#001F3F] mb-6 shadow-md p-2">
        <img src={ccsLogo} alt="CCS Logo" className="h-full w-full object-contain" />
      </div>

      <p className="text-xs font-bold tracking-widest uppercase text-[#6A9AB0] mb-2">
        College of Computer Studies
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001F3F] max-w-lg leading-tight">
        CCS Laboratory <span className="text-[#3A6D8C]">Sit-In</span> Monitoring System
      </h1>
      <p className="mt-3 text-sm text-[#6A9AB0] max-w-sm leading-relaxed">
        Manage and monitor student access to university computer laboratories — simple, fast, and transparent.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <a
          href="/auth/login"
          className="px-6 py-2.5 rounded-lg bg-[#001F3F] text-[#EAD8B1] text-sm font-semibold hover:bg-[#3A6D8C] transition-colors shadow-sm"
        >
          Login
        </a>
        <a
          href="/auth/signup"
          className="px-6 py-2.5 rounded-lg bg-[#EAD8B1] text-[#001F3F] border border-[#6A9AB0]/30 text-sm font-bold hover:brightness-95 transition-all shadow-sm"
        >
          Sign Up
        </a>
      </div>

      <div className="mt-14 w-full max-w-2xl border-t border-[#6A9AB0]/20" />

      {/* Feature cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full pb-16">
        {[
          { icon: <Monitor className="h-5 w-5 text-[#3A6D8C]" />, label: 'Real-time Monitoring', desc: 'Track lab occupancy and sit-in sessions live.' },
          { icon: <BookOpen className="h-5 w-5 text-[#3A6D8C]" />, label: 'Session Records', desc: 'View complete history of all sit-in activity.' },
          { icon: <Users className="h-5 w-5 text-[#3A6D8C]" />, label: 'Student Management', desc: 'Manage accounts and control lab access.' },
        ].map(({ icon, label, desc }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 bg-white border border-[#6A9AB0]/20 rounded-xl px-5 py-6 shadow-sm hover:shadow-md hover:border-[#3A6D8C]/40 transition-all"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#3A6D8C]/10">
              {icon}
            </div>
            <p className="text-sm font-semibold text-[#001F3F]">{label}</p>
            <p className="text-xs text-[#6A9AB0] leading-relaxed text-center">{desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}