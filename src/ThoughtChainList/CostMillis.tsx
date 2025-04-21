import { FieldTimeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useMemo } from 'react';

const msToTimes = (ms: number | undefined) => {
  if (!ms) {
    return '';
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  let s = ms / 1000;
  if (s < 60) {
    return `${s.toFixed(0)}s`;
  }
  let m = s / 60;
  if (m < 60) {
    return `${m.toFixed(0)}分钟 ${s.toFixed(0)}秒`;
  }
  let h = m / 60;
  if (h < 24) {
    return `${h.toFixed(0)}小时 ${m.toFixed(0)}分钟 ${s.toFixed(0)}秒`;
  }
  let d = h / 24;
  return `${d.toFixed(0)}天${h.toFixed(0)}小时${m.toFixed(0)}分钟${s.toFixed(
    0,
  )}秒`;
};

/**
 * CostMillis 组件用于显示一个带有提示信息的时间成本。
 *
 * @param props - 组件的属性对象
 * @param props.costMillis - 可选的时间成本（以毫秒为单位）
 *
 * 如果 `costMillis` 属性不存在或为 `undefined`，组件将返回 `null`。
 * 否则，组件将显示一个带有时间成本提示信息的 `Tooltip`。
 *
 * @returns 如果 `costMillis` 存在，返回一个包含时间成本信息的 `Tooltip` 组件；否则返回 `null`。
 */
export const CostMillis = (props: { costMillis?: number }) => {
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
          {msToTimes(props.costMillis)}
        </span>
      </Tooltip>
    );
  }, [props.costMillis]);
};
