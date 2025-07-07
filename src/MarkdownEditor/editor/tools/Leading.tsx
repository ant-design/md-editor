import { Anchor, AnchorProps } from 'antd';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { Node } from 'slate';
import {
  Elements,
  useDebounce,
  useGetSetState,
} from '../../BaseMarkdownEditor';
import { useEditorStore } from '../store';
import { getOffsetTop, slugify } from '../utils/dom';

/**
 * 目录标题组件
 *
 * 用于渲染目录中的标题，支持文本溢出处理和省略号显示
 *
 * @param children - 标题内容
 * @returns 渲染的标题组件
 */

/**
 * 目录项数据结构
 */
interface Leading {
  title: string;
  level: number;
  id: string;
  key: string;
  dom?: HTMLElement;
  schema: object;
}

const TocTitle: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <span
      style={{
        maxWidth: 200,
        display: 'inline-block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: 14,
      }}
    >
      {children}
    </span>
  );
};

/**
 * 目录树节点数据结构
 *
 * 用于构建层级目录树的节点类型
 */
interface TreeNode {
  title: string;
  version?: string;
  children: TreeNode[];
  id: string;
  key: string;
  level?: number;
}

/**
 * 目录项缓存
 *
 * 使用 WeakMap 可以避免内存泄漏，当 schema 对象被垃圾回收时，
 * 对应的缓存也会自动清理
 */
const cache = new Map<object, Leading>();

/**
 * 构建目录树
 *
 * 将扁平的标题列表转换为层次化的树结构，支持任意层级嵌套
 *
 * @param headers - 扁平的标题列表
 * @returns 构建好的目录树根节点
 */

function buildTree(headers: Leading[]): TreeNode {
  // 创建虚拟根节点，用于统一处理顶级节点
  const root: TreeNode = {
    title: '',
    children: [],
    id: '',
    key: nanoid(),
  };

  // 如果没有标题，直接返回空的根节点
  if (!headers.length) return root;

  // 使用栈来维护当前的层级路径
  const stack: { node: TreeNode; level: number }[] = [{ node: root, level: 0 }];

  for (const header of headers) {
    const newNode: TreeNode = {
      title: header.title,
      children: [],
      id: header.id,
      key: nanoid(),
      level: header.level,
    };

    // 关键逻辑：找到合适的父节点
    // 如果当前标题的层级小于等于栈顶节点的层级，需要弹出栈直到找到合适的父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= header.level) {
      stack.pop();
    }

    // 安全检查：如果栈为空，重置为根节点
    if (stack.length === 0) {
      stack.push({ node: root, level: 0 });
    }

    // 当前栈顶即为父节点
    const parent = stack[stack.length - 1].node;
    parent.children.push(newNode);

    // 将新节点压入栈，以便后续节点可能作为其子节点
    stack.push({ node: newNode, level: header.level });
  }

  return root;
}

/**
 * Anchor 组件的数据项结构
 *
 * 符合 Ant Design Anchor 组件的数据格式要求
 */
interface AnchorItem {
  id: string;
  key: string;
  href: string;
  title: React.ReactNode;
  children?: AnchorItem[];
  level?: number;
}

/**
 * 将目录树转换为 Anchor 组件所需的数据格式
 *
 * 递归地将 TreeNode 结构转换为 AnchorItem 结构，
 * 只支持最多3层嵌套以保证良好的用户体验
 *
 * @param node - 目录树节点
 * @returns Anchor 组件的数据项数组
 */

function convertToAnchorItems(node: TreeNode): AnchorItem[] {
  // 如果节点没有子节点，返回空数组
  if (!node.children?.length) return [];

  return node.children.map((child) => ({
    id: child.id,
    key: child.key,
    href: `#${slugify(child.id)}`,
    title: <TocTitle key={`title-${child.id}`}>{child.title}</TocTitle>,
    // 支持二级子标题
    children: child.children?.map((subChild) => ({
      id: subChild.id,
      key: subChild.key,
      href: `#${slugify(subChild.id)}`,
      title: <TocTitle key={`title-${subChild.id}`}>{subChild.title}</TocTitle>,
      // 支持三级子标题（最大深度）
      children: subChild.children?.map((subSubChild) => ({
        id: subSubChild.id,
        key: subSubChild.key,
        href: `#${slugify(subSubChild.id)}`,
        title: (
          <TocTitle key={`title-${subSubChild.id}`}>
            {subSubChild.title}
          </TocTitle>
        ),
      })),
    })),
    level: child.level,
  }));
}

/**
 * 目录组件属性接口
 */
interface TocHeadingProps {
  /** 编辑器的 schema 数据 */
  schema: Elements[];
  /** Anchor 组件的额外属性 */
  anchorProps?: AnchorProps;
}

/**
 * 目录组件
 *
 * 基于编辑器内容自动生成目录，支持：
 * - 自动提取1-4级标题
 * - 智能滚动定位和高亮
 * - 内部滚动和页面滚动的双重支持
 * - 性能优化的缓存机制
 *
 * @param schema - 编辑器的内容数据
 * @param anchorProps - 传递给 Anchor 组件的额外属性
 * @returns 目录组件
 */

