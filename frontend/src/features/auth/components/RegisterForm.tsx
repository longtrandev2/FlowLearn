import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { FormField } from './FormField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { useAuthStore } from '@/store/useAuthStore';

import type { RegisterFormValues, FormSubmitState } from '@/features/auth/types';

// ============================================================
// RegisterForm — Form đăng ký tài khoản
// ============================================================
export const RegisterForm = () => {
  // ── Form state ──
  const [formValues, setFormValues] = useState<RegisterFormValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitState, setSubmitState] = useState<FormSubmitState>({
    isSubmitting: false,
    error: null,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});

  // ── Store & Router ──
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  // ── Handlers ──
  const updateField = <K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K],
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    // Xoá lỗi field khi user sửa
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitState.error) {
      setSubmitState((s) => ({ ...s, error: null }));
    }
  };

  /** Validate cơ bản — sẽ thay bằng zod schema sau */
  const validate = (): boolean => {
    const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

    if (!formValues.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ tên.';
    }

    if (!formValues.email.trim()) {
      errors.email = 'Vui lòng nhập email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = 'Email không hợp lệ.';
    }

    if (!formValues.password) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    } else if (formValues.password.length < 6) {
      errors.password = 'Mật khẩu tối thiểu 6 ký tự.';
    }

    if (!formValues.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitState({ isSubmitting: true, error: null });

    try {
      await register(formValues.email, formValues.password, formValues.fullName);
      navigate('/', { replace: true });
    } catch {
      setSubmitState({ isSubmitting: false, error: 'Đăng ký thất bại. Vui lòng thử lại.' });
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Heading ── */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Bắt đầu hành trình học tập của bạn
        </h1>
        <p className="text-sm text-slate-500">
          Tạo tài khoản miễn phí và khám phá FlowLearn ngay hôm nay.
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Họ tên */}
        <FormField htmlFor="register-name" label="Họ và tên" error={fieldErrors.fullName}>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="register-name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formValues.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className={`h-11 pl-10 transition-all duration-200
                         focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:border-ocean-500
                         ${fieldErrors.fullName ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
          </div>
        </FormField>

        {/* Email */}
        <FormField htmlFor="register-email" label="Email" error={fieldErrors.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={formValues.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`h-11 pl-10 transition-all duration-200
                         focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:border-ocean-500
                         ${fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
          </div>
        </FormField>

        {/* Mật khẩu */}
        <FormField htmlFor="register-password" label="Mật khẩu" error={fieldErrors.password}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formValues.password}
              onChange={(e) => updateField('password', e.target.value)}
              className={`h-11 pl-10 pr-11 transition-all duration-200
                         focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:border-ocean-500
                         ${fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>

          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={formValues.password} />
        </FormField>

        {/* Xác nhận mật khẩu */}
        <FormField htmlFor="register-confirm" label="Xác nhận mật khẩu" error={fieldErrors.confirmPassword}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="register-confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formValues.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              className={`h-11 pl-10 pr-11 transition-all duration-200
                         focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:border-ocean-500
                         ${fieldErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
        </FormField>

        {/* Error message */}
        {submitState.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitState.error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={submitState.isSubmitting}
          className="h-11 w-full bg-ocean-600 text-white font-semibold
                     hover:bg-ocean-700 active:bg-ocean-800
                     transition-all duration-200 shadow-sm shadow-ocean-600/25"
        >
          {submitState.isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
        </Button>
      </form>

      {/* ── Footer link ── */}
      <p className="text-center text-sm text-slate-500">
        Đã có tài khoản?{' '}
        <Link
          to="/login"
          className="font-semibold text-ocean-600 hover:text-ocean-700 transition-colors"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};
