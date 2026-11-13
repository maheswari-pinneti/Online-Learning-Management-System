import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Course } from '@/types';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';
import { CourseService } from '@/services/courseService';
import { INITIAL_COURSES } from '@/utils/mockData';
import { CourseFormData } from '@/utils/validators';

interface CourseContextType {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  addCourse: (data: CourseFormData) => Course;
  updateCourse: (id: string, data: Partial<Course>) => Course;
  deleteCourse: (id: string) => boolean;
  getCourseById: (id: string) => Course | undefined;
  refreshCourses: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    return StorageService.get<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const syncCoursesWithStorage = (updated: Course[]) => {
    setCourses(updated);
    StorageService.set(STORAGE_KEYS.COURSES, updated);
  };

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedCourses = StorageService.get<Course[]>(STORAGE_KEYS.COURSES, []);
      const externalCourses = await CourseService.fetchExternalCourses();

      if (savedCourses.length === 0) {
        // Initial setup: combine curated initial courses with external courses
        const combined = [...INITIAL_COURSES];
        externalCourses.forEach((ext) => {
          if (!combined.some((c) => c.id === ext.id)) {
            combined.push(ext);
          }
        });
        syncCoursesWithStorage(combined);
      } else {
        // Merge in any new external courses that haven't been deleted or added yet
        const merged = [...savedCourses];
        externalCourses.forEach((ext) => {
          if (!merged.some((c) => c.id === ext.id)) {
            merged.push(ext);
          }
        });
        syncCoursesWithStorage(merged);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load courses';
      setError(msg);
      // Fallback to local storage if available
      const local = StorageService.get<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
      setCourses(local);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const addCourse = (data: CourseFormData): Course => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      instructorId: data.instructorId,
      instructorName: data.instructorId === 'inst-1' ? 'Prof. Marcus Chen' : data.instructorId === 'inst-2' ? 'Dr. Sarah Jenkins' : data.instructorId === 'inst-3' ? 'Elena Rostova' : 'David O\'Connor',
      category: data.category,
      duration: data.duration,
      durationHours: parseInt(data.duration, 10) || 20,
      level: data.level,
      price: data.price,
      rating: data.rating || 5.0,
      ratingCount: 1,
      totalLessons: 3,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: [
        { id: `les-${Date.now()}-1`, title: 'Module 1: Orientation & Core Fundamentals', durationMinutes: 45, order: 1, content: 'Introduction and fundamental concepts.' },
        { id: `les-${Date.now()}-2`, title: 'Module 2: Applied Techniques & Practical Lab', durationMinutes: 60, order: 2, content: 'Deep dive into practical exercises.' },
        { id: `les-${Date.now()}-3`, title: 'Module 3: Project Architecture & Capstone', durationMinutes: 75, order: 3, content: 'Comprehensive project evaluation.' },
      ],
    };

    const updated = [newCourse, ...courses];
    syncCoursesWithStorage(updated);
    return newCourse;
  };

  const updateCourse = (id: string, data: Partial<Course>): Course => {
    const existingIndex = courses.findIndex((c) => c.id === id);
    if (existingIndex === -1) {
      throw new Error(`Course with ID ${id} not found.`);
    }

    const updatedCourse: Course = {
      ...courses[existingIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const updated = [...courses];
    updated[existingIndex] = updatedCourse;
    syncCoursesWithStorage(updated);
    return updatedCourse;
  };

  const deleteCourse = (id: string): boolean => {
    const updated = courses.filter((c) => c.id !== id);
    if (updated.length === courses.length) return false;
    syncCoursesWithStorage(updated);
    return true;
  };

  const getCourseById = (id: string): Course | undefined => {
    return courses.find((c) => c.id === id);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        isLoading,
        error,
        addCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
        refreshCourses: loadCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
