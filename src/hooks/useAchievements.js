import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { getAchievements, saveAchievements } from '../utils/storage';
import { playAchievementSound } from '../utils/audio';

export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => getAchievements());

  const checkAchievements = useCallback((stats) => {
    const newUnlocks = [];

    ACHIEVEMENTS_DATA.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id) && ach.condition(stats)) {
        newUnlocks.push(ach);
      }
    });

    if (newUnlocks.length > 0) {
      const newIds = newUnlocks.map(a => a.id);
      const updated = [...unlockedAchievements, ...newIds];
      setUnlockedAchievements(updated);
      saveAchievements(updated);
      playAchievementSound();

      const achievement = newUnlocks[0];
      toast.success(`${achievement.icon} ${achievement.title}`, {
        description: achievement.message,
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)',
          color: '#fff'
        }
      });

      return newUnlocks;
    }

    return null;
  }, [unlockedAchievements]);

  const getAchievementById = useCallback((id) => {
    return ACHIEVEMENTS_DATA.find(a => a.id === id);
  }, []);

  const getUnlockedCount = useCallback(() => {
    return unlockedAchievements.length;
  }, [unlockedAchievements]);

  const getTotalCount = useCallback(() => {
    return ACHIEVEMENTS_DATA.length;
  }, []);

  const isUnlocked = useCallback((id) => {
    return unlockedAchievements.includes(id);
  }, [unlockedAchievements]);

  useEffect(() => {
    const stored = getAchievements();
    if (stored.length > 0 && stored.length !== unlockedAchievements.length) {
      setUnlockedAchievements(stored);
    }
  }, [unlockedAchievements.length]);

  return {
    unlockedAchievements,
    checkAchievements,
    getAchievementById,
    getUnlockedCount,
    getTotalCount,
    isUnlocked,
    achievementsData: ACHIEVEMENTS_DATA
  };
}

export default useAchievements;