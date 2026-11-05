import React, { useState } from 'react';
import { Heart, Send, Sparkles, MessageSquareHeart, Search, Filter } from 'lucide-react';
import { Wish } from '../types/birthday';
import { validateWish, filterWishes } from '../utils/birthdayLogic';
import { soundManager } from '../utils/audioSynthesizer';

interface WishesWallProps {
  wishes: Wish[];
  onAddWish: (wish: Wish) => void;
  onLikeWish: (id: string) => void;
}

const AVATAR_OPTIONS = ['🌸', '💖', '🧁', '🎀', '✨', '🍓', '🧸', '🌷'];
const COLOR_OPTIONS: { id: Wish['cardColor']; label: string; bgClass: string; borderClass: string }[] = [
  { id: 'pink', label: 'Pink Pastel', bgClass: 'bg-pink-50/90', borderClass: 'border-pink-200' },
  { id: 'rose', label: 'Rose Blush', bgClass: 'bg-rose-50/90', borderClass: 'border-rose-200' },
  { id: 'lavender', label: 'Lavender Soft', bgClass: 'bg-purple-50/90', borderClass: 'border-purple-200' },
  { id: 'peach', label: 'Peach Cream', bgClass: 'bg-amber-50/90', borderClass: 'border-amber-200' },
];

export const WishesWall: React.FC<WishesWallProps> = ({ wishes, onAddWish, onLikeWish }) => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [tag, setTag] = useState<Wish['tag']>('Bestie');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [cardColor, setCardColor] = useState<Wish['cardColor']>('pink');
  const [formError, setFormError] = useState('');

  const filteredWishes = filterWishes(wishes, activeTag, searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateWish(author, message);
    if (!validation.isValid) {
      setFormError(validation.error || 'Mohon lengkapi formulir ucapan.');
      return;
    }

    const newWish: Wish = {
      id: Date.now().toString(),
      author: author.trim(),
      avatar: selectedAvatar,
      message: message.trim(),
      timestamp: 'Baru saja',
      likes: 1,
      isLiked: true,
      tag,
      cardColor,
    };

    onAddWish(newWish);
    soundManager.playChimeSparkle();
    setAuthor('');
    setMessage('');
    setFormError('');
  };

  return (
    <section aria-labelledby="wishes-heading" className="w-full max-w-4xl mx-auto my-10">
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-pink-200/90 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquareHeart className="w-4 h-4 text-pink-500" />
            <span>Papan Pesan & Doa Tulus</span>
          </div>
          <h2 id="wishes-heading" className="text-2xl sm:text-3xl font-black text-pink-900 tracking-tight">
            Kirimkan Doa & Ucapan Manis 💌
          </h2>
          <p className="text-xs sm:text-sm text-pink-700/80 font-medium mt-1">
            Tinggalkan pesan hangat untuk membuat hari ulang tahunnya semakin bermakna!
          </p>
        </div>

        {/* Wish Form */}
        <div className="bg-gradient-to-tr from-pink-50/80 via-white to-rose-50/80 rounded-2xl p-5 sm:p-6 border border-pink-200 shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wish-author" className="block text-xs font-bold text-pink-900 mb-1">
                  Nama Kamu / Panggilan
                </label>
                <input
                  id="wish-author"
                  type="text"
                  placeholder="Contoh: Dila Bestie, Nabila"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setFormError('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-900 mb-1">
                  Pilih Stempel Emoji
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ${
                        selectedAvatar === emoji
                          ? 'bg-pink-200 scale-110 shadow-xs border-2 border-pink-400'
                          : 'bg-white hover:bg-pink-100 border border-pink-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="wish-message" className="block text-xs font-bold text-pink-900 mb-1">
                Pesan & Doa Ulang Tahun
              </label>
              <textarea
                id="wish-message"
                rows={3}
                placeholder="Tuliskan harapan terbaik, doa berkah umur, atau ucapan seru untuk temanmu..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setFormError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 leading-relaxed font-normal"
                required
              />
            </div>

            {/* Category tag & color pickers */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-pink-900">Kategori:</span>
                {(['Bestie', 'Doa Tulus', 'Sweet', 'Kocak'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`py-1 px-3 rounded-full text-xs font-bold transition-colors ${
                      tag === t
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-pink-100/70 text-pink-700 hover:bg-pink-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-pink-900 mr-1">Warna:</span>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    onClick={() => setCardColor(c.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      c.id === 'pink' ? 'bg-pink-300' : c.id === 'rose' ? 'bg-rose-300' : c.id === 'lavender' ? 'bg-purple-300' : 'bg-amber-300'
                    } ${cardColor === c.id ? 'scale-125 border-pink-600' : 'border-white'}`}
                  />
                ))}
              </div>
            </div>

            {formError && (
              <p className="text-xs text-rose-500 font-bold">{formError}</p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirimkan Ucapan 💖</span>
              </button>
            </div>
          </form>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          {/* Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            <span className="text-xs font-bold text-pink-800 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['All', 'Bestie', 'Doa Tulus', 'Sweet', 'Kocak'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(t)}
                className={`py-1 px-3 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  activeTag === t
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-white text-pink-700 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                {t === 'All' ? 'Semua' : t}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
            <input
              type="text"
              placeholder="Cari ucapan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-pink-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* Wishes List Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredWishes.length > 0 ? (
            filteredWishes.map((w) => {
              const colorInfo = COLOR_OPTIONS.find((c) => c.id === w.cardColor) || COLOR_OPTIONS[0];
              return (
                <div
                  key={w.id}
                  className={`p-4 rounded-2xl border ${colorInfo.borderClass} ${colorInfo.bgClass} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{w.avatar}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                            {w.author}
                          </h4>
                          <span className="text-[10px] text-pink-500 font-medium">
                            {w.timestamp}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-100/80 px-2 py-0.5 rounded-full border border-pink-200">
                        {w.tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line mt-1">
                      {w.message}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-pink-100/80 flex items-center justify-between">
                    <span className="text-[10px] text-pink-400 italic">Disampaikan dengan cinta ✨</span>
                    <button
                      type="button"
                      onClick={() => {
                        onLikeWish(w.id);
                        soundManager.playHeartSound();
                      }}
                      aria-label={`Sukai ucapan dari ${w.author}, saat ini ${w.likes} suka`}
                      className={`flex items-center gap-1 text-xs font-bold py-1 px-2.5 rounded-full transition-transform active:scale-125 ${
                        w.isLiked
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-white/80 text-slate-500 hover:text-pink-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${w.isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                      <span>{w.likes}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-pink-500 font-medium text-xs sm:text-sm">
              Belum ada ucapan yang cocok. Jadilah yang pertama mengirimkan ucapan manis! 💖
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
