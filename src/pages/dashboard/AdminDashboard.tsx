import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Award,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  MoreVertical,
  Download,
  Check,
  ChevronDown,
  BookOpen,
  Folder,
  FileText,
  Heart,
  Mic,
  MicOff,
  VideoOff,
  Copy,
  Edit3,
  Shield,
  Plus,
  Trash2,
  Search,
  UserCheck,
  UserPlus,
  Layers,
  Link2,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/context/CourseContext';
import { useStudents } from '@/context/StudentContext';
import { useInstructors } from '@/context/InstructorContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { usePermissions } from '@/context/PermissionContext';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { CourseModal } from '@/pages/courses/CourseModal';
import { StudentModal } from '@/pages/students/StudentModal';
import { InstructorModal } from '@/pages/instructors/InstructorModal';
import { AssignCourseModal } from '@/pages/instructors/AssignCourseModal';
import { INITIAL_UPCOMING_CLASSES, INITIAL_STUDENTS, INITIAL_COURSES } from '@/utils/mockData';
import { UpcomingClass, Course, Student, Instructor } from '@/types';
import { CourseFormData, StudentFormData, InstructorFormData } from '@/utils/validators';

// ----------------------------------------------------------------------
// DATA TYPES & MOCKS FOR SCHOOOLI ADMIN DESIGN SPEC
// ----------------------------------------------------------------------
interface StarStudent {
  id: string;
  name: string;
  studentId: string;
  marks: number;
  percent: number;
  avatar: string;
}

