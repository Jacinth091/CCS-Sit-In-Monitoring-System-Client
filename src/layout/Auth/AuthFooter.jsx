import React from 'react';

export default function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#6A9AB0]/20 bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-[#6A9AB0]">
          © {year} CCS Sit-In Monitoring System. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-[#6A9AB0]">
          <a href="/terms" className="hover:text-[#001F3F] transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-[#001F3F] transition-colors">Privacy</a>
          <a href="/support" className="hover:text-[#001F3F] transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}