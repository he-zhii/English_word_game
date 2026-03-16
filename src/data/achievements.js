// 小精灵主题成就数据定义

export const ACHIEVEMENTS_DATA = [
  // 🌱 孵化篇 - 初识魔法
  {
    id: 'first_egg',
    title: '魔法初现',
    desc: '拼对第一个单词，小精灵蛋开始发光',
    message: '哇！你拼对了第一个单词，小精灵蛋在发光呢！',
    icon: '🥚',
    type: 'hatch',
    rarity: 'common',
    condition: (s) => s.totalWords >= 1
  },
  {
    id: 'egg_hatch',
    title: '破壳而出',
    desc: '累计拼对5个单词',
    message: '咔嚓！小精灵破壳而出，它好喜欢你~',
    icon: '🐣',
    type: 'hatch',
    rarity: 'common',
    condition: (s) => s.totalWords >= 5
  },
  {
    id: 'first_friend',
    title: '第一个朋友',
    desc: '完成第一个单元的学习',
    message: '小精灵交了第一个单词朋友，真开心！',
    icon: '🤝',
    type: 'hatch',
    rarity: 'common',
    condition: (s) => s.unitsCompleted >= 1
  },
  {
    id: 'magic_spark',
    title: '魔法火花',
    desc: '第一次使用提示功能',
    message: '噗！小精灵学会了第一个魔法——提示术！',
    icon: '✨',
    type: 'hatch',
    rarity: 'common',
    condition: (s) => s.totalHints >= 1
  },
  {
    id: 'tiny_wings',
    title: '小小翅膀',
    desc: '累计拼对10个单词',
    message: '小精灵长出小翅膀啦，可以飞得更高~',
    icon: '🦋',
    type: 'hatch',
    rarity: 'common',
    condition: (s) => s.totalWords >= 10
  },

  // 🔥 成长篇 - 魔法修炼（连击）
  {
    id: 'happy_dance',
    title: '开心跳舞',
    desc: '连续答对3次',
    message: '小精灵高兴地跳起了舞！连对3次啦~',
    icon: '💃',
    type: 'growth',
    rarity: 'common',
    condition: (s) => s.maxStreak >= 3
  },
  {
    id: 'magic_burst',
    title: '魔法爆发',
    desc: '连续答对10次',
    message: '轰！小精灵喷出彩虹魔法！连对10次！',
    icon: '🌈',
    type: 'growth',
    rarity: 'rare',
    condition: (s) => s.maxStreak >= 10
  },
  {
    id: 'super_evolve',
    title: '超级进化',
    desc: '连续答对30次',
    message: '小精灵进化成超级形态！太厉害了！',
    icon: '🦄',
    type: 'growth',
    rarity: 'epic',
    condition: (s) => s.maxStreak >= 30
  },
  {
    id: 'legend_aura',
    title: '传说光环',
    desc: '连续答对100次',
    message: '小精灵周身环绕金色光芒，传说中的精灵王！',
    icon: '👑',
    type: 'growth',
    rarity: 'legendary',
    condition: (s) => s.maxStreak >= 100
  },

  // 📚 成长篇 - 魔法修炼（累计）
  {
    id: 'half_magic',
    title: '魔法半满',
    desc: '累计拼对50个单词',
    message: '小精灵的魔法书填了一半啦！50个单词~',
    icon: '📖',
    type: 'growth',
    rarity: 'common',
    condition: (s) => s.totalWords >= 50
  },
  {
    id: 'full_book',
    title: '魔法书满',
    desc: '累计拼对100个单词',
    message: '叮！第一本魔法书写满啦！100个单词！',
    icon: '📚',
    type: 'growth',
    rarity: 'rare',
    condition: (s) => s.totalWords >= 100
  },
  {
    id: 'library_start',
    title: '魔法图书馆',
    desc: '累计拼对300个单词',
    message: '小精灵开始建图书馆啦！300个单词！',
    icon: '🏛️',
    type: 'growth',
    rarity: 'epic',
    condition: (s) => s.totalWords >= 300
  },
  {
    id: 'word_master',
    title: '词汇大师',
    desc: '累计拼对500个单词',
    message: '小精灵成为了词汇大师！太厉害了！',
    icon: '🎓',
    type: 'growth',
    rarity: 'legendary',
    condition: (s) => s.totalWords >= 500
  },
  {
    id: 'thousand_words',
    title: '千词王者',
    desc: '累计拼对1000个单词',
    message: '小精灵收集了一千个单词！你是真正的王者！',
    icon: '🏆',
    type: 'growth',
    rarity: 'legendary',
    condition: (s) => s.totalWords >= 1000
  },

  // 🎪 趣味篇 - 小精灵的恶作剧
  {
    id: 'oopsie',
    title: '哎呀失误',
    desc: '第一次拼错单词',
    message: '哎呀！小精灵绊倒了~ 不过没关系，再来一次！',
    icon: '🙈',
    type: 'funny',
    rarity: 'common',
    condition: (s) => s.totalMistakes >= 1
  },
  {
    id: 'silly_buddy',
    title: '调皮伙伴',
    desc: '累计拼错20次',
    message: '小精灵做鬼脸：你已经错了20次啦，但我们还是朋友~',
    icon: '😜',
    type: 'funny',
    rarity: 'common',
    condition: (s) => s.totalMistakes >= 20
  },
  {
    id: 'stubborn_one',
    title: '倔强单词',
    desc: '同一个单词拼错3次',
    message: '小精灵挠头：这个单词好难哦，我们多试几次！',
    icon: '🤔',
    type: 'funny',
    rarity: 'rare',
    condition: (s) => s.sameWordMistakes >= 3
  },
  {
    id: 'hint_hug',
    title: '精灵抱抱',
    desc: '使用提示10次',
    message: '小精灵抱抱你：需要帮助就告诉我哦~',
    icon: '🤗',
    type: 'funny',
    rarity: 'common',
    condition: (s) => s.totalHints >= 10
  },
  {
    id: 'magic_overload',
    title: '魔法过载',
    desc: '使用提示30次',
    message: '小精灵转圈圈：哇！用了好多提示魔法~',
    icon: '🌀',
    type: 'funny',
    rarity: 'rare',
    condition: (s) => s.totalHints >= 30
  },
  {
    id: 'nap_time',
    title: '小憩时光',
    desc: '单次学习超过20分钟',
    message: '小精灵打哈欠：学了这么久，休息一下吧~',
    icon: '😴',
    type: 'funny',
    rarity: 'common',
    condition: (s) => s.sessionMinutes >= 20
  },

  // ⚔️ 挑战篇 - 精灵大乱斗
  {
    id: 'brawl_ready',
    title: '乱斗初阵',
    desc: '完成第一次大乱斗',
    message: '小精灵举起魔法杖：大乱斗开始啦！',
    icon: '⚔️',
    type: 'challenge',
    rarity: 'common',
    condition: (s) => s.brawlsCompleted >= 1
  },
  {
    id: 'brawl_hero',
    title: '乱斗英雄',
    desc: '大乱斗错误少于3次',
    message: '小精灵欢呼：只错了一点点，简直是英雄！',
    icon: '🛡️',
    type: 'challenge',
    rarity: 'rare',
    condition: (s) => s.perfectBrawls >= 1
  },
  {
    id: 'speedy_wind',
    title: '疾风精灵',
    desc: '大乱斗10分钟内完成',
    message: '呼——小精灵变成一阵风，好快呀！',
    icon: '💨',
    type: 'challenge',
    rarity: 'rare',
    condition: (s) => s.speedBrawls >= 1
  },
  {
    id: 'brawl_master',
    title: '乱斗大师',
    desc: '完成10次大乱斗',
    message: '小精灵戴上皇冠：大乱斗之王就是你！',
    icon: '🏆',
    type: 'challenge',
    rarity: 'epic',
    condition: (s) => s.brawlsCompleted >= 10
  },
  {
    id: 'notebook_first',
    title: '记忆回溯',
    desc: '第一次使用复习笔记本',
    message: '小精灵翻开笔记本：让我们复习一下吧~',
    icon: '📓',
    type: 'challenge',
    rarity: 'common',
    condition: (s) => s.notebookUsed >= 1
  },
  {
    id: 'memory_master',
    title: '记忆大师',
    desc: '复习笔记本连续10次全对',
    message: '小精灵开心地跳起来：你的记忆力太棒了！',
    icon: '🧠',
    type: 'challenge',
    rarity: 'epic',
    condition: (s) => s.notebookPerfectStreak >= 10
  },

  // 🎁 秘密篇 - 小精灵藏起来的宝藏
  {
    id: 'moonlight',
    title: '月光精灵',
    desc: '在22:00之后学习',
    message: '嘘——小精灵在月光下偷偷学习...',
    icon: '🌙',
    type: 'secret',
    rarity: 'rare',
    condition: () => {
      const h = new Date().getHours();
      return h >= 22 || h < 5;
    }
  },
  {
    id: 'sunrise',
    title: '晨曦精灵',
    desc: '在6:00-8:00之间学习',
    message: '小精灵喜欢早起的小鸟~',
    icon: '🌅',
    type: 'secret',
    rarity: 'rare',
    condition: () => {
      const h = new Date().getHours();
      return h >= 6 && h < 8;
    }
  },
  {
    id: 'title_tickle',
    title: '精灵痒痒',
    desc: '点击游戏标题10次',
    message: '咯咯咯~别挠我痒痒！',
    icon: '🎈',
    type: 'secret',
    rarity: 'common',
    condition: (s) => s.titleClicks >= 10
  },
  {
    id: 'lucky_eight',
    title: '幸运数字',
    desc: '累计拼对88个单词',
    message: '小精灵发现了幸运数字88！',
    icon: '🍀',
    type: 'secret',
    rarity: 'rare',
    condition: (s) => s.totalWords === 88
  },
  {
    id: 'seven_days',
    title: '七日精灵',
    desc: '连续7天学习',
    message: '小精灵的日历上画满了星星！连续7天~',
    icon: '📅',
    type: 'secret',
    rarity: 'epic',
    condition: (s) => s.consecutiveDays >= 7
  },
  {
    id: 'all_units',
    title: '全境探索',
    desc: '解锁所有单元',
    message: '小精灵集齐了所有魔法领域的钥匙！',
    icon: '🔑',
    type: 'secret',
    rarity: 'legendary',
    condition: (s) => s.allUnitsUnlocked === true
  },
  {
    id: 'comeback_king',
    title: '浴火重生',
    desc: '从0连击后连续答对20次',
    message: '小精灵从灰烬中重生，变得更强大了！',
    icon: '🔥',
    type: 'secret',
    rarity: 'epic',
    condition: (s) => s.comebackAchieved === true
  },
  {
    id: 'speed_demon',
    title: '闪电精灵',
    desc: '单个单词3秒内完成',
    message: '小精灵变成了一道闪电！太快了！',
    icon: '⚡',
    type: 'secret',
    rarity: 'rare',
    condition: (s) => s.fastestWord <= 3
  }
];

