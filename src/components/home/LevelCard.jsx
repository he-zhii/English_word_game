import React from 'react';
import { getCurrentLevel, getNextLevel, getLevelProgress } from '../../data/levels';

export function LevelCard({ totalScore }) {
  if (totalScore === undefined) return null;

  const currentLevel = getCurrentLevel(totalScore);
  const nextLevel = getNextLevel(totalScore);
  const progress = getLevelProgress(totalScore);

  return (
    <div className="max-w-4xl mx-auto mb-6 px-4 animate-fade-in-up">
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 shadow-lg border-2 border-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-float">{currentLevel.icon}</span>
            <div>
              <h3 className="font-bold text-gray-800">Lv.{currentLevel.level} {currentLevel.name}</h3>
              <p className="text-xs text-gray-500">当前积分：{totalScore}</p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-right">
              <p className="text-sm text-gray-600">下一等级</p>
              <p className="font-bold text-purple-600">{nextLevel.icon} {nextLevel.name}</p>
              <p className="text-xs text-gray-500">还需 {nextLevel.minScore - totalScore} 分</p>
            </div>
          )}
        </div>
        <div className="bg-white/50 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-full transition-all duration-500 animate-glow-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default LevelCard;