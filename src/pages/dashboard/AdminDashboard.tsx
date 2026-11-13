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
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { INITIAL_UPCOMING_CLASSES } from '@/utils/mockData';
import { UpcomingClass } from '@/types';

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
  const { user } = useAuth();
  const { courses } = useCourses();
  const { students } = useStudents();
  const { instructors } = useInstructors();
  const { enrollments } = useEnrollment();
  const navigate = useNavigate();

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
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || 'Administrator'}.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Navigate the future of education with Schoooli &bull;{' '}
            <span className="font-semibold text-[#7047EB]">Institutional Learning Analytics</span>
          </p>
        </div>

        {/* Right: 3 Metric Cards side-by-side */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:min-w-[580px]">
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
      {/* 2. MAIN 3-COLUMN DASHBOARD GRID (SCHOOOLI EXACT REPLICA)  */}
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
                        className={`group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                          isChecked ? 'bg-purple-50/40 dark:bg-purple-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStudentSelection(st.id);
                            }}
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              isChecked
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
                className={`p-2.5 rounded-full transition-colors ${
                  isMicMuted ? 'bg-rose-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-2.5 rounded-full transition-colors ${
                  isVideoOff ? 'bg-rose-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'
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
    </div>
  );
};

export default AdminDashboard;
