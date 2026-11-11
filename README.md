# EduSphere LMS — Module 2: Responsive Dashboard

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 2: Responsive Dashboard** of the **EduSphere** Online Learning Management System. This module delivers an executive operations dashboard with real-time statistics, upcoming workshop schedules, live platform activity logs, and quick action shortcuts.

---

## 📌 Module 2 Features

- **Live Dynamic KPI Cards (`src/pages/dashboard/Dashboard.tsx`)**:
  - **Total Courses**: Active curriculum catalog count across multiple academic domains.
  - **Total Students**: Registered student learners in the institution.
  - **Total Instructors**: Active faculty and subject matter experts.
  - **Enrolled Courses**: Ongoing student learning tracks.
  - **Completed Courses**: Verified milestone completions and graduates.
- **Goal Targets & Metric Deltas**:
  - Goal completion progress bars (`Target: 100 Learners`, `% of Goal`).
  - Velocity indicators (`+14.2%`, `Exceeding Benchmark`).
- **Upcoming Classes & Workshops**:
  - Live session schedule with timestamps, assigned faculty, session durations, and instant "Join" actions.
- **Recent Activities Stream**:
  - Real-time audit log of student registrations, quiz completions, assignment submissions, and catalog updates.
- **Quick Action Cards**:
  - Direct navigation shortcuts to "Add Course", "Enroll Student", "Student Directory", and "View Analytics".
- **Top Rated Curriculum Showcase**:
  - Leaderboard preview of top-evaluated courses with rating stars and price badges.

---

## 🔑 User Roles on Dashboard

The dashboard dynamically adjusts its greeting and summary based on the active role (**Admin**, **Instructor**, **Student**). Use the 1-click **Role Switcher** in the top navigation bar to test role-specific dashboard views on the fly.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run automated tests
npm test
```
