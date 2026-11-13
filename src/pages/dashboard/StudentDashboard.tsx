import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Bookmark,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BookOpen,
  LineChart as LineChartIcon,
  FileCheck2,
  UserCheck,
  GraduationCap,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/context/CourseContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

// -------------------------------------------------------------
// CHART DATA: WEEKLY LEARNING HOURS SPLINE
// -------------------------------------------------------------
const WEEKLY_LEARNING_DATA = [
  { day: 'mon', hours: 0, label: '0h' },
  { day: 'tue', hours: 1.5, label: '1.5h' },
  { day: 'wed', hours: 2.5, label: '2.5h' },
  { day: 'thu', hours: 1.0, label: '1h' },
  { day: 'fri', hours: 4.0, label: '4h' },
  { day: 'sat', hours: 3.0, label: '3h' },
  { day: 'sun', hours: 2.0, label: '2h' },
];

const MONTHLY_LEARNING_DATA = [
  { day: 'W1', hours: 8.5, label: '8.5h' },
  { day: 'W2', hours: 12.0, label: '12h' },
  { day: 'W3', hours: 14.5, label: '14.5h' },
  { day: 'W4', hours: 10.0, label: '10h' },
];

// -------------------------------------------------------------
// COURSE MOCK DATA (EXACT MATCH TO USER SCREENSHOT)
// -------------------------------------------------------------
interface MyCourseItem {
  id: string;
  title: string;
  tag: string;
  tagColor: 'blue' | 'rose' | 'emerald';
  rating: number;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  thumbnailType: 'react' | 'java' | 'fitness';
  progressPercent: number;
}

const MY_COURSES: MyCourseItem[] = [
  {
    id: 'my-c-1',
    title: 'Learn React From Scratch,Build Stunning Uls With Ease,And Create Real-World Projects.',
    tag: 'FRONTEND',
    tagColor: 'blue',
    rating: 4.0,
    instructorName: 'Peter Anderson',
    instructorRole: 'Software Developer',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    thumbnailType: 'react',
    progressPercent: 68,
  },
  {
    id: 'my-c-2',
    title: 'Unlock Java Backend Power,Build Secure Restful APIs,And Deploy Your First Project.',
    tag: 'BACKEND',
    tagColor: 'rose',
    rating: 4.0,
    instructorName: 'Max Ritz',
    instructorRole: 'Software Developer',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    thumbnailType: 'java',
    progressPercent: 42,
  },
  {
    id: 'my-c-3',
    title: 'Get Fit At Home Fast, No Equipment Needed, 30-Day Body Challenge, Stay Healthy & Active.',
    tag: 'HEALTH & FITNESS',
    tagColor: 'emerald',
    rating: 4.0,
    instructorName: 'Ashley Kruger',
    instructorRole: 'Yoga Instructor',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    thumbnailType: 'fitness',
    progressPercent: 85,
  },
];

interface PopularCourseItem {
  id: string;
  title: string;
  tag: string;
  tagColor: 'amber' | 'orange' | 'purple';
  rating: number;
  price: number;
  thumbnailType: 'design' | 'productivity' | 'music';
}

const POPULAR_COURSES: PopularCourseItem[] = [
  {
    id: 'pop-c-1',
    title: 'Master UI By Creating, Design With Fun Projects, Explore Layouts & Colors, Bring Ideas To Life.',
    tag: 'DESIGN',
    tagColor: 'amber',
    rating: 4.0,
    price: 150,
    thumbnailType: 'design',
  },
  {
    id: 'pop-c-2',
    title: 'Double Your Output Fast, Build Smart Daily Habits, Manage Time Like Pros, Stay Focused For Life.',
    tag: 'PRODUCTIVITY',
    tagColor: 'orange',
    rating: 4.0,
    price: 150,
    thumbnailType: 'productivity',
  },
  {
    id: 'pop-c-3',
    title: 'Train With Real Artists, Master Your Singing Voice, Perform On Any Stage, Grow From Zero To Pro',
    tag: 'MUSIC',
    tagColor: 'purple',
    rating: 4.0,
    price: 150,
    thumbnailType: 'music',
  },
];

// -------------------------------------------------------------
// INLINE VECTOR GRAPHICS & 3D ILLUSTRATIONS
// -------------------------------------------------------------

