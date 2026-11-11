# EduSphere — Next-Gen Online Learning Management System (LMS)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

**EduSphere** is a modern, enterprise-grade Online Learning Management System designed with clean software architecture, role-based access control (RBAC), third-party REST API integration, and client-side data persistence.

---

## 🌟 Architecture & Highlights

- **Frontend Core**: React 18+ with strict TypeScript, Vite bundling, and component-driven architecture.
- **Design System**: Tailored Emerald & Blue palette with full Light & Dark mode support, collapsible sidebar, responsive drawers, and modern accessible dialogs.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions across **Admin**, **Instructor**, and **Student** roles with instant 1-click role-switching for seamless evaluation.
- **Third-Party API Integration**: Centralized Axios client integrating DummyJSON (`https://dummyjson.com/products`) with graceful offline fallback and local persistence.
- **State Management**: Centralized React Context API (`AuthContext`, `CourseContext`, `StudentContext`, `InstructorContext`, `EnrollmentContext`, `LearningContext`, `ThemeContext`).
- **Resilient Data Layer**: Versioned `localStorage` service (`edusphere_v1_*`) with schema integrity, corruption safeguards, and migration handling.
- **Automated Verification**: Vitest unit test suite covering auth, CRUD operations, duplicate enrollment prevention, and progress calculations.

---

## 🚀 Live Demo & Quick Accounts

