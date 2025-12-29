// 成就数据定义

export const ACHIEVEMENTS_DATA = [
    { id: 'first_steps', title: '初出茅庐', desc: '累计拼对 5 个单词', icon: '🌱', type: 'milestone', condition: (s) => s.totalWords >= 5 },
    { id: 'getting_started', title: '渐入佳境', desc: '累计拼对 25 个单词', icon: '🚲', type: 'milestone', condition: (s) => s.totalWords >= 25 },
    { id: 'half_hundred', title: '半途而不废', desc: '累计拼对 50 个单词', icon: '🏃', type: 'milestone', condition: (s) => s.totalWords >= 50 },
    { id: 'vocabulary_king', title: '百词斩', desc: '累计拼对 100 个单词', icon: '⚔️', type: 'milestone', condition: (s) => s.totalWords >= 100 },
    { id: 'word_master', title: '登峰造极', desc: '累计拼对 300 个单词', icon: '👑', type: 'milestone', condition: (s) => s.totalWords >= 300 },
    { id: 'score_tycoon', title: '积分大亨', desc: '总积分达到 1000 分', icon: '💰', type: 'milestone', condition: (s) => s.totalScore >= 1000 },
    { id: 'streak_5', title: '连对先锋', desc: '连续答对 5 次不失误', icon: '🔥', type: 'streak', condition: (s) => s.currentStreak >= 5 },
    { id: 'streak_20', title: '心流模式', desc: '连续答对 20 次不失误', icon: '🌊', type: 'streak', condition: (s) => s.currentStreak >= 20 },
    { id: 'streak_50', title: '独孤求败', desc: '连续答对 50 次不失误', icon: '🐉', type: 'streak', condition: (s) => s.currentStreak >= 50 },
    { id: 'shake_master', title: '手滑大王', desc: '累计拼错 20 次', icon: '🌀', type: 'funny', condition: (s) => s.totalMistakes >= 20 },
    { id: 'never_give_up', title: '不屈的灵魂', desc: '累计拼错 100 次', icon: '❤️‍🩹', type: 'funny', condition: (s) => s.totalMistakes >= 100 },
    { id: 'curious_baby', title: '点读机', desc: '累计使用提示 20 次', icon: '💡', type: 'funny', condition: (s) => s.totalHints >= 20 },
    { id: 'brawl_finisher', title: '乱斗之王', desc: '完成一局 30 词大乱斗', icon: '🥊', type: 'milestone', condition: (s) => s.brawlsCompleted >= 1 },
    { id: 'brawl_survivor', title: '生存专家', desc: '大乱斗中错误少于 3 次', icon: '🛡️', type: 'milestone', condition: (s) => s.perfectBrawls >= 1 },
    { id: 'early_bird', title: '早起的鸟儿', desc: '在 6:00-8:00 间学习', icon: '🌅', type: 'hidden', condition: () => { const h = new Date().getHours(); return h >= 6 && h < 8; } },
    { id: 'night_owl', title: '夜深人静', desc: '在 22:00 之后学习', icon: '🦉', type: 'hidden', condition: () => { const h = new Date().getHours(); return h >= 22; } },
    { id: 'clicker_madness', title: '狂点狂魔', desc: '点击游戏标题 10 次', icon: '👆', type: 'hidden', condition: (s) => s.titleClicks >= 10 },
    { id: 'lucky_star', title: '幸运之星', desc: '累计答对 88 个单词', icon: '🍀', type: 'hidden', condition: (s) => s.totalWords === 88 },
];
