import React from 'react';
import ccsLogo from '../../assets/images/png/ccsmainlogo.png';

export default function AuthNavbar() {
  return (
    <nav className="w-full bg-white border-b border-[#6A9AB0]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2">
            <img src={ccsLogo} alt="CCS Logo" className="h-8 w-8 object-contain" />
            <span className="text-sm font-bold text-[#001F3F] tracking-tight hidden sm:block">
              CCS Sit-In Monitoring
            </span>
          </a>
          <p className="text-xs text-[#6A9AB0]">
            Secure Authentication
          </p>

        </div>
      </div>
    </nav>
  );
}