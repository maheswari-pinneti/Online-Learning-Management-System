# EduSphere LMS — Module 9: Reports & Analytics

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to **Module 9: Reports & Analytics** of the **EduSphere** Online Learning Management System. This module delivers executive business intelligence, real-time curriculum performance metrics, Recharts data visualizers, and one-click institutional CSV data export.

---

## 📌 Module 9 Features

- **Executive KPI Metric Cards (`src/pages/reports/ReportsAnalytics.tsx`)**:
  - **Total Active Learners**: Aggregate headcount with month-over-month velocity.
  - **Live Curriculum Tracks**: Registered course catalog across 6 academic disciplines.
  - **Active Course Enrollments**: Verified student-to-course mapping count.
  - **Gross Estimated Revenue**: Dynamic calculation reflecting catalog commercial value: `courses.reduce((acc, c) => acc + c.price * 5, 0)`.
- **Interactive Recharts Visualizations**:
  - **Monthly Enrollment & Completion Velocity (`BarChart`)**: Dual-bar comparison tracking new registrations vs course completions over time.
  - **Curriculum by Category (`PieChart` / Donut)**: Radial distribution breakdown of active courses across Design, Development, Business, and IT tracks.
  - **Monthly Platform Revenue Growth (`LineChart`)**: Curvature line chart displaying commercial trendlines and financial velocity.
- **Top Rated Curriculum Leaderboard**:
  - Filtered table spotlighting highest-performing courses ranked by student evaluation score (1.0 to 5.0).
- **One-Click Institutional CSV Export**:
  - Client-side CSV generation exporting course name, category, instructor, price, rating, and enrollment count with direct browser download.

---

## 🧪 Automated Testing

Unit and integration tests for Module 9 are located in [`src/test/reports.test.tsx`](./src/test/reports.test.tsx):
- Verifies executive dashboard metrics and chart container rendering.
- Tests one-click CSV export blob creation and simulated anchor download.

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
