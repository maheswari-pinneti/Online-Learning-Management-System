import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, BookOpenCheck, Shield, GraduationCap, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginSchema, LoginFormData } from '@/utils/validators';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { DEMO_USERS } from '@/utils/mockData';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@edusphere.com',
      password: 'adminPassword123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Welcome back to EduSphere!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (role: 'admin' | 'instructor' | 'student') => {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) {
      setValue('email', demo.email);
      setValue('password', 'demoSecurePass123');
      switchDemoRole(role);
      toast.info(`Switched to ${demo.name} (${role.toUpperCase()}) demo profile!`);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/20">
            <BookOpenCheck className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to EduSphere
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Enterprise Online Learning Management System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl border border-slate-200/80 dark:border-slate-800">
          {/* Quick 1-Click Demo Login Banner */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-2 text-center">
              1-Click Instant Demo Login:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-600 hover:border-brand-500 transition-colors shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-brand-600" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('instructor')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-600 hover:border-blue-500 transition-colors shadow-xs"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Instructor
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('student')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-600 hover:border-purple-500 transition-colors shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                Student
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="name@edusphere.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="rounded text-brand-600 focus:ring-brand-500 dark:bg-slate-800 dark:border-slate-700"
                  {...register('rememberMe')}
                />
                Remember me
              </label>

              <Link
                to="/auth/forgot-password"
                className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Sign In to Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
