/**
 * @fileoverview 语言选择器组件
 * 提供搜索和选择编程语言的交互界面
 * @author Code Plugin Team
 */

import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input, Popover } from 'antd';
import React, { useContext, useState } from 'react';
import { I18nContext } from '../../../i18n';
import { langIconMap } from '../langIconMap';
import { langOptions } from '../utils/langOptions';
import { LoadImage } from './LoadImage';

/**
 * 语言选择器组件的属性接口
 */
export interface LanguageSelectorProps {
  /** 代码块元素信息 */
  element?: {
    /** 当前选择的编程语言 */
    language?: string;
    /** 是否为数学公式（katex） */
    katex?: any;
  };
  /** 容器引用，用于焦点管理 */
  containerRef?: React.RefObject<HTMLDivElement>;
  /** 语言变更回调函数 */
  setLanguage?: (language: string) => void;
}

/**
 * 语言选择器组件
 *
 * 功能：
 * - 显示当前选择的编程语言
 * - 提供搜索功能快速查找语言
 * - 支持点击切换语言
 * - 显示语言对应的图标
 *
 * 交互：
 * - 点击按钮打开语言选择弹层
 * - 在搜索框中输入关键字过滤语言
 * - 选择语言后自动关闭弹层
 * - 支持键盘导航（Enter 键确认）
 *
 * @param props - 组件属性
 * @returns React 语言选择器元素
 *
 * @example
 * ```tsx
 * <LanguageSelector
 *   element={{ language: 'javascript', katex: false }}
 *   containerRef={containerRef}
 *   setLanguage={(lang) => console.log('Selected:', lang)}
 * />
 * ```
 */
export const LanguageSelector = (props: LanguageSelectorProps) => {
  // 获取国际化上下文
  const i18n = useContext(I18nContext);
  // 搜索关键字状态
  const [keyword, setKeyword] = useState('');

  // 处理未定义的 element
  const safeElement = props.element || { language: undefined, katex: false };

  return (
    <Popover
      arrow={false}
      styles={{
        body: {
          padding: 8,
        },
      }}
      trigger={['click']}
      placement={'bottomLeft'}
      onOpenChange={(visible) => {
        if (visible) {
          // 弹层打开时，延时聚焦到搜索框
          setTimeout(() => {
            (
              props?.containerRef?.current?.querySelector(
                '.lang-select input',
              ) as HTMLInputElement
            )?.focus();
          });
        } else {
          // 弹层关闭时清空搜索关键字
          setKeyword('');
        }
      }}
      content={
        <AutoComplete
          value={keyword}
          options={langOptions}
          autoFocus={true}
          style={{ width: 200 }}
          filterOption={(text, item) => {
            // 根据输入的文本过滤语言选项
            return item?.value.includes(text) || false;
          }}
          onSelect={(selectedLanguage) => {
            // 选择语言后执行回调
            props.setLanguage?.(selectedLanguage);
          }}
          onChange={(inputValue) => {
            // 更新搜索关键字
            setKeyword(inputValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // 阻止 Enter 键的默认行为
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={'lang-select'}
        >
          <Input prefix={<SearchOutlined />} placeholder={'Search'} />
        </AutoComplete>
      }
    >
      <Button
        type="text"
        title={i18n?.locale?.switchLanguage || '切换语言'}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          boxSizing: 'border-box',
          gap: 2,
          color: 'inherit',
        }}
        size="small"
        icon={
          // 如果有语言图标且不是公式，则显示图标
          langIconMap.get(safeElement.language?.toLowerCase() || '') &&
          !safeElement.katex && (
            <div
              style={{
                height: '1em',
                width: '1em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.25em',
              }}
            >
              <LoadImage
                src={langIconMap.get(
                  safeElement.language?.toLowerCase() || 'html',
                )}
              />
            </div>
          )
        }
      >
        <>
          <div>
            {safeElement.language ? (
              <span>
                {/* 根据类型显示不同的标签 */}
                {safeElement.katex ? 'Formula' : safeElement.language}
              </span>
            ) : (
              <span>{'plain text'}</span>
            )}
          </div>
        </>
      </Button>
    </Popover>
  );
};
