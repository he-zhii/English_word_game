import { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { shuffleArray } from '../../../utils/helpers';
import { playWordAudio, playSuccessChime, playErrorSound, playClickSound, playHintSound } from '../../../utils/audio';
import { updateGlobalScore, addMistake, updateMistakeProgress } from '../../../utils/storage';

export function useGameLogic({
  words,
  mode,
  isMistakeMode,
  initialIndex,
  initialScore,
  preShuffled,
  bookId,
  onUpdateStats,
  onProgressUpdate
}) {
  const activeWords = useMemo(() => {
    return isMistakeMode || mode === 'brawl' ? words : words.filter(w => w.isActive !== false);
  }, [words, isMistakeMode, mode]);

  const workingWords = useMemo(() => {
    if (activeWords.length === 0) return [];
    if (preShuffled) return activeWords;
    return shuffleArray(Array.isArray(activeWords) ? activeWords : Object.values(activeWords));
  }, [activeWords, preShuffled]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [graduatedAnimation, setGraduatedAnimation] = useState(false);
  const [brawlMistakes, setBrawlMistakes] = useState(0);

  const lastWordRef = useRef(null);
  const audioPlayedRef = useRef(false);

  const currentWordObj = workingWords[currentIndex];

  const initWord = useCallback((wordObj) => {
    if (!wordObj) return;
    const phrase = wordObj.word;
    const lettersOnly = phrase.replace(/\s/g, '').split('');
    const letterObjs = lettersOnly.map((char, i) => ({
      id: `${char}-${i}-${Math.random()}`,
      char: char,
      isUsed: false
    }));
    setShuffledLetters(shuffleArray(letterObjs));
    setPlacedLetters(
      phrase.split('').map((char, i) =>
        char === ' ' ? { char: ' ', isSpace: true, id: `space-${i}` } : null
      )
    );
    setIsCompleted(false);
    setShowHint(false);
    setGraduatedAnimation(false);
  }, []);

  useLayoutEffect(() => {
    if (currentWordObj && currentWordObj.word !== lastWordRef.current) {
      initWord(currentWordObj);
      lastWordRef.current = currentWordObj.word;
      audioPlayedRef.current = false;
    }
  }, [currentWordObj, initWord]);

  useEffect(() => {
    if (mode === 'brawl' && onProgressUpdate) {
      onProgressUpdate({ words: workingWords, currentIndex, score });
    }
  }, [currentIndex, score, mode, workingWords, onProgressUpdate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isDictation = mode === 'dictation';
      if (!audioPlayedRef.current && currentWordObj && !graduatedAnimation && !isDictation) {
        playWordAudio(currentWordObj.word);
        audioPlayedRef.current = true;
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [currentIndex, currentWordObj, graduatedAnimation, mode]);

  const checkAnswer = useCallback((finalPlaced) => {
    if (!currentWordObj) return;

    const userPhrase = finalPlaced.map(l => l.char).join('');
    if (userPhrase === currentWordObj.word) {
      setIsCompleted(true);
      playSuccessChime();

      if (isMistakeMode) {
        const res = updateMistakeProgress(bookId, currentWordObj.word, true);
        if (res === 'graduated') {
          setGraduatedAnimation(true);
        } else {
          setScore(s => s + 10);
          updateGlobalScore(bookId, 10);
        }
      } else {
        setScore(s => s + 10);
        updateGlobalScore(bookId, 10);
      }
      onUpdateStats('win', showHint);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      playErrorSound();

      if (mode === 'brawl') {
        setBrawlMistakes(m => m + 1);
      }
      onUpdateStats('mistake');

      if (isMistakeMode) {
        updateMistakeProgress(bookId, currentWordObj.word, false);
      } else {
        addMistake(bookId, currentWordObj);
      }
    }
  }, [currentWordObj, isMistakeMode, bookId, onUpdateStats, showHint, mode]);

  const handleLetterClick = useCallback((item) => {
    if (isCompleted || item.isUsed) return;

    const idx = placedLetters.findIndex(l => l === null);
    if (idx === -1) return;

    const newShuffled = shuffledLetters.map(l =>
      l.id === item.id ? { ...l, isUsed: true } : l
    );
    const newPlaced = [...placedLetters];
    newPlaced[idx] = item;

    setShuffledLetters(newShuffled);
    setPlacedLetters(newPlaced);
    playClickSound();

    if (newPlaced.every(l => l !== null)) {
      checkAnswer(newPlaced);
    }
  }, [isCompleted, placedLetters, shuffledLetters, checkAnswer]);

  const handleSlotClick = useCallback((idx) => {
    if (isCompleted || !placedLetters[idx] || placedLetters[idx].isSpace) return;

    const item = placedLetters[idx];
    const newPlaced = [...placedLetters];
    newPlaced[idx] = null;

    setPlacedLetters(newPlaced);
    setShuffledLetters(shuffledLetters.map(l =>
      l.id === item.id ? { ...l, isUsed: false } : l
    ));
  }, [isCompleted, placedLetters, shuffledLetters]);

  const handleSmartHint = useCallback(() => {
    if (isCompleted || !currentWordObj) return;

    const targetWord = currentWordObj.word;
    let errorIndex = -1;

    for (let i = 0; i < targetWord.length; i++) {
      const targetChar = targetWord[i];
      if (targetChar === ' ') continue;
      const currentPlaced = placedLetters[i];
      if (!currentPlaced || currentPlaced.char !== targetChar) {
        errorIndex = i;
        break;
      }
    }

    if (errorIndex === -1) return;

    const correctChar = targetWord[errorIndex];
    let nextPlaced = [...placedLetters];
    let nextShuffled = [...shuffledLetters];

    if (nextPlaced[errorIndex]) {
      const letterToRemove = nextPlaced[errorIndex];
      nextPlaced[errorIndex] = null;
      nextShuffled = nextShuffled.map(l =>
        l.id === letterToRemove.id ? { ...l, isUsed: false } : l
      );
    }

    let letterToPlace = nextShuffled.find(l => l.char === correctChar && !l.isUsed);

    if (!letterToPlace) {
      const stolenIndex = nextPlaced.findIndex((l, idx) =>
        l && l.char === correctChar && idx > errorIndex
      );
      if (stolenIndex !== -1) {
        letterToPlace = nextPlaced[stolenIndex];
        nextPlaced[stolenIndex] = null;
      }
    }

    if (letterToPlace) {
      nextPlaced[errorIndex] = letterToPlace;
      nextShuffled = nextShuffled.map(l =>
        l.id === letterToPlace.id ? { ...l, isUsed: true } : l
      );

      setPlacedLetters(nextPlaced);
      setShuffledLetters(nextShuffled);

      if (nextPlaced.every(l => l !== null)) {
        checkAnswer(nextPlaced);
      }
    }
  }, [isCompleted, currentWordObj, placedLetters, shuffledLetters, checkAnswer]);

  const handleHintTrigger = useCallback(() => {
    handleSmartHint();
    setShowHint(true);
    onUpdateStats('hint');
    playHintSound();
  }, [handleSmartHint, onUpdateStats]);

  const nextLevel = useCallback(() => {
    if (currentIndex < workingWords.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      if (mode === 'brawl') {
        onUpdateStats('brawl_complete', false, brawlMistakes);
      }
      return { finished: true };
    }
    return { finished: false };
  }, [currentIndex, workingWords.length, mode, onUpdateStats, brawlMistakes]);

  const playAudio = useCallback(() => {
    if (currentWordObj) {
      playWordAudio(currentWordObj.word);
    }
  }, [currentWordObj]);

  return {
    workingWords,
    currentIndex,
    currentWordObj,
    shuffledLetters,
    placedLetters,
    isCompleted,
    score,
    shake,
    showHint,
    graduatedAnimation,
    handleLetterClick,
    handleSlotClick,
    handleHintTrigger,
    nextLevel,
    playAudio
  };
}

export default useGameLogic;