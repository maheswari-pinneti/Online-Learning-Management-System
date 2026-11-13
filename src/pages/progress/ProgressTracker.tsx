import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  BookOpen,
  Search,
  CheckSquare,
  Square,
  Award,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useEnrollment } from '@/context/EnrollmentContext';
import { useCourses } from '@/context/CourseContext';
import { useStudents } from '@/context/StudentContext';
import { useLearning } from '@/context/LearningContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatPercentage } from '@/utils/formatters';
import { Course, Student, Enrollment } from '@/types';

export const ProgressTracker: React.FC = () => {
  const { enrollments } = useEnrollment();
  const { courses } = useCourses();
  const { students } = useStudents();
  const { toggleLessonCompletion } = useLearning();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('All');
  const [activeCourseModal, setActiveCourseModal] = useState<{
    enrollment: Enrollment;
    course: Course;
    student: Student;
  } | null>(null);

  // Overall platform completion metrics
  const totalEnrolledRecords = enrollments.length;
  const totalProgressSum = enrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0);
  const averagePlatformProgress = totalEnrolledRecords > 0 ? Math.round(totalProgressSum / totalEnrolledRecords) : 0;
  const completedCount = enrollments.filter((e) => e.status === 'Completed').length;

  // Filtered progress rows
  const progressRows = useMemo(() => {
    return enrollments
      .map((enr) => {
        const student = students.find((s) => s.id === enr.studentId);
        const course = courses.find((c) => c.id === enr.courseId);
        if (!student || !course) return null;

        const totalLessons = course.lessons?.length || course.totalLessons || 1;
        const completedLessons = enr.completedLessons || [];
        const completedCount = completedLessons.length;
        const pendingCount = Math.max(0, totalLessons - completedCount);
        const percentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));

        return {
          enrollment: enr,
          student,
          course,
          totalLessons,
          completedCount,
          pendingCount,
          percentage,
          completedLessons,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .filter((row) => {
        const matchesSearch =
          row.student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.course.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStudent =
          selectedStudentFilter === 'All' || row.student.id === selectedStudentFilter;

        return matchesSearch && matchesStudent;
      });
  }, [enrollments, students, courses, searchQuery, selectedStudentFilter]);

  const handleToggleLesson = (lessonId: string) => {
    if (!activeCourseModal) return;
    toggleLessonCompletion(
      activeCourseModal.student.id,
      activeCourseModal.course.id,
      lessonId
    );
    toast.success('Lesson progress updated!');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Learning Progress & Milestone Tracker
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor syllabus progress percentages, completed vs pending lessons, and verify certificate eligibility
        </p>
      </div>

      {/* Global Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Average Platform Completion</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatPercentage(averagePlatformProgress)}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">100% Completed Courses</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completedCount}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Learning Tracks</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalEnrolledRecords}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or course..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Students</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Progress Cards / Table */}
      {progressRows.length === 0 ? (
        <EmptyState
          title="No progress records found"
          description="Enroll students into courses to begin tracking their lesson completions and progress percentages."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressRows.map((row) => (
            <Card key={row.enrollment.id} className="p-5 flex flex-col justify-between" hover>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {row.course.title}
                    </h3>
                    <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                      Learner: {row.student.fullName}
                    </p>
                  </div>
                  <Badge
                    variant={row.percentage === 100 ? 'emerald' : row.percentage >= 50 ? 'blue' : 'amber'}
                    size="sm"
                  >
                    {row.percentage === 100 ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>

                {/* Progress Bar & Counters */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {row.percentage}% Completed
                    </span>
                    <span className="text-slate-500">
                      {row.completedCount} / {row.totalLessons} Lessons
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        row.percentage === 100
                          ? 'bg-emerald-500'
                          : row.percentage >= 50
                          ? 'bg-brand-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>{row.pendingCount} pending</span>
                    <span>Category: {row.course.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    setActiveCourseModal({
                      enrollment: row.enrollment,
                      course: row.course,
                      student: row.student,
                    })
                  }
                  leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Inspect & Check Lessons
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Interactive Lesson Checklist Modal */}
      {activeCourseModal && (
        <Modal
          isOpen={!!activeCourseModal}
          onClose={() => setActiveCourseModal(null)}
          title={`Syllabus Progress: ${activeCourseModal.course.title}`}
          description={`Learner: ${activeCourseModal.student.fullName}. Click any lesson checkbox to mark it completed or pending.`}
          maxWidth="lg"
        >
          <div className="space-y-3 py-2">
            {activeCourseModal.course.lessons.map((lesson, idx) => {
              const currentEnrollment = enrollments.find(
                (e) => e.id === activeCourseModal.enrollment.id
              );
              const isChecked = (currentEnrollment?.completedLessons || []).includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleToggleLesson(lesson.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-brand-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-brand-600 focus:outline-none"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isChecked
                            ? 'text-emerald-900 dark:text-emerald-200 line-through'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {idx + 1}. {lesson.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lesson.content}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {lesson.durationMinutes}m
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="primary" onClick={() => setActiveCourseModal(null)}>
              Done
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
