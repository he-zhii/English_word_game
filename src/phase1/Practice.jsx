import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronRight, Delete, Eye, EyeOff, Lightbulb, Music, RotateCcw, Volume2 } from 'lucide-react';
import Pet from './Pet';
import { speakWord, stopSpeech } from './speech';
import { playCorrectSound, playWrongSound } from '../utils/audio.js';

export default function Practice({ session, pet, sound, music, onMusic, onEdit, onNext, onSkip, onHome }) {
  const word = session.words[session.index];
  const q = session.question;
  const completed = q.status === 'correct';
  const [audio, setAudio] = useState('idle');
  const speechToken = useRef(0);
  const prevWrongRef = useRef(q.wrong);
  useEffect(() => () => { speechToken.current += 1; stopSpeech(); }, []);

  // 答对后播放随机答对反馈音效，并自动进入下一个词
  useEffect(() => {
    if (!completed) return;
    playCorrectSound();
    const timer = setTimeout(() => onNext(), 1100);
    return () => clearTimeout(timer);
  }, [completed, onNext]);

  // 答错时播放答错反馈：只在 wrong 由 false 变为 true 时播放一次，按累计错次数交替音效/语音
  useEffect(() => {
    if (q.wrong && !prevWrongRef.current) {
      playWrongSound(q.mistakes);
    }
    prevWrongRef.current = q.wrong;
  }, [q.wrong]);

  useEffect(() => {
    const handleKey = event => {
      if (event.ctrlKey || event.metaKey || event.altKey || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      if (completed) {
        if (event.key === 'Enter') { event.preventDefault(); onNext(); }
        return;
      }
      if (/^[a-z]$/i.test(event.key)) { event.preventDefault(); onEdit({ type: 'letter', char: event.key }); }
      else if (event.key === 'Backspace') { event.preventDefault(); onEdit({ type: 'backspace' }); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onEdit, onNext, completed]);
  const play = async () => {
    if (!sound) { setAudio('muted'); return; }
    const token = ++speechToken.current;
    setAudio('playing');
    const result = await speakWord(word.word);
    if (token === speechToken.current) setAudio(result === 'unavailable' ? 'unavailable' : 'idle');
  };
  const playRef = useRef(play);
  playRef.current = play;

  // 每个新单词出现时自动播放一遍发音（组件按 session.index 重新挂载）
  useEffect(() => {
    const timer = setTimeout(() => playRef.current(), 350);
    return () => clearTimeout(timer);
  }, []);

  const activeSlot = completed ? -1 : q.slots.indexOf(null);
  const filledCount = q.slots.filter(s => s !== null).length;
  const slotLetter = i => (q.slots[i] === null || q.slots[i] === undefined ? null : q.tiles[q.slots[i]]);
  let slotIndex = 0;

  return <div className="practice-page">
    <header className="practice-header"><button className="back-button" onClick={onHome}><ArrowLeft size={19}/><span>保存退出</span></button><span className="practice-title">{session.title}</span><button className={`icon-button music-toggle ${music ? '' : 'is-muted'}`} aria-label={music ? '关闭背景音乐' : '开启背景音乐'} aria-pressed={music} onClick={onMusic}><Music size={20}/><span className="music-note n1" aria-hidden="true">♪</span><span className="music-note n2" aria-hidden="true">♫</span></button></header>
    <main className="practice-main"><div className="practice-progress"><span>{session.mode === 'brawl' ? '单词大乱斗' : '今天的小练习'}</span><strong>第 {session.index + 1} <span>/ {session.words.length} 个词</span></strong></div><div className="progress-track" role="progressbar" aria-label="本组进度" aria-valuemin={0} aria-valuemax={session.words.length} aria-valuenow={session.results.length}><span style={{ width: `${session.results.length / session.words.length * 100}%` }}/></div>
      <section className={`exercise-card ${completed ? 'exercise-completed' : ''} ${q.wrong ? 'exercise-wrong' : ''}`} aria-label="单词拼写">
        <div className="question-prompt"><span className="eyebrow">{completed ? 'YOU DID IT!' : 'LET’S SPELL IT'}</span><div className="word-picture" aria-hidden="true">{word.emoji || <BookOpen size={45}/>}</div><h1>{word.cn}</h1><button className={`listen-button ${audio === 'playing' ? 'is-playing' : ''}`} onClick={play}><Volume2 size={19}/>{audio === 'playing' ? '正在播放 · 再听一次' : '听听怎么读'}</button><span className="audio-note" role="status">{audio === 'unavailable' ? '发音暂时没有准备好，看中文也可以继续。' : audio === 'muted' ? '声音已关闭。' : ''}</span></div>
        <div className="spelling-board" aria-label="拼写区域">{word.word.split(/(\s+)/).map((part, partIndex) => /\s/.test(part) ? <span className="answer-space" aria-hidden="true" key={partIndex}/> : <span className={`answer-word ${part.length > 8 ? 'long-word' : ''}`} key={partIndex}>{part.split('').map((char, charIndex) => {
          if (!/[a-z]/i.test(char)) return <span className="answer-punctuation" key={charIndex}>{char}</span>;
          const i = slotIndex++;
          const letter = slotLetter(i);
          return <button key={charIndex} aria-label={`第 ${i + 1} 个字母${letter ? `：${letter}，点击退回` : '，空白'}`} aria-current={!completed && activeSlot === i ? 'true' : undefined} disabled={completed || !letter} className={`letter-slot ${activeSlot === i && !completed ? 'active-slot' : ''} ${letter ? 'filled-slot' : ''}`} onClick={() => { if (letter) onEdit({ type: 'popSlot', index: i }); }}>{letter || <span className="slot-dash"/>}</button>;
        })}</span>)}</div>
        {completed ? <div className="word-success" role="status"><Pet pet={pet} mood="happy"/><div><span className="correct-word">{word.word}</span><strong><Check size={17}/>真棒，拼出来啦！</strong><span>马上进入下一个词…</span></div></div> : <>
          <div className="answer-feedback" role="status">{q.feedback || '点下面的字母块，把单词拼出来吧。'}</div>
          <div className="help-actions"><button onClick={() => onEdit({ type: 'hint' })}><Lightbulb size={17}/>提示一个字母</button><button onClick={() => onEdit({ type: 'reveal' })}>{q.showAnswer ? <EyeOff size={17}/> : <Eye size={17}/>} {q.showAnswer ? '收起答案' : '先看一眼'}</button></div>
          {q.showAnswer && <div className="answer-example"><span>先看看，再试试</span><strong>{word.word}</strong></div>}
        </>}
      </section>
      {!completed && <div className="keyboard-area">
        <div className="letter-tray" aria-label="待选字母">
          {q.tiles.map((char, ti) => q.slots.includes(ti)
            ? <span className="letter-tile-hole" key={ti} aria-hidden="true"/>
            : <button key={ti} className="letter-tile" aria-label={`字母 ${char}`} onClick={() => onEdit({ type: 'tile', index: ti })}>{char}</button>)}
          <button className="tray-delete" aria-label="删除最后一个字母" disabled={filledCount === 0} onClick={() => onEdit({ type: 'backspace' })}><Delete size={22}/></button>
        </div>
        <button className="skip-button" onClick={onSkip}>这个词先放一放<ChevronRight size={16}/></button>
      </div>}
    </main>
  </div>;
}

export function Finished({ session, pet, onHome, onRetry, onSkipped }) {
  const done = session.results.filter(r => r.status === 'completed').length;
  const skipped = session.results.filter(r => r.status === 'skipped').length;
  return <div className="finished-page"><header className="practice-header"><button className="back-button" onClick={onHome}><ArrowLeft size={19}/>回到首页</button><span className="eyebrow">OUR LITTLE MOMENT</span></header><main className="finished-card"><div className={`celebration-scene ${done ? 'has-confetti' : ''}`}><span/><span/><span/><span/><span/><Pet pet={pet} mood={done ? 'celebrate' : 'idle'}/></div><span className="eyebrow">{done ? 'HIGH FIVE, LITTLE BUDDY!' : 'TAKE YOUR TIME'}</span><h1>{done === session.words.length ? '这一组，完成啦！' : done ? '今天也有小小进步！' : '先休息一下，也很好'}</h1><p>{done ? `你和${pet.name}一起，练好了 ${done} 个单词。` : `${pet.name}会在这里，等你准备好再一起试试。`}</p><div className="result-counts"><div><strong>{done}</strong><span>个词已完成</span></div><span/><div><strong>{skipped}</strong><span>个词留待再练</span></div></div><button className="primary-button full-button" onClick={onHome}>带{pet.name}回首页<ArrowRight size={19}/></button><div className="result-secondary">{skipped > 0 && <button className="text-button" onClick={onSkipped}>再试暂放的 {skipped} 个词</button>}<button className="text-button subtle" onClick={onRetry}><RotateCcw size={15}/>再练这组</button></div><p className="finished-footer">每一次尝试，都算数。</p></main></div>;
}
