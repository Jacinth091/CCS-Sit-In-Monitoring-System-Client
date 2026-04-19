import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Users, User, Clock, ChevronRight, X, 
  PlusCircle, AlertCircle, Loader2, Edit, Trash2, 
  RotateCcw, ChevronLeft, Filter, GraduationCap,
  Mail, MapPin, Hash, ShieldCheck, AlertTriangle, FlaskConical, Inbox,
  ChevronDown, RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';
import studentService from '../../services/student.service';
import sitinService from '../../services/sitin.service';
import labService from '../../services/lab.service';
import { COURSES as COURSE_LIST, SITIN_PURPOSES } from '../../constants/app.constants';

const COURSES = COURSE_LIST;

/* ── Searchable Course Dropdown Component ── */
function CourseSearchableDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCourses = COURSES.filter(course => 
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary flex items-center justify-between cursor-pointer hover:bg-white transition-all"
      >
        <span className="truncate">{value || "Select Course..."}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-border rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-2 border-b border-border bg-bg-secondary/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-light" />
              <input 
                type="text"
                autoFocus
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-bold text-primary bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    onChange(course);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors ${
                    value === course ? 'bg-primary text-white' : 'text-primary hover:bg-bg-secondary'
                  }`}
                >
                  {course}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-primary-light italic">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      toast.error('Failed to load students.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      setCurrentPage(1);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = students.filter(s => 
      s.student_id?.toLowerCase().includes(q) ||
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.course?.toLowerCase().includes(q)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); 
  }, [searchQuery, students]);

  const handleResetSessions = async () => {
    setIsResetting(true);
    try {
      await studentService.resetSessions();
      toast.success("All student sessions have been reset to 30.");
      setIsResetModalOpen(false);
      fetchStudents();
    } catch(err) {
      toast.error("Failed to reset sessions.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentService.delete(id);
      toast.success("Student record deleted.");
      fetchStudents();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const confirmDelete = async () => {
    if (!studentToDelete?.id) return;
    await handleDelete(studentToDelete.id);
    closeDeleteModal();
  };

  const openStudentDetails = (student) => {
    setSelectedStudent(student);
    setIsPanelOpen(true);
  };

  const openAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const openEditStudent = (student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative">
      
      {/* ───── HERO BANNER ───── */}
      <div className="relative overflow-hidden rounded-xl bg-primary border border-border shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary-hover opacity-95" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-light/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-sand/5 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-xl bg-primary flex items-center justify-center border-2 border-primary relative overflow-hidden">
                  <Users className="h-8 w-8 text-brand-sand relative z-10" />
                  <div className="absolute inset-0 bg-primary-hover/20" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-brand-sand uppercase tracking-[0.2em]">Admin Access</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none">
                  Student List
                </h1>
                <p className="text-xs font-bold text-primary-light/80 max-w-md leading-relaxed">
                   Manage student profiles and session balances.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
               <button 
                onClick={openAddStudent}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-sand text-primary text-[10px] font-black uppercase hover:bg-white transition-all shadow-lg active:scale-95 cursor-pointer"
               >
                 <PlusCircle className="h-4 w-4" />
                 Add Student
               </button>
               <button 
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-brand-sand border border-white/20 text-[10px] font-black uppercase hover:bg-white/20 transition-all shadow-lg active:scale-95 cursor-pointer"
               >
                 <RotateCcw className="h-4 w-4" />
                 Reset Sessions
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-light/40 group-focus-within:text-primary-hover transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 rounded-xl border border-border bg-white text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
         </div>
         <div className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-[10px] font-black text-primary-light uppercase tracking-widest">
            {filteredStudents.length} Students
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Student ID</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Name</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">Course</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">Sessions Left</th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/20 mx-auto" />
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-32 text-center text-sm text-primary-light font-bold uppercase tracking-widest opacity-40">
                    No matching students.
                  </td>
                </tr>
              ) : (
                currentStudents.map(student => (
                  <tr key={student.id} className="hover:bg-bg-secondary/50 transition-colors group text-sm">
                    <td className="py-3 px-6 font-bold text-primary-hover">{student.student_id}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden border border-primary/10">
                          {student.profile_pic ? (
                            <img 
                              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${student.profile_pic}`} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="font-bold text-primary">{student.first_name} {student.last_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-primary-light max-w-[250px] truncate">{student.course}</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg text-xs font-black ${
                        student.session > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {student.session}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEditStudent(student)} className="p-2 rounded-lg text-primary-light hover:bg-bg-secondary hover:text-primary transition-all"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => openDeleteModal(student)} className="p-2 rounded-lg text-primary-light hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                        <button onClick={() => openStudentDetails(student)} className="p-2 rounded-lg bg-primary/5 text-primary-hover hover:bg-primary hover:text-white transition-all ml-1"><ChevronRight className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredStudents.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-bg-secondary/30 flex items-center justify-between">
            <span className="text-[10px] text-primary-light font-black uppercase tracking-widest">
              {indexOfFirstItem + 1}—{Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary bg-white border border-border disabled:opacity-30">Prev</button>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary bg-white border border-border disabled:opacity-30">Next</button>
            </div>
          </div>
        )}
      </div>

      <StudentDetailsPanel student={selectedStudent} isOpen={isPanelOpen} onClose={() => { setIsPanelOpen(false); setSelectedStudent(null); }} onSitInComplete={fetchStudents} />
      <StudentFormModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} student={editingStudent} onSuccess={() => { setIsStudentModalOpen(false); fetchStudents(); }} />
      
      {/* Modals */}
      <ResetConfirmationModal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        onConfirm={handleResetSessions}
        isSubmitting={isResetting}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        student={studentToDelete} 
        onClose={closeDeleteModal} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}

