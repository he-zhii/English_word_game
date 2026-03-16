import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster } from 'sonner';
import { Trophy, Settings } from 'lucide-react';

import './styles/animations.css';

import { getCurrentLevel, hasLevelUp } from './data/levels';
import { getUnitsWithIcons } from './data/books';

import { useGameData } from './hooks/useGameData';
import { useAchievements } from './hooks/useAchievements';
import { useBrawl } from './hooks/useBrawl';
import {
  getCurrentBookId, setCurrentBookId,
  getGlobalScore, getMistakes, getDueMistakesCount,
  getSettings, saveSettings, getStats, saveStats,
  getGlobalStats, saveGlobalStats
} from './utils/storage';

import { notify } from './utils/notify';

import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useConfirmModal } from './components/ui/ConfirmModal';
import { TrophyWallModal } from './components/modals/TrophyWallModal';
import { WordManagerModal } from './components/modals/WordManagerModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ModeSelectionModal } from './components/modals/ModeSelectionModal';
import { GameScreen } from './components/game/GameScreen';
import { LevelUpModal } from './components/modals/LevelUpModal';

import { Header } from './components/home/Header';
import { LevelCard } from './components/home/LevelCard';
import { SpecialModes } from './components/home/SpecialModes';
import { UnitGrid } from './components/home/UnitGrid';

const DEFAULT_STATS = {
  totalWords: 0,
  totalScore: 0,
  totalMistakes: 0,
  totalHints: 0,
  currentStreak: 0,
  maxStreak: 0,
  titleClicks: 0,
  brawlsCompleted: 0,
  perfectBrawls: 0,
  speedBrawls: 0,
  notebookUsed: 0,
  unitsCompleted: 0,
  sameWordMistakes: {},
  comebackAchieved: false,
  fastestWord: null
};

const DEFAULT_GLOBAL_STATS = {
  consecutiveDays: 0,
  lastStudyDate: null,
  totalSessionMinutes: 0
};

function useNotebookWords(bookId) {
  const [words, setWords] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  useEffect(() => {
    const db = getMistakes(bookId);
    const now = Date.now();
    const dueWords = Object.values(db).filter(w => w.nextReview <= now);
    setWords(dueWords);
  }, [bookId, refreshKey]);

  return { words, refresh };
}

