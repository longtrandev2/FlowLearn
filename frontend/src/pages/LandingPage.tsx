import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Easing } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Brain,
  BarChart3,
  FolderOpen,
  Repeat2,
  Sparkles,
  Upload,
  Cpu,
  GraduationCap,
  TrendingUp,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────── animation helpers ─────────────────────── */

const ease: Easing = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.45, ease },
  }),
};

/* ─────────────────────── component ─────────────────────── */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
      };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-[Inter,system-ui,sans-serif] overflow-x-hidden">

      {/* ══════════════════════ NAVBAR ══════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-sky-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-shadow">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-[Poppins,sans-serif] bg-linear-to-r from-sky-700 to-cyan-600 bg-clip-text text-transparent">
                FlowLearn
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {["features", "how-it-works", "testimonials", "pricing"].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors capitalize"
                >
                  {s.replace(/-/g, " ")}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors px-4 py-2"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-linear-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 px-5 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-sky-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-sky-100 shadow-lg"
          >
            <div className="px-4 py-6 space-y-3">
              {["features", "how-it-works", "testimonials", "pricing"].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-600 font-medium capitalize transition-colors"
                >
                  {s.replace(/-/g, " ")}
                </button>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="text-center px-4 py-3 rounded-xl text-slate-700 hover:bg-sky-50 font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-center px-4 py-3 rounded-xl text-white bg-linear-to-r from-sky-500 to-cyan-500 font-semibold shadow-lg shadow-sky-500/25"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ══════════════════════ HERO (coming next) ══════════════════════ */}

      {/* ══════════════════════ TRUSTED BY (coming next) ══════════════════════ */}

      {/* ══════════════════════ FEATURES (coming next) ══════════════════════ */}

      {/* ══════════════════════ HOW IT WORKS (coming next) ══════════════════════ */}

      {/* ══════════════════════ TESTIMONIALS (coming next) ══════════════════════ */}

      {/* ══════════════════════ PRICING (coming next) ══════════════════════ */}

      {/* ══════════════════════ CTA BANNER (coming next) ══════════════════════ */}

      {/* ══════════════════════ FOOTER (coming next) ══════════════════════ */}

    </div>
  );
}
