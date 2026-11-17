import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ChevronRight,
  Search,
  MessageSquare,
  Bell,
  Maximize2,
  Minimize2,
  Paperclip,
  Send,
  ExternalLink,
  PhoneOff,
  Sparkles,
  Play,
  Calendar,
  Volume2,
  Shield,
  Menu,
  LogOut,
  Edit3,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { useLearning } from '@/context/LearningContext';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

// -------------------------------------------------------------
// VECTOR ILLUSTRATION: CYBER CAT AI COMPANION
// -------------------------------------------------------------
const CyberCatIllustration: React.FC<{ size?: number }> = ({ size = 130 }) => (
  <div className="relative flex items-center justify-center select-none">
    {/* Soft ambient radial purple aura */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-400/20 via-indigo-300/30 to-purple-500/25 blur-xl pointer-events-none transform scale-125" />

    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 drop-shadow-xl"
    >
      <defs>
        {/* Helmet and body gradients */}
        <radialGradient id="cyberHead" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2D283E" />
          <stop offset="60%" stopColor="#1B1728" />
          <stop offset="100%" stopColor="#0F0C18" />
        </radialGradient>

        <linearGradient id="cyberHoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252136" />
          <stop offset="100%" stopColor="#13101E" />
        </linearGradient>

        <linearGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B0914" />
          <stop offset="100%" stopColor="#171326" />
        </linearGradient>

        <linearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        <linearGradient id="neonPurple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Cyber Ears */}
      {/* Left Ear (Viewer's left) with purple inner accent */}
      <path
        d="M44 65 L28 22 C32 20 48 24 60 48 Z"
        fill="#1C182A"
        stroke="#3F3759"
        strokeWidth="1.5"
      />
      <path
        d="M42 60 L33 30 C36 28 47 32 54 48 Z"
        fill="url(#neonPurple)"
        opacity="0.85"
      />

      {/* Right Ear (Viewer's right) with Microsoft 4-Square Cyber Badge */}
      <path
        d="M116 65 L132 22 C128 20 112 24 100 48 Z"
        fill="#1C182A"
        stroke="#3F3759"
        strokeWidth="1.5"
      />
      <path
        d="M118 60 L127 30 C124 28 113 32 106 48 Z"
        fill="url(#neonPurple)"
        opacity="0.85"
      />

      {/* Microsoft 4-square mini emblem on top of right ear */}
      <g transform="translate(108, 32) scale(0.65)">
        <rect x="0" y="0" width="7" height="7" rx="1" fill="#F25022" />
        <rect x="9" y="0" width="7" height="7" rx="1" fill="#7FBA00" />
        <rect x="0" y="9" width="7" height="7" rx="1" fill="#00A4EF" />
        <rect x="9" y="9" width="7" height="7" rx="1" fill="#FFB900" />
      </g>

      {/* Torso / Hoodie */}
      <path
        d="M42 122 C42 105 118 105 118 122 L128 160 L32 160 Z"
        fill="url(#cyberHoodie)"
      />
      <path
        d="M60 116 L80 138 L100 116"
        stroke="#3E3859"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cyber Security Shield Emblem on chest */}
      <g transform="translate(80, 136)">
        <path
          d="M0 -10 L10 -5 L10 4 C10 10 0 15 0 15 C0 15 -10 10 -10 4 L-10 -5 Z"
          fill="#1E293B"
          stroke="#38BDF8"
          strokeWidth="1.8"
        />
        {/* Shield lock / keyhole */}
        <path
          d="M-3 -1 C-3 -3 3 -3 3 -1 L3 2 L-3 2 Z"
          fill="#38BDF8"
        />
        <rect x="-4" y="2" width="8" height="6" rx="1.5" fill="#38BDF8" />
        <circle cx="0" cy="5" r="1.2" fill="#0F172A" />
      </g>

      {/* Head Capsule */}
      <rect
        x="36"
        y="42"
        width="88"
        height="76"
        rx="38"
        fill="url(#cyberHead)"
        stroke="#423B5D"
        strokeWidth="2"
      />

      {/* Front Face Visor (Black curved screen) */}
      <rect
        x="44"
        y="52"
        width="72"
        height="56"
        rx="26"
        fill="url(#visorGrad)"
        stroke="#1E1930"
        strokeWidth="1.5"
      />

      {/* Glowing Cyan Eyes (Digital Cat Visor Expression) */}
      {/* Left Eye */}
      <rect
        x="55"
        y="68"
        width="16"
        height="18"
        rx="7"
        fill="url(#neonCyan)"
        filter="url(#eyeGlow)"
      />
      <circle cx="60" cy="73" r="2.5" fill="#FFFFFF" />

      {/* Right Eye */}
      <rect
        x="89"
        y="68"
        width="16"
        height="18"
        rx="7"
        fill="url(#neonCyan)"
        filter="url(#eyeGlow)"
      />
      <circle cx="94" cy="73" r="2.5" fill="#FFFFFF" />

      {/* Whiskers / Cheek sensors */}
      <line x1="42" y1="74" x2="48" y2="76" stroke="#4C4368" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="42" y1="82" x2="48" y2="80" stroke="#4C4368" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="112" y1="76" x2="118" y2="74" stroke="#4C4368" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="112" y1="80" x2="118" y2="82" stroke="#4C4368" strokeWidth="1.8" strokeLinecap="round" />

      {/* Cute nose & mouth line */}
      <polygon points="78,85 82,85 80,88" fill="#38BDF8" opacity="0.8" />
    </svg>
  </div>
);

