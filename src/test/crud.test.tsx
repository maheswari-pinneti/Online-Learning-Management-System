import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { CourseProvider, useCourses } from '@/context/CourseContext';
import { StudentProvider, useStudents } from '@/context/StudentContext';
import { InstructorProvider, useInstructors } from '@/context/InstructorContext';

const courseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <InstructorProvider>
    <CourseProvider>{children}</CourseProvider>
  </InstructorProvider>
);

const studentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StudentProvider>{children}</StudentProvider>
);

const instructorWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <InstructorProvider>{children}</InstructorProvider>
);

describe('Modules 3, 4, 6: CRUD Operations', () => {
  it('creates, updates, and deletes a course', () => {
    const { result } = renderHook(() => useCourses(), { wrapper: courseWrapper });

    let createdCourseId = '';
    act(() => {
      const created = result.current.addCourse({
        title: 'Vitest Automated Architecture Testing',
        description: 'Complete hands-on unit and integration testing tutorial.',
        category: 'Development',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202?w=600',
        instructorId: 'inst-1',
        duration: '4 Weeks',
        level: 'Intermediate',
        price: 89.99,
        rating: 4.9,
      });
      createdCourseId = created.id;
      expect(created.title).toBe('Vitest Automated Architecture Testing');
    });

    // Update
    act(() => {
      const updated = result.current.updateCourse(createdCourseId, {
        price: 99.99,
        level: 'Advanced',
      });
      expect(updated.price).toBe(99.99);
      expect(updated.level).toBe('Advanced');
    });

    // Delete
    act(() => {
      const deleted = result.current.deleteCourse(createdCourseId);
      expect(deleted).toBe(true);
    });
    expect(result.current.getCourseById(createdCourseId)).toBeUndefined();
  });

  it('creates, updates, and deletes a student record', () => {
    const { result } = renderHook(() => useStudents(), { wrapper: studentWrapper });

    let studentId = '';
    act(() => {
      const created = result.current.addStudent({
        fullName: 'Jordan Lee',
        email: 'jordan.lee@test.com',
        mobileNumber: '+1 555-019-9999',
        address: '100 Silicon Blvd, CA',
        qualification: 'B.Sc Computer Science',
        status: 'Active',
      });
      studentId = created.id;
      expect(created.fullName).toBe('Jordan Lee');
    });

    act(() => {
      const updated = result.current.updateStudent(studentId, {
        qualification: 'M.Sc Data Science',
      });
      expect(updated.qualification).toBe('M.Sc Data Science');
    });

    act(() => {
      const deleted = result.current.deleteStudent(studentId);
      expect(deleted).toBe(true);
    });
    expect(result.current.getStudentById(studentId)).toBeUndefined();
  });

  it('creates, updates, and assigns courses to an instructor', () => {
    const { result } = renderHook(() => useInstructors(), { wrapper: instructorWrapper });

    let instructorId = '';
    act(() => {
      const inst = result.current.addInstructor({
        name: 'Prof. Grace Hopper',
        email: 'hopper@edusphere.edu',
        experienceYears: 20,
        specialization: 'Compiler Architecture & Computing',
        profileImage: 'https://images.unsplash.com/photo-1573496359142?w=200',
        bio: 'Pioneer of computer programming and standards.',
      });
      instructorId = inst.id;
      expect(inst.name).toBe('Prof. Grace Hopper');
    });

    act(() => {
      result.current.assignCourseToInstructor(instructorId, 'course-1');
    });

    const updated = result.current.getInstructorById(instructorId);
    expect(updated?.assignedCourseIds).toContain('course-1');
  });
});
