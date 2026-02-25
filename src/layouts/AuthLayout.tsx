import { Outlet } from "react-router-dom";
import { BookOpen } from "lucide-react";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left Panel: Branding & Image (hidden on mobile) ── */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-between overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80"
          alt="Students studying together"
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-40"
        />

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-sky-800/40 to-transparent" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            FlowLearn
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10 p-8">
          <blockquote className="space-y-3">
            <p className="text-2xl font-semibold leading-snug text-white/95">
              "Education is the passport to the future, for tomorrow belongs to
              those who prepare for it today."
            </p>
            <footer className="text-sm font-medium text-sky-200">
              — Malcolm X
            </footer>
          </blockquote>

          {/* Decorative dots */}
          <div className="mt-8 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            <span className="h-2 w-8 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white/60" />
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form Container ── */}
      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-4 py-8 lg:w-1/2">
        {/* Mobile Logo (visible only on small screens) */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            FlowLearn
          </span>
        </div>

        {/* Form Outlet */}
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
