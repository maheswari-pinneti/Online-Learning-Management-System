import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Breadcrumbs } from './Breadcrumbs';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { role, user } = useAuth();
  const currentRole = role || user?.role || 'student';
  const isStudent = currentRole === 'student';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Top Navbar: only rendered for admin and instructor roles. Removed from student website as per design */}
        {!isStudent && (
          <Navbar onToggleMobileMenu={() => setIsMobileSidebarOpen(true)} />
        )}

        <main className={`flex-1 overflow-y-auto ${isStudent ? 'p-4 sm:p-6 lg:p-8' : 'p-4 sm:p-6 lg:p-8'}`}>
          <div className="max-w-7xl mx-auto">
            {!isStudent && <Breadcrumbs />}
            <Outlet context={{ onToggleMobileMenu: () => setIsMobileSidebarOpen(true) }} />
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};
