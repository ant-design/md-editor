---
nav:
  title: 插件
  order: 2
---

# 插件

## 概述

Markdown 编辑器插件系统提供了灵活的方式来扩展编辑器的功能。它允许你自定义节点渲染、实现 Markdown 双向转换，以及扩展编辑器行为。

## 插件接口

插件是一个实现了 `MarkdownEditorPlugin` 接口的对象，包含以下可选属性：

### 自定义节点渲染

```typescript | pure
elements?: Record<string, React.ComponentType<ElementProps<any>>>
```

此属性允许你为特定节点类型定义自定义的 React 组件。通过这个属性，你可以自定义 Markdown 元素在编辑器中的渲染方式。

示例：

```typescript | pure
const customBlockquotePlugin: MarkdownEditorPlugin = {
  elements: {
    blockquote: ({ attributes, children }) => (
      <blockquote {...attributes} className="custom-quote">
        {children}
      </blockquote>
    )
  }
}
```

### Markdown 转换

#### Markdown 解析 (`parseMarkdown`)

将 Markdown AST 节点转换为 Slate 元素。这个功能允许你自定义如何将 Markdown 语法解析为编辑器中的元素。

```typescript | pure
parseMarkdown?: {
  match: (node: Node) => boolean;  // 匹配 Markdown 语法
  convert: (node: Node) => Elements | NodeEntry<Text>;  // 转换为 Slate 元素
}[]
```

示例：

```typescript | pure
const customCodeBlockPlugin: MarkdownEditorPlugin = {
  parseMarkdown: [
    {
      match: (node) => node.type === 'code' && (node as any).lang === 'alert',
      convert: (node) => {
        const codeNode = node as any;
        return {
          type: 'code',
          language: 'text',
          value: `🚨 警告: ${codeNode.value}`,
          children: [{ text: `🚨 警告: ${codeNode.value}` }],
        };
      },
    },
  ],
};
```

#### 转换为 Markdown (`toMarkdown`)

将 Slate 元素转换回 Markdown AST 节点。这个功能用于将编辑器内容导出为 Markdown 格式。

```typescript | pure
toMarkdown?: {
  match: (node: Elements) => boolean;  // 匹配 Slate 元素类型
  convert: (node: Elements) => Node;  // 转换为 Markdown AST 节点
}[]
```

示例：

```typescript | pure
const customCodeBlockPlugin: MarkdownEditorPlugin = {
  toMarkdown: [
    {
      match: (node) => node.type === 'code-block',
      convert: (node) => ({
        type: 'code',
        lang: node.language,
        value: node.children[0].text,
      }),
    },
  ],
};
```

### 编辑器扩展

#### 扩展编辑器 (`withEditor`)

自定义编辑器实例行为。通过这个功能，你可以修改或扩展编辑器的核心行为。

```typescript | pure
withEditor?: (editor: Editor) => Editor
```

示例：

```typescript | pure
const customVoidNodePlugin: MarkdownEditorPlugin = {
  withEditor: (editor) => {
    const { isVoid } = editor;
    editor.isVoid = (element) => {
      return element.type === 'custom-void' ? true : isVoid(element);
    };
    return editor;
  },
};
```

#### 快捷键

定义自定义键盘快捷键，用于触发特定的编辑器操作。

```typescript | pure
hotkeys?: Record<string, (editor: Editor) => void>
```

示例：

```typescript | pure
const customHotkeyPlugin: MarkdownEditorPlugin = {
  hotkeys: {
    'mod+shift+c': (editor) => {
      // 处理自定义快捷键
      // mod 在 Windows 上是 Ctrl，在 Mac 上是 Command
    },
  },
};
```

#### 自定义粘贴处理 (`onPaste`)

使用自定义逻辑处理粘贴事件，可以用于实现特殊的粘贴行为。

```typescript | pure
onPaste?: (text: string) => boolean
```

示例：

```typescript | pure
const customPastePlugin: MarkdownEditorPlugin = {
  onPaste: (text) => {
    if (text.startsWith('custom:')) {
      // 处理自定义粘贴格式
      return true; // 阻止默认粘贴行为
    }
    return false; // 使用默认粘贴行为
  },
};
```

## 使用方法

插件通过 React Context 传递给编辑器。你可以组合多个插件来实现不同的功能：

```typescript | pure
import { MarkdownEditor } from './plugin';

function MarkdownEditorWithPlugins({ children }) {
  const plugins = [
    customBlockquotePlugin,
    customCodeBlockPlugin,
    customVoidNodePlugin,
    customHotkeyPlugin,
    customPastePlugin
  ];

  return (
    <MarkdownEditor plugins={plugins} />
  );
}
```

## 最佳实践

1. **模块化设计**：每个插件应该专注于一个特定的功能，这样可以更好地组织和维护代码。

2. **插件优先级**：当多个插件处理相同类型的节点时，插件列表中靠后的插件优先级更高。

3. **性能考虑**：在实现转换函数时，应该注意性能优化，特别是在处理大文档时。

4. **错误处理**：插件应该优雅地处理异常情况，不应该因为单个插件的错误而影响整个编辑器的功能。

5. **类型安全**：建议使用 TypeScript 来开发插件，这样可以获得更好的类型提示和错误检查。
