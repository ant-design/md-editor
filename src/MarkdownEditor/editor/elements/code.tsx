import {
  CopyOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { AutoComplete } from 'antd';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useGetSetState } from 'react-use';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { CodeLineNode, CodeNode, ElementProps } from '../../el';
import { useMEditor } from '../../hooks/editor';
import { IMenu, openMenus } from '../components/Menu';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { EditorUtils } from '../utils/editorUtils';
import { allLanguages } from '../utils/highlight';
import { Mermaid } from './CodeUI/Mermaid';

export const CodeCtx = createContext({ lang: '', code: false });
const langOptions = allLanguages.map((l) => {
  return { value: l };
});

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
            background: '#fafafa',
          }}
          onDragStart={store.dragStart}
          className={`${'light'} drag-el ${
            props.element.frontmatter ? 'frontmatter' : ''
          } num tab-${4} code-highlight ${
            !state().hide ? '' : 'h-0 overflow-hidden border-none'
          }`}
        >
          {!props.element.frontmatter && <DragHandle />}
          <div
            className={`absolute z-10 right-2 top-1 flex items-center select-none`}
            contentEditable={false}
          >
            {state().editable && (
              <AutoComplete
                size={'small'}
                value={state().lang}
                options={langOptions}
                style={{ width: 130 }}
                filterOption={(text, item) => {
                  return item?.value.includes(text) || false;
                }}
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
            {!state().editable && (
              <>
                {!props.element.frontmatter && (
                  <div
                    className={`${
                      state().openMenu
                        ? 'bg-gray-400/20'
                        : 'group-hover:opacity-100 hover:bg-gray-400/20'
                    } duration-200 ${'text-black/60'} rounded px-1.5 py-0.5 text-xs cursor-pointer`}
                    onClick={(e) => {
                      if (props.element.render) {
                        return;
                      }
                      setState({ openMenu: true });
                      const menus: IMenu[] = [
                        {
                          text: (
                            <div className={'flex items-center'}>
                              <CopyOutlined className={'mr-1.5 text-lg'} />
                              copy
                            </div>
                          ),
                          click: () => {
                            navigator.clipboard.writeText(
                              props.element.children
                                ?.map((c) => Node.string(c))
                                .join('\n'),
                            );
                          },
                        },
                        { hr: true },
                        {
                          text: (
                            <div className={'flex items-center'}>
                              <DeleteOutlined className={'mr-1.5 text-lg'} />
                              delete
                            </div>
                          ),
                          click: () => {
                            try {
                              Transforms.delete(editor, {
                                at: ReactEditor.findPath(editor, props.element),
                              });
                            } catch (e) {
                              console.error('delete code node error', e);
                            }
                          },
                        },
                      ];
                      menus.unshift({
                        text: (
                          <div className={'flex items-center'}>
                            <FileTextOutlined className={'mr-1.5 text-lg'} />
                            {'plain text'}
                          </div>
                        ),
                        click: () => {
                          EditorUtils.blur(store.editor);
                          setState({ editable: true });
                          setTimeout(() => {
                            document
                              .querySelector<HTMLInputElement>(
                                '.lang-select input',
                              )
                              ?.focus();
                          }, 30);
                        },
                      });
                      openMenus(e, menus, () => {
                        setState({ openMenu: false });
                      });
                    }}
                  >
                    {props.element.language ? (
                      <span>
                        {props.element.language === 'html' &&
                        props.element.render
                          ? 'Html Rendering'
                          : props.element.language}
                      </span>
                    ) : (
                      <span>{'plain text'}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <pre className={`code-line-list select-none`} contentEditable={false}>
            {(props.children || [])
              //@ts-ignore
              .map((_, i) => (
                <div key={i} />
              ))}
          </pre>
          <pre
            data-bl-type={'code'}
            className={'code-content'}
            data-bl-lang={state().lang}
          >
            {child}
          </pre>
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