function ResetConfirmationModal({ isOpen, onClose, onConfirm, isSubmitting }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-border">
        <div className="p-6 bg-primary/5 border-b border-border flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-brand-sand/20 rounded-xl flex items-center justify-center mb-3">
             <RefreshCcw className="w-7 h-7 text-primary-hover" />
          </div>
          <h3 className="text-base font-black text-primary uppercase tracking-widest">Reset All Sessions?</h3>
          <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mt-1">This action will affect all active students</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-primary-light font-bold leading-relaxed">
            All students' session balances will be returned to <span className="text-primary font-black">30 sessions</span>. This process cannot be undone.
          </p>
        </div>
        <div className="p-4 bg-bg-secondary border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-border text-[10px] font-black uppercase text-primary hover:bg-white transition-all">Cancel</button>
          <button 
            onClick={onConfirm} 
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, student, onClose, onConfirm }) {
  if (!isOpen || !student) return null;
  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-border">
        <div className="p-6 bg-primary/5 border-b border-border flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-3">
             <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-base font-black text-primary uppercase tracking-widest">Delete Student?</h3>
          <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mt-1">Security authorization required</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-primary-light font-bold">Remove record for <span className="text-primary font-black block text-xl mt-1 leading-tight">{student.first_name} {student.last_name}</span></p>
        </div>
        <div className="p-4 bg-bg-secondary border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-border text-[10px] font-black uppercase text-primary hover:bg-white transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg transition-all">Delete Record</button>
        </div>
      </div>
    </div>
  );
}

