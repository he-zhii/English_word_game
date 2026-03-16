export function validateWord(word) {
  if (!word || typeof word !== 'object') return false;
  if (typeof word.word !== 'string' || word.word.length === 0) return false;
  if (typeof word.cn !== 'string' || word.cn.length === 0) return false;
  if (!Array.isArray(word.syllables)) return false;
  return true;
}

export function validateUnit(unit) {
  if (!Array.isArray(unit)) return false;
  return unit.every(validateWord);
}

export function validateBookData(bookData) {
  if (!bookData || typeof bookData !== 'object') return false;
  
  const requiredFields = ['id', 'title', 'subtitle', 'units'];
  for (const field of requiredFields) {
    if (!bookData[field]) {
      console.warn(`Book data missing field: ${field}`);
      return false;
    }
  }

  if (!Array.isArray(bookData.units)) {
    console.warn('Book units must be an array');
    return false;
  }

  return true;
}

export function sanitizeWord(word) {
  return {
    word: String(word.word || '').trim(),
    cn: String(word.cn || '').trim(),
    emoji: word.emoji || '📝',
    syllables: Array.isArray(word.syllables) ? word.syllables : [word.word],
    isActive: word.isActive !== false
  };
}

export function sanitizeWords(words) {
  if (!Array.isArray(words)) return [];
  return words.filter(validateWord).map(sanitizeWord);
}

export function validateAndSanitizeUnit(unit) {
  if (!Array.isArray(unit)) return [];
  return unit
    .filter(word => {
      const isValid = validateWord(word);
      if (!isValid) {
        console.warn('Invalid word data:', word);
      }
      return isValid;
    })
    .map(sanitizeWord);
}

export default {
  validateWord,
  validateUnit,
  validateBookData,
  sanitizeWord,
  sanitizeWords,
  validateAndSanitizeUnit
};