export default function App() {
  const [currentBookId, setCurrentBookIdState] = useState(getCurrentBookId);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [showManager, setShowManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTrophyWall, setShowTrophyWall] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [stats, setStats] = useState(() => {
    const stored = getStats(currentBookId);
    return stored || { ...DEFAULT_STATS, totalScore: getGlobalScore(currentBookId) };
  });
  const [globalStats, setGlobalStats] = useState(() => getGlobalStats());
  const [settings, setSettingsState] = useState(() => getSettings());
  const [dueCount, setDueCount] = useState(0);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const sessionStartTimeRef = useRef(null);

  const confirmModal = useConfirmModal();
  const { words: notebookWords, refresh: refreshNotebookWords } = useNotebookWords(currentBookId);

  const {
    allWordsData,
    currentBook,
    updateUnitWords,
    getAllActiveWords,
    getUnitWordCount
  } = useGameData(currentBookId);

  const { unlockedAchievements, checkAchievements } = useAchievements();

  const { brawlState, startNewBrawl, updateBrawlProgress, endBrawl } = useBrawl(
    currentBookId,
    getAllActiveWords
  );

  const unitMetadata = getUnitsWithIcons(currentBookId);

  const handleSwitchBook = useCallback((bookId) => {
    setCurrentBookId(bookId);
    setCurrentBookIdState(bookId);
    setSelectedUnit(null);
    setGameMode(null);
    const stored = getStats(bookId);
    setStats(stored || { ...DEFAULT_STATS, totalScore: getGlobalScore(bookId) });
    setDueCount(getDueMistakesCount(bookId));
  }, []);

  useEffect(() => {
    setDueCount(getDueMistakesCount(currentBookId));
    const interval = setInterval(() => {
      setDueCount(getDueMistakesCount(currentBookId));
    }, 60000);
    return () => clearInterval(interval);
  }, [currentBookId]);

  useEffect(() => {
    saveStats(currentBookId, stats);
    const allUnitsUnlocked = unitMetadata.every(unit => getUnitWordCount(unit.id) > 0);
    const enhancedStats = {
      ...stats,
      sessionMinutes,
      consecutiveDays: globalStats.consecutiveDays,
      allUnitsUnlocked
    };
    checkAchievements(enhancedStats);
  }, [stats, currentBookId, checkAchievements, sessionMinutes, globalStats.consecutiveDays, unitMetadata, getUnitWordCount]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (globalStats.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newConsecutiveDays = globalStats.lastStudyDate === yesterday
        ? globalStats.consecutiveDays + 1
        : 1;
      setGlobalStats(prev => {
        const updated = { ...prev, consecutiveDays: newConsecutiveDays, lastStudyDate: today };
        saveGlobalStats(updated);
        return updated;
      });
    }
  }, []);

  const handleUpdateStats = useCallback((type, usedHint, brawlMistakes = 0, brawlTime = 0) => {
    setStats(prev => {
      const next = { ...prev };
      const oldScore = prev.totalScore;

      if (type === 'win') {
        next.totalWords += 1;
        next.totalScore = getGlobalScore(currentBookId);
        if (!usedHint) {
          next.currentStreak += 1;
          if (next.currentStreak > next.maxStreak) {
            next.maxStreak = next.currentStreak;
          }
          if (next.currentStreak >= 20 && prev.currentStreak === 0) {
            next.comebackAchieved = true;
          }
        } else {
          next.currentStreak = 0;
        }
      } else if (type === 'mistake') {
        next.totalMistakes += 1;
        next.currentStreak = 0;
      } else if (type === 'hint') {
        next.totalHints += 1;
        next.currentStreak = 0;
      } else if (type === 'brawl_complete') {
        next.brawlsCompleted = (next.brawlsCompleted || 0) + 1;
        if (brawlMistakes < 3) next.perfectBrawls = (next.perfectBrawls || 0) + 1;
        if (brawlTime && brawlTime < 600) next.speedBrawls = (next.speedBrawls || 0) + 1;
      } else if (type === 'notebook_used') {
        next.notebookUsed = (next.notebookUsed || 0) + 1;
      } else if (type === 'unit_complete') {
        next.unitsCompleted = (next.unitsCompleted || 0) + 1;
      }

      if (hasLevelUp(oldScore, next.totalScore)) {
        const newLevel = getCurrentLevel(next.totalScore);
        setLevelUpModal(newLevel);
      }

      return next;
    });
  }, [currentBookId]);

  const handleTitleClick = useCallback(() => {
    setStats(s => ({ ...s, titleClicks: (s.titleClicks || 0) + 1 }));
  }, []);

  const handleBrawlClick = useCallback(async () => {
    if (brawlState && brawlState.words) {
      const confirmed = await confirmModal.show(
        `发现上次大乱斗进度（第 ${brawlState.currentIndex + 1} 关），是否继续？`,
        { title: '恢复进度', confirmText: '继续', cancelText: '重新开始' }
      );
      if (confirmed) {
        setGameMode('brawl');
        sessionStartTimeRef.current = Date.now();
        return;
      }
    }

    const result = startNewBrawl();
    if (result.success) {
      setGameMode('brawl');
      sessionStartTimeRef.current = Date.now();
    } else {
      notify.error('没有可用的单词进行大乱斗', {
        description: '请检查单词管理设置，确保有激活的单词'
      });
    }
  }, [brawlState, startNewBrawl, confirmModal]);

  const handleBrawlProgressUpdate = useCallback((newState) => {
    updateBrawlProgress(newState);
  }, [updateBrawlProgress]);

  const startNotebookMode = useCallback(() => {
    refreshNotebookWords();
    if (notebookWords.length === 0) {
      notify.success('太棒了！暂时没有需要复习的单词', {
        description: '系统会根据记忆曲线，自动安排下次复习时间'
      });
      return;
    }
    handleUpdateStats('notebook_used');
    setGameMode('notebook');
    sessionStartTimeRef.current = Date.now();
  }, [notebookWords.length, handleUpdateStats, refreshNotebookWords]);

  const handleUpdateWords = useCallback((unitId, words) => {
    updateUnitWords(unitId, words);
  }, [updateUnitWords]);

  const handleUpdateSettings = useCallback((newSettings) => {
    saveSettings(newSettings);
    setSettingsState(newSettings);
  }, []);

  const handleResetData = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const handleGameComplete = useCallback((mode) => {
    let brawlTime = 0;
    if (mode === 'brawl' && sessionStartTimeRef.current) {
      brawlTime = (Date.now() - sessionStartTimeRef.current) / 1000;
      handleUpdateStats('brawl_complete', false, 0, brawlTime);
    }
    notify.success('恭喜通关！', {
      icon: '🎉'
    });
    setGameMode(null);
    if (sessionStartTimeRef.current) {
      const minutes = Math.round((Date.now() - sessionStartTimeRef.current) / 60000);
      setSessionMinutes(minutes);
      setGlobalStats(prev => {
        const updated = { ...prev, totalSessionMinutes: prev.totalSessionMinutes + minutes };
        saveGlobalStats(updated);
        return updated;
      });
      sessionStartTimeRef.current = null;
    }
  }, [handleUpdateStats]);

  const renderHomePage = () => (
    <ErrorBoundary>
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowTrophyWall(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-5 py-3 rounded-full font-bold shadow-lg border-2 border-pink-300/50 hover:scale-105 transition-all duration-300"
        >
          <Trophy className="w-5 h-5 fill-white" />
          <span className="text-lg">📖</span>
          <span className="text-lg">{unlockedAchievements.length}</span>
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowSettings(true)}
          className="bg-white text-slate-500 p-2 rounded-full shadow-sm border hover:scale-105 transition-transform"
        >
          <Settings />
        </button>
      </div>

      <Header
        currentBook={currentBook}
        currentBookId={currentBookId}
        onSwitchBook={handleSwitchBook}
        onTitleClick={handleTitleClick}
      />

      <LevelCard totalScore={stats.totalScore} />

      <SpecialModes
        dueCount={dueCount}
        onNotebookClick={startNotebookMode}
        onBrawlClick={handleBrawlClick}
      />

      <UnitGrid
        units={unitMetadata}
        getUnitWordCount={getUnitWordCount}
        onUnitSelect={setSelectedUnit}
      />
    </ErrorBoundary>
  );

  const renderGameMode = () => {
    if (gameMode === 'notebook') {
      if (notebookWords.length === 0) {
        return null;
      }
      return (
        <ErrorBoundary>
          <GameScreen
            words={notebookWords}
            mode={gameMode}
            onBack={() => setGameMode(null)}
            settings={settings}
            onUpdateStats={handleUpdateStats}
            bookId={currentBookId}
            isMistakeMode={true}
            onComplete={() => handleGameComplete('notebook')}
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
            onBack={() => { endBrawl(); setGameMode(null); }}
            initialIndex={brawlState.currentIndex}
            initialScore={brawlState.score}
            preShuffled={true}
            onProgressUpdate={handleBrawlProgressUpdate}
            settings={settings}
            onUpdateStats={handleUpdateStats}
            bookId={currentBookId}
            onComplete={() => handleGameComplete('brawl')}
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
            bookId={currentBookId}
            onComplete={() => handleGameComplete(gameMode)}
          />
        </ErrorBoundary>
      );
    }

    return null;
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-xiaohongshu-light via-white to-xiaohongshu-light font-sans pb-20">
      <ErrorBoundary>
        {gameMode ? renderGameMode() : renderHomePage()}

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '9999px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 500
            },
            success: {
              style: {
                background: '#059669'
              }
            },
            error: {
              style: {
                background: '#dc2626'
              }
            },
            info: {
              style: {
                background: '#2563eb'
              }
            }
          }}
        />

        {confirmModal.modal}

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

        <LevelUpModal
          level={levelUpModal}
          onClose={() => setLevelUpModal(null)}
        />
      </ErrorBoundary>
    </div>
  );
}