export const TocHeading: React.FC<TocHeadingProps> = ({
  schema,
  anchorProps,
}) => {
  const { markdownContainerRef } = useEditorStore();

  // 使用 useGetSetState 管理组件状态
  const [state, setState] = useGetSetState({
    headings: [] as Leading[],
    active: '',
  });

  // 用于标识是否正在进行内部滚动的标志
  const isScrollingInternally = useRef(false);

  /**
   * 从 schema 中提取标题信息
   *
   * 遍历 schema 数组，提取所有的标题元素（type 为 'head' 且 level 小于等于 4）
   * 使用缓存机制避免重复处理相同的 schema 对象
   */

  const getHeading = useCallback(() => {
    // 如果没有 schema 数据，清空标题列表
    if (!schema?.length) {
      setState({ headings: [] });
      return;
    }

    const headings: Leading[] = [];

    // 遍历 schema 提取标题
    for (const s of schema) {
      // 只处理标题类型且层级不超过4的元素
      if (s.type === 'head' && s.level <= 4) {
        const title = Node.string(s);
        const id = slugify(title);

        // 跳过空标题
        if (!title) continue;

        // 检查缓存
        const cached = cache.get(s);
        if (cached) {
          headings.push(cached);
          continue;
        }

        // 创建新的标题对象
        const heading: Leading = {
          title,
          level: s.level,
          id,
          key: nanoid(),
          schema: s,
        };

        // 缓存标题对象
        cache.set(s, heading);
        headings.push(heading);
      }
    }

    setState({ headings });
  }, [schema, setState]);

  // 当 schema 发生变化时重新提取标题
  useEffect(() => {
    cache.clear(); // 清理缓存，避免内存泄漏
    getHeading();
  }, [schema, getHeading]);

  // 使用防抖优化频繁的 schema 变化
  useDebounce(getHeading, 100, [schema]);

  /**
   * 处理内部容器滚动
   *
   * 当编辑器内部发生滚动时，更新当前激活的标题
   */
  useEffect(() => {
    const container = markdownContainerRef.current;
    if (!container) return;

    const handleScroll = (e: Event) => {
      // 只在内部滚动时处理
      if (!isScrollingInternally.current) return;

      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const currentHeadings = state().headings.slice().reverse();

      // 从下往上查找第一个滚动位置超过的标题
      for (const heading of currentHeadings) {
        const element = document.getElementById(heading.id);
        if (element && scrollTop > getOffsetTop(element, container) - 20) {
          setState({ active: heading.id });
          return;
        }
      }

      // 如果没有找到合适的标题，清空激活状态
      setState({ active: '' });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [markdownContainerRef, setState, state]);

  /**
   * 处理页面滚动
   *
   * 当页面发生滚动时，更新当前激活的标题
   * 只在非内部滚动时处理，避免冲突
   */
  useEffect(() => {
    const handleScroll = () => {
      // 服务端渲染检查
      if (typeof window === 'undefined') return;

      // 如果正在进行内部滚动，忽略页面滚动
      if (isScrollingInternally.current) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const currentHeadings = state().headings.slice().reverse();

      // 从下往上查找第一个滚动位置超过的标题
      for (const heading of currentHeadings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + scrollTop;
          if (scrollTop >= elementTop - 100) {
            setState({ active: heading.id });
            return;
          }
        }
      }

      // 如果没有找到合适的标题，清空激活状态
      setState({ active: '' });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setState, state]);

  /**
   * 处理锚点点击事件
   *
   * 根据目标元素的位置选择合适的滚动方式：
   * - 如果目标在编辑器容器内，使用内部滚动
   * - 否则使用页面滚动
   */
  const handleAnchorClick = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      link: { title: React.ReactNode; href: string },
    ) => {
      e.preventDefault();

      // 从链接中提取目标 ID
      const targetId = link.href.split('#')[1];
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        console.warn(`Target element with id "${targetId}" not found`);
        return;
      }

      const container = markdownContainerRef.current;

      if (container && container.contains(targetElement)) {
        // 目标元素在容器内部，使用内部滚动
        isScrollingInternally.current = true;

        const offsetTop = getOffsetTop(targetElement, container);
        container.scrollTo({
          top: offsetTop - 20, // 预留20px的缓冲空间
          behavior: 'smooth',
        });

        // 滚动完成后重置标志
        setTimeout(() => {
          isScrollingInternally.current = false;
        }, 500);
      } else {
        // 目标元素在容器外部，使用页面滚动
        isScrollingInternally.current = false;

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // 补偿固定导航栏的高度
        setTimeout(() => {
          window.scrollBy(0, -100);
        }, 100);
      }
    },
    [markdownContainerRef],
  );

  // 使用 useMemo 优化性能，避免不必要的重新计算
  const treeData = useMemo(
    () => buildTree(state().headings),
    [state().headings],
  );

  const items = useMemo(() => convertToAnchorItems(treeData), [treeData]);

  // 如果没有目录项，不渲染组件
  if (!items.length) {
    return null;
  }

  return (
    <Anchor
      style={{
        minWidth: 200,
        maxHeight: 'min(calc(100vh - 180px), 300px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: 4,
      }}
      offsetTop={96}
      onClick={handleAnchorClick}
      {...anchorProps}
      items={items}
    />
  );
};
