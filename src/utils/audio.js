// 音频引擎 - 缓存加速版

let globalAudioCtx = null;

/**
 * 获取或创建 AudioContext
 */
export const getAudioContext = () => {
    if (!globalAudioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) globalAudioCtx = new AudioContext();
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume().catch(() => { });
    }
    return globalAudioCtx;
};

/**
 * 播放成功的叮叮声 (清脆短促)
 */
export const playSuccessChime = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.warn("Audio chime failed", e);
    }
};

// 音频缓存池
const audioCache = new Map();

/**
 * 朗读单词
 * @param {string} word 
 */
export const playWordAudio = async (word) => {
    if (!word) return;
    const cleanWord = word.toLowerCase().trim();

    // 检查缓存
    if (audioCache.has(cleanWord)) {
        const cachedUrl = audioCache.get(cleanWord);
        const audio = new Audio(cachedUrl);
        audio.play().catch(e => console.log("Cached play error:", e));
        return;
    }

    // 优先尝试有道词典 API
    const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanWord)}&type=0`;

    const tryYoudao = new Promise((resolve, reject) => {
        const audio = new Audio(youdaoUrl);
        audio.oncanplaythrough = () => {
            audioCache.set(cleanWord, youdaoUrl);
            audio.play();
            resolve(true);
        };
        audio.onerror = () => reject();
        setTimeout(() => reject(), 2000);
        audio.load();
    });

    try {
        await tryYoudao;
        return;
    } catch (e) { }

    // 备选：Free Dictionary API
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
        if (response.ok) {
            const data = await response.json();
            const usAudioUrl = data[0]?.phonetics?.find(p => p.audio && p.audio.endsWith('-us.mp3'))?.audio;
            if (usAudioUrl) {
                audioCache.set(cleanWord, usAudioUrl);
                const audio = new Audio(usAudioUrl);
                audio.play();
                return;
            }
        }
    } catch (e) { }

    // 最后备选：Web Speech API
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const usVoice = voices.find(v => v.lang === 'en-US' && !v.name.includes('UK'));
        if (usVoice) utterance.voice = usVoice;
        window.speechSynthesis.speak(utterance);
    }
};

/**
 * 播放错误的"嘟嘟"声 (柔和低沉)
 */
export const playErrorSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.warn("Error sound failed", e);
    }
};

/**
 * 播放字母点击的"哒"声 (清脆短促)
 */
export const playClickSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
        console.warn("Click sound failed", e);
    }
};

/**
 * 播放成就解锁的庆祝音乐 (欢快上升)
 */
export const playAchievementSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        // 播放三连音上升旋律
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.3);
        });
    } catch (e) {
        console.warn("Achievement sound failed", e);
    }
};

/**
 * 播放提示音的"布灵"声 (神秘柔和)
 */
export const playHintSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.warn("Hint sound failed", e);
    }
};

/**
 * 播放升级音效 (宏大上升)
 */
export const playLevelUpSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + i * 0.08 + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.5);
        });
    } catch (e) {
        console.warn("Level up sound failed", e);
    }
};

let preloadQueue = [];
let isPreloading = false;
const MAX_CACHE_SIZE = 100;

export const preloadWordAudio = (word) => {
    if (!word || audioCache.has(word.toLowerCase().trim())) return;
    preloadQueue.push(word.toLowerCase().trim());
    processPreloadQueue();
};

const processPreloadQueue = async () => {
    if (isPreloading || preloadQueue.length === 0) return;
    isPreloading = true;

    while (preloadQueue.length > 0) {
        if (audioCache.size >= MAX_CACHE_SIZE) {
            const firstKey = audioCache.keys().next().value;
            audioCache.delete(firstKey);
        }

        const word = preloadQueue.shift();
        if (audioCache.has(word)) continue;

        const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=0`;
        
        try {
            await new Promise((resolve, reject) => {
                const audio = new Audio(youdaoUrl);
                audio.oncanplaythrough = () => {
                    audioCache.set(word, youdaoUrl);
                    resolve();
                };
                audio.onerror = reject;
                setTimeout(reject, 1500);
                audio.load();
            });
        } catch {
            // 预加载失败，静默处理
        }
    }

    isPreloading = false;
};

export const preloadWords = (words) => {
    if (!Array.isArray(words)) return;
    words.forEach(w => {
        if (w && w.word) preloadWordAudio(w.word);
    });
};

export const clearAudioCache = () => {
    audioCache.clear();
    preloadQueue = [];
};

export const getCacheSize = () => audioCache.size;

// ---------- 背景音乐 ----------
let bgmAudio = null;
let bgmMuted = false;
let bgmVolume = 0.40;
let bgmAutoplayFailed = false;
let bgmResumeHandler = null;

