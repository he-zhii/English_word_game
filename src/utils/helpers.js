// 工具函数集合

// 颜色数组，循环使用
const colors = [
    "text-pink-500", "text-blue-500", "text-green-500",
    "text-purple-500", "text-orange-500", "text-teal-600",
    "text-indigo-500", "text-rose-500", "text-cyan-600"
];

/**
 * 根据索引获取颜色类名
 * @param {number} index 
 * @returns {string}
 */
export const getColor = (index) => colors[index % colors.length];

/**
 * Fisher-Yates 洗牌算法
 * @param {Array} array 
 * @returns {Array}
 */
export const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// 随机 emoji 池
export const RANDOM_EMOJIS = [
    "🌟", "🎈", "🐶", "🐱", "🍦", "🌈", "🚀", "⚽", "🎮", "🎸",
    "📚", "✏️", "🍎", "🍔", "🚲", "⏰", "💡", "🎁", "🔑", "💎"
];

/**
 * 获取随机 emoji
 * @returns {string}
 */
export const getRandomEmoji = () => RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
