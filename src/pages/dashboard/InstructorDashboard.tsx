import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  UserCheck,
  BarChart3,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Sparkles,
  FileCheck2,
  LineChart as LineChartIcon,
  Copy,
  Check,
  PieChart as PieChartIcon,
  TrendingUp,
  Mic,
  MicOff,
  VideoOff,
  Edit3,
  Plus,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/context/CourseContext';
import { useStudents } from '@/context/StudentContext';
import { useInstructors } from '@/context/InstructorContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { useLearning } from '@/context/LearningContext';
import { usePermissions } from '@/context/PermissionContext';
import { CourseModal } from '@/pages/courses/CourseModal';
import { CourseFormData } from '@/utils/validators';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { INITIAL_UPCOMING_CLASSES, INITIAL_ACTIVITIES } from '@/utils/mockData';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { UpcomingClass, ActivityItem, AssignmentSubmission, ClassAttendanceRecord } from '@/types';

const CHART_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6'];

const MONTHLY_ANALYTICS = [
  { month: 'Nov', enrollments: 45, completions: 22, activeLearners: 50 },
  { month: 'Dec', enrollments: 62, completions: 35, activeLearners: 74 },
  { month: 'Jan', enrollments: 88, completions: 48, activeLearners: 95 },
  { month: 'Feb', enrollments: 110, completions: 64, activeLearners: 120 },
  { month: 'Mar', enrollments: 135, completions: 89, activeLearners: 152 },
  { month: 'Apr', enrollments: 168, completions: 114, activeLearners: 185 },
];

