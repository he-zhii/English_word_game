// 存储管理模块 - localStorage 操作封装

import { KEYS, MEMORY_INTERVALS } from '../constants';

// --- 单词数据 ---
let cachedDefaultWords = null;

/**
 * 获取默认单词数据（懒加载）
 */
const getDefaultWordsData = async () => {
    if (cachedDefaultWords) return cachedDefaultWords;
    const { DEFAULT_WORDS_DATA } = await import('../data/words');
    cachedDefaultWords = DEFAULT_WORDS_DATA;
    return cachedDefaultWords;
};

/**
 * 同步获取默认单词（需要先异步加载）
 */
export const getDefaultWordsSyncFallback = () => {
    // 这个函数用于兼容同步场景，返回空对象作为后备
    return cachedDefaultWords || {};
};

/**
 * 获取存储的单词数据
 */
export const getStoredWordsData = () => {
    try {
        const data = localStorage.getItem(KEYS.WORDS);
        if (data) return JSON.parse(data);
    } catch (e) {
        console.error("Error loading words data:", e);
    }
    return null;
};

/**
 * 初始化单词数据（异步）
 */
export const initWordsData = async () => {
    const stored = getStoredWordsData();
    if (stored) return stored;

    const defaultWords = await getDefaultWordsData();
    const normalizedDefault = {};
    Object.keys(defaultWords).forEach(unitId => {
        normalizedDefault[unitId] = defaultWords[unitId].map(w => ({
            ...w,
            isActive: w.isActive !== false
        }));
    });
    return normalizedDefault;
};

export const saveWordsData = (data) => localStorage.setItem(KEYS.WORDS, JSON.stringify(data));

// --- 分数 ---
export const getGlobalScore = () => {
    try {
        const val = parseInt(localStorage.getItem(KEYS.SCORE) || '0', 10);
        return isNaN(val) ? 0 : val;
    } catch (e) { return 0; }
};

export const updateGlobalScore = (delta) => {
    const current = getGlobalScore();
    const newScore = current + delta;
    localStorage.setItem(KEYS.SCORE, newScore.toString());
    return newScore;
};

// --- 错题本 ---
export const getMistakes = () => {
    try { return JSON.parse(localStorage.getItem(KEYS.MISTAKES) || '{}'); } catch (e) { return {}; }
};

export const saveMistakes = (data) => localStorage.setItem(KEYS.MISTAKES, JSON.stringify(data));

/**
 * 新增错题 (初始化 Stage 0)
 */
export const addMistake = (wordObj) => {
    const db = getMistakes();
    if (!db[wordObj.word]) {
        db[wordObj.word] = { ...wordObj, stage: 0, nextReview: Date.now(), hearts: 0 };
        saveMistakes(db);
    } else {
        db[wordObj.word].stage = 0;
        db[wordObj.word].nextReview = Date.now();
        saveMistakes(db);
    }
};

/**
 * 更新错题进度 (艾宾浩斯核心逻辑)
 */
export const updateMistakeProgress = (wordStr, isCorrect) => {
    const db = getMistakes();
    if (!db[wordStr]) return null;
    const word = db[wordStr];

    if (isCorrect) {
        const newStage = (word.stage || 0) + 1;
        if (newStage >= MEMORY_INTERVALS.length) {
            delete db[wordStr];
            saveMistakes(db);
            return 'graduated';
        } else {
            word.stage = newStage;
            word.nextReview = Date.now() + MEMORY_INTERVALS[newStage];
            word.hearts = (word.hearts || 0) + 1;
            saveMistakes(db);
            return 'improved';
        }
    } else {
        word.stage = 0;
        word.nextReview = Date.now();
        word.hearts = 0;
        saveMistakes(db);
        return 'reset';
    }
};

/**
 * 获取当前需要复习的错题数
 */
export const getDueMistakesCount = () => {
    const db = getMistakes();
    const now = Date.now();
    return Object.values(db).filter(w => w.nextReview <= now).length;
};

// --- 大乱斗进度 ---
export const getBrawlProgress = () => {
    try { return JSON.parse(localStorage.getItem(KEYS.BRAWL)); } catch (e) { return null; }
};

export const saveBrawlProgress = (state) => localStorage.setItem(KEYS.BRAWL, JSON.stringify(state));

export const clearBrawlProgress = () => localStorage.removeItem(KEYS.BRAWL);

// --- 设置 ---
export const getSettings = () => {
    try {
        return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || { enableHints: true, voiceType: 0 };
    } catch (e) {
        return { enableHints: true, voiceType: 0 };
    }
};

export const saveSettings = (s) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));

// --- 统计 ---
export const getStats = () => {
    try {
        return JSON.parse(localStorage.getItem(KEYS.STATS)) || null;
    } catch (e) {
        return null;
    }
};

export const saveStats = (s) => localStorage.setItem(KEYS.STATS, JSON.stringify(s));

// --- 成就 ---
export const getAchievements = () => {
    try {
        return JSON.parse(localStorage.getItem(KEYS.ACHIEVEMENTS)) || [];
    } catch (e) {
        return [];
    }
};

export const saveAchievements = (arr) => localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(arr));
