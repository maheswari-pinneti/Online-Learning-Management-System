import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseFormData } from '@/utils/validators';
import { Course } from '@/types';
import { useInstructors } from '@/context/InstructorContext';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => void;
  initialCourse?: Course | null;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCourse,
}) => {
  const { instructors } = useInstructors();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Development',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      instructorId: instructors[0]?.id || 'inst-1',
      duration: '10 Weeks',
      level: 'Beginner',
      price: 99.99,
      rating: 4.8,
    },
  });

  useEffect(() => {
    if (initialCourse) {
      reset({
        title: initialCourse.title,
        description: initialCourse.description,
        category: initialCourse.category,
        thumbnail: initialCourse.thumbnail,
        instructorId: initialCourse.instructorId,
        duration: initialCourse.duration,
        level: initialCourse.level,
        price: initialCourse.price,
        rating: initialCourse.rating,
      });
    } else {
      reset({
        title: '',
        description: '',
        category: 'Development',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
        instructorId: instructors[0]?.id || 'inst-1',
        duration: '10 Weeks',
        level: 'Beginner',
        price: 99.99,
        rating: 4.8,
      });
    }
  }, [initialCourse, isOpen, reset, instructors]);

  const handleFormSubmit = (data: CourseFormData) => {
    onSubmit(data);
    onClose();
  };

  const instructorOptions = instructors.map((inst) => ({
    value: inst.id,
    label: `${inst.name} (${inst.specialization})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCourse ? 'Edit Course Details' : 'Add New Course to Catalog'}
      description="Fill in the course syllabus, instructor mapping, and enrollment settings."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Course Title"
          placeholder="e.g. Masterclass in Scalable Cloud Microservices"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Course Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Comprehensive description of topics, objectives, and prerequisites..."
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={[
              { value: 'Development', label: 'Development' },
              { value: 'Data Science', label: 'Data Science & AI' },
              { value: 'Design', label: 'Design & UI/UX' },
              { value: 'DevOps', label: 'DevOps & Cloud' },
              { value: 'Security', label: 'Cybersecurity' },
              { value: 'Business', label: 'Product & Business' },
            ]}
            error={errors.category?.message}
            {...register('category')}
          />

          <Select
            label="Course Level"
            options={[
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
            error={errors.level?.message}
            {...register('level')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Lead Instructor"
            options={instructorOptions}
            error={errors.instructorId?.message}
            {...register('instructorId')}
          />

          <Input
            label="Estimated Duration"
            placeholder="e.g. 12 Weeks or 40 Hours"
            error={errors.duration?.message}
            {...register('duration')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price (USD)"
            type="number"
            step="0.01"
            placeholder="99.99"
            error={errors.price?.message}
            {...register('price')}
          />

          <Input
            label="Course Thumbnail URL"
            placeholder="https://images.unsplash.com/..."
            error={errors.thumbnail?.message}
            {...register('thumbnail')}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialCourse ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
