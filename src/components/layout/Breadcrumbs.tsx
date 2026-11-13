import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  courses: 'Course Management',
  students: 'Student Directory',
  instructors: 'Instructors',
  enrollment: 'Course Enrollment',
  progress: 'Learning Progress',
  assignments: 'Assignments & Quizzes',
  reports: 'Reports & Analytics',
  settings: 'System Settings',
  profile: 'My Profile',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0 || pathnames[0] === 'auth') return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>EduSphere</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[segment] || segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-brand-600 dark:hover:text-brand-400 capitalize transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
