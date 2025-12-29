// 单词管理弹窗组件

import React, { useState, useRef } from 'react';
import { X, CheckSquare, Square, Trash2, Plus } from 'lucide-react';
import { getRandomEmoji } from '../../utils/helpers';

export function WordManagerModal({ unit, words, onUpdateWords, onClose }) {
    const [editingWords, setEditingWords] = useState(words);
    const [newWord, setNewWord] = useState("");
    const [newCn, setNewCn] = useState("");
    const scrollRef = useRef(null);

    const handleAdd = () => {
        if (!newWord || !newCn) return;
        setEditingWords([...editingWords, {
            word: newWord,
            cn: newCn,
            emoji: getRandomEmoji(),
            isActive: true,
            syllables: [newWord]
        }]);
        setNewWord("");
        setNewCn("");
        setTimeout(() => scrollRef.current.scrollTop = scrollRef.current.scrollHeight, 100);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 bg-gray-100 flex justify-between font-bold">
                    <span>管理单词: {unit.subtitle}</span>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2" ref={scrollRef}>
                    {editingWords.map((w, i) => (
                        <div key={i} className={`flex items-center gap-2 p-2 rounded border ${w.isActive ? 'bg-white' : 'bg-gray-100 opacity-60'}`}>
                            <button onClick={() => {
                                const n = [...editingWords];
                                n[i].isActive = !n[i].isActive;
                                setEditingWords(n);
                            }}>
                                {w.isActive ? <CheckSquare className="text-indigo-500" /> : <Square />}
                            </button>
                            <span className="text-2xl">{w.emoji}</span>
                            <div className="flex-1 font-bold">
                                {w.word} <span className="text-xs font-normal text-gray-500">{w.cn}</span>
                            </div>
                            <button onClick={() => setEditingWords(editingWords.filter((_, idx) => idx !== i))}>
                                <Trash2 className="text-gray-300 hover:text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex gap-2 mb-2">
                        <input
                            value={newWord}
                            onChange={e => setNewWord(e.target.value)}
                            placeholder="英文"
                            className="border p-2 rounded flex-1"
                        />
                        <input
                            value={newCn}
                            onChange={e => setNewCn(e.target.value)}
                            placeholder="中文"
                            className="border p-2 rounded flex-1"
                        />
                        <button onClick={handleAdd} className="bg-green-500 text-white p-2 rounded">
                            <Plus />
                        </button>
                    </div>
                    <button
                        onClick={() => { onUpdateWords(unit.id, editingWords); onClose(); }}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WordManagerModal;
