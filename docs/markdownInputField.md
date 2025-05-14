# MarkdownInputField

`MarkdownInputField` 是一个带发送功能的 Markdown 输入字段组件，允许用户编辑 Markdown 内容并通过按钮或快捷键发送。

## 基本使用

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default () => {
  const [value, setValue] = React.useState('');
  
  return (
    <MarkdownInputField
      value={value}
      onChange={(newValue) => setValue(newValue)}
      placeholder="请输入内容..."
      onSend={async (text) => {
        console.log('发送内容:', text);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }}
    />
  );
};
```

## API

| 属性名 | 类型 | 默认值 | 描述 |
| ------ | ---- | ------ | ---- |
| `value` | `string` | - | 当前的 markdown 文本值 |
| `onChange` | `(value: string) => void` | - | 当输入值改变时触发的回调函数 |
| `placeholder` | `string` | - | 输入字段的占位文本 |
| `style` | `React.CSSProperties` | - | 应用于输入字段的内联样式 |
| `className` | `string` | - | 应用于输入字段的 CSS 类名 |
| `disabled` | `boolean` | - | 是否禁用输入字段 |
| `typing` | `boolean` | - | 用户是否正在输入的状态标志 |
| `triggerSendKey` | `'Enter' \| 'Mod+Enter'` | `'Enter'` | 触发发送操作的键盘快捷键 |
| `onSend` | `(value: string) => Promise<void>` | - | 当内容发送时触发的异步回调函数 |
| `onStop` | `() => void` | - | 正在输入中时点击发送按钮的回调函数 |
| `tagInputProps` | `MarkdownEditorProps['tagInputProps']` | - | 标签输入的相关属性 |
| `bgColorList` | `[string, string, string, string]` | - | 背景颜色列表 |
| `borderRadius` | `number` | `12` | 边框圆角大小 |
| `attachment` | `{ enable?: boolean } & AttachmentButtonProps` | - | 附件配置 |
| `actionsRender` | `(props, defaultActions) => React.ReactNode[]` | - | 自定义渲染操作按钮的函数 |
| `beforeActionsRender` | `(props) => React.ReactNode[]` | - | 自定义渲染操作按钮前内容的函数 |
| `inputRef` | `React.MutableRefObject<MarkdownEditorInstance>` | - | 输入框引用 |

## 示例

### 基础使用

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

const App = () => {
  const [value, setValue] = React.useState('');
  
  return (
    <MarkdownInputField
      value={value}
      onChange={(newValue) => setValue(newValue)}
      placeholder="请输入内容..."
      onSend={async (text) => {
        console.log('发送内容:', text);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }}
    />
  );
};
export default App;
```

### 自定义触发键和样式

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default ()=>{
  const [value, setValue] = React.useState('');
  return <MarkdownInputField
  value={value}
  onChange={setValue}
  placeholder="按Ctrl+Enter发送消息..."
  triggerSendKey="Mod+Enter"
  style={{ minHeight: '200px' }}
  borderRadius={8}
  bgColorList={['#4A90E2', '#50E3C2', '#F5A623', '#D0021B']}
/>}
```

### 启用附件功能

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default ()=>{ 
  const [value, setValue] = React.useState('');
  return <MarkdownInputField
  value={value}
  onChange={setValue}
  attachment={{
    enable: true,
    accept: '.pdf,.doc,.docx,image/*',
    maxSize: 10 * 1024 * 1024, // 10MB
    onUpload: async (file) => {
      // 模拟上传文件
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        url: URL.createObjectURL(file),
        name: file.name
      };
    },
    onDelete: async (file) => {
      console.log('删除文件:', file);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }}
/>}
```

### 自定义操作按钮

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default ()=>{
  const [value, setValue] = React.useState('');
  return <MarkdownInputField
  value={value}
  onChange={setValue}
  actionsRender={(props, defaultActions) => [
    <button key="custom" onClick={() => console.log('自定义按钮')}>
      自定义
    </button>,
    ...defaultActions,
  ]}
/>}
```

### 获取编辑器实例

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

const App = () => {
  const editorRef = React.useRef();
  const [value, setValue] = React.useState('');
  return (
    <>
      <MarkdownInputField
        inputRef={editorRef}
        value={value}
        onChange={setValue}
      />
      <button onClick={() => {
        // 获取编辑器内容
        console.log(editorRef.current?.store?.getMDContent());
      }}>
        获取内容
      </button>
    </>
  );
};
export default App;
``` 