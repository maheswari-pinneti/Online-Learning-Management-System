import React from 'react';

export interface SkeletonProps {
  className?: string;
}

/**
 * Base Shimmer Skeleton Primitive with soft human pulse
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700/60 dark:to-slate-800 rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Course Card Skeleton (Matches Course Grid View)
 */
export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs p-4 space-y-3.5">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="flex justify-between items-center pt-1">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-14 rounded-md" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <Skeleton className="h-6 w-16 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Table Row Skeleton (Matches Student & Enrollment Table Views)
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 6 }) => {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/70">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-44 rounded-md" />
          </div>
        </div>
      </td>
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-24 rounded-md" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Instructor Card Skeleton
 */
export const InstructorCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3.5 w-48 rounded-md" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Course Details Full Page Skeleton
 */
export const CourseDetailsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32 rounded-md" />
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-8 w-2/3 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <div className="flex gap-6 pt-2">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-5 w-28 rounded-md" />
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
