# Online Learning Management System (LMS) - Project Requirements & Specification

## 1. Project Overview
The **Online Learning Management System (LMS)** is a comprehensive, responsive web application engineered to manage online education operations. The platform serves administrators, instructors, and students by providing course catalog browsing, student and instructor records management, course enrollment, interactive progress tracking, assessments/quizzes, and actionable reporting analytics.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework & Build** | React.js (Vite) | High-performance single page application (SPA) runtime and tooling |
| **Styling** | Tailwind CSS | Utility-first responsive design, modern UI components, mobile-first design |
| **Routing** | React Router v6 | Client-side routing, nested routes, and protected routes |
| **Global State** | Context API | Global state management for Authentication, Courses, Students, Enrollments, Instructors |
| **Data Fetching** | Axios / Fetch API | Third-party REST API integration (DummyJSON / MockAPI) |
| **Form Handling** | React Hook Form | Robust form validation, error states, and submission handling |
| **Notifications** | React Toastify | User feedback alerts for CRUD actions, authentication, and validation |
| **Data Persistence**| Local Storage | Client-side persistent cache for user sessions, custom courses, and mock records |

---

## 3. Detailed Module Specifications

### Module 1: Authentication
Develop a static authentication module with mock user authentication and role-based access control.
- **Features**:
  - **Login**: Email & password authentication with validation.
  - **Register**: User sign-up with role selection (Student / Instructor / Admin).
  - **Forgot Password UI**: Clean password recovery interface with mock OTP/email dispatch.
  - **Form Validation**: Strict email pattern, minimum password length, required field checks (React Hook Form).
  - **Password Show/Hide**: Toggle visibility for password fields.
  - **Protected Routes**: Navigation guards preventing unauthorized access to internal dashboard pages.
  - **Logout**: Session termination, clearing active credentials from context and Local Storage.
  - **Local Storage Integration**: Persistent user profile and authentication tokens.

---

### Module 2: Dashboard
Create a responsive, high-level administrative and learner dashboard displaying:
- **Stat Cards**:
  - Total Courses count
  - Total Students registered
  - Total Instructors
  - Active Enrolled Courses
  - Completed Courses
- **Upcoming Classes & Events**: Schedule list with dates, times, and instructor tags.
- **Recent Activities**: Real-time event log (e.g., student enrollments, course submissions, grade publishes).
- **Quick Action Cards**: Shortcuts to "Add Course", "Enroll Student", "Create Quiz", "View Reports".

---

### Module 3: Course Management
Integrate a Third-Party API (DummyJSON / MockAPI / JSONPlaceholder / ReqRes) combined with Local Storage for persistence.
- **Features**:
  - **Course List Display**: Grid and table views with responsive course cards.
  - **Course Details Page**: Full syllabus, overview, instructor info, price, duration, and reviews.
  - **Add Course**: Modal/form to register new courses.
  - **Edit Course**: Update existing course information with pre-populated form fields.
  - **Delete Course**: Confirmation prompt and deletion with state update.
  - **Search & Filters**: Real-time keyword search, category filter (Development, Design, Business, etc.).
  - **Sorting**: Sort courses by name, rating, or duration.
  - **Pagination**: Client-side pagination controls (e.g., 6 or 8 courses per page).
  - **Loading & Error Handling**: Skeleton loaders and alert banners for network states.
- **Course Attributes**:
  - Course Thumbnail (Image URL)
  - Course Name
  - Instructor Name
  - Category
  - Duration (Hours/Weeks)
  - Course Level (Beginner / Intermediate / Advanced)
  - Price (Free / Paid amount)
  - Description
  - Rating (1.0 to 5.0 with star display)

---

### Module 4: Student Management
Implement comprehensive Student CRUD operations:
- **Student Data Fields**:
  - Full Name
  - Email Address
  - Mobile Number
  - Physical / Mailing Address
  - Highest Qualification (e.g., High School, Bachelor's, Master's, PhD)
  - Enrollment Date