// -------------------------------------------------------------
// VECTOR ILLUSTRATION: YOUR CIRCLE CLASSROOM COLLABORATION
// -------------------------------------------------------------
const YourCircleIllustration: React.FC = () => (
  <div className="relative w-full max-w-[280px] h-[140px] flex items-center justify-center select-none overflow-hidden rounded-2xl">
    <svg
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-contain"
    >
      <defs>
        {/* Soft floor shadow */}
        <radialGradient id="floorGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F1F5F9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.0" />
        </radialGradient>

        {/* Pod 1: Soft Mint Table */}
        <linearGradient id="podMint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E6FFFA" />
          <stop offset="100%" stopColor="#B2F5EA" />
        </linearGradient>

        {/* Pod 2: Soft Peach Table */}
        <linearGradient id="podPeach" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFAF0" />
          <stop offset="100%" stopColor="#FEEBC8" />
        </linearGradient>

        {/* Pod 3: Soft Lilac Table */}
        <linearGradient id="podLilac" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAF5FF" />
          <stop offset="100%" stopColor="#E9D8FD" />
        </linearGradient>

        {/* Monstera leaf gradient */}
        <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Floor Island Base */}
      <ellipse cx="160" cy="100" rx="150" ry="70" fill="url(#floorGrad)" />

      {/* ======================================================= */}
      {/* Potted Plant 1 (Left - Monstera / Potted Fiddle Leaf)   */}
      {/* ======================================================= */}
      <g transform="translate(45, 90)">
        {/* Pot */}
        <ellipse cx="15" cy="40" rx="14" ry="7" fill="#E2E8F0" />
        <rect x="3" y="24" width="24" height="16" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
        {/* Soil */}
        <ellipse cx="15" cy="24" rx="12" ry="5" fill="#78350F" />
        {/* Big Monstera Leaves */}
        <path d="M15 22 C10 8 0 8 2 18 C3 22 10 23 15 22 Z" fill="url(#leafGrad)" />
        <path d="M15 22 C20 4 32 6 28 17 C26 21 20 23 15 22 Z" fill="url(#leafGrad)" />
        <path d="M15 22 C14 2 22 -4 20 10 C19 15 16 19 15 22 Z" fill="#10B981" />
      </g>

      {/* ======================================================= */}
      {/* Table Pod 1: Top Center (Students in Lilac Circle)      */}
      {/* ======================================================= */}
      <g transform="translate(145, 20)">
        {/* Round Pod Table */}
        <ellipse cx="35" cy="35" rx="36" ry="24" fill="url(#podLilac)" stroke="#D6BCFA" strokeWidth="1.5" />
        <ellipse cx="35" cy="35" rx="14" ry="9" fill="#FFFFFF" />

        {/* Student 1 (Top left) */}
        <ellipse cx="15" cy="18" rx="8" ry="8" fill="#4338CA" />
        <ellipse cx="15" cy="12" rx="5" ry="5" fill="#FED7AA" />
        {/* Mini Laptop */}
        <rect x="18" y="22" width="9" height="6" rx="1" fill="#334155" />

        {/* Student 2 (Top right) */}
        <ellipse cx="55" cy="18" rx="8" ry="8" fill="#7C3AED" />
        <ellipse cx="55" cy="12" rx="5" ry="5" fill="#FBCFE8" />
        {/* Mini Laptop */}
        <rect x="44" y="22" width="9" height="6" rx="1" fill="#334155" />

        {/* Student 3 (Bottom) */}
        <ellipse cx="35" cy="52" rx="8" ry="8" fill="#2563EB" />
        <ellipse cx="35" cy="58" rx="5" ry="5" fill="#FDE68A" />
      </g>

      {/* ======================================================= */}
      {/* Table Pod 2: Bottom Left (Students in Peach Pod)        */}
      {/* ======================================================= */}
      <g transform="translate(95, 80)">
        {/* Round Pod Table */}
        <ellipse cx="35" cy="35" rx="34" ry="22" fill="url(#podPeach)" stroke="#FBD38D" strokeWidth="1.5" />
        <ellipse cx="35" cy="35" rx="13" ry="8" fill="#FFFFFF" />

        {/* Student 1 (Left) */}
        <ellipse cx="15" cy="32" rx="8" ry="8" fill="#9333EA" />
        <ellipse cx="10" cy="30" rx="5" ry="5" fill="#FED7AA" />
        <rect x="20" y="30" width="8" height="5" rx="1" fill="#475569" />

        {/* Student 2 (Bottom) */}
        <ellipse cx="40" cy="52" rx="8" ry="8" fill="#0D9488" />
        <ellipse cx="40" cy="58" rx="5" ry="5" fill="#FDE68A" />

        {/* Student 3 (Right) */}
        <ellipse cx="56" cy="32" rx="8" ry="8" fill="#E11D48" />
        <ellipse cx="61" cy="30" rx="5" ry="5" fill="#FECDD3" />
      </g>

      {/* ======================================================= */}
      {/* Table Pod 3: Bottom Right (Students in Mint Pod)        */}
      {/* ======================================================= */}
      <g transform="translate(195, 75)">
        {/* Round Pod Table */}
        <ellipse cx="35" cy="35" rx="34" ry="22" fill="url(#podMint)" stroke="#81E6D9" strokeWidth="1.5" />
        <ellipse cx="35" cy="35" rx="13" ry="8" fill="#FFFFFF" />

        {/* Student 1 */}
        <ellipse cx="18" cy="22" rx="8" ry="8" fill="#059669" />
        <ellipse cx="18" cy="16" rx="5" ry="5" fill="#FDE68A" />
        <rect x="22" y="26" width="8" height="5" rx="1" fill="#1E293B" />

        {/* Student 2 */}
        <ellipse cx="54" cy="24" rx="8" ry="8" fill="#2563EB" />
        <ellipse cx="54" cy="18" rx="5" ry="5" fill="#FED7AA" />

        {/* Student 3 (Bottom) */}
        <ellipse cx="36" cy="52" rx="8" ry="8" fill="#D97706" />
        <ellipse cx="36" cy="58" rx="5" ry="5" fill="#FBCFE8" />
      </g>

      {/* ======================================================= */}
      {/* Potted Plant 2 (Right - Large Monstera)                 */}
      {/* ======================================================= */}
      <g transform="translate(255, 60)">
        <ellipse cx="14" cy="42" rx="14" ry="7" fill="#E2E8F0" />
        <rect x="2" y="26" width="24" height="16" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
        <ellipse cx="14" cy="26" rx="12" ry="5" fill="#78350F" />
        <path d="M14 24 C10 8 0 10 2 20 C4 24 10 25 14 24 Z" fill="url(#leafGrad)" />
        <path d="M14 24 C20 6 30 8 28 20 C26 24 20 25 14 24 Z" fill="url(#leafGrad)" />
        <path d="M14 24 C14 2 22 -2 20 12 C18 17 15 22 14 24 Z" fill="#047857" />
      </g>
    </svg>
  </div>
);

