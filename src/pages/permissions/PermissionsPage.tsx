import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  Video,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Sliders,
  Plus,
  UserCheck,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { usePermissions } from '@/context/PermissionContext';
import { useInstructors } from '@/context/InstructorContext';
import { useStudents } from '@/context/StudentContext';
import { useCourses } from '@/context/CourseContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { InstructorPermissionSetting } from '@/types';

export const PermissionsPage: React.FC = () => {
  const {
    globalPolicy,
    updateGlobalPolicy,
    instructorPermissions,
    updateInstructorPermission,
    toggleInstructorCanAddStudents,
    toggleClassJoinRequirement,
    classAttendanceRecords,
    recordStudentJoinedClass,
    canInstructorAddStudent,
    markStudentAddedToRoster,
    resetPermissionsToDefault,
  } = usePermissions();

  const { instructors } = useInstructors();
  const { students } = useStudents();
  const { courses } = useCourses();
  const { enrollStudent, enrollments } = useEnrollment();

  const [activeTab, setActiveTab] = useState<'matrix' | 'attendance' | 'simulator'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'allowed' | 'restricted'>('all');

  // Modal 1: Edit Instructor Permission Modal
  const [editingInstructor, setEditingInstructor] = useState<InstructorPermissionSetting | null>(null);
  const [editCanAdd, setEditCanAdd] = useState(true);
  const [editRequireJoin, setEditRequireJoin] = useState(true);
  const [editAutoEnroll, setEditAutoEnroll] = useState(false);
  const [editLimit, setEditLimit] = useState(25);

  // Modal 2: Simulate Student Joining Class Modal
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [sessionTitle, setSessionTitle] = useState('Episode 4: Advanced Live Incident Response Lab');

  // Simulator Interactive Tester State
  const [testInstructorId, setTestInstructorId] = useState(instructors[0]?.id || 'inst-4');
  const [testStudentId, setTestStudentId] = useState(students[0]?.id || 'student-1');

  // Filtered Instructor list
  const filteredPermissions = useMemo(() => {
    return instructorPermissions.filter((item) => {
      const matchesSearch =
        item.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'allowed'
          ? item.canAddStudents
          : !item.canAddStudents;
      return matchesSearch && matchesStatus;
    });
  }, [instructorPermissions, searchTerm, statusFilter]);

  // Open Edit Modal
  const handleOpenEdit = (setting: InstructorPermissionSetting) => {
    setEditingInstructor(setting);
    setEditCanAdd(setting.canAddStudents);
    setEditRequireJoin(setting.requireClassJoinFirst);
    setEditAutoEnroll(setting.autoEnrollOnClassJoin);
    setEditLimit(setting.maxStudentsAdditionLimit);
  };

  // Save Edit Modal
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstructor) return;
    updateInstructorPermission(editingInstructor.instructorId, {
      canAddStudents: editCanAdd,
      requireClassJoinFirst: editRequireJoin,
      autoEnrollOnClassJoin: editAutoEnroll,
      maxStudentsAdditionLimit: editLimit,
    });
    setEditingInstructor(null);
  };

  // Handle Add Student to Roster from Class Attendance
  const handleAddFromAttendance = (recordId: string, studentId: string, courseId: string, instructorId: string) => {
    // 1. Verify policy
    const check = canInstructorAddStudent(instructorId, studentId, courseId);
    if (!check.allowed) {
      toast.error(check.reason || 'Instructor not permitted to add student.');
      return;
    }

    // 2. Check if already enrolled in CourseContext
    const alreadyEnrolled = enrollments.some((e) => e.studentId === studentId && e.courseId === courseId);
    if (alreadyEnrolled) {
      markStudentAddedToRoster(recordId);
      toast.info('Student is already officially enrolled in this course.');
      return;
    }

    // 3. Perform official enrollment
    try {
      enrollStudent(studentId, courseId);
      markStudentAddedToRoster(recordId);
      toast.success('Successfully added verified class attendee to official course roster!');
    } catch (err: any) {
      markStudentAddedToRoster(recordId);
      toast.info(err?.message || 'Student is already enrolled.');
    }
  };

  // Handle Simulate Student Joining Class
  const handleSimulateJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId) || students[0];
    const crs = courses.find((c) => c.id === selectedCourseId) || courses[0];
    const inst = instructors.find((i) => i.id === selectedInstructorId) || instructors[0];

    if (!st || !crs || !inst) {
      toast.error('Please select student, course, and instructor.');
      return;
    }

    recordStudentJoinedClass({
      studentId: st.id,
      studentName: st.fullName,
      studentEmail: st.email,
      instructorId: inst.id,
      instructorName: inst.name,
      courseId: crs.id,
      courseTitle: crs.title,
      classSessionTitle: sessionTitle.trim() || 'Virtual Classroom Session',
    });

    setIsJoinModalOpen(false);
  };

  // Compute metrics
  const totalVerifiedAttendees = classAttendanceRecords.length;
  const readyToAddCount = classAttendanceRecords.filter((r) => !r.addedToRoster).length;
  const authorizedInstructorsCount = instructorPermissions.filter((p) => p.canAddStudents).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* ----------------------------------------------------------- */}
      {/* 1. EXECUTIVE PAGE HEADER                                    */}
      {/* ----------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7047EB] dark:text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Governance & Security Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Instructor Permissions & Class Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage instructor authorization to add students to courses, with mandatory live class-joining attendance prerequisites.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={resetPermissionsToDefault}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Reset to Default
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedStudentId(students[0]?.id || '');
              setSelectedCourseId(courses[0]?.id || '');
              setSelectedInstructorId(instructors[0]?.id || '');
              setIsJoinModalOpen(true);
            }}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="bg-[#7047EB] hover:bg-[#5E36D9] text-white text-xs shadow-md shadow-purple-500/20"
          >
            Simulate Student Join Class
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. GOVERNANCE KPI & GLOBAL POLICY TOGGLE CARDS              */}
      {/* ----------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Allow Instructors to Add Students */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Instructor Student Addition
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  globalPolicy.allowInstructorsAddStudents
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                }`}
              >
                {globalPolicy.allowInstructorsAddStudents ? (
                  <UserCheck className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {globalPolicy.allowInstructorsAddStudents ? 'Active' : 'Disabled'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Global Rule</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Enables authorized instructors to add students to course rosters.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Allow Additions</span>
            <button
              onClick={() =>
                updateGlobalPolicy({
                  allowInstructorsAddStudents: !globalPolicy.allowInstructorsAddStudents,
                })
              }
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                globalPolicy.allowInstructorsAddStudents ? 'bg-[#7047EB]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`${
                  globalPolicy.allowInstructorsAddStudents ? 'translate-x-4.5' : 'translate-x-0.5'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs`}
              />
            </button>
          </div>
        </div>

        {/* Card 2: Require Class Join First (The Core Spec!) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-purple-200 dark:border-purple-900/50 shadow-xs flex flex-col justify-between ring-1 ring-purple-500/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#7047EB] dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Class Join Prerequisite
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#7047EB] dark:text-purple-300 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#7047EB] dark:text-purple-300">
                {globalPolicy.enforceClassJoinPrerequisite ? 'Mandatory' : 'Optional'}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                Strict Guard
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Instructors can <strong>ONLY</strong> add students after they have attended or joined a live class session.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enforce Prerequisite</span>
            <button
              onClick={() =>
                updateGlobalPolicy({
                  enforceClassJoinPrerequisite: !globalPolicy.enforceClassJoinPrerequisite,
                })
              }
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                globalPolicy.enforceClassJoinPrerequisite ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`${
                  globalPolicy.enforceClassJoinPrerequisite ? 'translate-x-4.5' : 'translate-x-0.5'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs`}
              />
            </button>
          </div>
        </div>

        {/* Card 3: Verified Class Attendees */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Verified Attendees
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {totalVerifiedAttendees}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                {readyToAddCount} Ready to Add
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Students who attended live sessions and are eligible for roster addition.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Session Attendance</span>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-[#7047EB] dark:text-purple-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              View Roster <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Authorized Instructors */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Authorized Faculty
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {authorizedInstructorsCount} / {instructors.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Instructors</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Faculty members with active permissions to admit and manage students.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Addition Quota</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {globalPolicy.defaultMaxAdditionLimit} per Class
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 3. PRIMARY TABS NAVIGATION                                  */}
      {/* ----------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'border-[#7047EB] text-[#7047EB] dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Instructor Permission Matrix</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              {instructorPermissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'border-[#7047EB] text-[#7047EB] dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Class Attendees & Student Additions</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              {classAttendanceRecords.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'border-[#7047EB] text-[#7047EB] dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Policy Engine Simulator</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* TAB 1: INSTRUCTOR PERMISSION MATRIX                         */}
      {/* ----------------------------------------------------------- */}
      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          {/* Search & Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search instructors by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#7047EB]/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Filter Instructors by Permission Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="allowed">Allowed to Add</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Can Add Students</th>
                  <th className="py-3 px-4">Prerequisite Rule</th>
                  <th className="py-3 px-4">Auto-Enroll</th>
                  <th className="py-3 px-4">Addition Quota</th>
                  <th className="py-3 px-4">Joined Attendees</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredPermissions.map((setting) => {
                  const inst = instructors.find((i) => i.id === setting.instructorId);
                  const attendeesCount = classAttendanceRecords.filter(
                    (r) => r.instructorId === setting.instructorId
                  ).length;

                  return (
                    <tr
                      key={setting.instructorId}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Instructor info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              inst?.profileImage ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                            }
                            alt={setting.instructorName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{setting.instructorName}</span>
                              {setting.canAddStudents && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Authorized" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{setting.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Can Add Students Toggle */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleInstructorCanAddStudents(setting.instructorId)}
                            className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors focus:outline-none ${
                              setting.canAddStudents ? 'bg-[#7047EB]' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title="Toggle addition rights"
                          >
                            <span
                              className={`${
                                setting.canAddStudents ? 'translate-x-4' : 'translate-x-0.5'
                              } inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs`}
                            />
                          </button>
                          <span
                            className={`text-[11px] font-bold ${
                              setting.canAddStudents
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {setting.canAddStudents ? 'Allowed' : 'Restricted'}
                          </span>
                        </div>
                      </td>

                      {/* Prerequisite Rule */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleClassJoinRequirement(setting.instructorId)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            setting.requireClassJoinFirst
                              ? 'bg-purple-50 dark:bg-purple-950/50 text-[#7047EB] dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {setting.requireClassJoinFirst ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-[#7047EB]" />
                              <span>After Joining Classes Only</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <span>Unrestricted</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Auto-Enroll on Class Join */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-semibold ${
                            setting.autoEnrollOnClassJoin
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {setting.autoEnrollOnClassJoin ? 'Enabled' : 'Manual Approval'}
                        </span>
                      </td>

                      {/* Quota */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {setting.maxStudentsAdditionLimit} max / session
                        </span>
                      </td>

                      {/* Joined Attendees */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {attendeesCount} Students
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(setting)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* TAB 2: CLASS ATTENDANCE & STUDENT ADDITIONS ROSTER          */}
      {/* ----------------------------------------------------------- */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-200 dark:border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#7047EB]" />
                Live Class Attendance & Verification Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Students below attended live virtual classes. Because class-joining is verified, instructors have permission to add them directly to official course rosters.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsJoinModalOpen(true)}
              leftIcon={<Plus className="w-3 h-3" />}
              className="text-xs shrink-0"
            >
              Simulate Join
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class Session & Track</th>
                    <th className="py-3 px-4">Host Instructor</th>
                    <th className="py-3 px-4">Joined Timestamp</th>
                    <th className="py-3 px-4">Class Verification</th>
                    <th className="py-3 px-4 text-right">Roster Enrollment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {classAttendanceRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {record.studentName}
                        </div>
                        <span className="text-[11px] text-slate-400">{record.studentEmail}</span>
                      </td>

                      {/* Class Session */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                          {record.classSessionTitle}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                          {record.courseTitle}
                        </span>
                      </td>

                      {/* Instructor */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {record.instructorName}
                        </span>
                      </td>

                      {/* Joined At */}
                      <td className="py-3.5 px-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(record.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(record.joinedAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Joined Class (Verified)</span>
                        </span>
                      </td>

                      {/* Roster Action */}
                      <td className="py-3.5 px-4 text-right">
                        {record.addedToRoster ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#7047EB]" />
                            <span>Added to Roster</span>
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleAddFromAttendance(
                                record.id,
                                record.studentId,
                                record.courseId,
                                record.instructorId
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#7047EB] hover:bg-[#5E36D9] text-white shadow-xs transition-all active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Student to Roster</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* TAB 3: POLICY ENGINE SIMULATOR                              */}
      {/* ----------------------------------------------------------- */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7047EB]" />
                Live Permission & Policy Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Test whether an instructor has permission to add a student based on real-time global settings and live class-joining status.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Instructor:
                </label>
                <select
                  value={testInstructorId}
                  onChange={(e) => setTestInstructorId(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  {instructors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Student:
                </label>
                <select
                  value={testStudentId}
                  onChange={(e) => setTestStudentId(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Evaluation Result Box */}
            {(() => {
              const testInst = instructors.find((i) => i.id === testInstructorId);
              const testStud = students.find((s) => s.id === testStudentId);
              const evalResult = canInstructorAddStudent(testInstructorId, testStudentId);
              const hasJoined = classAttendanceRecords.some(
                (r) => r.studentId === testStudentId && r.instructorId === testInstructorId
              );

              return (
                <div
                  className={`mt-4 p-4 rounded-2xl border ${
                    evalResult.allowed
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Policy Decision
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        evalResult.allowed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {evalResult.allowed ? 'PERMISSION GRANTED' : 'PERMISSION BLOCKED'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {evalResult.allowed
                      ? `Instructor ${testInst?.name} is authorized to add ${testStud?.fullName}.`
                      : evalResult.reason}
                  </p>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <div>
                      <strong>Class Join Verification:</strong>{' '}
                      {hasJoined ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ Verified Attendance on Record
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          ✗ Student has not joined this instructor's class
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Rule Active:</strong> Mandatory Class-Join Prerequisite Enabled
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#7047EB]" />
              Institutional Governance Workflow
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7047EB] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Live Class Participation</h4>
                  <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                    Students attend or join a live virtual classroom session led by the instructor.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7047EB] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Attendance Verification</h4>
                  <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                    The platform validates presence and records the session timestamp in the attendance ledger.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7047EB] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Instructor Student Addition</h4>
                  <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                    With verified attendance, the instructor is authorized to add that student to the official course roster.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Duplication & Quota Guard</h4>
                  <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                    The system prevents double-enrollment and enforces the maximum student addition limit per session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* MODAL 1: CONFIGURE INSTRUCTOR PERMISSIONS                   */}
      {/* ----------------------------------------------------------- */}
      {editingInstructor && (
        <Modal
          isOpen={Boolean(editingInstructor)}
          onClose={() => setEditingInstructor(null)}
          title={`Configure Permissions: ${editingInstructor.instructorName}`}
          description="Grant or restrict student addition rights and class-joining attendance rules"
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 py-2 text-xs">
            {/* Toggle 1: Can Add Students */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Allow Adding Students
                </span>
                <span className="text-[11px] text-slate-400">
                  Authorizes instructor to enroll students into their courses
                </span>
              </div>
              <input
                type="checkbox"
                checked={editCanAdd}
                onChange={(e) => setEditCanAdd(e.target.checked)}
                className="w-4 h-4 rounded text-[#7047EB] focus:ring-[#7047EB]"
              />
            </div>

            {/* Toggle 2: Require Class Join First */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Mandatory Class-Joining Prerequisite
                </span>
                <span className="text-[11px] text-slate-400">
                  Student must join a live class session before instructor can add them
                </span>
              </div>
              <input
                type="checkbox"
                checked={editRequireJoin}
                onChange={(e) => setEditRequireJoin(e.target.checked)}
                className="w-4 h-4 rounded text-[#7047EB] focus:ring-[#7047EB]"
              />
            </div>

            {/* Toggle 3: Auto-Enroll on Class Join */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Auto-Enroll on Class Join
                </span>
                <span className="text-[11px] text-slate-400">
                  Instantly enroll students who enter the instructor's live virtual room
                </span>
              </div>
              <input
                type="checkbox"
                checked={editAutoEnroll}
                onChange={(e) => setEditAutoEnroll(e.target.checked)}
                className="w-4 h-4 rounded text-[#7047EB] focus:ring-[#7047EB]"
              />
            </div>

            {/* Addition Limit */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <label className="font-bold text-slate-900 dark:text-white block mb-1">
                Max Student Addition Limit (Per Session)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={editLimit}
                onChange={(e) => setEditLimit(Number(e.target.value) || 25)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingInstructor(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-[#7047EB] hover:bg-[#5E36D9] text-white">
                Save Permissions
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ----------------------------------------------------------- */}
      {/* MODAL 2: SIMULATE STUDENT JOINING CLASS                     */}
      {/* ----------------------------------------------------------- */}
      {isJoinModalOpen && (
        <Modal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          title="Simulate Student Joining Live Class"
          description="Simulate student attendance in a live virtual classroom to test instructor addition permissions"
          maxWidth="md"
        >
          <form onSubmit={handleSimulateJoinSubmit} className="space-y-4 py-2 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course & Track:
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Host Instructor:
              </label>
              <select
                value={selectedInstructorId}
                onChange={(e) => setSelectedInstructorId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Class Session Title:
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g. Episode 3: AWS IAM Forensics Lab"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsJoinModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Confirm Student Joined Class
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
