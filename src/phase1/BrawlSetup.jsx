import React from 'react';
import { ArrowRight, Check, ListChecks, Shuffle, Sparkles, Zap } from 'lucide-react';
import Sheet from './Sheet';

export default function BrawlSetup({ pool, manual, count, onCount, onAdjust, onDefault, onStart, onClose }) {
  return <Sheet title="来一场单词大乱斗" subtitle="都是学过的词，按自己的节奏来。" onClose={onClose}
    footer={<button className="primary-button full-button green-button" disabled={!pool.length || (count === 10 && pool.length < 10)} onClick={onStart}>开始 {Math.min(count, pool.length)} 词{pool.length < 5 ? '热身' : '挑战'}<ArrowRight size={19}/></button>}>
    <div className="challenge-banner"><span><Shuffle size={32}/></span><div><strong>小挑战，也有小惊喜</strong><p>没有倒计时，想一想再拼。</p></div></div>
    <div className="field-label">这次想挑战几个词？</div><div className="challenge-counts">{[5, 10].map(n => <button key={n} aria-pressed={count === n} disabled={n === 10 && pool.length < 10} className={count === n ? 'selected' : ''} onClick={() => onCount(n)}>{n === 5 ? <Zap size={23}/> : <Sparkles size={23}/>}<strong>{n}<small>词</small></strong><span>{n === 5 ? '轻松来一组' : pool.length < 10 ? '范围内需要 10 个词' : '多一点小挑战'}</span>{count === n && <Check size={17} className="option-check"/>}</button>)}</div>
    <div className="challenge-scope"><div><strong>{manual ? '自己勾选的范围' : '游戏里练过的词'}</strong><p>当前有 {pool.length} 个不同的词</p></div><button className="text-button" onClick={onAdjust}><ListChecks size={15}/>调整范围</button></div>
    {manual && <button className="text-button scope-reset" onClick={onDefault}>改用全部练过的词</button>}
    {!pool.length ? <div className="friendly-note">还没有练过的词？点“调整范围”，把课堂上已经学过的词勾选进来，也可以先去练一个单元。</div> : pool.length < 5 ? <div className="friendly-note">现在有 {pool.length} 个词，就先来一场 {pool.length} 词热身吧。</div> : <p className="small-note">随机抽取，不重复。需要帮助时，提示也一直在。</p>}
  </Sheet>;
}
