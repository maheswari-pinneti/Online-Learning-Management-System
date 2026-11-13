import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  UserPlus,
  LineChart,
  FileCheck2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Rocket,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin', 'instructor', 'student'],
  },
  {
    name: 'Course Catalog',
    path: '/courses',
    icon: <GraduationCap className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin', 'instructor', 'student'],
  },
  {
    name: 'Students',
    path: '/students',
    icon: <Users className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin', 'instructor'],
  },
  {
    name: 'Course Enrollment',
    path: '/enrollment',
    icon: <UserPlus className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin'],
  },
  {
    name: 'Instructors',
    path: '/instructors',
    icon: <UserCheck className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin', 'student'],
  },
  {
    name: 'Learning Progress',
    path: '/progress',
    icon: <LineChart className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin', 'instructor', 'student'],
  },
  {
    name: 'Assignments & Quizzes',
    path: '/assignments',
    icon: <FileCheck2 className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin', 'instructor', 'student'],
  },
  {
    name: 'Reports & Analytics',
    path: '/reports',
    icon: <BarChart3 className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin'],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { role, user } = useAuth();
  const currentRole = role || 'student';

  const visibleItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out lg:static ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7047EB] to-[#9B7EF3] text-white shadow-md shadow-purple-500/25 flex-shrink-0">
              <Rocket className="w-5 h-5 text-amber-300" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[#7047EB] dark:text-purple-400">
                  Schoooli
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  EduSphere LMS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#7047EB] text-white shadow-sm shadow-[#7047EB]/25 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
                } ${isCollapsed ? 'justify-center px-2' : ''}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <span className="text-inherit group-hover:scale-105 transition-transform">
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Pro Plan Upgrade Card matching Schoooli mock */}
        {!isCollapsed && (
          <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-[#7047EB] via-[#5F35DB] to-[#4D24C7] text-white p-3.5 shadow-lg shadow-purple-500/20 relative overflow-hidden">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Rocket className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  You're on the Free plan.
                </p>
                <p className="text-[10px] text-purple-200 mt-0.5">
                  Upgrade to go Pro
                </p>
              </div>
            </div>
            <button
              onClick={() => toast.info('Pro Plan: Unlimited classrooms, automated grading, priority analytics.')}
              className="mt-3 w-full py-1.5 px-3 rounded-xl bg-white text-[#7047EB] hover:bg-purple-50 text-xs font-extrabold shadow-xs transition-colors text-center"
            >
              Upgrade
            </button>
          </div>
        )}

        {/* User Card in Footer */}
        {user && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <div
              className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 ${
                isCollapsed ? 'justify-center p-1' : ''
              }`}
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#7047EB]/30 flex-shrink-0"
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] capitalize text-[#7047EB] dark:text-purple-400 font-semibold">
                    {user.role} Account
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
