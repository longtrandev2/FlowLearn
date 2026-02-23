import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

export default function RealtimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format sang tiếng Anh (VD: Thursday, February 5, 2026)
  const dateString = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  }).format(time);

  const timeString = new Intl.DateTimeFormat('en-US', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false // Dùng 24h hoặc true nếu thích AM/PM
  }).format(time);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden relative">
      <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500"></div>
      <div>
         <h3 className="text-lg font-bold text-slate-800">Today</h3>
         <p className="text-slate-500">{dateString}</p>
      </div>
      <div className="text-right">
         <p className="text-3xl font-mono font-bold text-indigo-600 tracking-widest">
           {timeString}
         </p>
         <div className="flex items-center gap-1 text-xs text-green-500 justify-end mt-1">
           <TrendingUp size={12} />
           <span>System Stable</span>
         </div>
      </div>
    </section>
  );
}