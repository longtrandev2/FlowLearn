// ============================================================
// Auth Feature - Type Definitions
// Chuẩn bị sẵn cấu trúc để tích hợp react-hook-form + zod
// ============================================================

/** Dữ liệu form Đăng nhập */
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/** Dữ liệu form Đăng ký */
export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Trạng thái submit của form */
export interface FormSubmitState {
  isSubmitting: boolean;
  error: string | null;
}

/** Mức độ mạnh của mật khẩu */
export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

/** Thông tin đánh giá mật khẩu */
export interface PasswordStrengthInfo {
  level: PasswordStrengthLevel;
  score: number;       // 0 - 4
  label: string;
  color: string;       // Tailwind class (e.g. "bg-red-500")
}

/** Props cho AuthLayout panel minh hoạ */
export interface AuthIllustrationProps {
  imageUrl: string;
  quote: string;
  author: string;
}

/** Props chung cho các Auth Form */
export interface AuthFormProps {
  onSubmitSuccess?: () => void;
}
