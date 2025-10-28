import {
  Brain,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
} from '@sofa-design/icons';
import { ConfigProvider } from 'antd';
import classNamesFn from 'classnames';
import { motion } from 'framer-motion';
import { useMergedState } from 'rc-util';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useStyle } from './thinkStyle';

// Light 模式图标组件
interface LightModeIconProps {
  prefixCls: string;
  hashId: string;
  hover: boolean;
  expandedState: boolean;
  classNames?: ToolUseBarThinkProps['classNames'];
}

const LightModeIconComponent: React.FC<LightModeIconProps> = ({
  prefixCls,
  hashId,
  hover,
  expandedState,
}) => {
  const iconClassName = useMemo(() => {
    return classNamesFn(
      `${prefixCls}-header-left-icon`,
      {
        [`${prefixCls}-header-left-icon-light`]: true,
      },
      hashId,
    );
  }, [prefixCls, hashId]);

  const chevronStyle = useMemo(() => {
    return {
      transform: expandedState ? 'rotate(0deg)' : 'rotate(-90deg)',
      transition: 'transform 0.2s',
    };
  }, [expandedState]);

  const iconElement = useMemo(() => {
    return hover ? <ChevronDown style={chevronStyle} /> : <Brain />;
  }, [hover, chevronStyle]);

  return <div className={iconClassName}>{iconElement}</div>;
};

const LightModeIcon = memo(LightModeIconComponent);

// 头部内容组件
interface HeaderContentProps {
  toolName: React.ReactNode;
  toolTarget?: React.ReactNode;
  prefixCls: string;
  hashId: string;
  light: boolean;
  classNames?: ToolUseBarThinkProps['classNames'];
  styles?: ToolUseBarThinkProps['styles'];
}

const HeaderContentComponent: React.FC<HeaderContentProps> = ({
  toolName,
  toolTarget,
  prefixCls,
  hashId,
  light,
  classNames,
  styles,
}) => {
  const nameClassName = useMemo(() => {
    return classNamesFn(
      `${prefixCls}-name`,
      {
        [`${prefixCls}-name-light`]: light,
      },
      hashId,
      classNames?.name,
    );
  }, [prefixCls, hashId, light, classNames?.name]);

  const targetClassName = useMemo(() => {
    return classNamesFn(`${prefixCls}-target`, hashId, classNames?.target);
  }, [prefixCls, hashId, classNames?.target]);

  const nameElement = useMemo(() => {
    return toolName ? (
      <div className={nameClassName} style={styles?.name}>
        {toolName}
      </div>
    ) : null;
  }, [toolName, nameClassName, styles?.name]);

  const targetElement = useMemo(() => {
    return toolTarget ? (
      <div className={targetClassName} style={styles?.target}>
        {toolTarget}
      </div>
    ) : (
      <div />
    );
  }, [toolTarget, targetClassName, styles?.target]);

  return (
    <>
      {nameElement}
      {targetElement}
    </>
  );
};

const HeaderContent = memo(HeaderContentComponent);

// 时间元素组件
interface TimeElementProps {
  time?: React.ReactNode;
  prefixCls: string;
  hashId: string;
  classNames?: ToolUseBarThinkProps['classNames'];
  styles?: ToolUseBarThinkProps['styles'];
}

const TimeElementComponent: React.FC<TimeElementProps> = ({
  time,
  prefixCls,
  hashId,
  classNames,
  styles,
}) => {
  const timeClassName = useMemo(() => {
    return classNamesFn(`${prefixCls}-time`, hashId, classNames?.time);
  }, [prefixCls, hashId, classNames?.time]);

  const timeElement = useMemo(() => {
    return time ? (
      <div className={timeClassName} style={styles?.time}>
        {time}
      </div>
    ) : null;
  }, [time, timeClassName, styles?.time]);

  return timeElement;
};

const TimeElement = memo(TimeElementComponent);

// 展开按钮组件
interface ExpandButtonProps {
  thinkContent?: React.ReactNode;
  light: boolean;
  expandedState: boolean;
  prefixCls: string;
  hashId: string;
  classNames?: ToolUseBarThinkProps['classNames'];
  styles?: ToolUseBarThinkProps['styles'];
  onToggleExpand: () => void;
}

