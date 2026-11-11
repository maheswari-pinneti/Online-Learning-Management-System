# EduSphere LMS — Module 1: Authentication

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 1: Authentication** of the **EduSphere** Online Learning Management System. This module implements a robust, secure, and user-friendly authentication pipeline with client-side session persistence and role-based access control (RBAC).

---

## 📌 Module 1 Features

- **User Login (`/auth/login`)**:
  - Email & password authentication with strict pattern validation.
  - "Remember Me" session preference checkbox.
  - **1-Click Instant Demo Login**: Quick-switch buttons for **Admin**, **Instructor**, and **Student** accounts for instant evaluation.
- **User Registration (`/auth/register`)**:
  - Account creation with name, email, role selection (Student, Instructor, Admin), password, and confirm password matching.
- **Forgot Password UI (`/auth/forgot-password`)**:
  - Password recovery workflow with mock email dispatch and interactive confirmation screen.
- **Form Validation & Schema Enforcement**:
  - Built with **React Hook Form** and **Zod** (`src/utils/validators.ts`).
  - Strict email regex, minimum password lengths, and password match assertions.
- **Password Visibility Toggle**:
  - Interactive show/hide eye toggle for password input fields.
- **Protected Routes & Role Guards (`src/components/layout/ProtectedRoute.tsx`)**:
  - Restricts unauthorized users from internal dashboard routes.
  - Enforces route-level permissions based on active user role.
- **Session Management & Local Storage**:
  - Centralized state in `AuthContext` with automatic synchronization to versioned local storage (`edusphere_v1_session`).
- **Logout Flow**:
  - Clears active tokens/sessions and securely redirects to `/auth/login`.

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@edusphere.com` | `adminPassword123` | Full administrative access |
| **Instructor** | `instructor@edusphere.com` | `demoSecurePass123` | Faculty course management |
| **Student** | `student@edusphere.com` | `demoSecurePass123` | Student learning and course enrollment |

---

## 🧪 Automated Testing

Unit tests for Module 1 are located in [`src/test/auth.test.tsx`](./src/test/auth.test.tsx):
- Zod schema validation checks (valid/invalid emails, password lengths).
- Password mismatch detection on registration.
- Instant role-switching functionality.
- Logout and session cleanup.

```bash
# Run unit tests
npm test
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
