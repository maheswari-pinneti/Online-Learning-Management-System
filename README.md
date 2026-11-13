# EduSphere LMS — Module 3: Course Management

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DummyJSON API](https://img.shields.io/badge/API-DummyJSON-00B4D8)](https://dummyjson.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 3: Course Management** of the **EduSphere** Online Learning Management System. This module provides a complete curriculum administration suite with third-party API integration (DummyJSON), full CRUD functionality, multi-parameter filtering, sorting, pagination, and course details exploration.

---

## 📌 Module 3 Features

- **Third-Party API Integration (`https://dummyjson.com`)**:
  - Live API consumption via centralized Axios client (`src/services/api.ts`).
  - Fetches external course catalog (`src/services/courseService.ts`) and maps remote schema to EduSphere course models.
  - Seamless fallback to local storage seed data if the network is offline.
- **Course List & Grid View (`src/pages/courses/CourseList.tsx`)**:
  - Responsive card grid displaying course thumbnail, title, instructor, duration, level, pricing, category tag, and star rating.
  - Interactive status badges (`Beginner`, `Intermediate`, `Advanced`).
- **Course Details Page (`src/pages/courses/CourseDetails.tsx`)**:
  - Full course overview, objectives, syllabus preview, instructor info, enrolled learner statistics, and pricing cards.
  - 1-click enrollment and direct navigation to learning tracking.
- **Complete Course CRUD Operations**:
  - **Create Course**: Modal form with field validation (`CourseModal.tsx`).
  - **Edit Course**: Pre-filled update dialog with real-time UI synchronization.
  - **Delete Course**: Confirmation prompt with state cleanup.
- **Search, Filtering & Sorting**:
  - **Real-Time Search**: Search courses by title, instructor name, or keywords.
  - **Category Filter**: Filter by Web Development, Cloud & DevOps, Data Science, AI & Machine Learning, Mobile Development, Cybersecurity, Design & UX.
  - **Sorting**: Sort alphabetically by course name (A–Z, Z–A), price (low to high, high to low), or rating.
  - **Level Filter**: Filter by All, Beginner, Intermediate, Advanced.
- **Pagination**:
  - Client-side pagination with configurable page sizes (6, 12, 24 items per page).
- **Loading & Error Handling**:
  - Shimmer skeleton loaders while fetching courses.
  - Resilient empty states when search/filter returns 0 matches.
  - Toast error notifications with retry capability.

---

## 🏗️ Course Entity Schema

Each course in EduSphere includes:
- **Course Thumbnail**: High-resolution image URL.
- **Course Name**: Full descriptive course title.
- **Instructor Name**: Assigned faculty leader.
- **Category**: Academic subject area.
- **Duration**: Total curriculum hours (e.g., `32h`).
- **Course Level**: Beginner, Intermediate, or Advanced.
- **Price**: Tuition price (or Free tier).
- **Description**: Comprehensive overview and learning objectives.
- **Rating**: Multi-star evaluation metric (e.g., `4.8 / 5.0`).

---

## 🧪 Automated Testing

Unit and integration tests for Course CRUD are located in [`src/test/crud.test.tsx`](./src/test/crud.test.tsx):
- Verifies initial course loading from mock data and API services.
- Tests creating a new course and asserting state changes.
- Tests updating existing course attributes (e.g., price, instructor).
- Tests deleting courses and handling cascades.

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
