import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  UserCheck,
  CheckCircle,
  PlusCircle,
  UserPlus,
  BarChart3,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  PieChart as PieChartIcon,
  TrendingUp,
  Mic,
  MicOff,
  VideoOff,
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
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { INITIAL_UPCOMING_CLASSES, INITIAL_ACTIVITIES } from '@/utils/mockData';
import { formatDate, formatPercentage, formatCurrency } from '@/utils/formatters';
import { UpcomingClass, ActivityItem } from '@/types';

const CHART_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6'];

const MONTHLY_ANALYTICS = [
  { month: 'Nov', enrollments: 45, completions: 22, activeLearners: 50 },
  { month: 'Dec', enrollments: 62, completions: 35, activeLearners: 74 },
  { month: 'Jan', enrollments: 88, completions: 48, activeLearners: 95 },
  { month: 'Feb', enrollments: 110, completions: 64, activeLearners: 120 },
  { month: 'Mar', enrollments: 135, completions: 89, activeLearners: 152 },
  { month: 'Apr', enrollments: 168, completions: 114, activeLearners: 185 },
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { students } = useStudents();
  const { instructors } = useInstructors();
  const { enrollments } = useEnrollment();

  // Modal State for Live Session
  const [selectedLiveClass, setSelectedLiveClass] = useState<UpcomingClass | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Analytics Tab State
  const [activeChartTab, setActiveChartTab] = useState<'trends' | 'categories'>('trends');

  // Activity Feed Filter State
  const [activityFilter, setActivityFilter] = useState<'all' | 'enrollment' | 'course' | 'assessment'>('all');

  // Metrics
  const totalCourses = courses.length;
  const totalStudents = students.length;
  const activeStudentsCount = students.filter((s) => s.status === 'Active').length || totalStudents;
  const totalInstructors = instructors.length;

  const totalProgress = enrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0);
  const averageCompletionRate =
    enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

  const facultyAvgRating = useMemo(() => {
    if (instructors.length === 0) return 5.0;
    const sum = instructors.reduce((acc, i) => acc + (i.rating || 0), 0);
    return Number((sum / instructors.length).toFixed(2));
  }, [instructors]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.category)));
  }, [courses]);

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
      {/* 1. EXECUTIVE WELCOME BANNER                                */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-accent-700 text-white p-6 sm:p-8 shadow-xl shadow-brand-500/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Institutional Executive Core</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Administrator'}!
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-brand-100 leading-relaxed max-w-xl">
              Executive control center. Monitor institutional KPIs, oversee academic curriculum, manage student enrollments, and track system health.
            </p>
          </div>
        </div>

        <div className="absolute right-0 -bottom-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-10 w-48 h-48 bg-accent-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* 2. EXECUTIVE KPI CARDS                                     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Learners */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Learners
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {totalStudents}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> Live
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{activeStudentsCount} Active Learners</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.min(100, Math.round((totalStudents / 100) * 100))}% of 100 Goal
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalStudents / 100) * 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Metric 2: Completion Rate */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Completion Velocity
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {formatPercentage(averageCompletionRate)}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> Rate
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Target: 75% Average</span>
              <span
                className={`font-semibold ${
                  averageCompletionRate >= 75 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {averageCompletionRate >= 75
                  ? 'Exceeding Benchmark'
                  : `${75 - averageCompletionRate}% below target`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${averageCompletionRate}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Metric 3: Active Curriculum Tracks */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Curriculum Tracks
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {totalCourses}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded">
                  Catalog
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{uniqueCategories.length} Disciplines</span>
              <span className="font-semibold text-brand-600">Accredited Tracks</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCourses / 20) * 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Metric 4: Faculty Net Rating */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Faculty Net Rating
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
              <span>{totalInstructors} Verified Experts</span>
              <span className="font-semibold text-purple-600">Top Tier Faculty</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(facultyAvgRating / 5) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* 3. EXECUTIVE ACTIONS                                       */}
      {/* ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Executive Administrative Actions
          </h2>
          <span className="text-xs text-slate-400">
            Direct institutional shortcuts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/courses" className="block">
            <Card className="p-4 flex items-center gap-3 group" hover>
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Add Course
                </p>
                <p className="text-[11px] text-slate-400">Curate curriculum</p>
              </div>
            </Card>
          </Link>

          <Link to="/enrollment" className="block">
            <Card className="p-4 flex items-center gap-3 group" hover>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Enroll Student
                </p>
                <p className="text-[11px] text-slate-400">Assign course seat</p>
              </div>
            </Card>
          </Link>

          <Link to="/students" className="block">
            <Card className="p-4 flex items-center gap-3 group" hover>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Manage Students
                </p>
                <p className="text-[11px] text-slate-400">Directory CRUD</p>
              </div>
            </Card>
          </Link>

          <Link to="/reports" className="block">
            <Card className="p-4 flex items-center gap-3 group" hover>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  View Analytics
                </p>
                <p className="text-[11px] text-slate-400">Executive report</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

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
                  <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#enrollmentGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  name="Graduated Completions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#completionGrad)"
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
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-white">
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Live Broadcast
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-slate-300">
                  HD 1080p
                </span>
              </div>

              <div className="absolute top-3 right-3 text-[11px] font-medium text-slate-300 bg-black/60 px-2.5 py-1 rounded-md">
                {selectedLiveClass.durationMinutes} mins session
              </div>

              <div className="flex flex-col items-center gap-3 text-center z-10 px-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-2xl font-bold ring-4 ring-white/20">
                    {selectedLiveClass.instructorName.slice(0, 1)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">
                    {selectedLiveClass.instructorName}
                  </h4>
                  <p className="text-xs text-slate-400">Host • Presenting Course Audio & Screen</p>
                </div>
                <div className="flex items-center gap-1 h-4">
                  <span className="w-1 h-3 bg-brand-400 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  <span className="w-1 h-4 bg-brand-400 rounded-full animate-bounce [animation-delay:0.45s]" />
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      isMicMuted ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      isVideoOff ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={isVideoOff ? 'Start camera' : 'Stop camera'}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[11px] text-slate-300">
                  Virtual Room ID:{' '}
                  <span className="font-mono text-brand-300">
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
          </div>
        </Modal>
      )}
    </div>
  );
};
