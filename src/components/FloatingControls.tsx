import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Settings2, Sliders, Music, Heart } from 'lucide-react';
import { BackgroundConfig, BackgroundStyle } from '../types/birthday';
import { soundManager } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface FloatingControlsProps {
  bgConfig: BackgroundConfig;
  onChangeBgConfig: (updated: Partial<BackgroundConfig>) => void;
  onOpenPersonalize: () => void;
}

const BG_STYLE_OPTIONS: { id: BackgroundStyle; label: string; icon: string }[] = [
  { id: 'dreamy-hearts', label: 'Dreamy Hearts', icon: '💖' },
  { id: 'bubble-balloons', label: 'Pastel Balloons', icon: '🎈' },
  { id: 'rose-petals', label: 'Rose Petals', icon: '🌸' },
  { id: 'sparkle-stars', label: 'Sparkle Stars', icon: '✨' },
];

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  bgConfig,
  onChangeBgConfig,
  onOpenPersonalize,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(soundManager.getPlaying());
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [volume, setVolume] = useState(0.5);

  const toggleMusic = () => {
    const playing = soundManager.toggleMelody();
    setIsPlayingMusic(playing);
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  const blastConfetti = () => {
    soundManager.playConfettiPop();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#f472b6', '#fb7185', '#ec4899', '#fde047', '#a855f7'],
    });
  };

  return (
    <>
      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl border-2 border-pink-200 flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Music Toggle */}
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlayingMusic ? 'Hentikan Musik Box' : 'Putar Musik Box Ulang Tahun'}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPlayingMusic
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 animate-pulse'
                : 'bg-pink-100 hover:bg-pink-200 text-pink-700'
            }`}
          >
            {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isPlayingMusic ? 'Musik Box Berputar 🎶' : 'Putar Musik Box 🎵'}
            </span>
          </button>

          {/* Sound Mute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Confetti Quick Blast */}
          <button
            type="button"
            onClick={blastConfetti}
            aria-label="Tembakkan Konfeti Perayaan"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Konfeti! 🎉</span>
          </button>

          {/* Background & Settings Panel Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Buka Pengaturan Latar Belakang & Personalisasi"
            aria-expanded={isMenuOpen}
            className={`p-2 rounded-full transition-colors ${
              isMenuOpen
                ? 'bg-pink-600 text-white'
                : 'bg-pink-50 hover:bg-pink-100 text-pink-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings & Background Customizer Popover */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-label="Pengaturan Latar Belakang Gerak"
          className="fixed bottom-20 right-4 sm:right-8 z-40 max-w-xs w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-pink-200 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-pink-100">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-pink-500" />
              <h3 className="text-xs font-black text-pink-900 uppercase tracking-wider">
                Efek Background Gerak
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Style Selector */}
          <div className="mb-4">
            <label className="block text-[11px] font-bold text-pink-800 mb-2">
              Gaya Partikel Bergerak:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BG_STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onChangeBgConfig({ style: style.id })}
                  className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    bgConfig.style === style.id
                      ? 'bg-pink-100 border-pink-400 text-pink-900 shadow-xs'
                      : 'bg-white border-pink-100 text-slate-600 hover:bg-pink-50'
                  }`}
                >
                  <span>{style.icon}</span>
                  <span className="truncate">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Control Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-bold text-pink-800 mb-1">
              <span>Kecepatan Gerak:</span>
              <span className="text-pink-600 font-extrabold">{bgConfig.speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.0"
              step="0.2"
              value={bgConfig.speed}
              onChange={(e) => onChangeBgConfig({ speed: parseFloat(e.target.value) })}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-pink-400 font-medium mt-0.5">
              <span>Tenang & Lembut</span>
              <span>Cepat & Semarak</span>
            </div>
          </div>

          {/* Interactive cursor trail toggle */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-pink-800">Efek Kilau Kursor:</span>
            <button
              type="button"
              onClick={() => onChangeBgConfig({ interactive: !bgConfig.interactive })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                bgConfig.interactive ? 'bg-pink-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  bgConfig.interactive ? 'transform translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* Audio volume slider */}
          <div className="mb-4 pt-2 border-t border-pink-100">
            <div className="flex items-center justify-between text-xs font-bold text-pink-800 mb-1">
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-pink-500" /> Volume Musik Box:
              </span>
              <span className="text-pink-600">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Personalize Button */}
          <div className="pt-2 border-t border-pink-100">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onOpenPersonalize();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Ganti Data ✏️</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
