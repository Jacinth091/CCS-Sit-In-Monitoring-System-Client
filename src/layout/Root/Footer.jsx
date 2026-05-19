import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-base font-bold text-primary">CCS Sit-In Monitoring System</h3>
            <p className="mt-2 text-sm text-primary-light">
              Track and manage laboratory sit-ins efficiently and transparently.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-primary/60 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-primary-light hover:text-primary transition-colors">Home</a></li>
              <li><a href="/about" className="text-primary-light hover:text-primary transition-colors">About</a></li>
              <li><a href="/community" className="text-primary-light hover:text-primary transition-colors">Community</a></li>
              <li><a href="/auth/login" className="text-primary-light hover:text-primary transition-colors">Login</a></li>
              <li><a href="/auth/signup" className="text-primary-light hover:text-primary transition-colors">Signup</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-primary/60 mb-3">Support & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="text-primary-light hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-primary-light hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/support" className="text-primary-light hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="/faq" className="text-primary-light hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-primary/60 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-light">
              <li>ccs-support@example.edu</li>
              <li>CCS Building, Lab Admin Desk</li>
              <li>Mon–Fri, 8:00 AM – 5:00 PM</li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-primary-light">
            © {year} CCS Sit-In Monitoring System. All rights reserved.
          </p>
          <p className="text-xs text-primary-light/50">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
