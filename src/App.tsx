import React, { useState, useEffect } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { SurpriseModal } from './components/SurpriseModal';
import { HeroBirthday } from './components/HeroBirthday';
import { BirthdayCake } from './components/BirthdayCake';
import { LetterEnvelope } from './components/LetterEnvelope';
import { PolaroidGallery } from './components/PolaroidGallery';
import { MysteryPresents } from './components/MysteryPresents';
import { FloatingControls } from './components/FloatingControls';
import { PersonalizeModal } from './components/PersonalizeModal';
import { BirthdayProfile, BackgroundConfig, MemoryPhoto } from './types/birthday';
import { Heart } from 'lucide-react';

const AYA_PHOTO_URL = '/assets/aistudio/foto_aya_8779ef9a.jpeg';

const DEFAULT_PROFILE: BirthdayProfile = {
  name: 'Ayaa',
  nickname: 'Ayaa',
  age: 19,
  birthDate: '2007-11-05',
  relation: 'Sahabat tersayang 💕',
  avatarUrl: AYA_PHOTO_URL,
  themeTitle: 'Happy 19th Birthday Ayaa',
  letterGreeting: 'Hai Ayaaa! 🌸',
  letterBody: `Happy 19th birthday yaa Ayaa! 🎂✨

Sedih banget ultah kali ini kita lagi LDR-an dan belum bisa ketemu langsung buat ngerayain bareng. Tapi gapapa, dari jauh aku tetep doain yang terbaik buat kamu.

Makasih yaa udah selalu ada, udah jadi temen curhat yang baik, dan selalu nemenin hari-hari aku walau sekarang kebanyakan lewat chat atau call. Di umur 19 ini semoga urusan kamu dilancarin semua, sehat-sehat terus di sana, dan apa yang kamu pengenin pelan-pelan kecapai.

Jangan lupa traktirannya pas kita ketemu nanti yaa wkwk. Kangen bgt peluk kamu, Ayaa! 💖`,
  letterClosing: 'Sehat dan bahagia selalu yaa Ayaa!',
  letterSignature: 'Sahabatmu',
};

const DEFAULT_PHOTOS: MemoryPhoto[] = [
  {
    id: 'p1',
    title: 'Muka Jamkos 😭',
    caption: 'Pas jamkos gabut banget terus foto muka jelek wkwk',
    date: 'Di kelas',
    url: '/assets/aistudio/foto_aku_samaaya_48c24374.jpeg',
    rotation: -2.5,
  },
  {
    id: 'p2',
    title: 'Melet Mulu 🤪',
    caption: 'Heran tiap selfie pasti melet, ga pernah bisa bener',
    date: 'Seragam putih',
    url: '/assets/aistudio/WhatsApp_Image_2026-11-05_at_21.52.50_ddbf2362.jpeg',
    rotation: 2.5,
  },
  {
    id: 'p3',
    title: 'Rame-Ramean 💖',
    caption: 'Kangen kumpul begini, nanti pas ketemu harus foto lagi ya!',
    date: 'Bareng-bareng',
    url: '/assets/aistudio/WhatsApp_Image_2026-11-05_at_21.53.10_298e7184.jpeg',
    rotation: -1.5,
  },
];

export default function App() {
  // Check ?autostart=1 query param (ultra-mode requirement)
  const isAutostart = new URLSearchParams(window.location.search).get('autostart') === '1';

  const [showSurprise, setShowSurprise] = useState(!isAutostart);
  const [profile, setProfile] = useState<BirthdayProfile>(() => {
    const saved = localStorage.getItem('birthday_profile_ayaa_v8');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [bgConfig, setBgConfig] = useState<BackgroundConfig>({
    style: 'dreamy-hearts',
    speed: 1.0,
    density: 45,
    interactive: true,
  });

  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    const saved = localStorage.getItem('birthday_photos_ayaa_v8');
    return saved ? JSON.parse(saved) : DEFAULT_PHOTOS;
  });

  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('birthday_profile_ayaa_v8', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('birthday_photos_ayaa_v8', JSON.stringify(photos));
  }, [photos]);

  const handleUpdateLetter = (updated: { greeting: string; bodyText: string; closing: string }) => {
    setProfile((prev) => ({
      ...prev,
      letterGreeting: updated.greeting,
      letterBody: updated.bodyText,
      letterClosing: updated.closing,
    }));
  };

  const handleAddPhoto = (photo: MemoryPhoto) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-800">
      {/* Dynamic Animated Canvas & CSS Background with Moving Pink Hearts, Balloons & Sparkles */}
      <AnimatedBackground config={bgConfig} />

      {/* Intro Surprise Gift Box Modal (unboxing experience) */}
      {showSurprise && (
        <SurpriseModal
          friendName={profile.nickname || profile.name}
          onOpen={() => setShowSurprise(false)}
        />
      )}

      {/* Main Birthday App Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28">
        {/* Navigation Bar / Branding */}
        <nav aria-label="Menu Utama" className="flex items-center justify-between py-3 mb-4">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/90 shadow-xs">
            <span className="text-pink-500 text-base">🌸</span>
            <span className="text-xs sm:text-sm font-bold text-pink-900 tracking-tight">
              Birthday Buat {profile.nickname || profile.name} ✨
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPersonalizeOpen(true)}
              className="text-xs font-bold text-pink-700 bg-white/80 hover:bg-pink-100/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>✏️ Ganti Data</span>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <HeroBirthday
          profile={profile}
          onOpenPersonalize={() => setIsPersonalizeOpen(true)}
          onScrollToSection={scrollToSection}
        />

        {/* Birthday Cake Section (Blow out candles) */}
        <div id="cake-section">
          <BirthdayCake friendName={profile.nickname || profile.name} age={profile.age} />
        </div>

        {/* Heartfelt Love Letter Section */}
        <div id="letter-section">
          <LetterEnvelope
            friendName={profile.nickname || profile.name}
            senderName={profile.letterSignature}
            greeting={profile.letterGreeting}
            bodyText={profile.letterBody}
            closing={profile.letterClosing}
            onUpdateLetter={handleUpdateLetter}
          />
        </div>

        {/* Mystery Presents / Interactive Mini Game */}
        <div id="mystery-section">
          <MysteryPresents />
        </div>

        {/* Polaroid Memory Photo Gallery */}
        <div id="gallery-section">
          <PolaroidGallery
            photos={photos}
            onAddPhoto={handleAddPhoto}
          />
        </div>

        {/* Sweet Closing Footer */}
        <footer className="mt-16 text-center py-8 border-t border-pink-200/60">
          <div className="flex items-center justify-center gap-1.5 text-xs text-pink-700 font-semibold mb-2">
            <span>Dibuat khusus buat</span>
            <span className="text-pink-600 font-bold">{profile.name}</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse inline" />
          </div>
          <p className="text-xs text-pink-500/80 font-medium">
            Happy 19th Birthday Ayaa! Semoga seneng yaa sama website ini ✨
          </p>
        </footer>
      </div>

      {/* Floating Bottom Music & Background Moving Controls */}
      <FloatingControls
        bgConfig={bgConfig}
        onChangeBgConfig={(patch) => setBgConfig((prev) => ({ ...prev, ...patch }))}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
      />

      {/* Personalize Profile Modal */}
      {isPersonalizeOpen && (
        <PersonalizeModal
          profile={profile}
          onSave={(updated) => setProfile(updated)}
          onClose={() => setIsPersonalizeOpen(false)}
        />
      )}
    </div>
  );
}
