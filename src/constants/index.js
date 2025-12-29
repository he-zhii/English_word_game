// 全局配置常量

export const STORAGE_VERSION = 'v12.0'; // 升级版本号：强力纠错版

export const KEYS = {
  WORDS: `spelling_words_${STORAGE_VERSION}`,
  MISTAKES: `spelling_mistakes_${STORAGE_VERSION}`,
  BRAWL: `spelling_brawl_${STORAGE_VERSION}`,
  STATS: `spelling_stats_${STORAGE_VERSION}`,
  ACHIEVEMENTS: `spelling_achievements_${STORAGE_VERSION}`,
  SETTINGS: `spelling_settings_${STORAGE_VERSION}`,
  SCORE: `spelling_score_${STORAGE_VERSION}`
};

// 艾宾浩斯复习间隔
export const MEMORY_INTERVALS = [0, 5*60000, 30*60000, 12*3600000, 24*3600000, 3*24*3600000, 7*24*3600000];
