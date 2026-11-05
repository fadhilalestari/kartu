import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, RotateCcw, Wind } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';

interface BirthdayCakeProps {
  friendName: string;
  age: number;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ friendName, age }) => {
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [hasBlownOut, setHasBlownOut] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const allOut = candlesLit.every((lit) => !lit);

  const blowSingleCandle = (index: number) => {
    if (!candlesLit[index]) return;
    const updated = [...candlesLit];
    updated[index] = false;
    setCandlesLit(updated);
    soundManager.playBlowCandle();

    if (updated.every((lit) => !lit)) {
      triggerCelebration();
    }
  };

  const blowAllCandles = () => {
    if (allOut) return;
    setCandlesLit([false, false, false, false, false]);
    setHasBlownOut(true);
    soundManager.playBlowCandle();
    triggerCelebration();
  };

  const triggerCelebration = () => {
    setHasBlownOut(true);
    setWishMade(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#f472b6', '#fbbf24', '#ffffff'],
    });

    setTimeout(() => {
      soundManager.playChimeSparkle();
    }, 400);
  };

  const relightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
    setHasBlownOut(false);
    setWishMade(false);
    soundManager.playHeartSound();
  };

  return (
    <section aria-labelledby="cake-heading" className="w-full max-w-2xl mx-auto my-8">
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-pink-200/80 shadow-xl overflow-hidden text-center">
        {/* Soft pink gradient backdrop inside card */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/60 to-rose-50/40 pointer-events-none" />

        {/* Section title */}
        <div className="relative z-10 flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🎂</span>
          <h2 id="cake-heading" className="text-xl sm:text-2xl font-black text-pink-900 tracking-tight">
            Kue Ultah Buat Ayaa 🎂
          </h2>
          <span className="text-xl">✨</span>
        </div>

        <p className="relative z-10 text-xs sm:text-sm text-pink-700/80 font-medium mb-6">
          Make a wish dulu sebelum ditiup lilinnya yaa! ✨
        </p>

        {/* 3D Tiered Pink Cake Illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center my-4 min-h-[220px]">
          {/* Candle Flames & Sticks */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 mb-[-6px] z-20">
            {candlesLit.map((isLit, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => blowSingleCandle(idx)}
                aria-label={`Lilin ${idx + 1} ${isLit ? 'menyala - klik untuk tiup' : 'sudah padam'}`}
                className="group flex flex-col items-center focus:outline-none transition-transform hover:scale-110"
              >
                {/* Flame / Smoke */}
                <div className="h-8 flex items-center justify-center">
                  {isLit ? (
                    <div className="relative flex flex-col items-center">
                      {/* Outer flame glow */}
                      <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full animate-bounce filter blur-[0.6px] shadow-lg shadow-amber-300/60" />
                      {/* Inner flame core */}
                      <div className="absolute bottom-1 w-2 h-3 bg-white/90 rounded-full" />
                    </div>
                  ) : (
                    /* Smoke wisps */
                    <div className="flex flex-col items-center animate-fade-out">
                      <div className="w-1.5 h-4 bg-slate-300/70 rounded-full filter blur-[1px] transform -translate-y-1 animate-pulse" />
                      <div className="w-1 h-2 bg-slate-200/50 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-slate-600" />

                {/* Striped Candle Body */}
                <div
                  className={`w-3.5 h-12 rounded-t-sm shadow-md transition-colors ${
                    idx % 2 === 0
                      ? 'bg-gradient-to-b from-pink-300 via-pink-400 to-rose-400'
                      : 'bg-gradient-to-b from-rose-300 via-pink-300 to-pink-400'
                  } border border-white/50 relative overflow-hidden`}
                >
                  {/* Candle stripes */}
                  <div className="absolute inset-x-0 top-2 h-1 bg-white/60 transform -rotate-12" />
                  <div className="absolute inset-x-0 top-6 h-1 bg-white/60 transform -rotate-12" />
                </div>
              </button>
            ))}
          </div>

          {/* Cake Top Tier */}
          <div className="relative w-44 sm:w-56 h-12 bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 rounded-t-2xl shadow-md border-b-4 border-rose-300/80 flex items-center justify-center z-10">
            {/* Strawberry & cream frosting dollops */}
            <div className="absolute -top-2 inset-x-2 flex justify-between items-center px-1">
              {['🍓', '🌸', '🍓', '🌸', '🍓'].map((item, i) => (
                <span key={i} className="text-sm drop-shadow-sm select-none">
                  {item}
                </span>
              ))}
            </div>

            {/* Sprinkles on top tier */}
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
              <span className="w-2 h-1 bg-pink-500 rounded-full rotate-45" />
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              <span className="w-2 h-1 bg-purple-400 rounded-full -rotate-12" />
            </div>
          </div>

          {/* Cake Bottom Tier */}
          <div className="relative w-60 sm:w-72 h-16 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 rounded-2xl shadow-xl border-t-2 border-white/40 border-b-4 border-rose-400 flex flex-col items-center justify-center">
            {/* White dripping icing decoration */}
            <div className="absolute top-0 inset-x-0 h-3 bg-white/90 rounded-b-xl shadow-inner flex justify-around">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-4 h-3 bg-white rounded-b-full -mt-0.5" />
              ))}
            </div>

            <div className="mt-2 text-xs font-bold text-pink-800/90 tracking-wide bg-white/70 px-3 py-0.5 rounded-full shadow-sm">
              Happy 19th Birthday, {friendName}! 👑
            </div>
          </div>

          {/* Cake Pedestal / Plate */}
          <div className="w-72 sm:w-84 h-4 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-full shadow-lg border border-slate-200/80 mt-1" />
          <div className="w-28 h-3 bg-slate-200 rounded-b-lg shadow-md" />
        </div>

        {/* Wish & Celebration Message when blown */}
        {wishMade && (
          <div className="relative z-10 mt-4 p-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 rounded-2xl border border-pink-300 shadow-inner animate-in fade-in duration-500">
            <div className="flex items-center justify-center gap-1.5 text-pink-600 font-extrabold text-base sm:text-lg mb-1">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Yeay lilinnya padam! 🥳</span>
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Semoga semua doa dan harapan kamu di umur 19 terkabul yaa! ✨
            </p>
          </div>
        )}

        {/* Interactive Controls */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
          {!allOut ? (
            <button
              type="button"
              onClick={blowAllCandles}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Wind className="w-4 h-4 animate-pulse" />
              <span>Tiup Lilin 💨</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={relightCandles}
              className="py-3 px-6 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-sm border border-pink-300 shadow-sm transition-all transform active:scale-95 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nyalain Lagi 🔥</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              confetti({
                particleCount: 40,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#f472b6', '#fb7185', '#ffd700'],
              });
              soundManager.playChimeSparkle();
            }}
            className="py-3 px-5 rounded-2xl bg-white hover:bg-pink-50 text-pink-600 font-semibold text-sm border border-pink-200 shadow-sm transition-all transform active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Lempar Konfeti ✨</span>
          </button>
        </div>
      </div>
    </section>
  );
};
