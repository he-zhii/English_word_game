// Toast 提示组件

import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';

export function ToastNotification({ message, isVisible, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up w-max max-w-[90vw]">
            <div className="bg-slate-800/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/20">
                <div className="bg-yellow-400 rounded-full p-1 animate-spin-slow">
                    <Trophy className="w-5 h-5 text-yellow-900" />
                </div>
                <span className="font-bold text-sm md:text-base">{message}</span>
            </div>
        </div>
    );
}

export default ToastNotification;
