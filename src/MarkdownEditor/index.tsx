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
  index: number;
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
  /**
   * 配置图片数据
   */
  image?: {
    upload?: (file: File[]) => Promise<string[] | string>;
  };
  initValue?: string;
  /**
   * 只读模式
   */
  readonly?: boolean;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 是否显示目录
   */
  toc?: boolean;
  /**
   * 配置工具栏
   */
  toolBar?: {
    enable?: boolean;
    extra?: React.ReactNode[];
  };
  /**
   * 用于外部获取实例
   */
  editorRef?: React.MutableRefObject<MarkdownEditorInstance | undefined>;
  /**
   * 自定义渲染元素
   * @param props
   * @param defaultDom
   * @returns
   */
  eleItemRender?: (
    props: RenderElementProps,
    defaultDom: React.ReactNode,
  ) => React.ReactElement;
  initSchemaValue?: Elements[];
  /**
   * 内容变化回调
   * @param value:string
   * @param schema:Elements[]
   * @returns
   */
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
    editorRef,
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
          return data;
        },
        index: 0,
        id: nanoid(),
        editorProps: props,
        store: new EditorStore(),
      } as MarkdownEditorInstance,
      { range: false, id: false },
    );
  }, []);

  const [mount, setMount] = useState(false);

  // 初始化快捷键
  useSystemKeyboard(instance.store, props);

  // 导入外部 hooks
  useImperativeHandle(editorRef, () => instance, [instance]);

  // 初始化 readonly
  useEffect(() => {
    instance.store.readonly = readonly || false;
  }, [readonly]);

  return (
    <EditorStoreContext.Provider value={instance.store}>
      <div
        className="markdown-editor"
        style={{
          width: width || '400px',
          minWidth: readonly ? '200px' : '400px',
          height: height || 'auto',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          ...style,
        }}
      >
        {!readonly && toolBar?.enable ? (
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
            }}
          >
            {<ToolBar extra={toolBar.extra} />}
          </div>
        ) : readonly ? null : (
          <FloatBar />
        )}
        <div
          style={{
            padding: props.readonly ? '8px' : '24px 24px',
            overflow: 'auto',
            display: 'flex',
            gap: 24,
          }}
          ref={(dom) => {
            instance.store.setState((state) => (state.container = dom));
            setMount(true);
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
      </div>
    </EditorStoreContext.Provider>
  );
};
