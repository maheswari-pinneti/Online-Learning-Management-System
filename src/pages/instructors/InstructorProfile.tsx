import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Award, Mail, BookOpen, Clock } from 'lucide-react';
import { useInstructors } from '@/context/InstructorContext';
import { useCourses } from '@/context/CourseContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const InstructorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getInstructorById } = useInstructors();
  const { courses } = useCourses();

  const instructor = id ? getInstructorById(id) : undefined;
  const assignedCourses = courses.filter((c) => c.instructorId === id);

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
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Faculty Directory
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={instructor.profileImage}
            alt={instructor.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {instructor.name}
                </h1>
                <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {instructor.specialization}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{instructor.rating.toFixed(1)} / 5.0 Rating</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {instructor.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500">
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
                <span>{assignedCourses.length} Active Courses</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Assigned Courses Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Courses Taught by {instructor.name} ({assignedCourses.length})
        </h2>

        {assignedCourses.length === 0 ? (
          <Card className="p-8 text-center text-xs text-slate-500">
            No courses are currently assigned to this instructor.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedCourses.map((c) => (
              <Card key={c.id} className="overflow-hidden flex flex-col justify-between" hover>
                <div className="relative h-40 overflow-hidden">
                  <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="emerald" size="sm">
                      {c.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{c.duration}</span>
                    </div>
                    <Link to={`/courses/${c.id}`}>
                      <Button variant="outline" size="sm">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
