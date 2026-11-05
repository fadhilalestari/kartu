export interface BirthdayProfile {
  name: string;
  nickname: string;
  age: number;
  birthDate: string;
  relation: string;
  avatarUrl: string;
  themeTitle: string;
  letterGreeting: string;
  letterBody: string;
  letterClosing: string;
  letterSignature: string;
}

export type BackgroundStyle = 'dreamy-hearts' | 'rose-petals' | 'bubble-balloons' | 'aurora-pink' | 'sparkle-stars';

export interface BackgroundConfig {
  style: BackgroundStyle;
  speed: number; // 0.5 to 2
  density: number; // 20 to 80
  interactive: boolean;
}

export interface Wish {
  id: string;
  author: string;
  avatar: string;
  message: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  tag: 'Bestie' | 'Doa Tulus' | 'Kocak' | 'Sweet';
  cardColor: 'pink' | 'rose' | 'lavender' | 'peach';
}

export interface MemoryPhoto {
  id: string;
  title: string;
  caption: string;
  date: string;
  url: string;
  rotation: number; // e.g. -4 to +4 deg
}

export interface MysteryGift {
  id: string;
  title: string;
  icon: string;
  surprise: string;
  subtext: string;
  isOpened: boolean;
}
