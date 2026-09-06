import { BOOKS_CONFIG } from '../data/books';
import { lettersOf, wordKey } from './model.mjs';

export function loadCatalog() {
  return BOOKS_CONFIG.map(book => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(`spelling_words_${book.id}_v12.0`)) || {}; } catch { /* Default content remains available. */ }
    return { ...book, units: book.units.map(unit => {
      const defaults = book.words[unit.id] || [];
      const entries = new Map(defaults.map(word => [wordKey(word.word), word]));
      for (const word of Array.isArray(saved[unit.id]) ? saved[unit.id] : []) {
        if (word && typeof word.word === 'string' && typeof word.cn === 'string') {
          entries.set(wordKey(word.word), { ...entries.get(wordKey(word.word)), ...word });
        }
      }
      return { ...unit, words: [...entries.values()].filter(word => word.isActive !== false && lettersOf(word.word).length)
        .map(word => ({ ...word, id: `${book.id}:${unit.id}:${wordKey(word.word)}`, unitId: unit.id })) };
    }) };
  });
}
