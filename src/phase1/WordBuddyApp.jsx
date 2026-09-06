import React, { useEffect, useReducer, useState } from 'react';
import { ArrowRight, BookOpen, Play } from 'lucide-react';
import { appReducer, challengeWords, createSession, restoreState, STORAGE_KEY, uniqueWords } from './model.mjs';
import { loadCatalog } from './catalog';
import { stopSpeech } from './speech';
import Home from './Home';
import Sheet from './Sheet';
import WordPicker from './WordPicker';
import PetEditor from './PetEditor';
import BrawlSetup from './BrawlSetup';
import Practice, { Finished } from './Practice';
import Onboarding from './Onboarding';
import BackgroundMusic from '../components/ui/BackgroundMusic.jsx';
import './styles.css';

function readSaved(books) {
  let raw, fallback;
  try { raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); fallback = localStorage.getItem('spelling_book_id_v12.0'); } catch { /* Start safely if storage is unavailable. */ }
  return restoreState(raw, books.map(b => b.id), fallback);
}

export default function WordBuddyApp() {
  const [books] = useState(loadCatalog);
  const [state, dispatch] = useReducer(appReducer, books, readSaved);
  const [view, setView] = useState('home');
  const [panel, setPanel] = useState(null);
  const [count, setCount] = useState(5);
  const [pending, setPending] = useState(null);
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    let failed = false;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { failed = true; }
    // Report the result of synchronizing state with browser storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageFailed(failed);
    const petName = state.pet?.name?.trim() || '糯米';
    document.title = `${petName}单词屋`;
  }, [state]);
  const book = books.find(b => b.id === state.bookId) || books[0];
  const words = book.units.flatMap(u => u.words);
  const learned = state.learned[book.id] || [];
  const session = state.sessions[book.id];
  const manual = Object.hasOwn(state.challengeSelections, book.id);
  const poolIds = manual ? state.challengeSelections[book.id] : learned;
  const pool = uniqueWords(words.filter(w => poolIds.includes(w.id)));
  const goHome = () => { stopSpeech(); setView('home'); setPanel(null); window.scrollTo(0, 0); };
  const launch = next => { stopSpeech(); dispatch({ type: 'start', session: next }); setPanel(null); setPending(null); setView('practice'); window.scrollTo(0, 0); };
  const start = (selected, title, mode = 'practice') => {
    if (!selected.length) return;
    const next = createSession({ bookId: book.id, words: selected, title, mode });
    if (session?.status === 'active') { setPending(next); setPanel({ type: 'replace' }); } else launch(next);
  };
  const action = (type, rest = {}) => dispatch({ type, bookId: book.id, ...rest });
  const toggleSound = () => { stopSpeech(); dispatch({ type: 'preferences', value: { sound: !state.sound } }); };
  const toggleMusic = () => { dispatch({ type: 'preferences', value: { music: !state.music } }); };
  const picker = (unit, challenge = false) => {
    const key = `${book.id}:${unit?.id || 'quick'}`;
    setPanel({ type: 'words', unitId: unit?.id, key, challenge,
      initialIds: challenge ? pool.map(w => w.id) : state.selections[key] || (unit ? unit.words.map(w => w.id) : []) });
  };
  const closePanel = () => { if (panel?.type === 'words' && panel.challenge) setPanel({ type: 'brawl' }); else { setPanel(null); setPending(null); } };
  const resume = () => { setPanel(null); setPending(null); setView('practice'); window.scrollTo(0, 0); };
  const finishOnboarding = ({ grade, pet }) => dispatch({ type: 'preferences', value: { onboarded: true, grade, pet } });
  return <div className="wb-app">
    <BackgroundMusic music={state.music} paused={view === 'practice'}/>
    {!state.onboarded && <Onboarding defaultPet={state.pet} onComplete={finishOnboarding}/>}
    {state.onboarded && <>
      {storageFailed && <div className="storage-warning" role="alert">浏览器暂时无法保存进度。可以继续练习，请先不要关闭页面。</div>}
      {view === 'practice' && session ? session.status === 'finished' ? <Finished session={session} pet={state.pet} onHome={goHome}
        onRetry={() => start(session.words, session.title, session.mode)} onSkipped={() => start(session.results.filter(r => r.status === 'skipped').map(r => session.words[r.index]), '再试几个单词')}/>
        : <Practice key={`${session.id}:${session.index}`} session={session} pet={state.pet} sound={state.sound} music={state.music} onMusic={toggleMusic}
          onEdit={edit => action('edit', { action: edit })} onNext={() => action('next')} onSkip={() => action('skip')} onHome={goHome}/>
        : <Home books={books} book={book} pet={state.pet} music={state.music} session={session} learned={learned} onPet={() => setPanel({ type: 'pet' })}
          onMusic={toggleMusic} onBook={bookId => { stopSpeech(); dispatch({ type: 'preferences', value: { bookId } }); setPanel(null); setCount(5); }} onUnit={unit => picker(unit)} onQuick={() => picker()}
          onBrawl={() => { setCount(5); setPanel({ type: 'brawl' }); }} onResume={resume}/>}
      {panel?.type === 'pet' && <PetEditor pet={state.pet} onClose={closePanel} onSave={pet => { dispatch({ type: 'preferences', value: { pet } }); setPanel(null); }}/>}
      {panel?.type === 'words' && <WordPicker key={panel.key} book={book} unitId={panel.unitId} initialIds={panel.initialIds} challenge={panel.challenge} onClose={closePanel}
        onApply={(selected, ids) => {
          if (panel.challenge) { dispatch({ type: 'challengeSelection', bookId: book.id, ids }); if (selected.length < 10) setCount(5); setPanel({ type: 'brawl' }); }
          else { dispatch({ type: 'selection', key: panel.key, ids }); const unitIds = new Set(selected.map(w => w.unitId)); const unit = unitIds.size === 1 ? book.units.find(u => u.id === selected[0].unitId) : null; start(selected, unit ? `Unit ${unit.id} · ${unit.title}` : '自己挑的小练习'); }
        }}/>}
      {panel?.type === 'brawl' && <BrawlSetup pool={pool} count={count} manual={manual} onCount={setCount} onClose={closePanel} onAdjust={() => picker(null, true)}
        onDefault={() => { dispatch({ type: 'challengeSelection', bookId: book.id, ids: null }); setCount(5); }} onStart={() => { if (!pool.length || (count === 10 && pool.length < 10)) return; const selected = challengeWords(pool, count); start(selected, `${selected.length} 词${selected.length < 5 ? '热身' : '大乱斗'}`, 'brawl'); }}/>}
      {panel?.type === 'replace' && <Sheet title="上次的练习还在这里" subtitle="已经练过的单词会保留。开始新一组，会替换这次未完成的进度。" onClose={closePanel}
        footer={<><button className="secondary-button" onClick={resume}><Play size={17}/>继续上次</button><button className="primary-button" onClick={() => launch(pending)}>开始这组<ArrowRight size={17}/></button></>}>
        <div className="saved-session"><BookOpen size={30}/><div><strong>{session?.title}</strong><p>第 {(session?.index || 0) + 1} / {session?.words.length} 个词，随时可以接着练。</p></div></div>
      </Sheet>}
    </>}
  </div>;
}
