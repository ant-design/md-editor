import { DownloadOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useStyle } from './ChartToolBar/style';
import TimeIcon from './icons/TimeIcon';

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
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('chart-toolbar');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  return wrapSSR(
    <div
      className={classNames(
        prefixCls,
        `${prefixCls}-${theme}`,
        hashId,
        className,
      )}
    >
      {/* 左侧标题 */}
      <div className={classNames(`${prefixCls}-header-title`, hashId)}>
        {title}
      </div>

      {/* 右侧时间+下载按钮 */}
      <div className={classNames(`${prefixCls}-header-actions`, hashId)}>
        <TimeIcon className={classNames(`${prefixCls}-time-icon`, hashId)} />
        <span className={classNames(`${prefixCls}-data-time`, hashId)}>
          数据时间: {dataTime}
        </span>
        <DownloadOutlined
          className={classNames(`${prefixCls}-download-btn`, hashId)}
          onClick={handleDownload}
        />
      </div>
    </div>,
  );
};

export default ChartToolBar;