/** 3D Student Character sitting on books reading a book (matching screenshot) */
const Student3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 280 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-48 sm:w-56 h-auto drop-shadow-2xl select-none"
  >
    <defs>
      {/* Gradients for Books */}
      <linearGradient id="bookYellow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="bookTeal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
      <linearGradient id="bookCoral" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="bookBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>

      {/* Gradients for Student Hoodie */}
      <linearGradient id="hoodieGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="60%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#3730A3" />
      </linearGradient>
      {/* Jeans */}
      <linearGradient id="jeansGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      {/* Skin */}
      <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
      {/* Hair */}
      <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>

    {/* Stack of books on the ground (base) */}
    {/* Book 1 - Teal Base */}
    <rect x="25" y="215" width="105" height="18" rx="4" fill="url(#bookTeal)" />
    <path d="M125 218H130V230H125Z" fill="#F8FAFC" />
    <rect x="200" y="215" width="60" height="18" rx="4" fill="url(#bookTeal)" />

    {/* Book 2 - Yellow Middle */}
    <rect x="35" y="198" width="95" height="17" rx="3" fill="url(#bookYellow)" />
    <path d="M125 201H129V212H125Z" fill="#F8FAFC" />
    <rect x="205" y="198" width="55" height="17" rx="3" fill="url(#bookYellow)" />

    {/* Book 3 - Coral Top */}
    <rect x="42" y="182" width="85" height="16" rx="3" fill="url(#bookCoral)" />
    <path d="M122 185H126V195H122Z" fill="#F8FAFC" />

    {/* Book Stack on right side */}
    <rect x="210" y="180" width="50" height="18" rx="3" fill="url(#bookCoral)" />
    <rect x="215" y="162" width="45" height="18" rx="3" fill="url(#bookBlue)" />

    {/* Student Legs (Cross-legged / sitting) */}
    <ellipse cx="140" cy="224" rx="48" ry="14" fill="#000000" fillOpacity="0.25" />
    {/* Right Leg */}
    <path
      d="M135 178 C155 185 185 195 175 220 C165 224 140 220 130 205 Z"
      fill="url(#jeansGrad)"
    />
    {/* Left Leg */}
    <path
      d="M125 178 C105 185 75 195 85 220 C95 224 120 220 130 205 Z"
      fill="url(#jeansGrad)"
    />
    {/* Shoes */}
    <ellipse cx="90" cy="222" rx="14" ry="7" fill="#E2E8F0" />
    <ellipse cx="170" cy="222" rx="14" ry="7" fill="#E2E8F0" />

    {/* Torso / Purple Hoodie */}
    <path
      d="M106 115 C106 100 154 100 154 115 L160 185 C160 192 100 192 100 185 Z"
      fill="url(#hoodieGrad)"
    />

    {/* Head & Neck */}
    <rect x="123" y="90" width="14" height="14" rx="4" fill="url(#skinGrad)" />
    <ellipse cx="130" cy="74" rx="20" ry="22" fill="url(#skinGrad)" />

    {/* Hair (Modern 3D style) */}
    <path
      d="M110 68 C110 48 150 48 150 68 C145 60 138 56 130 56 C122 56 115 62 110 68 Z"
      fill="url(#hairGrad)"
    />
    <path
      d="M115 54 C120 42 142 42 146 54 C138 46 126 46 115 54 Z"
      fill="#475569"
    />

    {/* Facial features */}
    <ellipse cx="123" cy="73" rx="2.5" ry="3.5" fill="#1E293B" />
    <ellipse cx="137" cy="73" rx="2.5" ry="3.5" fill="#1E293B" />
    <path d="M121 68 Q124 66 127 68" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M133 68 Q136 66 139 68" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M127 82 Q130 85 133 82" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />

    {/* Open Book in Hands */}
    {/* Left Page */}
    <path
      d="M130 148 L96 135 C94 134 94 130 96 128 L128 116 C129 115 131 116 131 118 L130 148 Z"
      fill="#FFFFFF"
    />
    {/* Right Page */}
    <path
      d="M130 148 L164 135 C166 134 166 130 164 128 L132 116 C131 115 129 116 129 118 L130 148 Z"
      fill="#F1F5F9"
    />
    {/* Book Cover / Spine */}
    <path d="M130 148 L130 152" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
    {/* Book Spine Shadow */}
    <line x1="130" y1="116" x2="130" y2="148" stroke="#CBD5E1" strokeWidth="1.5" />
    {/* Text lines on book */}
    <line x1="102" y1="126" x2="124" y2="120" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    <line x1="103" y1="132" x2="125" y2="126" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    <line x1="104" y1="138" x2="122" y2="132" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    <line x1="136" y1="120" x2="158" y2="126" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    <line x1="135" y1="126" x2="157" y2="132" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    <line x1="137" y1="132" x2="155" y2="138" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />

    {/* Arms holding the book */}
    <path
      d="M106 130 C95 140 98 152 112 148 L116 142"
      stroke="url(#hoodieGrad)"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <circle cx="112" cy="146" r="5" fill="url(#skinGrad)" />

    <path
      d="M154 130 C165 140 162 152 148 148 L144 142"
      stroke="url(#hoodieGrad)"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <circle cx="148" cy="146" r="5" fill="url(#skinGrad)" />
  </svg>
);

