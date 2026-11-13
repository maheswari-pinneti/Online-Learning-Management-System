# EduSphere LMS — Module 8: Assignments & Quizzes

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 8: Assignments & Quizzes** of the **EduSphere** Online Learning Management System. This module equips students, instructors, and administrators with comprehensive evaluation pipelines, submission management, deadline tracking, and timed competency quizzes with instant auto-grading.

---

## 📌 Module 8 Features

- **Course Assessment Catalog (`src/pages/assignments/AssignmentsQuizzes.tsx`)**:
  - Tabbed interface switching between **Assignments** and **Quizzes**.
  - Real-time badges for submission states: `Pending`, `Submitted`, and `Graded`.
  - Course tags, assignment descriptions, marks weightage, passing marks criteria, and deadlines.
- **Interactive Assignment Submission Modal**:
  - Clean modal dialog displaying the assignment prompt, instructions, and due date.
  - Monospace text area supporting code submissions, architecture write-ups, or public repository URLs.
  - Updates status in real-time to `Submitted`, disabling duplicate resubmissions until graded.
- **Interactive Timed Quiz Modal**:
  - Timed multiple-choice quiz engine with custom time limits per quiz.
  - Radio question options with interactive selection highlights.
  - Real-time question progress indicator (e.g., `4 of 4 answered`).
  - Auto-grading engine comparing selections against `correctOptionIndex`.
  - Instant score report with pass/fail evaluation based on `passingScorePercentage`.
  - Detailed explanation breakdown for each answer.
- **Persistence & Synchronization**:
  - Powered by `LearningContext.tsx` and persisted via `edusphere_v1_assignment_submissions` and `edusphere_v1_quiz_submissions`.

---

## 🧪 Automated Testing

Unit and integration tests for Module 8 are located in [`src/test/assignments.test.tsx`](./src/test/assignments.test.tsx) and [`src/test/learning.test.tsx`](./src/test/learning.test.tsx):
- Verifies assignment card rendering with due dates and weightage.
- Tests interactive assignment submission and status transition from `Pending` to `Submitted`.
- Tests starting timed quizzes, answering questions, and evaluating scores and pass/fail states.

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
