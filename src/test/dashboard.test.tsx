import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CourseProvider } from '@/context/CourseContext';
import { StudentProvider } from '@/context/StudentContext';
import { InstructorProvider } from '@/context/InstructorContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { LearningProvider } from '@/context/LearningContext';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { StorageService } from '@/services/storageService';

const TestApp: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <StudentProvider>
            <InstructorProvider>
              <EnrollmentProvider>
                <LearningProvider>
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

    // Click Student preview pill in the banner
    const studentButtons = screen.getAllByRole('button', { name: /^student$/i });
    expect(studentButtons.length).toBeGreaterThan(0);
    fireEvent.click(studentButtons[0]);

    await waitFor(() => {
      // Student specific texts
      expect(screen.getByText(/Student Learning Center/i)).toBeInTheDocument();
      expect(screen.getByText(/My Enrolled Courses/i)).toBeInTheDocument();
      expect(screen.getByText(/Quick Learning Navigation/i)).toBeInTheDocument();
    });
  });

  it('switches role view to Instructor and adapts metrics and actions', async () => {
    render(<TestApp />);

    // Click Instructor preview pill in the banner
    const instructorButtons = screen.getAllByRole('button', { name: /^instructor$/i });
    expect(instructorButtons.length).toBeGreaterThan(0);
    fireEvent.click(instructorButtons[0]);

    await waitFor(() => {
      // Instructor specific texts
      expect(screen.getByText(/Faculty Academic Hub/i)).toBeInTheDocument();
      expect(screen.getByText(/Teaching Catalog/i)).toBeInTheDocument();
      expect(screen.getByText(/Faculty Teaching Actions/i)).toBeInTheDocument();
    });
  });
});
