import { DownloadOutlined } from '@ant-design/icons';
import React from 'react';
import { useStyle } from './ChartToolBar.style';
import TimeIcon from './icons/TimeIcon';

export interface ChartToolBarProps {
  title: string;
  dataTime?: string;
  className?: string;
  theme?: 'light' | 'dark';
  onDownload?: () => void;
  extra?: React.ReactNode;
}

const ChartToolBar: React.FC<ChartToolBarProps> = ({
  title,
  dataTime = '2025-06-30 00:00:00',
  className = '',
  theme = 'light',
  onDownload,
  extra,
}) => {
  const prefixCls = 'chart-header';
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  return wrapSSR(
    <div className={`${prefixCls} ${hashId} ${theme} ${className}`}>
      {/* 左侧标题 */}
      <div className="header-title">{title}</div>

      {/* 右侧时间+下载按钮 */}
      <div className="header-actions">
        <TimeIcon className="time-icon" />
        <span className="data-time">数据时间: {dataTime}</span>
        {extra}
        <DownloadOutlined className="download-btn" onClick={handleDownload} />
      </div>
    </div>,
  );
};

export default ChartToolBar;
