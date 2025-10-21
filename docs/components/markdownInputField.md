---
nav:
  order: 1
atomId: MarkdownInputField
group:
  title: 意图输入
  order: 3
---

# MarkdownInputField - 输入框

`MarkdownInputField` 是一个带发送功能的 Markdown 输入字段组件，允许用户编辑 Markdown 内容并通过按钮或快捷键发送。

## 功能特点

- 📝 支持 Markdown 输入
- 📎 支持附件上传
- 🔘 支持自定义操作按钮
- 🍵 支持插槽输入
- 🎯 支持技能模式

```tsx
import { Space, message } from 'antd';
import {
  DownOutlined,
  AimOutlined,
  GlobalOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Sparkles } from '@sofa-design/icons';
import {
  ActionItemBox,
  ActionItemContainer,
  MarkdownInputField,
  SuggestionList,
  ActionIconBox,
  ToggleButton,
  CreateRecognizer,
} from '@ant-design/md-editor';

const createRecognizer: CreateRecognizer = async ({ onPartial, onError }) => {
  let timer: ReturnType<typeof setInterval>;
  return {
    start: async () => {
      // 真实场景应启动麦克风与ASR服务，这里仅用计时器模拟持续的转写片段
      let i = 0;
      timer = setInterval(() => {
        onPartial(`语音片段${i} `);
        i += 1;
      }, 500);
    },
    stop: async () => {
      clearInterval(timer);
    },
  };
};
export default () => {
  const [value, setValue] = React.useState(
    '`${placeholder:目标场景}` 今天的拒绝率为什么下降 `${placeholder:目标事件}` 输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本',
  );

  const markdownRef = React.useRef<MarkdownEditorInstance>(null);

  return (
    <>
      <MarkdownInputField
        value={value}
        inputRef={markdownRef}
        voiceRecognizer={createRecognizer}
        attachment={{
          enable: true,
          accept: '.pdf,.doc,.docx,image/*',
          maxSize: 10 * 1024 * 1024, // 10MB
          upload: async (file, index) => {
            if (index == 3) {
              throw new Error('上传失败');
            }
            // 模拟上传文件
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return URL.createObjectURL(file);
          },
          onDelete: async (file) => {
            console.log('删除文件:', file);
            await new Promise((resolve) => setTimeout(resolve, 500));
          },
        }}
        tagInputProps={{
          type: 'dropdown',
          enable: true,
          items: async (props) => {
            if (props?.placeholder === '目标场景') {
              return [];
            }
            return ['tag1', 'tag2', 'tag3'].map((item) => {
              return {
                key: item,
                label: props?.placeholder + item,
              };
            });
          },
        }}
        actionsRender={(props, defaultActions) => {
          return [
            <ActionIconBox
              showTitle={props.collapseSendActions}
              title="智能改写"
              key="edit"
              style={{
                fontSize: 16,
              }}
            >
              <Sparkles />
            </ActionIconBox>,
            ...defaultActions,
          ];
        }}
        beforeToolsRender={() => {
          return (
            <ActionItemContainer showMenu={true}>
              {new Array(12).fill(0).map((_, index) => (
                <ActionItemBox
                  onClick={() => message.info('快捷技能' + index)}
                  icon="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*Bgr8QrMHLvoAAAAAF1AAAAgAekN6AQ/original"
                  iconSize={16}
                  size="small"
                  title={
                    <span
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {'快捷技能' + index}
                    </span>
                  }
                  disabled={index < 2}
                  key={'快捷技能' + index}
                />
              ))}
            </ActionItemContainer>
          );
        }}
        toolsRender={() => [
          <ToggleButton
            key="bold"
            triggerIcon={<DownOutlined />}
            onClick={() => console.log('DeepThink clicked')}
          >
            DeepThink
          </ToggleButton>,
          <ToggleButton
            key="italic"
            icon={<GlobalOutlined />}
            onClick={() => console.log('深度思考 clicked')}
          >
            深度思考
          </ToggleButton>,
          <ToggleButton
            key="link"
            icon={<AimOutlined />}
            onClick={() => console.log('联网搜索 clicked')}
          >
            联网搜索
          </ToggleButton>,
        ]}
        onChange={(newValue) => {
          setValue(newValue);
          console.log('newValue', newValue);
        }}
        placeholder="请输入内容..."
        onSend={async (text) => {
          console.log('发送内容:', text);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
      <SuggestionList
        style={{
          marginTop: 8,
          maxWidth: '980px',
        }}
        items={[
          {
            key: 'qwe',
            icon: '💸',
            text: '关税对消费类基金的影响',
            actionIcon: <EditOutlined />,
          },
          {
            key: 'asd',
            icon: '📝',
            text: '恒生科技指数基金相关新闻',
            actionIcon: <EditOutlined />,
          },
          {
            key: 'zxc',
            icon: '📊',
            text: '数据分析与可视化',
            actionIcon: <EditOutlined />,
          },
        ]}
        layout={'horizontal'}
        onItemClick={() => {
          markdownRef?.current?.store?.setMDContent(
            '关税对 `${placeholder:消费类}` 基金的影响',
          );
        }}
      />
    </>
  );
};
```

