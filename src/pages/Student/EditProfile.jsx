import React, { useState, useEffect, useRef } from 'react';
import { User, Save, Loader2, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import studentService from '../../services/student.service';

const inputStyles =
  'w-full px-4 py-2.5 rounded-lg border border-[#6A9AB0]/20 bg-white text-sm text-[#001F3F] placeholder:text-[#6A9AB0]/40 focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] transition';

const labelStyles =
  'block text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60 mb-1.5';

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
      
      // Update global context
      login({ ...user, profile_pic: res.profile_pic });
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      toast.error(err.customMessage || 'Failed to upload profile picture.');
    } finally {
      setIsUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error('First name, last name, and email are required.');
      return;
    }

    setIsLoading(true);

    try {
      await studentService.updateProfile(formData);

      // Update context so the rest of the app reflects the changes
      login({ ...user, ...formData });

      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.customMessage || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 text-[#3A6D8C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Avatar */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3A6D8C] to-[#EAD8B1] p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-[#EAD8B1]/20 flex items-center justify-center border-2 border-white overflow-hidden relative group">
              {user?.profile_pic ? (
                <img 
                  src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profile_pic}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-[#3A6D8C]" />
              )}
              
              {/* Hover Overlay */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-[#001F3F]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              >
                {isUploadingPic ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <>
                    <Camera className="h-5 w-5 text-white mb-1" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Change</span>
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
        <div className="pt-2">
          <h1 className="text-2xl font-extrabold text-[#001F3F]">Edit Profile</h1>
          <p className="text-sm text-[#6A9AB0] max-w-sm mt-1">Upload a professional photo and keep your information up to date.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm p-6 space-y-5">
        {/* ID (read-only) */}
        <div>
          <label className={labelStyles}>Student ID</label>
          <input
            type="text"
            value={user?.student_id || ''}
            disabled
            className={`${inputStyles} !bg-[#EAD8B1]/10 !text-[#6A9AB0] cursor-not-allowed`}
          />
        </div>

        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
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
          <div>
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
          <div>
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

        {/* Course + Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="BSIT"
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Year Level</label>
            <input
              type="number"
              name="course_level"
              value={formData.course_level}
              onChange={handleChange}
              placeholder="4"
              min="1"
              max="5"
              className={inputStyles}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelStyles}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.edu"
            className={inputStyles}
          />
        </div>

        {/* Address */}
        <div>
          <label className={labelStyles}>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Cebu City"
            className={inputStyles}
          />
        </div>

        <hr className="border-[#6A9AB0]/15" />

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
              isLoading
                ? 'bg-[#6A9AB0] text-white cursor-not-allowed'
                : 'bg-[#3A6D8C] text-[#EAD8B1] hover:bg-[#001F3F] hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
