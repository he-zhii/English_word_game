// 存储管理模块 - localStorage 操作封装

import { KEYS, MEMORY_INTERVALS } from '../constants';

const DEFAULT_BOOK_ID = 'grade3a';

export const getCurrentBookId = () => {
  try {
    return localStorage.getItem(KEYS.BOOK_ID) || DEFAULT_BOOK_ID;
  } catch (e) {
    return DEFAULT_BOOK_ID;
  }
};

export const setCurrentBookId = (bookId) => {
  localStorage.setItem(KEYS.BOOK_ID, bookId);
};

let cachedDefaultWords = {};
const getDefaultWordsData = async (bookId) => {
  if (cachedDefaultWords[bookId]) return cachedDefaultWords[bookId];
  const { getBookById } = await import('../data/books');
  const book = getBookById(bookId);
  if (book) {
    cachedDefaultWords[bookId] = book.words;
    return book.words;
  }
  return {};
};

export const getStoredWordsData = (bookId) => {
  try {
    const data = localStorage.getItem(KEYS.WORDS(bookId));
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error loading words data:", e);
  }
  return null;
};

export const initWordsData = async (bookId) => {
  const stored = getStoredWordsData(bookId);
  if (stored) return stored;

  const defaultWords = await getDefaultWordsData(bookId);
  const normalizedDefault = {};
  Object.keys(defaultWords).forEach(unitId => {
    normalizedDefault[unitId] = defaultWords[unitId].map(w => ({
      ...w,
      isActive: w.isActive !== false
    }));
  });
  return normalizedDefault;
};

export const saveWordsData = (bookId, data) => {
  localStorage.setItem(KEYS.WORDS(bookId), JSON.stringify(data));
};

export const getGlobalScore = (bookId) => {
  try {
    const val = parseInt(localStorage.getItem(KEYS.SCORE(bookId)) || '0', 10);
    return isNaN(val) ? 0 : val;
  } catch (e) { return 0; }
};

export const updateGlobalScore = (bookId, delta) => {
  const current = getGlobalScore(bookId);
  const newScore = current + delta;
  localStorage.setItem(KEYS.SCORE(bookId), newScore.toString());
  return newScore;
};

export const getMistakes = (bookId) => {
  try { return JSON.parse(localStorage.getItem(KEYS.MISTAKES(bookId)) || '{}'); } catch (e) { return {}; }
};

export const saveMistakes = (bookId, data) => localStorage.setItem(KEYS.MISTAKES(bookId), JSON.stringify(data));

export const addMistake = (bookId, wordObj) => {
  const db = getMistakes(bookId);
  if (!db[wordObj.word]) {
    db[wordObj.word] = { ...wordObj, stage: 0, nextReview: Date.now(), hearts: 0 };
    saveMistakes(bookId, db);
  } else {
    db[wordObj.word].stage = 0;
    db[wordObj.word].nextReview = Date.now();
    saveMistakes(bookId, db);
  }
};

export const updateMistakeProgress = (bookId, wordStr, isCorrect) => {
  const db = getMistakes(bookId);
  if (!db[wordStr]) return null;
  const word = db[wordStr];

  if (isCorrect) {
    const newStage = (word.stage || 0) + 1;
    if (newStage >= MEMORY_INTERVALS.length) {
      delete db[wordStr];
      saveMistakes(bookId, db);
      return 'graduated';
    } else {
      word.stage = newStage;
      word.nextReview = Date.now() + MEMORY_INTERVALS[newStage];
      word.hearts = (word.hearts || 0) + 1;
      saveMistakes(bookId, db);
      return 'improved';
    }
  } else {
    word.stage = 0;
    word.nextReview = Date.now();
    word.hearts = 0;
    saveMistakes(bookId, db);
    return 'reset';
  }
};

export const getDueMistakesCount = (bookId) => {
  const db = getMistakes(bookId);
  const now = Date.now();
  return Object.values(db).filter(w => w.nextReview <= now).length;
};

export const getBrawlProgress = (bookId) => {
  try { return JSON.parse(localStorage.getItem(KEYS.BRAWL(bookId))); } catch (e) { return null; }
};

export const saveBrawlProgress = (bookId, state) => localStorage.setItem(KEYS.BRAWL(bookId), JSON.stringify(state));

export const clearBrawlProgress = (bookId) => localStorage.removeItem(KEYS.BRAWL(bookId));

export const getStats = (bookId) => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.STATS(bookId))) || null;
  } catch (e) {
    return null;
  }
};

export const saveStats = (bookId, s) => localStorage.setItem(KEYS.STATS(bookId), JSON.stringify(s));

export const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || { enableHints: true, voiceType: 0 };
  } catch (e) {
    return { enableHints: true, voiceType: 0 };
  }
};

export const saveSettings = (s) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));

export const getAchievements = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.ACHIEVEMENTS)) || [];
  } catch (e) {
    return [];
  }
};

export const saveAchievements = (arr) => localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(arr));

const GLOBAL_STATS_KEY = 'spelling_global_stats_v12.0';

export const getGlobalStats = () => {
  try {
    return JSON.parse(localStorage.getItem(GLOBAL_STATS_KEY)) || {
      consecutiveDays: 0,
      lastStudyDate: null,
      totalSessionMinutes: 0
    };
  } catch (e) {
    return {
      consecutiveDays: 0,
      lastStudyDate: null,
      totalSessionMinutes: 0
    };
  }
};

export const saveGlobalStats = (stats) => localStorage.setItem(GLOBAL_STATS_KEY, JSON.stringify(stats));
