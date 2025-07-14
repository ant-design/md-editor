---
nav:
  order: 1
---

# MarkdownInputField

`MarkdownInputField` 是一个带发送功能的 Markdown 输入字段组件，允许用户编辑 Markdown 内容并通过按钮或快捷键发送。

## 功能特点

- 📝 支持 Markdown 输入
- 📎 支持附件上传
- 🔘 支持自定义操作按钮
- 🍵 支持插槽输入

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  );
};
```

## API

| 属性名           | 类型                                             | 默认值    | 描述                               |
| ---------------- | ------------------------------------------------ | --------- | ---------------------------------- |
| `value`          | `string`                                         | -         | 当前的 markdown 文本值             |
| `onChange`       | `(value: string) => void`                        | -         | 当输入值改变时触发的回调函数       |
| `placeholder`    | `string`                                         | -         | 输入字段的占位文本                 |
| `style`          | `React.CSSProperties`                            | -         | 应用于输入字段的内联样式           |
| `className`      | `string`                                         | -         | 应用于输入字段的 CSS 类名          |
| `disabled`       | `boolean`                                        | -         | 是否禁用输入字段                   |
| `typing`         | `boolean`                                        | -         | 用户是否正在输入的状态标志         |
| `triggerSendKey` | `'Enter' \| 'Mod+Enter'`                         | `'Enter'` | 触发发送操作的键盘快捷键           |
| `onSend`         | `(value: string) => Promise<void>`               | -         | 当内容发送时触发的异步回调函数     |
| `onStop`         | `() => void`                                     | -         | 正在输入中时点击发送按钮的回调函数 |
| `tagInputProps`  | `MarkdownEditorProps['tagInputProps']`           | -         | 标签输入的相关属性                 |
| `bgColorList`    | `[string, string, string, string]`               | -         | 背景颜色列表                       |
| `borderRadius`   | `number`                                         | `12`      | 边框圆角大小                       |
| `attachment`     | `{ enable?: boolean } & AttachmentButtonProps`   | -         | 附件配置                           |
| `actionsRender`  | `(props, defaultActions) => React.ReactNode[]`   | -         | 自定义渲染操作按钮的函数           |
| `toolsRender`    | `(props) => React.ReactNode[]`                   | -         | 自定义渲染操作按钮前内容的函数     |
| `leafRender`     | `(props, defaultDom) => React.ReactElement`      | -         | 自定义叶子节点渲染函数             |
| `inputRef`       | `React.MutableRefObject<MarkdownEditorInstance>` | -         | 输入框引用                         |

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  );
};
export default App;
```

### 自定义触发键和样式

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default () => {
  const [value, setValue] = React.useState('');
  return (
    <MarkdownInputField
      value={value}
      onChange={setValue}
      placeholder="按Ctrl+Enter发送消息..."
      triggerSendKey="Mod+Enter"
      style={{ minHeight: '200px' }}
      borderRadius={8}
      bgColorList={['#4A90E2', '#50E3C2', '#F5A623', '#D0021B']}
    />
  );
};
```

### 启用附件功能

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default () => {
  const [value, setValue] = React.useState('');
  return (
    <MarkdownInputField
      value={value}
      onChange={setValue}
      attachment={{
        enable: true,
        accept: '.pdf,.doc,.docx,image/*',
        maxSize: 10 * 1024 * 1024, // 10MB
        onUpload: async (file) => {
          // 模拟上传文件
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            url: URL.createObjectURL(file),
            name: file.name,
          };
        },
        onDelete: async (file) => {
          console.log('删除文件:', file);
          await new Promise((resolve) => setTimeout(resolve, 500));
        },
      }}
    />
  );
};
```

