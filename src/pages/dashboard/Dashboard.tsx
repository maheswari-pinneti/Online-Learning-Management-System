import React from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/context/CourseContext';
import { useStudents } from '@/context/StudentContext';
import { useInstructors } from '@/context/InstructorContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { INITIAL_UPCOMING_CLASSES, INITIAL_ACTIVITIES } from '@/utils/mockData';
import { formatDate, formatPercentage } from '@/utils/formatters';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { students } = useStudents();
  const { instructors } = useInstructors();
  const { enrollments } = useEnrollment();

  // Dynamic calculations from context
  const totalCourses = courses.length;
  const totalStudents = students.length;
  const totalInstructors = instructors.length;
  const enrolledCount = enrollments.filter((e) => e.status === 'Enrolled').length;
  const completedCount = enrollments.filter((e) => e.status === 'Completed').length;

  const totalProgress = enrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0);
  const averageCompletionRate =
    enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

  const topCourses = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-accent-700 text-white p-6 sm:p-8 shadow-lg shadow-brand-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>EduSphere Intelligence Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Administrator'}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-brand-100 leading-relaxed">
            Institutional executive overview. Manage academic courses, track live KPI targets,
            evaluate student completions, and review real-time platform activity.
          </p>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute right-0 -bottom-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Executive Metric Cards with Targets, Deltas, & Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Enrolled Students */}
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
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.2%
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Target: 100 Learners</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.min(100, Math.round((totalStudents / 100) * 100))}% of Goal
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, (totalStudents / 100) * 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* KPI 2: Course Completion Rate */}
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
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +6.5%
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
              <span className="font-semibold text-emerald-600">Exceeding Benchmark</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${averageCompletionRate}%` }}
              />
            </div>
          </div>
        </Card>

        {/* KPI 3: Live Curriculum Modules */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Catalog
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {totalCourses}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded">
                  6 Domains
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{enrolledCount} active tracks</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {completedCount} completed
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </Card>

        {/* KPI 4: Faculty Quality Rating */}
        <Card className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Faculty Net Rating
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  4.92
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
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '98%' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
          Quick Administrative Actions
        </h2>
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
                <p className="text-[11px] text-slate-400">Recharts report</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Split: Upcoming Classes & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Classes */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Upcoming Classes & Workshops
                </h3>
              </div>
              <Badge variant="blue" size="sm">
                Live Stream
              </Badge>
            </div>

            <div className="space-y-3">
              {INITIAL_UPCOMING_CLASSES.map((cls) => (
                <div
                  key={cls.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {cls.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{cls.courseName}</span>
                      <span>•</span>
                      <span>Faculty: {cls.instructorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatDate(cls.dateTime, 'MMM dd, h:mm a')}</span>
                      </div>
                      <span>{cls.durationMinutes} mins</span>
                    </div>

                    <a
                      href={cls.roomUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Rated Courses Preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Highest Rated Curriculum Tracks
              </h3>
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
                  <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 group-hover:border-brand-500 transition-all">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-3">
                      <Badge variant="emerald" size="sm" className="mb-1.5">
                        {c.category}
                      </Badge>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-brand-600 transition-colors">
                        {c.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                        <span>⭐ {c.rating.toFixed(1)}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          ${c.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
              Live Platform Activity
            </h3>

            <div className="space-y-4">
              {INITIAL_ACTIVITIES.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0 ring-4 ring-brand-100 dark:ring-brand-950" />
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
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
