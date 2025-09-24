import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { CloseFillIcon } from '../icons/CloseFillIcon';
import { CornerLeftUp } from '../icons/CornerLeftUp';
import QuoteIcon from '../icons/QuoteIcon';
import { useStyle } from './style';

interface QuoteProps {
  /** 文件名 */
  fileName?: string;
  /** 行号范围（可选） */
  lineRange?: string;
  /** 引用内容描述 */
  quoteDesc: string;
  /** 详细内容（点击查看详情） */
  popupDetail?: string;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 点击文件名回调 */
  onFileClick?: (fileName: string, lineRange?: string) => void;
}

const Quote: React.FC<QuoteProps> = ({
  fileName,
  lineRange,
  quoteDesc,
  popupDetail,
  closable = false,
  onClose,
  className,
  style,
  onFileClick,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('quote');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  // 处理文件名点击
  const handleFileClick = () => {
    if (onFileClick && fileName) {
      onFileClick(fileName, lineRange);
    }
  };

  // 样式类名
  const containerCls = classNames(`${prefixCls}-container`, hashId, className);
  const quoteDescCls = classNames(`${prefixCls}-quoteDesc`, hashId);
  const closeCls = classNames(`${prefixCls}-close-button`, hashId);
  const quoteIconCls = classNames(`${prefixCls}-quote-icon`, hashId);

  // 弹出层样式类名
  const popupCls = classNames(`${prefixCls}-popup`, hashId);
  const popupHeaderCls = classNames(`${prefixCls}-popup-header`, hashId);
  const popupTitleCls = classNames(`${prefixCls}-popup-title`, hashId);
  const popupRangeCls = classNames(`${prefixCls}-popup-range`, hashId);
  const popupContentCls = classNames(`${prefixCls}-popup-content`, hashId);

  return wrapSSR(
    <div className={containerCls} style={style} data-testid="quote-container">
      <div className={quoteIconCls} data-testid="quote-icon">
        <QuoteIcon />
      </div>
      <span className={quoteDescCls} data-testid="quote-desc">
        {quoteDesc}
      </span>
      {closable && onClose && (
        <div
          style={{ fontSize: 16 }}
          onClick={onClose}
          className={closeCls}
          data-testid="quote-close-button"
        >
          <CloseFillIcon />
        </div>
      )}

      {/* 弹出层 - 通过CSS hover控制显示 */}
      {popupDetail && (
        <div className={popupCls} data-testid="quote-popup">
          {(fileName || lineRange) && (
            <div
              className={popupHeaderCls}
              onClick={handleFileClick}
              data-testid="quote-popup-header"
            >
              <div
                style={{
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                }}
                data-testid="quote-popup-icon"
              >
                <CornerLeftUp />
              </div>
              {fileName && (
                <span className={popupTitleCls} data-testid="quote-popup-title">
                  {fileName}
                </span>
              )}
              {lineRange && (
                <span className={popupRangeCls} data-testid="quote-popup-range">
                  ({lineRange})
                </span>
              )}
            </div>
          )}
          <div className={popupContentCls} data-testid="quote-popup-content">
            {popupDetail}
          </div>
        </div>
      )}
    </div>,
  );
};

export default Quote;
