import { CheckOutlined, CopyOutlined, RightOutlined } from '@ant-design/icons';
import { ConfigProvider, Select } from 'antd';
import classNames from 'classnames';
import { runInAction } from 'mobx';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useGetSetState } from 'react-use';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { CodeLineNode, CodeNode, ElementProps } from '../../../el';
import { useMEditor } from '../../../hooks/editor';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { Mermaid } from '../CodeUI/Mermaid';
import { useStyle } from './style';

export const CodeCtx = createContext({ lang: '', code: false });

/**
 * Clipboard 组件用于复制代码片段到剪贴板。
 *
 * @param props - 组件的属性。
 * @param props.className - 组件的 CSS 类名。
 * @param props.element - 包含要复制的代码片段的元素。
 *
 * @returns 返回一个包含复制按钮的 div 元素。
 *
 * @example
 * ```tsx
 * <Clipboard className="copy-button" element={codeElement} />
 * ```
 *
 * @remarks
 * 点击按钮后，代码片段将被复制到剪贴板，并显示复制成功的提示。
 */
const Clipboard = (props: any) => {
  const [copy, setCopy] = useState(false);
  return (
    <div
      className={props.className}
      style={{
        fontSize: 12,
      }}
      onClick={(e) => {
        e.stopPropagation();
        try {
          navigator.clipboard.writeText(
            props.element.children?.map((c: any) => Node.string(c)).join('\n'),
          );
          setCopy(true);
          setTimeout(() => {
            setCopy(false);
          }, 1000);
          console.log('copied');
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {copy ? (
        <CheckOutlined
          style={{
            color: '#52c41a',
          }}
        />
      ) : (
        <CopyOutlined />
      )}
    </div>
  );
};

const langOptions = [
  'plain text',
  'javascript',
  'typescript',
  'java',
  'json',
  'c',
  'solidity',
].map((l) => ({ label: l, value: l.toLowerCase() }));

export const CodeElement = (props: ElementProps<CodeNode>) => {
  const { store, readonly } = useEditorStore();
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

  const context = useContext(ConfigProvider.ConfigContext);
  const [collapse, setCollapse] = useState(false);
  const baseCls = context.getPrefixCls('md-editor-code');
  const { wrapSSR, hashId } = useStyle(baseCls);

  const child = React.useMemo(() => {
    return <code>{props.children}</code>;
  }, [props.element, props.element.children, store.refreshHighlight]);

  if (props.element.language === 'html' && props.element?.otherProps) {
    return null;
  }

  return wrapSSR(
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
          onDragStart={store.dragStart}
          className={classNames(
            baseCls,
            `${baseCls}-light`,
            `ant-md-editor-drag-el`,
            `${baseCls}-num`,
            `${baseCls}-tab-${4}`,
            hashId,
          )}
        >
          {!props.element.frontmatter && <DragHandle />}
          <div
            className={classNames(`${baseCls}-header`, hashId)}
            contentEditable={false}
          >
            <div>
              {!readonly && (
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
                  className={classNames(
                    `${baseCls}-header-lang-select`,
                    hashId,
                  )}
                />
              )}
              {readonly && (
                <div
                  style={{
                    fontSize: 12,
                  }}
                  className={classNames(`${baseCls}-header-lang`, hashId)}
                >
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
            <div className={classNames(`${baseCls}-header-actions`, hashId)}>
              <Clipboard
                {...props}
                className={classNames(`${baseCls}-header-actions-item`, hashId)}
              />
              <div
                className={classNames(`${baseCls}-header-actions-item`, hashId)}
                style={{
                  fontSize: 12,
                }}
                onClick={() => {
                  setCollapse(!collapse);
                }}
              >
                <RightOutlined
                  style={{
                    transform: `rotate(-${collapse ? 270 : 90}deg)`,
                    transition: 'transform 0.3s',
                  }}
                />
              </div>
            </div>
          </div>
          {collapse ? null : (
            <div
              className={classNames(
                `${baseCls}-content`,
                `${baseCls}-code-highlight`,
                hashId,
              )}
            >
              <pre
                className={classNames(
                  `${baseCls}-content-line-list`,
                  'select-none',
                  hashId,
                )}
                contentEditable={false}
              >
                {(props.children || [])
                  //@ts-ignore
                  .map((_, i) => (
                    <div key={i} />
                  ))}
              </pre>
              <pre
                className={classNames(
                  `${baseCls}-content-code-content`,
                  hashId,
                )}
                data-bl-type={'code'}
                data-bl-lang={state().lang}
              >
                {child}
              </pre>
            </div>
          )}
        </div>
      </div>
      {collapse ? null : (
        <>
          {props.element.language === 'mermaid' && (
            <Mermaid lines={props.element.children} el={props.element} />
          )}
          {props.element.language === 'html' && !!props.element.render && (
            <div
              style={{
                color: 'rgba(0,0,0,0.45)',
                fontSize: 12,
                display: 'flex',
                gap: 12,
                padding: '0 12px',
                alignItems: 'center',
                justifyContent: 'space-between',
                overflow: 'auto',
                fontWeight: 500,
              }}
              onClick={(e) => {
                e.stopPropagation();
                Transforms.select(
                  editor,
                  Editor.start(
                    editor,
                    ReactEditor.findPath(editor, props.element),
                  ),
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
        </>
      )}
    </CodeCtx.Provider>,
  );
};

export const CodeLine = (props: ElementProps<CodeLineNode>) => {
  const ctx = useContext(CodeCtx);
  const { store, typewriter } = useEditorStore();
  const isLatest = useMemo(() => {
    if (store?.editor?.children.length === 0) return false;
    if (!typewriter) return false;
    return store.isLatestNode(props.element);
  }, [store?.editor?.children, typewriter]);
  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('md-editor-code');

  return useMemo(() => {
    return (
      <div
        className={classNames(`${baseCls}-content-code-line`, {
          typewriter: isLatest && typewriter,
        })}
        data-be={'code-line'}
        {...props.attributes}
      >
        {props.children}
      </div>
    );
  }, [
    props.element,
    isLatest,
    props.element.children,
    ctx.lang,
    store.refreshHighlight,
  ]);
};