## API

| 属性名                  | 类型                                             | 默认值    | 描述                               |
| ----------------------- | ------------------------------------------------ | --------- | ---------------------------------- |
| `value`                 | `string`                                         | -         | 当前的 markdown 文本值             |
| `onChange`              | `(value: string) => void`                        | -         | 当输入值改变时触发的回调函数       |
| `placeholder`           | `string`                                         | -         | 输入字段的占位文本                 |
| `style`                 | `React.CSSProperties`                            | -         | 应用于输入字段的内联样式           |
| `className`             | `string`                                         | -         | 应用于输入字段的 CSS 类名          |
| `disabled`              | `boolean`                                        | -         | 是否禁用输入字段                   |
| `typing`                | `boolean`                                        | -         | 用户是否正在输入的状态标志         |
| `allowEmptySubmit`      | `boolean`                                        | `false`   | 是否允许在内容为空时也触发发送     |
| `triggerSendKey`        | `'Enter' \| 'Mod+Enter'`                         | `'Enter'` | 触发发送操作的键盘快捷键           |
| `onSend`                | `(value: string) => Promise<void>`               | -         | 当内容发送时触发的异步回调函数     |
| `onStop`                | `() => void`                                     | -         | 正在输入中时点击发送按钮的回调函数 |
| `onFocus`               | `(value: string, schema: Elements[]) => void`    | -         | 当输入字段获得焦点时触发的回调函数 |
| `tagInputProps`         | `MarkdownEditorProps['tagInputProps']`           | -         | 标签输入的相关属性                 |
| `borderRadius`          | `number`                                         | `12`      | 边框圆角大小                       |
| `attachment`            | `{ enable?: boolean } & AttachmentButtonProps`   | -         | 附件配置                           |
| `actionsRender`         | `(props, defaultActions) => React.ReactNode[]`   | -         | 自定义渲染操作按钮的函数           |
| `toolsRender`           | `(props) => React.ReactNode[]`                   | -         | 自定义渲染操作按钮前内容的函数     |
| `leafRender`            | `(props, defaultDom) => React.ReactElement`      | -         | 自定义叶子节点渲染函数             |
| `inputRef`              | `React.MutableRefObject<MarkdownEditorInstance>` | -         | 输入框引用                         |
| `skillMode`             | `SkillModeConfig`                                | -         | 技能模式配置                       |
| `onSkillModeOpenChange` | `(open: boolean) => void`                        | -         | 技能模式状态变化回调               |
| `pasteConfig`           | `{ enabled?: boolean; allowedTypes?: string[] }` | -         | 粘贴配置                           |

## 示例

