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

interface Leading {
  title: string;
  level: number;
  id: string;
  key: string;
  dom?: HTMLElement;
  schema: object;
}

interface TreeNode {
  title: string;
  version?: string;
  children: TreeNode[];
  id: string;
  key: string;
  level?: number;
}

const cache = new Map<object, Leading>();

function buildTree(headers: Leading[]): TreeNode {
  // 创建虚拟根节点，用于统一处理顶级节点
  const root: TreeNode = {
    title: '',
    children: [],
    id: '',
    key: nanoid(),
  };

  if (!headers.length) return root;

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
    while (stack.length > 0 && stack[stack.length - 1].level >= header.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 安全检查：如果栈为空，重置为根节点
      stack.push({ node: root, level: 0 });
    }

    // 当前栈顶即为父节点
    const parent = stack[stack.length - 1].node;
    parent.children.push(newNode);

    // 将新节点压入栈
    stack.push({ node: newNode, level: header.level });
  }

  return root;
}

interface AnchorItem {
  id: string;
  key: string;
  href: string;
  title: React.ReactNode;
  children?: AnchorItem[];
  level?: number;
}

function convertToAnchorItems(node: TreeNode): AnchorItem[] {
  if (!node.children?.length) return [];

  return node.children.map((child) => ({
    id: child.id,
    key: child.key,
    href: `#${slugify(child.id)}`,
    title: <TocTitle key={`title-${child.id}`}>{child.title}</TocTitle>,
    children: child.children?.map((subChild) => ({
      id: subChild.id,
      key: subChild.key,
      href: `#${slugify(subChild.id)}`,
      title: <TocTitle key={`title-${subChild.id}`}>{subChild.title}</TocTitle>,
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

interface TocHeadingProps {
  schema: Elements[];
  anchorProps?: AnchorProps;
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

export const TocHeading: React.FC<TocHeadingProps> = ({
  schema,
  anchorProps,
}) => {
  const { markdownContainerRef } = useEditorStore();
  const [state, setState] = useGetSetState({
    headings: [] as Leading[],
    active: '',
  });
  const box = useRef<HTMLElement>();

  const isScrollingInternally = useRef(false);

  const getHeading = useCallback(() => {
    if (!schema?.length) {
      setState({ headings: [] });
      return;
    }

    const headings: Leading[] = [];
    for (const s of schema) {
      if (s.type === 'head' && s.level <= 4) {
        const title = Node.string(s);
        const id = slugify(title);
        if (!title) continue;

        const cached = cache.get(s);
        if (cached) {
          headings.push(cached);
          continue;
        }

        const heading: Leading = {
          title,
          level: s.level,
          id,
          key: nanoid(),
          schema: s,
        };
        cache.set(s, heading);
        headings.push(heading);
      }
    }
    setState({ headings });
  }, [schema, setState]);

  useEffect(() => {
    cache.clear();
    getHeading();
  }, [schema, getHeading]);

  useDebounce(getHeading, 100, [schema]);

  // 处理内部滚动
  useEffect(() => {
    const div = box.current;
    if (!div) return;

    const scroll = (e: Event) => {
      if (!isScrollingInternally.current) return;

      const top = (e.target as HTMLElement).scrollTop;
      const container = markdownContainerRef.current;
      if (!container) return;

      const heads = state().headings.slice().reverse();
      for (const h of heads) {
        if (h.dom && top > getOffsetTop(h.dom, container) - 20) {
          setState({ active: h.id });
          return;
        }
      }
      setState({ active: '' });
    };

    div.addEventListener('scroll', scroll, { passive: true });
    return () => div.removeEventListener('scroll', scroll);
  }, [markdownContainerRef, setState]);

  // 处理 body 滚动
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingInternally.current) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const heads = state().headings.slice().reverse();

      for (const h of heads) {
        const element = document.getElementById(h.id);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + scrollTop;
          if (scrollTop >= offsetTop - 100) {
            setState({ active: h.id });
            return;
          }
        }
      }
      setState({ active: '' });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setState, state]);

  // 处理锚点点击
  const handleAnchorClick = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      link: { title: React.ReactNode; href: string },
    ) => {
      e.preventDefault();
      const targetId = link.href.split('#')[1];
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      const container = markdownContainerRef.current;
      if (container && container.contains(targetElement)) {
        // 如果目标元素在容器内部，使用内部滚动
        isScrollingInternally.current = true;
        container.scrollTo({
          top: getOffsetTop(targetElement, container) - 20,
          behavior: 'smooth',
        });
      } else {
        // 否则使用 body 滚动
        isScrollingInternally.current = false;
        targetElement.scrollIntoView({ behavior: 'smooth' });
        window.scrollBy(0, -100); // 补偿顶部固定导航的高度
      }
    },
    [markdownContainerRef],
  );

  const treeData = useMemo(
    () => buildTree(state().headings),
    [state().headings],
  );
  const items = useMemo(() => convertToAnchorItems(treeData), [treeData]);

  if (!items.length) {
    return null;
  }

  return (
    <Anchor
      style={{
        minWidth: 200,
        maxHeight: 300,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: 4,
      }}
      offsetTop={64}
      onClick={handleAnchorClick}
      {...anchorProps}
      items={items}
    />
  );
};
