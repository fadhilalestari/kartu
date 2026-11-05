import React from 'react';
import { Sparkles, Heart, Crown, Cake, Mail, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BirthdayProfile } from '../types/birthday';
import { soundManager } from '../utils/audioSynthesizer';

interface HeroBirthdayProps {
  profile: BirthdayProfile;
  onOpenPersonalize: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const HeroBirthday: React.FC<HeroBirthdayProps> = ({
  profile,
  onOpenPersonalize,
  onScrollToSection,
}) => {
  const triggerConfettiBlast = () => {
    soundManager.playConfettiPop();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.4 },
      colors: ['#f472b6', '#ec4899', '#fb7185', '#ffd1dc', '#facc15'],
    });
  };

  return (
    <header className="relative w-full max-w-4xl mx-auto pt-8 pb-10 text-center px-4">
      {/* Level / Age Floating Badge */}
      <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border-2 border-pink-300 py-1.5 px-4 rounded-full shadow-lg mb-6">
        <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
        <span className="text-xs sm:text-sm font-bold text-pink-700 tracking-wide">
          Ayaa lagi ultah yang ke-{profile.age}! 🥳
        </span>
        <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
      </div>

      {/* Birthday Recipient Photo & Glowing Ring */}
      <div className="relative inline-block my-2">
        {/* Animated pink glow rings */}
        <div className="absolute inset-0 rounded-full bg-pink-400 blur-xl opacity-40 animate-pulse" />
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-pink-500 via-rose-300 to-amber-300 animate-spin" style={{ animationDuration: '10s' }} />

        {/* Profile Avatar Container */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-pink-100 flex items-center justify-center">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Crown sticker on top of avatar */}
        <div className="absolute -top-3 -right-2 w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-md transform rotate-12">
          <span className="text-lg">👑</span>
        </div>

        {/* Heart sticker at bottom of avatar */}
        <button
          type="button"
          onClick={() => {
            soundManager.playHeartSound();
            confetti({
              particleCount: 25,
              spread: 40,
              origin: { y: 0.3 },
              colors: ['#ec4899', '#f472b6'],
            });
          }}
          aria-label="Kirimkan cinta untuk teman"
          className="absolute -bottom-1 -left-2 w-9 h-9 rounded-full bg-white border-2 border-pink-300 flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
        >
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
        </button>
      </div>

      {/* Main Festive Heading */}
      <div className="mt-4 mb-3">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Happy Birthday,{' '}
          <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 bg-clip-text text-transparent underline decoration-pink-300 decoration-wavy decoration-2">
            {profile.name}
          </span>
          ! 🎉
        </h1>
        <p className="mt-2 text-sm sm:text-base font-semibold text-pink-700/90 italic">
          "{profile.relation}"
        </p>
      </div>

      {/* Touching Subtext */}
      <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-8">
        Selamat ulang tahun yang ke-19 yaa Ayaa! Semoga makin bahagia, sehat-sehat terus di sana, dan apa yang kamu impikan bisa kecapai ✨
      </p>

      {/* Quick Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={triggerConfettiBlast}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 transition-all transform active:scale-95 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tembak Konfeti 🎉</span>
        </button>

        <button
          type="button"
          onClick={() => onScrollToSection('cake-section')}
          className="py-3 px-5 rounded-2xl bg-white/90 hover:bg-pink-50 text-pink-800 font-bold text-sm border-2 border-pink-200 shadow-md transition-all transform active:scale-95 flex items-center gap-2"
        >
          <Cake className="w-4 h-4 text-pink-500" />
          <span>Tiup Lilin 🎂</span>
        </button>

        <button
          type="button"
          onClick={() => onScrollToSection('letter-section')}
          className="py-3 px-5 rounded-2xl bg-white/90 hover:bg-pink-50 text-pink-800 font-bold text-sm border-2 border-pink-200 shadow-md transition-all transform active:scale-95 flex items-center gap-2"
        >
          <Mail className="w-4 h-4 text-pink-500" />
          <span>Buka Surat 💌</span>
        </button>

        <button
          type="button"
          onClick={onOpenPersonalize}
          className="py-3 px-4 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-sm border border-pink-300 transition-all flex items-center gap-1.5"
          title="Ubah nama, umur, atau foto"
        >
          <span>✏️ Ganti Data</span>
        </button>
      </div>
    </header>
  );
};
