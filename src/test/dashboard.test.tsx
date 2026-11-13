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
    const studentButtons = screen.getAllByRole('button', { name: /^student$/i });
    fireEvent.click(studentButtons[0]);

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
    const instructorButtons = screen.getAllByRole('button', { name: /^instructor$/i });
    fireEvent.click(instructorButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Faculty Academic Hub/i)).toBeInTheDocument();
      expect(screen.queryByText(/Sharpen Your Skills With/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Learn even more!/i)).not.toBeInTheDocument();
    });
  });
});
