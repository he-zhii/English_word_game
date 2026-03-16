// 全局配置常量

export const STORAGE_VERSION = 'v12.0'; // 升级版本号：强力纠错版

export const KEYS = {
  BOOK_ID: `spelling_book_id_${STORAGE_VERSION}`,
  WORDS: (bookId) => `spelling_words_${bookId}_${STORAGE_VERSION}`,
  MISTAKES: (bookId) => `spelling_mistakes_${bookId}_${STORAGE_VERSION}`,
  BRAWL: (bookId) => `spelling_brawl_${bookId}_${STORAGE_VERSION}`,
  STATS: (bookId) => `spelling_stats_${bookId}_${STORAGE_VERSION}`,
  ACHIEVEMENTS: `spelling_achievements_${STORAGE_VERSION}`,
  SETTINGS: `spelling_settings_${STORAGE_VERSION}`,
  SCORE: (bookId) => `spelling_score_${bookId}_${STORAGE_VERSION}`
};

// 艾宾浩斯复习间隔
export const MEMORY_INTERVALS = [0, 5*60000, 30*60000, 12*3600000, 24*3600000, 3*24*3600000, 7*24*3600000];
