import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Share2,
  GraduationCap,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCourses } from '@/context/CourseContext';
import { useAuth } from '@/context/AuthContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { CourseDetailsSkeleton } from '@/components/feedback/SkeletonLoader';
import { getCourseVideoLibrary, CourseVideo } from '@/utils/videoHelpers';

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCourseById } = useCourses();
  const { user } = useAuth();
  const { isStudentEnrolled, enrollStudent } = useEnrollment();

  const course = id ? getCourseById(id) : undefined;
  const isEnrolled = user ? isStudentEnrolled(user.id, course?.id || '') : false;

  // Video Player & Reference Media State
  const [activeMediaTab, setActiveMediaTab] = useState<'recordings' | 'reference' | 'syllabus'>('recordings');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '1.25x' | '1.5x' | '2x'>('1x');
  const [videoProgress, setVideoProgress] = useState(24);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // 3-second human-friendly skeleton loader
  const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(!isTestEnv);

  React.useEffect(() => {
    if (isTestEnv) return;
    const timer = setTimeout(() => {
      setIsSkeletonLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isTestEnv]);

  // Generate tailored recordings & reference videos based on course
  const videoLib = useMemo(
    () => (course ? getCourseVideoLibrary(course) : { recordings: [], references: [], allVideos: [] }),
    [course]
  );
  const courseRecordings = videoLib.recordings;
  const courseReferences = videoLib.references;

  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
  const activeVideo = selectedVideo || courseRecordings[0] || courseReferences[0];

  if (isSkeletonLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Course Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          The requested course ID could not be located in the catalog.
        </p>
        <Link to="/courses" className="mt-4 inline-block">
          <Button variant="primary" size="sm">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const handleEnrollConfirm = () => {
    if (!user) {
      toast.info('Please sign in to register for this course.');
      navigate('/auth/login');
      return;
    }

    try {
      enrollStudent(user.id, course.id);
      toast.success(`🎉 You have registered for "${course.title}"! All lecture recordings and reference videos are now unlocked.`);
      setIsRegisterModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      toast.warning(msg);
      setIsRegisterModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Catalog
        </Link>
      </div>

      {/* Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2-Cols: Overview & Video Hub */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="emerald">{course.category}</Badge>
              <Badge variant="blue">{course.level}</Badge>
              {isEnrolled && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  <Check className="w-3 h-3" />
                  Actively Registered
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold ml-auto">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({course.ratingCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {course.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-500">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Lead Instructor
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {course.instructorName}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Estimated Duration
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {course.duration} ({course.durationHours} hrs total)
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Total Lessons & Videos
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {course.lessons.length} Modules &bull; {courseRecordings.length} Recordings
                </span>
              </div>
            </div>
          </Card>

          {/* ========================================================= */}
          {/* LECTURE RECORDINGS & VIDEO REFERENCES HUB                */}
          {/* ========================================================= */}
          <Card className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    Course Videos & Lecture Recordings
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#5B3DF5] dark:text-purple-300 text-[10px] font-bold">
                    HD Streams
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Stream archived class sessions, reference walkthroughs, and lab demonstrations
                </p>
              </div>

              {/* Media Sub-tabs */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveMediaTab('recordings')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeMediaTab === 'recordings'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Recordings ({courseRecordings.length})
                </button>
                <button
                  onClick={() => setActiveMediaTab('reference')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeMediaTab === 'reference'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  References ({courseReferences.length})
                </button>
                <button
                  onClick={() => setActiveMediaTab('syllabus')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeMediaTab === 'syllabus'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Syllabus ({course.lessons.length})
                </button>
              </div>
            </div>

            {/* VIDEO PLAYER SCREEN */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between p-4 shadow-lg group">
              <img
                src={activeVideo?.thumbnail || course.thumbnail}
                alt={activeVideo?.title || course.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              {/* Top Video HUD */}
              <div className="relative z-10 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/90 font-bold text-[10px] uppercase tracking-wider">
                    {activeVideo?.type === 'recording' ? 'Lecture Recording' : 'Reference Video'}
                  </span>
                  <span className="text-[11px] text-slate-200 hidden sm:inline">
                    {activeVideo?.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[10px] font-mono">
                    1080p 60fps
                  </span>
                  <button
                    onClick={() => {
                      const speeds: ('1x' | '1.25x' | '1.5x' | '2x')[] = ['1x', '1.25x', '1.5x', '2x'];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                      toast.info(`Playback speed: ${next}`);
                    }}
                    className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 backdrop-blur-md text-[10px] font-bold"
                    title="Toggle Speed"
                  >
                    {playbackSpeed}
                  </button>
                </div>
              </div>

              {/* Center Play Button */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    toast.success(isPlaying ? 'Video paused' : `Streaming: ${activeVideo?.title}`);
                  }}
                  className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl hover:bg-[#5B3DF5] hover:text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </button>
                <p className="text-white text-xs font-semibold mt-3 text-center px-4 drop-shadow-md line-clamp-1">
                  {activeVideo?.title}
                </p>
              </div>

              {/* Bottom Scrubber & Time HUD */}
              <div className="relative z-10 space-y-2 text-white">
                {/* Clickable timeline bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    setVideoProgress(pct);
                  }}
                  className="w-full h-1.5 bg-white/30 hover:h-2.5 rounded-full cursor-pointer relative overflow-hidden transition-all"
                >
                  <div
                    style={{ width: `${videoProgress}%` }}
                    className="h-full bg-[#5B3DF5] rounded-full relative"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px]">
                      {Math.floor((videoProgress / 100) * 48)}:15 / {activeVideo?.duration || '48:00'}
                    </span>
                    <button
                      onClick={() => toast.info('Volume toggled')}
                      className="p-1 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toast.info('Full-screen mode enabled.')}
                      className="p-1 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB CONTENT 1: LECTURE RECORDINGS PLAYLIST */}
            {activeMediaTab === 'recordings' && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Archived Cohort Video Lectures
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courseRecordings.map((rec: CourseVideo) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        setSelectedVideo(rec);
                        setIsPlaying(true);
                        toast.success(`Loaded video: ${rec.title}`);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                        activeVideo?.id === rec.id
                          ? 'bg-purple-50/80 dark:bg-purple-950/30 border-[#5B3DF5] shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-purple-300'
                      }`}
                    >
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img src={rec.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current opacity-80" />
                        </div>
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-white">
                          {rec.duration}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                          {rec.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {rec.date} &bull; {rec.views}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: REFERENCE VIDEOS & CASE STUDIES */}
            {activeMediaTab === 'reference' && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Supplementary Reference Recordings & Demos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courseReferences.map((ref: CourseVideo) => (
                    <div
                      key={ref.id}
                      onClick={() => {
                        setSelectedVideo(ref);
                        setIsPlaying(true);
                        toast.success(`Loaded reference video: ${ref.title}`);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                        activeVideo?.id === ref.id
                          ? 'bg-purple-50/80 dark:bg-purple-950/30 border-[#5B3DF5] shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-purple-300'
                      }`}
                    >
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img src={ref.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current opacity-80" />
                        </div>
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-white">
                          {ref.duration}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                          {ref.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {ref.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: SYLLABUS LESSONS */}
            {activeMediaTab === 'syllabus' && (
              <div className="space-y-2.5 pt-2">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {lesson.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {lesson.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {lesson.durationMinutes} min
                      </span>
                      <button
                        onClick={() => {
                          const targetRec = courseRecordings[idx % courseRecordings.length];
                          setSelectedVideo(targetRec);
                          setIsPlaying(true);
                          toast.success(`Playing lesson video: ${lesson.title}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5B3DF5] text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play Video</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Sticky Sidebar: Enrollment & Pricing */}
        <div className="space-y-6">
          <Card className="overflow-hidden p-6 sticky top-20">
            <div className="rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                ${course.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">Student full license</span>
            </div>

            <div className="space-y-3">
              {isEnrolled ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You are registered in this course!</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                      toast.info('Streaming video lecture recording...');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5B3DF5] hover:bg-[#4E31DD] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Lecture Recordings</span>
                  </button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full bg-[#5B3DF5] hover:bg-[#4E31DD]"
                  onClick={() => setIsRegisterModalOpen(true)}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                >
                  Register for Course
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.info('Course link copied to clipboard!');
                }}
                leftIcon={<Share2 className="w-4 h-4" />}
              >
                Share Course
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Streamable lecture recordings & replays</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Reference videos & architecture blueprints</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Certificate upon completion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Interactive quizzes & milestone grading</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* STUDENT REGISTRATION CONFIRMATION MODAL */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register for Course"
        description="Confirm your enrollment to unlock all video recordings, reference materials, and labs."
        maxWidth="md"
      >
        <div className="space-y-4 py-2 text-xs">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 flex gap-3.5 items-center">
            <img
              src={course.thumbnail}
              alt=""
              className="w-16 h-14 rounded-xl object-cover ring-1 ring-purple-300 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                {course.title}
              </h4>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold mt-0.5">
                Instructor: {course.instructorName} &bull; {course.duration}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                  {course.category}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ${course.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Student Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user?.name || 'Maheswari'}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Student Email:</span>
              <span className="font-bold text-slate-900 dark:text-white">{user?.email || 'student@edusphere.com'}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Access Level:</span>
              <span className="font-bold text-emerald-600">Full Video & Lab Access</span>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Upon confirming registration, your learning profile is registered into this course cohort. You will receive immediate access to the full lecture recording library, supplementary reference videos, and code checkpoints.
          </p>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEnrollConfirm}
              className="bg-[#5B3DF5] hover:bg-[#4E31DD] text-white"
            >
              Confirm Registration
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
