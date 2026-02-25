import { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function TodayWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(time);

  const timeString = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(time);

  return (
    <section className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
      {/* Left accent */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-ocean-400 to-ocean-600 rounded-r-full" />

      {/* Date info */}
      <div className="flex items-center gap-3 pl-3">
        <div className="w-8 h-8 rounded-lg bg-ocean-50 flex items-center justify-center">
          <Calendar size={16} className="text-ocean-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Today</h3>
          <p className="text-xs text-slate-400">{dateString}</p>
        </div>
      </div>

      {/* Time + Status */}
      <div className="flex items-center gap-5">
        <p className="text-2xl font-mono font-bold text-ocean-600 tracking-widest">
          {timeString}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
          <TrendingUp size={11} />
          <span className="font-medium">Stable</span>
        </div>
      </div>
    </section>
  );
}
