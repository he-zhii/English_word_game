import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Volume2, Trophy, ArrowRight, Sparkles, Star, Home, ArrowLeft, 
  BookOpen, Users, PawPrint, Apple, Palette, Hash, Eye, Ear, 
  HelpCircle, Lightbulb, BookX, Heart, GraduationCap, Play
} from 'lucide-react';

// --- 1. 辅助工具：颜色生成 ---
const getColor = (index) => {
  const colors = [
    "text-pink-500", "text-blue-500", "text-green-500", 
    "text-purple-500", "text-orange-500", "text-teal-600",
    "text-indigo-500", "text-rose-500", "text-cyan-600"
  ];
  return colors[index % colors.length];
};

// --- 2. 数据准备区 ---
const UNIT_DATA = [
  {
    id: 1,
    title: "Unit 1 身体部位",
    subtitle: "Body Parts",
    themeColor: "bg-rose-100 border-rose-300 text-rose-600",
    icon: <Users />,
    words: [
      { word: "name", cn: "名字", emoji: "📛", syllables: ["name"] },
      { word: "nice", cn: "友好的", emoji: "😊", syllables: ["nice"] },
      { word: "ear", cn: "耳朵", emoji: "👂", syllables: ["ear"] },
      { word: "hand", cn: "手", emoji: "✋", syllables: ["hand"] },
      { word: "eye", cn: "眼睛", emoji: "👁️", syllables: ["eye"] },
      { word: "mouth", cn: "嘴", emoji: "👄", syllables: ["mouth"] },
      { word: "arm", cn: "胳膊", emoji: "💪", syllables: ["arm"] },
      { word: "can", cn: "可以", emoji: "🆗", syllables: ["can"] },
      { word: "share", cn: "分享", emoji: "🍰", syllables: ["share"] },
      { word: "smile", cn: "微笑", emoji: "😄", syllables: ["smile"] },
      { word: "listen", cn: "听", emoji: "🎧", syllables: ["lis", "ten"] },
      { word: "help", cn: "帮助", emoji: "🤝", syllables: ["help"] },
      { word: "say", cn: "说", emoji: "🗣️", syllables: ["say"] },
      { word: "and", cn: "和", emoji: "➕", syllables: ["and"] },
      { word: "goodbye", cn: "再见", emoji: "👋", syllables: ["good", "bye"] },
      { word: "toy", cn: "玩具", emoji: "🧸", syllables: ["toy"] },
      { word: "friend", cn: "朋友", emoji: "👭", syllables: ["friend"] },
      { word: "good", cn: "好的", emoji: "👍", syllables: ["good"] },
    ]
  },
  {
    id: 2,
    title: "Unit 2 家庭关系",
    subtitle: "Family",
    themeColor: "bg-orange-100 border-orange-300 text-orange-600",
    icon: <Home />,
    words: [
      { word: "mum", cn: "妈妈", emoji: "👩", syllables: ["mum"] },
      { word: "dad", cn: "爸爸", emoji: "👨", syllables: ["dad"] },
      { word: "mother", cn: "妈妈", emoji: "👩", syllables: ["moth", "er"] },
      { word: "father", cn: "爸爸", emoji: "👨", syllables: ["fa", "ther"] },
      { word: "me", cn: "我", emoji: "🙋", syllables: ["me"] },
      { word: "sister", cn: "姐妹", emoji: "👧", syllables: ["sis", "ter"] },
      { word: "family", cn: "家", emoji: "👨‍👩‍👧‍👦", syllables: ["fam", "i", "ly"] },
      { word: "have", cn: "有", emoji: "🈶", syllables: ["have"] },
      { word: "cousin", cn: "堂兄/弟", emoji: "👫", syllables: ["cous", "in"] },
      { word: "brother", cn: "兄弟", emoji: "👦", syllables: ["broth", "er"] },
      { word: "baby", cn: "宝宝", emoji: "👶", syllables: ["ba", "by"] },
      { word: "big", cn: "大", emoji: "🐘", syllables: ["big"] },
      { word: "uncle", cn: "叔叔", emoji: "🤵", syllables: ["un", "cle"] },
      { word: "aunt", cn: "伯母", emoji: "👩", syllables: ["aunt"] },
      { word: "some", cn: "一些", emoji: "🍬", syllables: ["some"] },
      { word: "small", cn: "小的", emoji: "🐜", syllables: ["small"] },
      { word: "grandma", cn: "奶奶", emoji: "👵", syllables: ["grand", "ma"] },
      { word: "grandpa", cn: "爷爷", emoji: "👴", syllables: ["grand", "pa"] },
      { word: "grandfather", cn: "外祖父", emoji: "👴", syllables: ["grand", "fa", "ther"] },
      { word: "grandmother", cn: "外祖母", emoji: "👵", syllables: ["grand", "moth", "er"] },
    ]
  },
  {
    id: 3,
    title: "Unit 3 认识动物",
    subtitle: "Animals",
    themeColor: "bg-green-100 border-green-300 text-green-600",
    icon: <PawPrint />,
    words: [
      { word: "like", cn: "喜欢", emoji: "❤️", syllables: ["like"] },
      { word: "dog", cn: "狗", emoji: "🐶", syllables: ["dog"] },
      { word: "pet", cn: "宠物", emoji: "🐈", syllables: ["pet"] },
      { word: "cat", cn: "猫", emoji: "🐱", syllables: ["cat"] },
      { word: "fish", cn: "鱼", emoji: "🐟", syllables: ["fish"] },
      { word: "bird", cn: "鸟", emoji: "🐦", syllables: ["bird"] },
      { word: "rabbit", cn: "兔", emoji: "🐰", syllables: ["rab", "bit"] },
      { word: "go", cn: "走", emoji: "🚶", syllables: ["go"] },
      { word: "zoo", cn: "动物园", emoji: "🦁", syllables: ["zoo"] },
      { word: "fox", cn: "狐狸", emoji: "🦊", syllables: ["fox"] },
      { word: "Miss", cn: "女士", emoji: "👩‍🏫", syllables: ["Miss"] },
      { word: "panda", cn: "大熊猫", emoji: "🐼", syllables: ["pan", "da"] },
      { word: "cute", cn: "可爱的", emoji: "😽", syllables: ["cute"] },
      { word: "monkey", cn: "猴子", emoji: "🐒", syllables: ["mon", "key"] },
      { word: "tiger", cn: "老虎", emoji: "🐯", syllables: ["ti", "ger"] },
      { word: "elephant", cn: "大象", emoji: "🐘", syllables: ["el", "e", "phant"] },
      { word: "lion", cn: "狮子", emoji: "🦁", syllables: ["li", "on"] },
      { word: "animal", cn: "动物", emoji: "🐾", syllables: ["an", "i", "mal"] },
      { word: "giraffe", cn: "长颈鹿", emoji: "🦒", syllables: ["gi", "raffe"] },
      { word: "tall", cn: "高的", emoji: "🗼", syllables: ["tall"] },
      { word: "fast", cn: "快的", emoji: "🐆", syllables: ["fast"] },
    ]
  },
  {
    id: 4,
    title: "Unit 4 认识水果",
    subtitle: "Fruits",
    themeColor: "bg-yellow-100 border-yellow-300 text-yellow-700",
    icon: <Apple />,
    words: [
      { word: "apple", cn: "苹果", emoji: "🍎", syllables: ["ap", "ple"] },
      { word: "banana", cn: "香蕉", emoji: "🍌", syllables: ["ba", "na", "na"] },
      { word: "farm", cn: "农场", emoji: "🚜", syllables: ["farm"] },
      { word: "air", cn: "空气", emoji: "💨", syllables: ["air"] },
      { word: "orange", cn: "橙子", emoji: "🍊", syllables: ["or", "ange"] },
      { word: "grape", cn: "葡萄", emoji: "🍇", syllables: ["grape"] },
      { word: "school", cn: "学校", emoji: "🏫", syllables: ["school"] },
      { word: "garden", cn: "花园", emoji: "🌻", syllables: ["gar", "den"] },
      { word: "need", cn: "需要", emoji: "🤲", syllables: ["need"] },
      { word: "water", cn: "水", emoji: "💧", syllables: ["wa", "ter"] },
      { word: "flower", cn: "花朵", emoji: "🌺", syllables: ["flow", "er"] },
      { word: "grass", cn: "草", emoji: "🌿", syllables: ["grass"] },
      { word: "plant", cn: "植物", emoji: "🪴", syllables: ["plant"] },
      { word: "new", cn: "新的", emoji: "🆕", syllables: ["new"] },
      { word: "tree", cn: "树", emoji: "🌳", syllables: ["tree"] },
      { word: "sun", cn: "太阳", emoji: "☀️", syllables: ["sun"] },
      { word: "give", cn: "给", emoji: "🎁", syllables: ["give"] },
      { word: "them", cn: "他们", emoji: "👥", syllables: ["them"] },
      { word: "us", cn: "我们", emoji: "🧑‍🤝‍🧑", syllables: ["us"] },
    ]
  },
  {
    id: 5,
    title: "Unit 5 认识颜色",
    subtitle: "Colors",
    themeColor: "bg-indigo-100 border-indigo-300 text-indigo-600",
    icon: <Palette />,
    words: [
      { word: "colour", cn: "颜色", emoji: "🎨", syllables: ["col", "our"] },
      { word: "orange", cn: "橙红色", emoji: "🟧", syllables: ["or", "ange"] },
      { word: "green", cn: "绿色", emoji: "🟩", syllables: ["green"] },
      { word: "red", cn: "红色", emoji: "🟥", syllables: ["red"] },
      { word: "blue", cn: "蓝色", emoji: "🟦", syllables: ["blue"] },
      { word: "make", cn: "做", emoji: "🔨", syllables: ["make"] },
      { word: "purple", cn: "紫色", emoji: "🟪", syllables: ["pur", "ple"] },
      { word: "brown", cn: "棕色", emoji: "🟫", syllables: ["brown"] },
      { word: "bear", cn: "熊", emoji: "🐻", syllables: ["bear"] },
      { word: "yellow", cn: "黄色", emoji: "🟨", syllables: ["yel", "low"] },
      { word: "duck", cn: "鸭子", emoji: "🦆", syllables: ["duck"] },
      { word: "sea", cn: "海洋", emoji: "🌊", syllables: ["sea"] },
      { word: "pink", cn: "粉色", emoji: "💗", syllables: ["pink"] },
      { word: "draw", cn: "画", emoji: "🖍️", syllables: ["draw"] },
      { word: "white", cn: "白色", emoji: "⬜", syllables: ["white"] },
      { word: "black", cn: "黑色", emoji: "⬛", syllables: ["black"] },
    ]
  },
  {
    id: 6,
    title: "Unit 6 认识数字",
    subtitle: "Numbers",
    themeColor: "bg-sky-100 border-sky-300 text-sky-600",
    icon: <Hash />,
    words: [
      { word: "old", cn: "年纪", emoji: "👴", syllables: ["old"] },
      { word: "year", cn: "年", emoji: "📅", syllables: ["year"] },
      { word: "one", cn: "一", emoji: "1️⃣", syllables: ["one"] },
      { word: "two", cn: "二", emoji: "2️⃣", syllables: ["two"] },
      { word: "three", cn: "三", emoji: "3️⃣", syllables: ["three"] },
      { word: "four", cn: "四", emoji: "4️⃣", syllables: ["four"] },
      { word: "five", cn: "五", emoji: "5️⃣", syllables: ["five"] },
      { word: "six", cn: "六", emoji: "6️⃣", syllables: ["six"] },
      { word: "seven", cn: "七", emoji: "7️⃣", syllables: ["sev", "en"] },
      { word: "eight", cn: "八", emoji: "8️⃣", syllables: ["eight"] },
      { word: "nine", cn: "九", emoji: "9️⃣", syllables: ["nine"] },
      { word: "o'clock", cn: "点钟", emoji: "⏰", syllables: ["o'", "clock"] },
      { word: "cut", cn: "切", emoji: "✂️", syllables: ["cut"] },
      { word: "eat", cn: "吃", emoji: "🍽️", syllables: ["eat"] },
      { word: "cake", cn: "蛋糕", emoji: "🎂", syllables: ["cake"] },
    ]
  }
];

