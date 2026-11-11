import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['student', 'instructor', 'admin'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const courseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  thumbnail: z.string().url('Must be a valid image URL').or(z.string().min(1, 'Thumbnail is required')),
  instructorId: z.string().min(1, 'Please select an instructor'),
  duration: z.string().min(2, 'e.g. "8 Weeks" or "24 Hours"'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  rating: z.coerce.number().min(1).max(5).default(4.8),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobileNumber: z.string().regex(/^[+0-9\s-]{8,20}$/, 'Must be a valid mobile number (min 8 digits)'),
  address: z.string().min(5, 'Address is required (at least 5 characters)'),
  qualification: z.string().min(2, 'Qualification is required'),
  status: z.enum(['Active', 'Inactive', 'Graduated']).default('Active'),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const instructorSchema = z.object({
  name: z.string().min(2, 'Instructor name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  experienceYears: z.coerce.number().min(0, 'Years of experience must be 0 or more'),
  specialization: z.string().min(3, 'Specialization is required'),
  profileImage: z.string().url('Must be a valid image URL').or(z.string().min(1, 'Profile image is required')),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

export type InstructorFormData = z.infer<typeof instructorSchema>;
