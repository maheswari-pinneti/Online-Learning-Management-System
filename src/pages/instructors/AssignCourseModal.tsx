import React, { useState } from 'react';
import { Instructor } from '@/types';
import { useCourses } from '@/context/CourseContext';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: Instructor | null;
  onAssign: (instructorId: string, courseId: string) => void;
}

export const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  isOpen,
  onClose,
  instructor,
  onAssign,
}) => {
  const { courses } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');

  if (!instructor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourseId) {
      onAssign(instructor.id, selectedCourseId);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Course to ${instructor.name}`}
      description="Select an active curriculum course to assign to this faculty member."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Assign Course
          </Button>
        </div>
      </form>
    </Modal>
  );
};
