// src/features/overview/components/StudyChart.tsx
import { Clock } from 'lucide-react';

export default function StudyChart() {
  const data = [45, 80, 30, 90, 60, 20, 100];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" /> Study Time
          </h3>
          <p className="text-xs text-slate-400">Weekly Activity</p>
        </div>
        <select className="text-xs border rounded-lg px-2 py-1 bg-slate-50 outline-none">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      <div className="h-48 flex items-end justify-between gap-4 px-2">
        {data.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-full rounded-t-xl bg-slate-100 overflow-hidden h-40">
              <div 
                className={`absolute bottom-0 left-0 w-full transition-all duration-500 rounded-t-xl group-hover:opacity-80 ${
                  i === 3 ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-indigo-300'
                }`}
                style={{ height: `${height}%` }}
              ></div>
            </div>
            <span className={`text-xs font-medium ${i===3 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
              {days[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}