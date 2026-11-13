import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { AdminDashboard } from './AdminDashboard';
import { InstructorDashboard } from './InstructorDashboard';
import { StudentDashboard } from './StudentDashboard';

/**
 * Dashboard Dispatcher Component
 *
 * Routes seamlessly to role-tailored dashboards based on user authorization:
 * - Admin: Institutional executive control center, platform KPIs, analytics charts, virtual classrooms
 * - Instructor: Faculty teaching portal, course catalog, enrolled cohorts, grading reviews
 * - Student: Learner dashboard matching Figma specification with courses, learning streak, stats
 */
export const Dashboard: React.FC = () => {
  const { user, role } = useAuth();
  const currentRole: UserRole = role || user?.role || 'admin';

  if (currentRole === 'student') {
    return <StudentDashboard />;
  }

  if (currentRole === 'instructor') {
    return <InstructorDashboard />;
  }

  return <AdminDashboard />;
};

export default Dashboard;