const ExpandButtonComponent: React.FC<ExpandButtonProps> = ({
  thinkContent,
  light,
  expandedState,
  prefixCls,
  hashId,
  classNames,
  styles,
  onToggleExpand,
}) => {
  const expandClassName = useMemo(() => {
    return classNamesFn(`${prefixCls}-expand`, hashId, classNames?.expand);
  }, [prefixCls, hashId, classNames?.expand]);

  const expandIcon = useMemo(() => {
    return !expandedState ? <ChevronsUpDown /> : <ChevronsDownUp />;
  }, [expandedState]);

  const expandElement = useMemo(() => {
    return thinkContent && !light ? (
      <div
        className={expandClassName}
        onClick={onToggleExpand}
        style={styles?.expand}
      >
        {expandIcon}
      </div>
    ) : null;
  }, [
    thinkContent,
    light,
    expandClassName,
    onToggleExpand,
    styles?.expand,
    expandIcon,
  ]);

  return expandElement;
};

const ExpandButton = memo(ExpandButtonComponent);

// 思考容器组件
interface ThinkContainerProps {
  thinkContent?: React.ReactNode;
  expandedState: boolean;
  floatingExpandedState: boolean;
  status?: 'loading' | 'success' | 'error';
  light: boolean;
  prefixCls: string;
  hashId: string;
  classNames?: ToolUseBarThinkProps['classNames'];
  styles?: ToolUseBarThinkProps['styles'];
  onToggleFloatingExpand: () => void;
}

const ThinkContainerComponent: React.FC<ThinkContainerProps> = ({
  thinkContent,
  expandedState,
  floatingExpandedState,
  status,
  light,
  prefixCls,
  hashId,
  classNames,
  styles,
  onToggleFloatingExpand,
}) => {
  const containerClassName = useMemo(() => {
    return classNamesFn(
      `${prefixCls}-container`,
      hashId,
      classNames?.container,
      {
        [`${prefixCls}-container-expanded`]: expandedState,
        [`${prefixCls}-container-loading`]:
          status === 'loading' && !floatingExpandedState,
        [`${prefixCls}-container-light`]: light,
        [`${prefixCls}-container-floating-expanded`]: floatingExpandedState,
      },
    );
  }, [
    prefixCls,
    hashId,
    classNames?.container,
    expandedState,
    status,
    floatingExpandedState,
    light,
  ]);

  const containerStyle = useMemo(() => {
    return {
      ...(expandedState
        ? {}
        : {
            height: 1,
            padding: '0 8px',
            margin: 0,
            overflow: 'hidden',
            minHeight: 0,
            visibility: 'hidden' as const,
          }),
      ...styles?.container,
    };
  }, [expandedState, styles?.container]);

  const contentClassName = useMemo(() => {
    return classNamesFn(`${prefixCls}-content`, hashId, classNames?.content);
  }, [prefixCls, hashId, classNames?.content]);

  const floatingExpandClassName = useMemo(() => {
    return classNamesFn(
      `${prefixCls}-floating-expand`,
      hashId,
      classNames?.floatingExpand,
    );
  }, [prefixCls, hashId, classNames?.floatingExpand]);

  const floatingIconStyle = useMemo(() => {
    return {
      fontSize: 16,
      color: 'var(--color-gray-text-light)',
    };
  }, []);

  const floatingIcon = useMemo(() => {
    return !floatingExpandedState ? (
      <ChevronsUpDown style={floatingIconStyle} />
    ) : (
      <ChevronsDownUp style={floatingIconStyle} />
    );
  }, [floatingExpandedState, floatingIconStyle]);

  const floatingText = useMemo(() => {
    return floatingExpandedState ? '收起' : '展开';
  }, [floatingExpandedState]);

  const floatingExpandElement = useMemo(() => {
    return status === 'loading' && !light ? (
      <div
        className={floatingExpandClassName}
        onClick={onToggleFloatingExpand}
        data-testid="tool-use-bar-think-floating-expand"
        style={styles?.floatingExpand}
      >
        {floatingIcon}
        {floatingText}
      </div>
    ) : null;
  }, [
    status,
    light,
    floatingExpandClassName,
    onToggleFloatingExpand,
    styles?.floatingExpand,
    floatingIcon,
    floatingText,
  ]);

  const containerElement = useMemo(() => {
    return thinkContent ? (
      <div
        className={containerClassName}
        data-testid="tool-use-bar-think-container"
        style={containerStyle}
      >
        <div className={contentClassName} style={styles?.content}>
          {thinkContent}
        </div>
        {floatingExpandElement}
      </div>
    ) : null;
  }, [
    thinkContent,
    containerClassName,
    containerStyle,
    contentClassName,
    styles?.content,
    floatingExpandElement,
  ]);

  return containerElement;
};

