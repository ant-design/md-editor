/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import React, {
  JSX,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Element, LeafPosition, Text } from 'slate';
import {
  EDITOR_TO_PLACEHOLDER_ELEMENT,
  IS_ANDROID,
  IS_WEBKIT,
  PLACEHOLDER_SYMBOL,
} from 'slate-dom';
import { useSlateStatic } from '../hooks/use-slate-static';
import { RenderLeafProps, RenderPlaceholderProps } from './editable';
import String from './string';

// Delay the placeholder on Android to prevent the keyboard from closing.
// (https://github.com/ianstormtaylor/slate/pull/5368)
const PLACEHOLDER_DELAY = IS_ANDROID ? 300 : 0;

/**
 * 断开占位符的 ResizeObserver 连接
 *
 * @param {MutableRefObject<ResizeObserver | null>} placeholderResizeObserver - ResizeObserver 引用
 * @param {boolean} releaseObserver - 是否释放观察者
 */
function disconnectPlaceholderResizeObserver(
  placeholderResizeObserver: MutableRefObject<ResizeObserver | null>,
  releaseObserver: boolean,
) {
  if (placeholderResizeObserver.current) {
    placeholderResizeObserver.current.disconnect();
    if (releaseObserver) {
      placeholderResizeObserver.current = null;
    }
  }
}

type TimerId = ReturnType<typeof setTimeout> | null;

/**
 * 清除超时引用
 *
 * @param {MutableRefObject<TimerId>} timeoutRef - 超时引用
 */
function clearTimeoutRef(timeoutRef: MutableRefObject<TimerId>) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}

/**
 * Leaf 组件 - 文本节点中的叶子组件
 *
 * 该组件表示文本节点中具有唯一格式化的单个叶子节点。
 * 处理占位符显示、ResizeObserver 管理和渲染逻辑。
 *
 * @component
 * @description 文本节点中的叶子组件，处理格式化和占位符
 * @param {Object} props - 组件属性
 * @param {boolean} props.isLast - 是否为最后一个叶子节点
 * @param {Text} props.leaf - 叶子节点数据
 * @param {Element} props.parent - 父元素
 * @param {(props: RenderPlaceholderProps) => JSX.Element} props.renderPlaceholder - 占位符渲染函数
 * @param {(props: RenderLeafProps) => JSX.Element} [props.renderLeaf] - 叶子节点渲染函数
 * @param {Text} props.text - 文本数据
 * @param {LeafPosition} [props.leafPosition] - 叶子节点位置
 *
 * @example
 * ```tsx
 * <Leaf
 *   isLast={true}
 *   leaf={leafData}
 *   parent={parentElement}
 *   renderPlaceholder={renderPlaceholder}
 *   text={textData}
 * />
 * ```
 *
 * @returns {JSX.Element} 渲染的叶子节点组件
 *
 * @remarks
 * - 处理占位符显示逻辑
 * - 管理 ResizeObserver 生命周期
 * - 支持 Android 延迟占位符显示
 * - 提供兼容性数据属性
 * - 使用 memo 优化性能
 */
