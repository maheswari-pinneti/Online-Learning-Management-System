import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CourseProvider } from '@/context/CourseContext';
import { StudentProvider } from '@/context/StudentContext';
import { InstructorProvider } from '@/context/InstructorContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { LearningProvider, useLearning } from '@/context/LearningContext';

const fullWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <InstructorProvider>
    <CourseProvider>
      <StudentProvider>
        <EnrollmentProvider>
          <LearningProvider>{children}</LearningProvider>
        </EnrollmentProvider>
      </StudentProvider>
    </CourseProvider>
  </InstructorProvider>
);

describe('Modules 7 & 8: Learning Progress & Assessments', () => {
  it('calculates course progress percentage accurately', () => {
    const { result } = renderHook(() => useLearning(), { wrapper: fullWrapper });

    const progress = result.current.getCourseProgress('stud-1', 'course-1');
    expect(progress).not.toBeNull();
    if (progress) {
      expect(progress.studentId).toBe('stud-1');
      expect(progress.courseId).toBe('course-1');
      expect(progress.totalLessons).toBeGreaterThan(0);
      expect(progress.completionPercentage).toBeGreaterThanOrEqual(0);
      expect(progress.completionPercentage).toBeLessThanOrEqual(100);
      expect(progress.completedLessonsCount + progress.pendingLessonsCount).toBe(
        progress.totalLessons
      );
    }
  });

  it('submits an assignment and updates submission status', () => {
    const { result } = renderHook(() => useLearning(), { wrapper: fullWrapper });

    let subId = '';
    act(() => {
      const sub = result.current.submitAssignment(
        'asg-1',
        'stud-1',
        'https://github.com/example/micro-frontend-submission'
      );
      subId = sub.id;
      expect(sub.status).toBe('Submitted');
      expect(sub.studentId).toBe('stud-1');
    });

    // Grade the assignment
    act(() => {
      result.current.gradeAssignment(subId, 95, 'Excellent decoupled architecture!');
    });

    const recorded = result.current.getAssignmentSubmission('asg-1', 'stud-1');
    expect(recorded?.status).toBe('Graded');
    expect(recorded?.obtainedMarks).toBe(95);
  });

  it('grades quiz answers dynamically and determines pass/fail', () => {
    const { result } = renderHook(() => useLearning(), { wrapper: fullWrapper });

    const quiz = result.current.quizzes[0];
    expect(quiz).toBeDefined();

    // Prepare all correct answers
    const allCorrectAnswers: Record<string, number> = {};
    quiz.questions.forEach((q) => {
      allCorrectAnswers[q.id] = q.correctOptionIndex;
    });

    act(() => {
      const submission = result.current.submitQuiz(quiz.id, 'stud-1', allCorrectAnswers);
      expect(submission.score).toBe(quiz.questions.length);
      expect(submission.percentage).toBe(100);
      expect(submission.passed).toBe(true);
    });

    // Prepare all incorrect answers
    const wrongAnswers: Record<string, number> = {};
    quiz.questions.forEach((q) => {
      wrongAnswers[q.id] = (q.correctOptionIndex + 1) % q.options.length;
    });

    act(() => {
      const failedSubmission = result.current.submitQuiz(quiz.id, 'stud-2', wrongAnswers);
      expect(failedSubmission.score).toBe(0);
      expect(failedSubmission.passed).toBe(false);
    });
  });

  it('loads default student submissions ready for instructor assessment and grading', () => {
    const { result } = renderHook(() => useLearning(), { wrapper: fullWrapper });

    expect(result.current.assignmentSubmissions.length).toBeGreaterThan(0);
    expect(result.current.quizSubmissions.length).toBeGreaterThan(0);

    const pendingSub = result.current.assignmentSubmissions.find((s) => s.status === 'Submitted');
    expect(pendingSub).toBeDefined();
    if (pendingSub) {
      act(() => {
        result.current.gradeAssignment(pendingSub.id, 46, 'Well-structured solution with great tests.');
      });

      const gradedSub = result.current.assignmentSubmissions.find((s) => s.id === pendingSub.id);
      expect(gradedSub?.status).toBe('Graded');
      expect(gradedSub?.obtainedMarks).toBe(46);
      expect(gradedSub?.feedback).toBe('Well-structured solution with great tests.');
    }
  });
});
