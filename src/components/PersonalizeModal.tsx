import React, { useState } from 'react';
import { X, Sparkles, Check, User, Heart, Share2, Copy } from 'lucide-react';
import { BirthdayProfile } from '../types/birthday';
import { soundManager } from '../utils/audioSynthesizer';

interface PersonalizeModalProps {
  profile: BirthdayProfile;
  onSave: (updated: BirthdayProfile) => void;
  onClose: () => void;
}

const PRESET_AVATARS = [
  '/assets/aistudio/foto_aya_8779ef9a.jpeg',
  '/assets/aistudio/foto_aku_samaaya_48c24374.jpeg',
  '/assets/aistudio/WhatsApp_Image_2026-11-05_at_21.52.50_ddbf2362.jpeg',
  '/assets/aistudio/WhatsApp_Image_2026-11-05_at_21.53.10_298e7184.jpeg',
];

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [age, setAge] = useState(profile.age);
  const [relation, setRelation] = useState(profile.relation);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      soundManager.playChimeSparkle();
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      name: name.trim() || profile.name,
      nickname: nickname.trim() || name.trim(),
      age: Number(age) || profile.age,
      relation: relation.trim() || profile.relation,
      avatarUrl: avatarUrl || profile.avatarUrl,
    });
    soundManager.playChimeSparkle();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Personalisasi Website Ulang Tahun"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pink-200 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup form personalisasi"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-extrabold text-pink-900">
            Ganti Data ✏️
          </h2>
        </div>
        <p className="text-xs text-pink-700/80 mb-6 font-medium">
          Bisa ganti nama, umur, foto, atau panggilan di sini yaa.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="friend-name" className="block text-xs font-bold text-slate-700 mb-1">
                Nama
              </label>
              <input
                id="friend-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ayaa"
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold"
                required
              />
            </div>

            <div>
              <label htmlFor="friend-age" className="block text-xs font-bold text-slate-700 mb-1">
                Umur
              </label>
              <input
                id="friend-age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="friend-relation" className="block text-xs font-bold text-slate-700 mb-1">
              Panggilan / Status
            </label>
            <input
              id="friend-relation"
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Contoh: Sahabat tersayang 💕"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {/* Avatar Photo Customizer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Foto Profil
            </label>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-300 shadow-md shrink-0">
                <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Pilihan Contoh:</span>
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform ${
                    avatarUrl === url ? 'scale-110 border-pink-500' : 'border-slate-200'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="pt-3 border-t border-pink-100">
            <div className="flex items-center justify-between bg-pink-50/70 p-3 rounded-2xl border border-pink-200">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-600" />
                <span className="text-xs text-pink-900 font-bold">Salin Link Website</span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-1 px-3 rounded-xl bg-white hover:bg-pink-100 text-pink-700 border border-pink-300 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-xs font-bold shadow-md hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan ✨</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
