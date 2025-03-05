/* eslint-disable react/no-children-prop */
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { BaseRange, createEditor, Editor, Node, Range } from 'slate';
import { withHistory } from 'slate-history';
import {
  CommentDataType,
  MarkdownEditorProps,
  MElement,
  MLeaf,
  parserMdToSchema,
} from '../../BaseMarkdownEditor';
import { withMarkdown } from '../plugins';
import { Editable, RenderElementProps, Slate, withReact } from '../slate-react';
import { useStyle } from '../style';
import { calcPath, getRelativePath, isPath } from '../utils/editorUtils';

export const Preview = ({
  reportMode,
  ...editorProps
}: {
  className?: string;
  initValue: string;
  comment?: MarkdownEditorProps['comment'];
  prefixCls?: string;
  reportMode?: MarkdownEditorProps['reportMode'];
}) => {
  const editor = withMarkdown(withReact(withHistory(createEditor())));

  const onError = useCallback((e: React.SyntheticEvent) => {
    console.log('Editor error', e);
  }, []);

  const { wrapSSR, hashId } = useStyle(`${editorProps.prefixCls}-content`, {});

  const baseClassName = `${editorProps.prefixCls}-content`;
  const commentMap = useMemo(() => {
    const map = new Map<string, Map<string, CommentDataType[]>>();
    editorProps?.comment?.commentList?.forEach((c) => {
      const path = c.path.join(',');
      if (map.has(path)) {
        const childrenMap = map.get(path);
        const selection = JSON.stringify(c.selection);
        if (childrenMap?.has(selection)) {
          childrenMap.set(selection, [
            ...(childrenMap.get(selection) || []),
            c,
          ]);
          map.set(path, childrenMap);
          return;
        } else if (childrenMap) {
          childrenMap?.set(selection, [c]);
          map.set(path, childrenMap);
          return;
        }
      }
      const childrenMap = new Map<string, CommentDataType[]>();
      childrenMap.set(JSON.stringify(c.selection), [c]);
      map.set(path, childrenMap);
    });
    return map;
  }, [editorProps?.comment?.commentList]);

  const elementRenderElement = (props: RenderElementProps) => {
    return <MElement {...props} children={props.children} readonly />;
  };

  const renderMarkdownLeaf = (props: any) => {
    console.log(props);

    return (
      <MLeaf
        {...props}
        comment={editorProps?.comment}
        children={props.children}
        hashId={hashId}
      />
    );
  };

  const schema = useMemo(() => {
    return parserMdToSchema(editorProps.initValue)?.schema;
  }, [editorProps.initValue]);

  return wrapSSR(
    <Slate editor={editor} initialValue={schema}>
      <Editable
        decorate={(e) => {
          const ranges: BaseRange[] = [];
          const [, path] = e;
          const itemMap = commentMap.get(path.join(','));
          let newPath = path;
          if (Array.isArray(path) && path[path.length - 1] !== 0) {
            newPath = [...path, 0];
          }
          itemMap?.forEach((itemList) => {
            const item = itemList[0];
            const { anchor, focus } = item.selection || {};
            if (!anchor || !focus) return undefined;
            const relativePath = getRelativePath(newPath, anchor.path);
            const AnchorPath = calcPath(anchor.path, relativePath);
            const FocusPath = calcPath(focus.path, relativePath);

            if (
              isPath(FocusPath) &&
              isPath(AnchorPath) &&
              Editor.hasPath(editor, AnchorPath) &&
              Editor.hasPath(editor, FocusPath)
            ) {
              const newSelection = {
                anchor: { ...anchor, path: AnchorPath },
                focus: { ...focus, path: FocusPath },
              };
              const fragement = Editor.fragment(editor, newSelection);
              const str = Node.string({ children: fragement });
              const isStrEquals = str === item.refContent;
              const relativePath = getRelativePath(newPath, anchor.path);
              const newAnchorPath = calcPath(anchor.path, relativePath);
              const newFocusPath = calcPath(focus.path, relativePath);

              if (
                isStrEquals &&
                isPath(newFocusPath) &&
                isPath(newAnchorPath) &&
                Editor.hasPath(editor, newAnchorPath) &&
                Editor.hasPath(editor, newFocusPath)
              ) {
                ranges.push({
                  anchor: { path: newAnchorPath, offset: anchor.offset },
                  focus: { path: newFocusPath, offset: focus.offset },
                  data: itemList,
                  comment: true,
                  updateTime: Date.now(),
                } as Range);
              }
            }
          });

          return ranges as any[];
        }}
        onError={onError}
        readOnly
        className={classNames(
          `${baseClassName}-readonly`,
          `${baseClassName}`,
          editorProps.className,
          {
            [`${baseClassName}-report`]: reportMode,
          },
          hashId,
        )}
        style={
          reportMode
            ? {
                fontSize: 16,
              }
            : {
                fontSize: 14,
              }
        }
        autoFocus
        renderElement={elementRenderElement}
        renderLeaf={renderMarkdownLeaf}
      />
    </Slate>,
  );
};
