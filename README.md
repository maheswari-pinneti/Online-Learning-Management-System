# EduSphere LMS — Module 5: Course Enrollment

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 5: Course Enrollment** of the **EduSphere** Online Learning Management System. This module bridges learners and curricula with a full enrollment workflow, strict duplicate registration prevention, enrollment status tracking, and local storage persistence.

---

## 📌 Module 5 Features

- **Course Enrollment Hub (`src/pages/enrollment/EnrollmentManager.tsx`)**:
  - Interactive enrollment registration workspace for administrators and students.
  - Multi-select matching linking students to course tracks.
- **Duplicate Enrollment Prevention**:
  - Validates student ID against existing enrollments for the selected course.
  - Rejects duplicate enrollments with an instant user-facing warning notification.
- **View Enrolled Courses**:
  - Rich data table displaying student avatar, learner name, target course thumbnail, course level, instructor, enrollment date, and active status.
- **Unenroll & Remove Enrollment**:
  - Safe unenrollment action with confirmation modal.
  - Automatically cascades to progress records to ensure data integrity.
- **Enrollment Summary & Metrics**:
  - Total Active Enrollments counter.
  - Unique Students enrolled.
  - Unique Courses with active enrollments.
- **Enrollment Date Tracking**:
  - Explicit ISO timestamp formatted with `date-fns` for internationalized presentation.
- **Data Persistence**:
  - Synced with local storage key `edusphere_v1_enrollments` via `EnrollmentContext.tsx`.

---

## 🧪 Automated Testing

Unit and integration tests for Course Enrollment are located in [`src/test/enrollment.test.tsx`](./src/test/enrollment.test.tsx):
- Verifies successful student enrollment into a course.
- **Strictly tests duplicate enrollment prevention** — asserts duplicate attempts are blocked and throw error feedback.
- Tests unenrollment and removal of student enrollment records.

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
