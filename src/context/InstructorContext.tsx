import React, { createContext, useContext, useState } from 'react';
import { Instructor } from '@/types';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';
import { INITIAL_INSTRUCTORS } from '@/utils/mockData';
import { InstructorFormData } from '@/utils/validators';

interface InstructorContextType {
  instructors: Instructor[];
  addInstructor: (data: InstructorFormData) => Instructor;
  updateInstructor: (id: string, data: Partial<Instructor>) => Instructor;
  deleteInstructor: (id: string) => boolean;
  assignCourseToInstructor: (instructorId: string, courseId: string) => void;
  getInstructorById: (id: string) => Instructor | undefined;
}

const InstructorContext = createContext<InstructorContextType | undefined>(undefined);

export const InstructorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    return StorageService.get<Instructor[]>(STORAGE_KEYS.INSTRUCTORS, INITIAL_INSTRUCTORS);
  });

  const syncInstructors = (updated: Instructor[]) => {
    setInstructors(updated);
    StorageService.set(STORAGE_KEYS.INSTRUCTORS, updated);
  };

  const addInstructor = (data: InstructorFormData): Instructor => {
    const newInstructor: Instructor = {
      id: `inst-${Date.now()}`,
      name: data.name,
      email: data.email,
      experienceYears: data.experienceYears,
      specialization: data.specialization,
      profileImage: data.profileImage,
      bio: data.bio,
      assignedCourseIds: [],
      rating: 5.0,
    };

    const updated = [newInstructor, ...instructors];
    syncInstructors(updated);
    return newInstructor;
  };

  const updateInstructor = (id: string, data: Partial<Instructor>): Instructor => {
    const index = instructors.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Instructor with ID ${id} not found.`);
    }

    const updated = [...instructors];
    updated[index] = { ...instructors[index], ...data };
    syncInstructors(updated);
    return updated[index];
  };

  const deleteInstructor = (id: string): boolean => {
    const updated = instructors.filter((i) => i.id !== id);
    if (updated.length === instructors.length) return false;
    syncInstructors(updated);
    return true;
  };

  const assignCourseToInstructor = (instructorId: string, courseId: string) => {
    const index = instructors.findIndex((i) => i.id === instructorId);
    if (index === -1) return;

    const currentCourses = instructors[index].assignedCourseIds || [];
    if (!currentCourses.includes(courseId)) {
      const updated = [...instructors];
      updated[index] = {
        ...instructors[index],
        assignedCourseIds: [...currentCourses, courseId],
      };
      syncInstructors(updated);
    }
  };

  const getInstructorById = (id: string): Instructor | undefined => {
    return instructors.find((i) => i.id === id);
  };

  return (
    <InstructorContext.Provider
      value={{
        instructors,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        assignCourseToInstructor,
        getInstructorById,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

export const useInstructors = (): InstructorContextType => {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error('useInstructors must be used within an InstructorProvider');
  }
  return context;
};