const ThinkContainer = memo(ThinkContainerComponent);

export interface ToolUseBarThinkProps {
  toolName: React.ReactNode;
  toolTarget?: React.ReactNode;
  time?: React.ReactNode;
  icon?: React.ReactNode;
  thinkContent?: React.ReactNode;
  testId?: string;
  status?: 'loading' | 'success' | 'error';
  expanded?: boolean;
  light?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  floatingExpanded?: boolean;
  defaultFloatingExpanded?: boolean;
  onFloatingExpandedChange?: (floatingExpanded: boolean) => void;
  classNames?: {
    root?: string;
    bar?: string;
    header?: string;
    headerLeft?: string;
    imageWrapper?: string;
    image?: string;
    name?: string;
    target?: string;
    time?: string;
    expand?: string;
    container?: string;
    content?: string;
    floatingExpand?: string;
  };
  styles?: {
    root?: React.CSSProperties;
    bar?: React.CSSProperties;
    header?: React.CSSProperties;
    headerLeft?: React.CSSProperties;
    imageWrapper?: React.CSSProperties;
    image?: React.CSSProperties;
    name?: React.CSSProperties;
    target?: React.CSSProperties;
    time?: React.CSSProperties;
    expand?: React.CSSProperties;
    container?: React.CSSProperties;
    content?: React.CSSProperties;
    floatingExpand?: React.CSSProperties;
  };
}

