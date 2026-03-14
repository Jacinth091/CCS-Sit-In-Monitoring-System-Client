import React, { useState } from 'react'; // Added useState
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router'; // Added useNavigate
import ccsLogo from '../assets/images/png/uccslogobg.png';
import authService from '../services/auth.service'; // Adjust path if your file is named differently!

export default function SignUp() {
  const inputStyles =
    "w-full px-0 py-2 bg-transparent border-0 border-b border-[#6A9AB0]/30 focus:ring-0 focus:outline-none focus:border-[#3A6D8C] text-[#001F3F] text-sm transition-colors placeholder:text-[#6A9AB0]/50";
  const labelStyles =
    "block text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60 mb-1";

  const navigate = useNavigate();

  // 1. Setup State for the form data
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    course: '',
    course_level: '',
    email: '',
    password: '',
    confirm_password: '',
    address: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Handle input changes dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Form Submission Logic
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    // Basic required field check
    if (!formData.student_id || !formData.first_name || !formData.last_name || !formData.password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Send data to PHP
      await authService.register(formData);
      
      alert("Registration Successful! Please log in.");
      navigate('/auth/login'); // Redirect to login page

    } catch (err) {
      // Show error from PHP (e.g., "ID may already exist")
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAD8B1]/20 p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDE PANEL (Unchanged) */}
        <div
          className="hidden md:flex flex-col justify-between p-10 md:w-2/5 bg-[#001F3F] bg-cover bg-center relative"
          style={{ backgroundImage: "url('/signup-illustration.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#001F3F]/75 rounded-l-2xl" />
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
                Join the CCS Community
              </h3>
              <p className="text-sm text-[#EAD8B1]/80 leading-relaxed max-w-xs">
                Create an account to manage and monitor lab sit-ins, access forums, and stay updated with events.
              </p>
              <a
                href="/"
                className="mt-6 inline-block text-sm font-medium text-[#EAD8B1] border border-[#EAD8B1]/30 px-4 py-2 rounded-lg hover:bg-[#EAD8B1]/10 transition"
              >
                Learn more →
              </a>
            </div>
            <p className="text-xs text-[#6A9AB0]/80">
              Tip: Use your institutional email for faster verification.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE PANEL (Form) */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <button
            onClick={() => navigate(-1)} // Fixed back button logic
            className="flex items-center gap-1 text-sm text-[#6A9AB0] hover:text-[#001F3F] font-medium mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001F3F]">Create your account</h2>
            <p className="mt-1 text-sm text-[#6A9AB0]">Fill in the details below to get started.</p>
          </div>

          {/* 4. Display Error Messages */}
          {errorMsg && (
             <div className="mb-6 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
               {errorMsg}
             </div>
          )}

          {/* 5. Bind onSubmit and add name/value/onChange to all inputs */}
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className={labelStyles}>ID Number</label>
              <input 
                type="text" 
                name="student_id" 
                value={formData.student_id} 
                onChange={handleChange} 
                placeholder="e.g. 12345678" 
                className={inputStyles} 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Juan" className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Middle Name</label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="(Optional)" className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Dela Cruz" className={inputStyles} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Course</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="BSIT" className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Year Level</label>
                <input type="number" name="course_level" value={formData.course_level} onChange={handleChange} placeholder="3" min="1" max="5" className={inputStyles} />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.edu" className={inputStyles} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={inputStyles} />
              </div>
              <div>
                <label className={labelStyles}>Confirm Password</label>
                <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" className={inputStyles} />
              </div>
            </div>

            <div>
              <label className={labelStyles}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Cebu City" className={inputStyles} />
            </div>

            <hr className="border-[#6A9AB0]/20" />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-[#EAD8B1] font-semibold py-3 rounded-lg transition-all duration-300 shadow-md text-sm tracking-wide ${
                isLoading ? 'bg-[#6A9AB0] cursor-not-allowed' : 'bg-[#3A6D8C] hover:bg-[#001F3F] hover:shadow-lg'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>
          <p className="mt-5 text-xs text-[#6A9AB0]">
            Already have an account?{' '}
            <a href="/auth/login" className="text-[#3A6D8C] font-semibold hover:underline">
              Login
            </a>
          </p>
          <p className="mt-2 text-xs text-[#6A9AB0]/70">
            By registering you agree to our{' '}
            <a href="/terms" className="underline">Terms</a> and{' '}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </div>

      </div>
    </div>
  );
}