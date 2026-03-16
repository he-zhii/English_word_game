import { useCallback, useMemo } from 'react';
import { KEYS } from '../constants';

const keyCache = {};

const getCachedKey = (type, bookId) => {
  const cacheKey = `${type}_${bookId}`;
  if (!keyCache[cacheKey]) {
    keyCache[cacheKey] = KEYS[type](bookId);
  }
  return keyCache[cacheKey];
};

const clearKeyCache = () => {
  Object.keys(keyCache).forEach(key => delete keyCache[key]);
};

export function useStorage(bookId) {
  const wordsKey = useMemo(() => getCachedKey('WORDS', bookId), [bookId]);
  const mistakesKey = useMemo(() => getCachedKey('MISTAKES', bookId), [bookId]);
  const brawlKey = useMemo(() => getCachedKey('BRAWL', bookId), [bookId]);
  const statsKey = useMemo(() => getCachedKey('STATS', bookId), [bookId]);
  const scoreKey = useMemo(() => getCachedKey('SCORE', bookId), [bookId]);

  const getWords = useCallback(() => {
    try {
      const data = localStorage.getItem(wordsKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, [wordsKey]);

  const saveWords = useCallback((data) => {
    localStorage.setItem(wordsKey, JSON.stringify(data));
  }, [wordsKey]);

  const getMistakesData = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(mistakesKey) || '{}');
    } catch {
      return {};
    }
  }, [mistakesKey]);

  const saveMistakesData = useCallback((data) => {
    localStorage.setItem(mistakesKey, JSON.stringify(data));
  }, [mistakesKey]);

  const getBrawlData = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(brawlKey));
    } catch {
      return null;
    }
  }, [brawlKey]);

  const saveBrawlData = useCallback((data) => {
    localStorage.setItem(brawlKey, JSON.stringify(data));
  }, [brawlKey]);

  const getStatsData = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(statsKey));
    } catch {
      return null;
    }
  }, [statsKey]);

  const saveStatsData = useCallback((data) => {
    localStorage.setItem(statsKey, JSON.stringify(data));
  }, [statsKey]);

  const getScoreData = useCallback(() => {
    try {
      const val = parseInt(localStorage.getItem(scoreKey) || '0', 10);
      return isNaN(val) ? 0 : val;
    } catch {
      return 0;
    }
  }, [scoreKey]);

  const saveScoreData = useCallback((score) => {
    localStorage.setItem(scoreKey, score.toString());
  }, [scoreKey]);

  return {
    getWords,
    saveWords,
    getMistakesData,
    saveMistakesData,
    getBrawlData,
    saveBrawlData,
    getStatsData,
    saveStatsData,
    getScoreData,
    saveScoreData,
    clearKeyCache
  };
}

export default useStorage;