import React, { createContext, useContext, useState } from 'react';
import { Student } from '@/types';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';
import { INITIAL_STUDENTS } from '@/utils/mockData';
import { StudentFormData } from '@/utils/validators';

interface StudentContextType {
  students: Student[];
  addStudent: (data: StudentFormData) => Student;
  updateStudent: (id: string, data: Partial<Student>) => Student;
  deleteStudent: (id: string) => boolean;
  getStudentById: (id: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    return StorageService.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  });

  const syncStudents = (updated: Student[]) => {
    setStudents(updated);
    StorageService.set(STORAGE_KEYS.STUDENTS, updated);
  };

  const addStudent = (data: StudentFormData): Student => {
    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      address: data.address,
      qualification: data.qualification,
      enrollmentDate: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
      status: data.status || 'Active',
    };

    const updated = [newStudent, ...students];
    syncStudents(updated);
    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>): Student => {
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found.`);
    }

    const updatedStudent: Student = {
      ...students[index],
      ...data,
    };

    const updated = [...students];
    updated[index] = updatedStudent;
    syncStudents(updated);
    return updatedStudent;
  };

  const deleteStudent = (id: string): boolean => {
    const updated = students.filter((s) => s.id !== id);
    if (updated.length === students.length) return false;
    syncStudents(updated);
    return true;
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find((s) => s.id === id);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
