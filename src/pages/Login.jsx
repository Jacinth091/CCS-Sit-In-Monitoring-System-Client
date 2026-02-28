import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import ccsLogo from '../assets/images/png/uccslogobg.png';

const inputStyles =
  "w-full px-0 py-2 bg-transparent border-0 border-b border-[#6A9AB0]/30 focus:ring-0 focus:outline-none focus:border-[#3A6D8C] text-[#001F3F] text-sm transition-colors placeholder:text-[#6A9AB0]/50";
const labelStyles =
  "block text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60 mb-1";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAD8B1]/20 p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div
          className="hidden md:flex flex-col justify-between p-10 md:w-2/5 bg-[#001F3F] bg-cover bg-center relative"
          style={{ backgroundImage: "url('/login-illustration.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#001F3F]/80 rounded-l-2xl" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex-shrink-0">
                <a href="/" className="flex items-center gap-2">
                <img src={ccsLogo} alt="CCS Logo" className="h-9 w-9 object-contain" />
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#EAD8B1]/70">
                CCS Sit-In Monitoring
                </span>
                </a>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#EAD8B1] leading-snug mb-3">
                Welcome back!
              </h3>
              <p className="text-sm text-[#EAD8B1]/80 leading-relaxed max-w-xs">
                Sign in to monitor lab sessions, track your sit-in history, and stay connected with the CCS community.
              </p>
              <a
                href="/auth/signup"
                className="mt-6 inline-block text-sm font-medium text-[#EAD8B1] border border-[#EAD8B1]/30 px-4 py-2 rounded-lg hover:bg-[#EAD8B1]/10 transition"
              >
                Create an account →
              </a>
            </div>
            <p className="text-xs text-[#6A9AB0]/80">
              Tip: Use your institutional email to log in.
            </p>
          </div>
        </div>
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-[#6A9AB0] hover:text-[#001F3F] font-medium mb-8 transition-colors self-start"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
            </button>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001F3F]">Sign in</h2>
            <p className="mt-1 text-sm text-[#6A9AB0]">Enter your credentials to continue.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className={labelStyles}>ID Number</label>
              <input type="text" placeholder="e.g. 12345678" className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`${inputStyles} pr-8`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6A9AB0] hover:text-[#001F3F] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#001F3F]/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-[#6A9AB0]/50 accent-[#3A6D8C]"
                />
                Remember me
              </label>
              <a href="/auth/forgot-password" className="text-[#3A6D8C] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <hr className="border-[#6A9AB0]/20" />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#3A6D8C] hover:bg-[#001F3F] text-[#EAD8B1] font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm tracking-wide"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-xs text-[#6A9AB0]">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-[#3A6D8C] font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

