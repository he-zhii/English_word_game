// 设置弹窗组件

import React from 'react';
import { RefreshCw } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, settings, onUpdateSettings, onResetData }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">设置</h2>

                {/* 拼写提示开关 */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4">
                    <span>💡 拼写提示</span>
                    <button
                        onClick={() => onUpdateSettings({ ...settings, enableHints: !settings.enableHints })}
                        className={`w-12 h-6 rounded-full transition-colors ${settings.enableHints ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.enableHints ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>

                <button
                    onClick={onResetData}
                    className="w-full border border-red-200 text-red-500 py-2 rounded-lg mb-6 flex justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> 重置数据
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold"
                >
                    关闭
                </button>
            </div>
        </div>
    );
}

export default SettingsModal;
