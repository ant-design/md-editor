﻿import { DownOutlined } from '@ant-design/icons';
import {
  generateEdges,
  MarkdownEditorInstance,
  MarkdownInputField,
} from '@ant-design/md-editor';
import { ColorPicker, Dropdown, Slider } from 'antd';
import React, { useEffect, useMemo } from 'react';

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
  const [colorList, setColorList] = React.useState<
    [string, string, string, string]
  >(
    '#CD36FF; #FFD972; #5EBFFF; #6FFFA7'?.split(';') as [
      string,
      string,
      string,
      string,
    ],
  );

  const genColorList = useMemo(() => {
    return generateEdges(
      colorList || ['#CD36FF', '#FFD972', '#5EBFFF', '#6FFFA7'],
    );
  }, [colorList?.join(',')]);

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
        bgColorList={colorList}
        borderRadius={borderRadius}
        tagInputProps={{
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

      <h2>dropdownRender</h2>
      <MarkdownInputField
        style={{
          minHeight: 66,
        }}
        value={
          '帮我查询`${placeholder:目标企业}` `${placeholder:近3年;initialValue:近6年}`的`${placeholder:资产总额}`。'
        }
        inputRef={markdownRefTwo}
        bgColorList={colorList}
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
        bgColorList={colorList}
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
        颜色
        <ColorPicker
          value={colorList?.at(0)}
          onChange={(e) => {
            setColorList((prev) => {
              const next = [...prev] as [string, string, string, string];
              next[0] = e.toHex();
              return next;
            });
          }}
        />
        <ColorPicker
          value={colorList?.at(1)}
          onChange={(e) => {
            setColorList((prev) => {
              const next = [...prev] as [string, string, string, string];
              next[1] = e.toHex();
              return next;
            });
          }}
        />
        <ColorPicker
          value={colorList?.at(2)}
          onChange={(e) => {
            setColorList((prev) => {
              const next = [...prev] as [string, string, string, string];
              next[2] = e.toHex();
              return next;
            });
          }}
        />
        <ColorPicker
          value={colorList?.at(3)}
          onChange={(e) => {
            setColorList((prev) => {
              const next = [...prev] as [string, string, string, string];
              next[3] = e.toHex();
              return next;
            });
          }}
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        fill="none"
        version="1.1"
        width="100%"
        height="100%"
        style={{
          borderRadius,
        }}
      >
        <defs>
          <linearGradient
            x1="2.463307335887066e-16"
            y1="0.5"
            x2="0.9838055372238159"
            y2="0.5"
            id="master_svg1_55_47405"
          >
            {genColorList.map((color, index) => {
              return (
                <stop
                  key={index}
                  offset={`${(index * 100) / genColorList.length}%`}
                  stopColor={color[0]}
                  stopOpacity="0.6300000071525574"
                >
                  <animate
                    attributeName="stop-color"
                    values={`${color[0]}; ${color[1]}; ${color[2]}; ${color[3]};${color[0]}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
              );
            })}
          </linearGradient>
        </defs>
        <g>
          <rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            fill="url(#master_svg1_55_47405)"
          />
        </g>
      </svg>
    </div>
  );
};