// --- 3. 错题本管理 (LocalStorage) ---
const STORAGE_KEY = 'spellingGame_mistakes_v4';

const getMistakes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) { return {}; }
};

const saveMistakes = (mistakes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
};

const addMistake = (wordObj) => {
  const db = getMistakes();
  if (!db[wordObj.word]) {
    db[wordObj.word] = { ...wordObj, hearts: 0, timestamp: Date.now() };
    saveMistakes(db);
  }
};

const updateMistakeProgress = (wordStr, isCorrect) => {
  const db = getMistakes();
  if (!db[wordStr]) return null;

  if (isCorrect) {
    db[wordStr].hearts = (db[wordStr].hearts || 0) + 1;
    if (db[wordStr].hearts >= 3) {
      delete db[wordStr];
      saveMistakes(db);
      return 'graduated';
    } else {
      saveMistakes(db);
      return 'improved';
    }
  } else {
    db[wordStr].hearts = 0;
    saveMistakes(db);
    return 'reset';
  }
};

// --- 4. 核心游戏组件 (UI 重构版) ---

function GameScreen({ words, mode, onBack, isMistakeMode = false }) {
  const workingWords = useMemo(() => {
     if (Array.isArray(words)) return words;
     return Object.values(words).sort(() => Math.random() - 0.5);
  }, [words]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false); 
  const [currentHearts, setCurrentHearts] = useState(0); 
  const [graduatedAnimation, setGraduatedAnimation] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false); // 新增：关卡完成弹窗
  
  const currentWordObj = workingWords[currentIndex];

  // 初始化单词
  useEffect(() => {
    if (currentWordObj) {
      initWord(currentWordObj);
      if (isMistakeMode) {
        setCurrentHearts(currentWordObj.hearts || 0);
      }
    }
  }, [currentIndex, currentWordObj]);

  // 核心修复：移动端语音加载逻辑
  const speakWord = () => {
    if (!currentWordObj) return;
    
    // 1. 强制停止之前的
    window.speechSynthesis.cancel();

    // 2. 创建发音请求
    const utterance = new SpeechSynthesisUtterance(currentWordObj.word);
    
    // 3. 优化语音选择 (针对 iOS/Android)
    // 获取语音列表是一个异步过程，部分安卓机第一次获取可能是空的
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // 如果列表为空，尝试监听 onvoiceschanged
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
      };
    }

    // 优先选择高质量的英文语音
    const preferredVoice = voices.find(v => 
      v.name.includes('Google US English') ||  // Android 最佳
      v.name.includes('Samantha') ||           // iOS 最佳
      (v.lang.includes('en-US') && !v.name.includes('Network')) // 其他本地英文
    );

    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // 稍微慢一点点，更清晰
    
    // 4. 播放 (包裹在 try-catch 中防止某些浏览器报错卡死)
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  // 修复：移除自动播放，因为微信不支持。改为点击按钮播放。
  // 仅在电脑端可以保留自动播放，但为了统一体验，这里全部改为手动或点击触发。

  const initWord = (wordObj) => {
    const phrase = wordObj.word;
    const lettersOnly = phrase.replace(/\s/g, '').split('');
    const shuffled = lettersOnly.sort(() => Math.random() - 0.5).map((char, i) => ({
      id: `${char}-${i}-${Math.random()}`,
      char: char,
      isUsed: false
    }));
    setShuffledLetters(shuffled);
    const initialPlaced = phrase.split('').map((char, i) => {
      if (char === ' ') return { char: ' ', isSpace: true, id: `space-${i}` };
      return null;
    });
    setPlacedLetters(initialPlaced);
    setIsCompleted(false);
    setShowCelebration(false);
    setShowHint(false);
    setGraduatedAnimation(false);
  };

  const handleLetterClick = (letterObj) => {
    if (isCompleted || letterObj.isUsed) return;
    const firstEmptyIndex = placedLetters.findIndex(l => l === null);
    if (firstEmptyIndex === -1) return;

    const newShuffled = shuffledLetters.map(l => l.id === letterObj.id ? { ...l, isUsed: true } : l);
    const newPlaced = [...placedLetters];
    newPlaced[firstEmptyIndex] = letterObj;
    
    setShuffledLetters(newShuffled);
    setPlacedLetters(newPlaced);

    if (newPlaced.every(l => l !== null)) {
      checkAnswer(newPlaced);
    }
  };

  const handleSlotClick = (index) => {
    if (isCompleted || !placedLetters[index] || placedLetters[index].isSpace) return;
    const letterToReturn = placedLetters[index];
    const newPlaced = [...placedLetters];
    newPlaced[index] = null;
    const newShuffled = shuffledLetters.map(l => l.id === letterToReturn.id ? { ...l, isUsed: false } : l);
    setPlacedLetters(newPlaced);
    setShuffledLetters(newShuffled);
  };

  const checkAnswer = (finalPlaced) => {
    const userPhrase = finalPlaced.map(l => l.char).join('');
    
    if (userPhrase === currentWordObj.word) {
      setIsCompleted(true);
      
      // 拼对时尝试播放一次声音（用户有交互，容易成功）
      speakWord();

      if (isMistakeMode) {
        const result = updateMistakeProgress(currentWordObj.word, true);
        if (result === 'graduated') {
           setGraduatedAnimation(true);
        } else {
           setCurrentHearts(h => h + 1);
           setShowCelebration(true);
           setScore(s => s + 10);
        }
      } else {
        setShowCelebration(true);
        setScore(s => s + 10);
        setShowHint(true);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (isMistakeMode) {
        updateMistakeProgress(currentWordObj.word, false);
        setCurrentHearts(0);
      } else {
        addMistake(currentWordObj);
      }
    }
  };

  // 修复：移除 alert，改用状态控制显示完成界面
  const nextLevel = () => {
    if (currentIndex < workingWords.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setShowLevelComplete(true);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    if (!isMistakeMode) {
      addMistake(currentWordObj);
    } else {
       updateMistakeProgress(currentWordObj.word, false);
       setCurrentHearts(0);
    }
  };

  const shouldShowVisuals = mode === 'visual' || showHint || isCompleted;

  if (!currentWordObj) return <div className="text-center p-10">暂时没有内容哦</div>;

  return (
    // 优化：使用 h-[100dvh] 适配移动端浏览器地址栏动态高度
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
      
      {/* 顶部栏 - 紧凑设计 */}
      <div className={`px-3 py-2 flex justify-between items-center shadow-sm relative z-10 shrink-0 ${isMistakeMode ? 'bg-red-500' : 'bg-indigo-500'} text-white`}>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-sm font-bold px-2 py-0.5 bg-white/20 rounded-md border border-white/30">
            {isMistakeMode ? '加油站' : (mode === 'blind' ? '听音' : '看图')}
          </span>
        </div>
        
        {isMistakeMode ? (
          <div className="flex gap-0.5 bg-black/20 px-2 py-1 rounded-full">
             {[0, 1, 2].map(i => (
               <Heart key={i} className={`w-4 h-4 ${i < currentHearts ? 'fill-red-300 text-red-300' : 'text-white/30'}`} />
             ))}
          </div>
        ) : (
          <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="font-bold text-base">{score}</span>
          </div>
        )}
      </div>

      {/* 游戏主体区 - Flex 布局自适应 */}
      <div className="flex-1 flex flex-col items-center justify-between p-2 md:p-4 overflow-y-auto">
        <div className={`w-full max-w-lg bg-white rounded-2xl shadow-lg border-2 flex flex-col relative flex-1 mb-2
          ${isMistakeMode ? 'border-red-100' : 'border-slate-100'}
        `}>
          
          {/* 关卡完成弹窗 - 替代 alert */}
          {showLevelComplete && (
            <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center animate-fade-in-up rounded-2xl p-6 text-center">
              <Trophy className="w-20 h-20 text-yellow-400 mb-4 drop-shadow-md" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">太棒了！</h2>
              <p className="text-gray-500 mb-6">本轮单词全部完成<br/>总分：{score}</p>
              <button onClick={onBack} className="bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition w-full max-w-xs">
                返回主页
              </button>
            </div>
          )}

          {/* 毕业动画 */}
          {graduatedAnimation && (
            <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center animate-fade-in-up rounded-2xl p-6 text-center">
              <GraduationCap className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">彻底掌握！</h2>
              <p className="text-gray-500 mb-6">已从错题本移除</p>
              <button onClick={nextLevel} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition w-full max-w-xs">
                下一个
              </button>
            </div>
          )}

          <div className="p-4 flex flex-col items-center flex-1 w-full">
            
            {/* 视觉展示区 - 压缩高度 */}
            <div className="relative w-full flex-1 flex flex-col justify-center items-center min-h-[160px]">
              {shouldShowVisuals ? (
                <div className="animate-fade-in-up text-center">
                  <div className={`text-7xl md:text-8xl mb-2 transition-transform duration-300 ${isCompleted ? 'scale-110 rotate-6' : ''}`}>
                    {currentWordObj.emoji}
                  </div>
                  <h2 className={`text-2xl font-bold tracking-widest ${getColor(currentIndex)}`}>
                    {currentWordObj.cn}
                  </h2>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center animate-pulse group cursor-pointer p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 active:bg-indigo-100 transition" 
                  onClick={handleHint}
                >
                  <HelpCircle className="w-12 h-12 text-indigo-400 mb-2" />
                  <p className="text-xs text-indigo-400 font-medium">点我偷看提示</p>
                </div>
              )}
              
              {/* 音频按钮 - 居中且显眼 */}
              <button 
                onClick={speakWord}
                className="absolute top-0 right-0 p-3 bg-indigo-50 text-indigo-600 rounded-full shadow-sm border border-indigo-100 active:scale-90 transition z-20"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {/* 填空槽 - 优化间距 */}
            <div className={`flex flex-wrap justify-center gap-1.5 md:gap-2 my-4 w-full ${shake ? 'animate-shake' : ''}`}>
              {placedLetters.map((letter, idx) => {
                if (letter && letter.isSpace) return <div key={`space-${idx}`} className="w-2 h-12 flex-shrink-0"></div>;
                return (
                  <div 
                    key={idx} onClick={() => handleSlotClick(idx)}
                    className={`w-10 h-12 md:w-12 md:h-14 flex items-center justify-center text-2xl font-bold rounded-xl border-b-4 transition-all cursor-pointer select-none
                      ${letter ? `bg-white border-blue-200 shadow-sm text-blue-600 active:scale-95` : 'bg-slate-100 border-slate-200'}
                      ${isCompleted && letter ? 'bg-green-100 border-green-400 text-green-600' : ''}
                    `}
                  >
                    {letter ? letter.char : ''}
                  </div>
                );
              })}
            </div>

            {/* 音节提示 */}
            <div className="h-6 mb-2 flex items-center justify-center gap-1 w-full">
              {isCompleted && currentWordObj.syllables && currentWordObj.syllables.map((syl, i) => (
                <span key={i} className="text-sm font-medium text-green-500 animate-fade-in-up">
                  {syl}{i < currentWordObj.syllables.length - 1 && <span className="text-green-300 mx-0.5">·</span>}
                </span>
              ))}
            </div>

            {/* 字母键盘区 - 底部固定高度，防止跳动 */}
            <div className="w-full mt-auto">
              {!isCompleted ? (
                <div className="flex flex-wrap justify-center gap-2 min-h-[100px] content-start">
                  {shuffledLetters.map((item) => (
                    <button
                      key={item.id} onClick={() => handleLetterClick(item)} disabled={item.isUsed}
                      className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-xl font-bold rounded-lg transition-all duration-100
                        ${item.isUsed ? 'opacity-0 scale-50 cursor-default' : 'bg-yellow-400 hover:bg-yellow-300 text-yellow-900 shadow-[0_3px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none'}
                      `}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              ) : (
                !graduatedAnimation && (
                  <div className="animate-fade-in-up flex justify-center pt-2">
                     <button onClick={nextLevel} className="bg-green-500 text-white text-lg font-bold py-3 px-12 rounded-full shadow-lg active:scale-95 transition flex items-center gap-2 w-full max-w-xs justify-center">
                      下一关 <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}

// --- 5. 模式选择弹窗 ---
function ModeSelectionModal({ unit, onSelectMode, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
        <div className="text-center mb-6 mt-2">
          <h2 className="text-xl font-bold text-gray-800">选择挑战模式</h2>
          <p className="text-gray-500 text-sm">{unit.subtitle}</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => onSelectMode('visual')} className="w-full bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 active:scale-98 transition">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Eye className="w-5 h-5" /></div>
            <div className="text-left flex-1"><h3 className="font-bold text-gray-800">看图练习</h3><p className="text-xs text-gray-500">简单入门</p></div>
          </button>
          <button onClick={() => onSelectMode('blind')} className="w-full bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 active:scale-98 transition">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><Ear className="w-5 h-5" /></div>
            <div className="text-left flex-1"><h3 className="font-bold text-gray-800">听音挑战</h3><p className="text-xs text-gray-500">进阶复习</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 6. 主入口 (Dashboard) ---
export default function App() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [gameMode, setGameMode] = useState(null); 
  const [mistakeCount, setMistakeCount] = useState(0);
  const [mistakeData, setMistakeData] = useState({});

  useEffect(() => {
    const checkMistakes = () => {
      const db = getMistakes();
      setMistakeCount(Object.keys(db).length);
    };
    checkMistakes();
    const interval = setInterval(checkMistakes, 1000); 
    return () => clearInterval(interval);
  }, []);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    setGameMode(null);
  };

  const startNotebookMode = () => {
    const db = getMistakes();
    if (Object.keys(db).length === 0) {
      // 移动端友好的提示
      alert("太棒了！你暂时没有错题需要复习哦！");
      return;
    }
    setMistakeData(db);
    setGameMode('notebook');
  };

  const handleBack = () => {
    setSelectedUnit(null);
    setGameMode(null);
  };

  if (gameMode === 'notebook') {
    return <GameScreen words={mistakeData} mode="notebook" isMistakeMode={true} onBack={handleBack} />;
  }

  if (selectedUnit && gameMode) {
    return <GameScreen words={selectedUnit.words} mode={gameMode} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans pb-8">
      {selectedUnit && !gameMode && (
        <ModeSelectionModal 
          unit={selectedUnit} 
          onSelectMode={setGameMode} 
          onClose={() => setSelectedUnit(null)} 
        />
      )}

      <header className="max-w-4xl mx-auto mb-6 pt-6 px-4 relative">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-sky-600 flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8" /> 
            英语大冒险
          </h1>
          <p className="text-sky-800 text-sm mt-1">三年级上册 (Book 3A)</p>
        </div>
        
        <div className="hidden md:block absolute top-6 right-4">
           <button 
             onClick={startNotebookMode}
             className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm transition-all
               ${mistakeCount > 0 ? 'bg-white text-red-500' : 'bg-gray-100 text-gray-400'}
             `}
           >
             <BookX className="w-5 h-5" />
             单词加油站
             {mistakeCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{mistakeCount}</span>}
           </button>
        </div>
      </header>
      
      <div className="md:hidden mb-6 px-4">
        <button 
             onClick={startNotebookMode}
             className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold shadow-sm transition-all border-2 active:scale-98
               ${mistakeCount > 0 ? 'bg-white border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400'}
             `}
           >
             <BookX className="w-5 h-5" />
             复习错题 ({mistakeCount})
        </button>
      </div>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {UNIT_DATA.map((unit) => (
          <div 
            key={unit.id}
            onClick={() => handleUnitClick(unit)}
            className={`
              group cursor-pointer rounded-2xl p-5 shadow-sm border-b-4 active:scale-98 transition-all relative bg-white
              ${unit.themeColor.split(' ')[1]}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center shadow-inner
                ${unit.themeColor.split(' ')[0]} 
                ${unit.themeColor.split(' ')[2]}
              `}>
                {React.cloneElement(unit.icon, { className: "w-6 h-6" })}
              </div>
              <span className="text-xs font-bold bg-white/60 text-gray-600 px-2 py-1 rounded-lg">
                 第 {unit.id} 单元
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800">
              {unit.title.split(' ')[2]} 
            </h3>
            <p className="text-gray-500 text-xs mb-3">{unit.subtitle}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-black/5">
              <div className="flex gap-1 items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-bold text-gray-400">READY</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="max-w-4xl mx-auto mt-8 text-center text-sky-300 text-xs pb-4">
        V6.0 Mobile - For Kids
      </footer>
    </div>
  );
}
