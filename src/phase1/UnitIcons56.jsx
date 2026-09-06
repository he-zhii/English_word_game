// 五年级、六年级单元自定义图标
// 统一视觉语言：32×32 画布、柔和填充色 + 深色描边、2px 线宽、圆角端点
// 图标在 .unit-icon 容器（48×45px / 38×38px）内居中显示

const STROKE = {
  people: '#2c5f74',
  family: '#8b3a3a',
  schedule: '#236a6e',
  health: '#3b6d2c',
  habits: '#5a4b8c',
  food: '#a67c2e',
  china: '#3a7a53',
  world: '#5e4b8c',
  sports: '#9b3a3a',
  services: '#2d6a8f',
  space: '#9b6b2f',
  eco: '#2a7a5c'
};

const sharedProps = {
  width: '100%',
  height: '100%',
  viewBox: '0 0 32 32',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg'
};

export function G5U1People(props) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="16" cy="8" r="4" fill="#7ec8e3" stroke={STROKE.people} strokeWidth="2" />
      <path d="M12 28v-5a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v5" fill="#a8dcf0" stroke={STROKE.people} strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="11" r="3" fill="#7ec8e3" stroke={STROKE.people} strokeWidth="1.5" />
      <path d="M3 26v-3a3 3 0 0 1 3-3h0" fill="none" stroke={STROKE.people} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="26" cy="11" r="3" fill="#7ec8e3" stroke={STROKE.people} strokeWidth="1.5" />
      <path d="M29 26v-3a3 3 0 0 0-3-3h0" fill="none" stroke={STROKE.people} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 2l1.5 3.2h3.5l-2.8 2.5 1.1 3.4L16 8.2l-3.3 2.9 1.1-3.4L11 5.2h3.5L16 2z" fill="#ffd36e" stroke={STROKE.people} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function G5U2Family(props) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M16 29c7.18 0 13-5.82 13-13S23.18 3 16 3 3 8.82 3 16s5.82 13 13 13z" fill="#f4a9a8" stroke={STROKE.family} strokeWidth="2" />
      <path d="M10 21c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={STROKE.family} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 14c0-1.1.9-2 2-2m4 2c0-1.1-.9-2-2-2" stroke={STROKE.family} strokeWidth="2" strokeLinecap="round" />
      <path d="M9 12l-2-2m18 2l2-2" stroke={STROKE.family} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function G5U3Schedule(props) {
  return (
    <svg {...sharedProps} {...props}>
      <rect x="4" y="5" width="24" height="22" rx="4" fill="#7dd3d8" stroke={STROKE.schedule} strokeWidth="2" />
      <path d="M4 12h24" stroke={STROKE.schedule} strokeWidth="2" />
      <path d="M10 5v4m12-4v4" stroke={STROKE.schedule} strokeWidth="2" strokeLinecap="round" />
      <rect x="8" y="16" width="5" height="4" rx="1" fill="#e6fafa" stroke={STROKE.schedule} strokeWidth="1.5" />
      <rect x="15" y="16" width="9" height="4" rx="1" fill="#e6fafa" stroke={STROKE.schedule} strokeWidth="1.5" />
      <circle cx="22" cy="9" r="2" fill="#e6fafa" />
    </svg>
  );
}

export function G5U4Health(props) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="16" cy="17" r="10" fill="#a3d977" stroke={STROKE.health} strokeWidth="2" />
      <path d="M16 12v10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M11 17h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M23 7c2-1 4.5.5 3.5 3-1 2-3.5 3.5-3.5 3.5" fill="none" stroke={STROKE.health} strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="7" r="2.5" fill="#c7e9af" stroke={STROKE.health} strokeWidth="1.5" />
    </svg>
  );
}