function StudentFormModal({ isOpen, onClose, student, onSuccess }) {
  const isEditing = !!student;
  const [formData, setFormData] = useState({ student_id: '', first_name: '', last_name: '', middle_name: '', course: '', course_level: '1st', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (student) setFormData({ id: student.id, student_id: student.student_id || '', first_name: student.first_name || '', last_name: student.last_name || '', middle_name: student.middle_name || '', course: student.course || '', course_level: student.course_level || '1st', email: student.email || '', password: '' });
      else setFormData({ student_id: '', first_name: '', last_name: '', middle_name: '', course: '', course_level: '1st', email: '', password: '' });
    }
  }, [isOpen, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course) {
      toast.error("Course is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditing) await studentService.adminUpdate(formData);
      else {
        if(!formData.password) { toast.error("Password required"); setIsSubmitting(false); return; }
        await studentService.adminCreate(formData);
      }
      toast.success(isEditing ? "Updated" : "Added");
      onSuccess();
    } catch (err) { toast.error("Action failed"); } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  const inputStyles = "w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all";
  const labelStyles = "block text-[10px] font-black uppercase tracking-widest text-primary-light mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-visible border border-border">
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <h3 className="text-lg font-black text-primary uppercase tracking-tight">{isEditing ? 'Edit Student' : 'Add Student'}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-primary-light hover:text-primary"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div><label className={labelStyles}>ID Number</label><input required type="text" value={formData.student_id} onChange={(e)=>setFormData({...formData, student_id: e.target.value})} className={inputStyles} placeholder="2021-1234" /></div>
                   <div><label className={labelStyles}>Email</label><input required type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className={inputStyles} placeholder="student@uc.edu.ph" /></div>
                </div>
             </div>
             <div><label className={labelStyles}>First Name</label><input required type="text" value={formData.first_name} onChange={(e)=>setFormData({...formData, first_name: e.target.value})} className={inputStyles} /></div>
             <div><label className={labelStyles}>Last Name</label><input required type="text" value={formData.last_name} onChange={(e)=>setFormData({...formData, last_name: e.target.value})} className={inputStyles} /></div>
             
             <div className="md:col-span-2">
                <label className={labelStyles}>Course</label>
                <CourseSearchableDropdown 
                  value={formData.course} 
                  onChange={(val) => setFormData({...formData, course: val})} 
                />
             </div>

             <div>
                <label className={labelStyles}>Year Level</label>
                <select 
                  required 
                  value={formData.course_level} 
                  onChange={(e)=>setFormData({...formData, course_level: e.target.value})} 
                  className={`${inputStyles} appearance-none cursor-pointer`}
                >
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="5th">5th Year</option>
                </select>
             </div>

             {!isEditing && (
               <div>
                  <label className={labelStyles}>Password</label>
                  <input required type="password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className={inputStyles} placeholder="••••••••" />
               </div>
             )}
          </div>
        </form>
        <div className="px-6 py-4 bg-bg-secondary border-t border-border flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-primary-light hover:text-primary transition-all">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg active:scale-95 disabled:opacity-50">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function StudentDetailsPanel({ student, isOpen, onClose, onSitInComplete }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSitInModalOpen, setIsSitInModalOpen] = useState(false);

  useEffect(() => { if (student && isOpen) fetchHistory(); }, [student, isOpen]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await sitinService.getHistoryByStudent(student.student_id);
      setHistory(res.data || []);
    } catch (err) { toast.error('History failed'); } finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-secondary/30">
          <h2 className="text-lg font-black text-primary uppercase tracking-tight">Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-primary-light hover:text-primary border border-border"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-xl mb-4 overflow-hidden">
               {student.profile_pic ? <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${student.profile_pic}`} alt="" className="w-full h-full object-cover rounded-[0.9rem]" /> : <div className="w-full h-full bg-white flex items-center justify-center"><User className="h-10 w-10 text-primary" /></div>}
            </div>
            <h3 className="text-2xl font-black text-primary tracking-tighter">{student.first_name} {student.last_name}</h3>
            <p className="text-xs font-black text-primary-light uppercase tracking-widest mt-1">ID: {student.student_id}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 w-full">
               <div className="p-4 bg-bg-secondary rounded-xl border border-border text-center">
                  <p className="text-[9px] font-black text-primary-light uppercase tracking-widest mb-1">Sessions</p>
                  <p className="text-2xl font-black text-primary">{student.session}</p>
               </div>
               <div className="p-4 bg-bg-secondary rounded-xl border border-border text-center">
                  <p className="text-[9px] font-black text-primary-light uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-1">Verified</p>
               </div>
            </div>
          </div>
          <button onClick={() => setIsSitInModalOpen(true)} disabled={student.session <= 0} className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30">Assign Sit-in</button>
          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em] border-b border-border pb-2">Recent Logs</h4>
             {isLoading ? <div className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary/20" /></div> : history.length === 0 ? <div className="py-10 text-center bg-bg-secondary/30 rounded-xl border border-dashed border-border"><p className="text-[10px] font-black text-primary-light uppercase tracking-widest">No logs found.</p></div> : <div className="space-y-3">{history.map(log => (<div key={log.id} className="p-4 bg-white rounded-xl border border-border shadow-sm flex justify-between items-center"><div className="space-y-1"><p className="text-xs font-black text-primary uppercase">{log.lab_name}</p><p className="text-[10px] text-primary-light font-bold uppercase">{log.purpose}</p></div><div className="text-right"><p className="text-[10px] font-black text-primary">{new Date(log.time_in).toLocaleDateString()}</p><p className="text-[9px] text-primary-light font-bold uppercase">{log.status}</p></div></div>))}</div>}
          </div>
        </div>
      </div>
      <SitInModal isOpen={isSitInModalOpen} onClose={() => setIsSitInModalOpen(false)} student={student} onSuccess={() => { setIsSitInModalOpen(false); fetchHistory(); onSitInComplete(); }} />
    </>
  );
}

function SitInModal({ isOpen, onClose, student, onSuccess }) {
  const [labs, setLabs] = useState([]);
  const [formData, setFormData] = useState({ lab_id: '', purpose: SITIN_PURPOSES[0], customPurpose: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (isOpen && labs.length === 0) labService.getAll().then(setLabs).catch(() => {}); }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lab_id) { toast.error('Select lab'); return; }
    
    const finalPurpose = formData.purpose === 'Other' ? formData.customPurpose : formData.purpose;
    if (formData.purpose === 'Other' && !formData.customPurpose.trim()) {
      toast.error('Please specify the purpose');
      return;
    }

    setIsSubmitting(true);
    try {
      await sitinService.create({ 
        student_id: student.student_id, 
        lab_id: formData.lab_id, 
        purpose: finalPurpose 
      });
      toast.success('Assigned');
      onSuccess();
    } catch (err) { toast.error('Failed'); } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border">
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <h3 className="text-lg font-black text-primary uppercase tracking-tight">Assign Lab</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-primary-light hover:text-primary"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-primary-light mb-1.5 ml-1">Laboratory</label>
            <select value={formData.lab_id} onChange={(e) => setFormData({...formData, lab_id: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary appearance-none cursor-pointer">
              <option value="" disabled>Select...</option>
              {labs.map(lab => (<option key={lab.id} value={lab.id}>{lab.lab_name}</option>))}
            </select>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary-light mb-1.5 ml-1">Purpose</label>
              <select value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary appearance-none cursor-pointer">
                {SITIN_PURPOSES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            {formData.purpose === 'Other' && (
              <div className="animate-fade-in-up">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary-light mb-1.5 ml-1">Specify Purpose</label>
                <input 
                  type="text" 
                  value={formData.customPurpose} 
                  onChange={(e) => setFormData({...formData, customPurpose: e.target.value})} 
                  placeholder="Enter custom purpose..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                  autoFocus
                />
              </div>
            )}
          </div>
          <div className="pt-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[10px] font-black uppercase text-primary-light transition-all">Cancel</button><button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg disabled:opacity-50">Assign</button></div>
        </form>
      </div>
    </div>
  );
}
