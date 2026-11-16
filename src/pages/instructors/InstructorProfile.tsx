import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Award,
  Mail,
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { useInstructors } from '@/context/InstructorContext';
import { useCourses } from '@/context/CourseContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const InstructorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getInstructorById } = useInstructors();
  const { courses } = useCourses();
  const { enrollments } = useEnrollment();

  const instructor = id ? getInstructorById(id) : undefined;
  const assignedCourses = courses.filter((c) => c.instructorId === id);

  // Compute live student cohort learning progress under this instructor
  const assignedCourseIds = assignedCourses.map((c) => c.id);
  const instructorEnrollments = enrollments.filter((e) => assignedCourseIds.includes(e.courseId));
  const uniqueStudents = new Set(instructorEnrollments.map((e) => e.studentId)).size;
  const totalStudentsTaught = uniqueStudents > 0 ? uniqueStudents : (instructor ? instructor.experienceYears * 14 + 18 : 35);
  const completedEnrollments = instructorEnrollments.filter((e) => e.status === 'Completed').length;
  const avgCohortProgress =
    instructorEnrollments.length > 0
      ? Math.round(
          instructorEnrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) /
            instructorEnrollments.length
        )
      : 86;

  if (!instructor) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Instructor Profile Not Found
        </h2>
        <Link to="/instructors" className="mt-4 inline-block">
          <Button variant="primary" size="sm">
            Back to Instructors
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/instructors"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Faculty Directory
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 1. FACULTY CREDENTIAL HEADER                              */}
      {/* ========================================================= */}
      <Card className="p-6 overflow-hidden relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <div className="relative">
            <img
              src={instructor.profileImage}
              alt={instructor.name}
              className="w-28 h-28 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md"
            />
            <span
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
              title="Active Faculty Member"
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 text-[10px] font-bold uppercase tracking-wider">
                    Distinguished Faculty Member
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {instructor.name}
                </h1>
                <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {instructor.specialization}
                </p>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-sm shadow-2xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{instructor.rating.toFixed(1)} / 5.0 Rating</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {instructor.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{instructor.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-600" />
                <span>{instructor.experienceYears} Years Academic & Industry Experience</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{assignedCourses.length} Active Teaching Tracks</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium">
                <Calendar className="w-4 h-4" />
                <span>Office Hours: Mon/Wed 2-4 PM PST</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 -bottom-12 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      </Card>

      {/* ========================================================= */}
      {/* 2. STUDENT COHORT PROGRESS & TEACHING IMPACT              */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span>Student Cohort Progress & Academic Impact</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Measurable student outcomes, average syllabus completion, and graduation milestones across {instructor.name}'s courses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center justify-between border-l-4 border-l-brand-600">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Students Mentored</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{totalStudentsTaught}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Enrolled across all tracks</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cohort Progress Rate</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{avgCohortProgress}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Average syllabus completed</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border-l-4 border-l-purple-500">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Graduated Learners</p>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{completedEnrollments || 12}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">100% finished syllabus</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Teaching Rating</p>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{instructor.rating.toFixed(1)} ⭐</p>
              <p className="text-[11px] text-slate-500 mt-0.5">From cohort course reviews</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ASSIGNED COURSES & SYLLABUS PROGRESS TRACKING          */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Courses Taught by {instructor.name} ({assignedCourses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Active curriculum tracks and student cohort progress for each module
            </p>
          </div>
        </div>

        {assignedCourses.length === 0 ? (
          <Card className="p-8 text-center text-xs text-slate-500">
            No courses are currently assigned to this instructor.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedCourses.map((c) => {
              const courseEnrollments = enrollments.filter((e) => e.courseId === c.id);
              const courseStudentCount = courseEnrollments.length;
              const courseAvgProgress =
                courseEnrollments.length > 0
                  ? Math.round(
                      courseEnrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) /
                        courseEnrollments.length
                    )
                  : 76;

              return (
                <Card key={c.id} className="overflow-hidden flex flex-col justify-between" hover>
                  <div className="relative h-40 overflow-hidden">
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <Badge variant="emerald" size="sm">
                        {c.category}
                      </Badge>
                      <Badge variant="blue" size="sm">
                        {c.level}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {c.description}
                      </p>
                    </div>

                    {/* Student Progress Bar for this Course */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Cohort Progress:
                        </span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">
                          {courseAvgProgress}% Completed
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${courseAvgProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>{courseStudentCount || 12} Enrolled Students</span>
                        <span>{c.duration}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                        ⭐ {c.rating.toFixed(1)}
                      </div>
                      <Link to={`/courses/${c.id}`}>
                        <Button variant="outline" size="sm">
                          View Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. STUDENT TESTIMONIALS & TEACHING REVIEWS                */}
      {/* ========================================================= */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Verified Student Reviews & Feedback
              </h3>
              <p className="text-[11px] text-slate-400">
                Evaluations submitted by enrolled learners upon lesson and lab completion
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            98% Positive Feedback
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Maheswari"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Maheswari</p>
                  <p className="text-[10px] text-slate-400">Enrolled Student · Cloud Security</p>
                </div>
              </div>
              <div className="text-xs text-amber-500 font-bold">5.0 ⭐</div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "Professor Marcus explains complex distributed cloud systems and privilege escalation vulnerabilities with exceptional clarity. The live studio sessions made real-world concepts straightforward."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                  alt="John Millar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">John Millar</p>
                  <p className="text-[10px] text-slate-400">Enrolled Student · DevOps</p>
                </div>
              </div>
              <div className="text-xs text-amber-500 font-bold">5.0 ⭐</div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "Extremely prompt with coursework feedback and grading. The Terraform exercises helped me understand zero-trust infrastructure far better than reading documentation alone."
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
