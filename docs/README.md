# Online Learning Management System (LMS) - Documentation

This repository houses the complete design, architecture, and implementation documentation for the **Online Learning Management System (LMS)**. Built with React.js, Tailwind CSS, Context API, and Third-Party REST APIs.

---

## 📑 Documentation Structure

- [**Full Project Requirements & Specifications**](./REQUIREMENTS.md): Exhaustive specification of all 9 modules, technology stack, features, and UI/UX requirements.
- [**System Architecture & Directory Structure**](./ARCHITECTURE.md): Component architecture, Context API state management design, and directory layout.
- [**API & Data Models**](./API_SPECIFICATION.md): Data schemas and third-party API integration guidelines.

---

## 🚀 Module Roadmap & Git Branches

The development workflow is partitioned across 9 functional branches plus this documentation branch:

| Branch | Module Name | Scope & Core Deliverables |
| :--- | :--- | :--- |
| [`docs`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/docs) | Project Documentation | Requirements, technical architecture, and design guides |
| [`module-1`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-1) | Module 1: Authentication | Login, Register, Forgot Password UI, Protected Routes, LocalStorage auth |
| [`module-2`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-2) | Module 2: Dashboard | KPI metrics cards, upcoming classes, recent activities, quick action cards |
| [`module-3`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-3) | Module 3: Course Management | Third-party API integration, Course CRUD, search, filter, sort, pagination |
| [`module-4`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-4) | Module 4: Student Management | Student directory, CRUD, validation, search, pagination |
| [`module-5`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-5) | Module 5: Course Enrollment | Student-to-course enrollment, duplicate prevention, enrollment history |
| [`module-6`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-6) | Module 6: Instructor Management | Instructor CRUD, course assignment, instructor profile pages |
| [`module-7`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-7) | Module 7: Learning Progress | Course completion %, lesson counters, visual progress bars |
| [`module-8`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-8) | Module 8: Assignments & Quizzes | Assessment lists, submission tracking, deadline indicators, marks display |
| [`module-9`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/module-9) | Module 9: Reports & Analytics | Statistical dashboards, charts, top-rated courses, enrollment trends |
| [`main`](https://github.com/maheswari-pinneti/Online-Learning-Management-System/tree/main) | Production Release | Stable merged build combining all integrated modules |

---

## 🛠️ Technology Stack Overview

- **Frontend Core**: React 18 / 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 (BrowserRouter, Routes, Route, Navigate)
- **State Management**: React Context API (`AuthContext`, `CourseContext`, `StudentContext`, `EnrollmentContext`, `InstructorContext`)
- **API Client**: Axios / Native Fetch API
- **Form Management**: React Hook Form
- **Alerts & Feedback**: React Toastify
- **Icons**: Lucide React / Heroicons
- **Local Storage**: Persistent client-side mock store with seed data
