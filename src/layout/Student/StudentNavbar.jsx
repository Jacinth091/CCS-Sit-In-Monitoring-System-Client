import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';
import { Menu, X, LogOut, Bell, User, LayoutDashboard, Megaphone, History, CalendarPlus, MessageCircle, Monitor, Sun, Moon, Clock3, Info, CheckCircle2, ArrowRight, CheckCheck, Trash2 } from 'lucide-react';
import ccsLogo from '../../assets/images/png/ccsmainlogo.png';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notification.service';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 1 },
  { to: '/student/announcements', label: 'Announcements', icon: Megaphone, group: 2 },
  { to: '/student/history', label: 'History', icon: History, group: 2 },
  { to: '/student/testimonials', label: 'Feedback', icon: MessageCircle, group: 2 },
  { to: '/student/reservations', label: 'Reservations', icon: CalendarPlus, group: 3 },
  { to: '/student/software', label: 'Software', icon: Monitor, group: 3 }
];

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

function getInitials(user) {
  const first = user?.first_name?.[0] || '';
  const last = user?.last_name?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'ST';
}

function ProfileDropdown() {
  const { open, setOpen, ref } = useDropdown();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Student';

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-[28px] h-[28px] rounded-full border-[1.5px] border-white/15 bg-primary-hover/20 text-primary-light flex items-center justify-center text-[11px] font-semibold cursor-pointer hover:bg-primary-hover/30 transition-colors"
      >
        {getInitials(user)}
      </button>

      {open && (
        <div className="absolute right-0 top-[36px] w-[210px] rounded-xl p-1.5 z-[120] bg-white border border-border shadow-xl">
          <div className="px-3 py-2.5">
            <p className="text-[12px] font-semibold text-primary truncate">{fullName}</p>
            <p className="text-[11px] mt-1 text-primary-light truncate">{user?.email || 'student@ccs.edu.ph'}</p>
          </div>

          <div className="h-px my-1 bg-border" />

          <NavLink
            to="/student/edit-profile"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-[11px] transition-colors ${
                isActive ? 'text-primary bg-primary/5' : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
              }`
            }
          >
            Edit profile
          </NavLink>

          <NavLink
            to="/student/notifications"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-[11px] transition-colors mt-0.5 ${
                isActive ? 'text-primary bg-primary/5' : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
              }`
            }
          >
            Notifications
          </NavLink>

          <div className="h-px my-1.5 bg-border" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-error hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function NotificationBell() {
  const { open, setOpen, ref } = useDropdown();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const notificationStyles = {
    feedback: { icon: MessageCircle, badge: 'bg-emerald-50 text-emerald-600' },
    announcement: { icon: Megaphone, badge: 'bg-blue-50 text-blue-600' },
    session: { icon: Clock3, badge: 'bg-amber-50 text-amber-600' },
    system: { icon: Info, badge: 'bg-slate-100 text-slate-600' },
    success: { icon: CheckCircle2, badge: 'bg-emerald-50 text-emerald-600' }
  };

  const fetchTrayData = async () => {
    try {
      const [count, list] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.getAll()
      ]);
      setUnreadCount(Number(count) || 0);
      setNotifications(Array.isArray(list) ? list.slice(0, 6) : []);
    } catch (err) {
      console.error('Failed to load notification tray data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrayData();
    const interval = setInterval(fetchTrayData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (notification.isUnread) {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isUnread: false } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(`Failed to mark notification ${notification.id} as read`, err);
    } finally {
      setOpen(false);
      navigate('/student/notifications');
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || isWorking) return;
    setIsWorking(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    } finally {
      setIsWorking(false);
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0 || isWorking) return;
    setIsWorking(true);
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications', err);
    } finally {
      setIsWorking(false);
    }
  };

  const dotBorder = theme === 'dark' ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)';
  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          if (nextOpen) {
            fetchTrayData();
          }
        }}
        className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors cursor-pointer relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span
            className="absolute top-[7px] right-[7px] w-[5px] h-[5px] rounded-full bg-error"
            style={{ border: `1.5px solid ${dotBorder}` }}
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[36px] w-[340px] rounded-2xl z-[120] bg-white border border-border shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-bg-secondary/50">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-primary">Notifications</p>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary-hover/10 text-primary-hover text-[9px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0 || isWorking}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-primary-light hover:text-primary hover:bg-white border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
              <button
                onClick={handleClearAll}
                disabled={!hasNotifications || isWorking}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-red-500 hover:bg-red-50 border border-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </button>
            </div>
          </div>

          <div className="max-h-[330px] overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[10px] font-bold text-primary-light">Loading alerts...</p>
              </div>
            ) : !hasNotifications ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-5 w-5 mx-auto text-primary-light/40 mb-2" />
                <p className="text-[10px] font-bold text-primary-light">Inbox empty</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {notifications.map((notification) => {
                  const style = notificationStyles[notification.type] || notificationStyles.system;
                  const Icon = style.icon;

                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full px-4 py-3 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        notification.isUnread ? 'bg-primary-hover/[0.04] hover:bg-primary-hover/[0.08]' : 'hover:bg-bg-secondary/70'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50 ${style.badge}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-[11px] leading-snug ${notification.isUnread ? 'text-primary font-bold' : 'text-primary/70 font-medium'}`}>
                          {notification.message}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-1.5 text-[9px] font-bold text-primary-light/70">
                          {notification.time || 'Just now'}
                          {notification.isUnread && <span className="w-1 h-1 rounded-full bg-primary-hover" />}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-border bg-white">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/student/notifications');
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
            >
              View all notifications
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-border text-[12px] font-semibold text-primary cursor-pointer hover:bg-bg-secondary transition-colors"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}

function DesktopNav() {
  return (
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
  );
}

export default function StudentNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleMobileLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-[1536px] h-[58px] px-4 sm:px-6 xl:px-12">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-full">
          <div className="flex items-center gap-2.5 pr-4 h-full" style={{ borderRight: '1px solid var(--color-border)' }}>
            <NavLink to="/student/dashboard" className="flex items-center gap-2.5 h-full">
              <img src={ccsLogo} alt="CCS Logo" className="w-[26px] h-[26px] rounded-[6px]" />
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-black tracking-tight text-primary">CCS HUB</span>
                <span className="mt-1 text-[9px] font-bold text-primary-light/70">Student Portal</span>
              </div>
            </NavLink>
          </div>

          <div className="hidden xl:flex items-center justify-center h-full px-4">
            <DesktopNav />
          </div>

          <div className="flex items-center justify-end gap-1.5 pl-4 h-full" style={{ borderLeft: '1px solid var(--color-border)' }}>
            <div className="hidden xl:flex items-center gap-1.5">
              <ThemeToggle />
              <NotificationBell />
              <ProfileDropdown />
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden w-[30px] h-[30px] rounded-[7px] flex items-center justify-center text-primary-light hover:text-primary hover:bg-bg-secondary cursor-pointer transition-colors"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden bg-white mobile-menu border-t border-border">
          <div className="mx-auto max-w-[1536px] px-4 sm:px-6 xl:px-12 py-3 space-y-1.5">
            {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
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
                to="/student/edit-profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center py-2.5 rounded-lg text-[12px] text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                Edit profile
              </NavLink>
              <MobileThemeToggle />
            </div>

            <button
              onClick={handleMobileLogout}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-error bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
