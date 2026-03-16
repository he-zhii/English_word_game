import React from 'react';
import { BookX, Zap, Gamepad2 } from 'lucide-react';

export function SpecialModes({ dueCount, onNotebookClick, onBrawlClick }) {
  return (
    <div className="max-w-4xl mx-auto mb-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        onClick={onNotebookClick}
        className={`relative bg-white rounded-3xl p-6 shadow-lg border-2 border-red-100 cursor-pointer hover:scale-[1.02] transition flex items-center gap-4 ${dueCount === 0 ? 'opacity-70 grayscale' : ''}`}
      >
        <div className="bg-red-100 p-4 rounded-full">
          <BookX className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">单词加油站</h3>
          <p className="text-sm text-gray-500">
            {dueCount > 0 ? `有 ${dueCount} 个单词需要复习` : '暂时没有需要复习的单词'}
          </p>
        </div>
        {dueCount > 0 && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            {dueCount}
          </span>
        )}
      </div>

      <div
        onClick={onBrawlClick}
        className="relative bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 shadow-lg cursor-pointer hover:scale-[1.02] transition flex items-center gap-4 text-white overflow-hidden"
      >
        <div className="absolute right-[-20px] top-[-20px] opacity-20">
          <Gamepad2 className="w-32 h-32" />
        </div>
        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
          <Zap className="w-8 h-8 text-yellow-300" />
        </div>
        <div className="z-10">
          <h3 className="text-xl font-bold flex items-center gap-2">
            全明星大乱斗
            <span className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded font-bold">30词</span>
          </h3>
          <p className="text-sm text-indigo-100">随机抽取，极速挑战！</p>
        </div>
      </div>
    </div>
  );
}

export default SpecialModes;