import { useState, useEffect, useCallback, useMemo } from 'react';
import { getBookById } from '../data/books';
import { getStoredWordsData, saveWordsData } from '../utils/storage';
import { preloadWords } from '../utils/audio';

export function useGameData(bookId) {
  const [allWordsData, setAllWordsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const currentBook = useMemo(() => getBookById(bookId), [bookId]);

  const loadWordsData = useCallback(() => {
    if (!bookId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const storedWords = getStoredWordsData(bookId);
    const book = getBookById(bookId);
    const normalized = {};

    if (book && book.words) {
      Object.keys(book.words).forEach(unitId => {
        const defaultUnitWords = book.words[unitId].map(w => ({ 
          ...w, 
          isActive: w.isActive !== false 
        }));
        const storedUnitWords = storedWords?.[unitId] || [];

        const storedActiveMap = {};
        storedUnitWords.forEach(w => {
          storedActiveMap[w.word] = w.isActive;
        });

        normalized[unitId] = defaultUnitWords.map(w => ({
          ...w,
          isActive: Object.prototype.hasOwnProperty.call(storedActiveMap, w.word) 
            ? storedActiveMap[w.word] 
            : w.isActive
        }));
      });
    }

    setAllWordsData(normalized);
    saveWordsData(bookId, normalized);
    
    const allWords = Object.values(normalized).flat();
    preloadWords(allWords.slice(0, 20));
    
    setIsLoading(false);
  }, [bookId]);

  useEffect(() => {
    loadWordsData();
  }, [loadWordsData]);

  const updateUnitWords = useCallback((unitId, words) => {
    setAllWordsData(prev => {
      const updated = { ...prev, [unitId]: words };
      saveWordsData(bookId, updated);
      return updated;
    });
  }, [bookId]);

  const getActiveWords = useCallback((unitId) => {
    const unitWords = allWordsData[unitId] || [];
    return unitWords.filter(w => w.isActive !== false);
  }, [allWordsData]);

  const getAllActiveWords = useCallback(() => {
    return Object.values(allWordsData)
      .flat()
      .filter(w => w.isActive !== false);
  }, [allWordsData]);

  const getUnitWordCount = useCallback((unitId) => {
    return (allWordsData[unitId] || []).filter(w => w.isActive !== false).length;
  }, [allWordsData]);

  return {
    allWordsData,
    isLoading,
    currentBook,
    loadWordsData,
    updateUnitWords,
    getActiveWords,
    getAllActiveWords,
    getUnitWordCount
  };
}

export default useGameData;