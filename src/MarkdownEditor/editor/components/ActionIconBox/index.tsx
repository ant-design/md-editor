import { LoadingOutlined } from '@ant-design/icons';
import { ConfigProvider, Tooltip, TooltipProps } from 'antd';
import cx from 'classnames';
import React, { useContext, useEffect } from 'react';
import { useStyle } from './style';

/**
 * Represents an icon item component.
 * @param {React.ReactNode} children - The content of the icon item.
 * @param {() => void} onClick - The callback function to be called when the icon item is clicked.
 */
export const ActionIconBox: React.FC<{
  children: React.ReactNode;
  showTitle?: boolean;
  onClick?: (e: any) => void;
  tooltipProps?: TooltipProps;
  title: string;
  type?: 'danger' | 'primary';
  transform?: boolean;
  className?: string;
  borderLess?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  scale?: boolean;
  active?: boolean;
  onInit?: () => void;
  noPadding?: boolean;
}> = (props) => {
  const [loading, setLoading] = React.useState(false);
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('md-editor-action-icon-box');
  const { wrapSSR, hashId } = useStyle(prefixCls, props.style || {});
  useEffect(() => {
    props.onInit?.();
  }, []);

  return wrapSSR(
    <Tooltip title={props.title} {...props.tooltipProps}>
      <span
        role="button"
        tabIndex={0}
        aria-label={props.title}
        className={cx(prefixCls, hashId, props.className, {
          [`${prefixCls}-danger`]: props.type === 'danger',
          [`${prefixCls}-primary`]: props.type === 'primary',
          [`${prefixCls}-border-less`]: props.borderLess,
          [`${prefixCls}-only-icon`]: props.scale,
          [`${prefixCls}-active`]: props.active,
          [`${prefixCls}-transform`]: props.transform,
          [`${prefixCls}-noPadding`]: props.noPadding,
        })}
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!props.onClick) return;
          if (loading) return;
          setLoading(true);
          await props.onClick?.(e as any);
          setLoading(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!props.onClick) return;
            if (loading) return;
            props.onClick(e as any);
          }
        }}
        style={props.style}
      >
        {loading || props.loading ? (
          <LoadingOutlined />
        ) : (
          React.cloneElement(props.children as any, {
            // @ts-ignore
            ...props?.children?.props,
          })
        )}
        {props.showTitle && <span>{props.title}</span>}
      </span>
    </Tooltip>,
  );
};
