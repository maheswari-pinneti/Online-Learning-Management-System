import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  GlobalInstructorPolicy,
  InstructorPermissionSetting,
  ClassAttendanceRecord,
} from '@/types';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';
import { INITIAL_INSTRUCTORS } from '@/utils/mockData';

interface PermissionContextType {
  globalPolicy: GlobalInstructorPolicy;
  updateGlobalPolicy: (updates: Partial<GlobalInstructorPolicy>) => void;
  instructorPermissions: InstructorPermissionSetting[];
  getInstructorPermission: (instructorId: string) => InstructorPermissionSetting | undefined;
  updateInstructorPermission: (instructorId: string, updates: Partial<InstructorPermissionSetting>) => void;
  toggleInstructorCanAddStudents: (instructorId: string) => void;
  toggleClassJoinRequirement: (instructorId: string) => void;
  classAttendanceRecords: ClassAttendanceRecord[];
  recordStudentJoinedClass: (data: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    instructorId: string;
    instructorName: string;
    courseId: string;
    courseTitle: string;
    classSessionTitle: string;
  }) => ClassAttendanceRecord;
  canInstructorAddStudent: (
    instructorId: string,
    studentId: string,
    courseId?: string
  ) => { allowed: boolean; reason?: string; requiresClassJoin?: boolean };
  markStudentAddedToRoster: (attendanceRecordId: string) => void;
  resetPermissionsToDefault: () => void;
}

const DEFAULT_GLOBAL_POLICY: GlobalInstructorPolicy = {
  allowInstructorsAddStudents: true,
  enforceClassJoinPrerequisite: true, // Only allow adding after joining classes
  autoApproveJoinedAttendees: true,
  defaultMaxAdditionLimit: 25,
};

const DEFAULT_INSTRUCTOR_PERMISSIONS: InstructorPermissionSetting[] = INITIAL_INSTRUCTORS.map(
  (inst) => ({
    instructorId: inst.id,
    instructorName: inst.name,
    email: inst.email,
    canAddStudents: inst.id !== 'inst-michael',
    requireClassJoinFirst: true, // Enforce class join prerequisite
    autoEnrollOnClassJoin: inst.id === 'inst-4' || inst.id === 'inst-1',
    maxStudentsAdditionLimit: 25,
    lastUpdated: new Date().toISOString(),
  })
);