### 基础使用

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';
import { Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const App = () => {
  const [value, setValue] = React.useState('');

  return (
    <>
      <MarkdownInputField
        value={value}
        toolsRender={() => [
          <ToggleButton
            key="bold"
            triggerIcon={<DownOutlined />}
            onClick={() => console.log('DeepThink clicked')}
          >
            DeepThink
          </ToggleButton>,
          <ToggleButton
            key="italic"
            onClick={() => console.log('深度思考 clicked')}
          >
            深度思考
          </ToggleButton>,
          <ToggleButton
            key="link"
            onClick={() => console.log('联网搜索 clicked')}
          >
            联网搜索
          </ToggleButton>,
        ]}
        onChange={(newValue) => setValue(newValue)}
        placeholder="请输入内容..."
        onSend={async (text) => {
          console.log('发送内容:', text);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>value</code> - 当前的 markdown 文本值
          </li>
          <li>
            <code>onChange</code> - 当输入值改变时触发的回调函数
          </li>
          <li>
            <code>placeholder</code> - 输入字段的占位文本
          </li>
          <li>
            <code>onSend</code> - 当内容发送时触发的异步回调函数
          </li>
        </ul>
      </div>
    </>
  );
};
export default App;
```

### 放大功能使用

```tsx
import React, { useState, useRef } from 'react';
import { MarkdownInputField, MarkdownEditorInstance } from '@ant-design/md-editor';
import { message } from 'antd';

const EnlargementExample = () => {
  const editorRef = useRef<MarkdownEditorInstance>(null);
  const containerRef = useRef<HTMLDivElement>(null); // 添加容器ref
  const [value, setValue] = useState('`${placeholder:目标场景}` 今天的拒绝率为什么下降 `${placeholder:目标事件}` 输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果。');


  return (
    // 外层容器：设置整体布局
    <div style={{ padding: '20px', border: '2px solid #1890ff', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>

      {/* 放大功能的目标容器：使用padding实现底部对齐 */}
      <div 
        ref={containerRef}
        style={{
          height: '600px', // 容器高度
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // 内容从顶部开始
          padding: '0px', // 移除padding
          border: '2px dashed #52c41a',
          borderRadius: '8px',
          backgroundColor: 'white',
          position: 'relative',
        }}
      >
        {/* 容器标识 */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          fontSize: '12px',
          color: '#52c41a',
          fontWeight: 'bold'
        }}>
          📐 放大目标容器 (600px高度) - 点击放大后会撑满此区域
        </div>

        {/* 占位空间，将输入框推到底部 */}
        <div style={{ flex: 1 }} />
        
        {/* 输入框容器，距离底部10px */}
        <div style={{ padding: '0 0 10px 0' }}>

          <MarkdownInputField
            inputRef={editorRef}
            value={value}
            enlargeable={true} // 启用放大功能（默认为 true）
            enlargeTargetRef={containerRef} // 传递目标容器ref，放大时会撑满此容器
            style={{
              width: '100%',
              maxHeight: '360', // 增加最大高度，允许向上扩展
            }}
            // 添加 toolsRender 来消除默认的64px右边距
            toolsRender={() => []}
            onChange={(newValue) => {
              setValue(newValue);
              console.log('内容变化:', newValue.length, '字符');
            }}
            placeholder="我位于容器底部10px处，输入内容会向上扩展，当高度超过270px时会显示放大按钮..."
            onSend={async (text) => {
              console.log('发送内容:', text);
              message.loading('发送中...', 1);
              await new Promise((resolve) => setTimeout(resolve, 1000));
              message.success('发送成功！');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnlargementExample;
```

> **放大功能使用说明：**
>
> - `enlargeable={true}` - 启用放大功能（默认为 true）
> - `enlargeTargetRef={containerRef}` - 传递目标容器ref，放大时会撑满此容器的完整区域
> - `显示条件` - 放大按钮需要同时满足：enlargeable=true 且 contentHeight ≥ 270px
> - `功能组件` - 包含两个按钮：展开按钮（ExpandAlt）和文本优化按钮（TextOptimize）
> - `自适应布局` - 当显示放大按钮时，编辑器内容宽度会自动调整为 `calc(100% - 46px)`
> 
> **放大功能实现原理：**
> - ✅ **容器内放大**：放大功能会撑满指定的 `enlargeTargetRef` 容器
> - 🔍 **放大时**：输入框变为固定定位 `position: fixed`，基于容器位置和尺寸进行定位
> - 📏 **尺寸计算**：宽度 = 容器宽度，高度 = 容器高度 - 48px（最小300px）
> - 📍 **位置计算**：left = 容器左边界，top = 容器顶部 + 48px
> - 🔄 **退出放大**：恢复原始样式，回到正常的文档流布局
>
> **容器Ref传递（正确的API使用方式）：**
>
> - 创建容器ref：`const containerRef = useRef<HTMLDivElement>(null);`
> - 应用到容器：`<div ref={containerRef} style={{ height: '600px' }}>`
> - 传递给组件：`enlargeTargetRef={containerRef}`
> - ✅ **重要**：必须为容器设置固定高度，放大功能才能正确计算目标高度
> - 🎯 **放大效果**：点击放大按钮后，输入框会撑满指定容器的完整区域
> **功能特性说明：**
> - ✅ **完全容器适配**：宽度和高度都基于 `enlargeTargetRef` 容器计算
> - ✅ **精确定位**：使用 `getBoundingClientRect()` 获取容器的准确位置和尺寸


### 小屏幕

```tsx
import { Space, message } from 'antd';
import {
  DownOutlined,
  AimOutlined,
  GlobalOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Sparkles } from '@sofa-design/icons';
import {
  ActionItemBox,
  ActionItemContainer,
  MarkdownInputField,
  SuggestionList,
  ActionIconBox,
  ToggleButton,
  CreateRecognizer,
} from '@ant-design/md-editor';

const createRecognizer: CreateRecognizer = async ({ onPartial, onError }) => {
  let timer: ReturnType<typeof setInterval>;
  return {
    start: async () => {
      // 真实场景应启动麦克风与ASR服务，这里仅用计时器模拟持续的转写片段
      let i = 0;
      timer = setInterval(() => {
        onPartial(`语音片段${i} `);
        i += 1;
      }, 500);
    },
    stop: async () => {
      clearInterval(timer);
    },
  };
};
export default () => {
  const [value, setValue] = React.useState(
    '`${placeholder:目标场景}` 今天的拒绝率为什么下降 `${placeholder:目标事件}` 输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本效果，输入多行文本',
  );

  const markdownRef = React.useRef<MarkdownEditorInstance>(null);

  return (
    <div
      style={{
        maxWidth: 460,
        border: '1px solid #eee',
        padding: 16,
        margin: 'auto',
      }}
    >
      <MarkdownInputField
        value={value}
        inputRef={markdownRef}
        voiceRecognizer={createRecognizer}
        attachment={{
          enable: true,
          accept: '.pdf,.doc,.docx,image/*',
          maxSize: 10 * 1024 * 1024, // 10MB
          upload: async (file, index) => {
            if (index == 3) {
              throw new Error('上传失败');
            }
            // 模拟上传文件
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return URL.createObjectURL(file);
          },
          onDelete: async (file) => {
            console.log('删除文件:', file);
            await new Promise((resolve) => setTimeout(resolve, 500));
          },
        }}
        tagInputProps={{
          type: 'dropdown',
          enable: true,
          items: async (props) => {
            if (props?.placeholder === '目标场景') {
              return [];
            }
            return ['tag1', 'tag2', 'tag3'].map((item) => {
              return {
                key: item,
                label: props?.placeholder + item,
              };
            });
          },
        }}
        actionsRender={(props, defaultActions) => {
          return [
            <ActionIconBox
              showTitle={props.collapseSendActions}
              title="智能改写"
              key="edit"
              style={{
                fontSize: 16,
              }}
            >
              <Sparkles />
            </ActionIconBox>,
            ...defaultActions,
          ];
        }}
        beforeToolsRender={() => {
          return (
            <ActionItemContainer showMenu={true}>
              {new Array(12).fill(0).map((_, index) => (
                <ActionItemBox
                  onClick={() => message.info('快捷技能' + index)}
                  icon="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*Bgr8QrMHLvoAAAAAF1AAAAgAekN6AQ/original"
                  iconSize={16}
                  size="small"
                  title={
                    <span
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {'快捷技能' + index}
                    </span>
                  }
                  disabled={index < 2}
                  key={'快捷技能' + index}
                />
              ))}
            </ActionItemContainer>
          );
        }}
        toolsRender={() => [
          <ToggleButton
            key="bold"
            triggerIcon={<DownOutlined />}
            onClick={() => console.log('DeepThink clicked')}
          >
            DeepThink
          </ToggleButton>,
          <ToggleButton
            key="italic"
            icon={<GlobalOutlined />}
            onClick={() => console.log('深度思考 clicked')}
          >
            深度思考
          </ToggleButton>,
          <ToggleButton
            key="link"
            icon={<AimOutlined />}
            onClick={() => console.log('联网搜索 clicked')}
          >
            联网搜索
          </ToggleButton>,
        ]}
        onChange={(newValue) => {
          setValue(newValue);
          console.log('newValue', newValue);
        }}
        placeholder="请输入内容..."
        onSend={async (text) => {
          console.log('发送内容:', text);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
      <SuggestionList
        style={{
          marginTop: 8,
          maxWidth: '980px',
        }}
        items={[
          {
            key: 'qwe',
            icon: '💸',
            text: '关税对消费类基金的影响',
            actionIcon: <EditOutlined />,
          },
          {
            key: 'asd',
            icon: '📝',
            text: '恒生科技指数基金相关新闻',
            actionIcon: <EditOutlined />,
          },
          {
            key: 'zxc',
            icon: '📊',
            text: '数据分析与可视化',
            actionIcon: <EditOutlined />,
          },
        ]}
        layout={'horizontal'}
        onItemClick={() => {
          markdownRef?.current?.store?.setMDContent(
            '关税对 `${placeholder:消费类}` 基金的影响',
          );
        }}
      />
    </div>
  );
};
```

### 启用语音输入按钮（支持句级回调）

```tsx
import {
  MarkdownInputField,
  type CreateRecognizer,
  ToggleButton,
} from '@ant-design/md-editor';
import { DownOutlined } from '@ant-design/icons';
export default () => {
  const createRecognizer: CreateRecognizer = async ({
    onSentenceBegin,
    onPartial,
    onSentenceEnd,
    onError,
  }) => {
    let timer: ReturnType<typeof setInterval>;
    let i = 0;
    return {
      start: async () => {
        // 真实场景应启动麦克风与ASR服务，这里用计时器模拟：句子开始 -> 多次增量 -> 句子结束
        onSentenceBegin();
        timer = setInterval(() => {
          if (i < 3) {
            onPartial(`片段${i}`);
            i += 1;
          } else {
            clearInterval(timer);
            onSentenceEnd('完整句子');
          }
        }, 500);
      },
      stop: async () => {
        clearInterval(timer);
      },
    };
  };

  return (
    <MarkdownInputField
      placeholder="请开始讲话..."
      toolsRender={() => [
        <ToggleButton
          key="bold"
          triggerIcon={<DownOutlined />}
          onClick={() => console.log('DeepThink clicked')}
        >
          DeepThink
        </ToggleButton>,
        <ToggleButton
          key="italic"
          onClick={() => console.log('深度思考 clicked')}
        >
          深度思考
        </ToggleButton>,
        <ToggleButton
          key="link"
          onClick={() => console.log('联网搜索 clicked')}
        >
          联网搜索
        </ToggleButton>,
      ]}
      voiceRecognizer={createRecognizer}
      onChange={(a) => console.log(a)}
      onSend={async (text) => {
        console.log('发送内容:', text);
      }}
    />
  );
};
```

> 交互说明：
>
> - 第一次点击语音按钮开始录音，实时将转写文本写入输入框。
> - 再次点击语音按钮结束录音。
> - 录音过程中点击发送按钮将先停止录音，再发送当前输入内容。

### 自定义触发键和样式

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';
import { DownOutlined } from '@ant-design/icons';
export default () => {
  const [value, setValue] = React.useState('');
  return (
    <>
      <MarkdownInputField
        value={value}
        onChange={setValue}
        placeholder="按Ctrl+Enter发送消息..."
        triggerSendKey="Mod+Enter"
        style={{ minHeight: '200px' }}
        borderRadius={8}
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>triggerSendKey</code> - 触发发送操作的键盘快捷键
          </li>
          <li>
            <code>style</code> - 应用于输入字段的内联样式
          </li>
          <li>
            <code>borderRadius</code> - 边框圆角大小
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 启用提示词优化

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';

export default () => {
  const [value, setValue] = React.useState(
    '请将这段提示语优化为更清晰的英文表达，并保留关键术语。',
  );

  return (
    <>
      <div
        style={{
          padding: 20,
        }}
      >
        <MarkdownInputField
          value={value}
          onChange={setValue}
          refinePrompt={{
            enable: true,
            onRefine: async (input) => {
              // 模拟异步优化（真实项目可调用后端/模型服务）
              await new Promise((r) => setTimeout(r, 2000));
              return `你好呀，哈哈哈哈 ${input}`;
            },
          }}
        />
      </div>
      <div>
        <h4>说明</h4>
        <ul>
          <li>
            <code>refinePrompt.enable</code> 为 true
            时，右上“快速操作”区域会显示“优化提示词/撤销”按钮
          </li>
          <li>
            <code>refinePrompt.onRefine</code> 接收当前输入文本，返回
            Promise&lt;string&gt; 作为优化后的文本
          </li>
          <li>优化完成后按钮恢复为“优化提示词”；</li>
        </ul>
      </div>
    </>
  );
};
```

### 启用附件功能

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';
import { DownOutlined } from '@ant-design/icons';
export default () => {
  const [value, setValue] = React.useState('');
  return (
    <>
      <MarkdownInputField
        value={value}
        onChange={setValue}
        toolsRender={() => [
          <ToggleButton
            key="bold"
            triggerIcon={<DownOutlined />}
            onClick={() => console.log('DeepThink clicked')}
          >
            DeepThink
          </ToggleButton>,
          <ToggleButton
            key="italic"
            onClick={() => console.log('深度思考 clicked')}
          >
            深度思考
          </ToggleButton>,
          <ToggleButton
            key="link"
            onClick={() => console.log('联网搜索 clicked')}
          >
            联网搜索
          </ToggleButton>,
        ]}
        attachment={{
          enable: true,
          accept: '.pdf,.doc,.docx,image/*',
          maxSize: 10 * 1024 * 1024, // 10MB
          upload: async (file) => {
            // 模拟上传文件
            await new Promise((resolve) => setTimeout(resolve, 10000));
            return URL.createObjectURL(file);
          },
          onDelete: async (file) => {
            console.log('删除文件:', file);
            await new Promise((resolve) => setTimeout(resolve, 500));
          },
        }}
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>attachment</code> - 附件配置
            <ul>
              <li>
                <code>enable</code> - 是否启用附件功能
              </li>
              <li>
                <code>accept</code> - 接受的文件类型
              </li>
              <li>
                <code>maxSize</code> - 文件最大大小限制
              </li>
              <li>
                <code>upload</code> - 文件上传回调函数
              </li>
              <li>
                <code>onDelete</code> - 文件删除回调函数
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 自定义附件按钮渲染

通过 `attachment.render` 属性，您可以完全替换默认的 `AttachmentButtonPopover` 组件，实现自定义的附件按钮交互体验。

<code src="../demos/markdownInputField/custom-attachment-popover.tsx" background="var(--main-bg-color)" iframe=800></code>

#### render 属性

| 参数   | 说明               | 类型                                         | 默认值 | 版本 |
| ------ | ------------------ | -------------------------------------------- | ------ | ---- |
| render | 自定义渲染组件函数 | `(props: RenderProps) => React.ReactElement` | -      | -    |

#### RenderProps

| 参数            | 说明                                    | 类型                                              | 默认值 | 版本 |
| --------------- | --------------------------------------- | ------------------------------------------------- | ------ | ---- |
| children        | 需要包装的子元素，通常是 Paperclip 图标 | `React.ReactNode`                                 | -      | -    |
| supportedFormat | 支持的文件格式配置                      | `AttachmentButtonPopoverProps['supportedFormat']` | -      | -    |

#### supportedFormat

| 参数       | 说明                 | 类型              | 默认值 | 版本 |
| ---------- | -------------------- | ----------------- | ------ | ---- |
| type       | 文件类型名称         | `string`          | -      | -    |
| maxSize    | 最大文件大小（KB）   | `number`          | -      | -    |
| extensions | 支持的文件扩展名数组 | `string[]`        | -      | -    |
| icon       | 文件类型图标         | `React.ReactNode` | -      | -    |

#### 兼容性

- 完全向后兼容，不使用 `render` 时保持原有行为
- 支持所有现有的 `AttachmentButton` 属性
- 可与其他附件配置选项（如 `supportedFormat`、`maxFileSize` 等）配合使用

### 自定义操作按钮

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';
import { DownOutlined } from '@ant-design/icons';
export default () => {
  const [value, setValue] = React.useState('');
  return (
    <>
      <div
        style={{
          padding: 20,
        }}
      >
        <MarkdownInputField
          value={value}
          toolsRender={() => [
            <ToggleButton
              key="bold"
              triggerIcon={<DownOutlined />}
              onClick={() => console.log('DeepThink clicked')}
            >
              DeepThink
            </ToggleButton>,
            <ToggleButton
              key="italic"
              onClick={() => console.log('深度思考 clicked')}
            >
              深度思考
            </ToggleButton>,
            <ToggleButton
              key="link"
              onClick={() => console.log('联网搜索 clicked')}
            >
              联网搜索
            </ToggleButton>,
          ]}
          onChange={setValue}
          toolsRender={(props) => [
            <ToggleButton
              key="custom"
              onClick={() => console.log('自定义按钮')}
            >
              自定义
            </ToggleButton>,
          ]}
          actionsRender={(props) => [
            <button key="custom" onClick={() => console.log('自定义按钮')}>
              自定义
            </button>,
          ]}
          quickActionRender={(props) => [
            <button key="top-right" onClick={() => console.log('右上按钮')}>
              右上
            </button>,
          ]}
        />
      </div>
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>toolsRender</code> - 自定义渲染操作按钮前内容的函数
          </li>
          <li>
            <code>actionsRender</code> - 自定义渲染操作按钮的函数
            <ul>
              <li>
                <code>props</code> - 组件属性
              </li>
              <li>
                <code>defaultActions</code> - 默认的操作按钮数组
              </li>
            </ul>
          </li>
          <li>
            <code>quickActionRender</code> -
            在编辑区域右上、贴右侧渲染按钮组；组件会根据其宽度自动为文本区域预留右侧内边距，避免遮挡。
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 获取编辑器实例

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';
import { DownOutlined } from '@ant-design/icons';
const App = () => {
  const editorRef = React.useRef();
  const [value, setValue] = React.useState('');
  return (
    <>
      <MarkdownInputField
        inputRef={editorRef}
        value={value}
        onChange={setValue}
        toolsRender={() => [
          <ToggleButton
            key="bold"
            triggerIcon={<DownOutlined />}
            onClick={() => console.log('DeepThink clicked')}
          >
            DeepThink
          </ToggleButton>,
          <ToggleButton
            key="italic"
            onClick={() => console.log('深度思考 clicked')}
          >
            深度思考
          </ToggleButton>,
          <ToggleButton
            key="link"
            onClick={() => console.log('联网搜索 clicked')}
          >
            联网搜索
          </ToggleButton>,
        ]}
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

### 焦点事件处理

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';
import { DownOutlined } from '@ant-design/icons';
export default () => {
  const [value, setValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <>
      <MarkdownInputField
        value={value}
        onChange={setValue}
        toolsRender={() => [
          <ToggleButton
            key="bold"
            triggerIcon={<DownOutlined />}
            onClick={() => console.log('DeepThink clicked')}
          >
            DeepThink
          </ToggleButton>,
          <ToggleButton
            key="italic"
            onClick={() => console.log('深度思考 clicked')}
          >
            深度思考
          </ToggleButton>,
          <ToggleButton
            key="link"
            onClick={() => console.log('联网搜索 clicked')}
          >
            联网搜索
          </ToggleButton>,
        ]}
        placeholder="点击输入框获得焦点..."
        onFocus={(value, schema) => {
          console.log('输入框获得焦点:', { value, schema });
          setIsFocused(true);
        }}
        onSend={async (text) => {
          console.log('发送内容:', text);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
      <div style={{ marginTop: 16 }}>
        <p>当前焦点状态: {isFocused ? '已获得焦点' : '未获得焦点'}</p>
      </div>
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>onFocus</code> - 当输入字段获得焦点时触发的回调函数
            <ul>
              <li>
                <code>value</code> - 当前的 markdown 文本值
              </li>
              <li>
                <code>schema</code> - 当前的编辑器 schema
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 自定义叶子节点渲染

```tsx
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';
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

### 技能模式

```tsx
import { Tag, Button, Space, Switch, Divider } from 'antd';
import { ExperimentOutlined, SettingOutlined } from '@ant-design/icons';
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';

export default () => {
  const [skillModeEnabled, setSkillModeEnabled] = React.useState(true);
  const [enableFeature, setEnableFeature] = React.useState(true);
  const [changeLog, setChangeLog] = React.useState([]);

  return (
    <>
      {/* 控制面板 */}
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          background: '#f6f8fa',
          borderRadius: 6,
        }}
      >
        <Space split={<Divider type="vertical" />}>
          <label>
            功能开关:
            <Switch
              checked={enableFeature}
              onChange={setEnableFeature}
              style={{ marginLeft: 8 }}
            />
          </label>
          <label>
            显示控制:
            <Switch
              checked={skillModeEnabled}
              onChange={setSkillModeEnabled}
              disabled={!enableFeature}
              style={{ marginLeft: 8 }}
            />
          </label>
          <Button size="small" onClick={() => setChangeLog([])}>
            清空日志
          </Button>
        </Space>

        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          <p style={{ margin: '4px 0' }}>
            <strong>enable={enableFeature ? 'true' : 'false'}</strong> -{' '}
            {enableFeature
              ? '功能启用时，组件正常渲染和工作'
              : '功能禁用时，组件完全不渲染，不执行任何逻辑'}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>open={skillModeEnabled ? 'true' : 'false'}</strong> -{' '}
            控制技能模式的显示与隐藏
          </p>
        </div>
      </div>

      <MarkdownInputField
        placeholder="请输入内容..."
        skillMode={{
          enable: enableFeature, // 控制整个功能是否启用
          open: skillModeEnabled,
          title: (
            <Space>
              <ExperimentOutlined />
              AI助手模式
            </Space>
          ),
          rightContent: [
            <Tag key="version" color="blue">
              v2.0
            </Tag>,
            <Tag
              key="status"
              color={enableFeature ? 'green' : 'red'}
              style={{ fontSize: 11 }}
            >
              {enableFeature ? '已启用' : '已禁用'}
            </Tag>,
            <Button
              key="settings"
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => console.log('设置点击')}
            >
              设置
            </Button>,
          ],
          closable: true,
        }}
        onSkillModeOpenChange={(open) => {
          const timestamp = new Date().toLocaleTimeString();
          const actionText = open ? '打开' : '关闭';
          const logEntry = `[${timestamp}] ${actionText}`;

          setChangeLog((prev) => [logEntry, ...prev.slice(0, 4)]);
          setSkillModeEnabled(open);
        }}
        onSend={async (text) => {
          console.log('发送内容:', text);
        }}
      />

      {/* 状态变化日志 */}
      {changeLog.length > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f6f8fa',
            borderRadius: 6,
            maxHeight: 120,
            overflow: 'auto',
          }}
        >
          <strong>状态变化日志：</strong>
          {changeLog.map((log, index) => (
            <div
              key={index}
              style={{ fontSize: 12, color: '#666', margin: '4px 0' }}
            >
              {log}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>skillMode</code> - 技能模式配置
            <ul>
              <li>
                <code>enable</code> - 是否启用技能模式组件，默认为 true
              </li>
              <li>
                <code>open</code> - 是否打开技能模式
              </li>
              <li>
                <code>title</code> - 技能模式标题，支持React节点
              </li>
              <li>
                <code>rightContent</code> - 右侧自定义内容数组
              </li>
              <li>
                <code>closable</code> - 是否显示默认关闭按钮
              </li>
              <li>
                <code>style</code> - 容器样式
              </li>
              <li>
                <code>className</code> - 容器类名
              </li>
            </ul>
          </li>
          <li>
            <code>onSkillModeOpenChange</code> -
            技能模式状态变化时触发的回调函数
            <ul>
              <li>
                <code>open</code> - 新的开关状态
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```

> 交互说明：
>
> - **功能开关**: `enable` 参数控制整个技能模式功能的启用状态
>   - 当 `enable={false}` 时，组件完全不渲染，不执行任何逻辑，提供最佳性能
>   - 当 `enable={true}` 时，组件正常工作，可通过 `open` 参数控制显示/隐藏
> - **显示控制**: `open` 参数控制技能模式的显示与隐藏状态
> - **动画效果**: 支持流畅的上下滑动动画效果（300ms 缓动动画）
> - **自定义内容**: 支持自定义标题和右侧内容，可以显示版本、设置按钮等
> - **状态监听**: `onSkillModeOpenChange` 监听所有状态变化，包括点击关闭按钮和外部代码修改
> - **交互演示**: 通过控制面板可以实时体验不同参数的效果，状态变化日志实时记录所有操作

### 粘贴配置

```tsx | pure
import { MarkdownInputField, ToggleButton } from '@ant-design/md-editor';

export default () => {
  const [value, setValue] = React.useState('');

  return (
    <>
      <MarkdownInputField
        value={value}
        onChange={setValue}
        placeholder="只能粘贴纯文本内容..."
        pasteConfig={{
          enabled: true,
          allowedTypes: ['text/plain'],
        }}
        onSend={async (text) => {
          console.log('发送内容:', text);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
      <div style={{ marginTop: 16 }}>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>pasteConfig</code> - 粘贴配置
            <ul>
              <li>
                <code>enabled</code> - 是否启用粘贴功能，默认为 true
              </li>
              <li>
                <code>allowedTypes</code> - 允许的粘贴内容类型
                <ul>
                  <li>
                    <code>application/x-slate-md-fragment</code> - Slate
                    Markdown 片段
                  </li>
                  <li>
                    <code>text/html</code> - HTML 内容
                  </li>
                  <li>
                    <code>Files</code> - 文件
                  </li>
                  <li>
                    <code>text/markdown</code> - Markdown 文本
                  </li>
                  <li>
                    <code>text/plain</code> - 纯文本
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```
