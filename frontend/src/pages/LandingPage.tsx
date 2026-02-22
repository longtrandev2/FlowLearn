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

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section
        id="hero"
        className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-150 h-150 rounded-full bg-linear-to-br from-sky-100 to-cyan-50 blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-linear-to-tr from-sky-50 to-blue-50 blur-3xl opacity-50 -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 w-75 h-75 rounded-full bg-linear-to-br from-cyan-50 to-sky-100 blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <motion.div {...motionProps} variants={fadeUp} className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-6 tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Learning Platform
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[Poppins,sans-serif] leading-[1.1] tracking-tight">
                Learn{" "}
                <span className="bg-linear-to-r from-sky-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Smarter
                </span>
                ,<br className="hidden sm:block" /> Not Harder
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                FlowLearn transforms your documents into interactive quizzes,
                flashcards, and study sessions — all powered by AI. Study
                efficiently and track your progress effortlessly.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold bg-linear-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all text-base"
                >
                  Start Learning Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => scrollTo("how-it-works")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-600 font-semibold transition-all text-base"
                >
                  See How It Works
                </button>
              </div>

              {/* Social proof mini */}
              <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">2,000+</span>{" "}
                  students already learning
                </div>
              </div>
            </motion.div>

            {/* Right — hero image */}
            <motion.div
              {...motionProps}
              variants={scaleIn}
              custom={1}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/10 border border-sky-100">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Students collaborating with FlowLearn"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                {/* Glassmorphism overlay card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-500 to-cyan-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Study streak: 14 days 🔥
                      </p>
                      <p className="text-xs text-slate-500">
                        Quiz accuracy improved by 27%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 lg:-right-6 px-4 py-2 rounded-2xl bg-white shadow-xl shadow-sky-500/10 border border-sky-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  AI Powered
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TRUSTED BY ══════════════════════ */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
            Trusted by students at leading institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["Harvard University", "Stanford", "MIT", "Oxford", "Cambridge", "Yale"].map((name) => (
              <span
                key={name}
                className="text-lg font-bold text-slate-300 hover:text-sky-400 transition-colors font-[Poppins,sans-serif] select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-4 tracking-wide">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[Poppins,sans-serif] tracking-tight">
              Everything You Need to{" "}
              <span className="bg-linear-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Powerful tools designed to transform the way you study, retain, and
              master any subject.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Brain, title: "AI Quiz Generation", description: "Automatically generate quizzes from your documents using advanced AI. Study smarter, not harder." },
              { icon: BookOpen, title: "Smart Flashcards", description: "Transform your notes into interactive flashcards with spaced repetition for maximum retention." },
              { icon: BarChart3, title: "Progress Analytics", description: "Track your learning journey with detailed insights, streaks, and performance charts." },
              { icon: FolderOpen, title: "Document Library", description: "Organize all your study materials in one place with folders, tags, and quick search." },
              { icon: Repeat2, title: "Spaced Repetition", description: "Our algorithm schedules reviews at optimal intervals so you remember more with less effort." },
              { icon: Sparkles, title: "AI-Powered Feedback", description: "Get instant, personalized feedback on your answers to understand concepts deeply." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...motionProps}
                variants={fadeUp}
                custom={i}
                className="group relative p-7 rounded-3xl bg-white border border-slate-100 hover:border-sky-200 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-sky-50 to-cyan-50 border border-sky-100 flex items-center justify-center mb-5 group-hover:from-sky-100 group-hover:to-cyan-100 transition-colors">
                  <f.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 font-[Poppins,sans-serif]">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section
        id="how-it-works"
        className="py-20 lg:py-28 bg-linear-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-4 tracking-wide">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[Poppins,sans-serif] tracking-tight">
              From Documents to{" "}
              <span className="bg-linear-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                Mastery
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Four simple steps to transform your learning experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Upload, title: "Upload Documents", description: "Upload your PDF or DOCX files to FlowLearn." },
              { icon: Cpu, title: "AI Processes Content", description: "Our AI analyzes your materials and creates study resources automatically." },
              { icon: GraduationCap, title: "Study Interactively", description: "Learn with quizzes, flashcards, and guided study sessions." },
              { icon: TrendingUp, title: "Track & Improve", description: "Monitor progress, maintain streaks, and achieve your learning goals." },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                {...motionProps}
                variants={fadeUp}
                custom={i}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-linear-to-r from-sky-300 to-sky-100" />
                )}

                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-sky-500 to-cyan-400 shadow-xl shadow-sky-500/20 mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-sky-200 text-xs font-bold text-sky-700 flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 font-[Poppins,sans-serif]">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TESTIMONIALS (coming next) ══════════════════════ */}

      {/* ══════════════════════ PRICING (coming next) ══════════════════════ */}

      {/* ══════════════════════ CTA BANNER (coming next) ══════════════════════ */}

      {/* ══════════════════════ FOOTER (coming next) ══════════════════════ */}

    </div>
  );
}
