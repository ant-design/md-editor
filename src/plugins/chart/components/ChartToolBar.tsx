import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import TimeIcon from './icons/TimeIcon';
import './ChartToolBar.less';

export interface ChartToolBarProps {
  title: string;
  dataTime?: string;
  className?: string;
  theme?: 'light' | 'dark';
  onDownload?: () => void;
}

const ChartToolBar: React.FC<ChartToolBarProps> = ({
  title,
  dataTime = '2025-06-30 00:00:00',
  className = '',
  theme = 'light',
  onDownload,
}) => {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <div className={`chart-header ${theme} ${className}`}>
      {/* 左侧标题 */}
      <div className="header-title">
        {title}
      </div>
      
      {/* 右侧时间+下载按钮 */}
      <div className="header-actions">
        <TimeIcon className="time-icon" />
        <span className="data-time">
          数据时间: {dataTime}
        </span>
        <DownloadOutlined 
          className="download-btn" 
          onClick={handleDownload}
        />
      </div>
    </div>
  );
};

export default ChartToolBar; 
