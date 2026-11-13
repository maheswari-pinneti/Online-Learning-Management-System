import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Download, Users, GraduationCap, TrendingUp, Award, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCourses } from '@/context/CourseContext';
import { useStudents } from '@/context/StudentContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency } from '@/utils/formatters';

const MONTHLY_DATA = [
  { month: 'Jan', enrollments: 45, completions: 18, revenue: 4200 },
  { month: 'Feb', enrollments: 68, completions: 29, revenue: 6450 },
  { month: 'Mar', enrollments: 89, completions: 42, revenue: 8900 },
  { month: 'Apr', enrollments: 112, completions: 64, revenue: 11200 },
  { month: 'May', enrollments: 145, completions: 85, revenue: 14900 },
  { month: 'Jun', enrollments: 178, completions: 110, revenue: 18200 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export const ReportsAnalytics: React.FC = () => {
  const { courses } = useCourses();
  const { students } = useStudents();
  const { enrollments } = useEnrollment();

  const totalCourses = courses.length;
  const totalStudents = students.length;
  const activeEnrollments = enrollments.length;
  const estimatedRevenue = courses.reduce((acc, c) => acc + c.price * 5, 0);

  // Category Distribution
  const categoryCounts: Record<string, number> = {};
  courses.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const topRatedCourses = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const handleExportCSV = () => {
    const headers = 'Course Title,Category,Instructor,Price,Rating,Enrollments\n';
    const rows = courses
      .map(
        (c) =>
          `"${c.title}","${c.category}","${c.instructorName}",${c.price},${c.rating},${
            enrollments.filter((e) => e.courseId === c.id).length
          }`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `edusphere_analytics_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics CSV report exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Institutional Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time enrollment trends, revenue velocity, category distributions, and course evaluations
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Active Learners</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{totalStudents}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">↑ 18% month over month</p>
        </Card>

        <Card className="p-4" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Live Curriculum Tracks</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{totalCourses}</p>
          <p className="text-[11px] text-brand-600 font-medium mt-0.5">Across 6 faculty domains</p>
        </Card>

        <Card className="p-4" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Course Enrollments</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {activeEnrollments}
          </p>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">Verified enrollments</p>
        </Card>

        <Card className="p-4" hover>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Gross Estimated Revenue</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(estimatedRevenue)}
          </p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Platform catalog value</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Enrollments vs Completions Bar Chart (2 Cols) */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Monthly Enrollment & Completion Velocity
            </h3>
            <Badge variant="blue" size="sm">
              2026 Trend
            </Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="enrollments" fill="#10b981" name="New Enrollments" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completions" fill="#3b82f6" name="Course Completions" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown Donut Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Curriculum by Category
            </h3>
            <Badge variant="emerald" size="sm">
              Distribution
            </Badge>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Monthly Revenue Velocity Line Chart & Top Courses Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Monthly Platform Revenue Growth
            </h3>
            <Badge variant="amber" size="sm">
              Financial Metric
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Rated Courses Leaderboard */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Top Rated Leaderboard
            </h3>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {topRatedCourses.map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {c.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{c.instructorName}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <span className="font-bold text-amber-500">⭐ {c.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