// 稀有度配置
export const RARITY_CONFIG = {
  common: {
    name: '普通',
    color: 'from-slate-400 to-slate-500',
    borderColor: 'border-slate-400',
    glowColor: 'shadow-slate-400/30',
    bgGlow: 'rgba(148, 163, 184, 0.1)'
  },
  rare: {
    name: '稀有',
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400',
    glowColor: 'shadow-blue-400/30',
    bgGlow: 'rgba(96, 165, 250, 0.15)'
  },
  epic: {
    name: '史诗',
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-400',
    glowColor: 'shadow-purple-400/30',
    bgGlow: 'rgba(192, 132, 252, 0.2)'
  },
  legendary: {
    name: '传说',
    color: 'from-yellow-400 to-orange-500',
    borderColor: 'border-yellow-400',
    glowColor: 'shadow-yellow-400/40',
    bgGlow: 'rgba(251, 191, 36, 0.25)'
  }
};

// 类型标签配置
export const TYPE_LABELS = {
  hatch: { label: '🌱 孵化篇', desc: '初识魔法' },
  growth: { label: '✨ 成长篇', desc: '魔法修炼' },
  funny: { label: '🎪 趣味篇', desc: '小精灵的恶作剧' },
  challenge: { label: '⚔️ 挑战篇', desc: '精灵大乱斗' },
  secret: { label: '🎁 秘密篇', desc: '藏起来的宝藏' }
};