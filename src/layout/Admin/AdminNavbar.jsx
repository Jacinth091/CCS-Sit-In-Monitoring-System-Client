import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router';
import { Menu, X, LogOut, ChevronDown, User, LayoutDashboard, Users, FlaskConical, ClipboardList, CalendarCheck, FileText, Monitor, Sun, Moon } from 'lucide-react';
import ccsLogo from '../../assets/images/png/ccsmainlogo.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 1 },
  {
    label: 'Students',
    icon: Users,
    group: 2,
    children: [
      { to: '/admin/students', label: 'Student directory' },
      { to: '/admin/announcements', label: 'Announcements' }
    ]
  },
  {
    label: 'Sit-in',
    icon: FlaskConical,
    group: 2,
    children: [
      { to: '/admin/sit-in', label: 'Live sit-in' },
      { to: '/admin/sit-in/history', label: 'Session History' }
    ]
  },
  { to: '/admin/reservation', label: 'Reservations', icon: CalendarCheck, group: 2 },
  { to: '/admin/laboratory-software', label: 'Laboratories & Software', icon: Monitor, group: 3 },
  {
    label: 'Reports',
    icon: FileText,
    group: 3,
    children: [
      { to: '/admin/reports', label: 'Usage reports' },
      { to: '/admin/analytics', label: 'System analytics' }
    ]
  },
  { to: '/admin/testimonials', label: 'Testimonials', icon: ClipboardList, group: 3 }
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

function ProfileDropdown() {
  const { open, setOpen, ref } = useDropdown();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : 'Administrator';

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-[28px] h-[28px] rounded-[7px] border-[1.5px] border-white/15 bg-primary-hover/20 text-primary-light flex items-center justify-center cursor-pointer hover:bg-primary-hover/30 transition-colors"
      >
        <User className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-[36px] w-[210px] rounded-xl p-1.5 z-[120] bg-white border border-border">
          <div className="px-3 py-2.5">
            <p className="text-[12px] font-semibold text-primary truncate">{fullName}</p>
            <p className="text-[11px] mt-1 text-primary-light truncate">{user?.email || 'admin@ccs.edu.ph'}</p>
          </div>

          <div className="h-px my-1 bg-border" />

          <button className="w-full text-left px-3 py-2 rounded-lg text-[11px] text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors cursor-pointer">
            System settings
          </button>

          <button className="w-full text-left px-3 py-2 rounded-lg text-[11px] text-primary-light hover:text-primary hover:bg-bg-secondary transition-colors cursor-pointer mt-0.5">
            Manage admins
          </button>

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

function NavDropdown({ item }) {
  const { open, setOpen, ref } = useDropdown();
  const location = useLocation();
  const Icon = item.icon;

  const isChildActive = item.children?.some((c) =>
    c.to === location.pathname || location.pathname.startsWith(c.to + '/')
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 text-[12.5px] px-[11px] py-[5px] rounded-[7px] transition-colors cursor-pointer ${isChildActive ? 'font-bold text-primary bg-primary/10' : 'font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary'
          }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[36px] w-[210px] rounded-xl p-1.5 z-[120] bg-white border border-border">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.to === '/admin/sit-in'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-[11px] transition-colors ${isActive ? 'text-primary bg-primary/5' : 'text-primary-light hover:text-primary hover:bg-bg-secondary'
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

function DesktopNav() {
  return (
    <div className="flex items-center justify-center">
      {navItems.map((item, idx) => {
        const prevGroup = navItems[idx - 1]?.group;
        const showDivider = idx > 0 && prevGroup !== item.group;
        const Icon = item.icon;

        return (
          <React.Fragment key={item.to || item.label}>
            {showDivider && <span className="w-px h-4 mx-1.5 bg-border-strong" />}
            {item.children ? (
              <NavDropdown item={item} />
            ) : (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 text-[12.5px] px-[11px] py-[5px] rounded-[7px] transition-colors ${isActive ? 'font-bold text-primary bg-primary/10' : 'font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </NavLink>
            )}
          </React.Fragment>
        );
      })}
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

export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const toggleMobileSection = (label) => {
    setMobileSectionsOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isMobileSectionActive = (item) =>
    item.children?.some(
      (child) => location.pathname === child.to || location.pathname.startsWith(child.to + '/')
    );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-[1536px] h-[58px] px-4 sm:px-6 xl:px-12">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-full">
          <div className="flex items-center gap-2.5 pr-4 h-full" style={{ borderRight: '1px solid var(--color-border)' }}>
            <NavLink to="/admin/dashboard" className="flex items-center gap-2.5 h-full">
              <img src={ccsLogo} alt="CCS Logo" className="w-[26px] h-[26px] rounded-[6px]" />
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-black tracking-tight text-primary">CCS ADMIN</span>
                <span className="mt-1 text-[9px] font-bold text-primary-light/70 uppercase tracking-[0.18em]">Sit-in System</span>
              </div>
            </NavLink>
          </div>

          <div className="hidden xl:flex items-center justify-center h-full px-4">
            <DesktopNav />
          </div>

          <div className="flex items-center justify-end gap-1.5 pl-4 h-full" style={{ borderLeft: '1px solid var(--color-border)' }}>
            <div className="hidden xl:flex items-center gap-1.5">
              <ThemeToggle />
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
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                const expanded = mobileSectionsOpen[item.label] ?? isMobileSectionActive(item);
                return (
                  <div key={item.label} className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleMobileSection(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] transition-colors cursor-pointer ${isMobileSectionActive(item)
                          ? 'font-bold text-primary bg-primary/10'
                          : 'font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary'
                        }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>

                    {expanded && (
                      <div className="pl-4 border-l ml-4 border-border">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-lg text-[12px] transition-colors ${isActive ? 'font-bold text-primary bg-primary/10' : 'font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary'
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

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] transition-colors ${isActive ? 'font-bold text-primary bg-primary/10' : 'font-semibold text-primary-light hover:text-primary hover:bg-bg-secondary'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}

            <div className="h-px my-2 bg-border" />

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center py-2.5 rounded-lg text-[12px] text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                Settings
              </button>
              <MobileThemeToggle />
            </div>

            <button
              onClick={handleLogout}
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
