import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

// ============================================================
// FormField — Wrapper chuẩn cho một trường nhập liệu
// Bao gồm: Label, Input slot, Error message
// ============================================================

interface FormFieldProps {
  /** ID liên kết Label ↔ Input */
  htmlFor: string;
  /** Nhãn hiển thị */
  label: string;
  /** Nội dung input (children) */
  children: ReactNode;
  /** Thông báo lỗi (hiện khi có giá trị) */
  error?: string;
}

export const FormField = ({ htmlFor, label, children, error }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
      {label}
    </Label>

    {children}

    {error && (
      <p className="text-xs font-medium text-red-500 flex items-center gap-1">
        <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
        {error}
      </p>
    )}
  </div>
);
