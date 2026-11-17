import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CourseProvider } from '@/context/CourseContext';
import { StudentProvider } from '@/context/StudentContext';
import { InstructorProvider } from '@/context/InstructorContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { LearningProvider } from '@/context/LearningContext';
import { PermissionProvider, usePermissions } from '@/context/PermissionContext';
import { PermissionsPage } from '@/pages/permissions/PermissionsPage';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { StorageService } from '@/services/storageService';

const TestPermissionsApp: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <StudentProvider>
            <InstructorProvider>
              <EnrollmentProvider>
                <LearningProvider>
                  <PermissionProvider>
                    {children || <PermissionsPage />}
                  </PermissionProvider>
                </LearningProvider>
              </EnrollmentProvider>
            </InstructorProvider>
          </StudentProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Component to test Permission Context policy logic directly
const PolicyConsumerTest: React.FC = () => {
  const {
    globalPolicy,
    updateGlobalPolicy,
    canInstructorAddStudent,
    recordStudentJoinedClass,
    classAttendanceRecords,
  } = usePermissions();

  const [testResult, setTestResult] = React.useState<string>('idle');

  const runPolicyCheck = (instId: string, studId: string) => {
    const res = canInstructorAddStudent(instId, studId);
    setTestResult(res.allowed ? 'ALLOWED' : `BLOCKED: ${res.reason}`);
  };

  return (
    <div data-testid="policy-consumer">
      <div data-testid="global-policy-status">
        {globalPolicy.enforceClassJoinPrerequisite ? 'PREREQUISITE_ENFORCED' : 'PREREQUISITE_OPTIONAL'}
      </div>
      <div data-testid="attendance-count">{classAttendanceRecords.length}</div>
      <div data-testid="test-decision">{testResult}</div>

      {/* Button to simulate student joining class */}
      <button
        data-testid="btn-join-class"
        onClick={() =>
          recordStudentJoinedClass({
            studentId: 'test-student-99',
            studentName: 'Test Student 99',
            studentEmail: 'student99@test.com',
            instructorId: 'inst-4',
            instructorName: "David O'Connor",
            courseId: 'course-cyber-1',
            courseTitle: 'CyberGenius Defense',
            classSessionTitle: 'Cloud Threat Forensics',
          })
        }
      >
        Join Class
      </button>

      {/* Button to test adding student before/after join */}
      <button
        data-testid="btn-check-add"
        onClick={() => runPolicyCheck('inst-4', 'test-student-99')}
      >
        Check Can Add
      </button>

      {/* Button to toggle global prerequisite */}
      <button
        data-testid="btn-toggle-prereq"
        onClick={() =>
          updateGlobalPolicy({
            enforceClassJoinPrerequisite: !globalPolicy.enforceClassJoinPrerequisite,
          })
        }
      >
        Toggle Prereq
      </button>
    </div>
  );
};

describe('Instructor Permissions & Class-Joining Governance', () => {
  beforeEach(() => {
    StorageService.clearAppStorage();
    localStorage.clear();
  });

  it('renders the complete Permissions & Governance page with global policy cards and matrix', async () => {
    render(<TestPermissionsApp />);

    expect(screen.getByText(/Instructor Permissions & Class Governance/i)).toBeInTheDocument();
    expect(screen.getByText(/Class Join Prerequisite/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Attendees/i)).toBeInTheDocument();
    expect(screen.getByText(/Instructor Permission Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Class Attendees & Student Additions/i)).toBeInTheDocument();
    expect(screen.getByText(/Policy Engine Simulator/i)).toBeInTheDocument();
  });

  it('switches between tabs on the Permissions page to view class attendees', async () => {
    render(<TestPermissionsApp />);

    const attendeesTab = screen.getByRole('button', { name: /Class Attendees & Student Additions/i });
    fireEvent.click(attendeesTab);

    await waitFor(() => {
      expect(screen.getByText(/Live Class Attendance & Verification Log/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Joined Class \(Verified\)/i).length).toBeGreaterThan(0);
    });
  });

  it('enforces class join prerequisite: blocks adding students before joining, and grants permission after joining', async () => {
    render(
      <TestPermissionsApp>
        <PolicyConsumerTest />
      </TestPermissionsApp>
    );

    // Initial state: prerequisite is enforced
    expect(screen.getByTestId('global-policy-status')).toHaveTextContent('PREREQUISITE_ENFORCED');

    // 1. Check if instructor can add unjoined student -> MUST BE BLOCKED
    const checkBtn = screen.getByTestId('btn-check-add');
    fireEvent.click(checkBtn);

    expect(screen.getByTestId('test-decision').textContent).toContain('BLOCKED');
    expect(screen.getByTestId('test-decision').textContent).toContain('joined a live class session');

    // 2. Student joins the live class session
    const joinBtn = screen.getByTestId('btn-join-class');
    fireEvent.click(joinBtn);

    // 3. Re-check if instructor can add now that student has joined class -> MUST BE ALLOWED!
    fireEvent.click(checkBtn);
    expect(screen.getByTestId('test-decision')).toHaveTextContent('ALLOWED');
  });

  it('displays the Permissions link directly inside the Admin Dashboard for instant access', async () => {
    render(
      <TestPermissionsApp>
        <Dashboard />
      </TestPermissionsApp>
    );

    // Admin Dashboard should have the Permissions link
    const permissionsLinks = screen.getAllByRole('link', { name: /Permissions/i });
    expect(permissionsLinks.length).toBeGreaterThan(0);
    expect(permissionsLinks[0]).toHaveAttribute('href', '/permissions');
  });
});
