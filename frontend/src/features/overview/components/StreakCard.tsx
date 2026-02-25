import { Flame } from 'lucide-react';

export default function StreakCard() {
  return (
    <div className="bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-2xl shadow-lg shadow-orange-200 text-white flex flex-col items-center justify-center relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
      
      <div className="z-10 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Flame size={32} className="text-white animate-pulse" fill="currentColor" />
        </div>
        <h3 className="text-4xl font-bold mb-1">12</h3>
        <p className="font-medium text-orange-100 mb-6">Day Streak 🔥</p>
        
        <div className="bg-white/10 rounded-xl p-3 text-xs text-orange-50 backdrop-blur-sm border border-white/10">
          <p>You're more active than 85% of users!</p>
        </div>
      </div>
    </div>
  );
}