import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentFormData } from '@/utils/validators';
import { Student } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  initialStudent?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStudent,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      address: '',
      qualification: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (initialStudent) {
      reset({
        fullName: initialStudent.fullName,
        email: initialStudent.email,
        mobileNumber: initialStudent.mobileNumber,
        address: initialStudent.address,
        qualification: initialStudent.qualification,
        status: initialStudent.status,
      });
    } else {
      reset({
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
        qualification: '',
        status: 'Active',
      });
    }
  }, [initialStudent, isOpen, reset]);

  const handleFormSubmit = (data: StudentFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialStudent ? 'Edit Student Record' : 'Register New Student'}
      description="Enter official student profile information and enrollment qualification."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Alex Morgan"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="student@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Mobile Number"
          placeholder="+1 555-019-2834"
          error={errors.mobileNumber?.message}
          {...register('mobileNumber')}
        />

        <Input
          label="Residential / Mailing Address"
          placeholder="123 Academic Way, City, State"
          error={errors.address?.message}
          {...register('address')}
        />

        <Input
          label="Highest Educational Qualification"
          placeholder="e.g. Bachelor of Science in Information Systems"
          error={errors.qualification?.message}
          {...register('qualification')}
        />

        <Select
          label="Enrollment Status"
          options={[
            { value: 'Active', label: 'Active Learner' },
            { value: 'Inactive', label: 'Inactive / On Leave' },
            { value: 'Graduated', label: 'Graduated / Alumni' },
          ]}
          error={errors.status?.message}
          {...register('status')}
        />

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialStudent ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
