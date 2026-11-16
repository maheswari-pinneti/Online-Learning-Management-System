import React, { useState } from 'react';
import {
  FileText,
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Send,
  Calendar,
  Terminal,
  Play,
  Check,
  Edit3,
  User,
  Sparkles,
  BookOpen,
  Filter,
  Eye,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';
import { Assignment, Quiz, AssignmentSubmission } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatDate } from '@/utils/formatters';

export const AssignmentsQuizzes: React.FC = () => {
  const {
    assignments,
    quizzes,
    assignmentSubmissions,
    quizSubmissions,
    submitAssignment,
    gradeAssignment,
    submitQuiz,
    getAssignmentSubmission,
    getQuizSubmission,
  } = useLearning();
  const { user, role } = useAuth();
  const currentStudentId = user?.id || 'usr-stud-1';
  const isInstructor = role === 'instructor';
  const isStudent = role === 'student';

  // Mode: Instructors default to 'grading' studio; students and general catalog default to 'student'
  const [viewMode, setViewMode] = useState<'grading' | 'student'>(isInstructor ? 'grading' : 'student');

  // Student active tab: 'assignments' | 'quizzes'
  const [activeTab, setActiveTab] = useState<'assignments' | 'quizzes'>('assignments');

  // Faculty active tab: 'submissions' | 'quizzes' | 'rubrics'
  const [facultyTab, setFacultyTab] = useState<'submissions' | 'quizzes' | 'rubrics'>('submissions');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'Submitted' | 'Graded'>('all');

  // Interactive Assignment Modal State (for student submission)
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  // Interactive Quiz Modal State (for student test taking)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    percentage: number;
  } | null>(null);

  // Faculty Grading Modal State (for instructors & admins)
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradingMarks, setGradingMarks] = useState<number | string>('');
  const [gradingFeedback, setGradingFeedback] = useState('');

  // -------------------------------------------------------------
  // Student Actions
  // -------------------------------------------------------------
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;
    if (!submissionContent.trim()) {
      toast.error('Please enter your submission text or repository URL.');
      return;
    }

    submitAssignment(activeAssignment.id, currentStudentId, submissionContent);
    toast.success('Assignment submitted successfully! Status changed to Submitted.');
    setActiveAssignment(null);
    setSubmissionContent('');
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuiz) return;

    if (Object.keys(selectedAnswers).length < activeQuiz.questions.length) {
      toast.warning('Please answer all quiz questions before submitting.');
      return;
    }

    const submission = submitQuiz(activeQuiz.id, currentStudentId, selectedAnswers);
    setQuizResult({
      score: submission.score,
      total: submission.totalMarks,
      passed: submission.passed,
      percentage: submission.percentage,
    });
    toast.success(`Quiz completed! You scored ${submission.score}/${submission.totalMarks}.`);
  };

  // -------------------------------------------------------------
  // Faculty Grading Actions
  // -------------------------------------------------------------
  const handleOpenGradingModal = (sub: AssignmentSubmission) => {
    const asg = assignments.find((a) => a.id === sub.assignmentId);
    setGradingSubmission(sub);
    setGradingMarks(sub.obtainedMarks !== undefined ? sub.obtainedMarks : (asg?.totalMarks || 50));
    setGradingFeedback(
      sub.feedback ||
        'Comprehensive implementation of the assigned requirements. Clean code organization and sound technical approach.'
    );
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const asg = assignments.find((a) => a.id === gradingSubmission.assignmentId);
    const maxMarks = asg?.totalMarks || 100;
    const marksNum = Number(gradingMarks);

    if (isNaN(marksNum) || marksNum < 0 || marksNum > maxMarks) {
      toast.error(`Please enter valid marks between 0 and ${maxMarks}.`);
      return;
    }

    if (!gradingFeedback.trim()) {
      toast.error('Please provide constructive review feedback.');
      return;
    }

    gradeAssignment(gradingSubmission.id, marksNum, gradingFeedback.trim());
    toast.success(`Evaluated submission for ${gradingSubmission.studentName}: awarded ${marksNum}/${maxMarks} marks!`);
    setGradingSubmission(null);
  };

  const filteredSubmissions = assignmentSubmissions.filter((s) => {
    if (submissionFilter === 'all') return true;
    return s.status === submissionFilter;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* HEADER BAR                                                */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              {viewMode === 'grading' ? 'Faculty Assessment Studio' : 'Active Curriculum Workspace'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {viewMode === 'grading'
              ? 'Coursework Submissions & Evaluation'
              : 'Assessments, Quizzes & Grading'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {viewMode === 'grading'
              ? 'Inspect student submissions, evaluate code repositories, award marks, and track cohort quiz performance.'
              : 'Submit coursework milestones, complete timed competency quizzes, and inspect marks'}
          </p>
        </div>

        {/* Tab & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isStudent && (
            <button
              onClick={() => setViewMode(viewMode === 'grading' ? 'student' : 'grading')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-brand-600" />
              <span>{viewMode === 'grading' ? 'Preview Student View' : 'Open Faculty Studio'}</span>
            </button>
          )}

          {viewMode === 'student' ? (
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('assignments')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'assignments'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Assignments ({assignments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'quizzes'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quizzes ({quizzes.length})</span>
              </button>
            </div>
          ) : (
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setFacultyTab('submissions')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  facultyTab === 'submissions'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Student Submissions ({assignmentSubmissions.length})</span>
              </button>
              <button
                onClick={() => setFacultyTab('quizzes')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  facultyTab === 'quizzes'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz Attempts ({quizSubmissions.length})</span>
              </button>
              <button
                onClick={() => setFacultyTab('rubrics')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  facultyTab === 'rubrics'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Rubrics</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* STUDENT VIEW                                              */}
      {/* ========================================================= */}
      {viewMode === 'student' && (
        <>
          {/* Featured Cloud Security Lab Activity */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 relative z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase">
                  PENDING ACTIVITY
                </span>
                <span className="text-xs text-indigo-200 font-semibold flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Live Cloud Sandbox · Lab 1
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Cloud Security Lab: AWS IAM Privilege Escalation
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deploy a simulated vulnerable AWS EC2 instance, identify SSRF vectors in IMDSv1, and implement IAM trust policy protections.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveAssignment(assignments[0]);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Lab Activity</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Assignments / Labs */}
          {activeTab === 'assignments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((asg) => {
                const submission = getAssignmentSubmission(asg.id, currentStudentId);
                const status = submission ? submission.status : 'Pending';

                return (
                  <Card key={asg.id} className="p-5 flex flex-col justify-between" hover>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="blue" size="sm">
                          {asg.courseName.split(' ')[0]}
                        </Badge>
                        <Badge
                          variant={status === 'Graded' ? 'emerald' : status === 'Submitted' ? 'blue' : 'amber'}
                          size="sm"
                          dot
                        >
                          {status}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {asg.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {asg.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs text-slate-500">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Deadline:
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {formatDate(asg.dueDate)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-slate-400" />
                            Marks Weightage:
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {submission?.obtainedMarks !== undefined
                              ? `${submission.obtainedMarks} / ${asg.totalMarks}`
                              : `${asg.totalMarks} Total (Pass: ${asg.passingMarks})`}
                          </span>
                        </div>

                        {submission?.feedback && (
                          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-[11px] text-purple-900 dark:text-purple-200 mt-2">
                            <p className="font-bold text-purple-800 dark:text-purple-300">Faculty Feedback:</p>
                            <p className="mt-0.5 line-clamp-2">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant={submission ? 'outline' : 'primary'}
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setActiveAssignment(asg);
                          setSubmissionContent(submission?.content || '');
                        }}
                        leftIcon={submission ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Send className="w-3.5 h-3.5" />}
                      >
                        {submission ? 'View My Submission' : 'Submit Assignment'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Tab 2: Quizzes */}
          {activeTab === 'quizzes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const previousSubmission = getQuizSubmission(quiz.id, currentStudentId);

                return (
                  <Card key={quiz.id} className="p-5 flex flex-col justify-between" hover>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="purple" size="sm">
                          {quiz.courseName.split(' ')[0]}
                        </Badge>
                        {previousSubmission && (
                          <Badge variant={previousSubmission.passed ? 'emerald' : 'rose'} size="sm">
                            {previousSubmission.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {quiz.instructions}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{quiz.timeLimitMinutes} Mins</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>{quiz.totalQuestions} Questions</span>
                        </div>
                      </div>

                      {previousSubmission && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                          Latest Score: <strong>{previousSubmission.score} / {previousSubmission.totalMarks}</strong> ({previousSubmission.percentage}%)
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => handleStartQuiz(quiz)}
                        leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
                      >
                        {previousSubmission ? 'Retake Quiz' : 'Start Timed Quiz'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* INSTRUCTOR & ADMIN FACULTY STUDIO                         */}
      {/* ========================================================= */}
      {viewMode === 'grading' && (
        <>
          {/* KPI Assessment Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center justify-between border-l-4 border-l-brand-600">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{assignmentSubmissions.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Across active courses</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between border-l-4 border-l-amber-500">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Needs Evaluation</p>
                <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                  {assignmentSubmissions.filter((s) => s.status === 'Submitted').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Awaiting faculty review</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Graded & Evaluated</p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {assignmentSubmissions.filter((s) => s.status === 'Graded').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Marks & feedback saved</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between border-l-4 border-l-purple-500">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quiz Completions</p>
                <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{quizSubmissions.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Cohort quiz records</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* Faculty Tab 1: Student Assignment Submissions */}
          {facultyTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Filter Status:</span>
                  <div className="flex items-center gap-1.5">
                    {(['all', 'Submitted', 'Graded'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSubmissionFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          submissionFilter === filter
                            ? 'bg-brand-600 text-white shadow-xs font-bold'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {filter === 'all' ? 'All Submissions' : filter === 'Submitted' ? 'Needs Review' : 'Graded'}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  Showing {filteredSubmissions.length} of {assignmentSubmissions.length} submissions
                </span>
              </div>

              {filteredSubmissions.length === 0 ? (
                <Card className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No submissions found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No student submissions match the selected filter at this time.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredSubmissions.map((sub) => {
                    const asg = assignments.find((a) => a.id === sub.assignmentId);
                    const isGraded = sub.status === 'Graded';

                    return (
                      <Card key={sub.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5" hover>
                        <div className="space-y-3 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={isGraded ? 'emerald' : 'amber'} size="sm" dot>
                              {isGraded ? 'Graded & Evaluated' : 'Needs Faculty Review'}
                            </Badge>
                            <Badge variant="blue" size="sm">
                              {asg?.courseName || 'Applied Cloud Architecture'}
                            </Badge>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Submitted: {formatDate(sub.submittedAt)}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {asg?.title || 'Coursework Assignment'}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-brand-600" />
                                Student: <strong className="text-brand-600 dark:text-brand-400">{sub.studentName}</strong>
                              </span>
                              <span className="text-xs text-slate-400">·</span>
                              <span className="text-xs text-slate-500 font-mono">ID: {sub.studentId}</span>
                            </div>
                          </div>

                          {/* Student submission preview */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs font-mono text-slate-700 dark:text-slate-300">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Student Submission Excerpt:
                            </span>
                            <p className="line-clamp-2 whitespace-pre-wrap">{sub.content}</p>
                          </div>

                          {/* Feedback if already graded */}
                          {isGraded && (
                            <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200">
                              <span className="font-bold">Awarded Marks: {sub.obtainedMarks} / {asg?.totalMarks || 50}</span>
                              {sub.feedback && (
                                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 italic">
                                  "{sub.feedback}"
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Faculty Review Action */}
                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-5">
                          <div className="text-right hidden sm:block">
                            <p className="text-[11px] text-slate-400">Max Rubric Marks</p>
                            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                              {sub.obtainedMarks !== undefined ? `${sub.obtainedMarks} / ` : ''}
                              {asg?.totalMarks || 50} pts
                            </p>
                          </div>
                          <Button
                            variant={isGraded ? 'outline' : 'primary'}
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleOpenGradingModal(sub)}
                            leftIcon={isGraded ? <Edit3 className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                          >
                            {isGraded ? 'Update Marks' : 'Review & Grade'}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Faculty Tab 2: Student Quiz Results */}
          {facultyTab === 'quizzes' && (
            <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Cohort Quiz Submissions & Marks
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time score records from automated competency quizzes across enrolled students.
                  </p>
                </div>
                <Badge variant="purple" size="sm">
                  {quizSubmissions.length} Attempts
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Quiz Title</th>
                      <th className="py-3 px-4">Completed Date</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4 text-center">Percentage</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {quizSubmissions.map((qsub) => {
                      const quiz = quizzes.find((q) => q.id === qsub.quizId);

                      return (
                        <tr key={qsub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 flex items-center justify-center font-bold text-[10px]">
                                {qsub.studentName.charAt(0)}
                              </div>
                              <div>
                                <p className="leading-tight">{qsub.studentName}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{qsub.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{quiz?.title || 'Competency Quiz'}</p>
                            <p className="text-[10px] text-slate-400">{quiz?.courseName || 'Cloud Computing'}</p>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {formatDate(qsub.submittedAt)}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                            {qsub.score} / {qsub.totalMarks}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] ${
                                qsub.percentage >= 70
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'
                                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                              }`}
                            >
                              {qsub.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={qsub.passed ? 'emerald' : 'rose'} size="sm">
                              {qsub.passed ? 'Passed' : 'Failed'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Faculty Tab 3: Curriculum Rubrics */}
          {facultyTab === 'rubrics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>Assignments & Coursework Catalog ({assignments.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {assignments.map((asg) => (
                    <Card key={asg.id} className="p-5 flex flex-col justify-between" hover>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="blue" size="sm">
                            {asg.courseName.split(' ')[0]}
                          </Badge>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {asg.totalMarks} Marks
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{asg.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-3">{asg.description}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                        <span>Due: {formatDate(asg.dueDate)}</span>
                        <span className="font-semibold text-emerald-600">Pass: {asg.passingMarks} pts</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  <span>Interactive Quizzes Catalog ({quizzes.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="p-5 flex flex-col justify-between" hover>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="purple" size="sm">
                            {quiz.courseName.split(' ')[0]}
                          </Badge>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {quiz.timeLimitMinutes} Mins
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{quiz.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{quiz.instructions}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                        <span>{quiz.totalQuestions} Questions</span>
                        <span className="font-semibold text-emerald-600">Pass: {quiz.passingScorePercentage}%</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* FACULTY GRADING MODAL                                      */}
      {/* ========================================================= */}
      {gradingSubmission && (
        <Modal
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          title={`Evaluate Submission · ${gradingSubmission.studentName}`}
          description={`Course: ${
            assignments.find((a) => a.id === gradingSubmission.assignmentId)?.courseName || 'Cloud Architecture'
          }`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveGrade} className="space-y-4 py-1">
            {/* Student Info Card */}
            <div className="flex items-center justify-between p-3.5 bg-brand-50 dark:bg-brand-950/30 rounded-2xl border border-brand-100 dark:border-brand-900/40 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {gradingSubmission.studentName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{gradingSubmission.studentName}</p>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 font-mono">ID: {gradingSubmission.studentId}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Submitted On</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatDate(gradingSubmission.submittedAt)}
                </span>
              </div>
            </div>

            {/* Submitted Content Display */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Student Submitted Work / Repository
              </label>
              <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800 shadow-inner">
                {gradingSubmission.content}
              </div>
            </div>

            {/* Marks & Feedback */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Marks Awarded (Max: {assignments.find((a) => a.id === gradingSubmission.assignmentId)?.totalMarks || 50})
                </label>
                <input
                  type="number"
                  min={0}
                  max={assignments.find((a) => a.id === gradingSubmission.assignmentId)?.totalMarks || 100}
                  value={gradingMarks}
                  onChange={(e) => setGradingMarks(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Passing Threshold
                </label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                  Min {assignments.find((a) => a.id === gradingSubmission.assignmentId)?.passingMarks || 25} pts required to pass
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Review & Constructive Feedback
              </label>
              <textarea
                rows={4}
                value={gradingFeedback}
                onChange={(e) => setGradingFeedback(e.target.value)}
                placeholder="Write actionable comments, code critique, and rubric evaluation for the student..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setGradingSubmission(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-brand-600 hover:bg-brand-700" leftIcon={<Check className="w-3.5 h-3.5" />}>
                Record Grade & Return
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* STUDENT MODALS                                             */}
      {/* ========================================================= */}
      {/* Assignment Submission Modal */}
      {activeAssignment && (
        <Modal
          isOpen={!!activeAssignment}
          onClose={() => setActiveAssignment(null)}
          title={activeAssignment.title}
          description={`Course: ${activeAssignment.courseName}. Due: ${formatDate(activeAssignment.dueDate)}`}
          maxWidth="lg"
        >
          <form onSubmit={handleAssignmentSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold block mb-1">Assignment Prompt:</span>
              <p>{activeAssignment.description}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Submission Content / Repository URL
              </label>
              <textarea
                rows={5}
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                placeholder="Paste code snippet, architecture write-up, or public GitHub repo link..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setActiveAssignment(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Record Submission
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Full Interactive Timed Quiz Modal */}
      {activeQuiz && (
        <Modal
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
          title={activeQuiz.title}
          description={`Time limit: ${activeQuiz.timeLimitMinutes} minutes. Passing score: ${activeQuiz.passingScorePercentage}%.`}
          maxWidth="xl"
        >
          {quizResult ? (
            /* Quiz Results Screen */
            <div className="text-center py-6 space-y-4">
              <div
                className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${
                  quizResult.passed
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
              >
                {quizResult.passed ? <CheckCircle2 className="w-9 h-9" /> : <AlertCircle className="w-9 h-9" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {quizResult.passed ? 'Competency Assessment Passed!' : 'Assessment Not Passed'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You scored <strong className="text-slate-800 dark:text-slate-200">{quizResult.score} out of {quizResult.total}</strong> ({quizResult.percentage}%).
                </p>
              </div>

              {/* Explanations review */}
              <div className="space-y-3 text-left max-h-60 overflow-y-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                {activeQuiz.questions.map((q, idx) => {
                  const userChoice = selectedAnswers[q.id];
                  const isCorrect = userChoice === q.correctOptionIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border text-xs ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800'
                          : 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                        Correct Answer: <strong className="text-emerald-600">{q.options[q.correctOptionIndex]}</strong>
                      </p>
                      {q.explanation && (
                        <p className="mt-0.5 text-[10px] text-slate-500 italic">{q.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" onClick={() => setActiveQuiz(null)}>
                  Close Assessment
                </Button>
              </div>
            </div>
          ) : (
            /* Quiz Questions Form */
            <form onSubmit={handleQuizSubmit} className="space-y-6 py-2">
              {activeQuiz.questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Question {qIndex + 1} of {activeQuiz.questions.length}: {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          selectedAnswers[q.id] === optIdx
                            ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-100 font-medium'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={selectedAnswers[q.id] === optIdx}
                          onChange={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optIdx })}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setActiveQuiz(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Answers for Evaluation
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
