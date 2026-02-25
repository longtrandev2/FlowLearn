import { useMemo } from 'react';
import type { PasswordStrengthInfo, PasswordStrengthLevel } from '@/features/auth/types';

// ============================================================
// PasswordStrengthIndicator — Thanh đánh giá độ mạnh mật khẩu
// Gồm 4 vạch màu + nhãn mô tả
// ============================================================

/** Tính điểm độ mạnh mật khẩu (0 – 4) */
const evaluatePassword = (password: string): PasswordStrengthInfo => {
  if (!password) {
    return { level: 'weak', score: 0, label: '', color: '' };
  }

  let score = 0;

  // Tiêu chí chấm điểm
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Giới hạn tối đa 4
  score = Math.min(score, 4);

  const map: Record<number, { level: PasswordStrengthLevel; label: string; color: string }> = {
    0: { level: 'weak',   label: 'Rất yếu',   color: 'bg-red-500' },
    1: { level: 'weak',   label: 'Yếu',       color: 'bg-red-500' },
    2: { level: 'fair',   label: 'Trung bình', color: 'bg-amber-500' },
    3: { level: 'good',   label: 'Tốt',        color: 'bg-ocean-400' },
    4: { level: 'strong', label: 'Mạnh',       color: 'bg-emerald-500' },
  };

  return { score, ...map[score] };
};

interface PasswordStrengthIndicatorProps {
  /** Giá trị mật khẩu hiện tại */
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => evaluatePassword(password), [password]);

  // Không render khi chưa nhập
  if (!password) return null;

  const bars = 4;

  return (
    <div className="space-y-1.5">
      {/* Thanh vạch */}
      <div className="flex gap-1.5">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < strength.score ? strength.color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Nhãn mô tả */}
      <p
        className={`text-xs font-medium transition-colors duration-200 ${
          strength.score <= 1
            ? 'text-red-500'
            : strength.score === 2
              ? 'text-amber-500'
              : strength.score === 3
                ? 'text-ocean-500'
                : 'text-emerald-500'
        }`}
      >
        Độ mạnh: {strength.label}
      </p>
    </div>
  );
};
