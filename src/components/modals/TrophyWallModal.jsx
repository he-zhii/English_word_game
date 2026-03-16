import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { X, Sparkles, Star } from 'lucide-react';
import { ACHIEVEMENTS_DATA, RARITY_CONFIG, TYPE_LABELS } from '../../data/achievements';
import { playSuccessChime } from '../../utils/audio';
import { getCurrentLevel } from '../../data/levels';
import { getStats } from '../../utils/storage';

const PARTICLE_COLORS = ['#FBBF24', '#F472B6', '#60A5FA', '#34D399', '#A78BFA', '#F87171', '#FCD34D'];
const CONFETTI_EMOJIS = ['✨', '⭐', '🌟', '💫', '🎉', '🎊'];

const generateRandomValue = (max) => Math.floor(Math.random() * max);

const preGeneratedStarPositions = Array.from({ length: 20 }, () => ({
  left: generateRandomValue(100),
  top: generateRandomValue(100),
  delay: generateRandomValue(30) / 10,
  duration: 2 + generateRandomValue(20) / 10
}));

const preGeneratedDetailPositions = Array.from({ length: 12 }, () => ({
  left: generateRandomValue(100),
  top: generateRandomValue(100),
  delay: generateRandomValue(20) / 10,
  emoji: CONFETTI_EMOJIS[generateRandomValue(CONFETTI_EMOJIS.length)]
}));

