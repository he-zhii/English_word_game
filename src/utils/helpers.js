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
 * Fisher-Yates 洗牌算法（增强版）
 * 确保打乱后的顺序永远不会与原顺序完全相同
 * @param {Array} array 
 * @returns {Array}
 */
export const shuffleArray = (array) => {
    // 如果数组长度小于等于1，无法打乱
    if (array.length <= 1) return [...array];

    /**
     * 内部打乱函数
     */
    const doShuffle = (arr) => {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    /**
     * 检查两个数组是否完全相同（按顺序）
     */
    const isSameOrder = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            // 比较对象的 char 属性（字母），或直接比较值
            const val1 = arr1[i]?.char ?? arr1[i];
            const val2 = arr2[i]?.char ?? arr2[i];
            if (val1 !== val2) return false;
        }
        return true;
    };

    // 最多尝试10次，确保不会和原顺序相同
    let shuffled = doShuffle(array);
    let attempts = 1;
    const maxAttempts = 10;

    while (isSameOrder(array, shuffled) && attempts < maxAttempts) {
        shuffled = doShuffle(array);
        attempts++;
    }

    return shuffled;
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
