import React, { useState, useRef } from 'react';
import { UserCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UserProfile {
  fullName: string;
  email: string;
  bio?: string;
  avatarUrl?: string | null;
}

const mockProfile: UserProfile = {
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  bio: 'Yêu thích học React và xây dựng sản phẩm.',
  avatarUrl: null,
};

export const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (k: keyof UserProfile, v: string) => {
    setProfile((p) => ({ ...p, [k]: v }));
  };

  const handleUploadClick = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Preview locally using URL.createObjectURL
    const url = URL.createObjectURL(f);
    setProfile((p) => ({ ...p, avatarUrl: url }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate network save
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    // In real app: call API to persist
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="size-12 text-ocean-500" />
            )}
          </div>

          <button
            type="button"
            onClick={handleUploadClick}
            className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-sm border border-slate-100 text-ocean-600 hover:bg-ocean-50 transition"
          >
            <Upload className="size-4" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        <div className="flex-1">
          <label className="text-sm text-slate-600 block mb-1">Họ và tên</label>
          <input
            value={profile.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={cn(
              'w-full rounded-xl border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/40 focus:border-ocean-500'
            )}
          />

          <label className="text-sm text-slate-600 block mt-3 mb-1">Email</label>
          <input
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={cn(
              'w-full rounded-xl border px-3 py-2 text-sm bg-slate-50',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/40 focus:border-ocean-500'
            )}
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-600 block mb-1">Bio ngắn</label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={4}
          className={cn(
            'w-full rounded-2xl border px-3 py-2 text-sm resize-none',
            'focus:outline-none focus:ring-2 focus:ring-ocean-500/40 focus:border-ocean-500'
          )}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'px-4 py-2 rounded-2xl text-white font-medium transition',
            isSaving
              ? 'bg-ocean-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-ocean-500 to-ocean-600 shadow-sm hover:brightness-105'
          )}
        >
          {isSaving ? 'Đang lưu...' : 'Save Changes'}
        </button>

        <button
          onClick={() => setProfile(mockProfile)}
          className="px-3 py-2 rounded-2xl border border-slate-100 text-sm text-slate-600 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
