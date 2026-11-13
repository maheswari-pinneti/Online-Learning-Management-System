# EduSphere LMS — UI/UX: Design System & User Experience

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

Welcome to the **UI/UX: Design System & User Experience** branch of **EduSphere**. This branch houses the complete design architecture, accessible component library, light/dark themes, responsive shell layout, interactive drawers, and micro-interactions.

---

## 🎨 Design System Highlights

### 1. Light & Dark Mode Engine (`src/context/ThemeContext.tsx`)
- System-preference detection (`prefers-color-scheme`) with persistent local storage caching (`edusphere_v1_theme`).
- Smooth CSS color-transition classes applying the Slate + Emerald design tokens.
- One-click theme toggle pill in the top navigation bar.

### 2. Responsive App Shell (`src/components/layout/`)
- **`Layout.tsx`**: Dynamic grid with fluid main viewport and sticky header.
- **`Navbar.tsx`**: Top navigation with instant 1-click **Role Switcher** (Admin, Instructor, Student), notifications bell with badge counter, search shortcut, and profile dropdown.
- **`Sidebar.tsx`**: Collapsible desktop sidebar with icon-only and expanded modes, plus animated mobile overlay drawer.
- **`Breadcrumbs.tsx`**: Automatic route-aware hierarchical navigation breadcrumb path.
- **`NotificationPanel.tsx`**: Slide-out tray displaying real-time activity notifications and action timestamps.

### 3. Reusable Component Library (`src/components/common/`)
- **`Button.tsx`**: Standardized variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner states, and left/right icon slots.
- **`Input.tsx`**: Floating-label input with error validation text, helper text, and password show/hide eye toggle.
- **`Select.tsx`**: Custom accessible dropdown select with keyboard navigation and option groupings.
- **`Badge.tsx`**: Pill indicators in 6 semantic colorways (`emerald`, `blue`, `purple`, `amber`, `rose`, `slate`) with optional pulsating live dot.
- **`Card.tsx`**: Elevation-based surface with subtle border and optional hover shadow transitions.
- **`Modal.tsx`**: Accessible dialog box with backdrop blur, focus trap, Escape key handling, and header/footer slots.
- **`Pagination.tsx`**: Responsive page navigation controls with items-per-page selector.

### 4. Feedback & Skeletons (`src/components/feedback/`)
- **`LoadingSpinner.tsx`**: Animated SVG spinner for asynchronous state transitions.
- **`SkeletonLoader.tsx`**: Shimmer skeleton blocks simulating cards, tables, and detail screens during data fetches.
- **`EmptyState.tsx`**: Illustrated placeholder with title, description, and call-to-action button when lists are empty.

---

## 🧪 Automated Testing

Unit and integration tests for UI/UX components are located in [`src/test/ui.test.tsx`](./src/test/ui.test.tsx):
- Verifies light and dark mode toggling via `ThemeContext`.
- Tests button variants, sizes, and disabled click guards.
- Tests accessible modal dialog mounting, dismissal, and callback execution.
- Tests badge styling and dot indicator rendering.
- Tests dynamic breadcrumb route generation.

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
