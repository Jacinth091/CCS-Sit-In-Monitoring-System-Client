import {
  AlertCircle,
  Calendar,
  Camera,
  ChevronDown,
  ClipboardList,
  Clock,
  Edit,
  FlaskConical,
  GraduationCap,
  History,
  Info,
  Loader2,
  MapPin,
  Monitor,
  PlusCircle,
  RefreshCcw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ReservationCard from "../../components/reservations/ReservationCard";
import { ASSET_URL } from "../../config";
import {
  SITIN_PURPOSES,
  ACADEMIC_YEARS,
} from "../../constants/app.constants";
import labService from "../../services/lab.service";
import notificationService from "../../services/notification.service";
import pcService from "../../services/pc.service";
import sitinService from "../../services/sitin.service";
import studentService from "../../services/student.service";
import { formatDate, formatTime } from "../../utils/dateUtils";
import Pagination from "../../components/ui/Pagination";
import { CourseSearchableDropdown } from "../../components/ui";
import { 
  validateIdNumber, 
  validateName, 
  validateEmail, 
  validateAddress 
} from "../../utils/validationUtils";

function StudentActionsMenu({
  student,
  openSingleResetModal,
  openEditStudent,
  openDeleteModal,
  openStudentDetails,
  openAssignSitIn,
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
          isOpen
            ? "bg-primary text-white border-primary shadow-md"
            : "bg-white text-primary-light border-border hover:border-primary/30 hover:text-primary hover:bg-bg-secondary"
        }`}
      >
        <span className="text-[10px] font-black uppercase tracking-widest ml-0.5">
          Actions
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-fade-in-up origin-top-right ring-4 ring-primary/5">
          <div className="p-1.5 space-y-1">
            {/* Prominent Assign Sit-in */}
            <button
              onClick={() => {
                setIsOpen(false);
                openAssignSitIn(student);
              }}
              disabled={student.session <= 0}
              className="w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary-hover rounded-lg flex items-center justify-between transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5" />
                <span>Assign Sit-in</span>
              </div>
              <PlusCircle className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="h-px bg-border/60 mx-2 !my-1.5"></div>

            {/* Standard Actions */}
            <button
              onClick={() => {
                setIsOpen(false);
                openStudentDetails(student);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-primary hover:bg-bg-secondary transition-colors rounded-lg"
            >
              <User className="h-4 w-4 text-primary-light" />
              View Details
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                openEditStudent(student);
              }}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-primary hover:bg-bg-secondary rounded-md flex items-center gap-2 transition-all"
            >
              <Edit className="h-3.5 w-3.5 text-primary-light" />
              Edit Student
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                openSingleResetModal(student);
              }}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-primary hover:bg-bg-secondary rounded-md flex items-center gap-2 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-primary-light" />
              Reset Sessions
            </button>

            <div className="h-px bg-border/60 mx-2 !my-1.5"></div>

            <button
              onClick={() => {
                setIsOpen(false);
                openDeleteModal(student);
              }}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5 opacity-80" />
              Delete Record
            </button>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [studentToReset, setStudentToReset] = useState(null);
  const [isSingleResetModalOpen, setIsSingleResetModalOpen] = useState(false);

  const [isSitInModalOpen, setIsSitInModalOpen] = useState(false);
  const [studentForSitIn, setStudentForSitIn] = useState(null);

  const openAssignSitIn = (student) => {
    setStudentForSitIn(student);
    setIsSitInModalOpen(true);
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getAll({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchQuery.trim() || undefined,
      });
      const recordsArray = data?.records || [];
      const meta = data?.meta || {};
      
      setStudents(recordsArray);
      setFilteredStudents(recordsArray);
      setTotalPages(meta.last_page || 1);
      setTotalRecords(meta.total || 0);
    } catch (err) {
      toast.error("Failed to load students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);



  const handleResetSessions = async () => {
    setIsResetting(true);
    try {
      await studentService.resetSessions();
      toast.success("All student sessions have been reset to 30.");
      setIsResetModalOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error("Failed to reset sessions.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetSingleSession = async () => {
    if (!studentToReset?.student_id) return;
    setIsResetting(true);
    try {
      await studentService.resetSingleSession(studentToReset.student_id);
      toast.success(
        `Sessions reset to 30 for ${studentToReset.first_name} ${studentToReset.last_name}`,
      );
      setIsSingleResetModalOpen(false);
      setStudentToReset(null);
      fetchStudents();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to reset session for this student.";
      toast.error(msg);
    } finally {
      setIsResetting(false);
    }
  };

  const openSingleResetModal = (student) => {
    setStudentToReset(student);
    setIsSingleResetModalOpen(true);
  };

  const closeSingleResetModal = () => {
    setIsSingleResetModalOpen(false);
    setStudentToReset(null);
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
  const currentStudents = filteredStudents;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 relative">
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">
              Admin Access
            </p>
            <h1 className="text-base sm:text-lg font-black text-primary tracking-tight">
              Student List
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openAddStudent}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Add Student
            </button>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-primary-light text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-bg-secondary transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Sessions
            </button>
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
          {totalRecords} Students
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 border-b border-border">
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Student ID
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Name
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light">
                  Course
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-center">
                  Sessions Left
                </th>
                <th className="py-4 px-6 text-[10px] font-black tracking-[0.2em] uppercase text-primary-light text-right">
                  Actions
                </th>
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
                  <td
                    colSpan="5"
                    className="py-32 text-center text-sm text-primary-light font-bold uppercase tracking-widest opacity-40"
                  >
                    No matching students.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-bg-secondary/50 transition-colors group text-sm"
                  >
                    <td className="py-3 px-6 font-bold text-primary-hover">
                      {student.student_id}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden border border-primary/10">
                          {student.profile_pic ? (
                            <img
                              src={`${ASSET_URL}/${student.profile_pic}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="font-bold text-primary">
                          {student.first_name} {student.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-primary-light max-w-[250px] truncate">
                      {student.course}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg text-xs font-black ${
                          student.session > 0
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {student.session}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <StudentActionsMenu
                        student={student}
                        openSingleResetModal={openSingleResetModal}
                        openEditStudent={openEditStudent}
                        openDeleteModal={openDeleteModal}
                        openStudentDetails={openStudentDetails}
                        openAssignSitIn={openAssignSitIn}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border bg-bg-secondary/30 flex items-center justify-between">
            <span className="text-[10px] text-primary-light font-black uppercase tracking-widest">
              {indexOfFirstItem + 1} —{" "}
              {Math.min(indexOfLastItem, totalRecords)} of{" "}
              {totalRecords}
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <StudentDetailsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        student={selectedStudent}
        onSitInComplete={fetchStudents}
      />
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        student={editingStudent}
        students={students}
        onSuccess={() => {
          setIsStudentModalOpen(false);
          fetchStudents();
        }}
      />

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

      <SingleResetConfirmationModal
        isOpen={isSingleResetModalOpen}
        student={studentToReset}
        onClose={closeSingleResetModal}
        onConfirm={handleResetSingleSession}
        isSubmitting={isResetting}
      />

      <SitInModal
        isOpen={isSitInModalOpen}
        onClose={() => {
          setIsSitInModalOpen(false);
          setStudentForSitIn(null);
        }}
        student={studentForSitIn}
        onSuccess={() => {
          setIsSitInModalOpen(false);
          setStudentForSitIn(null);
          fetchStudents();
        }}
      />
    </div>
  );
}

function SingleResetConfirmationModal({
  isOpen,
  student,
  onClose,
  onConfirm,
  isSubmitting,
}) {
  if (!isOpen || !student) return null;
  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-border">
        <div className="p-6 bg-primary/5 border-b border-border flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-brand-sand/20 rounded-xl flex items-center justify-center mb-3">
            <RotateCcw className="w-7 h-7 text-primary-hover" />
          </div>
          <h3 className="text-base font-black text-primary uppercase tracking-widest">
            Reset Student Sessions?
          </h3>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-primary-light font-bold leading-relaxed mb-2">
            Reset sessions back to{" "}
            <span className="text-primary font-black">30</span> for:
          </p>
          <p className="text-lg text-primary font-black uppercase tracking-tight">
            {student.first_name} {student.last_name}
          </p>
        </div>
        <div className="p-4 bg-bg-secondary border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-border text-[10px] font-black uppercase text-primary hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm Reset"
            )}
          </button>
        </div>
      </div>
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
          <h3 className="text-base font-black text-primary uppercase tracking-widest">
            Reset All Sessions?
          </h3>
          <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mt-1">
            This action will affect all active students
          </p>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-primary-light font-bold leading-relaxed">
            All students' session balances will be returned to{" "}
            <span className="text-primary font-black">30 sessions</span>. This
            process cannot be undone.
          </p>
        </div>
        <div className="p-4 bg-bg-secondary border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-border text-[10px] font-black uppercase text-primary hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm Reset"
            )}
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
          <h3 className="text-base font-black text-primary uppercase tracking-widest">
            Delete Student?
          </h3>
          <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mt-1">
            Security authorization required
          </p>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-primary-light font-bold">
            Remove record for{" "}
            <span className="text-primary font-black block text-xl mt-1 leading-tight">
              {student.first_name} {student.last_name}
            </span>
          </p>
        </div>
        <div className="p-4 bg-bg-secondary border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-border text-[10px] font-black uppercase text-primary hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg transition-all"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentFormModal({ isOpen, onClose, student, students = [], onSuccess }) {
  const isEditing = !!student;
  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    course: "",
    course_level: "1st",
    email: "",
    password: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setFormData({
          id: student.id,
          student_id: student.student_id || "",
          first_name: student.first_name || "",
          last_name: student.last_name || "",
          middle_name: student.middle_name || "",
          course: student.course || "",
          course_level: student.course_level || "1st",
          email: student.email || "",
          password: "",
          address: student.address || "",
        });
        setProfilePreview(
          student.profile_pic ? `${ASSET_URL}/${student.profile_pic}` : null,
        );
      } else {
        setFormData({
          student_id: "",
          first_name: "",
          last_name: "",
          middle_name: "",
          course: "",
          course_level: "1st",
          email: "",
          password: "",
          address: "",
        });
        setProfilePreview(null);
      }
      setProfileFile(null);
    }
  }, [isOpen, student]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field Validation - Required Checks
    if (!formData.student_id?.trim()) {
      toast.error("Student ID is required.");
      return;
    }
    if (!formData.first_name?.trim()) {
      toast.error("First Name is required.");
      return;
    }
    if (!formData.last_name?.trim()) {
      toast.error("Last Name is required.");
      return;
    }
    if (!formData.email?.trim()) {
      toast.error("Email is required.");
      return;
    }

    // Format Validation
    if (!validateIdNumber(formData.student_id)) {
      toast.error("ID Number must be exactly 8 digits.");
      return;
    }

    if (!validateName(formData.first_name)) {
      toast.error("Invalid First Name format (letters and standard symbols only).");
      return;
    }

    if (formData.middle_name?.trim() && !validateName(formData.middle_name)) {
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
      toast.error("Please enter a valid address.");
      return;
    }

    if (!formData.course || !formData.course_level) {
      toast.error("Course and Year Level are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Duplicate Validation (Client-side check against current PAGE only)
      const isDuplicateId = students.some(s => 
        String(s.student_id) === String(formData.student_id) && s.id !== formData.id
      );
      const isDuplicateEmail = students.some(s => 
        s.email?.toLowerCase() === formData.email?.toLowerCase() && s.id !== formData.id
      );

      if (isDuplicateId) {
        toast.error(`Student ID ${formData.student_id} is already in the current list.`);
        setIsSubmitting(false);
        return;
      }

      if (isDuplicateEmail) {
        toast.error(`Email ${formData.email} is already in use.`);
        setIsSubmitting(false);
        return;
      }

      let studentId = formData.id;
      if (isEditing) {
        await studentService.adminUpdate(formData);
      } else {
        if (!formData.password) {
          toast.error("Password required");
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          setIsSubmitting(false);
          return;
        }
        const res = await studentService.adminCreate(formData);
        studentId = res.data?.id;
      }

      // Upload profile pic if selected
      if (profileFile && studentId) {
        const fd = new FormData();
        fd.append("profile_pic", profileFile);
        fd.append("id", studentId);
        await studentService.uploadProfilePicture(fd);
      }

      toast.success(
        isEditing
          ? "Student updated successfully"
          : "Student added successfully",
      );
      onSuccess();
    } catch (err) {
      // Improved error message extraction based on Backend Validation Guide
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (err.response) {
        const data = err.response.data;
        const status = err.response.status;
        
        if (status === 409) {
          // Conflict / Duplicate
          errorMessage = data.message || data.error || "Conflict: This Student ID or Email already exists in the system.";
        } else if (status === 422) {
          // Validation Failed
          if (data.errors && typeof data.errors === 'object') {
            errorMessage = Object.values(data.errors)[0];
          } else {
            errorMessage = data.message || "Validation failed. Please check your inputs.";
          }
        } else {
          // Other error statuses
          errorMessage = data.message || data.error || err.customMessage || `Error ${status}: Action failed.`;
        }
      } else if (err.customMessage) {
        errorMessage = err.customMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputStyles =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all";
  const labelStyles =
    "block text-[10px] font-black uppercase tracking-widest text-primary-light mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-visible border border-border">
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <h3 className="text-lg font-black text-primary uppercase tracking-tight">
            {isEditing ? "Edit Student" : "Add Student"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-primary-light hover:text-primary transition-colors border border-transparent hover:border-border cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 pb-4 border-b border-border/50">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-xl overflow-hidden">
                <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center border border-primary overflow-hidden relative">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary/20" />
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-primary/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="h-5 w-5 text-white mb-1" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">
                      Change
                    </span>
                  </button>
                </div>
              </div>
              {profileFile && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileFile(null);
                    setProfilePreview(
                      isEditing && student.profile_pic
                        ? `${ASSET_URL}/${student.profile_pic}`
                        : null,
                    );
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-[9px] font-black text-primary-light uppercase tracking-widest">
              Student Profile Picture
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyles}>ID Number</label>
                  <input
                    required
                    type="text"
                    value={formData.student_id}
                    onChange={(e) =>
                      setFormData({ ...formData, student_id: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="20211234"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="student@uc.edu.ph"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>First Name</label>
                <input
                  required
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Middle Name</label>
                <input
                  type="text"
                  value={formData.middle_name}
                  onChange={(e) =>
                    setFormData({ ...formData, middle_name: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="(Optional)"
                />
              </div>
              <div>
                <label className={labelStyles}>Last Name</label>
                <input
                  required
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelStyles}>Course</label>
              <CourseSearchableDropdown
                value={formData.course}
                onChange={(val) => setFormData({ ...formData, course: val })}
              />
            </div>

            <div>
              <label className={labelStyles}>Year Level</label>
              <select
                required
                value={formData.course_level}
                onChange={(e) =>
                  setFormData({ ...formData, course_level: e.target.value })
                }
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                <option value="" disabled>Select Year</option>
                {ACADEMIC_YEARS.map(year => (
                  <option key={year} value={year}>{year} Year</option>
                ))}
              </select>
            </div>

            {!isEditing && (
              <div>
                <label className={labelStyles}>Password</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className={labelStyles}>Current Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={inputStyles}
                placeholder="Cebu City, Philippines"
              />
            </div>
          </div>
        </form>
        <div className="px-6 py-4 bg-bg-secondary border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-primary-light hover:text-primary transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? "Save Changes" : "Create Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentDetailsPanel({ student, isOpen, onClose, onSitInComplete }) {
  const [history, setHistory] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sitin"); // sitin, reservations, profile
  const [isSitInModalOpen, setIsSitInModalOpen] = useState(false);
  const [fullDetails, setFullDetails] = useState(null);

  const [stats, setStats] = useState({
    totalHours: "0h 0m",
    totalSessions: 0,
  });

  useEffect(() => {
    if (student && isOpen) {
      fetchAllData();
    }
  }, [student, isOpen]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching details for student:", student.student_id);
      const [response, labsRes] = await Promise.all([
        studentService.getDetails(student.student_id),
        labService.getAll().catch(() => ({ data: [] })),
      ]);

      setLabs(labsRes.data || []);
      console.log("Full API Response:", response);

      if (response.status === "success" && response.data) {
        const data = response.data;

        // The profile info is flat inside data, but we also want history and reservations
        setFullDetails(data);
        setHistory(data.sit_in_logs || []);
        setReservations(data.reservations || []);

        // Format decimal hours to "Xh Ym" if it's a number
        let formattedHours = "0h 0m";
        if (typeof data.total_hours === "number") {
          const hours = Math.floor(data.total_hours);
          const minutes = Math.round((data.total_hours - hours) * 60);
          formattedHours = `${hours}h ${minutes}m`;
        } else {
          formattedHours = data.total_hours || "0h 0m";
        }

        setStats({
          totalHours: formattedHours,
          totalSessions: data.total_sessions || 0,
        });
      } else {
        throw new Error(response.message || "Invalid API response structure");
      }
    } catch (err) {
      console.error("Detailed error in fetchAllData:", err);
      toast.error("Failed to load student data");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Use fullDetails if available, otherwise fallback to the student prop
  const displayStudent = fullDetails || student;

  return (
    <>
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-bg-secondary rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border flex flex-col max-h-[92vh] animate-zoom-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                <ClipboardList className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-black text-primary uppercase tracking-tight leading-none">
                Comprehensive Student File
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-primary-light hover:text-primary hover:bg-bg-secondary transition-all border border-transparent hover:border-border cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {/* Hero Section — ID Focused */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 bg-white border border-border rounded-xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

              <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-primary to-primary-hover p-0.5 shadow-md shrink-0 transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-[0.7rem] bg-white flex items-center justify-center overflow-hidden relative">
                  {displayStudent.profile_pic ? (
                    <img
                      src={`${ASSET_URL}/${displayStudent.profile_pic}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary/10" />
                  )}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black text-primary tracking-tighter leading-none mb-1">
                    {displayStudent.student_id}
                  </h2>
                  <h3 className="text-lg font-bold text-primary leading-tight">
                    {displayStudent.first_name} {displayStudent.last_name}
                  </h3>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-bg-secondary border border-border/60">
                      <GraduationCap className="h-3 w-3 text-primary-light" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-tight">
                        {displayStudent.course}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-bg-secondary border border-border/60">
                      <Calendar className="h-3 w-3 text-primary-light" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-tight">
                        {displayStudent.course_level} Year
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Contrast Stats Grid - Compact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-border shadow-sm group hover:border-primary/30 transition-all">
                <p className="text-[8px] font-black text-primary-light uppercase tracking-[0.2em] mb-1">
                  Accumulated Time
                </p>
                <p className="text-2xl font-black text-primary tracking-tighter">
                  {stats.totalHours}
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-border shadow-sm group hover:border-primary/30 transition-all">
                <p className="text-[8px] font-black text-primary-light uppercase tracking-[0.2em] mb-1">
                  Total Sessions
                </p>
                <p className="text-2xl font-black text-primary tracking-tighter">
                  {stats.totalSessions}
                </p>
              </div>

              <div className="p-4 bg-primary rounded-lg border border-primary/20 shadow-lg text-white group relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
                    Available Credits
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-black text-white tracking-tighter leading-none">
                      {displayStudent.session}
                    </p>
                    <p className="text-[8px] font-black text-white/30 uppercase">
                      / 30 Bal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refined Tabbed Interface */}
            <div className="space-y-6">
              <div className="flex gap-1.5 p-1 bg-white border border-border rounded-lg shadow-sm w-fit">
                {[
                  { id: "sitin", label: "Recent Records", icon: History },
                  { id: "reservations", label: "Recent Reservations", icon: Calendar },
                  { id: "profile", label: "Detailed File", icon: Info },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-md"
                        : "text-primary-light hover:text-primary hover:bg-bg-secondary"
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content with High Clarity */}
              <div className="min-h-[300px] animate-fade-in">
                {isLoading ? (
                  <div className="py-20 text-center">
                    <div className="w-8 h-8 border-4 border-primary/10 border-t-primary rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em] mt-4 animate-pulse">
                      Synchronizing Records...
                    </p>
                  </div>
                ) : activeTab === "sitin" ? (
                  <div className="space-y-2">
                    {history.length === 0 ? (
                      <div className="py-20 text-center bg-white rounded-lg border border-dashed border-border flex flex-col items-center">
                        <History className="h-10 w-10 text-primary-light/10 mb-3" />
                        <p className="text-[9px] font-black text-primary-light uppercase tracking-widest">
                          No historical logs discovered
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {history.slice(0, 10).map((log) => {
                          const lab = labs.find((l) => l.id == log.lab_id);
                          const labCode = lab?.lab_code;
                          const isOngoing = log.status === "active";
                          return (
                            <div
                              key={log.id}
                              className="relative border border-border rounded-xl p-0 transition-all duration-300 bg-white overflow-hidden hover:shadow-md hover:border-primary/20"
                            >
                              <div
                                className={`absolute left-0 top-0 bottom-0 w-1 ${isOngoing ? "bg-emerald-500 animate-pulse" : "bg-primary-light/20"}`}
                              />

                              <div className="px-4 py-3 ml-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1.5 gap-4">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-primary leading-tight">
                                            {log.pc_number
                                              ? `PC ${log.pc_number}`
                                              : "No Station"}
                                          </span>
                                          {labCode && (
                                            <span className="px-1.5 py-0.5 rounded bg-primary/5 text-[8px] font-bold text-primary-light border border-primary/10">
                                              {labCode}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[10px] font-bold text-primary-light leading-tight">
                                          {log.lab_name || log.name}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-primary-light">
                                      <span className="flex items-center gap-1.5 bg-bg-secondary px-2 py-1 rounded-lg text-primary border border-border/50">
                                        <Calendar className="h-2.5 w-2.5" />
                                        {formatDate(log.time_in)}
                                      </span>
                                      <span className="flex items-center gap-1.5 bg-bg-secondary px-2 py-1 rounded-lg text-primary border border-border/50">
                                        <Clock className="h-2.5 w-2.5" />
                                        {formatTime(log.time_in)}
                                      </span>
                                      <span className="flex items-center gap-1.5 bg-bg-secondary/60 px-2 py-1 rounded-lg text-primary-light border border-border/60 text-[8px] font-extrabold tracking-wide">
                                        {log.purpose}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end justify-between min-w-[70px]">
                                    <span
                                      className={`px-2 py-0.5 rounded-lg text-[8px] font-extrabold border ${
                                        isOngoing
                                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                          : "bg-bg-secondary text-primary-light border-border"
                                      }`}
                                    >
                                      {isOngoing ? "Ongoing" : "Completed"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : activeTab === "reservations" ? (
                  <div className="space-y-2">
                    {reservations.length === 0 ? (
                      <div className="py-20 text-center bg-white rounded-lg border border-dashed border-border flex flex-col items-center">
                        <Calendar className="h-10 w-10 text-primary-light/10 mb-3" />
                        <p className="text-[9px] font-black text-primary-light uppercase tracking-widest">
                          No reservation history found
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {reservations.slice(0, 10).map((res) => {
                          const matchedLab = labs.find(
                            (lab) => String(lab.id) === String(res.lab_id),
                          );
                          const labCode = res.lab_code || matchedLab?.lab_code;

                          return (
                            <ReservationCard
                              key={res.id}
                              reservation={{ ...res, lab_code: labCode }}
                              compact={true}
                              className="!shadow-none"
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-border p-6 space-y-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-border pb-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                            Academic File
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-4 pl-1">
                          {[
                            {
                              label: "Official Full Name",
                              value: `${displayStudent.first_name} ${displayStudent.middle_name ? displayStudent.middle_name + " " : ""}${displayStudent.last_name}`,
                            },
                            {
                              label: "Degree Program",
                              value: displayStudent.course,
                            },
                            {
                              label: "Current Year Level",
                              value: `${displayStudent.course_level} Year Student`,
                            },
                          ].map((item, idx) => (
                            <div key={idx} className="flex flex-col group">
                              <span className="text-[8px] font-black text-primary-light uppercase tracking-[0.15em] mb-0.5 group-hover:text-primary transition-colors">
                                {item.label}
                              </span>
                              <span className="text-xs font-bold text-primary border-l-2 border-transparent group-hover:border-primary/30 pl-2 transition-all">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-border pb-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                            Verification
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-4 pl-1">
                          {[
                            {
                              label: "Institutional ID",
                              value: displayStudent.student_id,
                            },
                            {
                              label: "Primary Email Address",
                              value: displayStudent.email,
                            },
                            {
                              label: "Declared Residence",
                              value: displayStudent.address || "Not Specified",
                            },
                          ].map((item, idx) => (
                            <div key={idx} className="flex flex-col group">
                              <span className="text-[8px] font-black text-primary-light uppercase tracking-[0.15em] mb-0.5 group-hover:text-primary transition-colors">
                                {item.label}
                              </span>
                              <span className="text-xs font-bold text-primary border-l-2 border-transparent group-hover:border-primary/30 pl-2 transition-all">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Refined Professional Footer */}
          <div className="px-6 py-3.5 bg-white border-t border-border flex justify-end items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-[9px] font-black uppercase text-primary hover:bg-bg-secondary transition-all cursor-pointer tracking-widest"
            >
              Close Record
            </button>
            <button
              onClick={() => setIsSitInModalOpen(true)}
              disabled={displayStudent.session <= 0}
              className="px-6 py-2 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-md active:scale-95 disabled:opacity-30 hover:bg-primary-hover transition-all flex items-center gap-2 cursor-pointer"
            >
              <Monitor className="h-3.5 w-3.5" /> Start New Session
            </button>
          </div>
        </div>
      </div>
      <SitInModal
        isOpen={isSitInModalOpen}
        onClose={() => setIsSitInModalOpen(false)}
        student={displayStudent}
        onSuccess={() => {
          setIsSitInModalOpen(false);
          fetchAllData();
          onSitInComplete();
        }}
      />
    </>
  );
}

function SitInModal({ isOpen, onClose, student, onSuccess }) {
  const [labs, setLabs] = useState([]);
  const [formData, setFormData] = useState({
    lab_id: "",
    purpose: SITIN_PURPOSES[0],
    customPurpose: "",
    pc_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pcs, setPcs] = useState([]);
  const [isLoadingPcs, setIsLoadingPcs] = useState(false);

  useEffect(() => {
    if (isOpen && (!Array.isArray(labs) || labs.length === 0)) {
      labService
        .getAll()
        .then((res) => {
          setLabs(res.data || []);
        })
        .catch(() => {
          setLabs([]);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchPcs = async () => {
      if (!formData.lab_id) {
        setPcs([]);
        return;
      }
      setIsLoadingPcs(true);
      try {
        const result = await pcService.getPcsByLab(formData.lab_id);
        if (result.status === "success") {
          setPcs(result.data || []);
        } else {
          setPcs([]);
        }
      } catch (err) {
        console.error("Failed to fetch PCs:", err);
      } finally {
        setIsLoadingPcs(false);
      }
    };
    fetchPcs();
  }, [formData.lab_id]);

  const labsArray = Array.isArray(labs) ? labs : [];
  const selectedLab = labsArray.find((l) => l.id == formData.lab_id);
  const capacity = Number(selectedLab?.capacity || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lab_id) {
      toast.error("Select lab");
      return;
    }
    const finalPurpose =
      formData.purpose === "Other" ? formData.customPurpose : formData.purpose;
    if (formData.purpose === "Other" && !formData.customPurpose.trim()) {
      toast.error("Please specify the purpose");
      return;
    }
    setIsSubmitting(true);
    try {
      await sitinService.create({
        student_id: student.student_id,
        lab_id: formData.lab_id,
        purpose: finalPurpose,
        pc_number: formData.pc_number || null,
      });
      toast.success("Assigned");

      // Notify Student
      try {
        await notificationService.create({
          student_id: student.student_id,
          type: "session",
          message: `Administrative Action: You have been assigned a sit-in session in ${selectedLab?.name || "the laboratory"}${formData.pc_number ? ` at PC #${formData.pc_number}` : ""}.`,
        });
      } catch (notifyErr) {
        console.error("Failed to send notification:", notifyErr);
      }

      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-border flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-light">
              Admin · Manual Entry
            </p>
            <h3 className="text-base font-black text-primary tracking-tight">
              Assign Lab Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-primary-light hover:text-primary hover:bg-bg-secondary border border-transparent hover:border-border transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Student badge */}
        <div className="px-6 py-3 bg-primary/5 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-hover to-brand-sand p-0.5 shadow-sm shrink-0">
            <div className="w-full h-full rounded-[0.4rem] bg-white flex items-center justify-center overflow-hidden">
              {student?.profile_pic ? (
                <img
                  src={`${ASSET_URL}/${student.profile_pic}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-primary tracking-tight">
              {student?.first_name} {student?.last_name}
            </p>
            <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest">
              {student?.student_id} · {student?.session} sessions left
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] divide-y md:divide-y-0 md:divide-x divide-border">
            {/* LEFT — Lab + Purpose */}
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary-light ml-0.5">
                  Laboratory
                </label>
                <select
                  value={formData.lab_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lab_id: e.target.value,
                      pc_number: "",
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                >
                  <option value="" disabled>
                    Select Lab...
                  </option>
                  {labsArray.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.lab_code
                        ? `${lab.lab_code} — ${lab.name}`
                        : lab.name}{" "}
                      ({lab.capacity} PCs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary-light ml-0.5">
                  Purpose
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                >
                  {SITIN_PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {formData.purpose === "Other" && (
                <div className="space-y-1.5 animate-fade-in-up">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary-light ml-0.5">
                    Specify Purpose
                  </label>
                  <input
                    type="text"
                    value={formData.customPurpose}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customPurpose: e.target.value,
                      })
                    }
                    placeholder="Enter custom purpose..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm font-bold text-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                    autoFocus
                  />
                </div>
              )}

              {/* Selected PC callout */}
              {formData.pc_number ? (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <Monitor className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-light">
                      Selected Station
                    </p>
                    <p className="text-sm font-black text-primary">
                      PC {String(formData.pc_number).padStart(2, "0")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, pc_number: "" }))
                    }
                    className="ml-auto p-1 rounded-md text-primary-light hover:text-red-500 transition-colors"
                    title="Clear selection"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-primary-light italic text-center bg-bg-secondary/50 rounded-xl border border-dashed border-border p-3">
                  No workstation selected — optional
                </p>
              )}
            </div>

            {/* RIGHT — PC Map */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-light">
                  Workstation Selection
                </label>
                {formData.lab_id && !isLoadingPcs && (
                  <span className="text-[9px] font-bold text-primary-light bg-bg-secondary px-2 py-0.5 rounded-md border border-border">
                    {capacity} stations
                  </span>
                )}
              </div>

              {!formData.lab_id ? (
                <div className="rounded-xl border border-dashed border-border bg-bg-secondary/30 flex flex-col items-center justify-center py-16 gap-3 opacity-50">
                  <FlaskConical className="h-10 w-10 text-primary-light" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-light text-center leading-relaxed">
                    Select a laboratory
                    <br />
                    to view available stations
                  </p>
                </div>
              ) : isLoadingPcs ? (
                <div className="rounded-xl border border-dashed border-border bg-bg-secondary/30 flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-primary-hover/10 border-t-primary-hover animate-spin" />
                  <p className="text-[10px] font-bold text-primary-light">
                    Scanning availability...
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Array.from({ length: capacity }, (_, i) => i + 1).map(
                      (pcNum) => {
                        const pcData = pcs.find(
                          (p) => Number(p.pc_number) === pcNum,
                        );
                        const pcStatus = pcData?.pc_status || "active";
                        const resStatus = pcData?.reservation_status || "open";

                        const isFunctionalActive = pcStatus === "active";
                        const isReserved = resStatus === "reserved";
                        const isOccupied = resStatus === "occupied";

                        const isUnavailable =
                          !isFunctionalActive || isOccupied || isReserved;
                        const isSelected = Number(formData.pc_number) === pcNum;

                        let cardClass = "";
                        let statusText = "Open";
                        let iconClass = "text-primary-light";

                        if (pcStatus === "under maintenance") {
                          cardClass =
                            "bg-amber-50 text-amber-900 border-amber-200 cursor-not-allowed opacity-70";
                          statusText = "Under Maintenance";
                          iconClass = "text-amber-400";
                        } else if (pcStatus === "disabled") {
                          cardClass =
                            "bg-red-50 text-red-900 border-red-200 cursor-not-allowed opacity-70";
                          statusText = "Disabled";
                          iconClass = "text-red-400";
                        } else if (isOccupied) {
                          cardClass =
                            "bg-red-500 text-white border-red-600 cursor-not-allowed shadow-sm";
                          statusText = "Occupied";
                          iconClass = "text-red-200";
                        } else if (isReserved) {
                          cardClass =
                            "bg-amber-500 text-white border-amber-600 cursor-not-allowed shadow-sm";
                          statusText = "Reserved";
                          iconClass = "text-amber-200";
                        } else if (isSelected) {
                          cardClass =
                            "bg-primary text-white border-primary shadow-lg scale-105 z-10 ring-4 ring-primary/20";
                          statusText = "Selected";
                          iconClass = "text-brand-sand";
                        } else {
                          cardClass =
                            "bg-white text-primary border-border hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm active:scale-95 cursor-pointer";
                        }

                        return (
                          <button
                            key={pcNum}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                pc_number: pcNum,
                              }))
                            }
                            className={`w-full py-3 rounded-xl flex flex-col items-center justify-center transition-all duration-200 border-2 ${cardClass}`}
                            title={
                              statusText !== "Open"
                                ? statusText
                                : `Select PC ${pcNum}`
                            }
                          >
                            <Monitor
                              className={`h-5 w-5 mb-1.5 ${iconClass}`}
                            />
                            <span className="text-[11px] font-black leading-none mb-1">
                              PC {String(pcNum).padStart(2, "0")}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded leading-tight ${
                                isOccupied
                                  ? "bg-red-600 text-white/90"
                                  : isReserved
                                    ? "bg-amber-600 text-white/90"
                                    : pcStatus === "under maintenance"
                                      ? "bg-amber-100 text-amber-800"
                                      : pcStatus === "disabled"
                                        ? "bg-red-100 text-red-800"
                                        : isSelected
                                          ? "bg-brand-sand text-primary"
                                          : "bg-bg-secondary text-primary-light"
                              }`}
                            >
                              {statusText}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border/60 justify-center">
                    {[
                      { color: "bg-white border-border", label: "Open" },
                      {
                        color: "bg-red-500    border-red-600",
                        label: "Occupied",
                      },
                      {
                        color: "bg-amber-500  border-amber-600",
                        label: "Reserved",
                      },
                      {
                        color: "bg-primary    border-primary",
                        label: "Selected",
                      },
                      {
                        color: "bg-amber-50   border-amber-200",
                        label: "Under Maintenance",
                      },
                      {
                        color: "bg-red-50     border-red-200",
                        label: "Disabled",
                      },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <div
                          className={`w-3 h-3 rounded border-2 shadow-sm ${color}`}
                        />
                        <span className="text-[10px] font-bold text-primary-light">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-bg-secondary border-t border-border flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-border text-[10px] font-black uppercase text-primary-light hover:text-primary hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.lab_id}
            className="flex-1 px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase hover:bg-primary-hover shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Start Session"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
