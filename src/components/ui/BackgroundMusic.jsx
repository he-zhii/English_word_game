import { useEffect } from 'react';
import { initBackgroundMusic, setBackgroundMusicMuted, pauseBackgroundMusic } from '../../utils/audio.js';

/**
 * 全局背景音乐控制器
 * - 组件挂载时初始化音频
 * - music=true 且 paused=false 时尝试播放
 * - music=false 或 paused=true 时暂停
 * - 不渲染任何可见元素
 */
export default function BackgroundMusic({ music, paused }) {
  useEffect(() => {
    initBackgroundMusic();
    if (paused) {
      pauseBackgroundMusic();
    } else {
      setBackgroundMusicMuted(!music);
    }
  }, [music, paused]);

  return null;
}
