import { CloseCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { Ace } from 'ace-builds';
import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { Path } from 'slate';
import { ActionIconBox } from '../../MarkdownEditor/editor/components/ActionIconBox';
import { ReactEditor } from '../../MarkdownEditor/editor/slate-react';
import { useEditorStore } from '../../MarkdownEditor/editor/store';
import { DragHandle } from '../../MarkdownEditor/editor/tools/DragHandle';
import { CodeNode, ElementProps } from '../../MarkdownEditor/el';
import { useSelStatus } from '../../MarkdownEditor/hooks/editor';
import { MermaidElement } from '../mermaid/Mermaid';

export function CodeElement(props: ElementProps<CodeNode>) {
  const { markdownEditorRef } = useEditorStore();
  const [state, setState] = useGetSetState({
    showBorder: false,
    htmlStr: '',
    hide: props.element.language === 'mermaid',
    lang: props.element.language || '',
  });
  const pathRef = useRef<Path>();
  const [selected, path] = useSelStatus(props.element);
  pathRef.current = path;
  const editorRef = useRef<Ace.Editor>();

  useEffect(() => {
    if (
      selected &&
      !editorRef.current?.isFocused() &&
      ReactEditor.isFocused(markdownEditorRef.current)
    ) {
      setState({ showBorder: true });
    } else if (state().showBorder) {
      setState({ showBorder: false });
    }
  }, [selected, path]);

  return (
    <div
      {...props.attributes}
      contentEditable={false}
      className={'ace-el drag-el'}
      data-be={'code'}
      tabIndex={-1}
      onBlur={() => {}}
      data-lang={props.element.language}
    >
      {!props.element.frontmatter && <DragHandle />}
      <div
        onClick={(e) => {
          e.stopPropagation();
          editorRef.current?.focus();
        }}
        style={{
          padding: state().hide ? 0 : undefined,
          marginBottom: state().hide ? 0 : undefined,
          boxSizing: 'border-box',
          backgroundColor: state().showBorder
            ? 'rgba(59, 130, 246, 0.1)'
            : state().hide
              ? 'transparent'
              : 'rgb(252, 252, 252)',
          maxHeight: 400,
          overflow: 'auto',
          position: 'relative',
          height: state().hide ? 0 : 'auto',
          opacity: state().hide ? 0 : 1,
        }}
        className={`ace-container drag-el ${
          props.element.frontmatter ? 'frontmatter' : ''
        }`}
      >
        {!props.element.frontmatter && (
          <div
            contentEditable={false}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              height: '1.75em',
              backgroundColor: '#FFF',
              borderBottom: '1px solid #eee',
              paddingLeft: '0.75em',
              paddingRight: '0.375em',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              position: 'sticky',
              left: 0,
              top: 0,
              fontSize: '1em',
              color: 'rgba(0, 0, 0, 0.6)',
              justifyContent: 'space-between',
              zIndex: 50,
              userSelect: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 5,
              }}
            >
              <ActionIconBox
                title="关闭"
                onClick={() => {
                  setState({
                    hide: props.element.language === 'mermaid',
                  });
                }}
              >
                <CloseCircleOutlined />
              </ActionIconBox>
              <ActionIconBox
                title="复制"
                style={{
                  fontSize: '0.9em',
                  lineHeight: '1.75em',
                  marginLeft: '0.125em',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    const code = props.element.value || '';
                    if (navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(code);
                    } else {
                      //@ts-ignore
                      document.execCommand('copy', false, code);
                    }
                    message.success('Copied');
                  } catch (error) {}
                }}
              >
                <CopyOutlined />
              </ActionIconBox>
            </div>
          </div>
        )}
        <div className={'ant-md-editor-hidden'}>{props.children}</div>
      </div>
      <MermaidElement el={props.element} />
    </div>
  );
}
