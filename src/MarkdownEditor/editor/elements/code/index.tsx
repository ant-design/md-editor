import { CopyOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import ace, { Ace } from 'ace-builds';
import { AutoComplete, Input, Popover } from 'antd';
import isHotkey from 'is-hotkey';
import React, { useCallback, useEffect, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { Editor, Path, Transforms } from 'slate';
import { CodeNode, ElementProps } from '../../../el';
import { useSelStatus } from '../../../hooks/editor';
import { ReactEditor } from '../../slate-react';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { aceLangs, modeMap } from '../../utils/ace';
import { filterScript } from '../../utils/dom';
import { EditorUtils } from '../../utils/editorUtils';
import { Katex } from './CodeUI/Katex/Katex';
import { Mermaid } from './CodeUI/Mermaid';
import { langIconMap } from './langIconMap';

const langOptions = Array.from(langIconMap).map(([lang, icon]) => {
  return {
    value: lang,
    label: (
      <span className={'flex items-center'}>
        <img src={icon} className={'w-4'} />
        <span className={'ml-1'}>{lang}</span>
      </span>
    ),
  };
});

export function AceElement(props: ElementProps<CodeNode>) {
  const { store, markdownEditorRef } = useEditorStore();
  const [state, setState] = useGetSetState({
    showBorder: false,
    htmlStr: '',
    hide:
      !!props.element.render ||
      !!props.element.katex ||
      props.element.language === 'mermaid',
    lang: props.element.language || '',
    openSelectMenu: false,
  });
  const codeRef = useRef(props.element.code || '');
  const pathRef = useRef<Path>();
  const posRef = useRef({ row: 0, column: 0 });
  const pasted = useRef(false);
  const timmer = useRef(0);
  const [selected, path] = useSelStatus(props.element);
  pathRef.current = path;
  const editorRef = useRef<Ace.Editor>();
  const dom = useRef<HTMLDivElement>(null);
  const update = useCallback(
    (data: Partial<CodeNode>) => {
      const code = editorRef.current?.getValue() || '';
      codeRef.current = code;
      Transforms.setNodes(store.editor, data, { at: path });
    },
    [path],
  );

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
  const setLanguage = useCallback(() => {
    if (props.element.language?.toLowerCase() === state().lang) return;
    let lang = state().lang;
    update({ language: state().lang });
    if (modeMap.has(lang)) {
      lang = modeMap.get(lang)!;
    }
    if (aceLangs.has(lang)) {
      editorRef.current?.session.setMode(`ace/mode/${lang}`);
    } else {
      editorRef.current?.session.setMode(`ace/mode/text`);
    }
  }, [props.element, props.element.children, state().lang]);

  useEffect(() => {
    let code = props.element.code || '';
    const editor = ace.edit(dom.current!, {
      useWorker: false,
      value: code,
      fontSize: 13,
      maxLines: Infinity,
      wrap: true,
      tabSize: 4,
      showPrintMargin: false,
    });
    editor.commands.addCommand({
      name: 'disableFind',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {},
    });

    const t = dom.current!.querySelector('textarea');
    editor.on('focus', () => {
      setState({ showBorder: false, hide: false });
    });
    editor.on('blur', () => {
      editor.selection.clearSelection();
      setState({
        hide:
          props.element.katex ||
          (props.element.render && props.element.language !== 'html') ||
          props.element.language === 'mermaid',
      });
    });
    editor.selection.on('changeCursor', () => {
      setTimeout(() => {
        const pos = editor.getCursorPosition();
        posRef.current = { row: pos.row, column: pos.column };
      });
    });
    editor.on('paste', (e) => {
      if (pasted.current) {
        e.text = '';
      } else {
        pasted.current = true;
        setTimeout(() => {
          pasted.current = false;
        }, 60);
      }
    });
    t?.addEventListener('keydown', (e) => {
      if (isHotkey('backspace', e)) {
        if (!codeRef.current) {
          const path = ReactEditor.findPath(store.editor, props.element);
          Transforms.delete(store.editor, { at: path });
          Transforms.insertNodes(
            store.editor,
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
            { at: path },
          );
          Transforms.select(store.editor, Editor.start(store.editor, path));
          ReactEditor.focus(store.editor);
        }
      }
      if (isHotkey('mod+enter', e) && pathRef.current) {
        EditorUtils.focus(store.editor);
        Transforms.insertNodes(
          store.editor,
          { type: 'paragraph', children: [{ text: '' }] },
          {
            at: Path.next(pathRef.current),
            select: true,
          },
        );
        e.stopPropagation();
        return;
      }
      if (isHotkey('up', e)) {
        if (
          posRef.current.row === 0 &&
          posRef.current.column === 0 &&
          !props.element.frontmatter
        ) {
          EditorUtils.focus(store.editor);
          const path = pathRef.current!;
          if (Path.hasPrevious(path)) {
            EditorUtils.selectPrev(store, path);
          } else {
            Transforms.insertNodes(store.editor, EditorUtils.p, {
              at: path,
              select: true,
            });
          }
        }
      }
      if (isHotkey('down', e)) {
        const length = editor.getSession().getLength();
        if (
          posRef.current.row === length - 1 &&
          posRef.current.column === editor.session.getLine(length - 1)?.length
        ) {
          EditorUtils.focus(store.editor);
          const path = pathRef.current!;
          if (Editor.hasPath(store.editor, Path.next(path))) {
            EditorUtils.selectNext(store, path);
          } else {
            Transforms.insertNodes(store.editor, EditorUtils.p, {
              at: Path.next(path),
              select: true,
            });
          }
        }
      }
      const newEvent = new KeyboardEvent(e.type, e);
      window.dispatchEvent(newEvent);
    });
    let lang = props.element.language as string;
    setTimeout(() => {
      editor.setTheme(`ace/theme/cloud9_night`);
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }
      if (aceLangs.has(lang)) {
        editor.session.setMode(`ace/mode/${lang}`);
      }
    }, 16);
    editorRef.current = editor;
    editor.on('change', () => {
      clearTimeout(timmer.current);
      timmer.current = window.setTimeout(() => {
        update({ code: editor.getValue() });
      }, 100);
    });
    return () => {
      editor.destroy();
    };
  }, []);
  useEffect(() => {
    store.codes.set(props.element, editorRef.current!);
    if (props.element.language === 'html' && !!props.element.render) {
      setState({
        htmlStr: filterScript(props.element.code || 'plain text'),
      });
    }
    if (props.element.code !== codeRef.current) {
      editorRef.current?.setValue(props.element.code || 'plain text');
    }
  }, [props.element]);
  return (
    <div
      {...props.attributes}
      contentEditable={false}
      className={'ace-el drag-el'}
      data-be={'code'}
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
          backgroundColor: state().showBorder
            ? 'rgba(59, 130, 246, 0.1)'
            : 'rgb(252,252,252)',
          ...(!state().hide
            ? {
                borderWidth: '2px',
              }
            : {
                height: '0',
                opacity: 0,
              }),
        }}
        className={`ace-container drag-el ${
          props.element.frontmatter ? 'frontmatter' : ''
        } `}
      >
        {!props.element.frontmatter && (
          <div
            contentEditable={false}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              color: 'rgba(185, 100, 100, 0.6)',
              position: 'absolute',
              left: '0',
              top: '0',
              width: '100%',
              height: '1.75rem',
              paddingLeft: '0.75rem',
              paddingRight: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              zIndex: 50,
              userSelect: 'none',
            }}
          >
            <Popover
              trigger={['click']}
              placement={'bottomLeft'}
              overlayClassName={'light-poppver'}
              arrow={false}
              open={state().openSelectMenu}
              onOpenChange={(v) => {
                if (props.element.katex || props.element.render) {
                  return;
                }
                setState({ openSelectMenu: v });
                if (v) {
                  setTimeout(() => {
                    (
                      document.querySelector(
                        '.lang-select input',
                      ) as HTMLInputElement
                    )?.focus();
                  });
                }
              }}
              overlayInnerStyle={{ padding: 10 }}
              content={
                <AutoComplete
                  value={state().lang}
                  options={langOptions}
                  placeholder={'Search'}
                  autoFocus={true}
                  style={{ width: 200 }}
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
                      setState({ openSelectMenu: false });
                    }
                  }}
                  onBlur={setLanguage}
                  className={'lang-select'}
                >
                  <Input prefix={<SearchOutlined />} placeholder={'Search'} />
                </AutoComplete>
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'rgba(0, 0, 0, 0.8)',
                }}
              >
                {langIconMap.get(props.element.language?.toLowerCase() || '') &&
                  !props.element.katex && (
                    <div
                      style={{
                        height: '1rem',
                        width: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.25rem',
                      }}
                    >
                      <img
                        style={{
                          height: '1rem',
                          width: '1rem',
                        }}
                        src={langIconMap.get(
                          props.element.language?.toLowerCase() || '',
                        )}
                      />
                    </div>
                  )}
                <div>
                  {props.element.language ? (
                    <span>
                      {props.element.katex
                        ? 'Formula'
                        : props.element.language === 'html' &&
                            props.element.render
                          ? 'Html Renderer'
                          : props.element.language}
                    </span>
                  ) : (
                    <span>{'plain text'}</span>
                  )}
                </div>
                {!props.element.katex && !props.element.render && (
                  <RightOutlined
                    style={{
                      transform: 'rotate(90deg)',
                      fontSize: '1.125rem',
                      lineHeight: '1.75rem',
                      marginLeft: '0.125rem',
                    }}
                  />
                )}
              </div>
            </Popover>
            <div>
              <div
                style={{
                  transform: 'rotate(90deg)',
                  fontSize: '1.125rem',
                  lineHeight: '1.75rem',
                  marginLeft: '0.125rem',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const code = props.element.code || '';
                  //@ts-ignore
                  window.api.copyToClipboard(code);
                }}
              >
                <CopyOutlined />
              </div>
            </div>
          </div>
        )}
        <div ref={dom} style={{ height: 20, lineHeight: '22px' }}></div>
        <div className={'hidden'}>{props.children}</div>
      </div>
      {props.element.language === 'mermaid' && <Mermaid el={props.element} />}
      {!!props.element.katex && <Katex el={props.element} />}
      {props.element.language === 'html' && !!props.element.render && (
        <div
          style={{
            backgroundColor: 'rgba(107, 114, 128, 0.05)',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            whiteSpace: 'nowrap',
            borderRadius: '0.25rem',
            lineHeight: '1.25rem',
            overflow: 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            EditorUtils.focusAceEnd(editorRef.current!);
          }}
          dangerouslySetInnerHTML={{
            __html: state().htmlStr,
          }}
          contentEditable={false}
        />
      )}
    </div>
  );
}
