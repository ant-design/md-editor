import { observable } from 'mobx';
import { nanoid } from 'nanoid';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { EditorFrame } from './editor/EditorFrame';
import { parserMdToSchema } from './editor/parser/parser';
import { EditorStore, EditorStoreContext } from './editor/store';
import { Heading } from './editor/tools/Leading';
import { EditorUtils } from './editor/utils/editorUtils';
import { useSystemKeyboard } from './editor/utils/keyboard';

import { ReactEditor, RenderElementProps } from 'slate-react';
import { FloatBar } from './editor/tools/FloatBar';
import { ToolBar } from './editor/tools/ToolBar';
import { Elements } from './el';
import './index.css';

export { EditorUtils, parserMdToSchema };

export * from './editor/elements';
export * from './editor/utils';
export * from './el';

export type IFileItem = {
  cid: string;
  root?: boolean;
  children?: IFileItem[];
  expand?: boolean;
  editName?: string;
  changed?: boolean;
  refresh?: boolean;
  ghost?: boolean;
  sort: number;
  schema?: any[];
  history?: any;
  hidden?: boolean;
  links?: { path: number[]; target: string }[];
};

/**
 * MarkdownEditor 实例
 */
export interface MarkdownEditorInstance {
  get current(): IFileItem | undefined;
  history: IFileItem[];
  index: number;
  hasNext: boolean;
  hasPrev: boolean;
  range?: Range;
  store: EditorStore;
  editorProps?: MarkdownEditorProps;
  id: string;
}

/**
 * MarkdownEditor 的 props
 * @param props
 */
export type MarkdownEditorProps = {
  width?: string | number;
  height?: string | number;
  image?: {
    upload?: (file: File[]) => Promise<string[] | string>;
  };
  initValue?: string;
  readonly?: boolean;
  style?: React.CSSProperties;
  toc?: boolean;
  toolBar?: {
    enable?: boolean;
    extra?: React.ReactNode[];
  };
  tabRef?: React.MutableRefObject<MarkdownEditorInstance | undefined>;
  eleItemRender?: (
    props: RenderElementProps,
    defaultDom: React.ReactNode,
  ) => React.ReactElement;
  initSchemaValue?: Elements[];
  onChange?: (value: string, schema: Elements[]) => void;
};

/**
 * MarkdownEditor
 * @param props
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const {
    initValue,
    width,
    toolBar,
    tabRef,
    toc = true,
    readonly,
    style,
    height,
    ...rest
  } = props;

  // 初始化实例
  const instance = useMemo(() => {
    const now = Date.now();
    const list = parserMdToSchema(initValue!)?.schema;
    if (!props.readonly) {
      list.push(EditorUtils.p);
    }
    const schema =
      props.initSchemaValue ||
      (initValue ? list : JSON.parse(JSON.stringify([EditorUtils.p])));

    const data = {
      cid: nanoid(),
      schema,
      sort: 0,
      lastOpenTime: now,
    };
    return observable(
      {
        get current() {
          return this.history[this.index];
        },
        history: [data],
        index: 0,
        id: nanoid(),
        get hasPrev() {
          return false;
        },
        editorProps: props,
        store: new EditorStore(),
        get hasNext() {
          return false;
        },
      } as MarkdownEditorInstance,
      { range: false, id: false },
    );
  }, []);

  const [mount, setMount] = useState(false);

  // 初始化快捷键
  useSystemKeyboard(instance.store, props);

  // 导入外部 hooks
  useImperativeHandle(tabRef, () => instance, [instance]);

  // 初始化 readonly
  useEffect(() => {
    instance.store.readonly = readonly || false;
  }, [readonly]);

  return (
    <EditorStoreContext.Provider value={instance.store}>
      <>
        {!readonly ? (
          <div
            style={{
              width: width || '400px',
            }}
          >
            {toolBar?.enable ? <ToolBar extra={toolBar.extra} /> : <FloatBar />}
          </div>
        ) : null}
        <div
          ref={(dom) => {
            instance.store.setState((state) => (state.container = dom));
            setMount(true);
          }}
          className="markdown-editor"
          style={{
            width: width || '400px',
            minWidth: readonly ? '200px' : '400px',
            height: height || '80vh',
            padding: props.readonly ? '8px' : '24px 48px',
            display: 'flex',
            maxHeight: '100%',
            overflow: 'auto',
            gap: 24,
            ...style,
          }}
          onClick={() => {
            ReactEditor.focus(instance.store.editor);
          }}
          key={instance.id}
        >
          <EditorFrame readonly={readonly} {...rest} instance={instance} />
          {instance.current &&
          mount &&
          toc !== false &&
          instance.store?.container ? (
            <Heading note={instance.current} />
          ) : null}
        </div>
      </>
    </EditorStoreContext.Provider>
  );
};
