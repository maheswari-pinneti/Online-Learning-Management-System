import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instructorSchema, InstructorFormData } from '@/utils/validators';
import { Instructor } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

interface InstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InstructorFormData) => void;
  initialInstructor?: Instructor | null;
}

export const InstructorModal: React.FC<InstructorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialInstructor,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: '',
      email: '',
      experienceYears: 5,
      specialization: '',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      bio: '',
    },
  });

  useEffect(() => {
    if (initialInstructor) {
      reset({
        name: initialInstructor.name,
        email: initialInstructor.email,
        experienceYears: initialInstructor.experienceYears,
        specialization: initialInstructor.specialization,
        profileImage: initialInstructor.profileImage,
        bio: initialInstructor.bio,
      });
    } else {
      reset({
        name: '',
        email: '',
        experienceYears: 5,
        specialization: '',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        bio: '',
      });
    }
  }, [initialInstructor, isOpen, reset]);

  const handleFormSubmit = (data: InstructorFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialInstructor ? 'Edit Instructor Profile' : 'Add New Faculty Instructor'}
      description="Enter credentials, academic specialization, and professional background."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Instructor Name"
          placeholder="e.g. Dr. Alan Turing"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="instructor@edusphere.edu"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Years of Experience"
            type="number"
            min="0"
            error={errors.experienceYears?.message}
            {...register('experienceYears')}
          />

          <Input
            label="Specialization Domain"
            placeholder="e.g. Distributed Systems"
            error={errors.specialization?.message}
            {...register('specialization')}
          />
        </div>

        <Input
          label="Profile Image URL"
          placeholder="https://images.unsplash.com/..."
          error={errors.profileImage?.message}
          {...register('profileImage')}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Academic / Industry Biography
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Career highlights, publications, research experience..."
            {...register('bio')}
          />
          {errors.bio && <p className="mt-1 text-xs text-rose-500">{errors.bio.message}</p>}
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialInstructor ? 'Update Profile' : 'Save Instructor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
