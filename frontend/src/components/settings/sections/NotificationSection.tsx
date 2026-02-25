import React, { useState } from 'react';
import { Bell, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationSettings {
  emailReminders: boolean;
  streakNotifications: boolean;
}

const mockSettings: NotificationSettings = {
  emailReminders: true,
  streakNotifications: false,
};

const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
        checked ? 'bg-ocean-500' : 'bg-slate-200'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm',
          checked ? 'translate-x-5' : 'translate-x-1'
        )}
      />
    </button>
  );
};

export const NotificationSection: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);

  const toggle = (k: keyof NotificationSettings) => {
    setSettings((s) => ({ ...s, [k]: !s[k] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Notification Settings</h3>
        <p className="text-sm text-slate-500 mb-4">Choose how you'd like to receive updates from FlowLearn.</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-ocean-50 text-ocean-600">
                <Mail className="size-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Email reminders</div>
                <div className="text-xs text-slate-400">Receive email reminders to continue learning</div>
              </div>
            </div>
            <Switch checked={settings.emailReminders} onChange={() => toggle('emailReminders')} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-ocean-50 text-ocean-600">
                <Bell className="size-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Streak notifications</div>
                <div className="text-xs text-slate-400">Get notified about your learning streaks</div>
              </div>
            </div>
            <Switch checked={settings.streakNotifications} onChange={() => toggle('streakNotifications')} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              'px-4 py-2 rounded-2xl text-white font-medium transition',
              isSaving ? 'bg-ocean-300 cursor-not-allowed' : 'bg-gradient-to-r from-ocean-500 to-ocean-600 shadow-sm hover:brightness-105'
            )}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={() => setSettings(mockSettings)}
            className="px-3 py-2 rounded-2xl border border-slate-100 text-sm text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;
