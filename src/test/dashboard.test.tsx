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
import { PermissionProvider } from '@/context/PermissionContext';
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
                  <PermissionProvider>
                    <RoleTestController />
                    <Dashboard />
                  </PermissionProvider>
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
      // Student specific texts matching new CyberGenius AI dashboard
      expect(screen.getByText(/Your next step to keep moving forward with AI/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Inside the Breach/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/YOUR PROGRESS/i)).toBeInTheDocument();
      expect(screen.getByText(/Cyber Cat/i)).toBeInTheDocument();
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
      expect(screen.queryByText(/Your next step to keep moving forward with AI/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Cyber Cat/i)).not.toBeInTheDocument();
    });
  });

  it('renders complete dedicated Student dashboard UI and enforces role separation from admin and instructor', async () => {
    render(<TestApp />);

    // 1. Initial view is Admin: Student Dashboard UI MUST NOT be rendered
    expect(screen.getByText(/Institutional Learning Analytics/i)).toBeInTheDocument();
    expect(screen.queryByText(/Your next step to keep moving forward with AI/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cyber Cat/i)).not.toBeInTheDocument();

    // 2. Switch to Student role
    const studentBtn = screen.getByTestId('test-role-student');
    fireEvent.click(studentBtn);

    await waitFor(() => {
      // Top Greeting & Subtitle
      expect(screen.getByText(/Hi,/i)).toBeInTheDocument();
      expect(screen.getByText(/Your next step to keep moving forward with AI/i)).toBeInTheDocument();

      // Featured "Continue" Card
      expect(screen.getByText(/Inside the Breach - They're in the cloud/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument();
      expect(screen.getByText(/View all lessons/i)).toBeInTheDocument();

      // Your Progress Card
      expect(screen.getByText(/YOUR PROGRESS/i)).toBeInTheDocument();
      expect(screen.getByText(/17%/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Lessons/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Activities/i)).toBeInTheDocument();

      // Your Circle Card
      expect(screen.getByText(/YOUR CIRCLE/i)).toBeInTheDocument();
      expect(screen.getByText(/8 DEC/i)).toBeInTheDocument();
      expect(screen.getByText(/Cyber Genius Masterclass/i)).toBeInTheDocument();
      expect(screen.getByText(/With Microsoft/i)).toBeInTheDocument();
      expect(screen.getByText(/Be the first to enter/i)).toBeInTheDocument();

      // Your Fellow Card (Cyber Cat)
      expect(screen.getByText(/YOUR FELLOW/i)).toBeInTheDocument();
      expect(screen.getByText(/Cyber Cat/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^call$/i })).toBeInTheDocument();
      expect(screen.getByText(/Interview Practice/i)).toBeInTheDocument();
      expect(screen.getByText(/Recap and next step/i)).toBeInTheDocument();
      expect(screen.getByText(/Quiz me on this lesson/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ask Cyber Cat anything/i)).toBeInTheDocument();
    });

    // 3. Switch to Instructor role: Student UI should disappear
    const instructorBtn = screen.getByTestId('test-role-instructor');
    fireEvent.click(instructorBtn);

    await waitFor(() => {
      expect(screen.getByText(/Faculty Academic Hub/i)).toBeInTheDocument();
      expect(screen.queryByText(/Your next step to keep moving forward with AI/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Cyber Cat/i)).not.toBeInTheDocument();
    });
  });

  it('allows Admin and Instructor to open profile update modal and access logout controls', async () => {
    render(<TestApp />);

    // Admin Dashboard should show Update Profile and Log Out buttons
    const adminUpdateButtons = screen.getAllByRole('button', { name: /update profile/i });
    expect(adminUpdateButtons.length).toBeGreaterThan(0);
    fireEvent.click(adminUpdateButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Update Administrator Profile/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save profile/i })).toBeInTheDocument();
    });

    // Close admin profile modal
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Switch to Instructor
    const instructorBtn = screen.getByTestId('test-role-instructor');
    fireEvent.click(instructorBtn);

    await waitFor(() => {
      const instructorUpdateButtons = screen.getAllByRole('button', { name: /update profile/i });
      expect(instructorUpdateButtons.length).toBeGreaterThan(0);
      fireEvent.click(instructorUpdateButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/Update Faculty Profile/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save profile/i })).toBeInTheDocument();
    });
  });
});