const ToolUseBarThinkComponent: React.FC<ToolUseBarThinkProps> = ({
  toolName,
  toolTarget,
  time,
  icon,
  thinkContent,
  status,
  testId,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  floatingExpanded,
  defaultFloatingExpanded = false,
  onFloatingExpandedChange,
  classNames,
  styles,
  light = false,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('tool-use-bar-think');
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [expandedState, setExpandedState] = useMergedState(defaultExpanded, {
    value: expanded,
    onChange: onExpandedChange,
  });
  const [floatingExpandedState, setFloatingExpandedState] = useMergedState(
    defaultFloatingExpanded,
    {
      value: floatingExpanded,
      onChange: onFloatingExpandedChange,
    },
  );

  // Think 模块的默认图标
  const defaultIcon = useMemo(() => <Brain />, []);

  const handleToggleExpand = useCallback(() => {
    setExpandedState(!expandedState);
  }, [expandedState, setExpandedState]);

  const handleToggleFloatingExpand = useCallback(() => {
    setFloatingExpandedState(!floatingExpandedState);
  }, [floatingExpandedState, setFloatingExpandedState]);

  useEffect(() => {
    if (status === 'loading') {
      setExpandedState(true);
    }
  }, [status, setExpandedState]);

  const [hover, setHover] = React.useState(false);

  // 缓存样式类名
  const rootClassName = useMemo(() => {
    return classNamesFn(prefixCls, hashId, classNames?.root, {
      [`${prefixCls}-expanded`]: !expandedState,
      [`${prefixCls}-loading`]: status === 'loading',
      [`${prefixCls}-active`]: expandedState,
      [`${prefixCls}-success`]: status === 'success',
      [`${prefixCls}-light`]: light,
    });
  }, [prefixCls, hashId, classNames?.root, expandedState, status, light]);

  const barClassName = useMemo(() => {
    return classNamesFn(`${prefixCls}-bar`, hashId, classNames?.bar);
  }, [prefixCls, hashId, classNames?.bar]);

  const headerClassName = useMemo(() => {
    return classNamesFn(`${prefixCls}-header`, hashId, classNames?.header, {
      [`${prefixCls}-header-light`]: light,
    });
  }, [prefixCls, hashId, classNames?.header, light]);

  const headerLeftClassName = useMemo(() => {
    return classNamesFn(
      `${prefixCls}-header-left`,
      hashId,
      classNames?.headerLeft,
    );
  }, [prefixCls, hashId, classNames?.headerLeft]);

  // 缓存动画配置
  const loadingAnimationConfig = useMemo(
    () => ({
      animate: {
        '--rotate': ['0deg', '360deg'],
      },
      transition: {
        '--rotate': {
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        },
      },
      style: {
        '--rotation': '360deg',
      } as React.CSSProperties,
    }),
    [],
  );

  const idleAnimationConfig = useMemo(
    () => ({
      animate: {},
      transition: {},
      style: {
        '--rotation': '0deg',
      } as React.CSSProperties,
    }),
    [],
  );

  const imageAnimationProps = useMemo(() => {
    return status === 'loading' ? loadingAnimationConfig : idleAnimationConfig;
  }, [status, loadingAnimationConfig, idleAnimationConfig]);

  // 缓存右侧动画配置
  const headerRightAnimationConfig = useMemo(() => {
    if (status === 'loading') {
      return {
        animate: {
          maskImage: [
            'linear-gradient(to right, rgba(0,0,0,0.99)  -50%, rgba(0,0,0,0.15)   -50%,rgba(0,0,0,0.99)  150%)',
            'linear-gradient(to right, rgba(0,0,0,0.99)  -50%,  rgba(0,0,0,0.15)  150%,rgba(0,0,0,0.99)  150%)',
          ],
        },
        transition: {
          maskImage: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          },
        },
        style: {
          maskImage:
            'linear-gradient(to right, rgba(0,0,0,0.99) -30%, rgba(0,0,0,0.15) -50%, rgba(0,0,0,0.99) 120%)',
        } as React.CSSProperties,
      };
    }
    return {};
  }, [status]);

  return wrapSSR(
    <div
      data-testid={testId || 'ToolUseBarThink'}
      className={rootClassName}
      style={styles?.root}
    >
      <div
        className={barClassName}
        data-testid="tool-use-bar-think-bar"
        style={styles?.bar}
        onClick={handleToggleExpand}
      >
        <div
          className={headerClassName}
          data-testid="tool-use-bar-think-header"
          style={styles?.header}
          onMouseMove={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className={headerLeftClassName} style={styles?.headerLeft}>
            {light ? (
              <LightModeIcon
                prefixCls={prefixCls}
                hashId={hashId}
                hover={hover}
                expandedState={expandedState}
                classNames={classNames}
              />
            ) : (
              <motion.div
                className={classNamesFn(
                  `${prefixCls}-image-wrapper`,
                  hashId,
                  classNames?.imageWrapper,
                  {
                    [`${prefixCls}-image-wrapper-rotating`]:
                      status === 'loading',
                    [`${prefixCls}-image-wrapper-loading`]:
                      status === 'loading',
                  },
                )}
                {...imageAnimationProps}
              >
                {icon || (
                  <div
                    className={classNamesFn(
                      `${prefixCls}-image`,
                      hashId,
                      classNames?.image,
                    )}
                    style={styles?.image}
                  >
                    {defaultIcon}
                  </div>
                )}
              </motion.div>
            )}
          </div>
          <motion.div
            className={classNamesFn(`${prefixCls}-header-right`, hashId)}
            {...headerRightAnimationConfig}
          >
            <HeaderContent
              toolName={toolName}
              toolTarget={toolTarget}
              prefixCls={prefixCls}
              hashId={hashId}
              light={light}
              classNames={classNames}
              styles={styles}
            />
          </motion.div>
        </div>
        <TimeElement
          time={time}
          prefixCls={prefixCls}
          hashId={hashId}
          classNames={classNames}
          styles={styles}
        />
        <ExpandButton
          thinkContent={thinkContent}
          light={light}
          expandedState={expandedState}
          prefixCls={prefixCls}
          hashId={hashId}
          classNames={classNames}
          styles={styles}
          onToggleExpand={handleToggleExpand}
        />
      </div>
      <ThinkContainer
        thinkContent={thinkContent}
        expandedState={expandedState}
        floatingExpandedState={floatingExpandedState}
        status={status}
        light={light}
        prefixCls={prefixCls}
        hashId={hashId}
        classNames={classNames}
        styles={styles}
        onToggleFloatingExpand={handleToggleFloatingExpand}
      />
    </div>,
  );
};

// 使用 memo 优化组件，避免不必要的重新渲染
export const ToolUseBarThink = memo(ToolUseBarThinkComponent);
