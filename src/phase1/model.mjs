export const STORAGE_KEY = 'word-buddy:phase1:v1';
export const DEFAULT_PET = { kind: 'cat', color: 'apricot', name: '糯米' };
export const lettersOf = (word) => (word.match(/[a-z]/gi) || []).map(c => c.toLowerCase());
export const wordKey = (word) => word.trim().toLowerCase().replace(/\s+/g, ' ');

export function uniqueWords(words) {
  const seen = new Set();
  return words.filter(word => {
    const key = wordKey(word.word);
    if (!lettersOf(word.word).length || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function shuffle(words, random = Math.random) {
  const result = [...words];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function challengeWords(pool, count, random = Math.random) {
  if (count !== 5 && count !== 10) throw new Error('请选择 5 或 10 个词');
  const available = uniqueWords(pool);
  if (!available.length) throw new Error('先选几个学过的单词吧');
  if (count === 10 && available.length < 10) throw new Error('还不足 10 个不同的词');
  return shuffle(available, random).slice(0, Math.min(count, available.length));
}

export function questionFor(word, random = Math.random) {
  const target = lettersOf(word.word);
  // 待选字母块：目标单词的字母乱序排列
  const tiles = shuffle(target, random);
  return { tiles, slots: target.map(() => null), cursor: 0, usedHint: false,
    showAnswer: false, mistakes: 0, status: 'answering', feedback: '', wrong: false };
}

export function createSession({ bookId, words, title, mode = 'practice', id = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}` }) {
  const valid = words.filter(w => lettersOf(w.word).length);
  if (!valid.length) throw new Error('请先选择至少一个单词');
  return { id, bookId, words: valid, title, mode, index: 0, results: [],
    question: questionFor(valid[0]), status: 'active' };
}

export function editQuestion(session, action) {
  if (session.status !== 'active' || session.question.status !== 'answering') return session;
  const q = session.question;
  const slots = [...q.slots];
  const target = lettersOf(session.words[session.index].word);
  let next = { ...q, slots, wrong: false, feedback: '' };
  const firstEmpty = () => slots.findIndex(s => s === null);

  if (action.type === 'tile') {
    // 点击待选字母块：填入第一个空位
    const ti = action.index;
    if (!Number.isInteger(ti) || ti < 0 || ti >= q.tiles.length) return session;
    if (slots.includes(ti)) return session;
    const at = firstEmpty();
    if (at === -1) return session;
    slots[at] = ti;
    next.cursor = at + 1;
  } else if (action.type === 'popSlot') {
    // 点击已填入的格子：把该字母退回待选区
    const at = action.index;
    if (!Number.isInteger(at) || at < 0 || at >= slots.length || slots[at] === null) return session;
    slots[at] = null;
    next.cursor = at;
  } else if (action.type === 'backspace') {
    // 删除键：退回最后一个已填字母
    let last = -1;
    for (let i = slots.length - 1; i >= 0; i--) { if (slots[i] !== null) { last = i; break; } }
    if (last === -1) return session;
    slots[last] = null;
    next.cursor = last;
  } else if (action.type === 'letter') {
    // 物理键盘输入：从待选区找到未使用的对应字母
    if (!/^[a-z]$/i.test(action.char)) return session;
    const char = action.char.toLowerCase();
    const ti = q.tiles.findIndex((c, idx) => c === char && !slots.includes(idx));
    if (ti === -1) return session;
    const at = firstEmpty();
    if (at === -1) return session;
    slots[at] = ti;
    next.cursor = at + 1;
  } else if (action.type === 'hint') {
    const lettersNow = slots.map(s => (s === null ? '' : q.tiles[s]));
    const i = target.findIndex((c, index) => lettersNow[index] !== c);
    if (i === -1) return session;
    let ti = q.tiles.findIndex((c, idx) => c === target[i] && !slots.includes(idx));
    if (ti === -1) {
      // 该字母被用在了错误位置：把它挪过来
      const j = slots.findIndex((s, index) => s !== null && index !== i && q.tiles[s] === target[i]);
      if (j === -1) return session;
      ti = slots[j];
      slots[j] = null;
    }
    slots[i] = ti;
    next = { ...next, usedHint: true, cursor: i + 1, feedback: `帮你补上了第 ${i + 1} 个字母，再试试看。` };
  } else if (action.type === 'reveal') {
    next = { ...next, usedHint: true, showAnswer: !q.showAnswer };
  } else return session;
  return { ...session, question: next };
}

export function submitAnswer(session) {
  if (session.status !== 'active' || session.question.status !== 'answering') return session;
  const q = session.question;
  if (q.slots.some(s => s === null)) return { ...session, question: { ...q, feedback: '还有空格，慢慢把字母填满吧。' } };
  const target = lettersOf(session.words[session.index].word);
  const letters = q.slots.map(i => q.tiles[i]);
  const wrong = target.findIndex((char, i) => letters[i] !== char);
  if (wrong !== -1) return { ...session, question: { ...q, mistakes: q.mistakes + 1, wrong: true,
    cursor: wrong, feedback: '不对哦，点一下填错的字母把它退回来，再重新选。' } };
  return { ...session, question: { ...q, status: 'correct', feedback: '', wrong: false },
    results: [...session.results, { index: session.index, wordId: session.words[session.index].id, status: 'completed' }] };
}

// 字母填满后自动判定（替代手动"拼好啦"）
export function autoCheck(session) {
  if (session.status !== 'active' || session.question.status !== 'answering') return session;
  if (session.question.slots.some(s => s === null)) return session;
  return submitAnswer(session);
}

export function advanceSession(session, skip = false) {
  if (session.status !== 'active') return session;
  if (!skip && session.question.status !== 'correct') return session;
  if (skip && session.question.status === 'correct') return session;
  const results = skip ? [...session.results, { index: session.index, wordId: session.words[session.index].id, status: 'skipped' }] : session.results;
  if (session.index + 1 >= session.words.length) return { ...session, results, status: 'finished' };
  const index = session.index + 1;
  return { ...session, index, results, question: questionFor(session.words[index]) };
}

export function defaultState(bookId) {
  return { version: 1, bookId, pet: { ...DEFAULT_PET }, sound: true, music: true, selections: {}, learned: {}, sessions: {}, challengeSelections: {}, onboarded: false, grade: null };
}

function validSession(session, bookId) {
  if (!session || session.bookId !== bookId || !Array.isArray(session.words) || !session.words.length || typeof session.id !== 'string') return false;
  if (!session.words.every(w => w && typeof w.id === 'string' && typeof w.word === 'string' && typeof w.cn === 'string' && lettersOf(w.word).length)) return false;
  if (!Number.isInteger(session.index) || session.index < 0 || session.index >= session.words.length) return false;
  const q = session.question;
  return ['active', 'finished'].includes(session.status) && q && ['answering', 'correct'].includes(q.status)
    && Array.isArray(q.tiles) && q.tiles.length === lettersOf(session.words[session.index].word).length
    && q.tiles.every(c => typeof c === 'string' && /^[a-z]$/.test(c))
    && Array.isArray(q.slots) && q.slots.length === q.tiles.length
    && q.slots.every(s => s === null || (Number.isInteger(s) && s >= 0 && s < q.tiles.length))
    && Number.isInteger(q.cursor) && q.cursor >= 0 && q.cursor <= q.slots.length
    && Array.isArray(session.results) && session.results.every(r => r && Number.isInteger(r.index) && r.index >= 0 && r.index < session.words.length && ['completed', 'skipped'].includes(r.status));
}

export function restoreState(raw, bookIds, fallback) {
  const base = defaultState(bookIds.includes(fallback) ? fallback : bookIds[0]);
  if (!raw || raw.version !== 1) return base;
  const lists = source => Object.fromEntries(Object.entries(source && typeof source === 'object' ? source : {})
    .filter(([, value]) => Array.isArray(value) && value.every(v => typeof v === 'string')));
  return { ...base,
    bookId: bookIds.includes(raw.bookId) ? raw.bookId : base.bookId,
    sound: typeof raw.sound === 'boolean' ? raw.sound : true,
    music: typeof raw.music === 'boolean' ? raw.music : true,
    pet: { kind: ['cat', 'bunny', 'dragon'].includes(raw.pet?.kind) ? raw.pet.kind : DEFAULT_PET.kind,
      color: ['apricot', 'sage', 'lilac'].includes(raw.pet?.color) ? raw.pet.color : DEFAULT_PET.color,
      name: typeof raw.pet?.name === 'string' && raw.pet.name.trim() ? raw.pet.name.trim().slice(0, 12) : DEFAULT_PET.name },
    selections: lists(raw.selections), learned: lists(raw.learned), challengeSelections: lists(raw.challengeSelections),
    sessions: Object.fromEntries(Object.entries(raw.sessions || {}).filter(([bookId, session]) => bookIds.includes(bookId) && validSession(session, bookId))),
    onboarded: typeof raw.onboarded === 'boolean' ? raw.onboarded : false,
    grade: typeof raw.grade === 'string' && raw.grade ? raw.grade : null };
}

export function appReducer(state, action) {
  if (action.type === 'preferences') return { ...state, ...action.value };
  if (action.type === 'selection') return { ...state, selections: { ...state.selections, [action.key]: action.ids } };
  if (action.type === 'challengeSelection') {
    const selections = { ...state.challengeSelections };
    if (action.ids === null) delete selections[action.bookId]; else selections[action.bookId] = action.ids;
    return { ...state, challengeSelections: selections };
  }
  if (action.type === 'start') return { ...state, sessions: { ...state.sessions, [action.session.bookId]: action.session } };
  const session = state.sessions[action.bookId];
  if (!session) return state;
  if (action.type === 'dismiss') {
    const sessions = { ...state.sessions }; delete sessions[action.bookId];
    return { ...state, sessions };
  }
  let next = session;
  if (action.type === 'edit') next = autoCheck(editQuestion(session, action.action));
  if (action.type === 'submit') next = submitAnswer(session);
  if (action.type === 'next') next = advanceSession(session);
  if (action.type === 'skip') next = advanceSession(session, true);
  if (next === session) return state;
  let learned = state.learned;
  if (next.question.status === 'correct' && session.question.status !== 'correct') {
    learned = { ...learned, [action.bookId]: [...new Set([...(learned[action.bookId] || []), session.words[session.index].id])] };
  }
  return { ...state, learned, sessions: { ...state.sessions, [action.bookId]: next } };
}
