import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { EnrollmentProvider, useEnrollment } from '@/context/EnrollmentContext';
import { CourseProvider } from '@/context/CourseContext';
import { StudentProvider } from '@/context/StudentContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CourseProvider>
    <StudentProvider>
      <EnrollmentProvider>{children}</EnrollmentProvider>
    </StudentProvider>
  </CourseProvider>
);

describe('Module 5: Course Enrollment & Duplication Prevention', () => {
  it('enrolls a student into a new course successfully', () => {
    const { result } = renderHook(() => useEnrollment(), { wrapper });

    act(() => {
      const enrollment = result.current.enrollStudent('test-student-99', 'test-course-99');
      expect(enrollment).toBeDefined();
      expect(enrollment.studentId).toBe('test-student-99');
      expect(enrollment.courseId).toBe('test-course-99');
      expect(enrollment.status).toBe('Enrolled');
      expect(enrollment.progressPercentage).toBe(0);
    });

    expect(result.current.isStudentEnrolled('test-student-99', 'test-course-99')).toBe(true);
  });

  it('strictly blocks duplicate enrollments for the same student and course', () => {
    const { result } = renderHook(() => useEnrollment(), { wrapper });

    // Enroll once
    act(() => {
      result.current.enrollStudent('student-unique-1', 'course-unique-1');
    });

    // Attempt duplicate enrollment
    expect(() => {
      result.current.enrollStudent('student-unique-1', 'course-unique-1');
    }).toThrow(/already actively enrolled/i);
  });

  it('unenrolls a student and removes enrollment record', () => {
    const { result } = renderHook(() => useEnrollment(), { wrapper });

    let enrollmentId = '';
    act(() => {
      const enr = result.current.enrollStudent('student-to-remove', 'course-to-remove');
      enrollmentId = enr.id;
    });

    expect(result.current.isStudentEnrolled('student-to-remove', 'course-to-remove')).toBe(true);

    act(() => {
      const removed = result.current.unenrollStudent(enrollmentId);
      expect(removed).toBe(true);
    });

    expect(result.current.isStudentEnrolled('student-to-remove', 'course-to-remove')).toBe(false);
  });
});
