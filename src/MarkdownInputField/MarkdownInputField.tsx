﻿import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import React, { useContext, useEffect } from 'react';
import { useRefFunction } from '../hooks/useRefFunction';
import {
  BaseMarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../MarkdownEditor';
import { SendButton } from './SendButton';
import { useStyle } from './style';

/**
 * Markdown 输入字段的属性接口
 *
 * @interface MarkdownInputFieldProps
 * @property {string} [value] - 输入字段的当前文本值
 * @property {function} [onChange] - 当输入值改变时触发的回调函数
 * @property {string} [placeholder] - 输入字段的占位文本
 * @property {React.CSSProperties} [style] - 应用于输入字段的内联样式
 * @property {string} [className] - 应用于输入字段的 CSS 类名
 * @property {boolean} [disabled] - 是否禁用输入字段
 * @property {boolean} [typing] - 用户是否正在输入的状态标志
 * @property {'Enter' | 'Mod+Enter'} [triggerSendKey] - 触发发送操作的键盘快捷键
 * @property {function} [onSend] - 当内容发送时触发的异步回调函数
 */

export type MarkdownInputFieldProps = {
  /**
   * 当前的 markdown 文本值。
   * @example value="# Hello World"
   */
  value?: string;

  /**
   * 当输入值改变时触发的回调函数。
   * @param value The new markdown text value
   * @example onChange={(newValue) => setMarkdown(newValue)}
   */
  onChange?: (value: string) => void;

  /**
   * 输入字段的占位文本。
   * @example placeholder="Type markdown here..."
   */
  placeholder?: string;

  /**
   * 应用于输入字段的内联样式。
   * @example style={{ minHeight: '200px' }}
   */
  style?: React.CSSProperties;

  /**
   * 应用于输入字段的 CSS 类名。
   * @example className="custom-markdown-input"
   */
  className?: string;

  /**
   * 是否禁用输入字段。
   * @example disabled={isSubmitting}
   */
  disabled?: boolean;

  /**
   * 用户是否正在输入的状态标志。
   * @example typing={isComposing}
   */
  typing?: boolean;

  /**
   * 触发发送操作的键盘快捷键。
   * - 'Enter': 回车键触发发送
   * - 'Mod+Enter': 按下 Ctrl/Command + Enter 触发发送
   * @example triggerSendKey="Mod+Enter"
   */
  triggerSendKey?: 'Enter' | 'Mod+Enter';

  /**
   * 当内容发送时触发的异步回调函数。
   * 返回一个 Promise 对象，当发送成功后 resolve。
   * @param value The current markdown text value
   * @example onSend={async (text) => await submitMessage(text)}
   */
  onSend?: (value: string) => Promise<void>;

  /**
   * 正在输入中时点击发送按钮的回调函数。
   * @example onStop={() => console.log('Sending...')}
   */
  onStop?: () => void;

  tagInputProps?: MarkdownEditorProps['tagInputProps'];
  bgColorList?: [string, string, string, string];
  borderRadius?: number;
};

/**
 * @component MarkdownInputField
 * @description 带发送功能的Markdown输入字段组件。允许用户编辑Markdown内容并通过按钮或快捷键发送。
 *
 * @param {MarkdownInputFieldProps} props - 组件属性
 * @param {string} [props.value] - 输入字段的Markdown内容值
 * @param {function} [props.onChange] - 当输入内容改变时的回调函数
 * @param {function} [props.onSend] - 当内容发送时的回调函数，应返回Promise
 * @param {boolean} [props.disabled] - 是否禁用输入字段
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.placeholder] - 输入字段的占位文本
 * @param {string} [props.triggerSendKey='Enter'] - 触发发送的键盘快捷键，可以是'Enter'或'Mod+Enter'
 * @param {boolean} [props.typing] - 是否显示正在输入状态
 *
 * @returns {JSX.Element} 带样式和功能的Markdown输入字段组件
 *
 * @example
 * <MarkdownInputField
 *   value="# 标题"
 *   onChange={(value) => console.log(value)}
 *   onSend={(value) => Promise.resolve()}
 *   placeholder="请输入Markdown文本..."
 *   triggerSendKey="Mod+Enter"
 * />
 */
export const MarkdownInputField: React.FC<MarkdownInputFieldProps> = (
  props,
) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field');
  const { wrapSSR, hashId } = useStyle(baseCls);
  const [isHover, setHover] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const markdownEditorRef = React.useRef<MarkdownEditorInstance>();
  const [value, setValue] = useMergedState('', {
    value: props.value,
    onChange: props.onChange,
  });

  useEffect(() => {
    markdownEditorRef.current?.store?.setMDContent(value);
  }, [props.value]);

  const sendMessage = useRefFunction(() => {
    if (props.onSend && value) {
      setIsLoading(true);
      props
        .onSend(value)
        .then(() => {
          markdownEditorRef?.current?.store?.clearContent();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  });
  return wrapSSR(
    <div
      className={classNames(baseCls, hashId, props.className, {
        [`${baseCls}-disabled`]: props.disabled,
        [`${baseCls}-typing`]: false,
        [`${baseCls}-loading`]: isLoading,
      })}
      style={{
        ...props.style,
        borderRadius: props.borderRadius || 12,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={(e) => {
        const { triggerSendKey = 'Enter' } = props;
        if (triggerSendKey === 'Enter' && e.key === 'Enter') {
          e.stopPropagation();
          e.preventDefault();
          if (props.onSend) {
            sendMessage();
          }
          return;
        }
        if (
          triggerSendKey === 'Mod+Enter' &&
          (e.ctrlKey || e.metaKey) &&
          e.key === 'Enter'
        ) {
          e.stopPropagation();
          e.preventDefault();
          if (props.onSend) {
            sendMessage();
          }
        }
      }}
    >
      <div
        className={classNames(`${baseCls}-background`, hashId, {
          [`${baseCls}-hover`]: isHover,
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          fill="none"
          version="1.1"
          width="100%"
          style={{
            borderRadius: 'inherit',
          }}
          height="100%"
        >
          <defs>
            <linearGradient
              x1="2.463307335887066e-16"
              y1="0.5"
              x2="0.9838055372238159"
              y2="0.5"
              id="master_svg1_55_47405"
            >
              <stop
                offset="0%"
                stopColor="#CD36FF"
                stopOpacity="0.22383680939674377"
              >
                <animate
                  attributeName="stop-color"
                  values="#CD36FF; #FFD972; #5EBFFF; #6FFFA7;#CD36FF"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop
                offset="33.917319774627686%"
                stopColor="#AEB6FF"
                stopOpacity="0.699999988079071"
              >
                <animate
                  attributeName="stop-color"
                  values="#AEB6FF; #CD36FF; #FFD972; #5EBFFF; #6FFFA7;#AEB6FF"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop
                offset="51.650047302246094%"
                stopColor="#FFD972"
                stopOpacity="0.4300000071525574"
              >
                <animate
                  attributeName="stop-color"
                  values="#FFD972; #5EBFFF; #6FFFA7; #CD36FF; #FFD972"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop
                offset="81.37043118476868%"
                stopColor="#5EBFFF"
                stopOpacity="0.6200000047683716"
              >
                <animate
                  attributeName="stop-color"
                  values="#5EBFFF; #6FFFA7; #CD36FF; #FFD972; #5EBFFF"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop
                offset="100%"
                stopColor="#6FFFA7"
                stopOpacity="0.5468477010726929"
              >
                <animate
                  attributeName="stop-color"
                  values="#6FFFA7; #CD36FF; #FFD972; #5EBFFF; #6FFFA7"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
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
      <div
        style={{
          borderRadius: (props.borderRadius || 10) - 2 || 10,
        }}
        className={classNames(`${baseCls}-editor`, hashId, {
          [`${baseCls}-editor-hover`]: isHover,
          [`${baseCls}-editor-disabled`]: props.disabled,
        })}
      >
        <BaseMarkdownEditor
          editorRef={markdownEditorRef}
          style={{
            width: '100%',
            minHeight: '32px',
            height: '100%',
            cursor: isLoading || props.disabled ? 'not-allowed' : 'auto',
            opacity: isLoading || props.disabled ? 0.5 : 1,
          }}
          readonly={isLoading}
          contentStyle={{
            padding: '12px',
            paddingRight: '52px',
          }}
          textAreaProps={{
            enable: true,
            placeholder: props.placeholder,
          }}
          tagInputProps={
            props.tagInputProps || {
              enable: true,
              items: [
                {
                  key: 'Bold',
                  label: 'Bold',
                },
              ],
            }
          }
          initValue={props.value}
          onChange={(value) => {
            setValue(value);
          }}
          toc={false}
          toolBar={{
            enable: false,
          }}
          floatBar={{
            enable: false,
          }}
        />
      </div>
      <SendButton
        style={{
          position: 'absolute',
          right: 4,
          zIndex: 99,
          bottom: 8,
        }}
        typing={!!props.typing || isLoading}
        isHover={isHover}
        disabled={props.disabled}
        onClick={() => {
          if (props.typing || isLoading) {
            setIsLoading(false);
            props.onStop?.();
            return;
          }
          if (props.onSend) {
            sendMessage();
          }
        }}
      />
    </div>,
  );
};
