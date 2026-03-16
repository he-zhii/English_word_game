import React, { memo } from 'react';

export const LetterBoard = memo(function LetterBoard({
  placedLetters,
  isCompleted,
  shake,
  onSlotClick
}) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 min-h-[4rem] ${shake ? 'animate-shake' : ''}`}>
      {placedLetters.map((letter, index) => {
        if (letter?.isSpace) {
          return <div key={index} className="w-4" />;
        }

        const baseClasses = 'w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold rounded-xl border-b-4 cursor-pointer';
        let stateClasses = '';

        if (letter) {
          stateClasses = isCompleted
            ? 'bg-green-100 border-green-400 text-green-600'
            : 'bg-white border-blue-200 text-blue-600';
        } else {
          stateClasses = 'bg-slate-100 border-slate-200';
        }

        return (
          <div
            key={index}
            onClick={() => onSlotClick(index)}
            className={`${baseClasses} ${stateClasses}`}
          >
            {letter?.char}
          </div>
        );
      })}
    </div>
  );
});

export default LetterBoard;