import { CopyOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useGetSetState } from 'react-use';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { CodeLineNode, CodeNode, ElementProps } from '../../el';
import { useMEditor } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { Mermaid } from './CodeUI/Mermaid';

export const CodeCtx = createContext({ lang: '', code: false });

const langOptions = [
  'plain text',
  'javascript',
  'typescript',
  'java',
  'json',
  'c',
  'solidity',
].map((l) => ({ label: l, value: l.toLowerCase() }));

export const CodeElement = observer((props: ElementProps<CodeNode>) => {
  const store = useEditorStore();
  const [editor, update] = useMEditor(props.element);
  const [state, setState] = useGetSetState({
    lang: props.element.language?.toLowerCase() || '',
    editable: false,
    options: langOptions,
    openMenu: false,
    hide:
      props.element.render ||
      props.element.language?.toLowerCase() === 'mermaid',
  });

  const setLanguage = useCallback(() => {
    setState({ editable: false });
    if (props.element.language?.toLowerCase() === state().lang) return;
    runInAction(() => (store.pauseCodeHighlight = true));
    update({ language: state().lang });
    setTimeout(() => {
      runInAction(() => {
        store.pauseCodeHighlight = false;
        store.refreshHighlight = !store.refreshHighlight;
      });
    });
  }, [props.element, props.element.children, state().lang]);

  const child = React.useMemo(() => {
    return <code>{props.children}</code>;
  }, [props.element, props.element.children, store.refreshHighlight]);

  return (
    <CodeCtx.Provider value={{ lang: state().lang || '', code: true }}>
      <div
        className={`code-container ${'wrap'}`}
        {...props.attributes}
        style={{
          padding: state().hide ? 1 : undefined,
          marginBottom: state().hide ? 0 : undefined,
        }}
      >
        <div
          data-be={'code'}
          style={{
            borderRadius: 4,
            fontFeatureSettings: 'normal',
            fontVariationSettings: 'normal',
            WebkitTextSizeAdjust: '100%',
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
            textRendering: 'optimizeLegibility',
            fontFamily:
              '-apple-system, system-ui, ui-sans-serif, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            direction: 'ltr',
            position: 'relative',
            marginBottom: '0',
            tabSize: 2,
            background: 'rgb(250, 250, 250)',
          }}
          onDragStart={store.dragStart}
          className={`light drag-el num tab-${4}`}
        >
          {!props.element.frontmatter && <DragHandle />}
          <div
            contentEditable={false}
            style={{
              direction: 'ltr',
              tabSize: 2,
              WebkitUserModify: 'read-only',
              boxSizing: 'border-box',
              caretColor: 'rgba(0, 0, 0, 0.9)',
              color: 'rgba(0, 0, 0, 0.8)',
              zIndex: 10,
              display: 'flex',
              userSelect: 'none',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 12px',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <div>
              {!store.readonly && (
                <Select
                  size={'small'}
                  value={state().lang}
                  options={langOptions}
                  filterOption={(text, item) => {
                    return item?.value.includes(text) || false;
                  }}
                  style={{
                    background: 'transparent',
                  }}
                  popupMatchSelectWidth={false}
                  onChange={(e) => {
                    setState({ lang: e });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      setLanguage();
                    }
                  }}
                  onBlur={setLanguage}
                  className={'lang-select'}
                />
              )}
              {store.readonly && (
                <div>
                  {props.element.language ? (
                    <span>
                      {props.element.language === 'html' && props.element.render
                        ? 'Html Rendering'
                        : props.element.language}
                    </span>
                  ) : (
                    <span>{'plain text'}</span>
                  )}
                </div>
              )}
            </div>
            <div>
              <CopyOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(
                    props.element.children
                      ?.map((c) => Node.string(c))
                      .join('\n'),
                  );
                }}
              />
            </div>
          </div>
          <div
            className="code-highlight"
            style={{
              position: 'relative',
              borderRadius: 4,
              fontFeatureSettings: 'normal',
              fontVariationSettings: 'normal',
              WebkitTextSizeAdjust: '100%',
              WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
              textRendering: 'optimizeLegibility',
              fontFamily:
                '-apple-system, system-ui, ui-sans-serif, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              direction: 'ltr',
              marginBottom: '0',
              tabSize: 2,
              caretColor: 'rgba(0, 0, 0, 0.9)',
              color: 'rgba(0, 0, 0, 0.8)',
              paddingLeft: '32px',
              background: 'rgb(250, 250, 250)',
            }}
          >
            <pre
              className={`code-line-list select-none`}
              contentEditable={false}
            >
              {(props.children || [])
                //@ts-ignore
                .map((_, i) => (
                  <div key={i} />
                ))}
            </pre>
            <pre
              style={{
                textRendering: 'optimizeLegibility',
                overflowWrap: 'break-word',
                direction: 'ltr',
                tabSize: 2,
                borderWidth: '0',
                borderStyle: 'solid',
                borderColor: '#e5e7eb',
                boxSizing: 'border-box',
                fontFeatureSettings: 'normal',
                fontVariationSettings: 'normal',
                caretColor: 'rgba(0, 0, 0, 0.9)',
                color: 'rgba(0, 0, 0, 0.8)',
                fontFamily:
                  "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
                overflow: 'auto',
                margin: '0',
                overflowX: 'auto',
                whiteSpace: 'pre',
                padding: '10px 0',
                position: 'relative',
              }}
              data-bl-type={'code'}
              className={'code-content'}
              data-bl-lang={state().lang}
            >
              {child}
            </pre>
          </div>
        </div>
      </div>
      {props.element.language === 'mermaid' && (
        <Mermaid lines={props.element.children} el={props.element} />
      )}
      {props.element.language === 'html' && !!props.element.render && (
        <div
          className={
            'bg-gray-500/5 p-3 mb-3 whitespace-nowrap rounded leading-5 overflow-auto'
          }
          onClick={(e) => {
            e.stopPropagation();
            Transforms.select(
              editor,
              Editor.start(editor, ReactEditor.findPath(editor, props.element)),
            );
          }}
          dangerouslySetInnerHTML={{
            __html: props.element.children
              ?.map((c) => Node.string(c))
              .join('\n'),
          }}
          contentEditable={false}
        />
      )}
    </CodeCtx.Provider>
  );
});

export const CodeLine = observer((props: ElementProps<CodeLineNode>) => {
  const ctx = useContext(CodeCtx);
  const store = useEditorStore();
  return useMemo(() => {
    return (
      <div className={`code-line`} data-be={'code-line'} {...props.attributes}>
        {props.children}
      </div>
    );
  }, [props.element, props.element.children, ctx.lang, store.refreshHighlight]);
});
