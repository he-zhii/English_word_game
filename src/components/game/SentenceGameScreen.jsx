// 律动小剧场组件

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Music, Lightbulb } from 'lucide-react';
import { CHANT_DATA } from '../../data/chants';
import { shuffleArray } from '../../utils/helpers';
import { playWordAudio, playSuccessChime } from '../../utils/audio';

export function SentenceGameScreen({ onBack, settings, onUpdateStats }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gamePhase, setGamePhase] = useState('sentence');
    const [placedWords, setPlacedWords] = useState([]);
    const [availableWords, setAvailableWords] = useState([]);
    const [sentenceStructure, setSentenceStructure] = useState([]);
    const [isSentenceCompleted, setIsSentenceCompleted] = useState(false);
    const [spellingShuffledLetters, setSpellingShuffledLetters] = useState([]);
    const [spellingPlacedLetters, setSpellingPlacedLetters] = useState([]);
    const [isSpellingCompleted, setIsSpellingCompleted] = useState(false);
    const [spellingShake, setSpellingShake] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const currentChant = CHANT_DATA[currentIndex];

    useEffect(() => { initLevel(currentIndex); }, [currentIndex]);

    const initLevel = (idx) => {
        const chant = CHANT_DATA[idx];
        setGamePhase('sentence');
        const tokens = chant.sentence.split(/([a-zA-Z]+)/).filter(t => t);
        const structure = [], wordsPool = [];
        tokens.forEach((token, i) => {
            if (/^[a-zA-Z]+$/.test(token)) {
                structure.push({ type: 'word', id: `slot-${i}`, target: token });
                wordsPool.push({ id: `word-${i}-${token}`, text: token, isUsed: false });
            } else if (token.trim()) structure.push({ type: 'punct', content: token });
        });
        setSentenceStructure(structure);
        setPlacedWords(new Array(structure.filter(t => t.type === 'word').length).fill(null));
        setAvailableWords(shuffleArray(wordsPool));
        setIsSentenceCompleted(false);
        const phrase = chant.phrase.word;
        const letterObjs = phrase.replace(/\s/g, '').split('').map((char, i) => ({ id: `spell-${char}-${i}-${Math.random()}`, char: char, isUsed: false }));
        setSpellingShuffledLetters(shuffleArray(letterObjs));
        setSpellingPlacedLetters(phrase.split('').map((char, i) => char === ' ' ? { char: ' ', isSpace: true, id: `space-${i}` } : null));
        setIsSpellingCompleted(false);
        setShowCelebration(false);

        // 只在初始加载时播放一次
        setTimeout(() => playWordAudio(chant.sentence), 800);
    };

    const handleSentenceWordClick = (wordObj) => {
        if (isSentenceCompleted || wordObj.isUsed) return;
        const idx = placedWords.findIndex(w => w === null);
        if (idx === -1) return;
        const newPlaced = [...placedWords]; newPlaced[idx] = wordObj; setPlacedWords(newPlaced);
        setAvailableWords(availableWords.map(w => w.id === wordObj.id ? { ...w, isUsed: true } : w));
        if (newPlaced.every(w => w !== null)) checkSentenceAnswer(newPlaced);
    };

    const handleSentenceSlotClick = (idx) => {
        if (isSentenceCompleted || !placedWords[idx]) return;
        const wordToReturn = placedWords[idx];
        const newPlaced = [...placedWords]; newPlaced[idx] = null; setPlacedWords(newPlaced);
        setAvailableWords(availableWords.map(w => w.id === wordToReturn.id ? { ...w, isUsed: false } : w));
    };

    const checkSentenceAnswer = (finalPlaced) => {
        const userWords = finalPlaced.map(w => w.text);
        const targetWords = sentenceStructure.filter(s => s.type === 'word').map(s => s.target);
        if (userWords.join('') === targetWords.join('')) {
            setIsSentenceCompleted(true);
            playSuccessChime(); // 只播放成功音效
        } else {
            alert("Oops! 顺序不对哦，再试一次！");
            setPlacedWords(new Array(finalPlaced.length).fill(null));
            setAvailableWords(availableWords.map(w => ({ ...w, isUsed: false })));
        }
    };

    const handleSpellingLetterClick = (item) => {
        if (isSpellingCompleted || item.isUsed) return;
        const idx = spellingPlacedLetters.findIndex(l => l === null);
        if (idx === -1) return;
        const newShuffled = spellingShuffledLetters.map(l => l.id === item.id ? { ...l, isUsed: true } : l);
        const newPlaced = [...spellingPlacedLetters]; newPlaced[idx] = item;
        setSpellingShuffledLetters(newShuffled); setSpellingPlacedLetters(newPlaced);
        if (newPlaced.every(l => l !== null)) checkSpellingAnswer(newPlaced);
    };

    const handleSpellingSlotClick = (idx) => {
        if (isSpellingCompleted || !spellingPlacedLetters[idx] || spellingPlacedLetters[idx].isSpace) return;
        const item = spellingPlacedLetters[idx];
        const newPlaced = [...spellingPlacedLetters]; newPlaced[idx] = null;
        setSpellingPlacedLetters(newPlaced);
        setSpellingShuffledLetters(spellingShuffledLetters.map(l => l.id === item.id ? { ...l, isUsed: false } : l));
    };

    const checkSpellingAnswer = (finalPlaced) => {
        if (finalPlaced.map(l => l.char).join('') === currentChant.phrase.word) {
            setIsSpellingCompleted(true); setShowCelebration(true); onUpdateStats('win');
            playSuccessChime(); // 只播放成功音效
        } else {
            setSpellingShake(true); setTimeout(() => setSpellingShake(false), 500);
            const userIds = finalPlaced.filter(l => l && !l.isSpace).map(l => l.id);
            setSpellingPlacedLetters(finalPlaced.map(l => (l && l.isSpace) ? l : null));
            setSpellingShuffledLetters(spellingShuffledLetters.map(l => userIds.includes(l.id) ? { ...l, isUsed: false } : l));
        }
    };

    const handleHint = () => {
        if (isSpellingCompleted) return;
        const emptyIndex = spellingPlacedLetters.findIndex(l => l === null);
        if (emptyIndex === -1) return;
        const char = currentChant.phrase.word[emptyIndex];
        const target = spellingShuffledLetters.find(l => l.char === char && !l.isUsed);
        if (target) handleSpellingLetterClick(target);
    };

    let wordSlotCounter = 0;
    return (
        <div className={`flex flex-col min-h-[100dvh] w-full overflow-x-hidden ${currentChant.color} transition-colors duration-500`}>
            <div className="p-4 flex justify-between items-center bg-black/10 text-white backdrop-blur-md sticky top-0 z-20">
                <button onClick={onBack} className="flex items-center gap-1 font-bold hover:bg-white/20 px-3 py-1 rounded-full"><ArrowLeft className="w-5 h-5" /> 退出</button>
                <span className="font-bold tracking-wider flex items-center gap-2"><Music className="w-5 h-5 animate-bounce" /> 律动小剧场</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4 pb-20">
                <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
                    {gamePhase === 'sentence' ? (
                        <div className="w-full text-center">
                            <h2 className="text-3xl font-extrabold text-slate-700 mb-6">{currentChant.cn}</h2>
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {sentenceStructure.map((item, i) => {
                                    if (item.type === 'punct') return <span key={i} className="text-4xl font-bold text-slate-400">{item.content}</span>;
                                    const idx = wordSlotCounter++; const filled = placedWords[idx];
                                    return <div key={i} onClick={() => handleSentenceSlotClick(idx)} className={`h-12 px-4 rounded-xl border-b-4 flex items-center text-xl font-bold cursor-pointer ${filled ? 'bg-indigo-100 text-indigo-600 border-indigo-300' : 'bg-slate-100 border-slate-200 border-dashed'}`}>{filled?.text}</div>
                                })}
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {!isSentenceCompleted ? availableWords.map(w => (<button key={w.id} onClick={() => handleSentenceWordClick(w)} disabled={w.isUsed} className={`px-4 py-2 rounded-xl font-bold border-b-4 ${w.isUsed ? 'opacity-0' : 'bg-white border-slate-200 hover:-translate-y-1'}`}>{w.text}</button>)) : <button onClick={() => { setGamePhase('spelling'); playWordAudio(currentChant.phrase.word); }} className="bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-bounce">拼写挑战 ➡️</button>}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full text-center">
                            <h2 className="text-2xl font-bold text-slate-700 mb-6">拼写: {currentChant.phrase.cn}</h2>
                            <div className={`flex justify-center gap-2 mb-8 ${spellingShake ? 'animate-shake' : ''}`}>
                                {spellingPlacedLetters.map((l, i) => (l?.isSpace ? <div key={i} className="w-4" /> : <div key={i} onClick={() => handleSpellingSlotClick(i)} className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold rounded-xl border-b-4 cursor-pointer ${l ? 'bg-white border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200'}`}>{l?.char}</div>))}
                            </div>
                            <div className="flex justify-center gap-2 mb-6">
                                {!isSpellingCompleted ? spellingShuffledLetters.map(l => (<button key={l.id} onClick={() => handleSpellingLetterClick(l)} disabled={l.isUsed} className={`w-14 h-14 md:w-16 md:h-16 rounded-xl font-bold text-xl md:text-2xl ${l.isUsed ? 'opacity-0' : 'bg-yellow-400 text-yellow-900 shadow-md active:scale-95'}`}>{l.char}</button>)) : <button onClick={() => { if (currentIndex < CHANT_DATA.length - 1) setCurrentIndex(c => c + 1); else { alert('通关!'); onBack(); } }} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-bounce">{currentIndex < CHANT_DATA.length - 1 ? '下一句 ➡️' : '完成!'}</button>}
                            </div>
                            {!isSpellingCompleted && settings.enableHints && <button onClick={handleHint} className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500"><Lightbulb /></button>}
                            {showCelebration && <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-9xl animate-ping opacity-20">🌟</div>}
                        </div>
                    )}
                </div>
            </div>
            <style>{`.animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`}</style>
        </div>
    );
}

export default SentenceGameScreen;
