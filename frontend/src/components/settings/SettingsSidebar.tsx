import React from 'react';
import { User, CreditCard, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SettingsTab = 'profile' | 'billing' | 'notifications';

interface SettingsSidebarProps {
  active?: SettingsTab;
  onChange?: (tab: SettingsTab) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  active = 'profile',
  onChange,
}) => {
  const items: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Hồ sơ', icon: <User className="size-4" /> },
    { key: 'billing', label: 'Gói & Dung lượng', icon: <CreditCard className="size-4" /> },
    { key: 'notifications', label: 'Thông báo', icon: <Bell className="size-4" /> },
  ];

  return (
    <nav className="w-full">
      <ul className="flex flex-col space-y-2">
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <li key={it.key}>
              <button
                onClick={() => onChange?.(it.key)}
                className={cn(
                  'flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl transition-colors',
                  isActive
                    ? 'bg-ocean-50 text-ocean-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center size-8 rounded-full',
                    isActive ? 'bg-ocean-100 text-ocean-700' : 'bg-transparent text-slate-400'
                  )}
                >
                  {it.icon}
                </span>

                <span className="font-medium">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SettingsSidebar;
