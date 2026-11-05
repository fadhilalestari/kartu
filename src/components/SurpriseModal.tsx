import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';

interface SurpriseModalProps {
  friendName: string;
  onOpen: () => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({ friendName, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenGift = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Play synthesized celebration sound effects
    soundManager.playConfettiPop();

    // Trigger canvas confetti fireworks
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#ec4899', '#fb7185', '#ffd1dc', '#facc15', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f472b6', '#fb7185', '#f43f5e'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#a855f7', '#fb7185'],
      });
    }, 250);

    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kotak Kejutan Ulang Tahun"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/50 backdrop-blur-md transition-all duration-700"
    >
      <div className="relative max-w-md w-full bg-white/95 rounded-3xl p-8 shadow-2xl border-4 border-pink-200 text-center overflow-hidden">
        {/* Decorative corner ribbons & sparkles */}
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-pink-300/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 transform -translate-x-4 translate-y-4 w-24 h-24 bg-rose-300/40 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span className="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
            Ada Kado Nih 🎁
          </span>
          <Sparkles className="w-4 h-4 text-pink-500" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
          Happy 19th Birthday, {friendName}! 🎂
        </h2>

        <p className="text-sm text-slate-600 mb-6 font-medium">
          Ada kado kecil nih buat kamu, dibuka dulu yuk! 👀
        </p>

        {/* 3D Animated Gift Box Graphic */}
        <div className="relative my-6 flex justify-center items-center">
          <button
            type="button"
            onClick={handleOpenGift}
            aria-label="Buka Kotak Kado"
            className={`group relative focus:outline-none transition-transform duration-500 ${
              isOpening ? 'scale-110' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {/* Pulsing glow background */}
            <div className="absolute inset-0 bg-pink-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity" />

            {/* Gift Box Container */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-400 rounded-3xl shadow-xl flex items-center justify-center border-2 border-white/60">
              {/* Golden / Cream Ribbon Horizontal */}
              <div className="absolute inset-x-0 h-6 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 shadow-sm" />
              {/* Ribbon Vertical */}
              <div className="absolute inset-y-0 w-6 bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-200 shadow-sm" />

              {/* Bow on Top */}
              <div className="absolute -top-5 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-yellow-300 bg-yellow-200 transform -rotate-45 shadow-md" />
                <div className="w-8 h-8 rounded-full border-4 border-yellow-300 bg-yellow-200 transform rotate-45 -ml-3 shadow-md" />
                <div className="absolute w-4 h-4 rounded-full bg-yellow-400 border-2 border-white" />
              </div>

              {/* Heart Badge in Center */}
              <div className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-pink-200">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
              </div>
            </div>

            {/* Tap prompt badge */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-200 py-1 px-3 rounded-full shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              <span>Klik kotaknya yaa</span>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleOpenGift}
            disabled={isOpening}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            <span>{isOpening ? 'Lagi dibuka... ✨' : 'Buka Kadonya 🎁'}</span>
          </button>

          <button
            type="button"
            onClick={onOpen}
            className="text-xs text-pink-600/70 hover:text-pink-700 py-1 underline underline-offset-4"
          >
            Langsung masuk aja →
          </button>
        </div>
      </div>
    </div>
  );
};