/** 3D Megaphone Illustration with Sound Waves */
const Megaphone3DIllustration: React.FC = () => (
  <svg
    viewBox="0 0 160 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-24 sm:w-28 h-auto drop-shadow-xl select-none"
  >
    <defs>
      <linearGradient id="megaPurple" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#7E22CE" />
        <stop offset="100%" stopColor="#581C87" />
      </linearGradient>
      <linearGradient id="megaYellow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="megaGray" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>

    {/* Sound waves / ripples */}
    <path
      d="M125 45 C132 55 132 75 125 85"
      stroke="#A855F7"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M138 35 C150 50 150 80 138 95"
      stroke="#D8B4FE"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M148 25 C164 45 164 85 148 105"
      stroke="#E9D5FF"
      strokeWidth="3.5"
      strokeLinecap="round"
      opacity="0.4"
    />

    {/* Megaphone Body */}
    {/* Handle */}
    <rect
      x="35"
      y="80"
      width="14"
      height="35"
      rx="7"
      transform="rotate(25 35 80)"
      fill="url(#megaYellow)"
    />
    {/* Body cone */}
    <path
      d="M48 68 L105 38 C108 36 112 38 112 42 L112 92 C112 96 108 98 105 96 L48 76 C44 74 44 70 48 68 Z"
      fill="url(#megaPurple)"
    />
    {/* Yellow Horn Rim (Ellipse opening) */}
    <ellipse cx="112" cy="67" rx="8" ry="28" fill="url(#megaYellow)" />
    <ellipse cx="112" cy="67" rx="5" ry="24" fill="#CA8A04" />

    {/* Back Cap (Handle base) */}
    <ellipse cx="46" cy="72" rx="6" ry="10" fill="url(#megaGray)" />
    <circle cx="42" cy="72" r="3" fill="#64748B" />
  </svg>
);

// -------------------------------------------------------------
// CIRCULAR PROGRESS COMPONENT
// -------------------------------------------------------------
interface CircularMetricProps {
  valueText: string;
  subText?: string;
  percentage: number;
  label: string;
}

