import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router'; 
import ccsLogo from '../assets/images/png/uccslogobg.png';
import authService from '../services/auth.service';
import { toast } from 'sonner';
import { ACADEMIC_YEARS } from '../constants/app.constants';
import { CourseSearchableDropdown } from '../components/ui';
import { 
  validateIdNumber, 
  validateName, 
  validateEmail, 
  validateAddress 
} from '../utils/validationUtils';

export default function SignUp() {
  const inputStyles =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelStyles =
    "block text-[9px] font-black tracking-[0.15em] uppercase text-primary-light mb-1.5 ml-1";

  const navigate = useNavigate();

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Field Validation
    if (!validateIdNumber(formData.student_id)) {
      toast.error("ID Number must be exactly 8 digits.");
      return;
    }

    if (!validateName(formData.first_name)) {
      toast.error("Invalid First Name format.");
      return;
    }

    if (formData.middle_name && !validateName(formData.middle_name)) {
      toast.error("Invalid Middle Name format.");
      return;
    }

    if (!validateName(formData.last_name)) {
      toast.error("Invalid Last Name format.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.address?.trim() && !validateAddress(formData.address)) {
      toast.error("Please enter a valid address (min. 5 characters).");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!formData.course || !formData.course_level) {
      toast.error("Please select your course and year level.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(formData);
      
      toast.success("Registration Successful! Redirecting to login...");
      navigate('/auth/login');

    } catch (err) {
      // Improved error message extraction based on Backend Validation Guide
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response) {
        const data = err.response.data;
        const status = err.response.status;
        
        if (status === 409) {
          errorMessage = data.message || data.error || "This Student ID or Email is already registered.";
        } else if (status === 422) {
          if (data.errors && typeof data.errors === 'object') {
            errorMessage = Object.values(data.errors)[0];
          } else {
            errorMessage = data.message || "Validation failed. Please check your inputs.";
          }
        } else {
          errorMessage = data.message || data.error || err.customMessage || `Error ${status}: Registration failed.`;
        }
      } else if (err.customMessage) {
        errorMessage = err.customMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col md:flex-row">
          <div
            className="hidden md:flex flex-col justify-between p-10 md:w-2/5 bg-primary bg-cover bg-center relative"
            style={{ backgroundImage: "url('/login-illustration.jpg')" }}
          >
            <div className="absolute inset-0 bg-primary/90" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex-shrink-0">
                <a href="/" className="flex items-center gap-2">
                <img src={ccsLogo} alt="CCS Logo" className="h-9 w-9 object-contain" />
                <span className="inline-block text-xs font-bold tracking-wider uppercase text-brand-sand/70">
                CCS Sit-In Monitoring
                </span>
                </a>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-brand-sand leading-snug mb-3">
                Join the CCS Community
              </h3>
              <p className="text-sm text-brand-sand/80 leading-relaxed max-w-xs">
                Create an account to manage and monitor lab sit-ins, access forums, and stay updated with events.
              </p>
              <a
                href="/"
                className="mt-6 inline-block text-sm font-medium text-brand-sand border border-brand-sand/30 px-4 py-2 rounded-md hover:bg-brand-sand/10 transition duration-150"
              >
                Learn more →
              </a>
            </div>
            <p className="text-xs text-primary-light/80">
              Tip: Use your institutional email for faster verification.
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-primary-light hover:text-primary font-medium mb-8 transition-colors duration-150"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Create your account</h2>
            <p className="mt-1 text-sm text-primary-light">Fill in the details below to get started.</p>
          </div>

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
                 <CourseSearchableDropdown
                   value={formData.course}
                   onChange={(val) => setFormData({ ...formData, course: val })}
                   placeholder="Select a Course"
                   className={`${inputStyles} flex items-center justify-between cursor-pointer`}
                 />
               </div>
               <div>
                 <label className={labelStyles}>Year Level</label>
                 <div className="relative">
                   <select 
                     name="course_level" 
                     value={formData.course_level} 
                     onChange={handleChange} 
                     className={`${inputStyles} cursor-pointer appearance-none`}
                   >
                     <option value="" disabled>Select Year</option>
                     {ACADEMIC_YEARS.map(year => (
                       <option key={year} value={year}>{year} Year</option>
                     ))}
                   </select>
                   <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary-light">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                 </div>
               </div>
             </div>
             <div>
               <label className={labelStyles}>Email</label>
               <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.edu" className={inputStyles} />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className={labelStyles}>Password</label>
                 <div className="relative">
                   <input 
                     type={showPassword ? 'text' : 'password'} 
                     name="password" 
                     value={formData.password} 
                     onChange={handleChange} 
                     placeholder="••••••••" 
                     className={`${inputStyles} pr-10`} 
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light hover:text-primary transition-colors duration-150"
                   >
                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
               </div>
               <div>
                 <label className={labelStyles}>Confirm Password</label>
                 <div className="relative">
                   <input 
                     type={showConfirmPassword ? 'text' : 'password'} 
                     name="confirm_password" 
                     value={formData.confirm_password} 
                     onChange={handleChange} 
                     placeholder="••••••••" 
                     className={`${inputStyles} pr-10`} 
                   />
                   <button
                     type="button"
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light hover:text-primary transition-colors duration-150"
                   >
                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
               </div>
             </div>

             <div>
               <label className={labelStyles}>Address</label>
               <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Cebu City" className={inputStyles} />
             </div>

            <hr className="border-border" />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-brand-sand font-semibold py-3 rounded-md transition-all duration-150 shadow-sm text-sm tracking-wider ${
                isLoading ? 'bg-primary-light cursor-not-allowed' : 'bg-primary-hover hover:bg-primary'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>
          <p className="mt-5 text-xs text-primary-light">
            Already have an account?{' '}
            <a href="/auth/login" className="text-primary-hover font-semibold hover:underline">
              Login
            </a>
          </p>
          <p className="mt-2 text-xs text-primary-light/70">
            By registering you agree to our{' '}
            <a href="/terms" className="underline">Terms</a> and{' '}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
