import React, { useState } from 'react';
import SettingsSidebar, { type SettingsTab } from '@/components/settings/SettingsSidebar';
import ProfileSection from '@/components/settings/sections/ProfileSection';

const SettingsPage: React.FC = () => {
  const [active, setActive] = useState<SettingsTab>('profile');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Cài đặt</h1>

      <div className="grid grid-cols-4 gap-6 items-start">
        {/* Sidebar: 1/4 */}
        <aside className="col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4">
            <SettingsSidebar active={active} onChange={(t) => setActive(t)} />
          </div>
        </aside>

        {/* Content: 3/4 */}
        <main className="col-span-3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 min-h-[360px]">
            {/* Placeholder – sections will be inserted here in later steps */}
            {active === 'profile' && <ProfileSection />}
            {active === 'billing' && <div className="text-slate-600">Billing & Storage section will appear here.</div>}
            {active === 'notifications' && <div className="text-slate-600">Notification settings will appear here.</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
