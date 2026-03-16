import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function GameLayout({
  mode,
  isMistakeMode,
  score,
  onBack,
  children
}) {
  const modeLabel = mode === 'dictation' ? '📝 默写测验' : '👀 看图练习';

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-slate-50">
      <div className={`p-4 flex justify-between items-center shadow-md relative z-10 transition-colors duration-500 ${isMistakeMode ? 'bg-red-500' : 'bg-indigo-500'} text-white`}>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 font-bold bg-white/20 px-3 py-1 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" /> 返回
          </button>
          <span className="text-xs font-semibold px-2 py-1 bg-white/20 rounded-lg hidden md:inline-block">
            {modeLabel}
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-white/20 px-4 py-1 rounded-full">
          <span className="font-bold text-lg text-yellow-300">⭐ {score}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pb-20">
        <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl border-4 border-slate-100 overflow-hidden relative min-h-[400px] flex flex-col">
          {children}
        </div>
      </div>

      <style>{`
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default GameLayout;