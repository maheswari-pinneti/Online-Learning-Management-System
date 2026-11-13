import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CourseProvider } from '@/context/CourseContext';
import { StudentProvider } from '@/context/StudentContext';
import { InstructorProvider } from '@/context/InstructorContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { LearningProvider } from '@/context/LearningContext';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { StorageService } from '@/services/storageService';

/**
 * Headless test harness controller to simulate role switching in automated tests
 * without placing demo buttons into production UI.
 */
const RoleTestController: React.FC = () => {
  const { switchDemoRole } = useAuth();
  return (
    <div data-testid="test-role-controller" className="sr-only">
      <button data-testid="test-role-admin" onClick={() => switchDemoRole('admin')}>
        admin
      </button>
      <button data-testid="test-role-instructor" onClick={() => switchDemoRole('instructor')}>
        instructor
      </button>
      <button data-testid="test-role-student" onClick={() => switchDemoRole('student')}>
        student
      </button>
    </div>
  );
};

const TestApp: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <StudentProvider>
            <InstructorProvider>
              <EnrollmentProvider>
                <LearningProvider>
                  <RoleTestController />
                  <Dashboard />
                </LearningProvider>
              </EnrollmentProvider>
            </InstructorProvider>
          </StudentProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component & Role-Aware Operations', () => {
  beforeEach(() => {
    StorageService.clearAppStorage();
    localStorage.clear();
  });

  it('renders executive dashboard with KPIs and core metrics', async () => {
    render(<TestApp />);

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Institutional Learning Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Classes & Workshops/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Platform Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Highest Rated Curriculum Tracks/i)).toBeInTheDocument();
  });

  it('opens interactive virtual classroom modal when clicking Join', async () => {
    render(<TestApp />);

    const joinButtons = screen.getAllByRole('button', { name: /join/i });
    expect(joinButtons.length).toBeGreaterThan(0);

    fireEvent.click(joinButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Virtual Classroom:/i)).toBeInTheDocument();
      expect(screen.getByText(/Live Broadcast/i)).toBeInTheDocument();
      expect(screen.getByText(/Copy Session Link/i)).toBeInTheDocument();
      expect(screen.getByText(/Launch Fullscreen Room/i)).toBeInTheDocument();
    });

    // Dismiss modal
    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText(/Virtual Classroom:/i)).not.toBeInTheDocument();
    });
  });

  it('switches role view to Student and adapts metrics and actions', async () => {
    render(<TestApp />);

    // Switch to Student via test controller
    const studentBtn = screen.getByTestId('test-role-student');
    fireEvent.click(studentBtn);

    await waitFor(() => {
      // Student specific texts
      expect(screen.getByText(/Student Learning Center/i)).toBeInTheDocument();
      expect(screen.getByText(/Sharpen Your Skills With/i)).toBeInTheDocument();
      expect(screen.getAllByText(/My Courses/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Courses completed/i)).toBeInTheDocument();
    });
  });

  it('switches role view to Instructor and adapts metrics and actions', async () => {
    render(<TestApp />);

    // Switch to Instructor via test controller
    const instructorBtn = screen.getByTestId('test-role-instructor');
    fireEvent.click(instructorBtn);

    await waitFor(() => {
      // Instructor specific texts
      expect(screen.getByText(/Faculty Academic Hub/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Teaching Catalog/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Faculty Teaching Actions/i)).toBeInTheDocument();

      // Ensure Student dashboard UI is NOT shown to instructor
      expect(screen.queryByText(/Sharpen Your Skills With/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Learn even more!/i)).not.toBeInTheDocument();
    });
  });

  it('renders complete dedicated Student dashboard UI and enforces role separation from admin and instructor', async () => {
    render(<TestApp />);

    // 1. Initial view is Admin: Student Dashboard UI MUST NOT be rendered
    expect(screen.getByText(/Institutional Learning Analytics/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sharpen Your Skills With/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Learn even more!/i)).not.toBeInTheDocument();

    // 2. Switch to Student role
    const studentBtn = screen.getByTestId('test-role-student');
    fireEvent.click(studentBtn);

    await waitFor(() => {
      // Hero Banner & Headline
      expect(screen.getByText(/Sharpen Your Skills With/i)).toBeInTheDocument();
      expect(screen.getByText(/Join Now/i)).toBeInTheDocument();

      // Circular Metric Cards
      expect(screen.getByText(/Courses completed/i)).toBeInTheDocument();
      expect(screen.getByText(/Courses in progress/i)).toBeInTheDocument();
      expect(screen.getByText(/Total learning time/i)).toBeInTheDocument();
      expect(screen.getByText(/Daily Learning Streak/i)).toBeInTheDocument();

      // My Courses Section
      expect(screen.getAllByText(/My Courses/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Learn React From Scratch/i)).toBeInTheDocument();
      expect(screen.getByText(/Unlock Java Backend Power/i)).toBeInTheDocument();
      expect(screen.getByText(/Get Fit At Home Fast/i)).toBeInTheDocument();

      // Statistics Section
      expect(screen.getByText(/Your statistics/i)).toBeInTheDocument();
      expect(screen.getByText(/Learning Hours/i)).toBeInTheDocument();

      // Popular Courses Section
      expect(screen.getByText(/Popular Courses/i)).toBeInTheDocument();
      expect(screen.getByText(/Master UI By Creating/i)).toBeInTheDocument();
      expect(screen.getByText(/Double Your Output Fast/i)).toBeInTheDocument();

      // Promo CTA Section
      expect(screen.getByText(/Learn even more!/i)).toBeInTheDocument();
      expect(screen.getByText(/Go Premium/i)).toBeInTheDocument();
    });

    // 3. Switch to Instructor role: Student UI should disappear
    const instructorBtn = screen.getByTestId('test-role-instructor');
    fireEvent.click(instructorBtn);

    await waitFor(() => {
      expect(screen.getByText(/Faculty Academic Hub/i)).toBeInTheDocument();
      expect(screen.queryByText(/Sharpen Your Skills With/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Learn even more!/i)).not.toBeInTheDocument();
    });
  });
});
