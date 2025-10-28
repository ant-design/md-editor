import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { Node } from 'slate';
import { I18nContext } from '../../../i18n';
import { ElementProps, ParagraphNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export const Paragraph = (props: ElementProps<ParagraphNode>) => {
  const {
    store,
    markdownEditorRef,
    markdownContainerRef,
    typewriter,
    readonly,
    editorProps,
  } = useEditorStore();
  const { locale } = useContext(I18nContext);
  const [selected, path] = useSelStatus(props.element);
  const isLast = useMemo(() => {
    if (markdownEditorRef.current?.children.length === 0) return false;
    if (!typewriter) return false;
    return store.isLatestNode(props.element);
  }, [
    markdownEditorRef.current?.children.at?.(path.at(0)!),
    markdownEditorRef.current?.children.at?.(path.at(0)! + 1),
    typewriter,
  ]);

  return React.useMemo(() => {
    const str = Node.string(props.element).trim();
    const isEmpty =
      !str &&
      markdownEditorRef.current?.children.length === 1 &&
      props.element?.children?.every?.(
        (child: any) => !child.type && !child.code && !child.tag,
      )
        ? true
        : undefined;

    return (
      <div
        {...props.attributes}
        data-be={'paragraph'}
        className={classNames('ant-md-editor-drag-el', {
          empty: isEmpty,
          typewriter: isLast && typewriter,
        })}
        data-align={props.element.align}
        data-slate-placeholder={
          isEmpty
            ? editorProps.titlePlaceholderContent ||
              locale?.inputPlaceholder ||
              '请输入内容...'
            : undefined
        }
        onDragStart={(e) => store.dragStart(e, markdownContainerRef.current!)}
        data-empty={isEmpty}
        style={{
          display: !!str || !!props.children?.at(0).type ? undefined : 'none',
        }}
      >
        <DragHandle />
        {props.children}
      </div>
    );
  }, [
    props.element.children,
    props.element.align,
    readonly,
    selected,
    isLast,
    markdownEditorRef.current?.children.length,
    editorProps.titlePlaceholderContent,
    typewriter,
  ]);
};
