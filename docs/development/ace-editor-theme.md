---
title: AceEditor 主题支持
order: 5
---

# AceEditor 主题支持

## 概述

从版本 1.29.15 开始，AceEditor 组件已支持完整的主题配置功能。用户可以通过 `codeProps.theme` 属性为代码编辑器设置不同的主题，支持所有 Ace Editor 官方主题。

## 功能特性

### 🎨 支持的特性

- ✅ 支持所有 Ace Editor 官方主题
- ✅ 支持主题动态切换，无需重载编辑器
- ✅ 浅色和深色主题自由选择
- ✅ 默认主题为 `chrome` (浅色)
- ✅ 完全向后兼容，不影响现有代码

### 📦 实现细节

主题功能通过以下方式实现：

1. **初始化主题设置**: 在 AceEditor 初始化时自动应用配置的主题
2. **动态主题切换**: 通过 `useEffect` 监听主题变化，自动更新编辑器主题
3. **默认主题**: 如果未指定主题，默认使用 `chrome` 主题

## 使用方法

### 基础用法

```tsx
import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <MarkdownEditor
      initValue={`\`\`\`javascript
console.log('Hello World');
\`\`\``}
      codeProps={{
        theme: 'monokai', // 设置为 Monokai 主题
      }}
    />
  );
};
```

### 动态切换主题

```tsx
import { MarkdownEditor } from '@ant-design/md-editor';
import { Select } from 'antd';
import { useState } from 'react';

export default () => {
  const [theme, setTheme] = useState('chrome');

  return (
    <>
      <Select value={theme} onChange={setTheme}>
        <Select.Option value="chrome">Chrome</Select.Option>
        <Select.Option value="monokai">Monokai</Select.Option>
        <Select.Option value="github">GitHub</Select.Option>
        <Select.Option value="dracula">Dracula</Select.Option>
      </Select>
      
      <MarkdownEditor
        initValue={`\`\`\`javascript
console.log('Hello World');
\`\`\``}
        codeProps={{
          theme: theme,
        }}
      />
    </>
  );
};
```

### 结合其他配置使用

```tsx
import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <MarkdownEditor
      codeProps={{
        theme: 'solarized_dark',
        fontSize: 16,
        showLineNumbers: true,
        showGutter: true,
        wrap: true,
        tabSize: 2,
      }}
    />
  );
};
```

## 可用主题列表

### 浅色主题

- `chrome` (默认)
- `github`
- `textmate`
- `xcode`
- `solarized_light`
- `tomorrow`
- `clouds`
- `crimson_editor`
- `dawn`
- `dreamweaver`
- `eclipse`
- `iplastic`
- `katzenmilch`
- `kuroir`
- `sqlserver`

### 深色主题

- `monokai`
- `dracula`
- `tomorrow_night`
- `tomorrow_night_blue`
- `tomorrow_night_bright`
- `tomorrow_night_eighties`
- `twilight`
- `solarized_dark`
- `nord_dark`
- `cobalt`
- `idle_fingers`
- `kr_theme`
- `merbivore`
- `merbivore_soft`
- `mono_industrial`
- `pastel_on_dark`
- `terminal`
- `vibrant_ink`

更多主题请参考 [Ace Editor Kitchen Sink](https://ace.c9.io/build/kitchen-sink.html)

## API 参考

### codeProps.theme

- **类型**: `string`
- **默认值**: `'chrome'`
- **描述**: 代码编辑器主题名称

主题名称对应 Ace Editor 的主题标识符，设置后会自动加载对应的主题文件。

## 技术实现

### 代码位置

- 主要实现: `src/plugins/code/components/AceEditor.tsx`
- 类型定义: `src/MarkdownEditor/types.ts`
- 文档示例: `docs/demos/code-theme.tsx`

### 核心代码片段

```typescript:180:182:src/plugins/code/components/AceEditor.tsx
// 设置主题
const theme = editorProps.codeProps?.theme || 'chrome';
codeEditor.setTheme(`ace/theme/${theme}`);
```

```typescript:213:218:src/plugins/code/components/AceEditor.tsx
// 监听主题变化
useEffect(() => {
  if (!editorRef.current) return;
  const theme = editorProps.codeProps?.theme || 'chrome';
  editorRef.current.setTheme(`ace/theme/${theme}`);
}, [editorProps.codeProps?.theme]);
```

## 最佳实践

### 1. 根据系统主题自动切换

```tsx
import { MarkdownEditor } from '@ant-design/md-editor';
import { useEffect, useState } from 'react';

export default () => {
  const [theme, setTheme] = useState('chrome');

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeQuery.matches ? 'monokai' : 'chrome');

    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'monokai' : 'chrome');
    };

    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  return (
    <MarkdownEditor
      codeProps={{ theme }}
    />
  );
};
```

### 2. 提供主题预设

```tsx
const themePresets = {
  light: {
    theme: 'github',
    fontSize: 14,
  },
  dark: {
    theme: 'dracula',
    fontSize: 14,
  },
  highContrast: {
    theme: 'terminal',
    fontSize: 16,
  },
};

<MarkdownEditor codeProps={themePresets.dark} />
```

### 3. 持久化用户主题选择

```tsx
import { MarkdownEditor } from '@ant-design/md-editor';
import { useEffect, useState } from 'react';

export default () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('codeTheme') || 'chrome';
  });

  useEffect(() => {
    localStorage.setItem('codeTheme', theme);
  }, [theme]);

  return (
    <MarkdownEditor
      codeProps={{ theme }}
    />
  );
};
```

## 兼容性

- ✅ 完全向后兼容
- ✅ 如果不指定 `theme` 属性，将使用默认的 `chrome` 主题
- ✅ 支持所有现有的 `codeProps` 配置
- ✅ 不影响其他编辑器功能

## 相关链接

- [Ace Editor 官方文档](https://ace.c9.io/)
- [Ace Editor 主题演示](https://ace.c9.io/build/kitchen-sink.html)
- [MarkdownEditor API 文档](/components/api)
- [代码主题配置示例](/demos/code-theme)

## 更新日志

### v1.29.15
- ✨ 新增 AceEditor 主题支持
- ✨ 支持动态主题切换
- 📝 更新 API 文档和使用示例
- 📝 添加主题配置演示页面

