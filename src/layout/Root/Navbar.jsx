import React, { useState } from 'react';
import ccsLogo from '../../assets/images/png/ccsmainlogo.png';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [mobileCommunityOpen, setMobileCommunityOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#6A9AB0]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <img src={ccsLogo} alt="CCS Logo" className="h-9 w-9 object-contain" />
              <span className="text-base font-bold text-[#001F3F] tracking-tight hidden sm:block">
                CCS Sit-In Monitoring System
              </span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/home" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors text-sm font-medium">
              Home
            </a>
            <a href="/about" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors text-sm font-medium">
              About
            </a>
            <div className="relative">
              <button
                onClick={() => setCommunityOpen(!communityOpen)}
                className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors text-sm font-medium flex items-center gap-1"
              >
                Community
                <ChevronDown className={`h-4 w-4 transition-transform ${communityOpen ? 'rotate-180' : ''}`} />
              </button>

              {communityOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-[#6A9AB0]/20 rounded-lg shadow-lg z-10">
                  <a href="/community/forums" className="block px-4 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 text-sm font-medium rounded-t-lg">
                    Forums
                  </a>
                  <a href="/community/events" className="block px-4 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 text-sm font-medium">
                    Events
                  </a>
                  <a href="/community/members" className="block px-4 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 text-sm font-medium rounded-b-lg">
                    Members
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="/auth/login"
              className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors text-sm font-medium"
            >
              Login
            </a>
            <a
              href="/auth/signup"
              className="bg-[#001F3F] text-[#EAD8B1] px-4 py-2 rounded-lg hover:bg-[#3A6D8C] transition-colors text-sm font-medium"
            >
              Sign Up
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => { setIsOpen(!isOpen); setMobileCommunityOpen(false); }}
              className="text-[#6A9AB0] hover:text-[#001F3F] focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <a href="/" className="block px-3 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 rounded-lg text-sm font-medium">
              Home
            </a>
            <a href="/about" className="block px-3 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 rounded-lg text-sm font-medium">
              About
            </a>
            <button
              type="button"
              onClick={() => setMobileCommunityOpen((prev) => !prev)}
              className="w-full px-3 py-2 text-left text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 rounded-lg text-sm font-medium flex items-center justify-between"
            >
              <span>Community</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileCommunityOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileCommunityOpen && (
              <div className="pl-4 space-y-1">
                <a href="/community/forums" className="block px-3 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 rounded-lg text-sm font-medium">
                  Forums
                </a>
                <a href="/community/events" className="block px-3 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 rounded-lg text-sm font-medium">
                  Events
                </a>
                <a href="/community/members" className="block px-3 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 rounded-lg text-sm font-medium">
                  Members
                </a>
              </div>
            )}

            <div className="border-t border-[#6A9AB0]/20 pt-2 mt-2 space-y-2">
              <a href="/auth/login" className="block px-3 py-2 text-[#6A9AB0] hover:text-[#001F3F] hover:bg-[#EAD8B1]/20 rounded-lg text-sm font-medium">
                Login
              </a>
              <a href="/auth/signup" className="block px-3 py-2 bg-[#001F3F] text-[#EAD8B1] rounded-lg text-sm font-medium text-center hover:bg-[#3A6D8C] transition-colors">
                Sign Up
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}