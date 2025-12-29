// 英语单词大冒险 - 主入口

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Trophy, Star, ArrowRight, Settings,
  BookX, Zap, Gamepad2
} from 'lucide-react';

// 样式
import './styles/animations.css';

// 数据
import { ACHIEVEMENTS_DATA } from './data/achievements';
import { UNIT_METADATA } from './data/units';
import { DEFAULT_WORDS_DATA } from './data/words';

// 工具
import { shuffleArray } from './utils/helpers';
import {
  getStoredWordsData, saveWordsData, getGlobalScore,
  getMistakes, getDueMistakesCount,
  getBrawlProgress, saveBrawlProgress, clearBrawlProgress,
  getSettings, saveSettings, getStats, saveStats,
  getAchievements, saveAchievements
} from './utils/storage';
import { KEYS } from './constants';

// 组件
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastNotification } from './components/ui/ToastNotification';
import { TrophyWallModal } from './components/modals/TrophyWallModal';
import { WordManagerModal } from './components/modals/WordManagerModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ModeSelectionModal } from './components/modals/ModeSelectionModal';
import { GameScreen } from './components/game/GameScreen';
import { SentenceGameScreen } from './components/game/SentenceGameScreen';

export default function App() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [showManager, setShowManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTrophyWall, setShowTrophyWall] = useState(false);
  const [allWordsData, setAllWordsData] = useState({});
  const [stats, setStats] = useState({
    totalWords: 0, totalScore: 0, totalMistakes: 0, totalHints: 0, currentStreak: 0, titleClicks: 0,
    brawlsCompleted: 0, perfectBrawls: 0
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [settings, setSettingsState] = useState({ enableHints: true });
  const [dueCount, setDueCount] = useState(0);

  // [BugFix] 使用 state 存储大乱斗数据，避免 App 重绘导致 words 引用刷新
  const [brawlState, setBrawlState] = useState(null);

  useEffect(() => {
    // 加载单词数据
    const storedWords = getStoredWordsData();
    if (storedWords) {
      setAllWordsData(storedWords);
    } else {
      const normalized = {};
      Object.keys(DEFAULT_WORDS_DATA).forEach(k =>
        normalized[k] = DEFAULT_WORDS_DATA[k].map(w => ({ ...w, isActive: w.isActive !== false }))
      );
      setAllWordsData(normalized);
    }

    // 加载统计数据
    const storedStats = getStats();
    if (storedStats) setStats(storedStats);
    else {
      setStats(prev => ({ ...prev, totalScore: getGlobalScore() }));
    }

    // 加载其他数据
    const storedAch = getAchievements();
    if (storedAch.length > 0) setUnlockedAchievements(storedAch);

    const storedSettings = getSettings();
    setSettingsState(storedSettings);

    // 恢复大乱斗状态
    const savedBrawl = getBrawlProgress();
    if (savedBrawl) setBrawlState(savedBrawl);

    const checkDue = () => setDueCount(getDueMistakesCount());
    checkDue();
    const interval = setInterval(checkDue, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveStats(stats);
    checkAchievements(stats);
  }, [stats]);

  const checkAchievements = (currentStats) => {
    let newUnlocks = [];
    ACHIEVEMENTS_DATA.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id) && ach.condition(currentStats)) {
        newUnlocks.push(ach);
      }
    });
    if (newUnlocks.length > 0) {
      const newIds = newUnlocks.map(a => a.id);
      const updated = [...unlockedAchievements, ...newIds];
      setUnlockedAchievements(updated);
      saveAchievements(updated);
      showToast(`🏆 解锁成就：${newUnlocks[0].title}！`);
    }
  };

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleUpdateStats = (type, usedHint, brawlMistakes = 0) => {
    setStats(prev => {
      const next = { ...prev };
      if (type === 'win') {
        next.totalWords += 1;
        next.totalScore = getGlobalScore();
        if (!usedHint) next.currentStreak += 1;
        else next.currentStreak = 0;
      } else if (type === 'mistake') {
        next.totalMistakes += 1;
        next.currentStreak = 0;
      } else if (type === 'hint') {
        next.totalHints += 1;
        next.currentStreak = 0;
      } else if (type === 'brawl_complete') {
        next.brawlsCompleted = (next.brawlsCompleted || 0) + 1;
        if (brawlMistakes < 3) next.perfectBrawls = (next.perfectBrawls || 0) + 1;
      }
      return next;
    });
  };

  const handleTitleClick = () => {
    setStats(s => ({ ...s, titleClicks: (s.titleClicks || 0) + 1 }));
  };

  const handleBrawlClick = () => {
    // 优先使用 State 中的缓存
    if (brawlState && window.confirm(`发现上次大乱斗进度（第 ${brawlState.currentIndex + 1} 关），是否继续？`)) {
      setGameMode('brawl');
    } else {
      startNewBrawl();
    }
  };

  const startNewBrawl = () => {
    const allWords = Object.values(allWordsData).flat().filter(w => w.isActive !== false);
    if (allWords.length === 0) {
      alert("没有可用的单词进行大乱斗，请检查单词管理设置。");
      return;
    }
    const brawlWords = shuffleArray(allWords).slice(0, 30);
    const newState = { words: brawlWords, currentIndex: 0, score: 0 };
    saveBrawlProgress(newState);
    setBrawlState(newState); // 关键：更新 State
    setGameMode('brawl');
  };

  // [BugFix] 更新大乱斗进度的回调，同时更新 LS 和 State
  const handleBrawlProgressUpdate = (newState) => {
    saveBrawlProgress(newState);
    setBrawlState(newState);
  };

  const startNotebookMode = () => {
    const db = getMistakes();
    const now = Date.now();
    const dueWords = Object.values(db).filter(w => w.nextReview <= now);
    if (dueWords.length === 0) {
      alert("太棒了！暂时没有需要复习的单词。\n\n系统会根据你的记忆曲线，自动安排下次复习时间。");
      return;
    }
    setGameMode('notebook');
  };

  const handleUpdateWords = (uid, w) => {
    const n = { ...allWordsData, [uid]: w };
    setAllWordsData(n);
    saveWordsData(n);
  };

  const handleUpdateSettings = (s) => {
    setSettingsState(s);
    saveSettings(s);
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const renderContent = () => {
    if (gameMode === 'chant') {
      return (
        <SentenceGameScreen
          onBack={() => setGameMode(null)}
          settings={settings}
          onUpdateStats={handleUpdateStats}
        />
      );
    }

    if (gameMode === 'notebook') {
      const db = getMistakes();
      const now = Date.now();
      const words = Object.values(db).filter(w => w.nextReview <= now);
      if (words.length === 0 && dueCount > 0) {
        alert("恭喜！所有待复习单词已完成！");
        setGameMode(null);
        return null;
      }
      return (
        <ErrorBoundary>
          <GameScreen
            words={words}
            mode={gameMode}
            onBack={() => setGameMode(null)}
            settings={settings}
            onUpdateStats={handleUpdateStats}
          />
        </ErrorBoundary>
      );
    }

    if (gameMode === 'brawl') {
      if (!brawlState) return null;
      return (
        <ErrorBoundary>
          <GameScreen
            words={brawlState.words}
            mode="brawl"
            onBack={() => setGameMode(null)}
            initialIndex={brawlState.currentIndex}
            initialScore={brawlState.score}
            preShuffled={true}
            onProgressUpdate={handleBrawlProgressUpdate}
            settings={settings}
            onUpdateStats={handleUpdateStats}
          />
        </ErrorBoundary>
      );
    }

    if (gameMode && selectedUnit) {
      const words = allWordsData[selectedUnit.id] || [];
      return (
        <ErrorBoundary>
          <GameScreen
            words={words}
            mode={gameMode}
            onBack={() => setGameMode(null)}
            settings={settings}
            onUpdateStats={handleUpdateStats}
          />
        </ErrorBoundary>
      );
    }

    // 主页
    return (
      <ErrorBoundary>
        {/* 奖杯按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setShowTrophyWall(true)}
            className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold shadow-sm border-2 border-yellow-200 hover:scale-105 transition"
          >
            <Trophy className="w-5 h-5 fill-yellow-500" />
            <span>{unlockedAchievements.length}</span>
          </button>
        </div>

        {/* 设置按钮 */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowSettings(true)}
            className="bg-white text-slate-500 p-2 rounded-full shadow-sm border"
          >
            <Settings />
          </button>
        </div>

        {/* 标题 */}
        <header className="max-w-4xl mx-auto mb-8 pt-16 text-center">
          <h1
            onClick={handleTitleClick}
            className="text-3xl md:text-4xl font-extrabold text-sky-600 mb-2 flex items-center justify-center gap-3 cursor-pointer select-none active:scale-95 transition"
          >
            <BookOpen className="w-10 h-10" /> 英语单词大冒险
          </h1>
          <p className="text-sky-800 text-lg">三年级上册 (Book 3A)</p>
        </header>

        {/* 特殊模式卡片 */}
        <div className="max-w-4xl mx-auto mb-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 错题本 */}
          <div
            onClick={startNotebookMode}
            className={`relative bg-white rounded-3xl p-6 shadow-lg border-2 border-red-100 cursor-pointer hover:scale-[1.02] transition flex items-center gap-4 ${dueCount === 0 ? 'opacity-70 grayscale' : ''}`}
          >
            <div className="bg-red-100 p-4 rounded-full">
              <BookX className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">单词加油站</h3>
              <p className="text-sm text-gray-500">
                {dueCount > 0 ? `有 ${dueCount} 个单词需要复习` : '暂时没有需要复习的单词'}
              </p>
            </div>
            {dueCount > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                {dueCount}
              </span>
            )}
          </div>

          {/* 大乱斗 */}
          <div
            onClick={handleBrawlClick}
            className="relative bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 shadow-lg cursor-pointer hover:scale-[1.02] transition flex items-center gap-4 text-white overflow-hidden"
          >
            <div className="absolute right-[-20px] top-[-20px] opacity-20">
              <Gamepad2 className="w-32 h-32" />
            </div>
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Zap className="w-8 h-8 text-yellow-300" />
            </div>
            <div className="z-10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                全明星大乱斗
                <span className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded font-bold">30词</span>
              </h3>
              <p className="text-sm text-indigo-100">随机抽取，极速挑战！</p>
            </div>
          </div>
        </div>

        {/* 单元卡片 */}
        <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {UNIT_METADATA.map(unit => (
            <div
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className={`group cursor-pointer rounded-3xl p-6 shadow-lg border-b-8 transition-all hover:-translate-y-2 hover:shadow-xl bg-white ${unit.themeColor.split(' ')[1]} active:scale-95`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${unit.themeColor.split(' ')[0]} ${unit.themeColor.split(' ')[2]}`}>
                  <unit.icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold bg-white/50 text-gray-600 px-2 py-1 rounded-lg">
                  第 {unit.id} 单元
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{unit.title}</h3>
              <p className="text-gray-500 text-sm font-medium mb-4">{unit.subtitle}</p>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-black/5">
                <div className="flex gap-1 text-xs font-bold text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {(allWordsData[unit.id] || []).filter(w => w.isActive !== false).length} 词
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600" />
              </div>
            </div>
          ))}
        </main>
      </ErrorBoundary>
    );
  };

  return (
    <div className="min-h-[100dvh] w-full bg-sky-50 font-sans pb-20">
      <ErrorBoundary>
        {renderContent()}

        <ToastNotification
          isVisible={toast.visible}
          message={toast.message}
          onClose={() => setToast({ ...toast, visible: false })}
        />

        <TrophyWallModal
          isOpen={showTrophyWall}
          onClose={() => setShowTrophyWall(false)}
          unlockedIds={unlockedAchievements}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetData={handleResetData}
        />

        {selectedUnit && !gameMode && !showManager && (
          <ModeSelectionModal
            unit={selectedUnit}
            onSelectMode={setGameMode}
            onOpenManager={() => setShowManager(true)}
            onClose={() => setSelectedUnit(null)}
          />
        )}

        {showManager && selectedUnit && (
          <WordManagerModal
            unit={selectedUnit}
            words={allWordsData[selectedUnit.id] || []}
            onUpdateWords={handleUpdateWords}
            onClose={() => setShowManager(false)}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
