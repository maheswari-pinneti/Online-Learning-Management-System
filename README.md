# EduSphere LMS — Module 6: Instructor Management

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 6: Instructor Management** of the **EduSphere** Online Learning Management System. This module provides complete faculty lifecycle management, course teaching assignments, individual instructor portfolio pages, and faculty search.

---

## 📌 Module 6 Features

- **Instructor Roster Directory (`src/pages/instructors/InstructorList.tsx`)**:
  - Grid and table display of faculty members with portraits, contact email, years of experience, and specialization badges.
  - Action buttons to Edit Profile, Assign Courses, View Portfolio, or Remove Faculty.
- **Complete Instructor CRUD Operations**:
  - **Add Instructor**: Modal form (`InstructorModal.tsx`) with schema validation.
  - **Edit Instructor**: Update contact details, specialization, and professional bio.
  - **Delete Instructor**: Confirmation prompt with assignment safety checks.
- **Comprehensive Faculty Fields**:
  - **Name**: Instructor's full professional name.
  - **Email**: Faculty email address.
  - **Experience**: Teaching and industry experience (e.g., `8 years`).
  - **Specialization**: Academic/industry domain (e.g., `Cloud Architecture`, `Full Stack Engineering`, `UX Research`).
  - **Profile Image**: High-resolution faculty portrait.
- **Assign Courses Workflow (`AssignCourseModal.tsx`)**:
  - Assign any course from the platform curriculum to an instructor.
  - Dynamically updates the course's designated instructor and syncs both records.
- **Instructor Profile Page (`InstructorProfile.tsx`)**:
  - Detailed biography, active assigned course tracks, total taught students count, average course rating, and faculty credentials.
- **Search & Filtering**:
  - Real-time search across instructor names, email addresses, and specialized fields.
- **Local Storage Persistence**:
  - Synced to `edusphere_v1_instructors` via `InstructorContext.tsx`.

---

## 🧪 Automated Testing

Unit and integration tests for Instructor Management are located in [`src/test/crud.test.tsx`](./src/test/crud.test.tsx):
- Verifies initial instructor directory loading.
- Tests creating new instructor profiles.
- Tests assigning courses to faculty members.
- Tests deleting instructor records.

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