const BGM_PATH = '/bgm.mp3';

/**
 * 初始化背景音乐（循环、低音量）
 */
export const initBackgroundMusic = () => {
    if (bgmAudio) return bgmAudio;
    bgmAudio = new Audio(BGM_PATH);
    bgmAudio.loop = true;
    bgmAudio.volume = bgmMuted ? 0 : bgmVolume;
    bgmAudio.preload = 'auto';
    bgmAudio.load();
    return bgmAudio;
};

/**
 * 尝试播放背景音乐；若浏览器阻止自动播放，则监听首次用户交互后重试
 */
export const playBackgroundMusic = async () => {
    const audio = initBackgroundMusic();
    if (bgmMuted) return;

    try {
        audio.volume = bgmVolume;
        await audio.play();
        bgmAutoplayFailed = false;
        detachResumeListener();
    } catch {
        bgmAutoplayFailed = true;
        attachResumeListener();
    }
};

/**
 * 暂停背景音乐
 */
export const pauseBackgroundMusic = () => {
    if (!bgmAudio) return;
    bgmAudio.pause();
    detachResumeListener();
};

/**
 * 设置背景音乐是否静音
 */
export const setBackgroundMusicMuted = (muted) => {
    bgmMuted = !!muted;
    if (!bgmAudio) initBackgroundMusic();
    bgmAudio.volume = bgmMuted ? 0 : bgmVolume;
    if (bgmMuted) {
        bgmAudio.pause();
    } else if (bgmAutoplayFailed || bgmAudio.paused) {
        playBackgroundMusic();
    }
};

/**
 * 设置背景音乐音量（0-1）
 */
export const setBackgroundMusicVolume = (vol) => {
    bgmVolume = Math.max(0, Math.min(1, vol));
    if (bgmAudio) bgmAudio.volume = bgmMuted ? 0 : bgmVolume;
};

/**
 * 背景音乐是否正在播放
 */
export const isBackgroundMusicPlaying = () => !!bgmAudio && !bgmAudio.paused;

function attachResumeListener() {
    if (bgmResumeHandler) return;
    bgmResumeHandler = () => {
        if (!bgmMuted) playBackgroundMusic();
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, bgmResumeHandler, { once: true, passive: true });
    });
}

function detachResumeListener() {
    if (!bgmResumeHandler) return;
    ['pointerdown', 'keydown', 'touchstart'].forEach(evt => {
        document.removeEventListener(evt, bgmResumeHandler);
    });
    bgmResumeHandler = null;
}

// ---------- 游戏交互音效（用户上传素材） ----------
const SOUND_PATHS = {
    correct: { effect: '/sounds/correct/effect.mp3', voice: '/sounds/correct/voice.mp3' },
    wrong: [
        '/sounds/wrong/1.mp3',
        '/sounds/wrong/2.mp3',
        '/sounds/wrong/3.mp3',
        '/sounds/wrong/4.mp3'
    ],
    idle: [
        { src: '/sounds/idle/1.mp3', text: '准备好和我冒险了吗？' },
        { src: '/sounds/idle/2.mp3', text: '准备好开始了吗！' },
        { src: '/sounds/idle/3.mp3', text: '喜欢和你一起玩！' },
        { src: '/sounds/idle/4.mp3', text: '快陪我一起玩！' },
        { src: '/sounds/idle/5.mp3', text: '我都等你好久了！' }
    ]
};

const sfxVolume = 0.75;

function playOneShot(src, volume = sfxVolume) {
    try {
        const audio = new Audio(src);
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.play().catch(() => { });
    } catch {
        // 音效播放失败静默处理
    }
}

/**
 * 播放答对反馈：音效和语音交叉出现，音效出现频率更高（约 70%）
 */
export const playCorrectSound = () => {
    const src = Math.random() < 0.7 ? SOUND_PATHS.correct.effect : SOUND_PATHS.correct.voice;
    playOneShot(src);
};

/**
 * 播放答错反馈：从裁剪好的短音频中随机抽取一条
 * @param {number} _mistakes 保留参数兼容旧调用
 */
export const playWrongSound = (_mistakes = 0) => {
    const src = SOUND_PATHS.wrong[Math.floor(Math.random() * SOUND_PATHS.wrong.length)];
    playOneShot(src);
};

/**
 * 播放首页角色交互待机语音（随机一条），返回对应的台词文本
 * @returns {{ src: string, text: string }}
 */
export const playIdleSound = () => {
    const line = SOUND_PATHS.idle[Math.floor(Math.random() * SOUND_PATHS.idle.length)];
    playOneShot(line.src);
    return line;
};