EduSphere includes pre-configured demo credentials and 1-click instant login buttons directly on the sign-in screen:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@edusphere.com` | `adminPassword123` | Full system administration, course CRUD, student CRUD, faculty assignments, enrollment management, reports & analytics |
| **Instructor** | `instructor@edusphere.com` | `demoSecurePass123` | Course catalog, student directory, assessment grading, lesson progress inspection |
| **Student** | `student@edusphere.com` | `demoSecurePass123` | Course enrollment, interactive lesson checklist, timed quizzes, assignment submissions, marks display |

*Tip: You can also toggle active roles on the fly using the **Role Switcher Pill** in the top navigation bar!*

---

## 📦 Implemented Modules (1 through 9)

Every module is fully implemented with real functional state and zero placeholder interactions:

### 🔐 Module 1: Authentication & RBAC
- **Login, Register & Forgot Password**: Form validation powered by **Zod** and **React Hook Form**.
- **Password Visibility**: Interactive show/hide toggle.
- **Protected Routes**: Navigation guards enforcing role permissions (`ProtectedRoute.tsx`).
- **Session Persistence**: Stored and synced with `localStorage`.

### 📊 Module 2: Dashboard
- **Dynamic KPI Cards**: Real-time counts for Total Courses, Students, Instructors, Enrolled Courses, and Completed Courses.
- **Upcoming Classes**: Live schedule feed with course tags and join links.
- **Recent Activities Stream**: Real-time event log for enrollments, quiz completions, and submissions.
- **Quick Action Cards**: Shortcuts for rapid administrative workflows.

### 📚 Module 3: Course Management
- **Third-Party Integration**: Live fetch from DummyJSON products API mapped to course entities.
- **Views**: Grid and Table layout toggle.
- **Filtering & Search**: Real-time keyword search, category filter, skill level filter, and sorting (Name, Rating, Price, Duration).
- **Course CRUD**: Add new courses, edit existing entries, and delete with confirmation modals.
- **Course Details Page**: High-resolution thumbnail, syllabus breakdown, duration, level, rating, and direct enrollment button.
- **Pagination & Skeletons**: Client-side pagination with skeleton loading states.

### 👨‍🎓 Module 4: Student Management
- **Full Student CRUD**: Add, edit, and delete student records with modal forms.
- **Data Fields**: Full Name, Email, Mobile Number, Address, Qualification, Enrollment Date, and Status.
- **Search & Filter**: Search across name, email, qualification, and phone number with status filtering (Active, Inactive, Graduated).

### 📝 Module 5: Course Enrollment
- **Enrollment Pipeline**: Enroll any registered student into any active curriculum course.
- **Duplicate Prevention**: Logical constraints strictly preventing duplicate enrollments for the same student-course pair.
- **Enrollment History**: Overview table with enrollment date timestamps and progress indicators.
- **Unenrollment**: Withdraw students with confirmation prompts.

### 👨‍🏫 Module 6: Instructor Management
- **Faculty Directory**: Instructor cards displaying experience, specialization, contact email, and rating.
- **Instructor CRUD**: Add, edit, and remove faculty profiles.
- **Course Assignment**: Assign active curriculum courses directly to faculty members.
- **Instructor Profile Page**: Dedicated view showcasing bio, credentials, and courses taught.

### 📈 Module 7: Learning Progress
- **Dynamic Progress Calculation**: Course completion percentage computed from completed vs total lessons.
- **Interactive Lesson Checklist**: Click any course to open the interactive lesson modal and toggle lessons as completed or pending in real-time.
- **Visual Progress Bars**: Color-coded indicators reflecting learner milestones.
- **Student-wise Inspection**: Filter progress by individual learner.

### 📋 Module 8: Assignments & Quizzes
- **Assignment Submissions**: View assignment details, deadlines, and submit code snippets or GitHub repo links with immediate status updates (Pending → Submitted → Graded).
- **Interactive Timed Quiz**: Real-time quiz interface with multiple-choice questions, live timer, and instant scoring with answer explanations.
- **Marks Display**: Review marks weightage, scores, and pass/fail indicators.

### 📉 Module 9: Reports & Analytics
- **Recharts Visualizations**:
  - Monthly enrollment and completion velocity bar chart.
  - Curriculum category distribution donut chart.
  - Monthly gross revenue trend line chart.
- **Leaderboards**: Top rated courses ranked by student evaluation.
- **CSV Data Export**: One-click download of institutional analytics reports.

---

## 🛠️ Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/maheswari-pinneti/Online-Learning-Management-System.git
   cd Online-Learning-Management-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to explore the application.

4. **Run the automated test suite**:
   ```bash
   npm test
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```
   Production artifacts will be generated in the `dist/` directory.

---

## 🧪 Testing Coverage

The automated test suite (`vitest`) verifies critical domain logic across 4 test suites and 13 unit tests:
- `src/test/auth.test.tsx`: Validation schemas (Zod), credential checks, role switching, logout.
- `src/test/crud.test.tsx`: Course CRUD, Student CRUD, and Instructor course assignments.
- `src/test/enrollment.test.tsx`: Enrollment pipeline and duplicate enrollment prevention.
- `src/test/learning.test.tsx`: Progress percentage calculations, assignment grading, and quiz score evaluation.

---

## 📂 Project Directory Structure

```text
Online-Learning-Management-System/
├── dist/                     # Optimized production build artifacts
├── docs/                     # Specifications and architectural documentation
│   ├── ARCHITECTURE.md
│   ├── REQUIREMENTS.md
│   └── README.md
├── src/
│   ├── components/           # Reusable UI component library
│   │   ├── common/           # Button, Input, Select, Badge, Card, Modal, Pagination
│   │   ├── feedback/         # LoadingSpinner, SkeletonLoader, EmptyState
│   │   └── layout/           # Navbar, Sidebar, Breadcrumbs, NotificationPanel, Layout
│   ├── context/              # Centralized Context API Providers
│   │   ├── AuthContext.tsx
│   │   ├── CourseContext.tsx
│   │   ├── StudentContext.tsx
│   │   ├── InstructorContext.tsx
│   │   ├── EnrollmentContext.tsx
│   │   ├── LearningContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/                # Module Page Views
│   │   ├── auth/             # Login, Register, ForgotPassword
│   │   ├── dashboard/        # Dashboard
│   │   ├── courses/          # CourseList, CourseDetails, CourseModal
│   │   ├── students/         # StudentList, StudentModal
│   │   ├── enrollment/       # EnrollmentManager
│   │   ├── instructors/      # InstructorList, InstructorProfile, InstructorModal
│   │   ├── progress/         # ProgressTracker
│   │   ├── assignments/      # AssignmentsQuizzes
│   │   └── reports/          # ReportsAnalytics
│   ├── routes/               # AppRoutes & ProtectedRoute
│   ├── services/             # Axios client, CourseService (DummyJSON), StorageService
│   ├── test/                 # Vitest test setup and test specs
│   ├── types/                # Strict TypeScript domain interfaces
│   ├── utils/                # Formatters, Zod validators, mock seed data
│   ├── App.tsx               # Root component with providers
│   ├── index.css             # Tailwind CSS directives
│   └── main.tsx              # DOM mount
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
