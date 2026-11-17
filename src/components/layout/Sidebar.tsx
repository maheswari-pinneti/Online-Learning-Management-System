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
  Home,
  BookOpen,
  Network,
  Calendar,
  Compass,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
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
    name: 'Student Progress',
    path: '/progress',
    icon: <LineChart className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin', 'instructor'],
  },
  {
    name: 'Assignments & Quizzes',
    path: '/assignments',
    icon: <FileCheck2 className="w-5 h-5 flex-shrink-0" />,
    roles: ['instructor'],
  },
  {
    name: 'Reports & Analytics',
    path: '/reports',
    icon: <BarChart3 className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin'],
  },
  {
    name: 'Permissions',
    path: '/permissions',
    icon: <ShieldCheck className="w-5 h-5 flex-shrink-0" />,
    roles: ['admin'],
  },
];

const studentNavItems: NavItem[] = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: <Home className="w-5 h-5 flex-shrink-0" />,
    roles: ['student'],
  },
  {
    name: 'Lessons',
    path: '/courses',
    icon: <BookOpen className="w-5 h-5 flex-shrink-0" />,
    roles: ['student'],
  },
  {
    name: 'Activities',
    path: '/assignments',
    icon: <Network className="w-5 h-5 flex-shrink-0" />,
    roles: ['student'],
  },
  {
    name: 'Events',
    path: '/progress',
    icon: <Calendar className="w-5 h-5 flex-shrink-0" />,
    roles: ['student'],
  },
  {
    name: 'Campus',
    path: '/instructors',
    icon: <Compass className="w-5 h-5 flex-shrink-0" />,
    roles: ['student'],
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
  const { role, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const currentRole = role || user?.role || 'student';
  const isStudent = currentRole === 'student';

  const visibleItems = isStudent
    ? studentNavItems
    : navItems.filter((item) => item.roles.includes(currentRole));

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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col ${
          isStudent
            ? 'bg-gradient-to-b from-[#E6F8F3]/60 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'
            : 'bg-white dark:bg-slate-900'
        } border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out lg:static ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100/80 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            {isStudent ? (
              /* Stylized 'F' logo from screenshot */
              <div className="flex items-center justify-center w-8 h-8 select-none text-black dark:text-white">
                <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 2 H20 V6.5 H9.5 V11.5 H17.5 V16 H9.5 V25 H3 V2 Z" fill="currentColor" />
                </svg>
              </div>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7047EB] to-[#9B7EF3] text-white shadow-md shadow-purple-500/25 flex-shrink-0">
                <Rocket className="w-5 h-5 text-amber-300" />
              </div>
            )}
            {!isCollapsed && !isStudent && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[#7047EB] dark:text-purple-400">
                  Schoooli
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
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
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isStudent
                    ? isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    : isActive
                    ? 'bg-[#7047EB] text-white shadow-sm shadow-[#7047EB]/25 font-semibold'
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


        {/* Student Specific Sidebar Footer: Settings & Toggle, Help, User Card */}
        {isStudent && !isCollapsed && (
          <div className="px-3 py-2 space-y-1.5 border-t border-slate-100/80 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
            {/* Settings & Toggle Switch */}
            <div className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Settings</span>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-4 w-7 items-center rounded-full bg-slate-300 dark:bg-slate-600 transition-colors focus:outline-none"
                title="Toggle Theme"
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-3.5' : 'translate-x-0.5'
                  } inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-xs`}
                />
              </button>
            </div>

            {/* Help */}
            <button
              onClick={() => toast.info('EduSphere AI Helpdesk: 24/7 student support active.')}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Help</span>
            </button>
          </div>
        )}

        {/* User Profile in Footer */}
        {user && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div
              className={`flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex-1 min-w-0 ${
                isCollapsed ? 'justify-center p-1' : ''
              }`}
            >
              <img
                src={
                  isStudent
                    ? user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    : user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                }
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.name || 'Maheswari'}
                  </span>
                  {!isStudent && (
                    <span className="text-xs text-slate-400 capitalize">
                      {user.role}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Logout Button */}
            {!isCollapsed && (
              <button
                onClick={() => {
                  logout();
                  toast.success('Signed out successfully.');
                  window.location.href = '/auth/login';
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
                title="Sign Out"
                data-testid="sidebar-logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
};
