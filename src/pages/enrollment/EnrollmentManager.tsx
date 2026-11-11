import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  BookOpen,
  Calendar,
  Trash2,
  Search,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useEnrollment } from '@/context/EnrollmentContext';
import { useStudents } from '@/context/StudentContext';
import { useCourses } from '@/context/CourseContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/feedback/EmptyState';
import { formatDate } from '@/utils/formatters';

export const EnrollmentManager: React.FC = () => {
  const { enrollments, enrollStudent, unenrollStudent, isStudentEnrolled } = useEnrollment();
  const { students } = useStudents();
  const { courses } = useCourses();

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState<string | null>(null);

  // Stats
  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter((e) => e.status === 'Enrolled').length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'Completed').length;

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) {
      toast.error('Please select both a student and a course.');
      return;
    }

    if (isStudentEnrolled(selectedStudentId, selectedCourseId)) {
      toast.warning('Duplicate Enrollment Blocked: This student is already enrolled in this course.');
      return;
    }

    try {
      enrollStudent(selectedStudentId, selectedCourseId);
      const student = students.find((s) => s.id === selectedStudentId);
      const course = courses.find((c) => c.id === selectedCourseId);
      toast.success(
        `Successfully enrolled ${student?.fullName || 'student'} into ${course?.title || 'course'}!`
      );
      setIsEnrollModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Enrollment failed.';
      toast.error(msg);
    }
  };

  const confirmUnenroll = () => {
    if (deletingEnrollmentId) {
      unenrollStudent(deletingEnrollmentId);
      setDeletingEnrollmentId(null);
      toast.success('Enrollment removed successfully.');
    }
  };

  // Enriched enrollment records with student and course metadata
  const enrichedEnrollments = useMemo(() => {
    return enrollments
      .map((enr) => {
        const student = students.find((s) => s.id === enr.studentId);
        const course = courses.find((c) => c.id === enr.courseId);
        return {
          ...enr,
          studentName: student?.fullName || 'Unknown Student',
          studentEmail: student?.email || 'N/A',
          courseTitle: course?.title || 'Unknown Course',
          courseCategory: course?.category || 'General',
          courseThumbnail: course?.thumbnail || '',
        };
      })
      .filter((item) => {
        return (
          item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  }, [enrollments, students, courses, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Course Enrollment Administration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Assign students to courses, prevent duplicate enrollments, and track seat completions
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsEnrollModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          New Enrollment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Enrollments</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalEnrollments}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Active In-Progress</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{activeEnrollments}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Completed Graduates</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {completedEnrollments}
            </p>
          </div>
        </Card>
      </div>

      {/* Search Input */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or enrolled course..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </Card>

      {/* Enrollments Table */}
      {enrichedEnrollments.length === 0 ? (
        <EmptyState
          title="No enrollments to display"
          description="Enroll students into active courses using the 'New Enrollment' button above."
          actionText="Create First Enrollment"
          onAction={() => setIsEnrollModalOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-semibold text-[10px] text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Enrolled Course</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Enrollment Date</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {enrichedEnrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.studentName}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.studentEmail}</p>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {item.courseThumbnail && (
                          <img
                            src={item.courseThumbnail}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs">
                          {item.courseTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="emerald" size="sm">
                        {item.courseCategory}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">{formatDate(item.enrollmentDate)}</td>

                    <td className="py-3 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>{item.progressPercentage}%</span>
                          <span>{item.completedLessons?.length || 0} done</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.progressPercentage >= 75
                                ? 'bg-emerald-500'
                                : item.progressPercentage >= 25
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={item.status === 'Completed' ? 'emerald' : 'blue'}
                        size="sm"
                        dot
                      >
                        {item.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1.5"
                        onClick={() => setDeletingEnrollmentId(item.id)}
                        title="Remove Enrollment"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Enrollment Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll Student in Course"
        description="Select a registered student and an active curriculum course."
      >
        <form onSubmit={handleEnrollSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — ${c.price}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
            <span>
              The system strictly enforces duplicate prevention. Students cannot be enrolled in the
              same course multiple times.
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Enrollment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Unenroll Confirmation Modal */}
      <Modal
        isOpen={!!deletingEnrollmentId}
        onClose={() => setDeletingEnrollmentId(null)}
        title="Confirm Unenrollment"
        description="Are you sure you want to withdraw this student from the course? Their progress record will be cleared."
      >
        <div className="flex justify-end gap-2.5 pt-4">
          <Button variant="outline" onClick={() => setDeletingEnrollmentId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmUnenroll}>
            Confirm Unenroll
          </Button>
        </div>
      </Modal>
    </div>
  );
};
