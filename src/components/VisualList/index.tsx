import React from 'react';
import { useStyle } from './style';

/**
 * 视觉列表项数据接口
 */
export interface VisualListItem {
  /** 唯一标识符 */
  id?: string;
  /** 图片地址（必需） */
  src: string;
  /** 图片替代文本 */
  alt?: string;
  /** 图片标题 */
  title?: string;
  /** 链接地址，如果提供则图片可点击 */
  href?: string;
}

/**
 * VisualList 组件属性接口
 */
export interface VisualListProps {
  /** 自定义 CSS 类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
  /** 图片数据数组（必需） */
  data: VisualListItem[];
  /** 数据过滤函数 */
  filter?: (item: VisualListItem) => boolean;
  /** 空状态自定义渲染函数 */
  emptyRender?: () => React.ReactNode;
  /** 自定义列表项渲染函数 */
  renderItem?: (item: VisualListItem, index: number) => React.ReactNode;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 加载状态自定义渲染函数 */
  loadingRender?: () => React.ReactNode;
  /** 列表项自定义样式 */
  itemStyle?: React.CSSProperties;
  /** 图片自定义样式 */
  imageStyle?: React.CSSProperties;
  /** 链接自定义样式 */
  linkStyle?: React.CSSProperties;
  /** 图片形状 */
  shape?: 'default' | 'circle';
  /** 样式前缀类名 */
  prefixCls?: string;
}

/**
 * VisualList 组件 - 视觉列表组件
 *
 * 一个灵活的图片列表组件，支持多种尺寸、形状和自定义渲染。
 * 基于 css-in-js 样式系统，提供良好的主题支持和样式隔离。
 *
 * @component
 * @description 用于展示图片列表的组件，支持头像、缩略图等多种场景
 * @example
 * ```tsx
 * import { VisualList, VisualListItem } from '@ant-design/md-editor';
 *
 * const imageData: VisualListItem[] = [
 *   {
 *     id: '1',
 *     src: 'https://example.com/image1.jpg',
 *     alt: 'Image 1',
 *     title: 'Image Title',
 *     href: 'https://example.com/profile/1'
 *   }
 * ];
 *
 * // 基础用法
 * <VisualList data={imageData} />
 *
 * // 大尺寸圆形头像
 * <VisualList data={imageData} size="large" shape="circle" />
 *
 * // 过滤数据
 * <VisualList data={imageData} filter={(item) => item.href !== undefined} />
 * ```
 *
 * @param props - 组件属性
 * @returns 渲染的视觉列表组件
 */
export const VisualList: React.FC<VisualListProps> = ({
  className,
  style,
  data = [],
  filter = () => true,
  emptyRender,
  renderItem,
  loading = false,
  loadingRender,
  itemStyle,
  imageStyle,
  linkStyle,
  shape = 'default',
  prefixCls = 'visual-list',
}) => {
  const { wrapSSR, hashId } = useStyle(prefixCls);

  // 加载状态渲染
  if (loading) {
    return wrapSSR(
      <ul
        className={`${prefixCls} ${prefixCls}-loading ${hashId} ${className || ''}`}
        style={style}
      >
        {loadingRender ? loadingRender() : <span>加载中...</span>}
      </ul>,
    );
  }

  // 过滤数据
  const displayList = data.filter(filter);

  // 空状态渲染
  if (displayList.length === 0) {
    return wrapSSR(
      <ul
        className={`${prefixCls} ${prefixCls}-empty ${hashId} ${className || ''}`}
        style={style}
      >
        {emptyRender ? emptyRender() : <span>暂无数据</span>}
      </ul>,
    );
  }

  /**
   * 默认列表项渲染函数
   * @param item - 列表项数据
   * @param index - 列表项索引
   * @returns 渲染的列表项元素
   */
  const defaultRenderItem = (item: VisualListItem, index: number) => {
    const itemClassNames = [
      `${prefixCls}-item`,
      shape === 'circle' ? `${prefixCls}-item-circle` : '',
      hashId,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={item.id || index} className={itemClassNames} style={itemStyle}>
        {item.href ? (
          <a
            href={item.href}
            className={`${prefixCls}-link ${hashId}`}
            style={linkStyle}
          >
            <img
              src={item.src}
              alt={item.alt || item.title || ''}
              title={item.title}
              className={`${prefixCls}-image ${hashId}`}
              style={imageStyle}
            />
          </a>
        ) : (
          <img
            src={item.src}
            alt={item.alt || item.title || ''}
            title={item.title}
            className={`${prefixCls}-image ${hashId}`}
            style={imageStyle}
          />
        )}
      </li>
    );
  };

  return wrapSSR(
    <ul className={`${prefixCls} ${hashId} ${className || ''}`} style={style}>
      {displayList.map((item, index) => {
        if (renderItem) {
          return renderItem(item, index);
        }
        return defaultRenderItem(item, index);
      })}
    </ul>,
  );
};