export const InstructorDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { courses, addCourse } = useCourses();
  const { students } = useStudents();
  const { instructors } = useInstructors();
  const { enrollments, enrollStudent } = useEnrollment();
  const { assignmentSubmissions, quizSubmissions, assignments, gradeAssignment } = useLearning();
  const {
    canInstructorAddStudent,
    classAttendanceRecords,
    markStudentAddedToRoster,
    recordStudentJoinedClass,
  } = usePermissions();

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Prof. Marcus Chen',
    email: user?.email || 'instructor@edusphere.edu',
    avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    specialization: 'Senior Cybersecurity & Cloud Faculty',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Please enter a valid faculty name.');
      return;
    }
    updateProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      avatarUrl: profileForm.avatarUrl.trim() || undefined,
    });
    toast.success('Faculty profile updated successfully!');
    setIsProfileModalOpen(false);
  };

  // Add Course Modal State
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  const handleCreateCourse = (data: CourseFormData) => {
    addCourse({
      ...data,
      instructorId: user?.id || data.instructorId || 'inst-1',
    });
    toast.success(`Course "${data.title}" successfully created and added to your teaching catalog!`);
    setIsAddCourseModalOpen(false);
  };

  // Inline Grading Modal State
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradingMarks, setGradingMarks] = useState<number | string>('');
  const [gradingFeedback, setGradingFeedback] = useState('');

  const handleOpenGradingModal = (sub: AssignmentSubmission) => {
    const asg = assignments.find((a) => a.id === sub.assignmentId);
    setGradingSubmission(sub);
    setGradingMarks(sub.obtainedMarks !== undefined ? sub.obtainedMarks : (asg?.totalMarks || 50));
    setGradingFeedback(sub.feedback || 'Well-structured implementation demonstrating sound technical approach. Approved.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    const asg = assignments.find((a) => a.id === gradingSubmission.assignmentId);
    const maxMarks = asg?.totalMarks || 100;
    const marksNum = Number(gradingMarks);

    if (isNaN(marksNum) || marksNum < 0 || marksNum > maxMarks) {
      toast.error(`Please enter valid marks between 0 and ${maxMarks}.`);
      return;
    }

    if (!gradingFeedback.trim()) {
      toast.error('Please provide constructive review feedback.');
      return;
    }

    gradeAssignment(gradingSubmission.id, marksNum, gradingFeedback.trim());
    toast.success(`Graded ${gradingSubmission.studentName}'s submission: awarded ${marksNum}/${maxMarks} marks!`);
    setGradingSubmission(null);
  };

  // Modal State for Live Session
  const [selectedLiveClass, setSelectedLiveClass] = useState<UpcomingClass | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Attendees who joined this live session (Class Joining Verification)
  const liveClassAttendees = useMemo(() => {
    if (!selectedLiveClass) return [];
    return classAttendanceRecords.filter(
      (r) =>
        r.courseTitle.toLowerCase().includes(selectedLiveClass.courseName.toLowerCase()) ||
        r.classSessionTitle.toLowerCase().includes(selectedLiveClass.title.toLowerCase()) ||
        r.instructorName.toLowerCase().includes(selectedLiveClass.instructorName.toLowerCase())
    );
  }, [selectedLiveClass, classAttendanceRecords]);

  // Handle adding student to roster after joining class
  const handleAddAttendeeToRoster = (att: ClassAttendanceRecord) => {
    const instructorId = user?.id || 'inst-4';
    const check = canInstructorAddStudent(instructorId, att.studentId, att.courseId);

    if (!check.allowed) {
      toast.error(check.reason || 'Instructor not authorized to add students.');
      return;
    }

    try {
      enrollStudent(att.studentId, att.courseId);
      markStudentAddedToRoster(att.id);
      toast.success(`Enrolled ${att.studentName} into ${att.courseTitle} after class attendance!`);
    } catch (err: any) {
      markStudentAddedToRoster(att.id);
      toast.info(err?.message || 'Student is already enrolled.');
    }
  };

  // Simulate admitting a new student to this live class session
  const handleAdmitWaitingStudent = () => {
    if (!selectedLiveClass) return;
    const waitingStudent =
      students.find(
        (s) => !liveClassAttendees.some((att) => att.studentId === s.id)
      ) || students[0];

    if (!waitingStudent) {
      toast.info('All registered students have already joined this session!');
      return;
    }

    const targetCourse =
      courses.find((c) => c.title.toLowerCase().includes(selectedLiveClass.courseName.toLowerCase())) ||
      courses[0];

    recordStudentJoinedClass({
      studentId: waitingStudent.id,
      studentName: waitingStudent.fullName,
      studentEmail: waitingStudent.email,
      instructorId: user?.id || 'inst-4',
      instructorName: selectedLiveClass.instructorName,
      courseId: targetCourse?.id || 'course-cyber-1',
      courseTitle: selectedLiveClass.courseName,
      classSessionTitle: selectedLiveClass.title,
    });
  };

  // Analytics Tab State
  const [activeChartTab, setActiveChartTab] = useState<'trends' | 'categories'>('trends');

  // Activity Feed Filter State
  const [activityFilter, setActivityFilter] = useState<'all' | 'enrollment' | 'course' | 'assessment'>('all');

  // Instructor-specific calculations
  const instructorAssignedCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        c.instructorId === user?.id ||
        (user?.assignedCourseIds || []).includes(c.id) ||
        (user?.name && c.instructorName.toLowerCase().includes(user.name.toLowerCase()))
    );
  }, [courses, user]);

  const instructorCourseIds = useMemo(() => {
    return new Set(instructorAssignedCourses.map((c) => c.id));
  }, [instructorAssignedCourses]);

  const instructorEnrollments = useMemo(() => {
    return enrollments.filter((e) => instructorCourseIds.has(e.courseId));
  }, [enrollments, instructorCourseIds]);

  const instructorStudentCount = useMemo(() => {
    const studentIds = new Set(instructorEnrollments.map((e) => e.studentId));
    return studentIds.size;
  }, [instructorEnrollments]);

  const pendingSubmissions = useMemo(() => {
    return assignmentSubmissions.filter((s) => s.status === 'Submitted');
  }, [assignmentSubmissions]);

  const completedCohortCount = useMemo(() => {
    return instructorEnrollments.filter((e) => e.status === 'Completed').length;
  }, [instructorEnrollments]);

  const facultyAvgRating = useMemo(() => {
    if (instructors.length === 0) return 5.0;
    const match = instructors.find((i) => i.id === user?.id || i.email === user?.email);
    if (match && match.rating) return match.rating;
    const sum = instructors.reduce((acc, i) => acc + (i.rating || 0), 0);
    return Number((sum / instructors.length).toFixed(2));
  }, [instructors, user]);

  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [courses]);

  const topCourses = useMemo(() => {
    return [...courses].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [courses]);

  const combinedActivities = useMemo(() => {
    const list: ActivityItem[] = [...INITIAL_ACTIVITIES];

    courses
      .filter((c) => c.isCustom)
      .slice(0, 2)
      .forEach((c) => {
        list.unshift({
          id: `act-course-${c.id}`,
          type: 'course_created',
          title: 'Curriculum Course Added',
          description: `"${c.title}" was added to ${c.category} category.`,
          timestamp: 'Just recently',
        });
      });

    enrollments.slice(-2).forEach((e) => {
      const st = students.find((s) => s.id === e.studentId);
      const cr = courses.find((c) => c.id === e.courseId);
      if (st && cr) {
        list.unshift({
          id: `act-enr-${e.id}`,
          type: 'enrollment',
          title: 'Course Enrollment',
          description: `${st.fullName} enrolled in "${cr.title}".`,
          timestamp: 'Recent session',
        });
      }
    });

    return list;
  }, [courses, enrollments, students]);

  const filteredActivities = useMemo(() => {
    if (activityFilter === 'all') return combinedActivities;
    if (activityFilter === 'enrollment') {
      return combinedActivities.filter((a) => a.type === 'enrollment');
    }
    if (activityFilter === 'course') {
      return combinedActivities.filter((a) => a.type === 'course_created');
    }
    if (activityFilter === 'assessment') {
      return combinedActivities.filter(
        (a) => a.type === 'assignment_submitted' || a.type === 'quiz_completed'
      );
    }
    return combinedActivities;
  }, [activityFilter, combinedActivities]);

  const handleOpenLiveClass = (cls: UpcomingClass) => {
    setSelectedLiveClass(cls);
    setIsCopied(false);
    setIsMicMuted(false);
    setIsVideoOff(false);
  };

  const handleCopyLink = () => {
    if (!selectedLiveClass) return;
    const link =
      selectedLiveClass.roomUrl ||
      `https://classroom.edusphere.edu/room/${selectedLiveClass.id}?token=inst-auth-token-9821`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success('Live classroom link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleLaunchMeeting = () => {
    if (!selectedLiveClass) return;
    toast.info(`Connecting to live stream: ${selectedLiveClass.title}`);
    if (selectedLiveClass.roomUrl && selectedLiveClass.roomUrl.startsWith('http')) {
      window.open(selectedLiveClass.roomUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. FACULTY WELCOME BANNER                                 */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-lg border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-purple-200 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Faculty Academic Hub</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Faculty Studio</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'Prof. Marcus Chen'}!
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Lead Instructor · Distributed Systems & Cloud Infrastructure. Mentor active learners, grade pending cohort submissions, and host interactive live studio lectures.
            </p>

            {/* Quick Human Instructor Shortcuts */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-1">
              <button
                onClick={() => setIsAddCourseModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Course</span>
              </button>
              <button
                onClick={() => {
                  if (INITIAL_UPCOMING_CLASSES.length > 0) {
                    handleOpenLiveClass(INITIAL_UPCOMING_CLASSES[0]);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Video className="w-3.5 h-3.5 text-brand-600" />
                <span>Host Next Live Class</span>
              </button>
              <Link
                to="/assignments"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Review {assignmentSubmissions.length + quizSubmissions.length} Submissions</span>
              </Link>
            </div>
          </div>

          {/* Right: Faculty Profile & Quick Actions with Real Human Photo */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'Prof. Marcus Chen'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/70 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" title="Online & Available" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Prof. Marcus Chen'}</p>
                <p className="text-[11px] text-purple-200">Department of Computer Science</p>
                <p className="text-[10px] text-slate-300">Office Hours: Mon/Wed 2-4 PM</p>
              </div>
            </div>
            <div className="w-full pt-1">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Profile</span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute right-0 -bottom-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* 2. FACULTY KPI CARDS                                      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Assigned Courses */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Teaching Catalog
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {instructorAssignedCourses.length}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded">
                  Assigned Tracks
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Active Curriculum</span>
              <span className="font-semibold text-brand-600">Lead Faculty</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${Math.min(100, instructorAssignedCourses.length * 25)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Metric 2: Enrolled Students */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Enrolled Students
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {instructorStudentCount}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                  Learners
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Across Teaching Catalog</span>
              <span className="font-semibold text-emerald-600">{completedCohortCount} Graduated</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </Card>

        {/* Metric 3: Submissions To Review */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Submissions To Review
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {assignmentSubmissions.length + quizSubmissions.length}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                  Submissions
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Grading Progress</span>
              <span className="font-semibold text-amber-600">Up to date</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </Card>

        {/* Metric 4: Faculty Net Rating */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                My Faculty Rating
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {facultyAvgRating}
                </span>
                <span className="text-xs font-bold text-amber-500">/ 5.0 ⭐</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Student Feedback</span>
              <span className="font-semibold text-purple-600">Premier Tier</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(facultyAvgRating / 5) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* 3. FACULTY ACTIONS                                        */}
      {/* ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Faculty Teaching Actions
          </h2>
          <span className="text-xs text-slate-400">
            Direct teaching shortcuts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="block text-left w-full cursor-pointer"
          >
            <Card className="p-4 flex items-center gap-3 group h-full border-brand-200 dark:border-brand-900/50 bg-gradient-to-br from-brand-50/60 to-white dark:from-brand-950/20 dark:to-slate-900" hover>
              <div className="p-2.5 rounded-xl bg-brand-600 text-white group-hover:scale-105 transition-transform shrink-0 shadow-xs">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Create Course
                </p>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">Author track</p>
              </div>
            </Card>
          </button>

          <Link to="/courses" className="block">
            <Card className="p-4 flex items-center gap-3 group h-full" hover>
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Teaching Catalog
                </p>
                <p className="text-[11px] text-slate-400">Manage tracks</p>
              </div>
            </Card>
          </Link>

          <Link to="/students" className="block">
            <Card className="p-4 flex items-center gap-3 group h-full" hover>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Student Directory
                </p>
                <p className="text-[11px] text-slate-400">View roster</p>
              </div>
            </Card>
          </Link>

          <Link to="/assignments" className="block">
            <Card className="p-4 flex items-center gap-3 group h-full" hover>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Grade Submissions
                </p>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                  {pendingSubmissions.length} Pending
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/progress" className="block">
            <Card className="p-4 flex items-center gap-3 group h-full" hover>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <LineChartIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Cohort Progress
                </p>
                <p className="text-[11px] text-slate-400">Evaluate tracking</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. STUDENT COHORT PROGRESS TRACKING & MILESTONES          */}
      {/* ========================================================= */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-4 h-4 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Student Cohort Learning Progress & Milestones
              </h3>
              <p className="text-[11px] text-slate-400">
                Live syllabus completion and module progress across your assigned teaching tracks
              </p>
            </div>
          </div>
          <Link
            to="/progress"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            Detailed Progress Tracker <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructorAssignedCourses.map((c) => {
            const courseEnr = enrollments.filter((e) => e.courseId === c.id);
            const enrCount = courseEnr.length;
            const completedCount = courseEnr.filter((e) => e.status === 'Completed').length;
            const avgProgress =
              enrCount > 0
                ? Math.round(
                    courseEnr.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) / enrCount
                  )
                : 75;

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3 hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Badge variant="blue" size="sm">
                      {c.category}
                    </Badge>
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
                      {avgProgress}% Cohort Avg
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {c.duration} · {c.level}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{enrCount || 12} Active Learners</span>
                    <span className="text-emerald-600 font-semibold">{completedCount || 5} Graduated</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ========================================================= */}
      {/* 5. PENDING STUDENT SUBMISSIONS TO GRADE                   */}
      {/* ========================================================= */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Pending Student Submissions Awaiting Evaluation
              </h3>
              <p className="text-[11px] text-slate-400">
                Submitted coursework from your active cohorts requiring review, scoring, and rubrics feedback
              </p>
            </div>
          </div>
          <Link
            to="/assignments"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            All Submissions ({assignmentSubmissions.length}) <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              All submissions are evaluated!
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              No student submissions are currently awaiting grading.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSubmissions.slice(0, 2).map((sub) => {
              const asg = assignments.find((a) => a.id === sub.assignmentId);

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-3 hover:border-amber-300 dark:hover:border-amber-700/50 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="amber" size="sm" dot>
                        Needs Review
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        Submitted: {formatDate(sub.submittedAt)}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {asg?.title || 'Coursework Assignment'}
                      </h4>
                      <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                        Student: {sub.studentName}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] max-h-20 overflow-hidden line-clamp-2">
                      {sub.content}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Max: {asg?.totalMarks || 50} pts
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      className="bg-brand-600 hover:bg-brand-700"
                      onClick={() => handleOpenGradingModal(sub)}
                      leftIcon={<Award className="w-3.5 h-3.5" />}
                    >
                      Grade Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ========================================================= */}
      {/* 4. VISUAL ANALYTICS SECTION                                */}
      {/* ========================================================= */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Institutional Learning Analytics
              </h3>
              <p className="text-[11px] text-slate-400">
                Enrollment velocity, cohort completion curves, and curriculum domain split
              </p>
            </div>
          </div>

          <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setActiveChartTab('trends')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeChartTab === 'trends'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Enrollment Trends
            </button>
            <button
              onClick={() => setActiveChartTab('categories')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeChartTab === 'categories'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              Category Share
            </button>
          </div>
        </div>

        {activeChartTab === 'trends' ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="instEnrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="instCompletionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  name="Course Enrollments"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#instEnrollmentGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  name="Graduated Completions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#instCompletionGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 pr-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Curriculum Breakdown by Academic Category
              </h4>
              <div className="space-y-1.5">
                {categoryChartData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {cat.value} {cat.value === 1 ? 'Course' : 'Courses'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ========================================================= */}
      {/* 5. 2-COLUMN: UPCOMING CLASSES + ACTIVITY FEED              */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Upcoming Classes & Workshops
                </h3>
              </div>
              <Badge variant="blue" size="sm" dot>
                Live Stream
              </Badge>
            </div>

            <div className="space-y-3">
              {INITIAL_UPCOMING_CLASSES.map((cls) => (
                <div
                  key={cls.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 gap-3 hover:border-brand-500/30 transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {cls.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-brand-600 dark:text-brand-400">
                        {cls.courseName}
                      </span>
                      <span>•</span>
                      <span>Faculty: {cls.instructorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatDate(cls.dateTime, 'MMM dd, h:mm a')}</span>
                      </div>
                      <span>{cls.durationMinutes} mins duration</span>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Video className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenLiveClass(cls)}
                      className="shadow-xs"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Real Human Teacher Interaction: Student Mentorship & Inquiries */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Student Mentorship & Office Hours Q&A
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Direct academic inquiries and project feedback requests from enrolled students
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
                2 New Questions
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'q-1',
                  student: 'Maheswari',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                  track: 'Cybersecurity Masterclass',
                  time: '25 mins ago',
                  question: 'Could you clarify AWS IAM cross-account trust policies in Lab 3 before our next class?',
                },
                {
                  id: 'q-2',
                  student: 'John Millar',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                  track: 'Cloud Architecture & DevOps',
                  time: '2 hours ago',
                  question: 'Submitted Terraform zero-trust modules. Ready for code review when you have office hours.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.avatar}
                      alt={item.student}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.student}
                        </span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                          {item.track}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        "{item.question}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success(`Replied to ${item.student}. Response sent to student messaging portal!`)}
                    className="self-end sm:self-auto px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex-shrink-0"
                  >
                    Reply in Studio
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Rated Courses Preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Highest Rated Curriculum Tracks
                </h3>
                <p className="text-[11px] text-slate-400">
                  Top performing modules evaluated by active students
                </p>
              </div>
              <Link
                to="/courses"
                className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                View all courses <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topCourses.map((c) => (
                <Link key={c.id} to={`/courses/${c.id}`} className="group block">
                  <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 group-hover:border-brand-500 transition-all flex flex-col h-full justify-between">
                    <div>
                      <div className="relative h-28 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="emerald" size="sm">
                            {c.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-brand-600 transition-colors">
                          {c.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          By {c.instructorName}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                        ⭐ {c.rating.toFixed(1)}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(c.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Platform Activity */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Live Platform Activity
              </h3>
              <Badge variant="slate" size="sm">
                Real-time
              </Badge>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3 text-[11px]">
              <button
                onClick={() => setActivityFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  activityFilter === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActivityFilter('enrollment')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  activityFilter === 'enrollment'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Enrollments
              </button>
              <button
                onClick={() => setActivityFilter('course')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  activityFilter === 'course'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActivityFilter('assessment')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  activityFilter === 'assessment'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Tests
              </button>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {filteredActivities.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No activity found in this category.
                </p>
              ) : (
                filteredActivities.map((act) => (
                  <div key={act.id} className="flex gap-3 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ring-4 ${
                        act.type === 'enrollment'
                          ? 'bg-blue-500 ring-blue-100 dark:ring-blue-950'
                          : act.type === 'quiz_completed'
                          ? 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-950'
                          : act.type === 'assignment_submitted'
                          ? 'bg-purple-500 ring-purple-100 dark:ring-purple-950'
                          : 'bg-brand-500 ring-brand-100 dark:ring-brand-950'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. VIRTUAL CLASSROOM MODAL                                */}
      {/* ========================================================= */}
      {selectedLiveClass && (
        <Modal
          isOpen={!!selectedLiveClass}
          onClose={() => setSelectedLiveClass(null)}
          title={`Virtual Classroom: ${selectedLiveClass.title}`}
          description={`Course: ${selectedLiveClass.courseName} • Conducted by ${selectedLiveClass.instructorName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between text-white shadow-2xl">
              {/* Real Human Professor Video Stream */}
              {!isVideoOff ? (
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&auto=format&fit=crop&q=80"
                  alt={selectedLiveClass.instructorName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3">
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                    alt={selectedLiveClass.instructorName}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-700 shadow-xl"
                  />
                  <p className="text-xs font-semibold text-slate-300">Camera Paused · Audio Streaming Live</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

              {/* Top HUD */}
              <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Live Broadcast
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-slate-200 border border-white/10">
                    HD 1080p
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-200 border border-white/10">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>48 Students Connected</span>
                  </div>
                </div>
              </div>

              {/* Lower HUD: Instructor Info Overlay */}
              <div className="relative z-10 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {selectedLiveClass.instructorName} (Presenting)
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Screen Share: Cloud Architecture & Incident Response Lab
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                  {selectedLiveClass.durationMinutes} mins session
                </div>
              </div>

              {/* Bottom Control Bar */}
              <div className="relative z-10 p-3 bg-gradient-to-t from-black/95 to-transparent flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsMicMuted(!isMicMuted);
                      toast.info(isMicMuted ? 'Microphone unmuted (HD 48kHz)' : 'Microphone muted');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isMicMuted
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                    title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isMicMuted ? 'Muted' : 'Mic On'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsVideoOff(!isVideoOff);
                      toast.info(isVideoOff ? 'Webcam video started' : 'Webcam video stopped');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isVideoOff
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                    title={isVideoOff ? 'Start camera' : 'Stop camera'}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    <span>{isVideoOff ? 'Cam Off' : 'Cam On'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-300">
                  Virtual Room ID:{' '}
                  <span className="font-mono text-purple-300 font-bold">
                    {selectedLiveClass.id.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Scheduled Time:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(selectedLiveClass.dateTime, 'MMMM dd, yyyy · h:mm a')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Interactive Features:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Audio, Video, Screen Share & Live Q&A
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={handleCopyLink}
                >
                  {isCopied ? 'Link Copied!' : 'Copy Session Link'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLiveClass(null)}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    onClick={handleLaunchMeeting}
                  >
                    Launch Fullscreen Room
                  </Button>
                </div>
              </div>
            </div>

            {/* Joined Students & Instructor Addition Panel (After Joining Classes) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Students in Live Class Session ({liveClassAttendees.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    Admin Policy: Add After Joining
                  </span>
                  <button
                    onClick={handleAdmitWaitingStudent}
                    className="text-[11px] font-bold text-[#7047EB] dark:text-purple-400 hover:underline"
                  >
                    + Admit Student from Lobby
                  </button>
                </div>
              </div>

              {liveClassAttendees.length === 0 ? (
                <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-400">
                  No students currently logged in this room yet. Click "Admit Student from Lobby" above to simulate a student joining!
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {liveClassAttendees.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#7047EB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {att.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">
                            {att.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400">{att.studentEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Joined Class
                        </span>
                        {att.addedToRoster ? (
                          <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5">
                            ✓ On Course Roster
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddAttendeeToRoster(att)}
                            className="px-3 py-1 rounded-lg bg-[#7047EB] hover:bg-[#5E36D9] text-white text-[11px] font-bold shadow-xs transition-transform active:scale-95"
                          >
                            + Add to Roster
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Instructor Profile Update Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Update Faculty Profile"
        description="Update your faculty profile, teaching specialization, and avatar credentials."
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-950/30 rounded-2xl border border-brand-100 dark:border-brand-900/40">
            <img
              src={profileForm.avatarUrl || user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
              alt={profileForm.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-400 shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{profileForm.name || 'Faculty Member'}</p>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider">Faculty & Mentor</p>
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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Prof. Sarah Jenkins"
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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. s.jenkins@edusphere.edu"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Specialization
            </label>
            <input
              type="text"
              value={profileForm.specialization}
              onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Cloud Security & Cryptography"
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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              className="bg-brand-600 hover:bg-brand-700"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create / Add Course Modal for Faculty */}
      <CourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onSubmit={handleCreateCourse}
      />

      {/* Faculty Inline Grading Modal */}
      {gradingSubmission && (
        <Modal
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          title={`Grade Submission · ${gradingSubmission.studentName}`}
          description={`Course: ${
            assignments.find((a) => a.id === gradingSubmission.assignmentId)?.courseName || 'Cloud Architecture'
          }`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveGrade} className="space-y-4 py-1">
            <div className="flex items-center justify-between p-3.5 bg-brand-50 dark:bg-brand-950/30 rounded-2xl border border-brand-100 dark:border-brand-900/40 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {gradingSubmission.studentName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{gradingSubmission.studentName}</p>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 font-mono">ID: {gradingSubmission.studentId}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Submitted On</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatDate(gradingSubmission.submittedAt)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Student Submitted Work / Repository
              </label>
              <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs max-h-36 overflow-y-auto whitespace-pre-wrap border border-slate-800">
                {gradingSubmission.content}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Marks Awarded (Max: {assignments.find((a) => a.id === gradingSubmission.assignmentId)?.totalMarks || 50})
              </label>
              <input
                type="number"
                min={0}
                max={assignments.find((a) => a.id === gradingSubmission.assignmentId)?.totalMarks || 100}
                value={gradingMarks}
                onChange={(e) => setGradingMarks(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Review & Constructive Feedback
              </label>
              <textarea
                rows={3}
                value={gradingFeedback}
                onChange={(e) => setGradingFeedback(e.target.value)}
                placeholder="Write actionable comments, code critique, and rubric evaluation for the student..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setGradingSubmission(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-brand-600 hover:bg-brand-700" leftIcon={<Award className="w-3.5 h-3.5" />}>
                Record Grade & Save
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
