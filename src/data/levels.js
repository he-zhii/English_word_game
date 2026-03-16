// 小精灵主题等级系统数据

export const LEVELS = [
  {
    level: 1,
    name: '精灵蛋',
    minScore: 0,
    maxScore: 99,
    icon: '🥚',
    color: 'from-amber-300 to-amber-500',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600',
    message: '一颗神秘的精灵蛋，等待被唤醒...'
  },
  {
    level: 2,
    name: '小精灵',
    minScore: 100,
    maxScore: 299,
    icon: '🐣',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    message: '小精灵破壳而出，好奇地打量世界~'
  },
  {
    level: 3,
    name: '精灵学徒',
    minScore: 300,
    maxScore: 699,
    icon: '🦋',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    message: '小精灵长出了美丽的翅膀！'
  },
  {
    level: 4,
    name: '精灵战士',
    minScore: 700,
    maxScore: 1499,
    icon: '🦄',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    message: '小精灵进化成神奇的独角兽！'
  },
  {
    level: 5,
    name: '精灵王',
    minScore: 1500,
    maxScore: 2999,
    icon: '👑',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    message: '小精灵戴上了闪亮的王冠！'
  },
  {
    level: 6,
    name: '精灵传说',
    minScore: 3000,
    maxScore: Infinity,
    icon: '🌟',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-600',
    message: '传说中的精灵！所有人都为你欢呼！'
  }
];

export const getCurrentLevel = (score) => {
  return LEVELS.find(l => score >= l.minScore && score <= l.maxScore) || LEVELS[0];
};

export const getNextLevel = (score) => {
  return LEVELS.find(l => score < l.minScore) || null;
};

export const getLevelProgress = (score) => {
  const current = getCurrentLevel(score);
  const next = getNextLevel(score);
  if (!next) return 100;

  const range = current.maxScore - current.minScore + 1;
  const currentProgress = score - current.minScore;
  return Math.min(100, Math.max(0, (currentProgress / range) * 100));
};

export const hasLevelUp = (oldScore, newScore) => {
  const oldLevel = getCurrentLevel(oldScore);
  const newLevel = getCurrentLevel(newScore);
  return oldLevel.level !== newLevel.level;
};