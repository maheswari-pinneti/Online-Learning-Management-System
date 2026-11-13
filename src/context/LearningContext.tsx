import React, { createContext, useContext, useState } from 'react';
import {
  Assignment,
  Quiz,
  AssignmentSubmission,
  QuizSubmission,
  StudentProgress,
  Enrollment,
} from '@/types';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_QUIZZES,
} from '@/utils/mockData';
import { useEnrollment } from './EnrollmentContext';
import { useCourses } from './CourseContext';
import { useStudents } from './StudentContext';

interface LearningContextType {
  assignments: Assignment[];
  quizzes: Quiz[];
  assignmentSubmissions: AssignmentSubmission[];
  quizSubmissions: QuizSubmission[];
  toggleLessonCompletion: (studentId: string, courseId: string, lessonId: string) => void;
  getCourseProgress: (studentId: string, courseId: string) => StudentProgress | null;
  getAllStudentProgress: () => StudentProgress[];
  submitAssignment: (assignmentId: string, studentId: string, content: string) => AssignmentSubmission;
  gradeAssignment: (submissionId: string, marks: number, feedback: string) => void;
  submitQuiz: (quizId: string, studentId: string, answers: Record<string, number>) => QuizSubmission;
  getAssignmentSubmission: (assignmentId: string, studentId: string) => AssignmentSubmission | undefined;
  getQuizSubmission: (quizId: string, studentId: string) => QuizSubmission | undefined;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Assignment;
  addQuiz: (quiz: Omit<Quiz, 'id'>) => Quiz;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { enrollments, updateEnrollmentStatus } = useEnrollment();
  const { courses } = useCourses();
  const { students } = useStudents();

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    return StorageService.get<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    return StorageService.get<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  });

  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => {
    return StorageService.get<AssignmentSubmission[]>(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, []);
  });

  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>(() => {
    return StorageService.get<QuizSubmission[]>(STORAGE_KEYS.QUIZ_SUBMISSIONS, []);
  });

  // Toggle lesson completed/pending in enrollment
  const toggleLessonCompletion = (studentId: string, courseId: string, lessonId: string) => {
    const enrollment = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
    if (!enrollment) return;

    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const completed = new Set(enrollment.completedLessons || []);
    if (completed.has(lessonId)) {
      completed.delete(lessonId);
    } else {
      completed.add(lessonId);
    }

    const updatedCompletedLessons = Array.from(completed);
    const totalLessons = course.lessons?.length || course.totalLessons || 1;
    const progressPercentage = Math.min(100, Math.round((updatedCompletedLessons.length / totalLessons) * 100));

    // Update in localStorage
    const allEnrollments = StorageService.get<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
    const idx = allEnrollments.findIndex((e) => e.id === enrollment.id);
    if (idx !== -1) {
      allEnrollments[idx] = {
        ...allEnrollments[idx],
        completedLessons: updatedCompletedLessons,
        progressPercentage,
        status: progressPercentage === 100 ? 'Completed' : 'Enrolled',
        lastAccessedAt: new Date().toISOString(),
      };
      StorageService.set(STORAGE_KEYS.ENROLLMENTS, allEnrollments);
      if (progressPercentage === 100) {
        updateEnrollmentStatus(enrollment.id, 'Completed');
      }
    }
  };

  const getCourseProgress = (studentId: string, courseId: string): StudentProgress | null => {
    const enrollment = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
    const course = courses.find((c) => c.id === courseId);
    const student = students.find((s) => s.id === studentId);

    if (!enrollment || !course) return null;

    const totalLessons = course.lessons?.length || course.totalLessons || 1;
    const completedLessonsCount = (enrollment.completedLessons || []).length;
    const pendingLessonsCount = Math.max(0, totalLessons - completedLessonsCount);
    const completionPercentage = Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100));

    return {
      studentId,
      courseId,
      courseName: course.title,
      studentName: student ? student.fullName : 'Student',
      totalLessons,
      completedLessonsCount,
      pendingLessonsCount,
      completionPercentage,
      status: enrollment.status,
      lastUpdated: enrollment.lastAccessedAt,
    };
  };

  const getAllStudentProgress = (): StudentProgress[] => {
    const list: StudentProgress[] = [];
    enrollments.forEach((e) => {
      const prog = getCourseProgress(e.studentId, e.courseId);
      if (prog) list.push(prog);
    });
    return list;
  };

  const submitAssignment = (
    assignmentId: string,
    studentId: string,
    content: string
  ): AssignmentSubmission => {
    const student = students.find((s) => s.id === studentId);
    const newSubmission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId,
      studentName: student ? student.fullName : 'Student',
      submittedAt: new Date().toISOString(),
      content,
      status: 'Submitted',
    };

    const updated = [newSubmission, ...assignmentSubmissions];
    setAssignmentSubmissions(updated);
    StorageService.set(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, updated);
    return newSubmission;
  };

  const gradeAssignment = (submissionId: string, marks: number, feedback: string) => {
    const updated = assignmentSubmissions.map((s) =>
      s.id === submissionId
        ? { ...s, obtainedMarks: marks, feedback, status: 'Graded' as const }
        : s
    );
    setAssignmentSubmissions(updated);
    StorageService.set(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, updated);
  };

  const submitQuiz = (
    quizId: string,
    studentId: string,
    answers: Record<string, number>
  ): QuizSubmission => {
    const quiz = quizzes.find((q) => q.id === quizId);
    const student = students.find((s) => s.id === studentId);
    if (!quiz) throw new Error('Quiz not found');

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = correctCount;
    const totalMarks = quiz.questions.length;
    const percentage = Math.round((score / totalMarks) * 100);
    const passed = percentage >= quiz.passingScorePercentage;

    const submission: QuizSubmission = {
      id: `qsub-${Date.now()}`,
      quizId,
      studentId,
      studentName: student ? student.fullName : 'Student',
      submittedAt: new Date().toISOString(),
      answers,
      score,
      totalMarks,
      percentage,
      passed,
    };

    const updated = [submission, ...quizSubmissions];
    setQuizSubmissions(updated);
    StorageService.set(STORAGE_KEYS.QUIZ_SUBMISSIONS, updated);
    return submission;
  };

  const getAssignmentSubmission = (
    assignmentId: string,
    studentId: string
  ): AssignmentSubmission | undefined => {
    return assignmentSubmissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId
    );
  };

  const getQuizSubmission = (
    quizId: string,
    studentId: string
  ): QuizSubmission | undefined => {
    return quizSubmissions.find((s) => s.quizId === quizId && s.studentId === studentId);
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>): Assignment => {
    const newAsg: Assignment = {
      ...assignment,
      id: `asg-${Date.now()}`,
    };
    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    StorageService.set(STORAGE_KEYS.ASSIGNMENTS, updated);
    return newAsg;
  };

  const addQuiz = (quiz: Omit<Quiz, 'id'>): Quiz => {
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
    };
    const updated = [newQuiz, ...quizzes];
    setQuizzes(updated);
    StorageService.set(STORAGE_KEYS.QUIZZES, updated);
    return newQuiz;
  };

  return (
    <LearningContext.Provider
      value={{
        assignments,
        quizzes,
        assignmentSubmissions,
        quizSubmissions,
        toggleLessonCompletion,
        getCourseProgress,
        getAllStudentProgress,
        submitAssignment,
        gradeAssignment,
        submitQuiz,
        getAssignmentSubmission,
        getQuizSubmission,
        addAssignment,
        addQuiz,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = (): LearningContextType => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
