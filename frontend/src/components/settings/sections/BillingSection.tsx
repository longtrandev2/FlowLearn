import React from 'react';
import { Badge, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlanInfo {
  name: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  benefits: string[];
}

export interface StorageInfo {
  usedGB: number;
  totalGB: number;
}

const mockPlan: PlanInfo = {
  name: 'FlowLearn Basic',
  tier: 'Free',
  benefits: ['10 courses / month', 'Community support', 'Basic analytics'],
};

const mockStorage: StorageInfo = {
  usedGB: 4.5,
  totalGB: 5,
};

export const BillingSection: React.FC = () => {
  const percent = Math.min(100, Math.round((mockStorage.usedGB / mockStorage.totalGB) * 100));
  const isCritical = percent >= 95;
  const isWarning = percent >= 80 && percent < 95;

  const progressColor = isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-ocean-500';

  return (
    <div className="space-y-6">
      {/* Current plan card */}
      <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-ocean-50 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8H9L12 2Z" fill="#0EA5E9"/></svg>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-800">{mockPlan.name}</h3>
              <span className="px-2 py-0.5 rounded-md bg-ocean-100 text-ocean-700 text-xs font-medium">Active</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">{mockPlan.benefits.join(' • ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-ocean-600 text-white font-medium shadow-md hover:brightness-105 transition">
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Storage usage */}
      <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-700">
              <AlertCircle className="size-4 text-ocean-600" />
              <div>
                <h4 className="text-sm font-medium">Storage Usage</h4>
                <p className="text-xs text-slate-400">Files, uploads and attachments</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">{mockStorage.usedGB} GB / {mockStorage.totalGB} GB</div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={cn('h-3 rounded-full transition-all')}
            style={{ width: `${percent}%` }}
          >
            <div className={cn('h-3', progressColor)} style={{ width: '100%' }} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-slate-500">
            {percent}% used • {Math.max(0, (mockStorage.totalGB - mockStorage.usedGB).toFixed(1))} GB remaining
          </div>

          <div className="flex items-center gap-2">
            {isCritical && <span className="text-rose-600 text-xs font-medium">Storage almost full</span>}
            {isWarning && !isCritical && <span className="text-amber-600 text-xs font-medium">Nearing limit</span>}
            {!isWarning && !isCritical && <span className="text-slate-400 text-xs">You have enough space</span>}
          </div>
        </div>

        <div className="mt-4">
          <button className="px-4 py-2 rounded-2xl bg-ocean-50 text-ocean-700 border border-ocean-100 text-sm hover:bg-ocean-100 transition">
            Manage storage
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
