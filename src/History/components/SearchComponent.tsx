import { Input, Spin } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import useClickAway from '../../hooks/useClickAway';
import { useDebounceFn } from '../../hooks/useDebounceFn';
import { I18nContext } from '../../i18n';
import { ActionIconBox } from '../../MarkdownEditor/editor/components';

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={14} height={14} rx={0} />
        </clipPath>
      </defs>
      <g>
        <path
          d="M9.694 10.519a5.25 5.25 0 11.825-.825l2.143 2.144a.583.583 0 11-.825.825l-2.143-2.144zm.806-4.102a4.083 4.083 0 10-8.167 0 4.083 4.083 0 008.167 0z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

/**
 * 历史记录搜索组件属性接口
 */
interface HistorySearchProps {
  /** 搜索关键词 */
  searchKeyword?: string;
  /** 搜索回调函数 */
  onSearch?: (value: string) => void;
}

/**
 * HistorySearch 组件 - 历史记录搜索组件
 *
 * 该组件提供一个搜索输入框，用于搜索历史记录。
 * 支持加载状态显示和错误处理。
 *
 * @component
 * @description 历史记录搜索组件，用于搜索历史对话记录
 * @param {HistorySearchProps} props - 组件属性
 * @param {string} props.searchKeyword - 搜索关键词
 * @param {(value: string) => void} props.onSearch - 搜索回调函数
 * @param {boolean} [props.enabled=false] - 是否启用搜索功能
 *
 * @example
 * ```tsx
 * <HistorySearch
 *   searchKeyword={keyword}
 *   onSearch={(value) => handleSearch(value)}
 *   enabled={true}
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的搜索输入框组件，未启用时返回null
 *
 * @remarks
 * - 支持实时搜索
 * - 包含加载状态显示
 * - 支持清空输入
 * - 包含错误处理机制
 * - 响应式输入框设计
 * - 条件渲染支持
 * - 默认显示搜索图标，点击后展开搜索框
 */
export const HistorySearch: React.FC<HistorySearchProps> = ({ onSearch }) => {
  const { locale } = useContext(I18nContext);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(() => {
    setIsExpanded(false);
  }, ref);

  const handleSearchWithLoading = async (value: string) => {
    try {
      setLoading(true);
      await onSearch?.(value);
    } catch (error) {
      // 处理错误
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearchChange = useDebounceFn(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      handleSearchWithLoading(value);
    },
    360,
  );

  // 展开后显示搜索框
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        justifyContent: 'space-between',
        marginTop: 12,
      }}
    >
      {isExpanded ? (
        <Input
          placeholder={
            locale?.['chat.history.search.placeholder'] || '历史任务'
          }
          prefix={loading ? <Spin size="small" /> : <SearchIcon />}
          onChange={(e) => {
            handleSearchChange.run(e);
          }}
          allowClear
          variant="filled"
          autoFocus
        />
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
          }}
        >
          <div
            style={{
              fontWeight: 500,
              lineHeight: '20px',
              fontSize: 'var(--font-text-body-emphasized-sm)',
              letterSpacing: 'var(--letter-spacing-body-emphasized-sm, normal)',
              color: 'var(--color-gray-text-light)',
            }}
          >
            {locale?.['chat.history.historyTasks'] || '历史任务'}
          </div>
          <ActionIconBox
            onClick={handleToggleSearch}
            title={locale?.['chat.history.search'] || '搜索'}
            style={{
              width: 20,
              height: 20,
            }}
          >
            <SearchIcon
              style={{
                fontSize: 14,
                color: 'rgba(0, 24, 61, 0.2471)',
              }}
            />
          </ActionIconBox>
        </div>
      )}
    </div>
  );
};

/**
 * @deprecated 请使用 HistorySearch 替代
 */
export const SearchComponent: React.FC<HistorySearchProps> = HistorySearch;
