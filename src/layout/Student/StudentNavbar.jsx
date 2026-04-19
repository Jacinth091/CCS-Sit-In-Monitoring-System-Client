import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router';
import { Menu, X, LogOut, Bell, ChevronDown, User, LayoutDashboard, Megaphone, History, ChevronRight } from 'lucide-react';
import ccsLogo from '../../assets/images/png/ccsmainlogo.png';
import { useAuth } from '../../context/AuthContext';

import StudentNotificationList from '../../components/notifications/StudentNotificationList';
import notificationService from '../../services/notification.service';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/student/history', label: 'My History', icon: History },
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
    : 'Student';

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
          <span className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-widest mt-0.5">Student Account</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-[#6A9AB0] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-[#6A9AB0]/20 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in-up">
          <div className="px-5 py-3 border-b border-[#6A9AB0]/10 mb-1">
             <p className="text-[10px] font-bold text-[#6A9AB0] uppercase tracking-widest mb-1">Signed in as</p>
             <p className="text-[13px] font-extrabold text-[#001F3F] truncate">{user?.email}</p>
          </div>
          <NavLink
            to="/student/edit-profile"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-5 py-3 text-[13px] font-bold transition-colors ${
                isActive
                  ? 'text-[#3A6D8C] bg-[#EAD8B1]/10'
                  : 'text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/5'
              }`
            }
          >
            Edit Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3 cursor-pointer border-t border-[#6A9AB0]/10 mt-1"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Notification bell dropdown ── */
function NotificationBell() {
  const { open, setOpen, ref } = useDropdown();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data.slice(0, 5));
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Fail silently
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.deleteAll();
      fetchData();
    } catch (err) {
      // Fail silently
    }
  };

  const handleRead = async (n) => {
    await notificationService.markAsRead(n.id);
    fetchData();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 text-[13px] font-bold transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer group ${
          open ? 'bg-[#EAD8B1]/15 text-[#001F3F]' : 'text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/10'
        }`}
      >
        <div className="relative">
           <Bell className="h-4 w-4" />
           {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white flex items-center justify-center text-[8px] font-black text-white">
                {unreadCount > 9 ? '!' : unreadCount}
              </span>
           )}
        </div>
        <span className="hidden sm:inline">Alerts</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-border rounded-xl shadow-2xl overflow-hidden z-[100] animate-fade-in-up">
           <StudentNotificationList 
              notifications={notifications} 
              onClearAll={handleClearAll}
              onRead={handleRead}
           />
           <div className="bg-bg-secondary/30 border-t border-border p-3 text-center">
              <NavLink 
                to="/student/notifications" 
                onClick={() => setOpen(false)}
                className="text-[9px] font-black text-primary-hover uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                Explore All Alerts <ChevronRight className="h-3 w-3" />
              </NavLink>
           </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ── */
export default function StudentNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMobileLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section - Matching Admin Style */}
          <NavLink to="/student/dashboard" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={ccsLogo} alt="CCS Logo" className="h-10 w-10 object-contain relative z-10" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] sm:text-[17px] font-black tracking-tighter text-primary">
                CCS HUB
              </span>
              <span className="text-[9px] font-black text-primary-light/60 uppercase tracking-[0.2em] mt-0.5">
                Student Portal
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center space-x-1 mr-2">
               {navItems.map((item) => (
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
               ))}
            </div>

            <div className="h-8 w-[1px] bg-border mx-2" />

            <div className="flex items-center gap-4">
               <NotificationBell />
               <ProfileDropdown />
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-primary hover:bg-bg-secondary transition-all cursor-pointer"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border px-4 pt-2 pb-8 space-y-2 animate-fade-in shadow-inner overflow-y-auto max-h-[calc(100vh-64px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
                }`
              }
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/student/notifications"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? 'text-primary bg-primary/5' 
                  : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
              }`
            }
          >
            <Bell className="h-4 w-4" /> Notifications
          </NavLink>
          
          <div className="pt-4 mt-2 border-t border-border">
             <div className="flex items-center gap-3 px-4 py-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center overflow-hidden">
                   {user?.profile_pic ? (
                      <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} alt="" className="w-full h-full object-cover" />
                   ) : (
                      <User className="h-5 w-5 text-primary" />
                   )}
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-black text-primary">{user?.first_name} {user?.last_name}</span>
                   <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest truncate max-w-[180px]">{user?.email}</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-2 mb-4">
                <NavLink 
                  to="/student/edit-profile" 
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-border text-[11px] font-black text-primary uppercase tracking-widest"
                >
                  Profile Settings
                </NavLink>
             </div>

             <button
               onClick={handleMobileLogout}
               className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-primary-hover transition-all shadow-lg active:scale-95 cursor-pointer"
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