export function TrophyWallModal({ isOpen, onClose, unlockedIds }) {
  const [particles, setParticles] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(() => {
    try {
      const stats = getStats();
      return getCurrentLevel(stats.totalScore || 0);
    } catch {
      return null;
    }
  });
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [sparkleEffectId, setSparkleEffectId] = useState(null);
  const particleIdRef = useRef(0);
  const sparkleIntervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const stats = getStats();
        setCurrentLevel(getCurrentLevel(stats.totalScore || 0));
      } catch {
        setCurrentLevel(null);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && unlockedIds.length > 0) {
      sparkleIntervalRef.current = setInterval(() => {
        const randomIndex = generateRandomValue(unlockedIds.length);
        setSparkleEffectId(unlockedIds[randomIndex]);
      }, 2000);
      return () => clearInterval(sparkleIntervalRef.current);
    }
  }, [isOpen, unlockedIds]);

  const createParticles = useCallback((x, y, count = 40) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      particleIdRef.current += 1;
      newParticles.push({
        id: particleIdRef.current,
        x,
        y,
        angle: generateRandomValue(360),
        speed: generateRandomValue(12) + 4,
        color: PARTICLE_COLORS[generateRandomValue(PARTICLE_COLORS.length)],
        life: 1,
        decay: (generateRandomValue(15) / 1000) + 0.008,
        size: generateRandomValue(4) + 2
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    playSuccessChime();
  }, []);

  useEffect(() => {
    if (particles.length > 0) {
      const timer = requestAnimationFrame(() => {
        setParticles(prev => prev.map(p => ({
          ...p,
          x: p.x + Math.cos(p.angle * Math.PI / 180) * p.speed,
          y: p.y + Math.sin(p.angle * Math.PI / 180) * p.speed + 0.5,
          life: p.life - p.decay
        })).filter(p => p.life > 0));
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [particles]);

  const handleTrophyClick = useCallback((e, achievement, isUnlocked) => {
    if (isUnlocked) {
      const rect = e.currentTarget.getBoundingClientRect();
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    if (achievement) {
      setSelectedAchievement(achievement);
    }
  }, [createParticles]);

  const groupedAchievements = useMemo(() => {
    const groups = {};
    ACHIEVEMENTS_DATA.forEach(a => {
      if (!groups[a.type]) groups[a.type] = [];
      groups[a.type].push(a);
    });
    return groups;
  }, []);

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS_DATA.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[90] flex items-center justify-center p-4 animate-fade-in-up overflow-hidden">
      {particles.map(p => (
        <div key={p.id} className="fixed rounded-full pointer-events-none z-[100]"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            opacity: p.life,
            transform: `scale(${p.life * 1.5})`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`
          }} />
      ))}

      <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-purple-500/30 flex flex-col max-h-[90vh] overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {preGeneratedStarPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${pos.delay}s`,
                animationDuration: `${pos.duration}s`
              }}
            >
              <Star className="w-2 h-2 text-yellow-200/40" />
            </div>
          ))}
        </div>

        <div className="relative bg-gradient-to-r from-purple-800/50 via-indigo-800/50 to-purple-800/50 p-6 border-b border-purple-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-pink-400/5 to-yellow-400/5" />
          
          <div className="relative flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-yellow-200 flex items-center gap-3">
                <span className="text-3xl">📖</span>
                小精灵的魔法日记
              </h2>
              <p className="text-purple-200/70 text-sm mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                收集进度: {unlockedCount} / {totalCount} ({progressPercent}%)
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 text-white/70 hover:text-white hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            {progressPercent > 10 && (
              <div className="absolute inset-y-0 left-0 flex items-center justify-end pr-2" style={{ width: `${progressPercent}%` }}>
                <span className="text-[10px] font-bold text-white drop-shadow-lg">{progressPercent}%</span>
              </div>
            )}
          </div>

          {currentLevel && (
            <div className="mt-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-3 border border-pink-500/30 flex items-center gap-3">
              <span className="text-3xl animate-float">{currentLevel.icon}</span>
              <div>
                <p className="text-pink-200 font-bold">Lv.{currentLevel.level} {currentLevel.name}</p>
                <p className="text-xs text-purple-300/70">当前魔法等级</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-900/50">
          {Object.entries(groupedAchievements).map(([type, achievements]) => {
            const typeConfig = TYPE_LABELS[type];
            const typeUnlocked = achievements.filter(a => unlockedIds.includes(a.id)).length;
            
            return (
              <div key={type} className="relative">
                <div className="flex items-center gap-3 mb-4 sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm py-2 px-3 -mx-3 rounded-xl">
                  <span className="text-xl">{typeConfig.label.split(' ')[0]}</span>
                  <div>
                    <h3 className="font-bold text-white/90">{typeConfig.label.slice(2)}</h3>
                    <p className="text-xs text-purple-300/60">{typeConfig.desc}</p>
                  </div>
                  <span className="ml-auto text-sm text-purple-300/80 font-mono">{typeUnlocked}/{achievements.length}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {achievements.map((item) => {
                    const isUnlocked = unlockedIds.includes(item.id);
                    const isSecret = item.type === 'secret' && !isUnlocked;
                    const rarity = RARITY_CONFIG[item.rarity];
                    const showSparkle = sparkleEffectId === item.id;
                    
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => handleTrophyClick(e, item, isUnlocked)}
                        className={`relative group cursor-pointer transition-all duration-500 ${
                          isUnlocked 
                            ? 'hover:scale-110 hover:-translate-y-1' 
                            : 'hover:scale-105'
                        }`}
                      >
                        <div className={`
                          relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-500
                          ${isUnlocked 
                            ? `bg-gradient-to-br ${rarity.color} ${rarity.borderColor} shadow-lg ${rarity.glowColor}` 
                            : 'bg-slate-800/40 border-slate-700/50'
                          }
                        `}>
                          {isUnlocked && (
                            <>
                              <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse-slow" />
                              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 blur-sm animate-gradient-shift" />
                            </>
                          )}
                          
                          {showSparkle && isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Sparkles className="w-8 h-8 text-yellow-300 animate-ping" />
                            </div>
                          )}

                          <div className={`text-3xl mb-1 transition-transform duration-300 ${isUnlocked ? 'animate-icon-float' : 'grayscale opacity-40'}`}>
                            {isSecret ? '❓' : item.icon}
                          </div>
                          
                          <h4 className={`font-bold text-center text-xs leading-tight ${
                            isUnlocked ? 'text-white' : 'text-slate-500'
                          }`}>
                            {isSecret ? '???' : item.title}
                          </h4>

                          {isUnlocked && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                              <Star className="w-2.5 h-2.5 text-yellow-900 fill-yellow-900" />
                            </div>
                          )}

                          {isUnlocked && item.rarity !== 'common' && (
                            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-bold text-white bg-gradient-to-r ${rarity.color} shadow-lg`}>
                              {rarity.name}
                            </div>
                          )}
                        </div>

                        <div className={`
                          absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 rounded-xl text-xs
                          bg-slate-800/95 border border-purple-500/30 text-purple-100
                          opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20
                          shadow-xl shadow-purple-900/50
                        `}>
                          {!isSecret && (
                            <>
                              <p className="font-bold text-yellow-300 mb-1">{item.title}</p>
                              <p className="text-purple-200/80">{item.desc}</p>
                              {isUnlocked && (
                                <p className="mt-2 pt-2 border-t border-purple-500/30 text-pink-300 italic text-[10px]">
                                  "{item.message}"
                                </p>
                              )}
                            </>
                          )}
                          {isSecret && !isUnlocked && (
                            <p className="text-center text-purple-300/60">🤫 小精灵的秘密...</p>
                          )}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-800/95" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 p-4 border-t border-purple-500/30">
          <div className="flex items-center justify-center gap-6 text-sm">
            {Object.entries(RARITY_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color} shadow-lg`} />
                <span className="text-purple-200/70">{config.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAchievement && unlockedIds.includes(selectedAchievement.id) && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 animate-fade-in-up"
          onClick={() => setSelectedAchievement(null)}
        >
          <div 
            className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 mx-4 max-w-sm w-full text-center border-2 border-yellow-400/50 shadow-2xl shadow-yellow-400/20 animate-bounce-in relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {preGeneratedDetailPositions.map((pos, i) => (
                <div
                  key={i}
                  className="absolute animate-twinkle"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    animationDelay: `${pos.delay}s`
                  }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-300/50" />
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="text-6xl mb-4 animate-icon-bounce">
                {selectedAchievement.icon}
              </div>
              
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${RARITY_CONFIG[selectedAchievement.rarity].color} mb-3`}>
                {RARITY_CONFIG[selectedAchievement.rarity].name}
              </div>

              <h3 className="text-xl font-bold text-yellow-300 mb-2">
                {selectedAchievement.title}
              </h3>
              
              <p className="text-purple-200/80 mb-4">
                {selectedAchievement.desc}
              </p>

              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-500/20">
                <p className="text-pink-200 italic text-sm">
                  "{selectedAchievement.message}"
                </p>
              </div>

              <button
                onClick={() => setSelectedAchievement(null)}
                className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform active:scale-95"
              >
                太棒了！✨
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-3deg); }
          75% { transform: translateY(-3px) rotate(3deg); }
        }
        @keyframes icon-bounce {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.1) translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.3; transform: rotate(0deg); }
          50% { opacity: 0.6; transform: rotate(180deg); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-icon-float { animation: icon-float 4s ease-in-out infinite; }
        .animate-icon-bounce { animation: icon-bounce 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 5s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default TrophyWallModal;