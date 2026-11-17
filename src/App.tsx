import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CourseProvider } from '@/context/CourseContext';
import { StudentProvider } from '@/context/StudentContext';
import { InstructorProvider } from '@/context/InstructorContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { LearningProvider } from '@/context/LearningContext';
import { PermissionProvider } from '@/context/PermissionContext';
import { AppRoutes } from '@/routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <StudentProvider>
            <InstructorProvider>
              <EnrollmentProvider>
                <LearningProvider>
                  <PermissionProvider>
                    <BrowserRouter>
                      <AppRoutes />
                    </BrowserRouter>
                  </PermissionProvider>
                </LearningProvider>
              </EnrollmentProvider>
            </InstructorProvider>
          </StudentProvider>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
