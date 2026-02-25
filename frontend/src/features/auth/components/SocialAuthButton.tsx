import { Button } from '@/components/ui/button';
import type { ReactNode, MouseEventHandler } from 'react';

// ============================================================
// SocialAuthButton — Nút đăng nhập bằng bên thứ ba
// Thiết kế: Outline style, icon + label, full-width
// ============================================================

interface SocialAuthButtonProps {
  /** Icon SVG (truyền từ ngoài để linh hoạt) */
  icon: ReactNode;
  /** Nhãn hiển thị, VD: "Đăng nhập với Google" */
  label: string;
  /** Sự kiện click */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Trạng thái loading */
  disabled?: boolean;
}

export const SocialAuthButton = ({
  icon,
  label,
  onClick,
  disabled = false,
}: SocialAuthButtonProps) => (
  <Button
    type="button"
    variant="outline"
    className="w-full h-11 gap-3 border-slate-300 bg-white text-slate-700 font-medium
               hover:bg-slate-50 hover:border-ocean-300 transition-all duration-200"
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    <span>{label}</span>
  </Button>
);
