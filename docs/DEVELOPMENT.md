# 🛠️ 开发指南

> English Word Game 开发规范与贡献指南

## 🚀 开发环境设置

### 1. 克隆与安装

```bash
git clone https://github.com/he-zhii/English_word_game.git
cd English_word_game
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 3. 构建与预览

```bash
npm run build      # 生产构建
npm run preview    # 预览构建结果
npm run lint       # 代码检查
```

---

## 📝 代码规范

### 文件命名

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| React 组件 | PascalCase | `GameScreen.jsx` |
| 工具函数 | camelCase | `helpers.js` |
| 样式文件 | kebab-case | `animations.css` |
| 数据文件 | camelCase | `achievements.js` |
| JSON 数据 | camelCase | `unit1.json` |

### 组件结构

```jsx
// 文件头部注释
// 组件名称 - 功能描述

import React from 'react';
import { Icon } from 'lucide-react';

export function ComponentName({ prop1, prop2 }) {
    // 状态定义
    const [state, setState] = useState();
    
    // 副作用
    useEffect(() => {}, []);
    
    // 事件处理函数
    const handleEvent = () => {};
    
    // 渲染
    return (
        <div>...</div>
    );
}

export default ComponentName;
```

### TailwindCSS 使用规范

```jsx
// ✅ 推荐: 使用语义化类名组合
className="bg-white rounded-xl p-4 shadow-lg"

// ✅ 推荐: 响应式设计
className="text-sm md:text-base lg:text-lg"

// ✅ 推荐: 状态样式
className={`btn ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
```

---

## 📦 添加新单词

### 1. 编辑 JSON 文件

在 `src/data/words/unitX.json` 中添加：

```json
{
    "word": "apple",
    "cn": "苹果",
    "emoji": "🍎",
    "syllables": ["ap", "ple"]
}
```

### 2. 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| word | string | ✅ | 英文单词 |
| cn | string | ✅ | 中文释义 |
| emoji | string | ✅ | 表情符号 |
| syllables | string[] | ✅ | 音节拆分 |
| isActive | boolean | ❌ | 默认 true |

### 3. Emoji 选择建议

- 使用跨平台兼容的 emoji
- 避免使用皮肤色调变体
- 推荐使用单个 emoji 而非组合

---

## 🎮 添加新成就

在 `src/data/achievements.js` 中添加：

```javascript
{
    id: 'unique_id',           // 唯一标识
    title: '成就名称',          // 显示名称
    desc: '解锁条件描述',        // 条件说明
    icon: '🏆',                // 图标
    type: 'milestone',         // 类型
    condition: (stats) => stats.totalWords >= 100  // 解锁条件
}
```

### 成就类型

- `milestone` - 累积型成就
- `streak` - 连击型成就
- `funny` - 趣味型成就
- `hidden` - 隐藏型成就

---

## 🔊 音频系统

### 添加音效

在 `src/utils/audio.js` 中使用 Web Audio API：

```javascript
export const playCustomSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // 配置振荡器和增益
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    
    // 连接并播放
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};
```

---

## 💾 数据持久化

### 存储结构

所有数据存储在 localStorage，使用版本号区分：

```javascript
// src/constants/index.js
export const STORAGE_VERSION = 'v12.0';

export const KEYS = {
    WORDS: `spelling_words_${STORAGE_VERSION}`,
    // ...
};
```

### 升级存储版本

当数据结构变更时：
1. 更新 `STORAGE_VERSION`
2. 旧数据会被忽略，使用新的默认值

---

## 🐛 调试技巧

### 清除本地数据

在浏览器控制台执行：
```javascript
localStorage.clear();
location.reload();
```

### 查看存储数据

```javascript
// 查看所有存储的键
Object.keys(localStorage).filter(k => k.includes('spelling'));

// 查看单词数据
JSON.parse(localStorage.getItem('spelling_words_v12.0'));
```

### 模拟成就解锁

```javascript
// 在控制台修改统计数据
const stats = JSON.parse(localStorage.getItem('spelling_stats_v12.0'));
stats.totalWords = 100;
localStorage.setItem('spelling_stats_v12.0', JSON.stringify(stats));
location.reload();
```

---

## 📤 提交规范

### Commit Message 格式

```
<type>: <description>

[optional body]
```

### Type 类型

| Type | 说明 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档更新 |
| style | 代码格式 |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具 |

### 示例

```bash
git commit -m "feat: add unit 7 vocabulary"
git commit -m "fix: resolve audio playback issue on iOS"
git commit -m "docs: update README with new features"
```

---

## 🤝 贡献流程

1. Fork 项目
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'feat: add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request
