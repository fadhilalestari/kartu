import React, { useState } from 'react';
import { Camera, Plus, X, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MemoryPhoto } from '../types/birthday';
import { soundManager } from '../utils/audioSynthesizer';

interface PolaroidGalleryProps {
  photos: MemoryPhoto[];
  onAddPhoto: (photo: MemoryPhoto) => void;
  onRemovePhoto?: (id: string) => void;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({
  photos,
  onAddPhoto,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewError, setPreviewError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPreviewError('Mohon pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPreviewError('Ukuran gambar maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
      setPreviewError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setPreviewError('Silakan pilih foto atau masukkan URL gambar');
      return;
    }

    const newPhoto: MemoryPhoto = {
      id: Date.now().toString(),
      title: title.trim() || 'Foto Bareng',
      caption: caption.trim() || 'Foto seru bareng Ayaa ✨',
      date: 'Hari ini',
      url: imageUrl,
      rotation: (Math.random() - 0.5) * 6,
    };

    onAddPhoto(newPhoto);
    soundManager.playChimeSparkle();
    setIsAdding(false);
    setTitle('');
    setCaption('');
    setImageUrl('');
  };

  return (
    <section aria-labelledby="gallery-heading" className="w-full max-w-4xl mx-auto my-10">
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-pink-200/90 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-pink-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-5 h-5 text-pink-500" />
              <h2 id="gallery-heading" className="text-xl sm:text-2xl font-black text-pink-900 tracking-tight">
                Foto Bareng Ayaa 📸
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-pink-700/80 font-medium">
              Foto-foto lama kita di galeri
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAdding(true);
              soundManager.playHeartSound();
            }}
            className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Foto 📸</span>
          </button>
        </div>

        {/* Polaroid Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => {
                setSelectedPhoto(photo);
                soundManager.playHeartSound();
              }}
              style={{
                transform: `rotate(${photo.rotation}deg)`,
              }}
              className="group cursor-pointer bg-white p-3 pb-5 rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-0 max-w-[260px] w-full border border-pink-100 relative"
            >
              {/* Cute Washi Tape at Top */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-pink-200/80 backdrop-blur-xs shadow-xs rounded-xs border-dashed border border-pink-300/70 rotate-[-2deg] pointer-events-none" />

              {/* Photo Image Frame */}
              <div className="relative aspect-square w-full rounded-xs overflow-hidden bg-pink-50 flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to cute illustration placeholder if link fails
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-pink-600 text-xs font-bold py-1 px-2 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-500" /> Lihat
                  </span>
                </div>
              </div>

              {/* Handwritten Note Area */}
              <div className="pt-3 text-center px-1">
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug">
                  {photo.title}
                </h3>
                <p className="text-xs text-pink-600 font-medium leading-relaxed mt-1">
                  {photo.caption}
                </p>
                <span className="text-[10px] text-pink-400 font-semibold block mt-1.5">
                  {photo.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox for enlarged photo */}
        {selectedPhoto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Detail Foto Kenangan"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-lg w-full bg-white rounded-3xl p-6 shadow-2xl border-4 border-pink-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Tutup detail foto"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="rounded-2xl overflow-hidden aspect-4/3 bg-pink-50 mb-4 max-h-[360px] flex items-center justify-center">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-pink-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <Heart className="w-3.5 h-3.5 fill-pink-500" />
                  <span>{selectedPhoto.date}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Memory Photo */}
        {isAdding && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tambah Foto Kenangan Baru"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <div className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border-2 border-pink-200">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                aria-label="Tutup formulir foto"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-bold text-pink-900">
                  Tambah Momen Kenangan
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-pink-800 mb-1">
                    Upload Foto dari Perangkat
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 cursor-pointer"
                  />
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-pink-100 w-full" />
                  <span className="bg-white px-2 text-[10px] text-pink-400 font-bold uppercase">Atau Pakai URL</span>
                </div>

                <div>
                  <label htmlFor="photo-url" className="block text-xs font-bold text-pink-800 mb-1">
                    URL Gambar
                  </label>
                  <input
                    id="photo-url"
                    type="url"
                    placeholder="https://..."
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewError('');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {imageUrl && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-pink-300 mx-auto">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                {previewError && (
                  <p className="text-xs text-rose-500 font-semibold">{previewError}</p>
                )}

                <div>
                  <label htmlFor="photo-title" className="block text-xs font-bold text-pink-800 mb-1">
                    Judul Foto
                  </label>
                  <input
                    id="photo-title"
                    type="text"
                    placeholder="Contoh: Pas di kelas"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="photo-caption" className="block text-xs font-bold text-pink-800 mb-1">
                    Caption
                  </label>
                  <input
                    id="photo-caption"
                    type="text"
                    placeholder="Contoh: Lucu banget pas ini wkwk"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="py-2 px-4 rounded-xl border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-md hover:from-pink-600 hover:to-rose-600"
                  >
                    Simpan Foto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
