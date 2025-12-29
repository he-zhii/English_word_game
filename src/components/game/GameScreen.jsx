// 拼写游戏主组件

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Volume2, Trophy, ArrowLeft, Lightbulb,
    GraduationCap, Keyboard
} from 'lucide-react';
import { getColor, shuffleArray } from '../../utils/helpers';
import { playWordAudio, playSuccessChime } from '../../utils/audio';
import {
    updateGlobalScore, addMistake, updateMistakeProgress, clearBrawlProgress
} from '../../utils/storage';

export function GameScreen({
    words, mode, onBack, isMistakeMode = false,
    initialIndex = 0, initialScore = 0, preShuffled = false,
    onProgressUpdate = null, settings, onUpdateStats
}) {
    const activeWords = useMemo(() => isMistakeMode || mode === 'brawl' ? words : words.filter(w => w.isActive !== false), [words, isMistakeMode, mode]);
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
    const [showCelebration, setShowCelebration] = useState(false);
    const [shake, setShake] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [currentHearts, setCurrentHearts] = useState(0);
    const [graduatedAnimation, setGraduatedAnimation] = useState(false);
    const audioPlayedRef = useRef(false);
    const [brawlMistakes, setBrawlMistakes] = useState(0);

    const currentWordObj = workingWords[currentIndex];

    useEffect(() => {
        if (mode === 'brawl' && onProgressUpdate) onProgressUpdate({ words: workingWords, currentIndex, score });
    }, [currentIndex, score, mode, workingWords]);

    // [BugFix] 仅在单词内容改变时初始化，防止父组件重绘导致的死循环
    const lastWordRef = useRef(null);
    useEffect(() => {
        if (currentWordObj && currentWordObj.word !== lastWordRef.current) {
            initWord(currentWordObj);
            lastWordRef.current = currentWordObj.word;
            audioPlayedRef.current = false;
            if (isMistakeMode) setCurrentHearts(currentWordObj.hearts || 0);
        }
    }, [currentWordObj, isMistakeMode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const isDictation = mode === 'dictation';
            if (!audioPlayedRef.current && currentWordObj && !graduatedAnimation && !isDictation) {
                playWordAudio(currentWordObj.word);
                audioPlayedRef.current = true;
            }
        }, 500);
        return () => { clearTimeout(timer); if (window.speechSynthesis) window.speechSynthesis.cancel(); };
    }, [currentIndex, currentWordObj, graduatedAnimation, mode]);

    const initWord = (wordObj) => {
        const phrase = wordObj.word;
        const lettersOnly = phrase.replace(/\s/g, '').split('');
        const letterObjs = lettersOnly.map((char, i) => ({ id: `${char}-${i}-${Math.random()}`, char: char, isUsed: false }));
        setShuffledLetters(shuffleArray(letterObjs));
        setPlacedLetters(phrase.split('').map((char, i) => char === ' ' ? { char: ' ', isSpace: true, id: `space-${i}` } : null));
        setIsCompleted(false); setShowCelebration(false); setShowHint(false); setGraduatedAnimation(false);
    };

    const handleLetterClick = (item) => {
        if (isCompleted || item.isUsed) return;
        const idx = placedLetters.findIndex(l => l === null);
        if (idx === -1) return;
        const newShuffled = shuffledLetters.map(l => l.id === item.id ? { ...l, isUsed: true } : l);
        const newPlaced = [...placedLetters]; newPlaced[idx] = item;
        setShuffledLetters(newShuffled); setPlacedLetters(newPlaced);
        if (newPlaced.every(l => l !== null)) checkAnswer(newPlaced);
    };

    // [V12.0 重写] 智能提示: 霸道纠错版
    const handleSmartHint = () => {
        if (isCompleted) return;
        const targetWord = currentWordObj.word;

        // 1. 全局扫描：找到第一个错误（空位或错字）
        let errorIndex = -1;
        for (let i = 0; i < targetWord.length; i++) {
            const targetChar = targetWord[i];
            if (targetChar === ' ') continue;
            const currentPlaced = placedLetters[i];
            // 关键判定：只要不对（哪怕是有字），就是错误点
            if (!currentPlaced || currentPlaced.char !== targetChar) {
                errorIndex = i;
                break;
            }
        }

        if (errorIndex === -1) return; // 单词已正确

        const correctChar = targetWord[errorIndex];
        let nextPlaced = [...placedLetters];
        let nextShuffled = [...shuffledLetters];

        // 2. 清理现场：如果该位置有错误的字母，踢回字母库
        if (nextPlaced[errorIndex]) {
            const letterToRemove = nextPlaced[errorIndex];
            nextPlaced[errorIndex] = null;
            // 在库中标记为未使用
            nextShuffled = nextShuffled.map(l => l.id === letterToRemove.id ? { ...l, isUsed: false } : l);
        }

        // 3. 搜捕正确字母
        // 优先：从字母库找
        let letterToPlace = nextShuffled.find(l => l.char === correctChar && !l.isUsed);

        // 备选：从已填的（错误）位置抢
        if (!letterToPlace) {
            // 找一个虽然字母对，但位置不对的倒霉蛋 (位置 > 当前错误点)
            const stolenIndex = nextPlaced.findIndex((l, idx) =>
                l && l.char === correctChar && idx > errorIndex
            );

            if (stolenIndex !== -1) {
                letterToPlace = nextPlaced[stolenIndex];
                nextPlaced[stolenIndex] = null; // 把它原来的位置腾空
                // 注意：isUsed 保持 true，因为我们只是挪窝
            }
        }

        // 4. 强制填入
        if (letterToPlace) {
            nextPlaced[errorIndex] = letterToPlace;
            // 确保标记为已用
            nextShuffled = nextShuffled.map(l => l.id === letterToPlace.id ? { ...l, isUsed: true } : l);

            setPlacedLetters(nextPlaced);
            setShuffledLetters(nextShuffled);

            // 检查是否完成
            if (nextPlaced.every(l => l !== null)) {
                checkAnswer(nextPlaced);
            }
        }
    };

    const handleSlotClick = (idx) => {
        if (isCompleted || !placedLetters[idx] || placedLetters[idx].isSpace) return;
        const item = placedLetters[idx];
        const newPlaced = [...placedLetters]; newPlaced[idx] = null;
        setPlacedLetters(newPlaced);
        setShuffledLetters(shuffledLetters.map(l => l.id === item.id ? { ...l, isUsed: false } : l));
    };

    const checkAnswer = (finalPlaced) => {
        const userPhrase = finalPlaced.map(l => l.char).join('');
        if (userPhrase === currentWordObj.word) {
            setIsCompleted(true);
            playSuccessChime();
            if (isMistakeMode) {
                const res = updateMistakeProgress(currentWordObj.word, true);
                if (res === 'graduated') setGraduatedAnimation(true);
                else { setCurrentHearts(h => h + 1); setShowCelebration(true); setScore(s => s + 10); updateGlobalScore(10); }
            } else {
                setShowCelebration(true); setScore(s => s + 10);
                if (mode !== 'brawl') updateGlobalScore(10);
                else updateGlobalScore(10);
            }
            onUpdateStats('win', showHint);
        } else {
            setShake(true); setTimeout(() => setShake(false), 500);
            if (mode === 'brawl') setBrawlMistakes(m => m + 1);
            onUpdateStats('mistake');
            if (isMistakeMode) { updateMistakeProgress(currentWordObj.word, false); setCurrentHearts(0); }
            else addMistake(currentWordObj);
        }
    };

    const nextLevel = () => {
        if (currentIndex < workingWords.length - 1) setCurrentIndex(c => c + 1);
        else {
            if (mode === 'brawl') {
                clearBrawlProgress();
                onUpdateStats('brawl_complete', false, brawlMistakes);
            }
            alert(`🎉 恭喜通关！`); onBack();
        }
    };

    const handleHintTrigger = () => {
        handleSmartHint(); setShowHint(true); onUpdateStats('hint');
    };

    const effectiveMode = mode === 'brawl' ? 'visual' : mode;
    const isDictation = effectiveMode === 'dictation';
    const shouldShowVisuals = effectiveMode === 'visual' || effectiveMode === 'notebook' || showHint || isCompleted || (isDictation && isCompleted);

    if (!currentWordObj) return <div className="text-center p-10">加载中...</div>;

    return (
        <div className="flex flex-col min-h-[100dvh] w-full bg-slate-50">
            <div className={`p-4 flex justify-between items-center shadow-md relative z-10 transition-colors duration-500 ${isMistakeMode ? 'bg-red-500' : 'bg-indigo-500'} text-white`}>
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="flex items-center gap-1 font-bold bg-white/20 px-3 py-1 rounded-full"><ArrowLeft className="w-5 h-5" /> 返回</button>
                    <span className="text-xs font-semibold px-2 py-1 bg-white/20 rounded-lg hidden md:inline-block">{mode === 'dictation' ? '📝 默写测验' : '👀 看图练习'}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-1 rounded-full"><Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300" /><span className="font-bold text-lg">{score}</span></div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 pb-20">
                <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl border-4 border-slate-100 overflow-hidden relative min-h-[400px] flex flex-col">
                    {graduatedAnimation && <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center animate-fade-in-up"><GraduationCap className="w-24 h-24 text-yellow-500 mb-4 animate-bounce" /><h2 className="text-3xl font-bold">已掌握！</h2><button onClick={nextLevel} className="mt-4 bg-green-500 text-white px-8 py-2 rounded-full font-bold">下一关</button></div>}

                    <div className="p-4 flex flex-col items-center flex-1">
                        <div className="relative mb-6 text-center h-32 flex flex-col justify-center items-center w-full">
                            {shouldShowVisuals ? (
                                <div className="animate-fade-in-up">
                                    <div className={`text-6xl mb-2 transition-transform duration-300 ${isCompleted ? 'scale-110 rotate-6' : ''}`}>{currentWordObj.emoji}</div>
                                    <h2 className={`text-2xl font-bold tracking-widest ${getColor(currentIndex)}`}>{currentWordObj.cn}</h2>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center animate-pulse cursor-pointer" onClick={handleHintTrigger}>
                                    <div className="text-6xl mb-2 text-slate-200"><Keyboard className="w-20 h-20 mx-auto" /></div>
                                    <h2 className={`text-2xl font-bold tracking-widest ${getColor(currentIndex)}`}>{currentWordObj.cn}</h2>
                                    {isDictation && <p className="text-xs text-slate-400 mt-2">(看中文默写，点击图标提示)</p>}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <button onClick={() => playWordAudio(currentWordObj.word)} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-bold shadow-sm active:scale-95"><Volume2 className="w-5 h-5" /> 听发音</button>
                            {!isCompleted && <button onClick={handleHintTrigger} className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full font-bold shadow-sm active:scale-95"><Lightbulb className="w-5 h-5" /> 提示</button>}
                        </div>

                        <div className={`flex flex-wrap justify-center gap-2 min-h-[4rem] ${shake ? 'animate-shake' : ''}`}>
                            {placedLetters.map((l, i) => l?.isSpace ? <div key={i} className="w-4" /> : <div key={i} onClick={() => handleSlotClick(i)} className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold rounded-xl border-b-4 cursor-pointer ${l ? 'bg-white border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200'} ${isCompleted && l ? 'bg-green-100 border-green-400 text-green-600' : ''}`}>{l?.char}</div>)}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mt-8 min-h-[4rem]">
                            {!isCompleted ? shuffledLetters.map(l => (<button key={l.id} onClick={() => handleLetterClick(l)} disabled={l.isUsed} className={`w-14 h-14 md:w-16 md:h-16 rounded-xl font-bold text-xl md:text-2xl touch-manipulation ${l.isUsed ? 'opacity-0' : 'bg-yellow-400 text-yellow-900 shadow-md active:scale-95'}`}>{l.char}</button>)) : !graduatedAnimation && <button onClick={nextLevel} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-bounce">下一关 ➡️</button>}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; } @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }`}</style>
        </div>
    );
}

export default GameScreen;
