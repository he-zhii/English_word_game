import React, { memo } from 'react';

export const LetterPool = memo(function LetterPool({
  shuffledLetters,
  isCompleted,
  onLetterClick
}) {
  if (isCompleted) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8 min-h-[4rem]">
      {shuffledLetters.map(letter => (
        <button
          key={letter.id}
          onClick={() => onLetterClick(letter)}
          disabled={letter.isUsed}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-xl font-bold text-xl md:text-2xl touch-manipulation ${
            letter.isUsed
              ? 'opacity-0'
              : 'bg-yellow-400 text-yellow-900 shadow-md active:scale-95'
          }`}
        >
          {letter.char}
        </button>
      ))}
    </div>
  );
});

export default LetterPool;