export function G5U5Habits(props) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="16" cy="16" r="11" fill="#c5b9e8" stroke={STROKE.habits} strokeWidth="2" />
      <circle cx="16" cy="16" r="6" fill="#e8e0f7" stroke={STROKE.habits} strokeWidth="1.5" />
      <path d="M16 12v4.5l3 1.5" stroke={STROKE.habits} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 7l2 2M24 7l-2 2M16 3v3" stroke={STROKE.habits} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 16H3m26 0h-3" stroke={STROKE.habits} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 25l2-2M24 25l-2-2M16 29v-3" stroke={STROKE.habits} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function G5U6Food(props) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M6 14c0-5.5 4.5-10 10-10s10 4.5 10 10v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V14z" fill="#f9d48f" stroke={STROKE.food} strokeWidth="2" />
      <path d="M10 20c2 2 6 2 8 0" stroke={STROKE.food} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 7v6m4-6v6" stroke={STROKE.food} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="10" rx="2" ry="3" fill="#ffe9b3" stroke={STROKE.food} strokeWidth="1.5" />
      <path d="M4 12l3-2" stroke={STROKE.food} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function G6U1China(props) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M3 27h26" stroke={STROKE.china} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 27V17h4v10m5-10h4v10h-4V17z" fill="#9fd9b1" stroke={STROKE.china} strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 17l4.5-5 4.5 5" fill="none" stroke={STROKE.china} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 17l4.5-5 4.5 5" fill="none" stroke={STROKE.china} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="25" cy="8" r="3" fill="#fff1a8" stroke={STROKE.china} strokeWidth="1.5" />
      <path d="M22 12c-2 1-3 3-3 5" stroke={STROKE.china} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function G6U2World(props) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="16" cy="17" r="11" fill="#bfa9e6" stroke={STROKE.world} strokeWidth="2" />
      <path d="M7 17c0-5 4-9 9-9s9 4 9 9" stroke="#e8e0f7" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M16 8v18" stroke="#e8e0f7" strokeWidth="2" />
      <path d="M5 17h22" stroke="#e8e0f7" strokeWidth="2" />
      <path d="M19 5l-1 3h3l-2.5 2 1 3L19 11l-2.5 2 1-3L15 8h3l-1-3h2z" fill="#ffd36e" stroke={STROKE.world} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function G6U3Sports(props) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M16 29c6.63 0 12-5.37 12-12S22.63 5 16 5 4 10.37 4 17s5.37 12 12 12z" fill="#f2a9a9" stroke={STROKE.sports} strokeWidth="2" />
      <path d="M16 10l1.8 3.7h4l-3.2 2.8 1.2 3.9L16 17l-3.8 3.4 1.2-3.9-3.2-2.8h4L16 10z" fill="#ffd36e" stroke={STROKE.sports} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 24c1.5-2 3.5-3 6-3s4.5 1 6 3" stroke={STROKE.sports} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 7l3-2" stroke={STROKE.sports} strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="6" r="2" fill="#ffd36e" stroke={STROKE.sports} strokeWidth="1.5" />
    </svg>
  );
}

export function G6U4Services(props) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M7 12h18l-2 14H9L7 12z" fill="#9fd4f4" stroke={STROKE.services} strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 12c0-4 2.5-7 5-7s5 3 5 7" fill="none" stroke={STROKE.services} strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="9" r="5" fill="#dff1fc" stroke={STROKE.services} strokeWidth="1.8" />
      <path d="M21 7v4m-2-2h4" stroke={STROKE.services} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 18h4" stroke={STROKE.services} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function G6U5Space(props) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M8 27l6-20 6 20H8z" fill="#f4c98d" stroke={STROKE.space} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 27l3-10 3 10" fill="none" stroke={STROKE.space} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="9" r="4" fill="#eaddcf" stroke={STROKE.space} strokeWidth="1.8" />
      <path d="M18 9c0-2.2 1.8-4 4-4" stroke={STROKE.space} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="10" r="2.5" fill="#ffd36e" stroke={STROKE.space} strokeWidth="1.5" />
      <circle cx="26" cy="22" r="2" fill="#ffd36e" stroke={STROKE.space} strokeWidth="1.5" />
    </svg>
  );
}

export function G6U6Eco(props) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="16" cy="17" r="11" fill="#8fd9b6" stroke={STROKE.eco} strokeWidth="2" />
      <path d="M16 26V12" stroke="#e0f7ea" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 19c-3-2-4.5-5-4-8 .3-2 2-3.5 2-3.5s1.7 1.5 2 3.5c.5 3-1 6-4 8" fill="#b8e8cc" stroke={STROKE.eco} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 17c3-1.5 5-4 4.5-7-.3-1.5-1.5-2.5-1.5-2.5s-1.2 1-1.5 2.5c-.5 3-2.5 5.5-4.5 7" fill="#b8e8cc" stroke={STROKE.eco} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M25 8l2-1" stroke={STROKE.eco} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="27" cy="7" r="1.8" fill="#ffd36e" stroke={STROKE.eco} strokeWidth="1.5" />
    </svg>
  );
}
