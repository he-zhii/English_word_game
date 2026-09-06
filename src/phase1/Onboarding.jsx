import React, { useState } from 'react';
import { ArrowRight, Check, Heart, Sparkles, Star, User } from 'lucide-react';
import Pet from './Pet';
import { PET_COLORS } from './petColors';

const steps = ['welcome', 'grade', 'buddy', 'name'];
const grades = [
  { id: '1', label: '一年级' },
  { id: '2', label: '二年级' },
  { id: '3', label: '三年级' },
  { id: '4', label: '四年级' },
  { id: '5', label: '五年级' },
  { id: '6', label: '六年级' },
];
const kinds = [
  { id: 'cat', name: '小猫咪', intro: '机灵又粘人' },
  { id: 'bunny', name: '软软兔', intro: '温柔有耐心' },
  { id: 'dragon', name: '小暖龙', intro: '勇敢爱鼓励' },
];

function StepDots({ step }) {
  return <div className="onboarding-dots" aria-hidden="true">
    {steps.map(s => <span key={s} className={s === step ? 'active' : ''}/>)}
  </div>;
}

export default function Onboarding({ defaultPet, onComplete }) {
  const [step, setStep] = useState('welcome');
  const [grade, setGrade] = useState(null);
  const [kind, setKind] = useState(defaultPet?.kind || 'cat');
  const [color, setColor] = useState(defaultPet?.color || 'apricot');
  const [name, setName] = useState(defaultPet?.name || '糯米');

  const pet = { kind, color, name: name.trim() || '糯米' };
  const canGoNext = step === 'grade' ? !!grade : step === 'name' ? name.trim().length > 0 : true;

  const next = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
    else onComplete({ grade, pet: { kind, color, name: name.trim() || '糯米' } });
  };

  return <div className="onboarding">
    <div className="onboarding-card">
      <StepDots step={step}/>

      {step === 'welcome' && <div className="onboarding-step">
        <div className="onboarding-hero">
          <div className="onboarding-icon"><Sparkles size={38} fill="currentColor"/></div>
          <h1>欢迎来到糯米单词屋</h1>
          <p>选几个课本单词，和糯米一起拼拼看。<br/>轻松练习、听发音，还有小挑战。</p>
        </div>
        <div className="onboarding-note">
          <Star size={14}/>
          <span>只要 3 步，就能布置好你的单词小屋。</span>
        </div>
        <button className="primary-button full-button" onClick={next}>开始设置<ArrowRight size={18}/></button>
      </div>}

      {step === 'grade' && <div className="onboarding-step">
        <div className="onboarding-hero compact">
          <div className="onboarding-icon small"><User size={26} fill="currentColor"/></div>
          <h1>你正在读几年级？</h1>
          <p>我们会根据年级推荐合适的练习内容。</p>
        </div>
        <div className="grade-grid" role="radiogroup" aria-label="选择年级">
          {grades.map(g => <button key={g.id} role="radio" aria-checked={grade === g.id}
            className={`grade-button ${grade === g.id ? 'selected' : ''}`}
            data-number={g.id}
            onClick={() => setGrade(g.id)}>
            {g.label}{grade === g.id && <Check size={16} className="option-check"/>}
          </button>)}
        </div>
        <button className="primary-button full-button" disabled={!canGoNext} onClick={next}>下一步<ArrowRight size={18}/></button>
      </div>}

      {step === 'buddy' && <div className="onboarding-step">
        <div className="onboarding-hero compact">
          <div className="pet-preview mini"><Pet pet={pet} mood="happy"/></div>
          <h1>选一个学习小伙伴</h1>
          <p>它会陪你一起闯关、一起进步。</p>
        </div>
        <div className="pet-options tall">
          {kinds.map(k => <button key={k.id} className={kind === k.id ? 'selected' : ''} onClick={() => setKind(k.id)}>
            <Pet pet={{ ...pet, kind: k.id }} decorative/>
            <span className="kind-name">{k.name}</span>
            <span className="kind-intro">{k.intro}</span>
            {kind === k.id && <Check size={16} className="option-check"/>}
          </button>)}
        </div>
        <div className="color-row"><span className="field-label">再挑个颜色</span>
          <div className="color-options">
            {Object.entries(PET_COLORS).map(([c, info]) => <button key={c} style={{ '--swatch': info.body }} aria-label={info.label} aria-pressed={color === c} onClick={() => setColor(c)}>{color === c && <Check size={18}/>}</button>)}
          </div>
        </div>
        <button className="primary-button full-button" onClick={next}>下一步<ArrowRight size={18}/></button>
      </div>}

      {step === 'name' && <div className="onboarding-step">
        <div className="onboarding-hero compact">
          <div className="pet-preview mini"><Pet pet={pet} mood="happy"/></div>
          <h1>给它起个名字</h1>
          <p>默认叫「糯米」，你也可以改成喜欢的名字。</p>
        </div>
        <label className="name-field">
          <span className="field-label">小伙伴的名字</span>
          <input value={name} maxLength={12} placeholder="叫什么名字呢？" onChange={e => setName(e.target.value)}/>
          <span>最多 12 个字，以后随时可以改。</span>
        </label>
        <button className="primary-button full-button green-button" disabled={!canGoNext} onClick={next}>
          <Heart size={18}/>完成设置，进入单词屋
        </button>
      </div>}
    </div>
  </div>;
}
