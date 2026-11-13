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
import { AssignmentsQuizzes } from '@/pages/assignments/AssignmentsQuizzes';
import { StorageService } from '@/services/storageService';

const TestApp: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <CourseProvider>
        <StudentProvider>
          <InstructorProvider>
            <EnrollmentProvider>
              <LearningProvider>
                <AssignmentsQuizzes />
              </LearningProvider>
            </EnrollmentProvider>
          </InstructorProvider>
        </StudentProvider>
      </CourseProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Module 8: Assignments & Quizzes', () => {
  beforeEach(() => {
    StorageService.clearAppStorage();
    localStorage.clear();
  });

  it('renders assignment list with deadlines, weightage, and submission actions', () => {
    render(<TestApp />);

    expect(screen.getByText(/Assessments, Quizzes & Grading/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Assignments \(\d+\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Quizzes \(\d+\)/i })).toBeInTheDocument();

    const submitButtons = screen.getAllByRole('button', { name: /Submit Assignment/i });
    expect(submitButtons.length).toBeGreaterThan(0);
  });

  it('allows student to submit an assignment with content', async () => {
    render(<TestApp />);

    const submitButtons = screen.getAllByRole('button', { name: /Submit Assignment/i });
    fireEvent.click(submitButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Assignment Prompt:/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Paste code snippet/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Paste code snippet/i);
    fireEvent.change(textarea, {
      target: { value: 'https://github.com/student/ecommerce-microservices-lms' },
    });

    const recordButton = screen.getByRole('button', { name: /Record Submission/i });
    fireEvent.click(recordButton);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Paste code snippet/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /View My Submission/i })).toBeInTheDocument();
    });
  });

  it('toggles to quiz tab and starts an interactive timed quiz', async () => {
    render(<TestApp />);

    const quizTabButton = screen.getByRole('button', { name: /Quizzes \(\d+\)/i });
    fireEvent.click(quizTabButton);

    const startQuizButtons = screen.getAllByRole('button', { name: /Start Timed Quiz/i });
    expect(startQuizButtons.length).toBeGreaterThan(0);

    fireEvent.click(startQuizButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Answers/i })).toBeInTheDocument();
    });
  });
});
