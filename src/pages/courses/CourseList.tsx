import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Star,
  Clock,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Play,
  Pause,
  Sparkles,
  UserPlus,
  Video,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCourses } from '@/context/CourseContext';
import { useAuth } from '@/context/AuthContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Course } from '@/types';
import { CourseFormData } from '@/utils/validators';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { CourseCardSkeleton } from '@/components/feedback/SkeletonLoader';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CourseModal } from './CourseModal';
import { Modal } from '@/components/common/Modal';
import { getCourseVideoLibrary } from '@/utils/videoHelpers';

export const CourseList: React.FC = () => {
  const { courses, isLoading, error, addCourse, updateCourse, deleteCourse, refreshCourses } =
    useCourses();
  const { role, user } = useAuth();
  const { isStudentEnrolled, enrollStudent } = useEnrollment();
  const [searchParams] = useSearchParams();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'priceAsc' | 'priceDesc' | 'duration'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [activeLessonCourse, setActiveLessonCourse] = useState<Course | null>(null);
  const [registeringCourse, setRegisteringCourse] = useState<Course | null>(null);
  const [activeModalVideoIndex, setActiveModalVideoIndex] = useState(0);
  const [modalVideoTab, setModalVideoTab] = useState<'recordings' | 'references'>('recordings');
  const [modalIsPlaying, setModalIsPlaying] = useState(false);
  const [modalPlaybackSpeed, setModalPlaybackSpeed] = useState<'1x' | '1.25x' | '1.5x' | '2x'>('1x');
  const [modalProgress, setModalProgress] = useState(28);

  // Dynamic video library derived for the currently active course
  const activeVideoLibrary = useMemo(() => {
    return activeLessonCourse ? getCourseVideoLibrary(activeLessonCourse) : null;
  }, [activeLessonCourse]);

  const currentVideoList = useMemo(() => {
    if (!activeVideoLibrary) return [];
    return modalVideoTab === 'recordings'
      ? activeVideoLibrary.recordings
      : activeVideoLibrary.references;
  }, [activeVideoLibrary, modalVideoTab]);

  const activeVideoItem = currentVideoList[activeModalVideoIndex] || currentVideoList[0];

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

  const handleSyncCatalog = () => {
    setIsSkeletonLoading(true);
    refreshCourses();
    setTimeout(() => {
      setIsSkeletonLoading(false);
      toast.info('Catalog re-synced with external API.');
    }, 3000);
  };

  const isStudent = role === 'student';
  const canManageCourses = role === 'admin' || role === 'instructor';

  // Categories list derived dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return ['All', ...Array.from(set)];
  }, [courses]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesLevel =
          selectedLevel === 'All' || c.level.toLowerCase() === selectedLevel.toLowerCase();

        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'duration') return b.durationHours - a.durationHours;
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Paginated Courses
  const totalPages = Math.ceil(filteredCourses.length / pageSize) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, currentPage, pageSize]);

  const handleAddSubmit = (data: CourseFormData) => {
    addCourse(data);
    toast.success('Course created and added to catalog successfully!');
  };

  const handleEditSubmit = (data: CourseFormData) => {
    if (!editingCourse) return;
    updateCourse(editingCourse.id, data);
    setEditingCourse(null);
    toast.success('Course details updated successfully!');
  };

  const confirmDelete = () => {
    if (deletingCourseId) {
      deleteCourse(deletingCourseId);
      setDeletingCourseId(null);
      toast.success('Course removed from catalog.');
    }
  };

  const handleConfirmRegister = (c: Course) => {
    if (!user) {
      toast.error('Please log in to register for courses.');
      return;
    }
    enrollStudent(user.id, c.id);
    toast.success(`Registered successfully for "${c.title}"! Course added to your learning dashboard.`);
    setRegisteringCourse(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {isStudent ? 'Lessons & Curriculums' : 'Course Management'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isStudent
              ? 'Explore active curriculum tracks, interactive cybersecurity modules, and hands-on video masterclasses.'
              : 'Browse, manage, and curate curriculum offerings across faculties'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncCatalog}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading || isSkeletonLoading ? 'animate-spin' : ''}`} />}
          >
            Sync Catalog
          </Button>

          {canManageCourses && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Course
            </Button>
          )}
        </div>
      </div>

      {/* Student Featured Active Lesson Banner */}
      {isStudent && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 relative z-10 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] tracking-wider uppercase">
                ACTIVE LESSON
              </span>
              <span className="text-xs text-purple-200 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                CyberGenius Track · Episode 3
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Inside the Breach - They're in the cloud
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Progress: 17% completed. Learn multi-tenant AWS cloud infiltration detection, GuardDuty anomaly tracing, and automated IAM mitigation.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => {
                const targetCourse = courses.find((c) => c.title.toLowerCase().includes('react')) || courses[0];
                setActiveLessonCourse(targetCourse);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Lesson</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by course title, instructor, or keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'name' | 'rating' | 'priceAsc' | 'priceDesc' | 'duration'
                )
              }
              className="flex-1 py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="name">Sort: Course Name (A-Z)</option>
              <option value="priceAsc">Sort: Price (Low to High)</option>
              <option value="priceDesc">Sort: Price (High to Low)</option>
              <option value="duration">Sort: Longest Duration</option>
            </select>

            <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Network Alert (if any) */}
      {error && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
          Notice: {error}. Curated offline courses loaded.
        </div>
      )}

      {/* Course Catalog Content */}
      {isLoading || isSkeletonLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      ) : paginatedCourses.length === 0 ? (
        <EmptyState
          title="No courses matched your query"
          description="Try broadening your search keywords or clearing your category filters to view available catalog entries."
          actionText="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedLevel('All');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden group" hover>
              {/* Thumbnail Container */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="emerald" size="sm">
                    {course.category}
                  </Badge>
                  <Badge variant="slate" size="sm">
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  ${course.price.toFixed(2)}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-brand-600 dark:text-brand-400 truncate max-w-[180px]">
                      By {course.instructorName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating.toFixed(1)}</span>
                      <span className="text-slate-400">({course.ratingCount})</span>
                    </div>
                  </div>

                  <Link to={`/courses/${course.id}`} className="block">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{course.totalLessons} lessons</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setActiveLessonCourse(course);
                        setActiveModalVideoIndex(0);
                        setModalVideoTab('recordings');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-[#5B3DF5] dark:text-purple-300 font-bold text-xs transition-colors"
                      title="Watch course lecture recordings & videos"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch Videos</span>
                    </button>

                    {isStudent && user && !isStudentEnrolled(user.id, course.id) && (
                      <button
                        onClick={() => setRegisteringCourse(course)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-xs transition-all shadow-xs active:scale-95"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Register</span>
                      </button>
                    )}

                    <Link to={`/courses/${course.id}`}>
                      <Button variant="ghost" size="sm" className="p-1.5" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    {canManageCourses && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5"
                          onClick={() => setEditingCourse(course)}
                          title="Edit Course"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5"
                          onClick={() => setDeletingCourseId(course.id)}
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-semibold text-[10px] text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <Link
                        to={`/courses/${c.id}`}
                        className="font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-600 line-clamp-1"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {c.instructorName}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="emerald" size="sm">
                        {c.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="slate" size="sm">
                        {c.level}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{c.duration}</td>
                    <td className="py-3 px-4 font-semibold text-amber-500">
                      ⭐ {c.rating.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      ${c.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveLessonCourse(c);
                            setActiveModalVideoIndex(0);
                            setModalVideoTab('recordings');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-[#5B3DF5] dark:text-purple-300 font-bold text-[11px] transition-colors"
                          title="Watch Videos & Recordings"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Videos</span>
                        </button>

                        {isStudent && user && !isStudentEnrolled(user.id, c.id) && (
                          <button
                            onClick={() => setRegisteringCourse(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-[11px] transition-all shadow-xs"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Register</span>
                          </button>
                        )}

                        <Link to={`/courses/${c.id}`}>
                          <Button variant="ghost" size="sm" className="p-1.5" title="View Details">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        {canManageCourses && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5"
                              onClick={() => setEditingCourse(c)}
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5"
                              onClick={() => setDeletingCourseId(c.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCourses.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add Course Modal */}
      <CourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Edit Course Modal */}
      <CourseModal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        onSubmit={handleEditSubmit}
        initialCourse={editingCourse}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCourseId}
        onClose={() => setDeletingCourseId(null)}
        title="Confirm Course Deletion"
        description="Are you sure you want to permanently delete this course from the catalog? This action cannot be undone."
      >
        <div className="flex justify-end gap-2.5 pt-4">
          <Button variant="outline" onClick={() => setDeletingCourseId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Course
          </Button>
        </div>
      </Modal>

      {/* Video Recordings & Reference Library Modal for Students */}
      {activeLessonCourse && (
        <Modal
          isOpen={!!activeLessonCourse}
          onClose={() => {
            setActiveLessonCourse(null);
            setModalIsPlaying(false);
          }}
          title={`Course Media Library: ${activeLessonCourse.title}`}
          description={`Instructor: ${activeLessonCourse.instructorName} · Track: ${activeLessonCourse.category}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 py-2">
            {/* Interactive Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-xl group border border-slate-800">
              <img
                src={activeLessonCourse.thumbnail}
                alt={activeLessonCourse.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/70" />

              {/* Player Top HUD */}
              <div className="relative z-10 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#5B3DF5] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Video className="w-3 h-3" />
                    {modalVideoTab === 'recordings' ? 'Lecture Recording' : 'Reference Video'}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-xs">
                    {activeVideoItem
                      ? activeVideoItem.title
                      : modalVideoTab === 'recordings'
                      ? `Session ${activeModalVideoIndex + 1}: Live Cohort Masterclass`
                      : `Reference Guide #${activeModalVideoIndex + 1}: Architecture & Deep Dive`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-slate-200">
                    1080p HD
                  </span>
                </div>
              </div>

              {/* Player Center Play/Pause Trigger */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                <button
                  onClick={() => {
                    setModalIsPlaying(!modalIsPlaying);
                    toast.info(
                      modalIsPlaying
                        ? 'Video stream paused'
                        : `Streaming: ${activeVideoItem?.title || activeLessonCourse.title}`
                    );
                  }}
                  className="w-16 h-16 rounded-full bg-white/95 text-slate-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl hover:bg-[#5B3DF5] hover:text-white"
                >
                  {modalIsPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </button>
              </div>

              {/* Player Bottom Control Bar */}
              <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent space-y-2">
                {/* Scrubber slider */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={modalProgress}
                    onChange={(e) => setModalProgress(Number(e.target.value))}
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#5B3DF5]"
                  />
                </div>

                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                    <span>{Math.floor((modalProgress * (activeVideoItem?.durationMinutes || 48)) / 100)}:15</span>
                    <span>/</span>
                    <span>{activeVideoItem?.duration || '48:00'}</span>
                  </div>

                  {/* Playback speed selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium mr-1">Speed:</span>
                    {(['1x', '1.25x', '1.5x', '2x'] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          setModalPlaybackSpeed(spd);
                          toast.info(`Playback speed set to ${spd}`);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                          modalPlaybackSpeed === spd
                            ? 'bg-[#5B3DF5] text-white shadow-xs'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Media Selector Tabs: Recordings vs Reference Videos */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => {
                  setModalVideoTab('recordings');
                  setActiveModalVideoIndex(0);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalVideoTab === 'recordings'
                    ? 'bg-[#5B3DF5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Lecture Recordings ({activeVideoLibrary?.recordings.length || 0})</span>
              </button>

              <button
                onClick={() => {
                  setModalVideoTab('references');
                  setActiveModalVideoIndex(0);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalVideoTab === 'references'
                    ? 'bg-[#5B3DF5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Reference Videos & Blueprints ({activeVideoLibrary?.references.length || 0})</span>
              </button>
            </div>

            {/* Video List based on Active Tab */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {currentVideoList.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveModalVideoIndex(idx);
                    setModalIsPlaying(true);
                    toast.success(`Playing: ${item.title}`);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    activeModalVideoIndex === idx
                      ? modalVideoTab === 'recordings'
                        ? 'border-[#5B3DF5] bg-purple-50/70 dark:bg-purple-950/30'
                        : 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        modalVideoTab === 'recordings'
                          ? 'bg-purple-100 dark:bg-purple-900/60 text-[#5B3DF5]'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300'
                      }`}
                    >
                      {modalVideoTab === 'recordings' ? idx + 1 : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.date} · {item.tag}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300">
                      {item.duration}
                    </span>
                    <Play
                      className={`w-3.5 h-3.5 fill-current ${
                        modalVideoTab === 'recordings' ? 'text-[#5B3DF5]' : 'text-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                All videos include synchronized timestamps & transcripts
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveLessonCourse(null);
                    setModalIsPlaying(false);
                  }}
                >
                  Close
                </Button>
                <Link to={`/courses/${activeLessonCourse.id}`}>
                  <Button variant="primary" size="sm" className="bg-[#5B3DF5] hover:bg-[#4E31DD]">
                    Open Full Syllabus
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Course Registration Confirmation Modal for Students */}
      {registeringCourse && (
        <Modal
          isOpen={!!registeringCourse}
          onClose={() => setRegisteringCourse(null)}
          title="Confirm Course Registration"
          description="Register for full access to live cohort sessions, video archives, and certifications"
          maxWidth="md"
        >
          <div className="space-y-4 py-2">
            {/* Course Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={registeringCourse.thumbnail}
                  alt={registeringCourse.title}
                  className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant="emerald" size="sm">
                      {registeringCourse.category}
                    </Badge>
                    <Badge variant="slate" size="sm">
                      {registeringCourse.level}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {registeringCourse.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Instructor: {registeringCourse.instructorName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700 text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {registeringCourse.duration}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Total Lessons</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {registeringCourse.totalLessons} lessons
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Tuition</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {registeringCourse.price === 0 ? 'Free' : `$${registeringCourse.price}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Details Pre-filled */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B3DF5] dark:text-purple-300">
                Student Enrollment Details
              </span>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Student Name:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {user?.name || 'Maheswari'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Student Email:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {user?.email || 'student@edusphere.com'}
                </span>
              </div>
            </div>

            {/* Included Features */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                What you get upon registration:
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Unlimited streaming access to all cohort lecture recordings & replay archives</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Supplementary reference videos, Terraform blueprints & architecture walk-throughs</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Direct AI fellow tutoring & interview prep with Cyber Cat</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRegisteringCourse(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleConfirmRegister(registeringCourse)}
                className="bg-[#5B3DF5] hover:bg-[#4E31DD] text-white"
              >
                Confirm & Enroll Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
