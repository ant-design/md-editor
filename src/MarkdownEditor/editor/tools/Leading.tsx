import { Anchor } from 'antd';
import { observer } from 'mobx-react-lite';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDebounce, useGetSetState } from 'react-use';
import { Node } from 'slate';
import { IFileItem } from '../../index';
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
        if (!currentLevel.children) {
          currentLevel.children = [];
        }
        if (currentLevel.children[currentLevel.children.length - 1]) {
          currentLevel =
            currentLevel.children[currentLevel.children.length - 1];
        }
      }
      if (!currentLevel.children) {
        currentLevel.children = [];
      }
      currentLevel.children.push({ ...item, children: [] });
    }
  });

  return tree;
}

/**
 * 配置次级标题的锚点
 */
export const Heading = observer(({ note }: { note: IFileItem }) => {
  const store = useEditorStore();
  const [state, setState] = useGetSetState({
    headings: [] as Leading[],
    active: '',
  });
  const box = useRef<HTMLElement>();
  const getHeading = useCallback(() => {
    if (note) {
      const schema = note.schema;
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
    } else {
      setState({ headings: [] });
    }
  }, [note]);

  useEffect(() => {
    cache.clear();
    getHeading();
    setState({ active: '' });
  }, [note]);

  useDebounce(getHeading, 100, [note, note?.refresh]);

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
        minWidth: 120,
      }}
      offsetTop={64}
      items={buildTree(state().headings).children?.map((h: any) => ({
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
      }))}
    />
  );
});
