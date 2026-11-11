import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';

// App Pages
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { CourseList } from '@/pages/courses/CourseList';
import { CourseDetails } from '@/pages/courses/CourseDetails';
import { StudentList } from '@/pages/students/StudentList';
import { EnrollmentManager } from '@/pages/enrollment/EnrollmentManager';
import { InstructorList } from '@/pages/instructors/InstructorList';
import { InstructorProfile } from '@/pages/instructors/InstructorProfile';
import { ProgressTracker } from '@/pages/progress/ProgressTracker';
import { AssignmentsQuizzes } from '@/pages/assignments/AssignmentsQuizzes';
import { ReportsAnalytics } from '@/pages/reports/ReportsAnalytics';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />

      {/* Protected App Routes under Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetails />} />

        {/* Module 4: Students (Admin / Instructor) */}
        <Route
          path="students"
          element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <StudentList />
            </ProtectedRoute>
          }
        />

        {/* Module 5: Course Enrollment (Admin) */}
        <Route
          path="enrollment"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EnrollmentManager />
            </ProtectedRoute>
          }
        />

        {/* Module 6: Instructors */}
        <Route path="instructors" element={<InstructorList />} />
        <Route path="instructors/:id" element={<InstructorProfile />} />

        {/* Module 7: Learning Progress */}
        <Route path="progress" element={<ProgressTracker />} />

        {/* Module 8: Assignments & Quizzes */}
        <Route path="assignments" element={<AssignmentsQuizzes />} />

        {/* Module 9: Reports & Analytics (Admin) */}
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportsAnalytics />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
