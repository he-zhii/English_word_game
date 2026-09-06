import React, { useId } from 'react';
import { PET_COLORS } from './petColors';

export default function Pet({ pet, mood = 'idle', className = '', decorative = false }) {
  const uid = useId();
  const colors = PET_COLORS[pet.color] || PET_COLORS.apricot;
  const happy = mood === 'happy' || mood === 'celebrate';
  return <svg viewBox="0 0 280 260" className={`pet-art pet-${mood} ${className}`} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : `${pet.name}${happy ? '开心地为你庆祝' : '正在陪伴你'}`}>
    <defs>
      <linearGradient id={`${uid}-body`} x1="0" y1="0" x2=".7" y2="1"><stop stopColor={colors.body}/><stop offset="1" stopColor={colors.dark}/></linearGradient>
      <radialGradient id={`${uid}-belly`}><stop stopColor="#fffaf0"/><stop offset="1" stopColor={colors.light}/></radialGradient>
    </defs>
    <ellipse cx="141" cy="233" rx="73" ry="13" fill="#776652" opacity=".11"/>
    <g className="pet-body">
      {pet.kind === 'cat' && <path d="M190 184c68 24 65-52 35-49-18 2-15 22-4 24" fill="none" stroke={colors.dark} strokeWidth="24" strokeLinecap="round" className="pet-tail"/>}
      {pet.kind === 'dragon' && <><path d="M188 191c42 26 69-4 61-47-9 23-23 27-38 14" fill={colors.dark}/><path d="m237 158 14-14-1 26" fill={colors.light}/><path d="M85 169c-38-55-58-15-57 8 14-10 27-2 31 7" fill={colors.body} stroke={colors.dark} strokeWidth="3"/><path d="M194 169c38-55 58-15 57 8-14-10-27-2-31 7" fill={colors.body} stroke={colors.dark} strokeWidth="3"/></>}
      {pet.kind === 'bunny' && <circle cx="205" cy="190" r="23" fill={colors.light}/>}
      <ellipse cx="140" cy="177" rx="64" ry="56" fill={`url(#${uid}-body)`}/>
      <ellipse cx="140" cy="183" rx="39" ry="37" fill={`url(#${uid}-belly)`}/>
      <ellipse cx="103" cy="222" rx="28" ry="15" fill={colors.body}/><ellipse cx="177" cy="222" rx="28" ry="15" fill={colors.body}/>
      <g className="pet-head">
        {pet.kind === 'cat' && <><path d="M72 104 64 33q-2-17 14-9l46 30M156 55l45-31q16-8 14 9l-7 71" fill={colors.body} stroke={colors.dark} strokeWidth="2"/><path d="m77 68-4-30 26 21M181 60l22-22-4 31" fill="#e5a394"/></>}
        {pet.kind === 'bunny' && <><ellipse cx="109" cy="53" rx="20" ry="49" transform="rotate(-13 109 53)" fill={colors.body}/><ellipse cx="174" cy="52" rx="20" ry="49" transform="rotate(15 174 52)" fill={colors.body}/><ellipse cx="109" cy="50" rx="9" ry="34" transform="rotate(-13 109 50)" fill="#e5acaa"/><ellipse cx="174" cy="48" rx="9" ry="33" transform="rotate(15 174 48)" fill="#e5acaa"/></>}
        {pet.kind === 'dragon' && <><path d="M86 73Q62 29 89 37l25 32M164 62q40-43 30-9l-6 26" fill={colors.light} stroke={colors.dark} strokeWidth="3"/><path d="m125 57 14-26 15 30" fill={colors.dark}/></>}
        <path d="M62 116c0-50 34-67 78-67s78 18 78 67c0 41-32 58-78 58s-78-17-78-58" fill={`url(#${uid}-body)`}/>
        {pet.kind === 'cat' && <><path d="m128 54 5 17m10-18v19m11-17-3 15" stroke={colors.dark} strokeWidth="5" strokeLinecap="round"/><path d="m69 117 14 4m-13 7 13 2m115-9 15-4m-14 13 13-2" stroke={colors.dark} strokeWidth="3" strokeLinecap="round"/></>}
        <ellipse cx="140" cy="137" rx="35" ry="24" fill={colors.light}/>
        <ellipse cx="90" cy="128" rx="13" ry="8" fill="#ed8f88" opacity=".43"/><ellipse cx="190" cy="128" rx="13" ry="8" fill="#ed8f88" opacity=".43"/>
        {happy ? <g fill="none" stroke="#514536" strokeWidth="5" strokeLinecap="round"><path d="M101 113q8-11 16 0M163 113q8-11 16 0"/></g> : <g className="pet-eyes" fill="#514536"><ellipse cx="109" cy="113" rx="6" ry="9"/><ellipse cx="171" cy="113" rx="6" ry="9"/><circle cx="111" cy="110" r="2" fill="#fff"/><circle cx="173" cy="110" r="2" fill="#fff"/></g>}
        <path d="M134 127q6-5 12 0l-6 6Z" fill="#715247"/>
        {happy ? <path d="M128 138q12 21 24 0" fill="#956052" stroke="#715247" strokeWidth="2"/> : <path d="M140 133v5m-12 0q6 9 12 0 6 9 12 0" fill="none" stroke="#715247" strokeWidth="2.5" strokeLinecap="round"/>}
      </g>
      <path d="M91 158q46 20 96-1l-8 18q-43 17-80-1Z" fill="#698a71"/><path d="m162 175 16-2 9 25-16 8Z" fill="#587b63"/><path d="m173 187 10-4" stroke="#e6e6b9" strokeWidth="3"/>
      <ellipse cx="82" cy="184" rx="17" ry="26" transform={happy ? 'rotate(60 82 184)' : 'rotate(-18 82 184)'} fill={colors.body} className="pet-paw"/>
      <ellipse cx="199" cy="179" rx="17" ry="26" transform={happy ? 'rotate(-60 199 179)' : 'rotate(22 199 179)'} fill={colors.body}/>
      {happy && <g fill="#dfab4e" className="pet-sparkles"><path d="m42 75 4-12 5 12 12 5-12 4-5 12-4-12-12-4ZM232 54l4-10 4 10 11 4-11 4-4 11-4-11-10-4Z"/><circle cx="43" cy="117" r="4"/><circle cx="235" cy="103" r="3"/></g>}
    </g>
  </svg>;
}
