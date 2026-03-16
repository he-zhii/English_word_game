import React, { useCallback } from 'react';
import { Volume2, Lightbulb, GraduationCap, Keyboard } from 'lucide-react';
import { getColor } from '../../utils/helpers';
import { useGameLogic } from './modes/useGameLogic';
import { GameLayout } from './GameLayout';
import { LetterBoard } from './LetterBoard';
import { LetterPool } from './LetterPool';
import { clearBrawlProgress } from '../../utils/storage';

export function GameScreen({
  words,
  mode,
  onBack,
  isMistakeMode = false,
  initialIndex = 0,
  initialScore = 0,
  preShuffled = false,
  onProgressUpdate,
  onUpdateStats,
  bookId,
  onComplete
}) {
  const logic = useGameLogic({
    words,
    mode,
    isMistakeMode,
    initialIndex,
    initialScore,
    preShuffled,
    bookId,
    onUpdateStats,
    onProgressUpdate
  });

  const {
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
  } = logic;

  const effectiveMode = mode === 'brawl' ? 'visual' : mode;
  const isDictation = effectiveMode === 'dictation';
  const shouldShowVisuals = effectiveMode === 'visual' || effectiveMode === 'notebook' || showHint || isCompleted || (isDictation && isCompleted);

  const handleNextLevel = useCallback(() => {
    const result = nextLevel();
    if (result?.finished) {
      if (mode === 'brawl') {
        clearBrawlProgress(bookId);
      }
      onComplete?.();
      onBack();
    }
  }, [nextLevel, mode, bookId, onBack, onComplete]);

  if (!currentWordObj) {
    return <div className="text-center p-10">加载中...</div>;
  }

  const graduationOverlay = graduatedAnimation && (
    <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center animate-fade-in-up">
      <GraduationCap className="w-24 h-24 text-yellow-500 mb-4 animate-bounce" />
      <h2 className="text-3xl font-bold">已掌握！</h2>
      <button
        onClick={handleNextLevel}
        className="mt-4 bg-green-500 text-white px-8 py-2 rounded-full font-bold"
      >
        下一关
      </button>
    </div>
  );

  const wordDisplay = (
    <div className="relative mb-6 text-center h-32 flex flex-col justify-center items-center w-full">
      {shouldShowVisuals ? (
        <div className="animate-fade-in-up">
          <div className={`text-6xl mb-2 transition-transform duration-300 ${isCompleted ? 'scale-110 rotate-6' : ''}`}>
            {currentWordObj.emoji}
          </div>
          <h2 className={`text-2xl font-bold tracking-widest ${getColor(logic.currentIndex)}`}>
            {currentWordObj.cn}
          </h2>
        </div>
      ) : (
        <div className="flex flex-col items-center animate-pulse cursor-pointer" onClick={handleHintTrigger}>
          <div className="text-6xl mb-2 text-slate-200">
            <Keyboard className="w-20 h-20 mx-auto" />
          </div>
          <h2 className={`text-2xl font-bold tracking-widest ${getColor(logic.currentIndex)}`}>
            {currentWordObj.cn}
          </h2>
          {isDictation && (
            <p className="text-xs text-slate-400 mt-2">(看中文默写，点击图标提示)</p>
          )}
        </div>
      )}
    </div>
  );

  const actionButtons = (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={playAudio}
        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-bold shadow-sm active:scale-95"
      >
        <Volume2 className="w-5 h-5" /> 听发音
      </button>
      {!isCompleted && (
        <button
          onClick={handleHintTrigger}
          className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full font-bold shadow-sm active:scale-95"
        >
          <Lightbulb className="w-5 h-5" /> 提示
        </button>
      )}
    </div>
  );

  const nextButton = isCompleted && !graduatedAnimation && (
    <div className="mt-8 pt-4 border-t border-slate-100 w-full flex justify-center">
      <button
        onClick={handleNextLevel}
        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all animate-pulse"
      >
        下一关 ➡️
      </button>
    </div>
  );

  return (
    <GameLayout
      mode={mode}
      isMistakeMode={isMistakeMode}
      score={score}
      onBack={onBack}
    >
      {graduationOverlay}

      <div className="p-4 flex flex-col items-center flex-1">
        {wordDisplay}
        {actionButtons}

        <LetterBoard
          placedLetters={placedLetters}
          isCompleted={isCompleted}
          shake={shake}
          onSlotClick={handleSlotClick}
        />

        <LetterPool
          shuffledLetters={shuffledLetters}
          isCompleted={isCompleted}
          onLetterClick={handleLetterClick}
        />

        {nextButton}
      </div>
    </GameLayout>
  );
}

export default GameScreen;