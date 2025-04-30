import { Anchor, AnchorProps } from 'antd';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useRef } from 'react';

import { Node } from 'slate';
import {
  Elements,
  useDebounce,
  useGetSetState,
} from '../../BaseMarkdownEditor';
import { useEditorStore } from '../store';
import { getOffsetTop, slugify } from '../utils/dom';

type Leading = {
  title: string;
  level: number;
  id: string;
  key: string;
  dom?: HTMLElement;
  schema: object;
};

const cache = new Map<object, Leading>();

function buildTree(headers: any[]) {
  // 创建虚拟根节点，用于统一处理顶级节点
  const root = {
    title: '',
    version: '',
    children: [] as any[],
    id: '',
    key: nanoid(),
  };
  const stack = [{ node: root, level: 0, key: nanoid() }]; // 使用栈维护路径

  for (const header of headers) {
    // 解构层级、标题、版本（假设输入数据包含 level 字段）
    const { level, title, version } = header;

    // 创建新节点
    const newNode = {
      title: title,
      version: version,
      children: [] as any[],
      id: title,
      Key: nanoid(),
    } as any;

    // 关键逻辑：找到合适的父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop(); // 弹出层级大于等于当前节点的元素
    }

    // 当前栈顶即为父节点
    const parent = stack[stack.length - 1].node;
    parent.children.push(newNode);

    // 将新节点压入栈
    stack.push({ node: newNode, level: level, key: nanoid() });
  }

  // 返回真实根节点的子节点（去除虚拟根节点）
  return root;
}

export const schemaToHeading = (schema: any) => {
  const headings: Leading[] = [];
  for (let s of schema) {
    if (s.type === 'head' && s.level <= 4) {
      const title = Node.string(s);
      const id = slugify(title);
      if (title) {
        headings.push({
          title,
          level: s.level,
          id,
          key: nanoid(),
          schema: s,
        });
      }
    }
  }

  return buildTree(headings)?.children?.map((h: any) => ({
    id: h.id,
    key: h.key,
    href: `#${h.id}`,
    children: h?.children?.map((subH: any) => ({
      id: subH.id,
      key: subH.key,
      href: `#${subH.id}`,
      title: subH.title,
    })),
    title: h.title,
    level: h.level,
  }));
};

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
  const { store, markdownEditorRef } = useEditorStore();
  const [state, setState] = useGetSetState({
    headings: [] as Leading[],
    active: '',
  });
  const box = useRef<HTMLElement>();
  const getHeading = useCallback(() => {
    if (schema?.length) {
      const headings: Leading[] = [];
      for (let s of schema) {
        if (s.type === 'head' && s.level <= 4) {
          if (cache.get(s)) {
            headings.push(cache.get(s)!);
            continue;
          }
          const title = Node.string(s);
          const id = slugify(title);
          if (title) {
            cache.set(s, {
              title,
              level: s.level,
              id,
              key: nanoid(),
              schema: s,
            });
            headings.push(cache.get(s)!);
          }
        }
      }
      setState({ headings });
    } else {
      setState({ headings: [] });
    }
  }, [schema]);

  useEffect(() => {
    cache.clear();
    getHeading();
    if (state().active) {
      setState({ active: '' });
    }
  }, [store?.container, markdownEditorRef.current.children]);

  useDebounce(getHeading, 100, [markdownEditorRef.current.children]);

  useEffect(() => {
    const div = box.current;
    if (div) {
      const scroll = (e: Event) => {
        const top = (e.target as HTMLElement).scrollTop;
        const container = store?.container;
        if (!container) return;
        const heads = state().headings.slice().reverse();
        for (let h of heads) {
          if (h.dom && top > getOffsetTop(h.dom, container) - 20) {
            setState({ active: h.id });
            return;
          }
        }
        setState({ active: '' });
      };
      div.addEventListener('scroll', scroll, { passive: true });
      return () => div.removeEventListener('scroll', scroll);
    }
    return () => {};
  }, []);

  if (!buildTree(state().headings).children?.length) {
    return null as React.ReactNode;
  }

  return (
    <Anchor
      style={{
        minWidth: 200,
      }}
      offsetTop={64}
      {...anchorProps}
      items={buildTree(state().headings).children?.map((h: any) => ({
        id: h.id,
        key: h.key,
        href: `#${slugify(h.id)}`,
        children: h?.children?.map((subH: any) => ({
          id: subH.id,
          key: subH.key,
          href: `#${slugify(subH.id)}`,
          title: <TocTitle>{subH.title}</TocTitle>,
          children:
            subH?.children?.map((subSubH: any) => ({
              id: subSubH.id,
              key: subSubH.key,
              href: `#${slugify(subSubH.id)}`,
              title: <TocTitle>{subSubH.title}</TocTitle>,
            })) || undefined,
        })),
        title: <TocTitle>{h.title}</TocTitle>,
        level: h.level,
      }))}
    />
  );
};