- **Features**:
  - Add new student with form validation.
  - Edit existing student records.
  - Delete student records with confirmation.
  - Real-time search by name, email, or qualification.
  - Pagination for student directory.
  - Input validation (valid email format, 10-digit mobile number, required fields).

---

### Module 5: Course Enrollment
Develop student-to-course enrollment pipeline:
- **Features**:
  - **Enroll Student into Course**: Select student and course via modal/dropdown.
  - **View Enrolled Courses**: Comprehensive list showing which students are enrolled in which courses.
  - **Remove Enrollment**: Unenroll student with confirmation.
  - **Display Enrollment Date**: Formatted timestamp for each registration.
  - **Enrollment Summary**: Summary widget showing total enrollments per course.
  - **Duplicate Prevention**: Logical checks to prevent a student from enrolling into the same course twice.
  - **Persistence**: Store and retrieve enrollment mappings from Local Storage.

---

### Module 6: Instructor Management
Manage instructor profiles, expertise, and course assignments:
- **Instructor Data Fields**:
  - Full Name
  - Email Address
  - Years of Experience
  - Specialization (e.g., Full Stack Web Development, Cloud Computing, UI/UX Design)
  - Profile Image URL
- **Features**:
  - Instructor Directory listing with card views.
  - Add new instructor.
  - Edit instructor profile.
  - Delete instructor profile.
  - Search instructors by name or specialization.
  - Assign courses to instructors.
  - Dedicated Instructor Profile page detailing bio, assigned courses, and contact information.

---

### Module 7: Learning Progress
Track and visualize learner milestones:
- **Features**:
  - **Course Completion Percentage**: Dynamic calculation based on completed vs. total lessons.
  - **Lesson Counters**: Completed lessons and pending lessons breakdown.
  - **Progress Bar**: Color-coded progress indicators (e.g., green for >75%, yellow for 25-75%, red for <25%).
  - **Student-wise Progress**: Filter and inspect progress for individual students across enrolled courses.
  - **Overall Platform Statistics**: Average completion rate across the entire LMS.

---

### Module 8: Assignments & Quizzes
Interactive student assessment tools:
- **Features**:
  - **Assignment List**: Table/list of assignments categorized by course.
  - **Quiz List**: List of active quizzes with duration and question counts.
  - **Assignment Details**: Detailed prompt, submission guidelines, and file upload interface (mock).
  - **Quiz Instructions & Interface**: Timed mock quiz modal with multiple-choice questions.
  - **Submission Status**: Visual badges (Pending, Submitted, Graded, Overdue).
  - **Marks & Score Display**: Calculated test score with feedback badge.
  - **Deadline Indicator**: Urgency badges for upcoming or expired due dates.

---

### Module 9: Reports & Analytics
Comprehensive visual insights into platform activity:
- **Metrics Displayed**:
  - Total Students & Total Courses
  - Active Enrollments count
  - Top Rated Courses leaderboard
  - Monthly Enrollment velocity
  - Course category distribution
- **Data Visualizations**:
  - Interactive charts (using Recharts or Chart.js) for monthly enrollments, completion rates, and category distribution.
  - Exportable summary reports (printable / CSV format).

---

## 4. UI/UX Requirements
- **Responsive Layout**: Seamless experience on Mobile (<640px), Tablet (640px - 1024px), and Desktop (>1024px).
- **Sidebar Navigation**: Collapsible sidebar with active link highlights, user badge, and mobile drawer.
- **Reusable UI Components**:
  - `Button`, `Input`, `Select`, `Badge`, `Card`, `Modal`
  - `Pagination` component with page size options
  - `SkeletonLoader` for content loading states
  - `LoadingSpinner` for async operations
  - `EmptyState` component with call-to-action buttons
- **Toast Notifications**: Powered by `react-toastify` for success, error, and info triggers.
- **Clean Architecture**: Modular folder structure separating components, pages, contexts, services, and hooks.
