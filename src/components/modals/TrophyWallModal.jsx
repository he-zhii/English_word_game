// 奖杯墙弹窗组件

import React, { useState, useEffect } from 'react';
import { Award, X, Sparkles } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../../data/achievements';
import { playSuccessChime } from '../../utils/audio';

export function TrophyWallModal({ isOpen, onClose, unlockedIds }) {
    const [particles, setParticles] = useState([]);

    const createParticles = (x, y) => {
        const newParticles = [];
        for (let i = 0; i < 40; i++) {
            newParticles.push({
                id: Math.random(),
                x, y,
                angle: Math.random() * 360,
                speed: Math.random() * 10 + 3,
                color: ['#FBBF24', '#F472B6', '#60A5FA', '#34D399', '#A78BFA', '#F87171'][Math.floor(Math.random() * 6)],
                life: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
        playSuccessChime();
    };

    useEffect(() => {
        if (particles.length > 0) {
            const timer = requestAnimationFrame(() => {
                setParticles(prev => prev.map(p => ({
                    ...p,
                    x: p.x + Math.cos(p.angle * Math.PI / 180) * p.speed,
                    y: p.y + Math.sin(p.angle * Math.PI / 180) * p.speed + 1,
                    life: p.life - p.decay
                })).filter(p => p.life > 0));
            });
            return () => cancelAnimationFrame(timer);
        }
    }, [particles]);

    const handleTrophyClick = (e, isUnlocked) => {
        if (isUnlocked) {
            const rect = e.currentTarget.getBoundingClientRect();
            createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-fade-in-up">
            {particles.map(p => (
                <div key={p.id} className="fixed w-2 h-2 rounded-full pointer-events-none z-[100]"
                    style={{
                        left: p.x, top: p.y,
                        backgroundColor: p.color,
                        opacity: p.life,
                        transform: `scale(${p.life * 2})`
                    }} />
            ))}

            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[85vh] overflow-hidden">
                <div className="bg-slate-900/50 p-6 flex justify-between items-center border-b border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><Award className="w-7 h-7" /> 荣誉陈列室</h2>
                        <p className="text-slate-400 text-xs mt-1 tracking-wider uppercase">收集进度: {unlockedIds.length} / {ACHIEVEMENTS_DATA.length}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-900">
                    {ACHIEVEMENTS_DATA.map((item) => {
                        const isUnlocked = unlockedIds.includes(item.id);
                        const isSecret = item.type === 'hidden' && !isUnlocked;
                        return (
                            <div key={item.id} onClick={(e) => handleTrophyClick(e, isUnlocked)}
                                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${isUnlocked ? 'bg-slate-800/80 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:border-yellow-400 hover:scale-105 cursor-pointer' : 'bg-slate-800/30 border-slate-800 grayscale opacity-50'}`}>
                                <div className={`text-4xl mb-3 transition-transform ${isUnlocked ? 'animate-float' : ''}`}>{isSecret ? '🔒' : item.icon}</div>
                                <h3 className={`font-bold text-center text-sm ${isUnlocked ? 'text-yellow-100' : 'text-slate-600'}`}>{isSecret ? '？？？' : item.title}</h3>
                                {!isSecret && <p className="text-[10px] text-slate-400 text-center mt-1">{item.desc}</p>}
                                {isUnlocked && <Sparkles className="absolute top-2 right-2 w-3 h-3 text-yellow-400 animate-pulse" />}
                            </div>
                        );
                    })}
                </div>
            </div>
            <style>{`@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } } .animate-float { animation: float 3s ease-in-out infinite; }`}</style>
        </div>
    );
}

export default TrophyWallModal;
