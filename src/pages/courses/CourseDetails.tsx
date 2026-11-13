import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Star,
  CheckCircle2,
  PlayCircle,
  Share2,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCourses } from '@/context/CourseContext';
import { useAuth } from '@/context/AuthContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCourseById } = useCourses();
  const { user } = useAuth();
  const { isStudentEnrolled, enrollStudent } = useEnrollment();

  const course = id ? getCourseById(id) : undefined;
  const isEnrolled = user ? isStudentEnrolled(user.id, course?.id || '') : false;

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Course Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          The requested course ID could not be located in the catalog.
        </p>
        <Link to="/courses" className="mt-4 inline-block">
          <Button variant="primary" size="sm">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const handleEnroll = () => {
    if (!user) {
      toast.info('Please sign in to enroll in this course.');
      navigate('/auth/login');
      return;
    }

    try {
      enrollStudent(user.id, course.id);
      toast.success(`Congratulations! You are now enrolled in "${course.title}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Enrollment failed.';
      toast.warning(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Catalog
        </Link>
      </div>

      {/* Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2-Cols: Overview & Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="emerald">{course.category}</Badge>
              <Badge variant="blue">{course.level}</Badge>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold ml-auto">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({course.ratingCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {course.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-500">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Lead Instructor
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {course.instructorName}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Estimated Duration
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {course.duration} ({course.durationHours} hrs total)
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Total Lessons
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {course.lessons.length} Modules & Labs
                </span>
              </div>
            </div>
          </Card>

          {/* Curriculum & Syllabus */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              Curriculum Syllabus ({course.lessons.length} Lessons)
            </h2>

            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {lesson.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap pl-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.durationMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sticky Sidebar: Enrollment & Pricing */}
        <div className="space-y-6">
          <Card className="overflow-hidden p-6 sticky top-20">
            <div className="rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                ${course.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">One-time enrollment</span>
            </div>

            <div className="space-y-3">
              {isEnrolled ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You are actively enrolled in this course!</span>
                  </div>
                  <Link to="/progress" className="block">
                    <Button variant="primary" className="w-full" leftIcon={<PlayCircle className="w-4 h-4" />}>
                      Go to Learning Tracker
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleEnroll}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                >
                  Enroll Now
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.info('Course link copied to clipboard!');
                }}
                leftIcon={<Share2 className="w-4 h-4" />}
              >
                Share Course
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Full lifetime access to materials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Certificate upon 100% completion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Interactive quizzes & milestone grading</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
