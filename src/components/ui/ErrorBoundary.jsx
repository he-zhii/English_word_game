// 错误边界组件

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Game Crashed:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-sky-50 text-center p-6">
                    <AlertTriangle className="w-16 h-16 text-orange-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-700">哎呀，游戏运行累了</h2>
                    <p className="text-slate-500 mb-6">可能是浏览器内存不足，请点击按钮刷新一下。</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg active:scale-95"
                    >
                        重新加载
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
