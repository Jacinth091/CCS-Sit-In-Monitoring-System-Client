import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router';
import { Menu, X, LogOut, ChevronDown, User, LayoutDashboard, Megaphone, Users, FlaskConical, ClipboardList, CalendarCheck } from 'lucide-react';
import ccsLogo from '../../assets/images/png/ccsmainlogo.png';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/students', label: 'Students', icon: Users },
  {
    label: 'Sit-in',
    icon: FlaskConical,
    children: [
      { to: '/admin/sit-in', label: 'Current Sit-in' },
      { to: '/admin/sit-in/records', label: 'View Records' },
      { to: '/admin/sit-in/history', label: 'Sit-in History' },
    ],
  },
  { to: '/admin/feedback-reports', label: 'Feedback', icon: ClipboardList },
  { to: '/admin/reservation', label: 'Reservation', icon: CalendarCheck },
];

/* ── Dropdown hook ── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return { open, setOpen, ref };
}

/* ── Profile Dropdown ── */
function ProfileDropdown() {
  const { open, setOpen, ref } = useDropdown();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : 'Administrator';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-[#EAD8B1]/10 transition-all duration-200 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3A6D8C] to-[#EAD8B1] p-0.5 shadow-sm group-hover:shadow-md transition-all">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {user?.profile_pic ? (
              <img 
                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-[#3A6D8C]" />
            )}
          </div>
        </div>
        <div className="hidden xl:flex flex-col items-start leading-none text-left">
          <span className="text-[13px] font-extrabold text-[#001F3F]">{fullName}</span>
          <span className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-widest mt-0.5">Admin Access</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-[#6A9AB0] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-[#6A9AB0]/20 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in-up">
          <div className="px-5 py-3 border-b border-[#6A9AB0]/10 mb-1">
             <p className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-widest mb-1">Admin Email</p>
             <p className="text-[13px] font-extrabold text-[#001F3F] truncate">{user?.email || 'admin@ccs.edu.ph'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Desktop dropdown ── */
function NavDropdown({ label, children, icon: Icon }) {
  const { open, setOpen, ref } = useDropdown();
  const location = useLocation();
  const isChildActive = children.some((c) => 
    c.to === location.pathname || (location.pathname.startsWith(c.to + '/') && c.to !== '/admin/sit-in')
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 text-[13px] font-bold transition-all duration-200 whitespace-nowrap cursor-pointer px-1 py-2 relative group ${
          isChildActive
            ? 'text-[#001F3F]'
            : 'text-[#6A9AB0] hover:text-[#001F3F]'
        }`}
      >
        {Icon && <Icon className={`h-4 w-4 ${isChildActive ? 'text-[#3A6D8C]' : 'text-[#6A9AB0]'}`} />}
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        {isChildActive && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3A6D8C] rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-[#6A9AB0]/15 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in-up">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.to === '/admin/sit-in'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-5 py-3 text-[13px] font-bold transition-colors ${
                  isActive
                    ? 'text-[#3A6D8C] bg-[#EAD8B1]/10'
                    : 'text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/5'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Mobile accordion ── */
function MobileAccordion({ label, children, onNavigate, icon: Icon }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#001F3F] bg-[#EAD8B1]/5 hover:bg-[#EAD8B1]/15 transition-colors cursor-pointer mb-1"
      >
        <div className="flex items-center gap-3">
           {Icon && <Icon className="h-4 w-4 text-[#3A6D8C]" />}
           {label}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-4 pl-4 border-l-2 border-[#EAD8B1] space-y-1 mb-3">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-[#3A6D8C] bg-[#3A6D8C]/5'
                    : 'text-[#6A9AB0] hover:text-[#001F3F]'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ── */
export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <NavLink to="/admin/dashboard" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={ccsLogo} alt="CCS Logo" className="h-10 w-10 object-contain relative z-10" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] sm:text-[17px] font-black tracking-tighter text-primary">
                CCS ADMIN
              </span>
              <span className="text-[9px] font-black text-primary-light/60 uppercase tracking-[0.2em] mt-0.5">
                Sit-in System
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center space-x-1 mr-2">
               {navItems.map((item) =>
                 item.children ? (
                   <NavDropdown key={item.label} label={item.label} children={item.children} icon={item.icon} />
                 ) : (
                   <NavLink
                     key={item.to}
                     to={item.to}
                     className={({ isActive }) =>
                       `px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 ${
                         isActive
                           ? 'text-primary bg-primary/5'
                           : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
                       }`
                     }
                   >
                     {item.icon && <item.icon className={`h-4 w-4 ${location.pathname === item.to ? 'text-primary' : 'text-primary-light'}`} />}
                     {item.label}
                   </NavLink>
                 )
               )}
            </div>

            <div className="h-8 w-[1px] bg-border mx-2 hidden xl:block" />
            
            <ProfileDropdown />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-[#001F3F] hover:bg-[#EAD8B1]/20 transition-all cursor-pointer"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#6A9AB0]/10 px-4 pt-2 pb-8 space-y-2 animate-fade-in shadow-inner overflow-y-auto max-h-[calc(100vh-64px)]">
          {navItems.map((item) =>
            item.children ? (
              <MobileAccordion
                key={item.label}
                label={item.label}
                children={item.children}
                icon={item.icon}
                onNavigate={() => setMobileOpen(false)}
              />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'text-[#3A6D8C] bg-[#3A6D8C]/5'
                      : 'text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/5'
                  }`
                }
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </NavLink>
            )
          )}
          
          <div className="pt-4 mt-2 border-t border-[#6A9AB0]/10">
             <div className="flex items-center gap-3 px-4 py-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center overflow-hidden">
                   {user?.profile_pic ? (
                      <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} alt="" className="w-full h-full object-cover" />
                   ) : (
                      <User className="h-5 w-5 text-[#3A6D8C]" />
                   )}
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-black text-[#001F3F]">{user?.first_name} {user?.last_name}</span>
                   <span className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-widest">{user?.email}</span>
                </div>
             </div>
             <button
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-[#001F3F] text-[#EAD8B1] text-sm font-black hover:bg-[#3A6D8C] transition-all shadow-lg active:scale-95 cursor-pointer"
             >
               <LogOut className="h-4 w-4" />
               Sign Out
             </button>
          </div>
        </div>
      )}
    </nav>
  );
}
