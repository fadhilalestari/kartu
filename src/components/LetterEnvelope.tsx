import React, { useState } from 'react';
import { Mail, Heart, Check, Copy, Edit3, X } from 'lucide-react';
import { soundManager } from '../utils/audioSynthesizer';

interface LetterEnvelopeProps {
  friendName: string;
  senderName: string;
  greeting: string;
  bodyText: string;
  closing: string;
  onUpdateLetter: (updated: { greeting: string; bodyText: string; closing: string }) => void;
}

export const LetterEnvelope: React.FC<LetterEnvelopeProps> = ({
  friendName,
  senderName,
  greeting,
  bodyText,
  closing,
  onUpdateLetter,
}) => {
  const [isOpen, setIsOpen] = useState(true); // default open or toggleable
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editGreeting, setEditGreeting] = useState(greeting);
  const [editBody, setEditBody] = useState(bodyText);
  const [editClosing, setEditClosing] = useState(closing);

  const toggleEnvelope = () => {
    setIsOpen(!isOpen);
    soundManager.playHeartSound();
  };

  const handleCopyText = async () => {
    const fullText = `${greeting}\n\n${bodyText}\n\n${closing}\n- Dari ${senderName}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setIsCopied(true);
      soundManager.playChimeSparkle();
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLetter({
      greeting: editGreeting,
      bodyText: editBody,
      closing: editClosing,
    });
    setIsEditing(false);
    soundManager.playChimeSparkle();
  };

  return (
    <section aria-labelledby="letter-heading" className="w-full max-w-2xl mx-auto my-8">
      <div className="relative bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-pink-200/90 shadow-xl overflow-hidden">
        {/* Soft pink highlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-100/50 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 id="letter-heading" className="text-lg sm:text-xl font-extrabold text-pink-900">
                Surat Buat Ayaa 💌
              </h2>
              <p className="text-xs text-pink-600/80 font-medium">
                Dibaca santai yaa!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyText}
              aria-label="Salin isi ucapan ulang tahun"
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Salin ucapan untuk WhatsApp"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCopied ? 'Tersalin!' : 'Salin'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditGreeting(greeting);
                setEditBody(bodyText);
                setEditClosing(closing);
                setIsEditing(true);
              }}
              aria-label="Edit surat ucapan"
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ubah</span>
            </button>
          </div>
        </div>

        {/* Letter paper container */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div>
              <label htmlFor="edit-greeting" className="block text-xs font-bold text-pink-800 mb-1">
                Salam Pembuka
              </label>
              <input
                id="edit-greeting"
                type="text"
                value={editGreeting}
                onChange={(e) => setEditGreeting(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-body" className="block text-xs font-bold text-pink-800 mb-1">
                Isi Surat / Pesan Ulang Tahun
              </label>
              <textarea
                id="edit-body"
                rows={5}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 text-sm leading-relaxed"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-closing" className="block text-xs font-bold text-pink-800 mb-1">
                Penutup & Harapan
              </label>
              <input
                id="edit-closing"
                type="text"
                value={editClosing}
                onChange={(e) => setEditClosing(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/50 text-sm font-medium"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-2 px-4 rounded-xl border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-50 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Batal
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-md hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Simpan Perubahan
              </button>
            </div>
          </form>
        ) : (
          <div className="relative">
            {/* Visual envelope tab / toggle */}
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={toggleEnvelope}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-pink-100/70 py-1 px-3 rounded-full transition-colors"
              >
                {isOpen ? 'Lipat Surat 📩' : 'Buka Surat 💌'}
              </button>
            </div>

            {isOpen ? (
              <div className="relative bg-gradient-to-b from-[#fffafc] to-[#fff5f8] p-6 sm:p-8 rounded-2xl border border-pink-200 shadow-inner">
                {/* Washi tape visual on top */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-pink-200/80 rounded-sm rotate-1 shadow-xs border-dashed border border-pink-300/60 pointer-events-none" />

                {/* Decorative heart stamp */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-dashed border-pink-300 flex items-center justify-center opacity-60">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-300" />
                </div>

                <div className="space-y-4 text-slate-800">
                  <p className="text-xl sm:text-2xl font-bold text-pink-700 font-handwriting tracking-wide">
                    {greeting}
                  </p>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line font-normal">
                    {bodyText}
                  </p>

                  <p className="text-sm sm:text-base font-semibold text-pink-800 pt-2">
                    {closing}
                  </p>

                  <div className="pt-4 flex justify-between items-end border-t border-pink-100">
                    <span className="text-xs text-pink-400 italic">Dari sahabatmu yang lagi kangen ✨</span>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Sahabatmu,</span>
                      <span className="text-xl sm:text-2xl font-bold text-pink-700 font-handwriting">{senderName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={toggleEnvelope}
                className="w-full py-10 bg-gradient-to-tr from-pink-200 to-rose-100 rounded-2xl border-2 border-dashed border-pink-300 flex flex-col items-center justify-center gap-2 group hover:bg-pink-100 transition-all shadow-inner"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-pink-300 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-400" />
                </div>
                <span className="text-sm font-bold text-pink-800">Surat tertutup rapi — Klik untuk membacanya</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
