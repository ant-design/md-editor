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

function buildTree(data: any[]) {
  let tree = {} as Record<string, any>;

  data.forEach((item: { level?: any }) => {
    if (item.level === 1) {
      tree = { ...item, children: [] };
    } else {
      let currentLevel = tree;
      for (let i = 2; i < item.level; i++) {
        if (!currentLevel?.children) {
          currentLevel.children = [];
        }
        if (currentLevel.children?.at(-1)) {
          currentLevel =
            currentLevel.children?.[currentLevel.children.length - 1];
        }
      }
      if (!currentLevel?.children) {
        currentLevel.children = [];
      }
      currentLevel.children.push({ ...item, children: [] });
    }
  });

  return tree;
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
    setState({ active: '' });
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

  if (!buildTree(state().headings).children) {
    return null as React.ReactNode;
  }
  return (
    <Anchor
      style={{
        minWidth: 200,
      }}
      offsetTop={64}
      {...anchorProps}
      items={[buildTree(state().headings)]?.map((h: any) => ({
        id: h.id,
        key: h.key,
        href: `#${h.id}`,
        children: h?.children?.map((subH: any) => ({
          id: subH.id,
          key: subH.key,
          href: `#${subH.id}`,
          title: <TocTitle>{subH.title}</TocTitle>,
          children:
            subH?.children?.map((subSubH: any) => ({
              id: subSubH.id,
              key: subSubH.key,
              href: `#${subSubH.id}`,
              title: <TocTitle>{subSubH.title}</TocTitle>,
            })) || undefined,
        })),
        title: <TocTitle>{h.title}</TocTitle>,
        level: h.level,
      }))}
    />
  );
};
