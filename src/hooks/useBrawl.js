import { useCallback, useState } from 'react';
import { getBrawlProgress, saveBrawlProgress, clearBrawlProgress } from '../utils/storage';
import { shuffleArray } from '../utils/helpers';

export function useBrawl(bookId, getAllActiveWords) {
  const [brawlState, setBrawlState] = useState(() => getBrawlProgress(bookId));

  const startNewBrawl = useCallback(() => {
    const allWords = getAllActiveWords();
    
    if (allWords.length === 0) {
      return { success: false, error: 'no_words' };
    }

    const brawlWords = shuffleArray(allWords).slice(0, 30);
    const newState = { 
      words: brawlWords, 
      currentIndex: 0, 
      score: 0 
    };
    
    saveBrawlProgress(bookId, newState);
    setBrawlState(newState);
    
    return { success: true, state: newState };
  }, [bookId, getAllActiveWords]);

  const updateBrawlProgress = useCallback((updates) => {
    setBrawlState(prev => {
      if (!prev) return null;
      const newState = { ...prev, ...updates };
      saveBrawlProgress(bookId, newState);
      return newState;
    });
  }, [bookId]);

  const endBrawl = useCallback(() => {
    clearBrawlProgress(bookId);
    setBrawlState(null);
  }, [bookId]);

  const hasProgress = useCallback(() => {
    return brawlState !== null && brawlState.words && brawlState.words.length > 0;
  }, [brawlState]);

  const getProgressInfo = useCallback(() => {
    if (!brawlState) return null;
    return {
      currentIndex: brawlState.currentIndex,
      totalWords: brawlState.words.length,
      score: brawlState.score,
      progress: brawlState.words.length > 0 
        ? Math.round((brawlState.currentIndex / brawlState.words.length) * 100) 
        : 0
    };
  }, [brawlState]);

  const resumeBrawl = useCallback(() => {
    const saved = getBrawlProgress(bookId);
    if (saved) {
      setBrawlState(saved);
      return true;
    }
    return false;
  }, [bookId]);

  return {
    brawlState,
    setBrawlState,
    startNewBrawl,
    updateBrawlProgress,
    endBrawl,
    hasProgress,
    getProgressInfo,
    resumeBrawl
  };
}

export default useBrawl;