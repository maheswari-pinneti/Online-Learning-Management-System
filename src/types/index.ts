export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  enrolledCourseIds?: string[];
  assignedCourseIds?: string[];
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  content: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  category: string;
  duration: string; // e.g. "12 Hours" or "6 Weeks"
  durationHours: number;
  level: CourseLevel;
  price: number;
  rating: number;
  ratingCount: number;
  totalLessons: number;
  lessons: Lesson[];
  isCustom?: boolean; // true if created locally by user
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  qualification: string;
  enrollmentDate: string; // ISO date string
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'Graduated';
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  experienceYears: number;
  specialization: string;
  profileImage: string;
  bio: string;
  assignedCourseIds: string[];
  rating: number;
}

export type EnrollmentStatus = 'Enrolled' | 'Completed' | 'Dropped';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string; // ISO date string
  status: EnrollmentStatus;
  completedLessons: string[]; // array of Lesson IDs
  progressPercentage: number;
  lastAccessedAt: string;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  totalLessons: number;
  completedLessonsCount: number;
  pendingLessonsCount: number;
  completionPercentage: number;
  status: EnrollmentStatus;
  lastUpdated: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  totalMarks: number;
  passingMarks: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  passingScorePercentage: number;
}

export type SubmissionStatus = 'Pending' | 'Submitted' | 'Graded' | 'Overdue';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachmentUrl?: string;
  status: SubmissionStatus;
  obtainedMarks?: number;
  feedback?: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'assignment';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface DashboardStatistics {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgressRate: number;
  topRatedCourses: Course[];
  monthlyEnrollments: { month: string; count: number; revenue: number }[];
  categoryDistribution: { name: string; count: number }[];
}

export interface UpcomingClass {
  id: string;
  title: string;
  courseName: string;
  instructorName: string;
  dateTime: string;
  durationMinutes: number;
  roomUrl?: string;
}

export interface ActivityItem {
  id: string;
  type: 'enrollment' | 'course_created' | 'assignment_submitted' | 'quiz_completed' | 'student_registered';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}
