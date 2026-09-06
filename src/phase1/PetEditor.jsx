import React, { useState } from 'react';
import { Check, Heart } from 'lucide-react';
import Pet from './Pet';
import { PET_COLORS } from './petColors';
import Sheet from './Sheet';

const kinds = [{ id: 'cat', name: '小猫咪' }, { id: 'bunny', name: '软软兔' }, { id: 'dragon', name: '小暖龙' }];
export default function PetEditor({ pet, onSave, onClose }) {
  const [draft, setDraft] = useState(pet);
  return <Sheet title="我的小伙伴" subtitle="选个模样，起个名字。以后就一起玩啦！" onClose={onClose} className="pet-editor"
    footer={<button className="primary-button full-button" disabled={!draft.name.trim()} onClick={() => onSave({ ...draft, name: draft.name.trim() })}><Heart size={18}/>就选你啦，一起出发</button>}>
    <div className="pet-preview"><Pet pet={draft} mood="happy"/><span className="pet-preview-shadow"/><span className="pet-preview-name">你好呀，我是{draft.name.trim() || '你的小伙伴'}！</span></div>
    <div className="field-label">喜欢哪位小伙伴？</div><div className="pet-options">{kinds.map(kind => <button key={kind.id} aria-pressed={draft.kind === kind.id} className={draft.kind === kind.id ? 'selected' : ''} onClick={() => setDraft({ ...draft, kind: kind.id })}><Pet pet={{ ...draft, kind: kind.id }} decorative/><span>{kind.name}</span>{draft.kind === kind.id && <Check size={16} className="option-check"/>}</button>)}</div>
    <div className="color-row"><span className="field-label">再挑个颜色</span><div className="color-options">{Object.entries(PET_COLORS).map(([color, info]) => <button key={color} style={{ '--swatch': info.body }} aria-label={info.label} aria-pressed={draft.color === color} onClick={() => setDraft({ ...draft, color })}>{draft.color === color && <Check size={18}/>}</button>)}</div></div>
    <label className="name-field"><span className="field-label">给它起个名字</span><input value={draft.name} maxLength={12} placeholder="小伙伴叫什么呢？" onChange={e => setDraft({ ...draft, name: e.target.value })}/><span>最多 12 个字，之后也可以改。</span></label>
  </Sheet>;
}
