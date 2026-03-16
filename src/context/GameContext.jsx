import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getCurrentBookId, setCurrentBookId as persistBookId,
  getGlobalScore, updateGlobalScore as persistScore,
  getStats, saveStats as persistStats,
  getSettings, saveSettings as persistSettings,
  getAchievements, saveAchievements as persistAchievements,
  getMistakes, getDueMistakesCount,
  getBrawlProgress, saveBrawlProgress, clearBrawlProgress
} from '../utils/storage';

const GameContext = createContext(null);

const DEFAULT_STATS = {
  totalWords: 0, totalScore: 0, totalMistakes: 0, totalHints: 0,
  currentStreak: 0, titleClicks: 0, brawlsCompleted: 0, perfectBrawls: 0
};

export function GameProvider({ children }) {
  const [currentBookId, setCurrentBookIdState] = useState(getCurrentBookId);
  const [stats, setStatsState] = useState(() => {
    const stored = getStats(getCurrentBookId());
    return stored || { ...DEFAULT_STATS, totalScore: getGlobalScore(getCurrentBookId()) };
  });
  const [settings, setSettingsState] = useState(() => getSettings());
  const [unlockedAchievements, setUnlockedAchievementsState] = useState(() => getAchievements());
  const [dueCount, setDueCount] = useState(0);
  const [brawlState, setBrawlState] = useState(() => getBrawlProgress(getCurrentBookId()));

  const setCurrentBookId = useCallback((bookId) => {
    persistBookId(bookId);
    setCurrentBookIdState(bookId);
    setBrawlState(getBrawlProgress(bookId));
  }, []);

  const updateStats = useCallback((bookId, updates) => {
    setStatsState(prev => {
      const next = { ...prev, ...updates };
      persistStats(bookId, next);
      return next;
    });
  }, []);

  const updateScore = useCallback((bookId, delta) => {
    const newScore = persistScore(bookId, delta);
    return newScore;
  }, []);

  const updateSettings = useCallback((newSettings) => {
    persistSettings(newSettings);
    setSettingsState(newSettings);
  }, []);

  const updateAchievements = useCallback((achievements) => {
    persistAchievements(achievements);
    setUnlockedAchievementsState(achievements);
  }, []);

  const refreshDueCount = useCallback(() => {
    setDueCount(getDueMistakesCount(currentBookId));
  }, [currentBookId]);

  const updateBrawlProgress = useCallback((bookId, state) => {
    saveBrawlProgress(bookId, state);
    setBrawlState(state);
  }, []);

  const clearBrawl = useCallback((bookId) => {
    clearBrawlProgress(bookId);
    setBrawlState(null);
  }, []);

  const loadBrawl = useCallback((bookId) => {
    const saved = getBrawlProgress(bookId);
    setBrawlState(saved);
    return saved;
  }, []);

  const loadStatsForBook = useCallback((bookId) => {
    const stored = getStats(bookId);
    if (stored) {
      setStatsState(stored);
    } else {
      setStatsState({ ...DEFAULT_STATS, totalScore: getGlobalScore(bookId) });
    }
  }, []);

  useEffect(() => {
    const checkDue = () => refreshDueCount();
    checkDue();
    const interval = setInterval(checkDue, 60000);
    return () => clearInterval(interval);
  }, [refreshDueCount]);

  const value = {
    currentBookId,
    setCurrentBookId,
    stats,
    setStatsState,
    updateStats,
    updateScore,
    settings,
    updateSettings,
    unlockedAchievements,
    updateAchievements,
    dueCount,
    refreshDueCount,
    brawlState,
    setBrawlState,
    updateBrawlProgress,
    clearBrawl,
    loadBrawl,
    loadStatsForBook
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

export default GameContext;