### 自定义操作按钮

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default () => {
  const [value, setValue] = React.useState('');
  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <MarkdownInputField
        value={value}
        onChange={setValue}
        toolsRender={(props) => [
          <button key="custom" onClick={() => console.log('自定义按钮')}>
            自定义
          </button>,
        ]}
        actionsRender={(props, defaultActions) => [
          <button key="custom" onClick={() => console.log('自定义按钮')}>
            自定义
          </button>,
          ...defaultActions,
        ]}
      />
    </div>
  );
};
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
      <button
        onClick={() => {
          // 获取编辑器内容
          console.log(editorRef.current?.store?.getMDContent());
          document.getElementById('test').innerHTML =
            editorRef.current?.store?.getMDContent();
        }}
      >
        获取内容
      </button>
      <div id="test" />
    </>
  );
};
export default App;
```

### 自定义叶子节点渲染

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';

export default () => {
  const [value, setValue] = React.useState('**粗体文本** *斜体文本* `代码`');

  return (
    <MarkdownInputField
      value={value}
      onChange={setValue}
      placeholder="尝试输入 **粗体**、*斜体* 或 `代码`..."
      leafRender={(props, defaultDom) => {
        const { leaf, children } = props;

        // 自定义粗体样式
        if (leaf.bold) {
          return (
            <strong
              style={{
                color: '#1890ff',
                backgroundColor: '#e6f7ff',
                padding: '2px 4px',
                borderRadius: '4px',
              }}
            >
              {children}
            </strong>
          );
        }

        // 自定义斜体样式
        if (leaf.italic) {
          return (
            <em
              style={{
                color: '#722ed1',
                backgroundColor: '#f9f0ff',
                padding: '2px 4px',
                borderRadius: '4px',
              }}
            >
              {children}
            </em>
          );
        }

        // 自定义代码样式
        if (leaf.code) {
          return (
            <code
              style={{
                color: '#d83931',
                backgroundColor: '#fff2f0',
                padding: '2px 6px',
                borderRadius: '6px',
                border: '1px solid #ffccc7',
                fontFamily: 'Monaco, Consolas, monospace',
              }}
            >
              {children}
            </code>
          );
        }

        // 返回默认渲染
        return defaultDom;
      }}
      onSend={async (text) => {
        console.log('发送内容:', text);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  );
};
```
 
### 自定义插槽

```tsx
import { MarkdownInputField } from '@ant-design/md-editor';
import { Button, Menu, Space } from 'antd';
import React, { useRef, useState } from 'react';

export default () => {
    const [value, setValue] = useState('');
    const markdownRef = useRef<any>(null);
    const [dropdownItems, setDropdownItems] = useState<string[]>([]);

    // 模拟一些插槽选项数据
    const slotItems = [
        {
            label: '目标企业',
            key: 'company',
            items: ['阿里巴巴', '腾讯', '百度']
        },
        {
            label: '时间范围',
            key: 'timeRange',
            items: ['近3年', '近5年', '近10年']
        },
        {
            label: '财务指标',
            key: 'financial',
            items: ['资产总额', '营业收入', '净利润']
        }
    ];

    // 示例：设置带插槽的内容
    const setExampleContent = () => {
        if (markdownRef.current?.store) {
            markdownRef.current.store.setMDContent('帮我查询`${placeholder:目标企业;initialValue:小米集团}` `${placeholder:时间范围}`的`${placeholder:财务指标}`。');
        }
    };

    // 示例：设置完整的查询语句
    const setFullQuery = () => {
        if (markdownRef.current?.store) {
            markdownRef.current.store.setMDContent('帮我查询`${placeholder:目标企业}`近三年的资产总额。');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={setExampleContent}>插入模板查询</Button>
                <Button onClick={setFullQuery}>插入完整查询</Button>
            </Space>

            <MarkdownInputField
                value={value}
                inputRef={markdownRef}
                style={{ minHeight: 200 }}
                placeholder="试试输入模板查询，或者点击上方按钮插入示例..."
                borderRadius={8}
                onChange={(newValue) => {
                    setValue(newValue);
                }}
                onSend={async (message) => {
                    console.log('发送消息:', message);
                }}
                tagInputProps={{
                    enable: true,
                    items: slotItems,
                    tagTextRender: (_, text) => {
                        // 保持原始格式，不做处理
                        return text.replaceAll('$', '');
                    },
                    onChange: (value: string, props) => {},
                    onOpenChange: (open: boolean) => {
                        if (!open) {
                            setDropdownItems([]);
                        }
                    },
                    dropdownRender: (_, props: any) => {
                        const currentSlot = slotItems.find(
                            (item) => item.label === props?.placeholder
                        );
                        return (
                            <Menu
                                items={currentSlot?.items?.map((item: string) => ({
                                    key: item,
                                    label: item,
                                    type: 'item',
                                }))}
                                onClick={(value) => {
                                    props.onSelect?.(value?.key);
                                }}
                            />
                        );
                    },
                }}
            />

            <div style={{ marginTop: 20, color: '#666' }}>
                <p>使用说明:</p>
                <ul>
                    <li>1. 点击上方按钮插入示例查询</li>
                    <li>2. 在插槽位置选择具体的值</li>
                    <li>3. 或者手动输入 `${"{placeholder:目标企业}"}` 格式的插槽</li>
                </ul>
            </div>
        </div>
    );
};


```