const Leaf = (props: {
  isLast: boolean;
  leaf: Text;
  parent: Element;
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  text: Text;
  leafPosition?: LeafPosition;
}) => {
  const {
    leaf,
    isLast,
    text,
    parent,
    renderPlaceholder,
    renderLeaf = (props: RenderLeafProps) => <DefaultLeaf {...props} />,
    leafPosition,
  } = props;

  const editor = useSlateStatic();
  const placeholderResizeObserver = useRef<ResizeObserver | null>(null);
  const placeholderRef = useRef<HTMLElement | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const showPlaceholderTimeoutRef = useRef<TimerId>(null);

  const callbackPlaceholderRef = useCallback(
    (placeholderEl: HTMLElement | null) => {
      disconnectPlaceholderResizeObserver(
        placeholderResizeObserver,
        placeholderEl == null,
      );

      if (placeholderEl == null) {
        EDITOR_TO_PLACEHOLDER_ELEMENT.delete(editor);
        //@ts-ignore
        leaf.onPlaceholderResize?.(null);
      } else {
        EDITOR_TO_PLACEHOLDER_ELEMENT.set(editor, placeholderEl);

        if (!placeholderResizeObserver.current) {
          // Create a new observer and observe the placeholder element.
          const ResizeObserver =
            window.ResizeObserver || ResizeObserverPolyfill;
          placeholderResizeObserver.current = new ResizeObserver(() => {
            //@ts-ignore
            leaf.onPlaceholderResize?.(placeholderEl);
          });
        }
        placeholderResizeObserver.current.observe(placeholderEl);
        placeholderRef.current = placeholderEl;
      }
    },
    [placeholderRef, leaf, editor],
  );

  let children = (
    <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
  );

  //@ts-ignore
  const leafIsPlaceholder = Boolean(leaf[PLACEHOLDER_SYMBOL]);
  useEffect(() => {
    if (leafIsPlaceholder) {
      if (!showPlaceholderTimeoutRef.current) {
        // Delay the placeholder, so it will not render in a selection
        showPlaceholderTimeoutRef.current = setTimeout(() => {
          setShowPlaceholder(true);
          showPlaceholderTimeoutRef.current = null;
        }, PLACEHOLDER_DELAY);
      }
    } else {
      clearTimeoutRef(showPlaceholderTimeoutRef);
      setShowPlaceholder(false);
    }
    return () => clearTimeoutRef(showPlaceholderTimeoutRef);
  }, [leafIsPlaceholder, setShowPlaceholder]);

  if (leafIsPlaceholder && showPlaceholder) {
    const placeholderProps: RenderPlaceholderProps = {
      //@ts-ignore
      children: leaf.placeholder,
      attributes: {
        'data-slate-placeholder': true,
        style: {
          position: 'absolute',
          top: 0,
          pointerEvents: 'none',
          width: '100%',
          maxWidth: '100%',
          display: 'block',
          opacity: '0.333',
          userSelect: 'none',
          textDecoration: 'none',
          // Fixes https://github.com/udecode/plate/issues/2315
          WebkitUserModify: IS_WEBKIT ? 'inherit' : undefined,
        },
        contentEditable: false,
        ref: callbackPlaceholderRef,
      },
    };

    children = (
      <React.Fragment>
        {renderPlaceholder(placeholderProps)}
        {children}
      </React.Fragment>
    );
  }

  // COMPAT: Having the `data-` attributes on these leaf elements ensures that
  // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
  // contenteditable behaviors. (2019/05/08)
  const attributes: {
    'data-slate-leaf': true;
  } = {
    'data-slate-leaf': true,
  };

  return renderLeaf({
    attributes,
    children,
    leaf,
    text,
    leafPosition,
  });
};

const MemoizedLeaf = React.memo(Leaf, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.renderPlaceholder === prev.renderPlaceholder &&
    next.text === prev.text &&
    Text.equals(next.leaf, prev.leaf) &&
    //@ts-ignore
    next.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL]
  );
});

/**
 * DefaultLeaf 组件 - 默认叶子节点渲染组件
 *
 * 该组件是叶子节点的默认渲染器，提供基本的 span 元素包装。
 * 作为 renderLeaf 函数的默认实现。
 *
 * @component
 * @description 默认叶子节点渲染组件，提供基本渲染功能
 * @param {RenderLeafProps} props - 叶子节点渲染属性
 * @param {Object} props.attributes - 元素属性
 * @param {React.ReactNode} props.children - 子组件
 *
 * @example
 * ```tsx
 * <DefaultLeaf
 *   attributes={{ 'data-slate-leaf': true }}
 *   children="文本内容"
 * />
 * ```
 *
 * @returns {JSX.Element} 渲染的默认叶子节点组件
 *
 * @remarks
 * - 使用 span 元素包装内容
 * - 传递所有属性到 span 元素
 * - 作为默认的叶子节点渲染器
 * - 简单且高效的实现
 */
export const DefaultLeaf = (props: RenderLeafProps) => {
  const { attributes, children } = props;
  return <span {...attributes}>{children}</span>;
};

export default MemoizedLeaf;
