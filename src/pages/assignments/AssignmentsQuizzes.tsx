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
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';
import { Assignment, Quiz } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatDate } from '@/utils/formatters';

export const AssignmentsQuizzes: React.FC = () => {
  const {
    assignments,
    quizzes,
    submitAssignment,
    submitQuiz,
    getAssignmentSubmission,
    getQuizSubmission,
  } = useLearning();
  const { user } = useAuth();
  const currentStudentId = user?.id || 'usr-stud-1';

  const [activeTab, setActiveTab] = useState<'assignments' | 'quizzes'>('assignments');

  // Interactive Assignment Modal State
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  // Interactive Quiz Modal State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    percentage: number;
  } | null>(null);

  // Handle Assignment Submission
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

  // Handle Quiz Start
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  // Handle Quiz Submission
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

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Assessments, Quizzes & Grading
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit coursework milestones, complete timed competency quizzes, and inspect marks
          </p>
        </div>

        {/* Tab Toggle */}
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
      </div>

      {/* Tab 1: Assignments */}
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
                          onChange={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  {Object.keys(selectedAnswers).length} of {activeQuiz.questions.length} answered
                </span>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveQuiz(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Submit Answers
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
