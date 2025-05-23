/**
 * @fileoverview 代码编辑器工具栏组件
 * 提供代码块的各种操作功能，包括语言切换、复制、运行等
 * @author Code Plugin Team
 */

import {
  CloseCircleOutlined,
  CopyOutlined,
  ForwardOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import React, { useContext } from 'react';
import { I18nContext } from '../../../i18n';
import { ActionIconBox } from '../../../MarkdownEditor/editor/components/ActionIconBox';
import { CodeNode } from '../../../MarkdownEditor/el';
import { langIconMap } from '../langIconMap';
import { LanguageSelector, LanguageSelectorProps } from './LanguageSelector';
import { LoadImage } from './LoadImage';

/**
 * 代码工具栏组件的属性接口
 */
export interface CodeToolbarProps {
  /** 代码块元素数据 */
  element: CodeNode;
  /** 是否为只读模式 */
  readonly: boolean;
  /** 关闭按钮点击回调（用于公式和 mermaid） */
  onCloseClick: () => void;
  /** HTML 代码运行按钮点击回调 */
  onRunHtml: () => void;
  /** 全屏切换按钮点击回调 */
  onFullScreenToggle: () => void;
  /** 当前是否为全屏状态 */
  isFullScreen: boolean;
  /** 语言选择器的属性 */
  languageSelectorProps: LanguageSelectorProps;
}

/**
 * 代码编辑器工具栏组件
 *
 * 功能：
 * - 语言选择器（非只读模式）
 * - 只读模式下的语言显示
 * - 复制代码功能
 * - 全屏切换功能
 * - HTML 代码运行功能（仅限 HTML 语言）
 * - 关闭功能（仅限公式和 mermaid）
 *
 * 布局：
 * - 左侧：语言选择器或语言显示
 * - 右侧：操作按钮组（关闭、运行、复制、全屏）
 *
 * @param props - 组件属性
 * @returns React 工具栏元素
 *
 * @example
 * ```tsx
 * <CodeToolbar
 *   element={codeElement}
 *   readonly={false}
 *   onCloseClick={() => setHidden(true)}
 *   onRunHtml={() => executeHtml()}
 *   onFullScreenToggle={() => toggleFullScreen()}
 *   isFullScreen={false}
 *   languageSelectorProps={langProps}
 * />
 * ```
 */
export const CodeToolbar = (props: CodeToolbarProps) => {
  // 获取国际化上下文
  const i18n = useContext(I18nContext);

  // 解构 props 以提高代码可读性
  const {
    element,
    readonly,
    onCloseClick,
    onRunHtml,
    onFullScreenToggle,
    languageSelectorProps,
  } = props;

  return (
    <div
      contentEditable={false}
      onClick={(e) => {
        // 阻止事件冒泡，避免影响编辑器焦点
        e.stopPropagation();
      }}
      style={{
        height: '1.75em',
        backgroundColor: '#FFF',
        borderBottom: '1px solid #eee',
        paddingLeft: '0.75em',
        paddingRight: '0.375em',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'sticky',
        left: 0,
        top: 0,
        fontSize: '1em',
        color: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'space-between',
        zIndex: 50,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* 左侧：语言选择器或语言显示 */}
      {readonly ? (
        // 只读模式：仅显示当前语言信息
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: 2,
            color: 'rgba(0, 0, 0, 0.8)',
            userSelect: 'none',
          }}
          contentEditable={false}
        >
          {/* 语言图标（如果存在且不是公式） */}
          {langIconMap.get(element.language?.toLowerCase() || '') &&
            !element.katex && (
              <div
                style={{
                  height: '1em',
                  width: '1em',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  justifyContent: 'center',
                  marginRight: '0.25em',
                }}
              >
                <LoadImage
                  style={{
                    height: '1em',
                    width: '1em',
                  }}
                  src={langIconMap.get(element.language?.toLowerCase() || '')}
                />
              </div>
            )}
          <div>
            {element.language ? (
              <span>
                {/* 根据代码类型显示不同标签 */}
                {element.katex
                  ? 'Formula'
                  : element.language === 'html' && element.render
                    ? 'Html Renderer'
                    : element.language}
              </span>
            ) : (
              <span>{'plain text'}</span>
            )}
          </div>
        </div>
      ) : (
        // 非只读模式：显示语言选择器
        <LanguageSelector {...languageSelectorProps} />
      )}

      {/* 右侧：操作按钮组 */}
      <div
        style={{
          display: 'flex',
          gap: 5,
        }}
      >
        {/* 关闭按钮（仅公式和 mermaid 显示） */}
        {element.katex || element.language === 'mermaid' ? (
          <ActionIconBox title="关闭" onClick={onCloseClick}>
            <CloseCircleOutlined />
          </ActionIconBox>
        ) : null}

        {/* HTML 运行按钮（仅 HTML 语言显示） */}
        {element?.language === 'html' ? (
          <ActionIconBox
            title="运行代码"
            style={{
              fontSize: '0.9em',
              lineHeight: '1.75em',
              marginLeft: '0.125em',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRunHtml();
            }}
          >
            <ForwardOutlined />
          </ActionIconBox>
        ) : null}

        {/* 复制按钮 */}
        <ActionIconBox
          title={i18n?.locale?.copy || '复制'}
          style={{
            fontSize: '0.9em',
            lineHeight: '1.75em',
            marginLeft: '0.125em',
          }}
          onClick={(e) => {
            e.stopPropagation();
            try {
              const code = element.value || '';
              // 优先使用现代 Clipboard API
              if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(code);
              } else {
                // 降级到传统方式
                //@ts-ignore
                document.execCommand('copy', false, code);
              }
              // 显示成功提示
              message.success(i18n.locale?.copySuccess || '复制成功');
            } catch (error) {
              // 复制失败时静默处理
            }
          }}
        >
          <CopyOutlined />
        </ActionIconBox>

        {/* 全屏切换按钮 */}
        <ActionIconBox
          title={i18n?.locale?.fullScreen || '全屏'}
          style={{
            fontSize: '0.9em',
            lineHeight: '1.75em',
            marginLeft: '0.125em',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onFullScreenToggle();
          }}
        >
          <FullscreenOutlined />
        </ActionIconBox>
      </div>
    </div>
  );
};