const DEFAULT_ATTENDANCE_RECORDS: ClassAttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'student-mah-1',
    studentName: 'Maheswari',
    studentEmail: 'pinnetimaheswari@gmail.com',
    instructorId: 'inst-4',
    instructorName: "David O'Connor",
    courseId: 'course-cyber-1',
    courseTitle: 'CyberGenius - Inside the Breach: Enterprise & Cloud Defense',
    classSessionTitle: 'Episode 3: AWS IAM Privilege Escalation & Breach Forensics',
    joinedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Joined',
    addedToRoster: true,
    addedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: 'att-2',
    studentId: 'student-1',
    studentName: 'Alexander Wright',
    studentEmail: 'alexander.wright@example.com',
    instructorId: 'inst-4',
    instructorName: "David O'Connor",
    courseId: 'course-cyber-1',
    courseTitle: 'CyberGenius - Inside the Breach: Enterprise & Cloud Defense',
    classSessionTitle: 'Episode 3: AWS IAM Privilege Escalation & Breach Forensics',
    joinedAt: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    status: 'Joined',
    addedToRoster: false, // Ready to add!
  },
  {
    id: 'att-3',
    studentId: 'student-2',
    studentName: 'Sophia Chen',
    studentEmail: 'sophia.chen@example.com',
    instructorId: 'inst-1',
    instructorName: 'Dr. Angela Yu',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    classSessionTitle: 'Live Workshop: React 18 Concurrency & Custom Hooks',
    joinedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'Joined',
    addedToRoster: true,
    addedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'att-4',
    studentId: 'student-3',
    studentName: 'Marcus Johnson',
    studentEmail: 'marcus.j@example.com',
    instructorId: 'inst-2',
    instructorName: 'Sarah Jenkins',
    courseId: 'course-2',
    courseTitle: 'UI/UX Design Masterclass',
    classSessionTitle: 'Design System Sprint: Tokens & Atomic Components',
    joinedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'Joined',
    addedToRoster: false, // Ready to add!
  },
  {
    id: 'att-5',
    studentId: 'student-4',
    studentName: 'Emily Watson',
    studentEmail: 'emily.watson@example.com',
    instructorId: 'inst-1',
    instructorName: 'Dr. Angela Yu',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    classSessionTitle: 'Live Workshop: React 18 Concurrency & Custom Hooks',
    joinedAt: new Date(Date.now() - 3600000 * 4.5).toISOString(),
    status: 'Joined',
    addedToRoster: false, // Ready to add!
  },
];

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalPolicy, setGlobalPolicy] = useState<GlobalInstructorPolicy>(() => {
    const saved = StorageService.get<GlobalInstructorPolicy | null>(
      STORAGE_KEYS.PERMISSIONS + '_global',
      null
    );
    return saved || DEFAULT_GLOBAL_POLICY;
  });

  const [instructorPermissions, setInstructorPermissions] = useState<InstructorPermissionSetting[]>(
    () => {
      const saved = StorageService.get<InstructorPermissionSetting[] | null>(
        STORAGE_KEYS.PERMISSIONS + '_instructors',
        null
      );
      if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
      return DEFAULT_INSTRUCTOR_PERMISSIONS;
    }
  );

  const [classAttendanceRecords, setClassAttendanceRecords] = useState<ClassAttendanceRecord[]>(
    () => {
      const saved = StorageService.get<ClassAttendanceRecord[] | null>(
        STORAGE_KEYS.CLASS_ATTENDANCE,
        null
      );
      if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
      return DEFAULT_ATTENDANCE_RECORDS;
    }
  );

  // Sync state changes with StorageService
  useEffect(() => {
    StorageService.set(STORAGE_KEYS.PERMISSIONS + '_global', globalPolicy);
  }, [globalPolicy]);

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.PERMISSIONS + '_instructors', instructorPermissions);
  }, [instructorPermissions]);

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.CLASS_ATTENDANCE, classAttendanceRecords);
  }, [classAttendanceRecords]);

  // Update Global Policy
  const updateGlobalPolicy = useCallback((updates: Partial<GlobalInstructorPolicy>) => {
    setGlobalPolicy((prev) => {
      const updated = { ...prev, ...updates };
      toast.success('Global instructor policy updated.');
      return updated;
    });
  }, []);

  // Get single instructor's permission setting
  const getInstructorPermission = useCallback(
    (instructorId: string) => {
      return instructorPermissions.find((p) => p.instructorId === instructorId);
    },
    [instructorPermissions]
  );

  // Update single instructor's permission setting
  const updateInstructorPermission = useCallback(
    (instructorId: string, updates: Partial<InstructorPermissionSetting>) => {
      setInstructorPermissions((prev) =>
        prev.map((setting) =>
          setting.instructorId === instructorId
            ? { ...setting, ...updates, lastUpdated: new Date().toISOString() }
            : setting
        )
      );
      toast.success('Instructor permissions saved successfully.');
    },
    []
  );

  // Quick toggle: Can Add Students
  const toggleInstructorCanAddStudents = useCallback((instructorId: string) => {
    setInstructorPermissions((prev) =>
      prev.map((setting) => {
        if (setting.instructorId === instructorId) {
          const nextVal = !setting.canAddStudents;
          toast.info(
            `${setting.instructorName}: Student addition ${nextVal ? 'ENABLED' : 'RESTRICTED'}.`
          );
          return {
            ...setting,
            canAddStudents: nextVal,
            lastUpdated: new Date().toISOString(),
          };
        }
        return setting;
      })
    );
  }, []);

  // Quick toggle: Require Class Join First
  const toggleClassJoinRequirement = useCallback((instructorId: string) => {
    setInstructorPermissions((prev) =>
      prev.map((setting) => {
        if (setting.instructorId === instructorId) {
          const nextVal = !setting.requireClassJoinFirst;
          toast.info(
            `${setting.instructorName}: Class-joining prerequisite ${
              nextVal ? 'ENFORCED (Must join class first)' : 'DISABLED (Unrestricted)'
            }.`
          );
          return {
            ...setting,
            requireClassJoinFirst: nextVal,
            lastUpdated: new Date().toISOString(),
          };
        }
        return setting;
      })
    );
  }, []);

  // Record a student joining a live class session
  const recordStudentJoinedClass = useCallback(
    (data: {
      studentId: string;
      studentName: string;
      studentEmail: string;
      instructorId: string;
      instructorName: string;
      courseId: string;
      courseTitle: string;
      classSessionTitle: string;
    }) => {
      const existing = classAttendanceRecords.find(
        (r) =>
          r.studentId === data.studentId &&
          r.courseId === data.courseId &&
          r.classSessionTitle === data.classSessionTitle
      );

      if (existing) {
        return existing;
      }

      const newRecord: ClassAttendanceRecord = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentId: data.studentId,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        instructorId: data.instructorId,
        instructorName: data.instructorName,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        classSessionTitle: data.classSessionTitle,
        joinedAt: new Date().toISOString(),
        status: 'Joined',
        addedToRoster: false,
      };

      setClassAttendanceRecords((prev) => [newRecord, ...prev]);
      toast.success(
        `Class Attendance Verified: ${data.studentName} joined "${data.classSessionTitle}". Instructor is now eligible to add this student!`
      );
      return newRecord;
    },
    [classAttendanceRecords]
  );

  // Policy check: Can an instructor add a student to a course?
  const canInstructorAddStudent = useCallback(
    (instructorId: string, studentId: string, courseId?: string) => {
      // 1. Global Platform Policy
      if (!globalPolicy.allowInstructorsAddStudents) {
        return {
          allowed: false,
          reason:
            'Platform Administrator has globally restricted instructors from adding students.',
          requiresClassJoin: false,
        };
      }

      // 2. Instructor-specific setting
      const setting = instructorPermissions.find((p) => p.instructorId === instructorId);
      if (setting && !setting.canAddStudents) {
        return {
          allowed: false,
          reason: `${setting.instructorName} is not authorized to add students to courses.`,
          requiresClassJoin: false,
        };
      }

      // 3. Class-Join Prerequisite Check
      const mustJoinClassFirst =
        globalPolicy.enforceClassJoinPrerequisite ||
        (setting ? setting.requireClassJoinFirst : true);

      if (mustJoinClassFirst) {
        // Check whether student has joined any class session by this instructor or for this course
        const hasJoinedClass = classAttendanceRecords.some(
          (record) =>
            record.studentId === studentId &&
            (record.instructorId === instructorId || (courseId ? record.courseId === courseId : true))
        );

        if (!hasJoinedClass) {
          return {
            allowed: false,
            reason:
              'Admin Policy Requirement: Instructors can ONLY add students after they have joined a live class session. This student has not joined any class session yet.',
            requiresClassJoin: true,
          };
        }
      }

      return { allowed: true };
    },
    [globalPolicy, instructorPermissions, classAttendanceRecords]
  );

  // Mark student as officially added to roster
  const markStudentAddedToRoster = useCallback((attendanceRecordId: string) => {
    setClassAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === attendanceRecordId
          ? { ...rec, addedToRoster: true, addedAt: new Date().toISOString() }
          : rec
      )
    );
  }, []);

  // Reset to default institutional configuration
  const resetPermissionsToDefault = useCallback(() => {
    setGlobalPolicy(DEFAULT_GLOBAL_POLICY);
    setInstructorPermissions(DEFAULT_INSTRUCTOR_PERMISSIONS);
    setClassAttendanceRecords(DEFAULT_ATTENDANCE_RECORDS);
    toast.info('Institutional instructor permissions reset to default configuration.');
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        globalPolicy,
        updateGlobalPolicy,
        instructorPermissions,
        getInstructorPermission,
        updateInstructorPermission,
        toggleInstructorCanAddStudents,
        toggleClassJoinRequirement,
        classAttendanceRecords,
        recordStudentJoinedClass,
        canInstructorAddStudent,
        markStudentAddedToRoster,
        resetPermissionsToDefault,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
