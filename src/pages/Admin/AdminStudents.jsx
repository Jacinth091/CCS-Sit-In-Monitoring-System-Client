import React, { useState, useEffect } from 'react';
import { Search, Users, User, Clock, ChevronRight, X, PlusCircle, AlertCircle, Loader2, Edit, Trash2, RotateCcw, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import studentService from '../../services/student.service';
import sitinService from '../../services/sitin.service';
import labService from '../../services/lab.service';
import { AlertTriangle } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      toast.error('Failed to fetch students list.');
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
    setCurrentPage(1); // Reset page on search
  }, [searchQuery, students]);

  const handleResetSessions = async () => {
    if(!window.confirm("Are you sure you want to reset ALL active students' sessions back to 30? This action cannot be undone.")) return;
    
    setIsResetting(true);
    try {
      await studentService.resetSessions();
      toast.success("All sessions reset to 30!");
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
      toast.success("Student deleted successfully.");
      fetchStudents();
    } catch (err) {
      toast.error("Failed to delete student.");
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#001F3F]">Student Management</h1>
          <p className="text-sm text-[#6A9AB0]">Search students, manage profiles, and reset sessions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6A9AB0]" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#6A9AB0]/20 bg-white text-sm text-[#001F3F] placeholder:text-[#6A9AB0]/40 focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] transition"
            />
          </div>
          
          <button 
            onClick={openAddStudent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3A6D8C] text-[#EAD8B1] text-sm font-bold hover:bg-[#001F3F] transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Student
          </button>

          <button 
            onClick={handleResetSessions}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-bold hover:bg-red-600 hover:text-white transition-colors shadow-sm disabled:opacity-50"
          >
            {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Reset Sessions
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EAD8B1]/10 border-b border-[#6A9AB0]/15">
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Student ID</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Name</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Course</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60 text-center">Sessions Left</th>
                <th className="py-4 px-6 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6A9AB0]/10">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#3A6D8C] mx-auto" />
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-sm text-[#6A9AB0]/60 italic">
                    No students found.
                  </td>
                </tr>
              ) : (
                currentStudents.map(student => (
                  <tr key={student.id} className="hover:bg-[#EAD8B1]/5 transition-colors group">
                    <td className="py-3 px-6 text-sm font-semibold text-[#3A6D8C] whitespace-nowrap">
                      {student.student_id}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {student.profile_pic ? (
                            <img 
                              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${student.profile_pic}`} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-[#3A6D8C]" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-[#001F3F]">
                          {`${student.first_name} ${student.last_name}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-[#6A9AB0] whitespace-nowrap">
                      {student.course || '—'} {student.course_level ? `(${student.course_level})` : ''}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        student.session > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {student.session}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => openEditStudent(student)}
                          className="p-2 rounded-lg text-[#6A9AB0] hover:bg-[#EAD8B1]/40 hover:text-[#3A6D8C] transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(student)}
                          className="p-2 rounded-lg text-[#6A9AB0] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openStudentDetails(student)}
                          className="p-2 rounded-lg text-[#6A9AB0] hover:bg-[#3A6D8C] hover:text-white transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && filteredStudents.length > 0 && (
          <div className="px-6 py-4 border-t border-[#6A9AB0]/15 bg-[#EAD8B1]/5 flex items-center justify-between">
            <span className="text-xs text-[#6A9AB0] font-medium">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 px-3 rounded text-sm font-bold text-[#001F3F] bg-white border border-[#6A9AB0]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#EAD8B1]/30 transition-colors"
              >
                 Prev
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 px-3 rounded text-sm font-bold text-[#001F3F] bg-white border border-[#6A9AB0]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#EAD8B1]/30 transition-colors"
              >
                Next 
              </button>
            </div>
          </div>
        )}
      </div>

      <StudentDetailsPanel 
        student={selectedStudent} 
        isOpen={isPanelOpen} 
        onClose={() => { setIsPanelOpen(false); setSelectedStudent(null); }}
        onSitInComplete={fetchStudents}
      />

      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        student={editingStudent}
        onSuccess={() => {
          setIsStudentModalOpen(false);
          fetchStudents();
        }}
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

function DeleteConfirmationModal({ isOpen, student, onClose, onConfirm }) {
  if (!isOpen || !student) return null;
  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#6A9AB0]/20 flex flex-col">
        <div className="px-8 py-6 bg-[#F87171]/10 border-b border-[#F87171]/20 flex items-center gap-4">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <AlertTriangle className="w-6 h-6 text-[#EF4444]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-[#001F3F]">
              Confirm Deletion
            </h3>
            <p className="text-xs text-[#6A9AB0] mt-1 font-medium">
              This action will deactivate the record.
            </p>
          </div>
        </div>
        <div className="px-8 py-8 text-center">
          <p className="text-base text-[#001F3F]/90 leading-relaxed">
            Are you sure you want to delete <br />
            <span className="text-xl font-extrabold text-[#001F3F] block mt-2">
              {student.first_name} {student.last_name}?
            </span>
          </p>
        </div>
        <div className="px-8 py-5 bg-[#EAD8B1]/15 border-t border-[#6A9AB0]/15 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-[#6A9AB0]/30 text-sm font-bold text-[#3A6D8C] hover:bg-[#6A9AB0]/10 hover:border-[#6A9AB0]/50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#EF4444] hover:bg-[#FF5A5F] shadow-md shadow-[#EF4444]/20 transition-all duration-200"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}
// ----------------------------------------------------------------------
function StudentFormModal({ isOpen, onClose, student, onSuccess }) {
  const isEditing = !!student;
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    course: 'BSIT',
    course_level: '1',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setFormData({
          id: student.id,
          student_id: student.student_id || '',
          first_name: student.first_name || '',
          last_name: student.last_name || '',
          middle_name: student.middle_name || '',
          course: student.course || 'BSIT',
          course_level: student.course_level || '1',
          email: student.email || '',
          password: '' // Don't prefill password
        });
      } else {
        setFormData({
          student_id: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          course: 'BSIT',
          course_level: '1',
          email: '',
          password: ''
        });
      }
    }
  }, [isOpen, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        await studentService.adminUpdate(formData);
        toast.success("Student updated successfully.");
      } else {
        // Validation check for password if creating
        if(!formData.password) {
           toast.error("Password is required for new students.");
           setIsSubmitting(false);
           return;
        }
        await studentService.adminCreate(formData);
        toast.success("Student created successfully.");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.customMessage || `Failed to ${isEditing ? 'update' : 'create'} student.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputStyles = "w-full px-3 py-2 rounded-lg border border-[#6A9AB0]/30 bg-white text-sm text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/50";
  const labelStyles = "block text-xs font-bold text-[#001F3F]/70 mb-1";

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#EAD8B1]/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden bg-white">
        <div className="px-6 py-4 border-b border-[#6A9AB0]/15 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#001F3F]">{isEditing ? 'Edit Student Profile' : 'Register New Student'}</h3>
          <button onClick={onClose} className="text-[#6A9AB0] hover:text-[#001F3F]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>ID Number *</label>
              <input required type="text" value={formData.student_id} onChange={(e)=>setFormData({...formData, student_id: e.target.value})} className={inputStyles} placeholder="e.g. 2021-1234"/>
            </div>
            <div>
              <label className={labelStyles}>Email Address *</label>
              <input required type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className={inputStyles} placeholder="student@uc.edu.ph"/>
            </div>
            
            <div>
              <label className={labelStyles}>First Name *</label>
              <input required type="text" value={formData.first_name} onChange={(e)=>setFormData({...formData, first_name: e.target.value})} className={inputStyles} />
            </div>
             <div>
              <label className={labelStyles}>Last Name *</label>
              <input required type="text" value={formData.last_name} onChange={(e)=>setFormData({...formData, last_name: e.target.value})} className={inputStyles} />
            </div>
            
            <div>
              <label className={labelStyles}>Middle Name</label>
              <input type="text" value={formData.middle_name} onChange={(e)=>setFormData({...formData, middle_name: e.target.value})} className={inputStyles} />
            </div>
            
             <div>
              <label className={labelStyles}>Course *</label>
              <select required value={formData.course} onChange={(e)=>setFormData({...formData, course: e.target.value})} className={inputStyles}>
                <option value="BSIT">BSIT</option>
                <option value="BSCS">BSCS</option>
                <option value="BSIS">BSIS</option>
                <option value="BSCpE">BSCpE</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className={labelStyles}>Year Level *</label>
              <select required value={formData.course_level} onChange={(e)=>setFormData({...formData, course_level: e.target.value})} className={inputStyles}>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {!isEditing && (
              <div>
                <label className={labelStyles}>Initial Password *</label>
                <input required type="password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className={inputStyles} placeholder="Set a secure password"/>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#6A9AB0]/15 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-bold text-[#6A9AB0] hover:bg-[#EAD8B1]/20">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#3A6D8C] text-white text-sm font-bold hover:bg-[#001F3F] disabled:opacity-50">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
function StudentDetailsPanel({ student, isOpen, onClose, onSitInComplete }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSitInModalOpen, setIsSitInModalOpen] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      fetchHistory();
    }
  }, [student, isOpen]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await sitinService.getHistoryByStudent(student.student_id);
      setHistory(res.data || []);
    } catch (err) {
      toast.error('Failed to load sit-in history.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#001F3F]/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#6A9AB0]/15 bg-[#001F3F]">
          <h2 className="text-lg font-bold text-white">Student Overview</h2>
          <button onClick={onClose} className="p-1 rounded-md text-[#EAD8B1]/70 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3A6D8C] to-[#EAD8B1] p-1 shadow-md mb-4">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {student.profile_pic ? (
                  <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${student.profile_pic}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-[#3A6D8C]" />
                )}
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-[#001F3F]">{student.first_name} {student.last_name}</h3>
            <p className="text-sm font-medium text-[#3A6D8C] mb-1">{student.student_id}</p>
            <p className="text-xs text-[#6A9AB0]">{student.course || 'Unknown Course'}</p>
            
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EAD8B1]/20 border border-[#EAD8B1]/40">
              <span className="text-xs font-bold uppercase tracking-wider text-[#001F3F]/60">Sessions Left:</span>
              <span className={`text-lg font-extrabold leading-none ${student.session > 0 ? 'text-[#3A6D8C]' : 'text-red-500'}`}>
                {student.session}
              </span>
            </div>
          </div>

          <hr className="border-[#6A9AB0]/15" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold tracking-wide uppercase text-[#001F3F]/80">Quick Actions</h4>
            </div>
            <button 
              onClick={() => setIsSitInModalOpen(true)}
              disabled={student.session <= 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3A6D8C] text-[#EAD8B1] rounded-xl font-bold hover:bg-[#001F3F] hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="h-5 w-5" />
              Start New Sit-In Session
            </button>
            {student.session <= 0 && (
              <p className="mt-2 text-xs text-center text-red-500 font-medium">This student has exhausted their sessions.</p>
            )}
          </div>

          <hr className="border-[#6A9AB0]/15" />

          <div>
            <h4 className="text-sm font-bold tracking-wide uppercase text-[#001F3F]/80 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recent Sit-Ins
            </h4>
            
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-[#3A6D8C]" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-6 bg-[#EAD8B1]/10 rounded-xl border border-[#EAD8B1]/30 text-sm text-[#001F3F]/60">
                No sit-in history recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(log => (
                  <div key={log.id} className="p-3 bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm hover:border-[#3A6D8C]/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-[#001F3F]">{log.lab_name || `Lab ${log.lab_id}`}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        log.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAD8B1]/30 text-[#001F3F]/60'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#001F3F]/80 mb-2 truncate">Purpose: {log.purpose}</p>
                    <p className="text-[10px] text-[#6A9AB0] font-medium">{new Date(log.time_in).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SitInModal 
        isOpen={isSitInModalOpen}
        onClose={() => setIsSitInModalOpen(false)}
        student={student}
        onSuccess={() => {
          setIsSitInModalOpen(false);
          fetchHistory(); 
          onSitInComplete(); 
        }}
      />
    </>
  );
}

// ----------------------------------------------------------------------
function SitInModal({ isOpen, onClose, student, onSuccess }) {
  const [labs, setLabs] = useState([]);
  const [formData, setFormData] = useState({ lab_id: '', purpose: 'C Programming' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && labs.length === 0) {
      labService.getAll().then(setLabs).catch(() => toast.error('Failed to load labs.'));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lab_id) {
      toast.error('Please select a laboratory.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await sitinService.create({
        student_id: student.student_id,
        lab_id: formData.lab_id,
        purpose: formData.purpose
      });
      toast.success('Sit-in session started successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.customMessage || 'Failed to start sit-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputStyles = "w-full px-4 py-2.5 rounded-lg border border-[#6A9AB0]/20 bg-[#EAD8B1]/5 text-sm text-[#001F3F] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 focus:border-[#3A6D8C] transition appearance-none cursor-pointer";
  const labelStyles = "block text-[10px] font-bold tracking-widest uppercase text-[#001F3F]/60 mb-1.5";

  return (
    <div className="fixed inset-0 bg-[#001F3F]/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="px-6 py-5 border-b border-[#6A9AB0]/15 bg-[#EAD8B1]/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#001F3F]">Register Sit-In</h3>
            <p className="text-xs font-medium text-[#6A9AB0] mt-0.5">Assigning session for {student.first_name}</p>
          </div>
          <button onClick={onClose} className="text-[#6A9AB0] hover:text-[#001F3F] transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelStyles}>Select Laboratory</label>
            <select 
              value={formData.lab_id}
              onChange={(e) => setFormData({...formData, lab_id: e.target.value})}
              className={inputStyles}
            >
              <option value="" disabled>Choose a lab...</option>
              {labs.map(lab => (
                <option key={lab.id} value={lab.id}>{lab.lab_name} (Capacity: {lab.capacity})</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyles}>Purpose</label>
            <select 
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className={inputStyles}
            >
              <option value="C Programming">C Programming</option>
              <option value="Java Programming">Java Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="Database Design">Database Design</option>
              <option value="Networking">Networking</option>
              <option value="Thesis/Capstone">Thesis/Capstone</option>
              <option value="Other">Other...</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#6A9AB0]/30 text-[#001F3F] text-sm font-bold hover:bg-[#EAD8B1]/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#3A6D8C] text-[#EAD8B1] text-sm font-bold hover:bg-[#001F3F] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
