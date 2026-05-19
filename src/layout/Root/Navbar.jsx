import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { Menu, X, House, CircleHelp, Users, MessageSquare, CalendarDays, UsersRound, LogIn, UserPlus, Trophy } from 'lucide-react';
import ccsLogo from '../../assets/images/png/ccsmainlogo.png';

const navItems = [
  { to: '/', label: 'Home', icon: House, group: 1 },
  { to: '/about', label: 'About', icon: CircleHelp, group: 1 },
  { to: '/community/forums', label: 'Forums', icon: MessageSquare, group: 2 },
  { to: '/community/events', label: 'Events', icon: CalendarDays, group: 2 },
  { to: '/community/members', label: 'Members', icon: UsersRound, group: 2 },
  { to: '/community/leaderboards', label: 'Leaderboards', icon: Trophy, group: 2 }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-[1536px] h-[58px] px-4 sm:px-6 xl:px-12">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-full">
          <div className="flex items-center gap-2.5 pr-4 h-full" style={{ borderRight: '1px solid var(--color-border)' }}>
            <NavLink to="/" className="flex items-center gap-2.5 h-full">
              <img src={ccsLogo} alt="CCS Logo" className="w-[26px] h-[26px] rounded-[6px]" />
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-black tracking-tight text-primary">CCS HUB</span>
                <span className="mt-1 text-[9px] font-bold text-primary-light/70 uppercase tracking-[0.18em]">Sit-in Portal</span>
              </div>
            </NavLink>
          </div>

          <div className="hidden md:flex items-center justify-center h-full px-4">
            <div className="flex items-center justify-center">
              {navItems.map((item, idx) => {
                const prevGroup = navItems[idx - 1]?.group;
                const showDivider = idx > 0 && prevGroup !== item.group;
                const Icon = item.icon;

                return (
                  <React.Fragment key={item.to}>
                    {showDivider && <span className="w-px h-4 mx-1.5 bg-border-strong" />}
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `inline-flex items-center gap-2 text-[12.5px] px-[11px] py-[5px] rounded-[7px] transition-colors ${
                          isActive ? 'font-bold text-primary bg-primary/10' : 'font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary'
                        }`
                      }
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </NavLink>
                  </React.Fragment>
                );
              })}

            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-4 h-full justify-end" style={{ borderLeft: '1px solid var(--color-border)' }}>
            <div className="hidden md:flex items-center gap-1.5">
              <NavLink
                to="/auth/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </NavLink>
              <NavLink
                to="/auth/signup"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-[0.12em] bg-primary text-brand-sand hover:bg-primary-hover transition-colors"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Sign Up
              </NavLink>
            </div>

            <button
              onClick={() => {
                setMobileOpen((prev) => !prev);
              }}
              className="md:hidden w-[30px] h-[30px] rounded-[7px] flex items-center justify-center text-primary-light hover:text-primary hover:bg-bg-secondary cursor-pointer transition-colors"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="mx-auto max-w-[1536px] px-4 sm:px-6 xl:px-12 py-3 space-y-1.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] transition-colors ${
                    isActive ? 'font-bold text-primary bg-primary/10' : 'font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}

            <div className="h-px my-2 bg-border" />

            <div className="grid grid-cols-2 gap-2">
              <NavLink
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Login
              </NavLink>
              <NavLink
                to="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-semibold text-brand-sand bg-primary hover:bg-primary-hover transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