const INITIAL_STAR_STUDENTS: StarStudent[] = [
  {
    id: 's-1',
    name: 'Evelyn Harper',
    studentId: 'PRE43178',
    marks: 1185,
    percent: 98,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 's-2',
    name: 'Diana Plenty',
    studentId: 'PRE43174',
    marks: 1165,
    percent: 91,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 's-3',
    name: 'John Millar',
    studentId: 'PRE43187',
    marks: 1175,
    percent: 92,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
];

const DONUT_DATA = [
  { name: 'Math', value: 6750, color: '#f59e0b' },
  { name: 'English', value: 5250, color: '#7047eb' },
  { name: 'Chemistry', value: 3000, color: '#22c55e' },
];

export const AdminDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { instructors, addInstructor, updateInstructor, deleteInstructor, assignCourseToInstructor } = useInstructors();
  const { enrollments, enrollStudent, unenrollStudent } = useEnrollment();
  const {
    globalPolicy,
    updateGlobalPolicy,
    instructorPermissions,
    toggleInstructorCanAddStudents,
    toggleClassJoinRequirement,
    classAttendanceRecords,
  } = usePermissions();
  const navigate = useNavigate();

  // ----------------------------------------------------------------------
  // CRUD COMMAND CENTER STATE & HANDLERS
  // ----------------------------------------------------------------------
  const [crudActiveTab, setCrudActiveTab] = useState<'courses' | 'students' | 'instructors' | 'enrollments' | 'permissions'>('courses');
  const [crudSearch, setCrudSearch] = useState('');

  // Course CRUD Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (c: Course) => {
    setEditingCourse(c);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (data: CourseFormData) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, {
        ...data,
        rating: editingCourse.rating,
      });
      toast.success(`Course "${data.title}" updated successfully!`);
    } else {
      addCourse(data);
      toast.success(`Course "${data.title}" created successfully!`);
    }
    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };

  // Student CRUD Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (s: Student) => {
    setEditingStudent(s);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (data: StudentFormData) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, data);
      toast.success(`Student "${data.fullName}" updated successfully!`);
    } else {
      addStudent(data);
      toast.success(`Student "${data.fullName}" registered successfully!`);
    }
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  // Instructor CRUD Modal State
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [assigningInstructor, setAssigningInstructor] = useState<Instructor | null>(null);

  const handleOpenAddInstructor = () => {
    setEditingInstructor(null);
    setIsInstructorModalOpen(true);
  };

  const handleOpenEditInstructor = (inst: Instructor) => {
    setEditingInstructor(inst);
    setIsInstructorModalOpen(true);
  };

  const handleSaveInstructor = (data: InstructorFormData) => {
    if (editingInstructor) {
      updateInstructor(editingInstructor.id, data);
      toast.success(`Faculty member "${data.name}" updated successfully!`);
    } else {
      addInstructor(data);
      toast.success(`Faculty member "${data.name}" added successfully!`);
    }
    setIsInstructorModalOpen(false);
    setEditingInstructor(null);
  };

  const handleAssignCourseSubmit = (instructorId: string, courseId: string) => {
    assignCourseToInstructor(instructorId, courseId);
    const inst = instructors.find((i) => i.id === instructorId);
    const crs = courses.find((c) => c.id === courseId);
    toast.success(`Assigned "${crs?.title}" to ${inst?.name || 'instructor'}!`);
    setAssigningInstructor(null);
  };

  // Quick Enroll State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [enrollCourseId, setEnrollCourseId] = useState('');

  const handleQuickEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollStudentId || !enrollCourseId) {
      toast.error('Please select both a student and a course.');
      return;
    }
    try {
      enrollStudent(enrollStudentId, enrollCourseId);
      const st = students.find((s) => s.id === enrollStudentId);
      const cr = courses.find((c) => c.id === enrollCourseId);
      toast.success(`Successfully enrolled ${st?.fullName || 'student'} into ${cr?.title || 'course'}!`);
      setIsEnrollModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Enrollment failed.');
    }
  };

  // Delete Entity Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'course' | 'student' | 'instructor' | 'enrollment';
    id: string;
    title: string;
  } | null>(null);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'course') {
      deleteCourse(deleteTarget.id);
      toast.success(`Course "${deleteTarget.title}" deleted successfully.`);
    } else if (deleteTarget.type === 'student') {
      deleteStudent(deleteTarget.id);
      toast.success(`Student "${deleteTarget.title}" deleted successfully.`);
    } else if (deleteTarget.type === 'instructor') {
      deleteInstructor(deleteTarget.id);
      toast.success(`Faculty member "${deleteTarget.title}" deleted successfully.`);
    } else if (deleteTarget.type === 'enrollment') {
      unenrollStudent(deleteTarget.id);
      toast.success(`Enrollment for "${deleteTarget.title}" removed.`);
    }
    setDeleteTarget(null);
  };

  // Filtered lists for the CRUD hub
  const filteredCrudCourses = useMemo(() => {
    if (!crudSearch.trim()) return courses;
    const q = crudSearch.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q)
    );
  }, [courses, crudSearch]);

  const filteredCrudStudents = useMemo(() => {
    if (!crudSearch.trim()) return students;
    const q = crudSearch.toLowerCase();
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.qualification.toLowerCase().includes(q)
    );
  }, [students, crudSearch]);

  const filteredCrudInstructors = useMemo(() => {
    if (!crudSearch.trim()) return instructors;
    const q = crudSearch.toLowerCase();
    return instructors.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.specialization.toLowerCase().includes(q)
    );
  }, [instructors, crudSearch]);

  const filteredCrudEnrollments = useMemo(() => {
    if (!crudSearch.trim()) return enrollments;
    const q = crudSearch.toLowerCase();
    return enrollments.filter((e) => {
      const st = students.find((s) => s.id === e.studentId);
      const cr = courses.find((c) => c.id === e.courseId);
      return (
        st?.fullName.toLowerCase().includes(q) ||
        cr?.title.toLowerCase().includes(q) ||
        e.status.toLowerCase().includes(q)
      );
    });
  }, [enrollments, students, courses, crudSearch]);

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@edusphere.edu',
    avatarUrl: user?.avatarUrl || '',
    department: 'Institutional Academic Office',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Please enter a valid administrator name.');
      return;
    }
    updateProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      avatarUrl: profileForm.avatarUrl.trim() || undefined,
    });
    toast.success('Administrator profile updated successfully!');
    setIsProfileModalOpen(false);
  };

  // Selection state for star students table
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(['s-2']);

  // Class Routine filter state
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSection, setSelectedSection] = useState('All Sections');

  // Best Performers filter timeframe
  const [bestPerformersTimeframe, setBestPerformersTimeframe] = useState('Weekly');

  // Live session virtual classroom modal
  const [selectedLiveClass, setSelectedLiveClass] = useState<UpcomingClass | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Dynamic values synced with app context
  const totalStudentsDisplay = useMemo(() => {
    // Matches screenshot "15.00K" base with real student dynamic additions
    const count = 15000 + (students.length > 5 ? (students.length - 5) * 10 : 0);
    return `${(count / 1000).toFixed(2)}K`;
  }, [students]);

  const totalTeachersDisplay = useMemo(() => {
    // Matches screenshot "200" base with live instructors
    return instructors.length > 0 ? `${196 + instructors.length}` : '200';
  }, [instructors]);

  const totalAwardsDisplay = useMemo(() => {
    // Matches screenshot "5.6K" awards / certifications
    return '5.6K';
  }, []);

  const totalCoursesEnrolled = useMemo(() => {
    return 15000 + enrollments.length;
  }, [enrollments]);

  // Star students list synced with students context
  const starStudentsList: StarStudent[] = useMemo(() => {
    const list = [...INITIAL_STAR_STUDENTS];
    // Sync additional students from context if any exist
    students.slice(0, 2).forEach((st, idx) => {
      const studentName = st.fullName || (st as any).name;
      if (studentName && !list.some((s) => s.name.toLowerCase() === studentName.toLowerCase())) {
        list.push({
          id: `context-${st.id}`,
          name: studentName,
          studentId: `PRE43${190 + idx}`,
          marks: 1140 + idx * 15,
          percent: 88 + idx * 3,
          avatar: st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        });
      }
    });
    return list;
  }, [students]);

  // Toggle student row checkbox
  const toggleStudentSelection = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success('Session link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 font-sans">
      {/* ========================================================= */}
      {/* 1. WELCOME HEADER & TOP 3 METRIC CARDS (SCHOOOLI SPEC)    */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Welcome Title & Subtitle */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name || 'Admin'}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {user?.name || 'Administrator'}.
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7047EB] dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Navigate the future of education with Schoooli &bull;{' '}
                <span className="font-semibold text-[#7047EB]">Institutional Learning Analytics</span>
              </p>
            </div>
          </div>

          {/* Quick Admin Actions Toolbar */}
          <div className="space-y-2.5 pt-1">
            {/* Action Row 1: Core Institutional CRUD Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-0.5 hidden sm:inline">
                Quick Add:
              </span>
              <button
                onClick={handleOpenAddCourse}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
                title="Create a new course"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
              <button
                onClick={handleOpenAddStudent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7047EB] hover:bg-[#5e38d4] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
                title="Register a new student"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
              <button
                onClick={handleOpenAddInstructor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
                title="Onboard a new faculty member"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Add Faculty</span>
              </button>
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
                title="Quickly enroll a student in a course"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Quick Enroll</span>
              </button>
            </div>

            {/* Action Row 2: Governance & Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-0.5 hidden sm:inline">
                Shortcuts:
              </span>
              <Link
                to="/permissions"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-[#7047EB] dark:text-purple-300 text-xs font-bold border border-purple-200/70 dark:border-purple-800/50 transition-colors shadow-2xs"
                title="Instructor Permissions & Live Class Attendance Governance"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#7047EB] dark:text-purple-400" />
                <span>Permissions</span>
              </Link>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                title="Update Admin Profile"
                aria-label="Update Profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Update Profile</span>
              </button>
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Catalog</span>
              </Link>
              <Link
                to="/students"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Directory</span>
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>Reports</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: 3 Metric Cards side-by-side */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 lg:min-w-[460px] xl:min-w-[540px] shrink-0">
          {/* Card 1: Students */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F2FD] dark:bg-purple-950/20 border border-purple-100/80 dark:border-purple-900/40 shadow-xs hover:shadow-sm transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Students
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                {totalStudentsDisplay}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[#7047EB] shadow-xs ring-4 ring-purple-100/60 dark:ring-purple-900/30">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Teachers */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F0F8FF] dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40 shadow-xs hover:shadow-sm transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Teachers
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                {totalTeachersDisplay}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-blue-500 shadow-xs ring-4 ring-blue-100/60 dark:ring-blue-900/30">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Awards */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF9F2] dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/40 shadow-xs hover:shadow-sm transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Awards
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                {totalAwardsDisplay}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500 shadow-xs ring-4 ring-amber-100/60 dark:ring-amber-900/30">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. INSTITUTIONAL CRUD COMMAND CENTER                      */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#7047EB] dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                ADMIN COMMAND CENTER
              </span>
              <span className="text-xs text-slate-400">Institutional CRUD Operations</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Entity Records & CRUD Management Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create, update, assign, and delete curriculum courses, student profiles, and faculty records with live context sync.
            </p>
          </div>

          {/* Action Trigger Buttons for Active Entity */}
          <div className="flex items-center gap-2">
            {crudActiveTab === 'courses' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddCourse}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Course
              </Button>
            )}
            {crudActiveTab === 'students' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddStudent}
                className="bg-[#7047EB] hover:bg-[#5e38d4] text-white"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Student
              </Button>
            )}
            {crudActiveTab === 'instructors' && (
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddInstructor}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Faculty
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssigningInstructor(instructors[0] || null)}
                  leftIcon={<Link2 className="w-4 h-4 text-purple-600" />}
                >
                  Assign Course
                </Button>
              </div>
            )}
            {crudActiveTab === 'enrollments' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEnrollModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Quick Enroll
              </Button>
            )}
            {crudActiveTab === 'permissions' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/permissions')}
                className="bg-[#7047EB] hover:bg-[#5E36D9] text-white"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Open Full Permissions Console
              </Button>
            )}
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => { setCrudActiveTab('courses'); setCrudSearch(''); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${crudActiveTab === 'courses'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Courses ({courses.length})</span>
            </button>

            <button
              onClick={() => { setCrudActiveTab('students'); setCrudSearch(''); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${crudActiveTab === 'students'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#7047EB]" />
              <span>Students ({students.length})</span>
            </button>

            <button
              onClick={() => { setCrudActiveTab('instructors'); setCrudSearch(''); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${crudActiveTab === 'instructors'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Faculty ({instructors.length})</span>
            </button>

            <button
              onClick={() => { setCrudActiveTab('enrollments'); setCrudSearch(''); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${crudActiveTab === 'enrollments'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Enrollments ({enrollments.length})</span>
            </button>

            <button
              onClick={() => { setCrudActiveTab('permissions'); setCrudSearch(''); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${crudActiveTab === 'permissions'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Permissions ({instructorPermissions.length})</span>
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={crudSearch}
              onChange={(e) => setCrudSearch(e.target.value)}
              placeholder={`Search ${crudActiveTab}...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7047EB]"
            />
          </div>
        </div>

        {/* Tab 1: COURSES CRUD TABLE */}
        {crudActiveTab === 'courses' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Duration & Level</th>
                  <th className="py-3 px-4">Tuition</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCrudCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No courses match your query. Click "Add New Course" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredCrudCourses.slice(0, 6).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.thumbnail}
                            alt={c.title}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {c.title}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {c.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="purple" size="sm">{c.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {c.instructorName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        <span>{c.duration}</span> &bull; <span className="font-semibold">{c.level}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {c.price === 0 ? 'Free' : `$${c.price}`}
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-500">
                        ⭐ {c.rating.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/courses/${c.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Course"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditCourse(c)}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                            title="Edit Course"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'course', id: c.id, title: c.title })}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: STUDENTS CRUD TABLE */}
        {crudActiveTab === 'students' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Qualification</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Enrollment Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCrudStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No students match your query. Click "Add New Student" to register one.
                    </td>
                  </tr>
                ) : (
                  filteredCrudStudents.slice(0, 6).map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={st.fullName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-200 dark:ring-purple-900 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {st.fullName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {st.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {st.mobileNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {st.qualification}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[160px]">
                        {st.address}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {st.enrollmentDate}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={st.status === 'Active' ? 'emerald' : 'slate'} size="sm">
                          {st.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditStudent(st)}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                            title="Edit Student"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'student', id: st.id, title: st.fullName })}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: INSTRUCTORS CRUD TABLE */}
        {crudActiveTab === 'instructors' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Assigned Tracks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCrudInstructors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No instructors match your query. Click "Add Faculty" to register one.
                    </td>
                  </tr>
                ) : (
                  filteredCrudInstructors.slice(0, 6).map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={inst.profileImage}
                            alt={inst.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-blue-200 dark:ring-blue-900 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {inst.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {inst.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="blue" size="sm">{inst.specialization}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {inst.experienceYears} Years
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                        {inst.assignedCourseIds?.length || 0} courses
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setAssigningInstructor(inst)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="Assign Course"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/instructors/${inst.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Faculty Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditInstructor(inst)}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                            title="Edit Instructor"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'instructor', id: inst.id, title: inst.name })}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Instructor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: ENROLLMENTS CRUD TABLE */}
        {crudActiveTab === 'enrollments' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Enrolled Course</th>
                  <th className="py-3 px-4">Enrollment Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCrudEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No enrollments found. Click "Quick Enroll" to enroll a student into a course.
                    </td>
                  </tr>
                ) : (
                  filteredCrudEnrollments.slice(0, 6).map((enr) => {
                    const st = students.find((s) => s.id === enr.studentId) || INITIAL_STUDENTS.find((s) => s.id === enr.studentId);
                    const cr = courses.find((c) => c.id === enr.courseId) || INITIAL_COURSES.find((c) => c.id === enr.courseId);
                    return (
                      <tr key={enr.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {st?.fullName || 'Maheswari'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {st?.email || 'student@edusphere.com'}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {cr?.title || 'CyberGenius - Inside the Breach'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {cr?.category || 'Cybersecurity'}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {enr.enrollmentDate}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={enr.status === 'Enrolled' ? 'emerald' : enr.status === 'Completed' ? 'blue' : 'slate'} size="sm">
                            {enr.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setDeleteTarget({
                              type: 'enrollment',
                              id: enr.id,
                              title: `${st?.fullName || 'Student'} in ${cr?.title || 'course'}`
                            })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Unenroll</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: INSTRUCTOR PERMISSIONS & CLASS GOVERNANCE */}
        {crudActiveTab === 'permissions' && (
          <div className="space-y-4">
            {/* Governance Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-200 dark:border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#7047EB] dark:text-purple-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Instructor Authorization & Class-Join Guard</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Permissions: Adding Students After Joining Classes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure whether faculty can add students, and enforce the policy requiring students to attend/join live sessions first.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateGlobalPolicy({
                      enforceClassJoinPrerequisite: !globalPolicy.enforceClassJoinPrerequisite,
                    })
                  }
                  className="text-xs"
                >
                  {globalPolicy.enforceClassJoinPrerequisite ? '✓ Prerequisite: Mandatory' : 'Prerequisite: Optional'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/permissions')}
                  className="bg-[#7047EB] hover:bg-[#5E36D9] text-white text-xs"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Full Permissions Page
                </Button>
              </div>
            </div>

            {/* Quick Permissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Can Add Students</th>
                    <th className="py-3 px-4">Class Join Requirement</th>
                    <th className="py-3 px-4">Auto-Enroll on Join</th>
                    <th className="py-3 px-4">Verified Attendees</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {instructorPermissions.map((setting) => {
                    const inst = instructors.find((i) => i.id === setting.instructorId);
                    const attendeesCount = classAttendanceRecords.filter(
                      (r) => r.instructorId === setting.instructorId
                    ).length;

                    return (
                      <tr
                        key={setting.instructorId}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                inst?.profileImage ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                              }
                              alt={setting.instructorName}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <div>
                              <span>{setting.instructorName}</span>
                              <span className="block text-[11px] text-slate-400 font-normal">
                                {setting.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleInstructorCanAddStudents(setting.instructorId)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${setting.canAddStudents
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${setting.canAddStudents ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                            />
                            {setting.canAddStudents ? 'Allowed to Add' : 'Restricted'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleClassJoinRequirement(setting.instructorId)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${setting.requireClassJoinFirst
                                ? 'bg-purple-50 dark:bg-purple-950/50 text-[#7047EB] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              }`}
                          >
                            <ShieldCheck className="w-3 h-3 text-[#7047EB]" />
                            <span>
                              {setting.requireClassJoinFirst
                                ? 'Mandatory: After Joining Classes Only'
                                : 'Unrestricted'}
                            </span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            {setting.autoEnrollOnClassJoin ? 'Active (Auto)' : 'Manual Instructor Approval'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {attendeesCount} Students Joined
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => navigate('/permissions')}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#7047EB] dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
                          >
                            Manage Rules →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN 3-COLUMN DASHBOARD GRID (SCHOOOLI EXACT REPLICA)  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================= */}
        {/* LEFT COLUMN: Class Routine, Star Students, Notifications*/}
        {/* ======================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Class Routine */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Class Routine
                </h2>
                <p className="text-xs text-slate-400">
                  Upcoming Classes & Workshops
                </p>
              </div>

              {/* Routine Dropdown Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const days = ['Today', 'Tomorrow', 'This Week'];
                    const next = days[(days.indexOf(selectedDay) + 1) % days.length];
                    setSelectedDay(next);
                    toast.info(`Filtered routine by: ${next}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 transition-colors"
                >
                  <span>{selectedDay}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    const classes = ['All Classes', 'Class 10', 'Class 11', 'Class 12'];
                    const next = classes[(classes.indexOf(selectedClass) + 1) % classes.length];
                    setSelectedClass(next);
                    toast.info(`Filtered routine by: ${next}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 transition-colors"
                >
                  <span>{selectedClass}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    const sections = ['Section A', 'Section B', 'All Sections'];
                    const next = sections[(sections.indexOf(selectedSection) + 1) % sections.length];
                    setSelectedSection(next);
                    toast.info(`Filtered routine by: ${next}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 transition-colors"
                >
                  <span>{selectedSection}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <Link
                  to="/courses"
                  className="text-xs font-semibold text-[#7047EB] hover:text-[#5E36D9] ml-1"
                >
                  View All
                </Link>
              </div>
            </div>

            {/* Routine Month Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Routine 1: October 2023 */}
              <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    October, 2023
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your October class routine is here
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-blue-100/60 dark:border-blue-900/20">
                  <button
                    onClick={() => toast.success('October class routine PDF downloaded successfully.')}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#7047EB] hover:bg-[#5E36D9] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download routine (pdf)</span>
                  </button>

                  <button
                    onClick={() => setSelectedLiveClass(INITIAL_UPCOMING_CLASSES[0])}
                    className="py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 text-[#7047EB] dark:text-purple-300 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Launch Live Virtual Classroom Session"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </button>
                </div>
              </div>

              {/* Routine 2: November 2023 */}
              <div className="p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    November, 2023
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your November class routine is here
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-100/60 dark:border-amber-900/20">
                  <button
                    onClick={() => toast.success('November class routine PDF downloaded successfully.')}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download routine (pdf)</span>
                  </button>

                  <button
                    onClick={() => setSelectedLiveClass(INITIAL_UPCOMING_CLASSES[1] || INITIAL_UPCOMING_CLASSES[0])}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Launch Live Virtual Classroom Session"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Star Students Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Star Students
              </h2>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-2 px-2 w-8">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Marks</th>
                    <th className="py-2 px-3 text-right">Percent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80 text-xs text-slate-700 dark:text-slate-200">
                  {starStudentsList.map((st) => {
                    const isChecked = selectedStudentIds.includes(st.id);
                    return (
                      <tr
                        key={st.id}
                        onClick={() => toggleStudentSelection(st.id)}
                        className={`group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${isChecked ? 'bg-purple-50/40 dark:bg-purple-950/10' : ''
                          }`}
                      >
                        <td className="py-3 px-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStudentSelection(st.id);
                            }}
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${isChecked
                                ? 'bg-[#7047EB] text-white'
                                : 'border border-slate-300 dark:border-slate-600 text-transparent'
                              }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {st.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {st.studentId}
                        </td>

                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {st.marks}
                        </td>

                        <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                          {st.percent}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Notifications & Activity Stream */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Notifications
                </h2>
                <p className="text-xs text-slate-400">Live Platform Activity</p>
              </div>
              <button
                onClick={() => toast.info('All 12 platform notifications up to date.')}
                className="text-xs font-semibold text-[#7047EB] hover:text-[#5E36D9]"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {/* Notification Item 1 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=100&auto=format&fit=crop&q=80"
                      alt="Closure"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Emergency School Closure
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 4:00 PM
                      </span>
                      <span>&bull;</span>
                      <span>15 Aug</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Notification Item 2 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&auto=format&fit=crop&q=80"
                      alt="Clubs"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      New Extracurricular Clubs
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 4:00 PM
                      </span>
                      <span>&bull;</span>
                      <span>15 Aug</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* CENTER COLUMN: Library, Total Exams, Best Performers   */}
        {/* ======================================================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* Card: Library */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Library
                </h2>
                <p className="text-[11px] text-slate-400">
                  Highest Rated Curriculum Tracks
                </p>
              </div>
              <Link to="/courses" className="text-xs font-semibold text-[#7047EB] hover:text-[#5E36D9]">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {/* Item 1: Literature */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/80 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Literature
                    </p>
                    <p className="text-[10px] text-slate-400">{300 + courses.length} Files</p>
                  </div>
                </div>
                <Link
                  to="/courses"
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#7047EB] transition-colors"
                >
                  Read now
                </Link>
              </div>

              {/* Item 2: Mathematics */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Mathematics
                    </p>
                    <p className="text-[10px] text-slate-400">1072 Files</p>
                  </div>
                </div>
                <Link
                  to="/courses"
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#7047EB] transition-colors"
                >
                  Read now
                </Link>
              </div>

              {/* Item 3: English */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      English
                    </p>
                    <p className="text-[10px] text-slate-400">575 Files</p>
                  </div>
                </div>
                <Link
                  to="/courses"
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#7047EB] transition-colors"
                >
                  Read now
                </Link>
              </div>

              {/* Item 4: Science */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100/80 dark:bg-rose-900/40 text-rose-500 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Science
                    </p>
                    <p className="text-[10px] text-slate-400">249 Files</p>
                  </div>
                </div>
                <Link
                  to="/courses"
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#7047EB] transition-colors"
                >
                  Read now
                </Link>
              </div>
            </div>
          </div>

          {/* Card: Total Exams */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Total Exams
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 text-[10px] font-bold">
                -16.90%
              </span>
            </div>

            <div className="mt-2">
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                256
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Here is your total exams ratio in this month.{' '}
                <button
                  onClick={() => toast.info('Exam reports: 256 scheduled assessments, 94.2% completion rate.')}
                  className="text-[#7047EB] hover:underline font-semibold"
                >
                  Click here to view details
                </button>
              </p>
            </div>
          </div>

          {/* Card: Best Performers */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                Best Performers
              </h2>
              <button
                onClick={() =>
                  setBestPerformersTimeframe((prev) => (prev === 'Weekly' ? 'Monthly' : 'Weekly'))
                }
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span>{bestPerformersTimeframe}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Timeline/Capsule Progress Bars */}
            <div className="space-y-3.5">
              {/* Class 06 - Math (40%) */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 w-12 shrink-0">
                  Class 06
                </span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-5 relative overflow-hidden flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-[#7047EB] rounded-full flex items-center justify-between px-2 text-white text-[10px] font-bold"
                    style={{ width: '65%' }}
                  >
                    <span>Math</span>
                    <span>40%</span>
                  </div>
                </div>
              </div>

              {/* Class 04 - GK (70%) */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 w-12 shrink-0">
                  Class 04
                </span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-5 relative overflow-hidden flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-between px-2 text-white text-[10px] font-bold"
                    style={{ width: '85%' }}
                  >
                    <span>GK</span>
                    <span>70%</span>
                  </div>
                </div>
              </div>

              {/* Class 02 - Science (72%) */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 w-12 shrink-0">
                  Class 02
                </span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-5 relative overflow-hidden flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-between px-2 text-white text-[10px] font-bold"
                    style={{ width: '88%' }}
                  >
                    <span>Science</span>
                    <span>72%</span>
                  </div>
                </div>
              </div>

              {/* Class 01 - English (47%) */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 w-12 shrink-0">
                  Class 01
                </span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-5 relative overflow-hidden flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-between px-2 text-white text-[10px] font-bold"
                    style={{ width: '70%' }}
                  >
                    <span>English</span>
                    <span>47%</span>
                  </div>
                </div>
              </div>

              {/* Days of week footer ticks */}
              <div className="flex justify-between pl-14 pr-2 text-[10px] text-slate-400 pt-1 font-mono">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN: Course Statistics & New Course Banner     */}
        {/* ======================================================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* Card: Course Statistics Donut Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                Course Statistics
              </h2>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Donut Container */}
            <div className="relative flex items-center justify-center my-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  />
                  <Pie
                    data={DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DONUT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Text matching screenshot */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-medium text-slate-400">Total</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {totalCoursesEnrolled}
                </span>
              </div>
            </div>

            {/* Donut Legend below chart */}
            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>Math</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7047eb]" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                <span>Chemistry</span>
              </div>
            </div>
          </div>

          {/* Card: New Course Promo Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white p-5 shadow-lg shadow-indigo-500/10">
            {/* Ambient Background Lights */}
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  New Course
                </span>
                <h3 className="text-sm font-extrabold text-white mt-1 leading-snug">
                  Build your career with API
                </h3>

                <button
                  onClick={() => {
                    navigate('/courses/course-java-1');
                    toast.info('Viewing "Unlock Java Backend Power & REST APIs" masterclass.');
                  }}
                  className="mt-4 px-4 py-1.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Enroll Now
                </button>
              </div>

              {/* 3D API Illustration Box */}
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-inner text-white font-black text-xs tracking-wider border border-white/20">
                <div className="text-center">
                  <p className="text-[9px] text-purple-200">REST</p>
                  <p className="font-extrabold text-sm">API</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE VIRTUAL CLASSROOM SESSION MODAL            */}
      {/* ========================================================= */}
      <Modal
        isOpen={!!selectedLiveClass}
        onClose={() => setSelectedLiveClass(null)}
        title={`Virtual Classroom: ${selectedLiveClass?.title || 'Live Stream Room'}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video flex flex-col justify-between p-4 border border-slate-800">
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Live Broadcast
              </span>
              <span className="text-xs text-white/80 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                {selectedLiveClass?.instructorName || 'Lead Faculty'}
              </span>
            </div>

            {/* Center Video Placeholder */}
            <div className="flex flex-col items-center justify-center text-center space-y-2 z-10">
              <div className="w-16 h-16 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-300">
                <Video className="w-8 h-8" />
              </div>
              <p className="text-white font-semibold text-sm">
                High-Definition Audio & Screen Sharing Active
              </p>
              <p className="text-xs text-slate-400">
                Connected to encrypted WebRTC peer stream
              </p>
            </div>

            {/* Bottom Stream Controls */}
            <div className="flex items-center justify-center gap-3 z-10">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-2.5 rounded-full transition-colors ${isMicMuted ? 'bg-rose-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-2.5 rounded-full transition-colors ${isVideoOff ? 'bg-rose-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                title={isVideoOff ? 'Enable Video' : 'Disable Video'}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={() => handleCopyLink(selectedLiveClass?.roomUrl || window.location.href)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Session Link'}</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLiveClass(null)}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  window.open(selectedLiveClass?.roomUrl || '#', '_blank');
                  setSelectedLiveClass(null);
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Launch Fullscreen Room
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Admin Profile Update Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Update Administrator Profile"
        description="Modify administrator credentials, display name, and avatar across EduSphere."
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40">
            <img
              src={profileForm.avatarUrl || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={profileForm.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400 shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{profileForm.name || 'Administrator'}</p>
              <p className="text-[11px] text-[#7047EB] dark:text-purple-400 font-semibold uppercase tracking-wider">Super Administrator</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. Dr. Alex Mercer"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. admin@edusphere.edu"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department / Office
            </label>
            <input
              type="text"
              value={profileForm.department}
              onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. Academic Registry"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={profileForm.avatarUrl}
              onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-[#7047EB] hover:bg-[#5e38d4]"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Course Modal (Create & Edit) */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSaveCourse}
        initialCourse={editingCourse}
      />

      {/* Student Modal (Create & Edit) */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSaveStudent}
        initialStudent={editingStudent}
      />

      {/* Instructor Modal (Create & Edit) */}
      <InstructorModal
        isOpen={isInstructorModalOpen}
        onClose={() => {
          setIsInstructorModalOpen(false);
          setEditingInstructor(null);
        }}
        onSubmit={handleSaveInstructor}
        initialInstructor={editingInstructor}
      />

      {/* Assign Course Modal */}
      <AssignCourseModal
        isOpen={!!assigningInstructor}
        onClose={() => setAssigningInstructor(null)}
        instructor={assigningInstructor}
        onAssign={handleAssignCourseSubmit}
      />

      {/* Quick Enrollment Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Quick Student Enrollment"
        description="Select a registered student and catalog course to create an active institutional enrollment."
      >
        <form onSubmit={handleQuickEnrollSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student
            </label>
            <select
              value={enrollStudentId}
              onChange={(e) => setEnrollStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7047EB]"
              required
            >
              <option value="">-- Choose Student --</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Course
            </label>
            <select
              value={enrollCourseId}
              onChange={(e) => setEnrollCourseId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7047EB]"
              required
            >
              <option value="">-- Choose Course --</option>
              {courses.map((crs) => (
                <option key={crs.id} value={crs.id}>
                  {crs.title} ({crs.category})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEnrollModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-[#7047EB] hover:bg-[#5e38d4]"
            >
              Confirm Enrollment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Record Deletion"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action will remove the record from the institutional registry.`}
      >
        <div className="flex justify-end gap-2.5 pt-4">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Delete Record
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