const CircularMetricCard: React.FC<CircularMetricProps> = ({
  valueText,
  subText,
  percentage,
  label,
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5">
      <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
        <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 56 56">
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="#EDE9FE"
            strokeWidth="4.5"
            fill="transparent"
            className="dark:stroke-slate-800"
          />
          {/* Foreground progress circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="#7047EB"
            strokeWidth="4.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Text inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-none">
            {valueText}
          </span>
          {subText && (
            <span className="text-[9px] font-semibold text-slate-400 leading-none mt-0.5">
              {subText}
            </span>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
          {label}
        </p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MAIN COMPONENT: STUDENT DASHBOARD
// -------------------------------------------------------------
export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { enrollStudent, isStudentEnrolled } = useEnrollment();
  const navigate = useNavigate();

  // Bookmarked course items
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['my-c-1', 'my-c-3']);

  // Statistics chart timeframe & tab
  const [statsTimeframe, setStatsTimeframe] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [statsTab, setStatsTab] = useState<'hours' | 'courses'>('hours');

  // Carousel page state for "My Courses"
  const [myCoursesPage, setMyCoursesPage] = useState(0);

  // Modals
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<MyCourseItem | PopularCourseItem | null>(null);

  // Toggle Bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      toast.success(exists ? 'Removed from saved courses' : 'Course bookmarked to your list!');
      return next;
    });
  };

  // Courses data
  const filteredMyCourses = MY_COURSES;
  const filteredPopularCourses = POPULAR_COURSES;

  // Handle Get Course
  const handleGetCourse = (popCourse: PopularCourseItem) => {
    // Check if matching course exists in catalog to enroll
    const matching = courses.find((c) => c.title.toLowerCase().includes(popCourse.tag.toLowerCase())) || courses[0];
    if (matching && user) {
      if (!isStudentEnrolled(user.id, matching.id)) {
        enrollStudent(user.id, matching.id);
      }
    }
    toast.success(`Successfully enrolled in "${popCourse.title.slice(0, 32)}..."! Happy learning.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* ========================================================= */}
      {/* TOP HERO BANNER & 4 CIRCULAR STATS (2-COL DESKTOP)        */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Cols: Gradient Hero Banner with 3D Reading Student */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5A20DF] via-[#6D34EC] to-[#8048F4] text-white p-6 sm:p-8 shadow-xl shadow-[#7047EB]/15 flex flex-col justify-between min-h-[220px]">
          {/* Subtle Ambient Glow Circles */}
          <div className="absolute right-20 -top-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-900/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-md space-y-3">
            {/* Tag Pills */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-extrabold tracking-widest uppercase">
                ONLINE COURSE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-200">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Student Learning Center
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
              Sharpen Your Skills With <br />
              Professional Online Courses
            </h1>

            {/* Pill Action Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const firstCourse = courses[0];
                  if (firstCourse) navigate(`/courses/${firstCourse.id}`);
                  else toast.info('Navigating to course player...');
                }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#4E13D4] hover:bg-[#400cb8] active:scale-95 text-white text-xs font-bold transition-all shadow-md group"
              >
                <span>Join Now</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                </span>
              </button>
            </div>
          </div>

          {/* 3D Student Illustration on Right */}
          <div className="absolute right-0 sm:right-4 bottom-0 z-10 pointer-events-none transform translate-y-2 sm:translate-y-0">
            <Student3DIllustration />
          </div>
        </div>

        {/* Right 4 Cols: 2x2 Circular Metrics Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
          {/* Card 1: Courses Completed (11/16 ~ 69%) */}
          <CircularMetricCard
            valueText="11/16"
            percentage={69}
            label="Courses completed"
          />

          {/* Card 2: Courses in Progress (4/16 ~ 25%) */}
          <CircularMetricCard
            valueText="4/16"
            percentage={25}
            label="Courses in progress"
          />

          {/* Card 3: Total Learning Time (45 hrs) */}
          <CircularMetricCard
            valueText="45"
            subText="hrs"
            percentage={78}
            label="Total learning time"
          />

          {/* Card 4: Daily Learning Streak (3 Day) */}
          <CircularMetricCard
            valueText="3"
            subText="Day"
            percentage={60}
            label="Daily Learning Streak"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. QUICK LEARNING NAVIGATION SHORTCUT BAR                 */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#7047EB]" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Quick Learning Navigation
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            — Jump directly to active curriculum trackers
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <Link
            to="/progress"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-[#7047EB] dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>My Progress</span>
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Course Catalog</span>
          </Link>
          <Link
            to="/assignments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Assignments & Quizzes</span>
          </Link>
          <Link
            to="/instructors"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty Mentors</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MIDDLE SECTION: MY COURSES (8 COLS) + YOUR STATISTICS  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: "My Courses" */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                My Courses
              </h2>
              <span className="text-[11px] font-medium text-slate-400">
                — My Enrolled Courses
              </span>
            </div>

            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMyCoursesPage((p) => Math.max(0, p - 1))}
                disabled={myCoursesPage === 0}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-[#7047EB] hover:border-[#7047EB] disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMyCoursesPage((p) => p + 1)}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-[#7047EB] hover:border-[#7047EB] transition-colors shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredMyCourses.map((c) => {
              const isBookmarked = bookmarkedIds.includes(c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => setPreviewCourse(c)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Course Thumbnail Container matching graphic style */}
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3">
                      {c.thumbnailType === 'react' ? (
                        <div className="w-full h-full bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0A2540] flex flex-col items-center justify-center text-center p-3 text-white">
                          <span className="text-[10px] tracking-wider font-extrabold text-cyan-400 uppercase">
                            FRONT END DEVELOPMENT
                          </span>
                          <span className="text-sm font-black text-white tracking-widest mt-0.5">
                            WITH REACT
                          </span>
                          <div className="mt-2 text-cyan-400/80">
                            <svg className="w-8 h-8 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
                              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="currentColor" strokeWidth="1.5" />
                              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                            </svg>
                          </div>
                        </div>
                      ) : c.thumbnailType === 'java' ? (
                        <div className="w-full h-full bg-gradient-to-tr from-[#1E112A] via-[#2A153A] to-[#45104E] flex flex-col items-center justify-center text-center p-3 text-white">
                          <span className="text-[9px] tracking-wider font-semibold text-rose-300">
                            BEST Course for
                          </span>
                          <span className="text-sm font-black text-white leading-tight">
                            Java Backend
                          </span>
                          <span className="text-xs font-bold text-rose-300">Development</span>
                          <div className="mt-2 text-[10px] font-mono text-purple-200/70 bg-black/40 px-2 py-0.5 rounded">
                            Spring Boot · REST APIs
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#064E3B] via-[#047857] to-[#10B981] flex flex-col items-center justify-center text-center p-3 text-white">
                          <span className="text-sm font-black tracking-wide text-white">
                            TOP 10
                          </span>
                          <span className="text-xs font-extrabold text-emerald-100">
                            HOME WORKOUT
                          </span>
                          <span className="text-[9px] italic text-emerald-200 mt-1">
                            by Ashley Kruger
                          </span>
                        </div>
                      )}

                      {/* Top-Right Bookmark Button */}
                      <button
                        onClick={(e) => toggleBookmark(c.id, e)}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                          isBookmarked
                            ? 'bg-[#7047EB] text-white shadow-sm'
                            : 'bg-black/30 hover:bg-black/50 text-white'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark course'}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Tag + Star Rating */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full ${
                          c.tagColor === 'blue'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                            : c.tagColor === 'rose'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}
                      >
                        {c.tag}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{c.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Title (2-line clamp) */}
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-relaxed group-hover:text-[#7047EB] transition-colors">
                      {c.title}
                    </h3>
                  </div>

                  {/* Footer Row: Instructor Info + Purple Play Button */}
                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={c.instructorAvatar}
                        alt={c.instructorName}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          {c.instructorName}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          {c.instructorRole}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewCourse(c);
                      }}
                      className="w-7 h-7 rounded-full bg-[#7047EB] hover:bg-[#5E35D8] flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                      title="Continue learning"
                    >
                      <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: "Your statistics" Spline Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
          {/* Header & Tabs */}
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Your statistics
            </h2>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setStatsTab('hours')}
                  className={`font-bold transition-colors ${
                    statsTab === 'hours'
                      ? 'text-slate-900 dark:text-white border-b-2 border-[#7047EB] pb-0.5'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Learning Hours
                </button>
                <button
                  onClick={() => setStatsTab('courses')}
                  className={`font-medium transition-colors ${
                    statsTab === 'courses'
                      ? 'text-slate-900 dark:text-white border-b-2 border-[#7047EB] pb-0.5'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  My Courses
                </button>
              </div>

              {/* Weekly Dropdown Pill */}
              <button
                onClick={() =>
                  setStatsTimeframe((t) => (t === 'Weekly' ? 'Monthly' : 'Weekly'))
                }
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#7047EB] text-white text-[11px] font-semibold hover:bg-[#5E35D8] transition-colors shadow-xs"
              >
                <span>{statsTimeframe}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Smooth Curved Spline Chart */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={statsTimeframe === 'Weekly' ? WEEKLY_LEARNING_DATA : MONTHLY_LEARNING_DATA}
                margin={{ top: 25, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="purpleStatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7047EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7047EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <YAxis
                  ticks={[0, 1, 2, 3, 4, 5]}
                  domain={[0, 5]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-lg shadow-lg">
                          <span className="font-bold">{payload[0].value} hours</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#7047EB"
                  strokeWidth={3}
                  fill="url(#purpleStatGrad)"
                  dot={{
                    r: 4,
                    fill: '#7047EB',
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: '#7047EB',
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. BOTTOM SECTION: POPULAR COURSES (8 COLS) + CTA (4 COLS)*/}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: "Popular Courses" */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Popular Courses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPopularCourses.map((c) => (
              <div
                key={c.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail matching screenshot */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3">
                    {c.thumbnailType === 'design' ? (
                      <div className="w-full h-full bg-gradient-to-tr from-[#312E81] via-[#4338CA] to-[#6366F1] flex flex-col items-center justify-center text-center p-3 text-white">
                        <span className="text-[9px] tracking-widest font-extrabold uppercase text-amber-300">
                          GRAPHIC DESIGNING
                        </span>
                        <div className="relative my-1">
                          <span className="text-2xl">👁️</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/90">
                          UI / UX Masterclass
                        </span>
                      </div>
                    ) : c.thumbnailType === 'productivity' ? (
                      <div className="w-full h-full bg-gradient-to-tr from-[#7F1D1D] via-[#991B1B] to-[#DC2626] flex flex-col items-center justify-center text-center p-3 text-white">
                        <span className="text-[10px] tracking-widest font-extrabold uppercase text-amber-200">
                          INCREASE YOUR
                        </span>
                        <span className="text-sm font-black text-white">
                          PRODUCTIVITY 2x
                        </span>
                        <span className="text-[9px] italic text-rose-200 mt-0.5">
                          by John Kenney
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-[#1E1B4B] via-[#2E1065] to-[#4C1D95] flex flex-col items-center justify-center text-center p-3 text-white">
                        <span className="text-[9px] tracking-wider font-extrabold uppercase text-purple-300">
                          FROM BEGINNER TO PRO
                        </span>
                        <span className="text-xs font-black text-white leading-tight">
                          ONE COURSE, ENDLESS GROWTH
                        </span>
                        <span className="text-[9px] italic text-purple-200 mt-0.5">
                          by Michael Harris
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tag + Star Rating */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full ${
                        c.tagColor === 'amber'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : c.tagColor === 'orange'
                          ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400'
                          : 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
                      }`}
                    >
                      {c.tag}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{c.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-relaxed group-hover:text-[#7047EB] transition-colors">
                    {c.title}
                  </h3>
                </div>

                {/* Footer Row: Price + "Get Course" Button */}
                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    ${c.price}
                  </span>

                  <button
                    onClick={() => handleGetCourse(c)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#7047EB] hover:bg-[#5E35D8] active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Get Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: "Learn even more!" CTA Card */}
        <div className="lg:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EDE9FE]/90 to-[#F5F3FF] dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-900/40 p-6 flex flex-col justify-between shadow-xs min-h-[220px]">
          <div className="relative z-10 max-w-[210px] space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Learn even more!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Gain access to exclusive content, priority support & certifications – just $9.99/month!
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#7047EB] hover:bg-[#5E35D8] active:scale-95 text-white text-xs font-bold shadow-md shadow-[#7047EB]/25 transition-all"
              >
                Go Premium
              </button>
            </div>
          </div>

          {/* 3D Megaphone Graphic in corner */}
          <div className="absolute right-0 bottom-1 pointer-events-none transform translate-x-2">
            <Megaphone3DIllustration />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. MODALS: PRO TIER DIALOG & COURSE PREVIEW               */}
      {/* ========================================================= */}
      {/* Pro Tier Dialog */}
      {isPremiumModalOpen && (
        <Modal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          title="Unlock EduSphere Premium Pass"
          description="Accelerate your mastery with unlimited learning credentials & mentors"
          maxWidth="md"
        >
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Check className="w-4 h-4 text-[#7047EB]" />
                <span>Unlimited access to 100+ Computer Science Masterclasses</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Check className="w-4 h-4 text-[#7047EB]" />
                <span>Direct 1-on-1 Code Reviews from Lead Faculty</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Check className="w-4 h-4 text-[#7047EB]" />
                <span>Verified Accredited Certificates for LinkedIn & Resumes</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Check className="w-4 h-4 text-[#7047EB]" />
                <span>Offline video lecture downloads on mobile & desktop</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white">
              <span>Subscription Price:</span>
              <span className="text-base text-[#7047EB]">$9.99 / month</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPremiumModalOpen(false)}
              >
                Maybe Later
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsPremiumModalOpen(false);
                  toast.success('Welcome to EduSphere Premium! 7-Day Free Trial activated.');
                }}
                className="bg-[#7047EB] hover:bg-[#5E35D8]"
              >
                Start 7-Day Free Trial
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Course Detail Preview Modal */}
      {previewCourse && (
        <Modal
          isOpen={!!previewCourse}
          onClose={() => setPreviewCourse(null)}
          title={previewCourse.title}
          description={`Category: ${previewCourse.tag} · Rating: ⭐ ${previewCourse.rating.toFixed(1)}`}
          maxWidth="lg"
        >
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This curriculum track is part of your personalized student dashboard syllabus. Gain practical hands-on experience, complete guided exercises, and evaluate your knowledge with verified tests.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">Track Specialization</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {previewCourse.tag}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">Curriculum Tier</span>
                <p className="font-bold text-[#7047EB] mt-0.5">
                  Accredited Masterclass
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewCourse(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Play className="w-3.5 h-3.5 fill-white text-white" />}
                onClick={() => {
                  setPreviewCourse(null);
                  navigate('/courses');
                }}
                className="bg-[#7047EB] hover:bg-[#5E35D8]"
              >
                Resume Coursework
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