// -------------------------------------------------------------
// MAIN COMPONENT: STUDENT DASHBOARD
// -------------------------------------------------------------
export const StudentDashboard: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { enrollments, getStudentEnrollments } = useEnrollment();
  const { quizSubmissions, assignmentSubmissions } = useLearning();
  const navigate = useNavigate();

  // Synced enrollments for active student
  const myEnrollments = useMemo(() => {
    if (!user) return [];
    return getStudentEnrollments(user.id);
  }, [user, enrollments, getStudentEnrollments]);

  // Dynamic progress synchronization (defaults to 17% matching spec)
  const lessonProgress = useMemo(() => {
    if (myEnrollments.length === 0) return 17;
    const sum = myEnrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0);
    const avg = Math.round(sum / myEnrollments.length);
    return avg > 0 ? avg : 17;
  }, [myEnrollments]);

  // Dynamic activities completion percentage (defaults to 0% matching spec)
  const activityProgress = useMemo(() => {
    const studentSubmissions = [
      ...quizSubmissions.filter((q) => q.studentId === user?.id),
      ...assignmentSubmissions.filter((a) => a.studentId === user?.id),
    ];
    return studentSubmissions.length > 0 ? Math.min(100, studentSubmissions.length * 25) : 0;
  }, [quizSubmissions, assignmentSubmissions, user]);

  // Modals & Drawers
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isFellowCallOpen, setIsFellowCallOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [practiceType, setPracticeType] = useState<string>('Interview Practice');
  const [isFellowExpanded, setIsFellowExpanded] = useState(false);

  // Profile Update & Dropdown State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Maheswari');
  const [editEmail, setEditEmail] = useState(user?.email || 'student@edusphere.com');
  const [editBio, setEditBio] = useState(
    user?.bio || 'Passionate computer science learner pursuing cloud and AI cybersecurity mastery.'
  );
  const [editAvatar, setEditAvatar] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully. See you soon!');
    navigate('/auth/login');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Student name cannot be empty.');
      return;
    }
    updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      bio: editBio.trim(),
      avatarUrl: editAvatar,
    });
    setIsProfileModalOpen(false);
    toast.success(`Profile updated! Welcome, ${editName.trim()}.`);
  };

  // AI Fellow Chat Input & History
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'cat' | 'user'; text: string; time: string }>
  >([
    {
      sender: 'cat',
      text: "Meow! Ready to secure the cloud? I'm your AI fellow, Cyber Cat. Ask me anything or try a quick quiz!",
      time: 'Just now',
    },
  ]);

  // Handle Fellow Quick Prompts
  const handleQuickPrompt = (promptText: string) => {
    setPracticeType(promptText);
    if (promptText.includes('Interview')) {
      setIsPracticeModalOpen(true);
    } else if (promptText.includes('Quiz')) {
      setIsPracticeModalOpen(true);
    } else {
      // Recap prompt
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        { sender: 'user', text: promptText, time: now },
        {
          sender: 'cat',
          text: "Here is your recap: In 'Inside the Breach - They're in the cloud', you learned AWS IAM privilege escalation patterns and automated GuardDuty detections. Next step: complete Lab 3 on IAM role trust policies!",
          time: now,
        },
      ]);
      toast.success('Cyber Cat prepared your lesson recap!');
    }
  };

  // Handle Fellow Chat Submit
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInput('');

    // Simulated Cyber Cat AI Response
    setTimeout(() => {
      let reply = "Paws up! In cloud breach forensics, always inspect CloudTrail logs for 'AssumeRole' API calls.";
      if (userText.toLowerCase().includes('quiz') || userText.toLowerCase().includes('practice')) {
        reply = "Let's test your skills! What HTTP status code does an unauthorized AWS S3 request return? (Hint: 403 Forbidden).";
      } else if (userText.toLowerCase().includes('hello') || userText.toLowerCase().includes('hi')) {
        reply = "Hello Maheswari! Cyber Cat reporting for duty. What cyber challenge are we tackling today?";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'cat',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const outletContext = useOutletContext<{ onToggleMobileMenu?: () => void }>() || {};

  return (
    <div className="relative min-h-[calc(100vh-4rem)] space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Ambient background glows matching Figma design: subtle mint glow on top-left and lavender on top-right */}
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-emerald-200/25 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-10 right-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================= */}
      {/* 1. TOP HEADER & GREETING BAR                              */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          {outletContext?.onToggleMobileMenu && (
            <button
              onClick={outletContext.onToggleMobileMenu}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hi, {user?.name || 'Maheswari'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Your next step to keep moving forward with AI
            </p>
          </div>
        </div>

        {/* Right context indicator & quick utility icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>CyberGenius - Inside the Breach</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                navigate('/courses');
                toast.info('Opening CyberGenius curriculum search...');
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Search curriculum"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsFellowCallOpen(true);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cyber Cat Fellow"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info('CyberGenius notification: Microsoft Masterclass starts Dec 8!')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Student Profile & Logout Trigger */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#5B3DF5]/40 transition-all"
                title="Profile & Account Settings"
                data-testid="student-profile-btn"
              >
                <img
                  src={user?.avatarUrl || editAvatar}
                  alt={user?.name || 'Maheswari'}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-xs"
                />
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl z-50 p-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user?.name || 'Maheswari'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'student@edusphere.com'}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-[#5B3DF5] dark:bg-purple-950 dark:text-purple-300">
                        Student Account
                      </span>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setEditName(user?.name || 'Maheswari');
                          setEditEmail(user?.email || 'student@edusphere.com');
                          setEditBio(user?.bio || 'Passionate computer science learner pursuing cloud and AI cybersecurity mastery.');
                          setEditAvatar(user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#5B3DF5]" />
                        <span>Update Profile</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN 2-COLUMN LAYOUT: CONTENT (8 COLS) + FELLOW (4 COLS)*/}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ------------------------------------------------------- */}
        {/* LEFT 8 COLS: HERO CARD + YOUR PROGRESS + YOUR CIRCLE    */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. FEATURED "CONTINUE" HERO CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Left Column: Photo of Instructor */}
              <div className="sm:col-span-5 md:col-span-6 relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xs bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80"
                  alt="Instructor Inside the Breach"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                  LIVE TRACK
                </div>
              </div>

              {/* Right Column: Course Info & Continue Actions */}
              <div className="sm:col-span-7 md:col-span-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-400 uppercase">
                    CONTINUE
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    Inside the Breach
                  </p>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug mt-1.5">
                    Inside the Breach - They're in the cloud
                  </h2>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => setIsLessonModalOpen(true)}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    View all lessons
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* B. BOTTOM ROW: YOUR PROGRESS (4-5 COLS) + YOUR CIRCLE (7-8 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* CARD 1: YOUR PROGRESS */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  YOUR PROGRESS
                </span>

                {/* Two Vertical Thermometer Gauges Side by Side */}
                <div className="grid grid-cols-2 gap-4 mt-4 items-end">
                  {/* Gauge 1: Lessons (17%) */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-36 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                      {/* Filled Pill */}
                      <div
                        style={{ height: `${lessonProgress}%` }}
                        className="w-full rounded-full bg-[#9D8DF1] transition-all duration-700 ease-out shadow-xs"
                      />
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                        {lessonProgress}%
                      </span>
                      <p className="text-xs text-slate-400 font-medium mt-1">Lessons</p>
                    </div>
                  </div>

                  {/* Gauge 2: Activities (0%) */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-36 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                      {/* Empty Pill */}
                      <div
                        style={{ height: `${activityProgress}%` }}
                        className="w-full rounded-full bg-[#9D8DF1] transition-all duration-700 ease-out"
                      />
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                        {activityProgress}%
                      </span>
                      <p className="text-xs text-slate-400 font-medium mt-1">Activities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: YOUR CIRCLE */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  YOUR CIRCLE
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center mt-2">
                  {/* Event Details */}
                  <div className="sm:col-span-5 space-y-1">
                    <span className="text-xs text-slate-400 font-medium">Next event</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#5B3DF5] dark:text-[#8B72F8] tracking-tight leading-tight">
                      8 DEC
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug pt-1">
                      Cyber Genius Masterclass
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      With Microsoft
                    </p>
                  </div>

                  {/* 3D Circular Tables Community Scene */}
                  <div className="sm:col-span-7 flex flex-col items-center sm:items-end justify-center">
                    <YourCircleIllustration />
                    <button
                      onClick={() => setIsEventModalOpen(true)}
                      className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-[#5B3DF5] dark:hover:text-[#8B72F8] transition-colors mt-1 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Be the first to enter</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* RIGHT 4 COLS: YOUR FELLOW (CYBER CAT AI COMPANION)      */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between min-h-[580px]">
            {/* Top row with expand icon and header */}
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => setIsFellowExpanded(!isFellowExpanded)}
                className="absolute left-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-lg"
                title={isFellowExpanded ? 'Compact view' : 'Expand Fellow panel'}
              >
                {isFellowExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <span className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase text-center">
                YOUR FELLOW
              </span>
            </div>

            {/* Center Profile: Cyber Cat */}
            <div className="flex flex-col items-center text-center my-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Cyber Cat
              </h3>

              {/* Avatar with soft glow */}
              <div className="my-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsFellowCallOpen(true)}>
                <CyberCatIllustration size={135} />
              </div>

              {/* Call Button (Green Outline Pill) */}
              <button
                onClick={() => setIsFellowCallOpen(true)}
                className="mt-1 inline-flex items-center justify-center px-9 py-1.5 rounded-full border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 text-xs font-bold transition-all shadow-xs"
              >
                Call
              </button>
            </div>

            {/* Quick Action Prompt Buttons */}
            <div className="space-y-2 mt-2">
              <button
                onClick={() => handleQuickPrompt('Interview Practice')}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700"
              >
                <span>Interview Practice</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => handleQuickPrompt('Recap and next step')}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-center shadow-2xs hover:border-slate-300 dark:hover:border-slate-700"
              >
                Recap and next step
              </button>

              <button
                onClick={() => handleQuickPrompt('Quiz me on this lesson')}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-center shadow-2xs hover:border-slate-300 dark:hover:border-slate-700"
              >
                Quiz me on this lesson
              </button>
            </div>

            {/* Expanded Chat Log (if user asked questions) */}
            {chatMessages.length > 1 && (
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 max-h-36 overflow-y-auto space-y-2 text-xs">
                {chatMessages.slice(-2).map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <span
                      className={`px-3 py-1.5 rounded-xl max-w-[90%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-black text-white dark:bg-brand-600'
                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600'
                      }`}
                    >
                      {msg.text}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Interactive Chat Input Bar */}
            <form onSubmit={handleSendChat} className="mt-4">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800/90 px-3.5 py-2 flex items-center gap-2 border border-slate-200/60 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#7047EB]/20 transition-all">
                <button
                  type="button"
                  onClick={() => toast.info('Attach files or code snippet for Cyber Cat review.')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4 -rotate-45" />
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Cyber Cat anything"
                  className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium"
                />

                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="text-slate-600 dark:text-slate-300 hover:text-[#5B3DF5] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE MODALS                                     */}
      {/* ========================================================= */}

      {/* MODAL 1: LESSON PLAYER "Inside the Breach - They're in the cloud" */}
      {isLessonModalOpen && (
        <Modal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          title="Inside the Breach - They're in the cloud"
          description="CyberGenius Flagship Security Track · Episode 3"
          maxWidth="lg"
        >
          <div className="space-y-4 py-2">
            {/* Simulated Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center group shadow-md">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&auto=format&fit=crop&q=80"
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <button
                onClick={() => toast.success('Streaming video: AWS IAM Incident Response simulation')}
                className="w-14 h-14 rounded-full bg-white/90 text-slate-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl group-hover:bg-[#5B3DF5] group-hover:text-white"
              >
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-mono">14:20 / 48:10</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/80 font-bold text-[10px]">
                  1080p HD
                </span>
              </div>
            </div>

            {/* Lesson Summary & Objectives */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Lesson Overview
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                In this episode, lead incident responders walk through a real-world multi-tenant AWS cloud infiltration. You will trace how compromised CI/CD tokens lead to cross-account S3 exfiltration, and learn how to construct automated remediation lambdas.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLessonModalOpen(false)}
              >
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsLessonModalOpen(false);
                    navigate('/courses');
                  }}
                  leftIcon={<Search className="w-3.5 h-3.5" />}
                >
                  Course Catalog & Registration
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsLessonModalOpen(false);
                    navigate('/courses/course-cyber-1');
                  }}
                  className="bg-black text-white hover:bg-slate-800"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Watch Recordings & References
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: LIVE CALL WITH CYBER CAT */}
      {isFellowCallOpen && (
        <Modal
          isOpen={isFellowCallOpen}
          onClose={() => setIsFellowCallOpen(false)}
          title="Cyber Cat Live Fellow Call"
          description="Interactive AI Cybersecurity Tutoring Session"
          maxWidth="md"
        >
          <div className="space-y-6 py-4 flex flex-col items-center text-center">
            {/* Pulsing Avatar */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl animate-pulse" />
              <CyberCatIllustration size={150} />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Cyber Cat is Listening...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                "Hi Maheswari! I'm analyzing your latest progress in cloud defenses. Ask me anything or practice your technical interview!"
              </p>
            </div>

            {/* Animated Audio Waveform */}
            <div className="flex items-center gap-1.5 h-10 py-2">
              {[40, 75, 30, 90, 50, 100, 65, 80, 45, 85, 35, 95].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1.5 rounded-full bg-[#5B3DF5] animate-pulse"
                />
              ))}
            </div>

            {/* Call Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => toast.info('Muted microphone.')}
                className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                title="Mute"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsFellowCallOpen(false);
                  toast.success('Call ended. Cyber Cat saved session notes to your dashboard.');
                }}
                className="w-13 h-13 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all p-3"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: YOUR CIRCLE MASTERCLASS RSVP */}
      {isEventModalOpen && (
        <Modal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          title="Cyber Genius Masterclass With Microsoft"
          description="8 DEC · Global Student Innovation Stage"
          maxWidth="md"
        >
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
                <Calendar className="w-4 h-4 text-[#5B3DF5]" />
                <span>Date: Friday, December 8, 2026 · 10:00 AM PST</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Led by Microsoft Security Architecture team</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Interactive Live Hack-a-thon & Hands-on Azure Sentinel Labs</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Connect with over 1,200 student peers across the globe in virtual breakout circles. You will investigate simulated intrusion incidents in teams and earn official Microsoft digital badges.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEventModalOpen(false)}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsEventModalOpen(false);
                  toast.success("RSVP Confirmed! Calendar invitation sent to student@edusphere.com.");
                }}
                className="bg-[#5B3DF5] hover:bg-[#4E31DD] text-white"
              >
                RSVP & Claim Free Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: INTERVIEW PRACTICE & QUIZ */}
      {isPracticeModalOpen && (
        <Modal
          isOpen={isPracticeModalOpen}
          onClose={() => setIsPracticeModalOpen(false)}
          title={practiceType}
          description="Interactive Cyber Cat Challenge"
          maxWidth="md"
        >
          <div className="space-y-4 py-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B3DF5]">
                  Question 1 of 3
                </span>
                <span className="text-[10px] text-slate-400">Cloud Defense</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                When an attacker compromises an EC2 instance metadata service (IMDSv1), which mechanism best mitigates token exfiltration?
              </p>
            </div>

            <div className="space-y-2">
              {[
                { label: 'A', text: 'Enforce IMDSv2 requiring session-oriented PUT requests' },
                { label: 'B', text: 'Disable IAM roles on EC2 entirely' },
                { label: 'C', text: 'Increase security group ingress ports' },
                { label: 'D', text: 'Allow public access to S3 buckets' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    if (opt.label === 'A') {
                      toast.success('Correct! IMDSv2 uses session-oriented tokens to prevent SSRF vulnerabilities.');
                      setIsPracticeModalOpen(false);
                    } else {
                      toast.error('Incorrect. Try again! IMDSv2 is the AWS best practice.');
                    }
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#5B3DF5] hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-left flex items-center gap-3 transition-all"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {opt.label}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPracticeModalOpen(false)}
              >
                Exit Practice
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 5: STUDENT PROFILE UPDATE MODAL */}
      {isProfileModalOpen && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="Update Student Profile"
          description="Manage your student identity and academic track preferences"
          maxWidth="md"
        >
          <form onSubmit={handleProfileSubmit} className="space-y-4 py-2">
            {/* Avatar Preview & URL */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <img
                src={editAvatar}
                alt="Avatar preview"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#5B3DF5]/30 shadow-xs"
              />
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#5B3DF5]/30 text-slate-900 dark:text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#5B3DF5]/30 text-slate-900 dark:text-white"
                placeholder="e.g. Maheswari"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#5B3DF5]/30 text-slate-900 dark:text-white"
                placeholder="student@edusphere.com"
              />
            </div>

            {/* Bio / Track Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Academic Track Bio
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#5B3DF5]/30 text-slate-900 dark:text-white resize-none"
                placeholder="Describe your current study tracks, certifications, and goals..."
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-black hover:bg-slate-800 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentDashboard;
