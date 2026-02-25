import { Outlet } from 'react-router-dom';
import type { AuthIllustrationProps } from '@/features/auth/types';

// ── Dữ liệu minh hoạ cho panel phải ──
const illustration: AuthIllustrationProps = {
  imageUrl:
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80',
  quote: '"Hành trình vạn dặm bắt đầu từ một bước chân."',
  author: 'Lão Tử',
};

// ── Illustration Panel (chỉ hiển thị trên Desktop) ──
const IllustrationPanel = ({ imageUrl, quote, author }: AuthIllustrationProps) => (
  <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
    {/* Background image */}
    <img
      src={imageUrl}
      alt="FlowLearn — Học tập hiệu quả"
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-linear-to-t from-ocean-950/80 via-ocean-900/40 to-ocean-800/20" />

    {/* Quote content */}
    <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center text-white">
      {/* Logo / Brand mark */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <span className="text-2xl font-bold">F</span>
        </div>
        <span className="text-3xl font-bold tracking-tight">FlowLearn</span>
      </div>

      <blockquote className="max-w-md text-xl font-medium leading-relaxed italic opacity-90">
        {quote}
      </blockquote>
      <cite className="text-sm font-semibold not-italic tracking-wide text-ocean-200">
        — {author}
      </cite>
    </div>
  </div>
);

// ── Main Auth Layout ──
export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* ── Left: Form Panel ── */}
      <div className="flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ocean-600">
              <span className="text-lg font-bold text-white">F</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-ocean-900">
              FlowLearn
            </span>
          </div>

          {/* Form slot rendered by nested Route */}
          <Outlet />
        </div>
      </div>

      {/* ── Right: Illustration Panel (Desktop only) ── */}
      <IllustrationPanel {...illustration} />
    </div>
  );
};

