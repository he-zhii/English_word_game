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
