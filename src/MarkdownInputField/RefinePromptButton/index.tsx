import { ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { OptimizeIcon } from '../../icons/OptimizeIcon';
import { useStyle } from './style';

type RefinePromptButtonProps = {
  isHover: boolean;
  status: 'idle' | 'loading';
  onRefine: () => void;
  style?: React.CSSProperties;
  compact?: boolean;
  disabled?: boolean;
};

function LoadingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      aria-label="Loading"
      role="img"
    >
      <circle cx="16" cy="16" r="16" fill="transparent" />
      <g>
        <path
          className="refine-icon-ring"
          d="M16 5.333a10.667 10.667 0 110 21.334A10.667 10.667 0 0116 5.333zm0 2.134a8.533 8.533 0 100 17.066 8.533 8.533 0 000-17.066z"
          fill="#001C39"
          fillOpacity={0.12}
        />
        <path
          className="refine-icon-spinner"
          d="M16 2.667a13.333 13.333 0 0113.333 13.333 1.333 1.333 0 11-2.666 0 10.667 10.667 0 10-10.667 10.667 1.333 1.333 0 110 2.666A13.333 13.333 0 0116 2.667z"
          fill="#00183D"
          fillOpacity={0.25}
        />
      </g>
    </svg>
  );
}

export const RefinePromptButton: React.FC<RefinePromptButtonProps> = (
  props,
) => {
  const { isHover, disabled, status, onRefine, style } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field-refine-button');
  const { wrapSSR, hashId } = useStyle(baseCls);

  const handleClick = () => {
    if (disabled) return;
    if (status === 'loading') return;
    onRefine();
  };

  const renderIcon = () => {
    if (status === 'loading') return <LoadingIcon />;
    return <OptimizeIcon />;
  };

  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !window.document
  ) {
    return null;
  }

  return wrapSSR(
    <Tooltip title={status === 'loading' ? '优化中' : '一键优化提示词'}>
      <div
        data-testid="refine-prompt-button"
        onClick={handleClick}
        style={style}
        className={classNames(baseCls, hashId, {
          [`${baseCls}-compact`]: props.compact,
          [`${baseCls}-disabled`]: disabled,
          [`${baseCls}-loading`]: status === 'loading',
          [`${baseCls}-hover`]: isHover && !disabled,
        })}
        title={'优化提示词'}
        aria-label={'优化提示词'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <ErrorBoundary fallback={<div />}>{renderIcon()}</ErrorBoundary>
      </div>
    </Tooltip>,
  );
};
