import { Flame, Trophy } from 'lucide-react';
import { mockStreak } from '../data/mockData';

export default function StreakCard() {
  const { currentStreak, longestStreak, percentile, weekDays } = mockStreak;

  return (
    <div className="bg-gradient-to-br from-orange-400 via-red-500 to-rose-500 p-5 rounded-xl shadow-lg shadow-orange-200/50 text-white flex flex-col justify-between relative overflow-hidden h-full">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-xl -translate-x-6 translate-y-6" />

      {/* Content */}
      <div className="z-10 flex flex-col items-center text-center">
        {/* Flame icon */}
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
          <Flame size={24} className="text-white animate-pulse" fill="currentColor" />
        </div>

        {/* Streak number */}
        <h3 className="text-4xl font-extrabold leading-none mb-0.5">
          {currentStreak}
        </h3>
        <p className="text-sm font-medium text-orange-100">Day Streak 🔥</p>
      </div>

      {/* Week dots */}
      <div className="z-10 mt-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          {weekDays.map((wd, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                  wd.completed
                    ? 'bg-white text-orange-500'
                    : 'bg-white/15 text-white/60 border border-white/20'
                }`}
              >
                {wd.day}
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] text-orange-50">
            <Trophy size={12} />
            <span>Best: {longestStreak}d</span>
          </div>
          <div className="text-[11px] text-orange-50">
            Top {100 - percentile}% users
          </div>
        </div>
      </div>
    </div>
  );
}
