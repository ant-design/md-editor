/**
 * @fileoverview 代码编辑器工具栏组件
 * 提供代码块的各种操作功能，包括语言切换、复制、运行等
 * @author Code Plugin Team
 */

import { CloseCircleOutlined } from '@ant-design/icons';
import { Copy } from '@sofa-design/icons';
import { message, Segmented } from 'antd';
import copy from 'copy-to-clipboard';
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
  /** 语言选择器的属性 */
  languageSelectorProps: LanguageSelectorProps;
  /** 代码块是否被选中 */
  isSelected?: boolean;
  /** 代码块选中状态变化回调 */
  onSelectionChange?: (selected: boolean) => void;
  /** 视图模式切换回调（用于HTML和Markdown） */
  onViewModeToggle?: (value: 'preview' | 'code') => void;
  /** 当前视图模式（'preview' | 'code'） */
  viewMode?: 'preview' | 'code';
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
 *   languageSelectorProps={langProps}
 * />
 * ```
 */
export const CodeToolbar = (props: CodeToolbarProps) => {
  // 获取国际化上下文
  const i18n = useContext(I18nContext);

  const {
    element,
    readonly,
    onCloseClick,
    languageSelectorProps,
    onViewModeToggle,
    viewMode = 'code',
  } = props;

  return (
    <div
      data-testid="code-toolbar"
      contentEditable={false}
      style={{
        backgroundColor: 'var(--color-gray-bg-card-white)',
        paddingLeft: '0.25em',
        paddingRight: '0.25em',
        width: '100%',
        position: 'sticky',
        left: 0,
        top: 0,
        fontSize: '1em',
        font: 'var(--font-text-h6-base)',
        color: 'var(--color-gray-text-default)',
        letterSpacing: 'var(--letter-spacing-h6-base, normal)',
        justifyContent: 'space-between',
        zIndex: 50,
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        padding: '9px 12px',
        gap: '16px',
        alignSelf: 'stretch',
        boxSizing: 'border-box',
        userSelect: 'none',
        transition: 'all 0.2s ease-in-out',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'var(--color-gray-border-light)',
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
            gap: 4,
            font: 'var(--font-text-h6-base)',
            color: 'var(--color-gray-text-default)',
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
                  fontSize: '16px',
                  display: 'flex',
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
          alignItems: 'center',
        }}
      >
        {/* 关闭按钮（仅公式和 mermaid 显示） */}
        {element.katex || element.language === 'mermaid' ? (
          <ActionIconBox
            title={i18n?.locale?.close || '关闭'}
            onClick={onCloseClick}
          >
            <CloseCircleOutlined />
          </ActionIconBox>
        ) : null}

        {/* HTML/Markdown 视图模式切换按钮 */}
        {element?.language === 'html' || element?.language === 'markdown' ? (
          <Segmented
            data-testid="preview"
            options={[
              {
                label: '预览',
                value: 'preview',
              },
              {
                label: '代码',
                value: 'code',
              },
            ]}
            value={viewMode}
            onChange={(value) =>
              onViewModeToggle?.(value as 'preview' | 'code')
            }
          />
        ) : null}

        {/* 复制按钮 */}
        <ActionIconBox
          title={i18n?.locale?.copy || '复制'}
          style={{
            fontSize: '1em',
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
          <Copy />
        </ActionIconBox>
      </div>
    </div>
  );
};
