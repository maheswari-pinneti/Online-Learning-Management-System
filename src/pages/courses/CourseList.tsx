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
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCourses } from '@/context/CourseContext';
import { useAuth } from '@/context/AuthContext';
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

export const CourseList: React.FC = () => {
  const { courses, isLoading, error, addCourse, updateCourse, deleteCourse, refreshCourses } =
    useCourses();
  const { role } = useAuth();
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

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Course Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, manage, and curate curriculum offerings across faculties
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refreshCourses();
              toast.info('Catalog re-synced with external API.');
            }}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/courses/${c.id}`}>
                          <Button variant="ghost" size="sm" className="p-1.5">
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
    </div>
  );
};
