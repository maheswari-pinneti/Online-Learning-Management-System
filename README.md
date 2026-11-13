# EduSphere LMS — Module 4: Student Management

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 4: Student Management** of the **EduSphere** Online Learning Management System. This module delivers student directory management with full CRUD capabilities, form validation, real-time search, qualification tagging, and pagination.

---

## 📌 Module 4 Features

- **Student Directory Table (`src/pages/students/StudentList.tsx`)**:
  - Displays registered students with custom avatars, contact details, qualifications, and enrollment dates.
  - Quick action buttons for Editing profile, Enrolling into courses, or Deleting records.
- **Complete Student CRUD Operations**:
  - **Add Student**: Interactive modal form (`StudentModal.tsx`) with strict schema validation.
  - **Edit Student**: Pre-populated editing dialog to update personal info, qualifications, and mobile numbers.
  - **Delete Student**: Deletion confirmation with automatic cascade cleanup from enrollment pools.
- **Comprehensive Student Data Fields**:
  - **Full Name**: Learner's complete formal name.
  - **Email**: Academic or personal contact email (pattern verified).
  - **Mobile Number**: Direct phone contact number.
  - **Address**: Residential/mailing address or city.
  - **Qualification**: Educational background (e.g., `B.S. Computer Science`, `M.S. Data Analytics`, `High School Diploma`).
  - **Enrollment Date**: Official date of platform registration (`YYYY-MM-DD`).
- **Real-Time Search & Filtering**:
  - Dynamic instant search across student names, email addresses, and qualifications.
  - Live filtered count indicators.
- **Client-Side Pagination**:
  - Configurable page navigation supporting expanding student rosters.
- **Form Validation & Error States**:
  - Validated with **React Hook Form** + **Zod** schema (`src/utils/validators.ts`).
  - Clear error messaging for missing or malformed inputs.
- **Local Storage Persistence**:
  - Automatic synchronization with `edusphere_v1_students` in `StudentContext.tsx`.

---

## 🧪 Automated Testing

Unit and integration tests for Student Management are located in [`src/test/crud.test.tsx`](./src/test/crud.test.tsx):
- Verifies initial student directory loading.
- Tests creating new student records with complete fields.
- Tests editing existing student details.
- Tests deleting student records.

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
