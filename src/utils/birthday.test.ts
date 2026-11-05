import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWish, filterWishes, calculateAge, getCakeCandleCount } from './birthdayLogic';
import { Wish } from '../types/birthday';

test('validateWish rejects empty author or message', () => {
  assert.equal(validateWish('', 'Happy birthday!').isValid, false);
  assert.equal(validateWish('Budi', '').isValid, false);
  assert.equal(validateWish('   ', '   ').isValid, false);
});

test('validateWish accepts valid birthday greeting', () => {
  const result = validateWish('Dila', 'Semoga panjang umur dan sukses selalu!');
  assert.equal(result.isValid, true);
  assert.equal(result.error, undefined);
});

test('validateWish rejects excessively long inputs', () => {
  const longAuthor = 'A'.repeat(35);
  const longMessage = 'B'.repeat(305);
  assert.equal(validateWish(longAuthor, 'Valid message').isValid, false);
  assert.equal(validateWish('Valid Author', longMessage).isValid, false);
});

test('filterWishes filters by tag and search query', () => {
  const dummyWishes: Wish[] = [
    {
      id: '1',
      author: 'Alya',
      avatar: '🌸',
      message: 'Happy birthday bestie kesayangan!',
      timestamp: 'Baru saja',
      likes: 5,
      tag: 'Bestie',
      cardColor: 'pink'
    },
    {
      id: '2',
      author: 'Rian',
      avatar: '✨',
      message: 'Semoga berkah umurnya dan tercapai cita-citanya',
      timestamp: '1 jam lalu',
      likes: 2,
      tag: 'Doa Tulus',
      cardColor: 'rose'
    },
    {
      id: '3',
      author: 'Dimas',
      avatar: '🍰',
      message: 'Traktirannya jangan lupa ya!',
      timestamp: '2 jam lalu',
      likes: 8,
      tag: 'Kocak',
      cardColor: 'peach'
    }
  ];

  // Tag filter
  const besties = filterWishes(dummyWishes, 'Bestie', '');
  assert.equal(besties.length, 1);
  assert.equal(besties[0].author, 'Alya');

  // Search filter
  const searchResults = filterWishes(dummyWishes, 'All', 'traktir');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].author, 'Dimas');

  // All matches
  const allWishes = filterWishes(dummyWishes, 'All', '');
  assert.equal(allWishes.length, 3);
});

test('calculateAge computes age accurately', () => {
  const refDate = new Date(2026, 10, 5); // 5 Nov 2026
  const age = calculateAge('2004-11-05', refDate);
  assert.equal(age, 22);

  const youngerAge = calculateAge('2004-12-01', refDate);
  assert.equal(youngerAge, 21);
});

test('getCakeCandleCount returns bounded candle count', () => {
  assert.equal(getCakeCandleCount(3), 3);
  assert.equal(getCakeCandleCount(5), 5);
  assert.equal(getCakeCandleCount(25), 5);
});
