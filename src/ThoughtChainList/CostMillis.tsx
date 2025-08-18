import { FieldTimeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useContext, useMemo } from 'react';
import { I18nContext, LocalKeys } from '../i18n';

/**
 * 将毫秒转换为可读的时间格式
 *
 * @param {number|undefined} ms - 毫秒数
 * @param {LocalKeys} locale - 本地化配置
 * @returns {string} 格式化后的时间字符串
 *
 * @example
 * msToTimes(1500, locale) // "1.5s"
 * msToTimes(65000, locale) // "1m 5s"
 */
const msToTimes = (ms: number | undefined, locale: LocalKeys) => {
  if (!ms) {
    return '';
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  let s = ms / 1000;
  if (s < 60) {
    return `${s.toFixed(1)}${locale?.seconds || 's'}`;
  }
  let m = s / 60;
  if (m < 60) {
    return `${m.toFixed(0)}${locale?.minutes || 'm'} ${s.toFixed(0)}${locale?.seconds || 's'}`;
  }
  let h = m / 60;
  if (h < 24) {
    return `${h.toFixed(0)}${locale?.hours || 'H'} ${m.toFixed(0)}${locale?.minutes || 'm'} ${s.toFixed(0)}${locale?.seconds || 's'}`;
  }
  let d = h / 24;
  return `${d.toFixed(0)}${locale?.days || 'D'} ${h.toFixed(0)}${locale?.hours || 'H'} ${m.toFixed(0)}${locale?.minutes || 'm'} ${s.toFixed(0)}${locale?.seconds || 's'}`;
};

/**
 * CostMillis 组件 - 耗时显示组件
 *
 * 该组件用于显示操作耗时，支持毫秒到天的时间格式转换，
 * 提供美观的UI展示和工具提示功能。
 *
 * @component
 * @description 耗时显示组件，显示操作耗时信息
 * @param {Object} props - 组件属性
 * @param {number} [props.costMillis] - 耗时（毫秒）
 *
 * @example
 * ```tsx
 * <CostMillis costMillis={1500} />
 * <CostMillis costMillis={65000} />
 * <CostMillis costMillis={3600000} />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的耗时显示组件，无耗时数据时返回null
 *
 * @remarks
 * - 自动转换时间格式（毫秒、秒、分钟、小时、天）
 * - 提供工具提示显示原始毫秒值
 * - 支持国际化时间单位
 * - 美观的渐变背景设计
 * - 响应式布局适配
 * - 图标和文字组合显示
 */
export const CostMillis = (props: { costMillis?: number }) => {
  const { locale } = useContext(I18nContext);

  return useMemo(() => {
    if (!props.costMillis) {
      return null;
    }
    return (
      <Tooltip title={props.costMillis + 'ms'}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '1px 10px',
            gap: '6px',
            borderRadius: '12px',
            height: '2em',
            minHeight: '28px',
            fontSize: '0.9em',
            wordBreak: 'break-all',
            wordWrap: 'break-word',
            maxWidth: '100%',
            background:
              'radial-gradient(22% 66% at 96% 113%, rgba(255, 255, 245, 0.52) 0%, rgba(230, 238, 255, 0) 100%), radial-gradient(14% 234% at 100% 50%, rgba(162, 255, 255, 0.28) 0%, rgba(153, 202, 255, 0.1193) 13%, rgba(229, 189, 255, 0.0826) 38%, rgba(235, 255, 245, 0) 100%), #FFFFFF',
            border: '1px solid rgba(227, 230, 234, 0.65)',
          }}
        >
          <FieldTimeOutlined />
          {msToTimes(props.costMillis, locale)}
        </span>
      </Tooltip>
    );
  }, [props.costMillis, locale]);
};
