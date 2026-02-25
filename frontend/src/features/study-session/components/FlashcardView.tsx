import { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Flashcard, FlashcardImportance } from "@/features/study-session/types";
import { IMPORTANCE_STYLE } from "@/features/study-session/types";
import { cn } from "@/lib/utils";

interface FlashcardViewProps {
  flashcards: Flashcard[];
}

export default function FlashcardView({ flashcards }: FlashcardViewProps) {
  // ── Filter state ──
  const [activeFilters, setActiveFilters] = useState<Set<FlashcardImportance>>(
    new Set(["core", "support", "advanced"])
  );

  // ── Navigation state ──
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // ── Stats ──
  const [remembered, setRemembered] = useState(0);
  const [forgotten, setForgotten] = useState(0);

  // ── Filtered cards ──
  const filtered = useMemo(
    () => flashcards.filter((fc) => activeFilters.has(fc.importance)),
    [flashcards, activeFilters]
  );

  const currentCard = filtered[currentIndex] ?? null;
  const total = filtered.length;

  // ── Filter toggle ──
  function toggleFilter(importance: FlashcardImportance) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(importance)) {
        if (next.size > 1) next.delete(importance);
      } else {
        next.add(importance);
      }
      return next;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  // ── Navigation ──
  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, total]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  function handleShuffle() {
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  function handleReset() {
    setCurrentIndex(0);
    setIsFlipped(false);
    setRemembered(0);
    setForgotten(0);
  }

  // ── Rate ──
  function handleForgot() {
    setForgotten((f) => f + 1);
    goNext();
  }

  function handleRemember() {
    setRemembered((r) => r + 1);
    goNext();
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-4">🃏</span>
        <p className="text-slate-500">Không có flashcard nào với bộ lọc hiện tại.</p>
      </div>
    );
  }

  return (
    <div className="py-6 px-1">
      {/* ── Top bar: Filters + Counter ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Importance filters */}
        <div className="flex gap-2">
          {(["core", "support", "advanced"] as FlashcardImportance[]).map(
            (imp) => {
              const style = IMPORTANCE_STYLE[imp];
              const isActive = activeFilters.has(imp);
              return (
                <button
                  key={imp}
                  onClick={() => toggleFilter(imp)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border",
                    isActive
                      ? `${style.bg} ${style.text} border-current/20`
                      : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                  )}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isActive ? style.dot : "bg-slate-300"
                    )}
                  />
                  {style.label}
                </button>
              );
            }
          )}
        </div>

        {/* Counter + Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {(remembered > 0 || forgotten > 0) && (
            <div className="flex items-center gap-3">
              <span className="text-green-500 font-semibold">
                ✓ {remembered}
              </span>
              <span className="text-red-400 font-semibold">
                ✗ {forgotten}
              </span>
            </div>
          )}
          <span className="font-semibold text-slate-600">
            {currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      {/* ── Flashcard ── */}
      {currentCard && (
        <div className="flex flex-col items-center">
          {/* Card container with perspective */}
          <div
            className="w-full max-w-xl cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className="relative w-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="w-full min-h-56 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center text-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Importance badge */}
                <div
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-bold mb-6",
                    IMPORTANCE_STYLE[currentCard.importance].bg,
                    IMPORTANCE_STYLE[currentCard.importance].text
                  )}
                >
                  {IMPORTANCE_STYLE[currentCard.importance].label}
                </div>

                <p className="text-lg font-semibold text-slate-800 leading-relaxed">
                  {currentCard.front}
                </p>

                <p className="text-xs text-slate-400 mt-6">
                  Nhấn để lật thẻ
                </p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 w-full min-h-56 bg-ocean-50 rounded-2xl border border-ocean-200 shadow-sm p-8 flex flex-col items-center justify-center text-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="px-2.5 py-1 rounded-md text-[11px] font-bold mb-6 bg-ocean-100 text-ocean-700">
                  Đáp án
                </div>

                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {currentCard.back}
                </p>
              </div>
            </div>
          </div>

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </Button>

            <Button
              variant="outline"
              onClick={handleShuffle}
              className="h-10 rounded-xl border-slate-200 hover:bg-slate-50 gap-2 text-sm"
            >
              <Shuffle size={14} />
              Shuffle
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              className="h-10 rounded-xl border-slate-200 hover:bg-slate-50 gap-2 text-sm"
            >
              <RotateCcw size={14} />
              Reset
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={goNext}
              disabled={currentIndex >= total - 1}
              className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* ── Rate buttons ── */}
          <div className="flex items-center justify-between w-full max-w-xl mt-4">
            <Button
              variant="outline"
              onClick={handleForgot}
              className="h-10 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 gap-2 text-sm font-semibold"
            >
              <ThumbsDown size={15} />
              Quên
            </Button>

            <Button
              variant="outline"
              onClick={handleRemember}
              className="h-10 rounded-xl border-green-200 text-green-500 hover:bg-green-50 hover:text-green-600 gap-2 text-sm font-semibold"
            >
              <ThumbsUp size={15} />
              Nhớ
            </Button>
          </div>

          {/* ── Progress bar ── */}
          <div className="w-full max-w-xl mt-6">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-ocean-400 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
