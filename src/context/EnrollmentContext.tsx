import React, { createContext, useContext, useState } from 'react';
import { Enrollment, EnrollmentStatus } from '@/types';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';
import { INITIAL_ENROLLMENTS } from '@/utils/mockData';

interface EnrollmentContextType {
  enrollments: Enrollment[];
  enrollStudent: (studentId: string, courseId: string) => Enrollment;
  unenrollStudent: (enrollmentId: string) => boolean;
  updateEnrollmentStatus: (enrollmentId: string, status: EnrollmentStatus) => void;
  isStudentEnrolled: (studentId: string, courseId: string) => boolean;
  getStudentEnrollments: (studentId: string) => Enrollment[];
  getCourseEnrollments: (courseId: string) => Enrollment[];
  getEnrollment: (studentId: string, courseId: string) => Enrollment | undefined;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    return StorageService.get<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
  });

  const syncEnrollments = (updated: Enrollment[]) => {
    setEnrollments(updated);
    StorageService.set(STORAGE_KEYS.ENROLLMENTS, updated);
  };

  const isStudentEnrolled = (studentId: string, courseId: string): boolean => {
    return enrollments.some(
      (e) => e.studentId === studentId && e.courseId === courseId && e.status !== 'Dropped'
    );
  };

  const enrollStudent = (studentId: string, courseId: string): Enrollment => {
    if (isStudentEnrolled(studentId, courseId)) {
      throw new Error('Student is already actively enrolled in this course.');
    }

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      studentId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      status: 'Enrolled',
      completedLessons: [],
      progressPercentage: 0,
      lastAccessedAt: new Date().toISOString(),
    };

    const updated = [newEnrollment, ...enrollments];
    syncEnrollments(updated);
    return newEnrollment;
  };

  const unenrollStudent = (enrollmentId: string): boolean => {
    const updated = enrollments.filter((e) => e.id !== enrollmentId);
    if (updated.length === enrollments.length) return false;
    syncEnrollments(updated);
    return true;
  };

  const updateEnrollmentStatus = (enrollmentId: string, status: EnrollmentStatus) => {
    const index = enrollments.findIndex((e) => e.id === enrollmentId);
    if (index === -1) return;

    const updated = [...enrollments];
    updated[index] = { ...updated[index], status };
    syncEnrollments(updated);
  };

  const getStudentEnrollments = (studentId: string): Enrollment[] => {
    return enrollments.filter((e) => e.studentId === studentId);
  };

  const getCourseEnrollments = (courseId: string): Enrollment[] => {
    return enrollments.filter((e) => e.courseId === courseId);
  };

  const getEnrollment = (studentId: string, courseId: string): Enrollment | undefined => {
    return enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
  };

  return (
    <EnrollmentContext.Provider
      value={{
        enrollments,
        enrollStudent,
        unenrollStudent,
        updateEnrollmentStatus,
        isStudentEnrolled,
        getStudentEnrollments,
        getCourseEnrollments,
        getEnrollment,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = (): EnrollmentContextType => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};
