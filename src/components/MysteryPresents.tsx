import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import { MysteryGift } from '../types/birthday';
import { soundManager } from '../utils/audioSynthesizer';

const INITIAL_GIFTS: MysteryGift[] = [
  {
    id: '1',
    title: 'Kado 1',
    icon: '🫂',
    surprise: 'Janji Ketemu Pas Udah Ga LDR! 🫂✈️',
    subtext: 'Pas kita ketemu nanti wajib jalan bareng seharian, kangen banget pelukan langsung!',
    isOpened: false,
  },
  {
    id: '2',
    title: 'Kado 2',
    icon: '📱',
    surprise: 'Temen Curhat 24 Jam 📱✨',
    subtext: 'Kapan pun kamu mau cerita, spam chat, atau telponan, aku selalu ada buat kamu!',
    isOpened: false,
  },
  {
    id: '3',
    title: 'Kado 3',
    icon: '🌟',
    surprise: 'Doa Terbaik Buat Ayaa 🌟💖',
    subtext: 'Semoga urusan kuliah atau kerjaan lancar terus, dijauhin dari yang bikin pusing, dan bahagia terus!',
    isOpened: false,
  },
  {
    id: '4',
    title: 'Kado 4',
    icon: '🪄',
    surprise: 'Bebas Minta 1 Permintaan! 🪄',
    subtext: 'Khusus hari ini kamu boleh minta apa aja ke aku, nanti aku usahain wujudin yaa wkwk!',
    isOpened: false,
  },
];

export const MysteryPresents: React.FC = () => {
  const [gifts, setGifts] = useState<MysteryGift[]>(INITIAL_GIFTS);

  const openGift = (id: string) => {
    setGifts((prev) =>
      prev.map((g) => {
        if (g.id === id && !g.isOpened) {
          soundManager.playConfettiPop();
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#f472b6', '#fb7185', '#ec4899', '#fde047'],
          });
          return { ...g, isOpened: true };
        }
        return g;
      })
    );
  };

  return (
    <section aria-labelledby="mystery-heading" className="w-full max-w-4xl mx-auto my-10">
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-pink-200/90 shadow-xl overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Gift className="w-4 h-4 text-pink-500" />
          <span>Kejutan Kecil 🎁</span>
        </div>
        <h2 id="mystery-heading" className="text-2xl sm:text-3xl font-black text-pink-900 tracking-tight mb-2">
          Buka 4 Kado Buat Ayaa 🎁
        </h2>
        <p className="text-xs sm:text-sm text-pink-700/80 font-medium max-w-md mx-auto mb-8">
          Klik kotaknya satu-satu yaa, ada kejutan kecil buat kamu!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {gifts.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => openGift(g.id)}
              disabled={g.isOpened}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 relative flex flex-col justify-between min-h-[190px] ${
                g.isOpened
                  ? 'bg-gradient-to-b from-pink-50 to-rose-100/60 border-pink-300 shadow-sm'
                  : 'bg-white hover:bg-pink-50/60 border-dashed border-pink-300 shadow-md hover:-translate-y-1 cursor-pointer'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{g.isOpened ? g.icon : '🎁'}</span>
                  {g.isOpened ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Terbuka
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full animate-pulse">
                      <Sparkles className="w-3 h-3" /> Buka
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-slate-800 leading-snug">
                  {g.isOpened ? g.surprise : g.title}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-pink-100/60">
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {g.isOpened ? g.subtext : 'Klik kotaknya buat liat isinya! ✨'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
