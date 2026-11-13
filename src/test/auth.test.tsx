import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { loginSchema, registerSchema } from '@/utils/validators';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Module 1: Authentication & Form Validation', () => {
  it('validates correct email and password schemas with Zod', () => {
    const valid = loginSchema.safeParse({
      email: 'learner@edusphere.com',
      password: 'securePassword123',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'securePassword123',
    });
    expect(invalidEmail.success).toBe(false);

    const shortPassword = loginSchema.safeParse({
      email: 'learner@edusphere.com',
      password: '123',
    });
    expect(shortPassword.success).toBe(false);
  });

  it('rejects password and confirmPassword mismatch in registration', () => {
    const mismatch = registerSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'student',
      password: 'password123',
      confirmPassword: 'differentPassword456',
    });
    expect(mismatch.success).toBe(false);
  });

  it('allows quick switching between demo roles', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.switchDemoRole('admin');
    });
    expect(result.current.role).toBe('admin');
    expect(result.current.user?.role).toBe('admin');

    act(() => {
      result.current.switchDemoRole('instructor');
    });
    expect(result.current.role).toBe('instructor');
    expect(result.current.user?.role).toBe('instructor');

    act(() => {
      result.current.switchDemoRole('student');
    });
    expect(result.current.role).toBe('student');
    expect(result.current.user?.role).toBe('student');
  });

  it('handles logout and session termination', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
