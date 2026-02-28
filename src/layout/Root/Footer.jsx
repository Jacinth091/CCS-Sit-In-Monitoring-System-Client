import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#6A9AB0]/20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-base font-bold text-[#001F3F]">CCS Sit-In Monitoring System</h3>
            <p className="mt-2 text-sm text-[#6A9AB0]">
              Track and manage laboratory sit-ins efficiently and transparently.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#001F3F]/60 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/home" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">Home</a></li>
              <li><a href="/about" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">About</a></li>
              <li><a href="/community" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">Community</a></li>
              <li><a href="/auth/login" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">Login</a></li>
              <li><a href="/auth/signup" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">Signup</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#001F3F]/60 mb-3">Support & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">Terms of Service</a></li>
              <li><a href="/support" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">Contact Support</a></li>
              <li><a href="/faq" className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[#001F3F]/60 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-[#6A9AB0]">
              <li>ccs-support@example.edu</li>
              <li>CCS Building, Lab Admin Desk</li>
              <li>Mon–Fri, 8:00 AM – 5:00 PM</li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-[#6A9AB0]/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#6A9AB0]">
            © {year} CCS Sit-In Monitoring System. All rights reserved.
          </p>
          <p className="text-xs text-[#6A9AB0]/50">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}