import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CourseProvider } from '@/context/CourseContext';
import { StudentProvider } from '@/context/StudentContext';
import { InstructorProvider } from '@/context/InstructorContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { LearningProvider } from '@/context/LearningContext';
import { ReportsAnalytics } from '@/pages/reports/ReportsAnalytics';
import { StorageService } from '@/services/storageService';

const TestApp: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <CourseProvider>
        <StudentProvider>
          <InstructorProvider>
            <EnrollmentProvider>
              <LearningProvider>
                <ReportsAnalytics />
              </LearningProvider>
            </EnrollmentProvider>
          </InstructorProvider>
        </StudentProvider>
      </CourseProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Module 9: Reports & Analytics', () => {
  beforeEach(() => {
    StorageService.clearAppStorage();
    localStorage.clear();

    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mock-csv');
    }
  });

  it('renders institutional reports dashboard with KPIs and visualizations', () => {
    render(<TestApp />);

    expect(screen.getByText(/Institutional Reports & Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Active Learners/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Curriculum Tracks/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Course Enrollments/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Estimated Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Enrollment & Completion Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Curriculum by Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Platform Revenue Growth/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Rated Leaderboard/i)).toBeInTheDocument();
  });

  it('triggers CSV export report download on button click', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<TestApp />);

    const exportBtn = screen.getByRole('button', { name: /Export CSV Report/i });
    expect(exportBtn).toBeInTheDocument();

    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalled();
    });

    clickSpy.mockRestore();
  });
});
