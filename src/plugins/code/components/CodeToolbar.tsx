/**
 * @fileoverview 代码编辑器工具栏组件
 * 提供代码块的各种操作功能，包括语言切换、复制、运行等
 * @author Code Plugin Team
 */

import {
  CloseCircleOutlined,
  CopyOutlined,
  DownOutlined,
  ForwardOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import React, { useContext, useState } from 'react';
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
  /** 代码块是否被选中 */
  isSelected?: boolean;
  /** 代码块选中状态变化回调 */
  onSelectionChange?: (selected: boolean) => void;
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

  // 工具栏显示状态管理
  const [isVisible, setIsVisible] = useState(false);

  // 解构 props 以提高代码可读性
  const {
    element,
    readonly,
    onCloseClick,
    onRunHtml,
    onFullScreenToggle,
    languageSelectorProps,
    onSelectionChange,
    isSelected = false,
  } = props;

  // 隐藏工具栏
  const hideToolbar = () => {
    setIsVisible(false);
  };

  // 切换选中状态
  const toggleSelection = () => {
    setTimeout(() => {
      onSelectionChange?.(true);
    }, 300);
    setIsVisible(true);
  };

  // 如果工具栏隐藏，只显示悬浮时的展开按钮
  if (!isVisible) {
    return (
      <div
        contentEditable={false}
        style={{
          height: '1px',
          width: '100%',
          position: 'sticky',
          left: 0,
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '0.375em',
          zIndex: 50,
          boxSizing: 'border-box',
        }}
      >
        {/* 选中状态下显示下拉按钮 */}
        {isSelected ? (
          <div
            onClick={toggleSelection}
            style={{
              position: 'absolute',
              backgroundColor: '#1890ff',
              right: '50%',
              zIndex: 100,
              top: '0.25em',
              transform: 'translateX(50%)',
              padding: '0.25em',
              borderRadius: '0.25em',
              cursor: 'pointer',
              fontSize: '0.8em',
              color: '#fff',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DownOutlined />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      contentEditable={false}
      style={{
        height: '1.75em',
        backgroundColor: '#FFF',
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
        transition: 'border-color 0.2s ease-in-out',
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
              copy(code);
              // 显示成功提示
              message.success(i18n.locale?.copySuccess || '复制成功');
            } catch (error) {
              // 复制失败时静默处理
              console.error('复制失败:', error);
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

        {/* 收起按钮 */}
        <ActionIconBox
          title="收起"
          style={{
            fontSize: '0.9em',
            lineHeight: '1.75em',
            marginLeft: '0.125em',
          }}
          onClick={(e) => {
            e.stopPropagation();
            hideToolbar();
          }}
        >
          <DownOutlined style={{ transform: 'rotate(180deg)' }} />
        </ActionIconBox>
      </div>
    </div>
  );
};
