import { Wish } from '../types/birthday';

export function validateWish(author: string, message: string): { isValid: boolean; error?: string } {
  const trimmedAuthor = author.trim();
  const trimmedMessage = message.trim();

  if (!trimmedAuthor) {
    return { isValid: false, error: 'Nama pengirim tidak boleh kosong' };
  }
  if (trimmedAuthor.length > 30) {
    return { isValid: false, error: 'Nama pengirim maksimal 30 karakter' };
  }
  if (!trimmedMessage) {
    return { isValid: false, error: 'Pesan ucapan tidak boleh kosong' };
  }
  if (trimmedMessage.length < 3) {
    return { isValid: false, error: 'Pesan ucapan minimal 3 karakter' };
  }
  if (trimmedMessage.length > 300) {
    return { isValid: false, error: 'Pesan ucapan maksimal 300 karakter' };
  }

  return { isValid: true };
}

export function filterWishes(
  wishes: Wish[],
  activeTag: string,
  searchQuery: string
): Wish[] {
  return wishes.filter((wish) => {
    const matchesTag = activeTag === 'All' || wish.tag === activeTag;
    const matchesSearch =
      searchQuery.trim() === '' ||
      wish.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wish.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });
}

export function calculateAge(birthDateStr: string, currentDate: Date = new Date()): number {
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) {
    return 20; // fallback default
  }
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const m = currentDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(1, age);
}

export function getCakeCandleCount(age: number): number {
  // If age is between 1 and 7, use exact age; otherwise standard aesthetic tier of 5 candles with age badge
  if (age >= 1 && age <= 7) return age;
  return 5;
}
