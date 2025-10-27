import { DownloadOutlined } from '@ant-design/icons';
import { ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import { default as React, useContext } from 'react';
import { I18nContext } from '../../../../i18n';
import TimeIcon from '../icons/TimeIcon';
import { useStyle } from './style';

export interface ChartToolBarProps {
  title?: string;
  dataTime?: string;
  className?: string;
  theme?: 'light' | 'dark';
  onDownload?: () => void;
  extra?: React.ReactNode;
  filter?: React.ReactNode;
}

const ChartToolBar: React.FC<ChartToolBarProps> = ({
  title,
  dataTime,
  className = '',
  theme = 'light',
  onDownload,
  extra,
  filter,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const i18n = useContext(I18nContext);
  const prefixCls = getPrefixCls('chart-toolbar');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  if (!title && !extra) {
    return null;
  }

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
        {dataTime ? (
          <>
            <TimeIcon
              className={classNames(`${prefixCls}-time-icon`, hashId)}
            />
            <span className={classNames(`${prefixCls}-data-time`, hashId)}>
              {i18n?.locale?.dataTime || '数据时间'}: {dataTime}
            </span>
          </>
        ) : null}
        {filter}
        {extra}
        {handleDownload ? (
          <Tooltip
            mouseEnterDelay={0.3}
            title={i18n?.locale?.download || '下载'}
          >
            <DownloadOutlined
              className={classNames(`${prefixCls}-download-btn`, hashId)}
              onClick={handleDownload}
            />
          </Tooltip>
        ) : null}
      </div>
    </div>,
  );
};

export default ChartToolBar;
