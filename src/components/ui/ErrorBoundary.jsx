import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { getAchievements, getSettings } from '../../utils/storage';

function backupUserData() {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      stats: {},
      achievements: getAchievements(),
      settings: getSettings()
    };

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('spelling_')) {
        backup.stats[key] = localStorage.getItem(key);
      }
    });

    sessionStorage.setItem('spelling_backup', JSON.stringify(backup));
    return true;
  } catch {
    return false;
  }
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Game Crashed:", error, errorInfo);
    backupUserData();
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-sky-50 text-center p-6">
          <AlertTriangle className="w-16 h-16 text-orange-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">哎呀，游戏运行累了</h2>
          <p className="text-slate-500 mb-6">可能是浏览器内存不足，数据已自动备份。</p>
          <div className="flex gap-4">
            <button
              onClick={this.handleRetry}
              className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg active:scale-95"
            >
              重试
            </button>
            <button
              onClick={this.handleReload}
              className="bg-slate-200 text-slate-700 px-6 py-3 rounded-full font-bold shadow-lg active:scale-95"
            >
              重新加载
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;