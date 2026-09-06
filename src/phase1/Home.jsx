import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Cat, CheckCheck, Flower2, Heart, House, ListChecks, MapPin, Music, Palette, PawPrint, Pencil, Play, Smile, Sparkles, Users, UtensilsCrossed, Zap, Apple, Hash } from 'lucide-react';
import {
  G5U1People, G5U2Family, G5U3Schedule, G5U4Health, G5U5Habits, G5U6Food,
  G6U1China, G6U2World, G6U3Sports, G6U4Services, G6U5Space, G6U6Eco
} from './UnitIcons56';
import Pet from './Pet';
import { UNIT_ICONS } from './UnitIcons';
import { BookSwitcher } from './BookSwitcher';
import { playIdleSound } from '../utils/audio.js';

const icons = {
  Users, Home: House, PawPrint, Apple, Palette, Hash, UserPlus: Users, Smile, Pencil, UtensilsCrossed, MapPin, Calculator: Hash,
  ...UNIT_ICONS,
  G5U1People, G5U2Family, G5U3Schedule, G5U4Health, G5U5Habits, G5U6Food,
  G6U1China, G6U2World, G6U3Sports, G6U4Services, G6U5Space, G6U6Eco
};

export function Brand({ pet }) {
  const name = pet?.name?.trim() || '糯米';
  return <div className="brand"><span className="brand-mark"><Cat size={25} strokeWidth={1.8}/></span><div><strong>{name}单词屋</strong><span>WORD HOUSE</span></div></div>;
}

export default function Home({ books, book, pet, music, session, learned, onBook, onMusic, onPet, onUnit, onQuick, onBrawl, onResume }) {
  const [patted, setPatted] = useState(false);
  const [idleLine, setIdleLine] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const pat = () => { setPatted(true); clearTimeout(timer.current); timer.current = setTimeout(() => setPatted(false), 2200); const line = playIdleSound(); setIdleLine(line.text); };
  return <div className="home-page">
    <header className="home-header"><Brand pet={pet}/><div className="header-tools"><BookSwitcher books={books} currentId={book.id} onSwitch={onBook}/><button className={`icon-button music-toggle ${music ? '' : 'is-muted'}`} aria-label={music ? '关闭背景音乐' : '开启背景音乐'} aria-pressed={music} onClick={onMusic}><Music size={20}/><span className="music-note n1" aria-hidden="true">♪</span><span className="music-note n2" aria-hidden="true">♫</span></button></div></header>
    <main>
      <section className="buddy-hero" aria-label="我的小伙伴"><div className="hero-copy"><div className="hello-label"><span/>欢迎来到单词屋</div><h1>今天，和<span>{pet.name}</span><br/>一起整理单词屋吧！</h1><p>每学会一个词，小屋就多一颗小星星。</p><button className="pet-edit-button" onClick={onPet}><Palette size={16}/>装扮我的小伙伴<ArrowRight size={15}/></button></div>
        <div className="hero-scene"><span className="scene-sun"/><span className="scene-cloud cloud-one"/><span className="scene-cloud cloud-two"/><Sparkles className="scene-sparkle" size={29}/><span className="scene-hill hill-back"/><span className="scene-hill hill-front"/>
          <span className="scene-plant"><i/><i/><i/></span><span className="scene-books"><i/><i/></span>
          <button className="hero-pet" onClick={pat} aria-label={`摸摸${pet.name}`}><Pet pet={pet} mood={patted ? 'happy' : 'idle'}/></button>
          <span className={`pet-speech ${patted ? 'patted' : ''}`} aria-live="polite">{patted ? (idleLine || '喜欢和你一起玩！') : '点点我，打个招呼'}<Heart size={13} fill="currentColor"/></span>
        </div>
      </section>
      {session && <button className="resume-card" onClick={onResume}><span className="resume-icon"><Play size={18} fill="currentColor"/></span><span><strong>{session.status === 'finished' ? '看看上次的小小收获' : '接着上次，一起练'}</strong><small>{session.title} · {session.status === 'finished' ? '查看完成结果' : `第 ${session.index + 1} / ${session.words.length} 个词`}</small></span><ArrowRight size={19}/></button>}
      <section className="units-section"><div className="section-heading"><div><span className="eyebrow">A LITTLE PRACTICE, A LITTLE JOY</span><h2>选个单元，开始吧<span className="heading-flower"><Flower2 size={22}/></span></h2></div><button className="quick-pick-button" onClick={onQuick}><ListChecks size={17}/>快速选词</button></div>
        <div className="unit-grid">{book.units.map((unit, index) => { const Icon = icons[unit.icon] || BookOpen; const done = unit.words.filter(w => learned.includes(w.id)).length; return <button className={`unit-card unit-color-${index % 6}`} key={unit.id} onClick={() => onUnit(unit)}>
          <div className="unit-top"><span className="unit-number">UNIT {String(unit.id).padStart(2, '0')}</span><span className="unit-icon"><Icon size={29} strokeWidth={1.6}/></span></div><h3>{unit.title}</h3><p>{unit.subtitle}</p><div className="unit-bottom"><span>{unit.words.length} 个单词{done > 0 && <span className="unit-practiced"><CheckCheck size={12}/>{done}</span>}</span><span className="unit-arrow"><ArrowRight size={17}/></span></div>
        </button>; })}</div>
      </section>
      <button className="brawl-card" onClick={onBrawl}><span className="brawl-icon"><Zap size={30} fill="currentColor"/></span><span className="brawl-copy"><span className="brawl-kicker">READY, SET, SPELL!</span><strong>单词大乱斗<span className="brawl-count">5 / 10 词</span></strong><span>用学过的单词，来一场小挑战。</span></span><span className="brawl-arrow"><ArrowRight size={22}/></span><span className="brawl-decoration" aria-hidden="true">a b c</span></button>
      <footer className="home-footer"><Heart size={13}/>在单词屋里，按自己的节奏慢慢来。</footer>
    </main>
  </div>;
}
