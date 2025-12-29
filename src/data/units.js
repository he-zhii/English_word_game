// 单元元数据定义

import { Users, Home, PawPrint, Apple, Palette, Hash } from 'lucide-react';

export const UNIT_METADATA = [
    { id: 1, title: "身体部位", subtitle: "Body Parts", themeColor: "bg-rose-100 border-rose-300 text-rose-600", icon: Users },
    { id: 2, title: "家庭关系", subtitle: "Family", themeColor: "bg-orange-100 border-orange-300 text-orange-600", icon: Home },
    { id: 3, title: "认识动物", subtitle: "Animals", themeColor: "bg-green-100 border-green-300 text-green-600", icon: PawPrint },
    { id: 4, title: "认识水果", subtitle: "Fruits", themeColor: "bg-yellow-100 border-yellow-300 text-yellow-700", icon: Apple },
    { id: 5, title: "颜色与动作", subtitle: "Colors & Actions", themeColor: "bg-indigo-100 border-indigo-300 text-indigo-600", icon: Palette, hasChant: true },
    { id: 6, title: "数字与拼读", subtitle: "Numbers & Phonics", themeColor: "bg-sky-100 border-sky-300 text-sky-600", icon: Hash }
];
