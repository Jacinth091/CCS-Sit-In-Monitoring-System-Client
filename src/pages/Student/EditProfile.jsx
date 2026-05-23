import React, { useState, useEffect, useRef } from 'react';
import { ASSET_URL } from '../../config';
import { User, Save, Loader2, Camera, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import studentService from '../../services/student.service';
import { Link } from 'react-router';
import { ACADEMIC_YEARS } from '../../constants/app.constants';
import { CourseSearchableDropdown } from '../../components/ui';
import { 
  validateName, 
  validateEmail, 
  validateAddress 
} from '../../utils/validationUtils';

const inputStyles =
  'w-full px-4 py-2.5 rounded-xl border border-border bg-white text-xs text-primary placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary-hover/20 focus:border-primary-hover transition-all shadow-sm';

const labelStyles =
  'block text-[9px] font-bold text-primary-light mb-1.5 ml-1';

export default function EditProfile() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    course: '',
    course_level: '',
    email: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const fileInputRef = useRef(null);

  // Load current profile from backend
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await studentService.getProfile();
        setFormData({
          first_name: data.first_name || '',
          middle_name: data.middle_name || '',
          last_name: data.last_name || '',
          course: data.course || '',
          course_level: data.course_level || '',
          email: data.email || '',
          address: data.address || '',
        });
      } catch {
        // Fall back to context data
        setFormData({
          first_name: user?.first_name || '',
          middle_name: user?.middle_name || '',
          last_name: user?.last_name || '',
          course: user?.course || '',
          course_level: user?.course_level || '',
          email: user?.email || '',
          address: user?.address || '',
        });
      } finally {
        setIsFetching(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPic(true);

    try {
      const fd = new FormData();
      fd.append('profile_pic', file);

      const res = await studentService.uploadProfilePicture(fd);
      
      // Update global context - access the nested data object
      const newPic = res.data?.profile_pic;
      if (newPic) {
        login({ ...user, profile_pic: newPic });
        toast.success('Profile picture updated successfully!');
      } else {
        throw new Error('No profile picture path returned from server.');
      }
    } catch (err) {
      toast.error(err.customMessage || 'Failed to upload profile picture.');
    } finally {
      setIsUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field Validation
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

    if (!formData.course || !formData.course_level) {
      toast.error('Course and Year Level are required.');
      return;
    }

    setIsLoading(true);

    try {
      await studentService.updateProfile(formData);

      // Update context so the rest of the app reflects the changes
      login({ ...user, ...formData });

      toast.success('Profile updated successfully!');
    } catch (err) {
      // Improved error message extraction based on Backend Validation Guide
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (err.response) {
        const data = err.response.data;
        const status = err.response.status;
        
        if (status === 409) {
          errorMessage = data.message || data.error || "Conflict: This Student ID or Email already exists in the system.";
        } else if (status === 422) {
          if (data.errors && typeof data.errors === 'object') {
            errorMessage = Object.values(data.errors)[0];
          } else {
            errorMessage = data.message || "Validation failed. Please check your inputs.";
          }
        } else {
          errorMessage = data.message || data.error || err.customMessage || `Error ${status}: Update failed.`;
        }
      } else if (err.customMessage) {
        errorMessage = err.customMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-12 h-12 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
        <p className="text-[9px] font-bold text-primary-light">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-20">
      
      {/* ───── HERO SECTION ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary hero-banner border border-border shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-sand/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

        <div className="relative z-10 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <Link 
                to="/student/dashboard" 
                className="inline-flex items-center gap-2 text-[9px] font-bold text-brand-sand/70 hover:text-brand-sand transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                 Account Settings
              </h1>
              <p className="text-primary-light/80 text-xs sm:text-sm font-medium max-w-md leading-relaxed">
                Update your personal information, contact details, and laboratory preferences.
              </p>
            </div>

            <div className="relative group shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-[0.9rem] bg-primary flex items-center justify-center border border-primary overflow-hidden relative group/avatar">
                  {user?.profile_pic ? (
                    <img 
                      src={`${ASSET_URL}/${user.profile_pic}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <User className="h-7 w-7 text-brand-sand relative z-10" />
                  )}
                  
                  {/* Hover Overlay */}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer z-20 backdrop-blur-sm"
                  >
                    {isUploadingPic ? (
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <>
                          <Camera className="h-4 w-4 text-brand-sand mb-1.5" />
                        <span className="text-[9px] font-bold text-white">Update</span>
                      </>
                    )}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handlePicUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Security Info Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-bg-primary rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3.5 mb-5">
               <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary-hover" />
               </div>
               <h4 className="text-[11px] font-bold text-primary">Identity Access</h4>
            </div>
            
            <div className="space-y-3.5">
              <div>
                <label className={labelStyles}>Student ID</label>
                <div className="px-4 py-2.5 rounded-xl bg-bg-secondary border border-border text-xs font-bold text-primary-light">
                  {user?.student_id || '—'}
                </div>
              </div>
              <p className="text-[10px] text-primary-light/70 font-medium leading-relaxed italic">
                Your Student ID is verified and managed by the University Registrar.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-hover to-primary rounded-xl p-5 shadow-lg shadow-primary-hover/20 text-white">
             <div className="flex items-center gap-2.5 mb-3.5">
                <CheckCircle className="h-4 w-4 text-brand-sand" />
                <h4 className="text-[11px] font-bold">Verified Account</h4>
             </div>
             <p className="text-[11px] text-primary-light/90 leading-relaxed">
               You are currently logged in as a verified student of the University of Cebu.
             </p>
          </div>
        </div>

        {/* Right: Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-1">
               <h3 className="text-base font-bold text-primary tracking-tight">Personal Details</h3>
               <span className="text-[9px] font-bold text-primary-light bg-bg-secondary px-2.5 py-0.5 rounded-full border border-border">Settings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1">
                <label className={labelStyles}>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Juan"
                  className={inputStyles}
                />
              </div>
              <div className="md:col-span-1">
                <label className={labelStyles}>Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="(Optional)"
                  className={inputStyles}
                />
              </div>
              <div className="md:col-span-1">
                <label className={labelStyles}>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Dela Cruz"
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Course / Program</label>
                <CourseSearchableDropdown
                  value={formData.course}
                  onChange={(val) => setFormData({ ...formData, course: val })}
                  placeholder="Select a Course"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-xs text-primary placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary-hover/20 focus:border-primary-hover transition-all shadow-sm flex items-center justify-between cursor-pointer"
                />
              </div>
              <div>
                <label className={labelStyles}>Academic Year Level</label>
                <div className="relative">
                  <select
                    name="course_level"
                    value={formData.course_level}
                    onChange={handleChange}
                    className={`${inputStyles} cursor-pointer appearance-none`}
                  >
                    <option value="" disabled>Select Year</option>
                    {ACADEMIC_YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary-light">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyles}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.edu"
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Current Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Cebu City"
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-primary-light/60">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold">Fields marked with (*) are required</span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-bold transition-all duration-300 shadow-md cursor-pointer min-w-[180px] w-full sm:w-auto ${
                  isLoading
                    ? 'bg-primary-light text-white cursor-not-allowed opacity-70'
                    : 'bg-primary-hover text-white hover:bg-primary shadow-primary-hover/20 hover:shadow-primary-hover/40 active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
