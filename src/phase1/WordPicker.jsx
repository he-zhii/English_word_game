import React, { useState } from 'react';
import { ArrowRight, Check, Search, X } from 'lucide-react';
import Sheet from './Sheet';

export default function WordPicker({ book, unitId, initialIds, challenge = false, onApply, onClose }) {
  const [activeUnit, setActiveUnit] = useState(unitId || 'all');
  const [selected, setSelected] = useState(() => new Set(initialIds));
  const [search, setSearch] = useState('');
  const all = book.units.flatMap(unit => unit.words);
  const query = search.trim().toLowerCase();
  const visible = all.filter(w => (activeUnit === 'all' || w.unitId === activeUnit) && (!query || `${w.word} ${w.cn}`.toLowerCase().includes(query)));
  const chosen = all.filter(w => selected.has(w.id));
  const toggle = id => setSelected(previous => {
    const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next;
  });
  return <Sheet title={challenge ? '这次，想挑战哪些词？' : '挑几个单词，一起练吧'} subtitle={challenge ? '课堂上学过的词，也可以勾选进来。' : '练整个单元，或只选今天想练的几个。'} onClose={onClose}
    className="word-picker" footer={<><div className="selection-total"><strong>{chosen.length}</strong><span>个词已选好</span></div><button className="primary-button" disabled={!chosen.length} onClick={() => onApply(chosen, [...selected])}>{challenge ? '用这些词挑战' : '开始练习'}<ArrowRight size={19}/></button></>}>
    <div className="picker-controls"><div className="search-field"><Search size={18}/><input aria-label="搜索单词或中文" placeholder="找一个单词或中文…" value={search} onChange={e => setSearch(e.target.value)}/>{search && <button aria-label="清空搜索" onClick={() => setSearch('')}><X size={16}/></button>}</div>
      <div className="unit-tabs" aria-label="选择单元"><button aria-pressed={activeUnit === 'all'} onClick={() => setActiveUnit('all')}>全部</button>{book.units.map(unit => <button key={unit.id} aria-pressed={activeUnit === unit.id} onClick={() => setActiveUnit(unit.id)}>Unit {unit.id}</button>)}</div>
      <div className="picker-toolbar"><span>{activeUnit === 'all' ? '全部单元' : book.units.find(u => u.id === activeUnit)?.title}<span className="muted"> · {visible.length} 词</span></span><div><button className="text-button" disabled={!visible.length} onClick={() => setSelected(previous => new Set([...previous, ...visible.map(w => w.id)]))}>全选{query ? '结果' : activeUnit === 'all' ? '全部' : '本单元'}</button><button className="text-button subtle" disabled={!selected.size} onClick={() => setSelected(new Set())}>清空所选</button></div></div>
    </div>
    <div className="word-list">{visible.map(word => <label key={word.id} className={`word-choice ${selected.has(word.id) ? 'is-selected' : ''}`}>
      <input type="checkbox" checked={selected.has(word.id)} onChange={() => toggle(word.id)} aria-label={`选择 ${word.word}`}/><span className="check-art" aria-hidden="true">{selected.has(word.id) && <Check size={15}/>}</span>
      <span className="word-choice-copy"><strong>{word.word}</strong><span>{word.cn}</span></span><span className="word-unit">U{word.unitId}</span>
    </label>)}</div>
    {!visible.length && <div className="empty-state"><Search size={28}/><h3>这里还没有找到</h3><p>换个词，或试试其他单元吧。</p></div>}
  </Sheet>;
}
