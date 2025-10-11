import { DownOutlined } from '@ant-design/icons';
import {
  MarkdownEditorInstance,
  MarkdownInputField,
} from '@ant-design/md-editor';
import { Dropdown, Slider } from 'antd';
import React, { useEffect } from 'react';

import { useState } from 'react';

const TagRender: React.FC<any> = (props: {
  onSelect: (value: string) => void;
  defaultDom: React.ReactNode;
  placeholder: string;
  readonly?: boolean;
}) => {
  const { onSelect, defaultDom, readonly } = props || {};
  const [items] = useState<any[]>(() => [
    {
      key: '1',
      label: '选项1',
    },
    {
      key: '2',
      label: '选项2',
    },
    {
      key: '3',
      label: '选项3',
    },
  ]);

  return (
    <Dropdown
      disabled={readonly}
      menu={{
        items,
        onClick: (e) => {
          const item = items.find((item) => item.key === e.key);
          if (item) {
            onSelect?.(item.label);
          }
        },
      }}
      trigger={['click']}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {defaultDom}
        <DownOutlined
          style={{
            color: '#999',
            fontSize: 12,
          }}
        />
      </div>
    </Dropdown>
  );
};

export default () => {
  const markdownRef = React.useRef<MarkdownEditorInstance>();
  const markdownRefTwo = React.useRef<MarkdownEditorInstance>();
  const [list, setList] = React.useState<Set<string>>(() => new Set());
  const send = async (value: string) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
    setList((prev) => {
      const next = new Set(prev);
      console.log(value);
      next.add(value);
      return next;
    });
  };
  const [borderRadius, setBorderRadius] = React.useState(0);

  useEffect(() => {
    markdownRefTwo.current?.store?.setMDContent(
      '帮我查询`${placeholder:目标企业}` `${placeholder:近3年;initialValue:近6年}`的`${placeholder:资产总额}`。',
    );
  }, []);
  return (
    <div
      style={{
        padding: '20px',
        margin: 'auto',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div>
        圆角：
        <Slider
          value={borderRadius}
          onChange={(value) => setBorderRadius(value)}
        />
      </div>

      <ul>
        {[...list].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h2>基本</h2>
      <MarkdownInputField
        style={{
          minHeight: 66,
        }}
        value={
          '帮我查询`${placeholder:目标企业}` `${placeholder:近3年;initialValue:近6年}`的`${placeholder:资产总额}`。'
        }
        inputRef={markdownRefTwo}
        borderRadius={borderRadius}
        tagInputProps={{
          enable: true,
          items: async (props) => {
            console.log('items', props);
            return ['tag1', 'tag2', 'tag3'].map((item) => {
              return {
                key: item,
                label: props?.placeholder + item,
              };
            });
          },
        }}
        onSend={send}
        onStop={() => console.log('stop...')}
        placeholder="请输入内容"
      />

      <h2>dropdownRender</h2>
      <MarkdownInputField
        style={{
          minHeight: 66,
        }}
        value={
          '帮我查询`${placeholder:目标企业}` `${placeholder:近3年;initialValue:近6年}`的`${placeholder:资产总额}`。'
        }
        inputRef={markdownRefTwo}
        borderRadius={borderRadius}
        tagInputProps={{
          dropdownRender: (defaultDom, props) => {
            return (
              <div>
                placeholder: {props.placeholder} text: {props.text}
                {defaultDom}
              </div>
            );
          },
          tagTextStyle: {
            background: '#EEF1FF',
            color: '#4C4BDF',
            lineHeight: '22px',
            borderWidth: 0,
          },
          tagTextRender: (props, text) => {
            return text.replaceAll('$', '');
          },
          enable: true,
          items: async (props) => {
            return ['tag1', 'tag2', 'tag3'].map((item) => {
              return {
                key: item,
                label: props?.placeholder + item,
              };
            });
          },
        }}
        onSend={send}
        onStop={() => console.log('stop...')}
        placeholder="请输入内容"
      />
      <h2>自定义的 Tag</h2>
      <MarkdownInputField
        inputRef={markdownRef}
        value={
          '帮我查询`${placeholder:目标企业}` `${placeholder:近3年;initialValue:近6年}`的`${placeholder:资产总额}`。'
        }
        tagInputProps={{
          dropdownRender: () => {
            return null;
          },
          tagTextStyle: {
            background: '#EEF1FF',
            color: '#4C4BDF',
            lineHeight: '22px',
            borderWidth: 0,
          },
          tagTextRender: (props, text) => {
            console.log('tagTextRender', text);
            return text.replaceAll('$', '');
          },
          enable: true,
          items: ['tag1', 'tag2', 'tag3'].map((item) => ({
            key: item,
            label: item,
          })),
          tagRender: (props, defaultDom: React.ReactNode) => {
            return (
              <TagRender
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                defaultDom={defaultDom}
                placeholder={props.placeholder}
                onSelect={(value: string) => {
                  props.onSelect?.(value, {
                    value: '123',
                  });
                }}
              />
            );
          },
        }}
        onSend={send}
        onStop={() => console.log('stop...')}
        placeholder="请输入内容"
      />
      <h2>文件上传</h2>

      <MarkdownInputField
        borderRadius={borderRadius}
        attachment={{
          enable: true,
          upload: async (file) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(URL.createObjectURL(file));
              }, 1000);
            });
          },
          onDelete: async (file) => {
            URL.revokeObjectURL(file.previewUrl!);
          },
        }}
        value={
          '帮我查询`${placeholder:目标企业}` `${placeholder:近3年;initialValue:近6年}`的`${placeholder:资产总额}`。'
        }
        tagInputProps={{
          enable: true,
          items: ['tag1', 'tag2', 'tag3'].map((item) => ({
            key: item,
            label: item,
          })),
        }}
        onSend={send}
        onStop={() => console.log('stop...')}
        placeholder="请输入内容"
      />
      <h2>滚动条</h2>
      <MarkdownInputField
        borderRadius={borderRadius}
        tagInputProps={{
          enable: true,
          items: ['tag1', 'tag2', 'tag3'].map((item) => ({
            key: item,
            label: item,
          })),
        }}
        onSend={send}
        value="《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。"
        onStop={() => console.log('stop...')}
        placeholder="请输入内容"
      />
      <h2>disable</h2>
      <MarkdownInputField
        borderRadius={borderRadius}
        onSend={send}
        disabled
        value={
          '帮我查询`${placeholder:目标企业}` `${placeholder:近3年;initialValue:近6年}`的`${placeholder:资产总额}`。'
        }
        placeholder="请输入内容"
      />

      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>markdownRef</code> - Markdown 编辑器引用，用于访问编辑器实例
          </li>
          <li>
            <code>markdownRefTwo</code> - 第二个 Markdown 编辑器引用
          </li>
          <li>
            <code>list</code> - 列表状态，使用 Set 存储字符串集合
          </li>
          <li>
            <code>setList</code> - 设置列表状态的函数
          </li>
          <li>
            <code>send</code> - 发送函数，异步处理输入值并添加到列表
          </li>
          <li>
            <code>borderRadius</code> - 边框圆角状态
          </li>
          <li>
            <code>setBorderRadius</code> - 设置边框圆角的函数
          </li>
          <li>
            <code>colorList</code> - 颜色列表状态，包含四个颜色值
          </li>
          <li>
            <code>setColorList</code> - 设置颜色列表的函数
          </li>
          <li>
            <code>genColorList</code> - 生成的颜色列表，通过 generateEdges
            函数处理
          </li>
          <li>
            <code>TagRender</code> - 自定义标签渲染组件，包含下拉菜单功能
          </li>
          <li>
            <code>onSelect</code> - 选择回调函数
          </li>
          <li>
            <code>defaultDom</code> - 默认 DOM 元素
          </li>
          <li>
            <code>placeholder</code> - 占位符文本
          </li>
          <li>
            <code>readonly</code> - 只读状态
          </li>
          <li>
            <code>generateEdges</code> - 生成边缘颜色的工具函数
          </li>
        </ul>
      </div>
    </div>
  );
};
