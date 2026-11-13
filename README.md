# EduSphere LMS — Module 7: Learning Progress

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 7: Learning Progress** of the **EduSphere** Online Learning Management System. This module provides real-time learner milestone tracking, lesson checklists, completion percentage calculation, and progress inspection across courses and students.

---

## 📌 Module 7 Features

- **Progress Tracker Hub (`src/pages/progress/ProgressTracker.tsx`)**:
  - Global overview of total enrolled learning records, platform average progress rate, and completed course tracks.
  - Interactive table displaying Student, Course, Category, Completed vs Total Lessons, Progress Bar, and Status Badge (`Enrolled` or `Completed`).
- **Interactive Lesson Completion Checklist (`LessonModal`)**:
  - Modal view for any course showing the complete chronological lesson syllabus.
  - Interactive checkboxes to toggle lessons as Completed or Pending in real-time.
  - Dynamic recalculation of completion percentage: `Math.round((completedLessons.length / totalLessons) * 100)%`.
  - Automatic status update to `Completed` when all syllabus lessons are checked off.
- **Search & Filtering**:
  - Real-time search across student names and course titles.
  - Filter progress records by individual student learner.
- **Context & Storage Synchronization**:
  - Powered by `LearningContext.tsx` and synced to `edusphere_v1_enrollments`.

---

## 🧪 Automated Testing

Unit and integration tests for Learning Progress are located in [`src/test/learning.test.tsx`](./src/test/learning.test.tsx):
- Verifies lesson completion toggling and progress percentage updates.
- Tests automatic transition to `Completed` status upon finishing all lessons.

```bash
# Run tests
npm test
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```
