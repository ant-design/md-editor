import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { BackTo } from '../../BackTo';
import { prefixCls, useStyle } from './style';

interface TopOperatingAreaProps {
  iShowBackTo?: boolean;
  targetRef?: React.RefObject<HTMLDivElement>;
  operationBtnRender?: () => React.ReactNode;
}
const TopOperatingArea: React.FC<TopOperatingAreaProps> = (props) => {
  const { iShowBackTo = true, targetRef, operationBtnRender } = props;

  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context?.getPrefixCls(prefixCls);
  const { wrapSSR, hashId } = useStyle(baseCls);

  const target = targetRef?.current;

  const renderOperationButtons = () => {
    if (!operationBtnRender) return null;

    return (
      <div className={classNames(`${baseCls}-buttons`, hashId)}>
        {operationBtnRender()}
      </div>
    );
  };

  return wrapSSR(
    <div className={classNames(baseCls, hashId)}>
      <div className={classNames(`${baseCls}-left`, hashId)}></div>
      <div className={classNames(`${baseCls}-center`, hashId)}>
        {renderOperationButtons()}
      </div>
      <div className={classNames(`${baseCls}-right`, hashId)}>
        <div
          className={classNames(`${baseCls}-back-buttons`, hashId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            visibility: iShowBackTo ? 'visible' : 'hidden',
            opacity: iShowBackTo ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {iShowBackTo && (
            <>
              <BackTo.Top
                target={target ? () => target : undefined}
                shouldVisible={5}
                style={{
                  position: 'relative',
                  insetInlineEnd: 0,
                  bottom: 0,
                }}
              />
              <BackTo.Bottom
                target={target ? () => target : undefined}
                shouldVisible={5}
                style={{
                  position: 'relative',
                  insetInlineEnd: 0,
                  bottom: 0,
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>,
  );
};
export default TopOperatingArea;
