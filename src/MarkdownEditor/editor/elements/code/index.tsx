import {
  CloseCircleOutlined,
  CopyOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import ace, { Ace } from 'ace-builds';
import { AutoComplete, Input, message, Popover } from 'antd';
import isHotkey from 'is-hotkey';
import React, { useCallback, useEffect, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { Editor, Path, Transforms } from 'slate';
import { CodeNode, ElementProps } from '../../../el';
import { useSelStatus } from '../../../hooks/editor';
import { ActionIconBox } from '../../components/ActionIconBox';
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
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <img src={icon} style={{ width: '1em' }} />
        <span style={{ marginLeft: '0.25em' }}>{lang}</span>
      </span>
    ),
  };
});

export function AceElement(props: ElementProps<CodeNode>) {
  const { store, markdownEditorRef, readonly } = useEditorStore();
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
  const codeRef = useRef(props.element.value || '');
  const pathRef = useRef<Path>();
  const posRef = useRef({ row: 0, column: 0 });
  const pasted = useRef(false);
  const debounceTimer = useRef(0);
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
    if (!dom.current) return;
    const codeEditor = ace.edit(dom.current!, {
      useWorker: false,
      value: props.element.value,
      fontSize: 13,
      maxLines: Infinity,
      wrap: true,
      tabSize: 4,
      showPrintMargin: false,
    });
    codeEditor.commands.addCommand({
      name: 'disableFind',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {},
    });

    const t = dom.current!.querySelector('textarea');
    codeEditor.on('focus', () => {
      setState({ showBorder: false, hide: false });
    });
    codeEditor.on('blur', () => {
      codeEditor.selection.clearSelection();
    });
    codeEditor.selection.on('changeCursor', () => {
      setTimeout(() => {
        const pos = codeEditor.getCursorPosition();
        posRef.current = { row: pos.row, column: pos.column };
      });
    });
    codeEditor.on('paste', (e) => {
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
        const length = codeEditor.getSession().getLength();
        if (
          posRef.current.row === length - 1 &&
          posRef.current.column ===
            codeEditor.session.getLine(length - 1)?.length
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
      if (modeMap.has(lang)) {
        lang = modeMap.get(lang)!;
      }
      if (aceLangs.has(lang)) {
        codeEditor.session.setMode(`ace/mode/${lang}`);
      }
    }, 16);
    editorRef.current = codeEditor;
    codeEditor.on('change', () => {
      if (readonly) return;
      clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(() => {
        update({ value: codeEditor.getValue() });
      }, 100);
    });
    if (readonly) {
      codeEditor?.setReadOnly(true);
    } else {
      codeEditor?.setReadOnly(false);
    }
    return () => {
      codeEditor.destroy();
    };
  }, []);
  useEffect(() => {
    store.codes.set(props.element, editorRef.current!);
    if (props.element.language === 'html' && !!props.element.render) {
      setState({
        htmlStr: filterScript(props.element.value || 'plain text'),
      });
    }
    if (props.element.value !== codeRef.current) {
      editorRef.current?.setValue(props.element.value || 'plain text');
      editorRef.current?.clearSelection();
    }
  }, [props.element]);

  if (props.element.language === 'html') {
    return null;
  }
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
              paddingLeft: '0.75em',
              paddingRight: '0.375em',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              fontSize: '1em',
              color: 'rgba(0, 0, 0, 0.6)',
              justifyContent: 'space-between',
              zIndex: 50,
              userSelect: 'none',
            }}
          >
            {readonly ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 2,
                  color: 'rgba(0, 0, 0, 0.8)',
                }}
              >
                {langIconMap.get(props.element.language?.toLowerCase() || '') &&
                  !props.element.katex && (
                    <div
                      style={{
                        height: '1em',
                        width: '1em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.25em',
                      }}
                    >
                      <img
                        style={{
                          height: '1em',
                          width: '1em',
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
              </div>
            ) : (
              <Popover
                arrow={false}
                styles={{
                  body: {
                    padding: 8,
                  },
                }}
                trigger={['click']}
                placement={'bottomLeft'}
                overlayClassName={'light-poppver'}
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
                    disabled={readonly}
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
                    gap: 2,
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {langIconMap.get(
                    props.element.language?.toLowerCase() || '',
                  ) &&
                    !props.element.katex && (
                      <div
                        style={{
                          height: '1em',
                          width: '1em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.25em',
                        }}
                      >
                        <img
                          style={{
                            height: '1em',
                            width: '1em',
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
                        fontSize: '0.9em',
                        lineHeight: '1.75em',
                        marginLeft: '0.125em',
                      }}
                    />
                  )}
                </div>
              </Popover>
            )}
            <div
              style={{
                display: 'flex',
                gap: 5,
              }}
            >
              {props.element.katex ? (
                <ActionIconBox
                  title="关闭"
                  onClick={() => {
                    setState({
                      hide:
                        props.element.katex ||
                        (props.element.render &&
                          props.element.language !== 'html') ||
                        props.element.language === 'mermaid',
                    });
                  }}
                >
                  <CloseCircleOutlined />
                </ActionIconBox>
              ) : null}
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
        <div ref={dom} style={{ height: 200, lineHeight: '22px' }}></div>
        <div className={'ant-md-editor-hidden'}>{props.children}</div>
      </div>
      {props.element.language === 'mermaid' && <Mermaid el={props.element} />}
      {!!props.element.katex && <Katex el={props.element} />}
      {props.element.language === 'html' && !!props.element.render && (
        <div
          style={{
            backgroundColor: 'rgba(107, 114, 128, 0.05)',
            padding: '0.75em',
            marginBottom: '0.75em',
            whiteSpace: 'nowrap',
            borderRadius: '0.25em',
            lineHeight: '1.25em',
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
