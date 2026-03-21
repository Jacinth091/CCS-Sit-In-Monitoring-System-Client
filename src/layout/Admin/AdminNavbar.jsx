import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import ccsLogo from '../../assets/images/png/uccslogobg.png';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Home' },
  { to: '/admin/announcements', label: 'Announcements' },
  { to: '/admin/students', label: 'Students' },
  {
    label: 'Sit-in',
    children: [
      { to: '/admin/sit-in', label: 'Current Sit-in' },
      { to: '/admin/sit-in-records', label: 'View Records' },
      { to: '/admin/sit-in-reports', label: 'Sit-in Reports' },
    ],
  },
  { to: '/admin/feedback-reports', label: 'Feedback Reports' },
  { to: '/admin/reservation', label: 'Reservation' },
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

/* ── Desktop dropdown ── */
function NavDropdown({ label, children }) {
  const { open, setOpen, ref } = useDropdown();
  const isChildActive = children.some((c) => location.pathname.startsWith(c.to));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-[13px] font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${
          isChildActive
            ? 'text-[#001F3F] font-semibold'
            : 'text-[#6A9AB0] hover:text-[#001F3F]'
        }`}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-[#6A9AB0]/20 rounded-lg shadow-lg py-1 z-50">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#001F3F] bg-[#EAD8B1]/20'
                    : 'text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/10'
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
function MobileAccordion({ label, children, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/15 transition-colors cursor-pointer"
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-3 pl-3 border-l border-[#6A9AB0]/20 space-y-0.5 mt-0.5">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#001F3F] bg-[#EAD8B1]/20'
                    : 'text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/10'
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
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#6A9AB0]/20 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo + Title */}
          <NavLink to="/admin/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={ccsLogo} alt="CCS Logo" className="h-8 w-8 object-contain" />
            <span className="text-[13px] font-bold tracking-wide text-[#001F3F] hidden lg:block">
              College of Computer Studies Admin
            </span>
            <span className="text-[13px] font-bold tracking-wide text-[#001F3F] lg:hidden">
              CCS Admin
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} label={item.label} children={item.children} />
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-[13px] font-medium transition-colors duration-200 whitespace-nowrap ${
                      isActive
                        ? 'text-[#001F3F] font-semibold'
                        : 'text-[#6A9AB0] hover:text-[#001F3F]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* Desktop Logout */}
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#001F3F] text-[#EAD8B1] text-sm font-bold hover:bg-[#3A6D8C] transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[#001F3F] hover:text-[#3A6D8C] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#6A9AB0]/15 px-4 pb-4 space-y-1">
          {navItems.map((item) =>
            item.children ? (
              <MobileAccordion
                key={item.label}
                label={item.label}
                children={item.children}
                onNavigate={() => setMobileOpen(false)}
              />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#001F3F] bg-[#EAD8B1]/20'
                      : 'text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
          <div className="border-t border-[#6A9AB0]/15 pt-2 mt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#001F3F] text-[#EAD8B1] text-sm font-bold hover:bg-[#3A6D8C] transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
