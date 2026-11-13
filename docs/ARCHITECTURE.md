# System Architecture & Technical Design

## 1. Directory Structure

The project follows a clean, feature-driven React application structure:

```text
online-learning-management/
├── public/
│   ├── favicon.ico
│   └── placeholder-course.jpg
├── src/
│   ├── assets/               # Static assets, branding, and images
│   ├── components/           # Reusable UI Components
│   │   ├── common/           # Button, Modal, Input, Badge, Dropdown, Pagination
│   │   ├── feedback/         # SkeletonLoader, LoadingSpinner, EmptyState
│   │   ├── layout/           # Navbar, Sidebar, Footer, Layout wrapper
│   │   └── cards/            # CourseCard, StatCard, InstructorCard, ActivityCard
│   ├── context/              # Context API Providers
│   │   ├── AuthContext.jsx       # User authentication, tokens & session
│   │   ├── CourseContext.jsx     # Course catalog state & CRUD
│   │   ├── StudentContext.jsx    # Student registry & operations
│   │   ├── EnrollmentContext.jsx # Student-to-course relations & history
│   │   ├── InstructorContext.jsx # Instructor directory & course mapping
│   │   └── ProgressContext.jsx   # Lesson completion & assessment scores
│   ├── pages/                # Route Page Views
│   │   ├── auth/             # Login, Register, ForgotPassword
│   │   ├── dashboard/        # DashboardOverview
│   │   ├── courses/          # CourseList, CourseDetails, CourseForm
│   │   ├── students/         # StudentList, StudentForm, StudentDetails
│   │   ├── enrollment/       # EnrollmentManager, EnrolledCoursesView
│   │   ├── instructors/      # InstructorList, InstructorProfile, InstructorForm
│   │   ├── progress/         # ProgressTracker, StudentProgressDetail
│   │   ├── assignments/      # AssignmentList, QuizView, SubmissionModal
│   │   └── reports/          # AnalyticsDashboard, ExportReports
│   ├── routes/               # Route Configuration & Guards
│   │   ├── AppRoutes.jsx     # Route switch & nested routes
│   │   └── ProtectedRoute.jsx# Auth wrapper guarding dashboard pages
│   ├── services/             # Third-Party API & HTTP Clients
│   │   ├── api.js            # Axios client with base URL & interceptors
│   │   ├── courseService.js  # DummyJSON / MockAPI course endpoints
│   │   └── storageService.js # LocalStorage sync helper
│   ├── utils/                # Helper utilities
│   │   ├── constants.js      # Categories, levels, initial seed data
│   │   ├── formatters.js     # Currency, dates, percentages
│   │   └── validators.js     # Regex patterns & schema helpers
│   ├── App.jsx               # Root application entry with Context Providers
│   ├── index.css             # Tailwind CSS directives & global styling
│   └── main.jsx              # React DOM bootstrap
├── docs/                     # Full Documentation & Specifications
├── .gitignore                # Ignored node_modules, dist, .env
├── package.json              # Project dependencies & scripts
├── tailwind.config.js        # Tailwind styling theme configurations
└── vite.config.js            # Vite bundler configuration
```

---

## 2. Global State Architecture (Context API)

To maintain clean separation of concerns without external state management boilerplate, state is distributed across focused React Contexts:

1. **`AuthContext`**:
   - Holds `currentUser`, `isAuthenticated`, `role` (`admin` / `instructor` / `student`).
   - Persists state in `localStorage` under `lms_user_session`.
   - Methods: `login(email, password)`, `register(userData)`, `logout()`.

2. **`CourseContext`**:
   - Manages courses loaded from DummyJSON / LocalStorage.
   - Methods: `addCourse(course)`, `updateCourse(id, course)`, `deleteCourse(id)`, `getCourseById(id)`.

3. **`StudentContext`**:
   - Maintains student directory.
   - Methods: `addStudent(student)`, `updateStudent(id, student)`, `deleteStudent(id)`.

4. **`EnrollmentContext`**:
   - Manages enrollment associations (`studentId`, `courseId`, `enrollmentDate`, `status`).
   - Prevents duplicate enrollments using composite keys.

5. **`InstructorContext`**:
   - Tracks instructor profiles, experience, and assigned courses.

---

## 3. Third-Party API Strategy

- **Primary Source**: DummyJSON (e.g., `https://dummyjson.com/products` or MockAPI) mapped to course schemas (thumbnail, title, category, price, rating).
- **Fallback / Local Persistence**: On initial run, third-party data is fetched, enriched with course-specific fields (instructor, duration, level, lessons), and synchronized into `localStorage` so user edits/additions persist between reloads.
