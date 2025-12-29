// 模式选择弹窗组件

import React from 'react';
import { X, Settings, Eye, PenTool } from 'lucide-react';

export function ModeSelectionModal({ unit, onSelectMode, onOpenManager, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-20 bg-gradient-to-br ${unit.themeColor.split(' ')[0].replace('bg-', 'from-').replace('100', '200')} to-white opacity-50`}></div>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X /></button>
                <div className="relative text-center mb-6 mt-4">
                    <h2 className="text-2xl font-bold">{unit.title}</h2>
                    <p className="text-xs text-gray-500">{unit.subtitle}</p>
                    <button onClick={onOpenManager} className="mt-2 text-xs bg-white border px-3 py-1 rounded-full flex items-center gap-1 mx-auto">
                        <Settings className="w-3 h-3" /> 管理单词
                    </button>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={() => onSelectMode('visual')}
                        className="w-full border-2 border-indigo-100 bg-indigo-50 p-4 rounded-xl flex items-center gap-4 hover:scale-105 transition"
                    >
                        <Eye className="text-indigo-500" />
                        <div className="text-left">
                            <div className="font-bold">看图练习</div>
                            <div className="text-xs text-gray-500">轻松记单词</div>
                        </div>
                    </button>
                    <button
                        onClick={() => onSelectMode('dictation')}
                        className="w-full border-2 border-emerald-100 bg-emerald-50 p-4 rounded-xl flex items-center gap-4 hover:scale-105 transition"
                    >
                        <PenTool className="text-emerald-500" />
                        <div className="text-left">
                            <div className="font-bold">默写测验</div>
                            <div className="text-xs text-gray-500">测试掌握水平</div>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ModeSelectionModal;
