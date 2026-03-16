import React, { useEffect, useMemo } from 'react';
import { playLevelUpSound } from '../../utils/audio';

const CONFETTI_EMOJIS = ['✨', '⭐', '🌟', '💫', '🎉', '🎊'];

const generateRandom = (max) => Math.floor(Math.random() * max);

const generateConfettiConfig = () => Array.from({ length: 20 }, () => ({
  left: generateRandom(100),
  delay: generateRandom(50) / 100,
  duration: 1 + generateRandom(10) / 10,
  emoji: CONFETTI_EMOJIS[generateRandom(CONFETTI_EMOJIS.length)]
}));

export function LevelUpModal({ level, onClose }) {
  const confettiConfig = useMemo(() => generateConfettiConfig(), []);

  useEffect(() => {
    if (level) {
      playLevelUpSound();
    }
  }, [level]);

  if (!level) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-1 mx-4 max-w-sm w-full shadow-2xl animate-bounce-in">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {confettiConfig.map((item, i) => (
              <div
                key={i}
                className="absolute animate-confetti-fall"
                style={{
                  left: `${item.left}%`,
                  animationDelay: `${item.delay}s`,
                  animationDuration: `${item.duration}s`
                }}
              >
                <span className="text-2xl">{item.emoji}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="text-7xl mb-4 animate-icon-bounce">
              {level.icon}
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-white/20 mb-3">
              Lv.{level.level}
            </div>

            <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-yellow-200">
              恭喜升级！
            </h2>

            <p className="text-xl text-white mb-4 font-bold">
              {level.name}
            </p>

            <p className="text-pink-200/80 text-sm mb-6 italic">
              "{level.message}"
            </p>

            <button
              onClick={onClose}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              太棒了！✨
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
        @keyframes icon-bounce {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.2) translateY(-15px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-confetti-fall { animation: confetti-fall 1.5s ease-out forwards; }
        .animate-icon-bounce { animation: icon-bounce 1.5s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default LevelUpModal;