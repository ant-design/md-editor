import { observable } from 'mobx';
import { nanoid } from 'nanoid';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { parserMdToSchema } from './editor/parser/parserMdToSchema';
import { EditorStore, EditorStoreContext } from './editor/store';
import { TocHeading } from './editor/tools/Leading';
import { EditorUtils } from './editor/utils/editorUtils';
import { useSystemKeyboard } from './editor/utils/keyboard';

import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { Selection } from 'slate';
import { MEditor } from './editor/Editor';
import {
  InsertAutocomplete,
  InsertAutocompleteProps,
} from './editor/tools/InsertAutocomplete';
import { InsertLink } from './editor/tools/InsertLink';
import { ToolBar } from './editor/tools/ToolBar';
import { ToolsKeyType } from './editor/tools/ToolBar/BaseBar';
import { FloatBar } from './editor/tools/ToolBar/FloatBar';
import { codeReady } from './editor/utils/highlight';
import { ElementProps, Elements } from './el';
import './index.css';
import { useStyle } from './style';
export { EditorUtils, parserMdToSchema };

export * from './editor/elements';
export * from './editor/utils';
export * from './el';

export type CommentDataType = {
  selection: Selection;
  path: number[];
  anchorOffset: number;
  focusOffset: number;
  refContent: string;
  commentType: string;
  content: string;
  time: number;
  id: string | number;
  user?: {
    name: string;
    avatar: string;
  };
};

export type IEditor = {
  cid: string;
  root?: boolean;
  children?: IEditor[];
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
  get current(): IEditor | undefined;
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
  contentStyle?: React.CSSProperties;
  /**
   * 是否显示目录
   */
  toc?: boolean;
  /**
   * 配置工具栏
   */
  toolBar?: {
    min?: boolean;
    enable?: boolean;
    extra?: React.ReactNode[];
    hideTools?: ToolsKeyType[];
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
    props: ElementProps,
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

  /**
   * 是否开启报告模式,展示效果会发生变化
   * @default false
   */
  reportMode?: boolean;

  /**
   * 是否开启打字机模式
   */
  typewriter?: boolean;

  /**
   * 插入自动补全的能力
   */
  insertAutocompleteProps?: InsertAutocompleteProps;

  /**
   * 标题 placeholder
   */
  titlePlaceholderContent?: string;

  comment?: {
    enable?: boolean;
    onSubmit?: (id: string, comment: CommentDataType) => void;
    commentList?: CommentDataType[];
    deleteConfirmText?: string;
    editorRender?: (defaultDom: ReactNode) => ReactNode;
    previewRender?: (
      props: {
        comment: CommentDataType[];
      },
      defaultDom: ReactNode,
    ) => React.ReactElement;
    onDelete?: (id: string | number, item: CommentDataType) => void;
  };
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
    contentStyle,
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

  useEffect(() => {
    instance.store.setState((value) => {
      value.refreshHighlight = true;
    });
    codeReady().then(() => {
      instance.store.setState((value) => {
        value.refreshHighlight = false;
      });
    });
  }, []);

  useEffect(() => {
    instance.editorProps = props;
    instance.store.editorProps = props;
    instance.store.setState((state) => {
      state.editorProps = props;
      state.typewriter = !!props.typewriter;
    });
  }, [props]);

  const [mount, setMount] = useState(false);

  // 初始化快捷键
  useSystemKeyboard(instance.store, props);

  // 导入外部 hooks
  useImperativeHandle(editorRef, () => instance, [instance]);

  // 初始化 readonly
  useEffect(() => {
    instance.store.readonly = readonly || false;
    instance.store.editorProps = props;
  }, [readonly]);
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context.getPrefixCls(`md-editor`);
  const { wrapSSR, hashId } = useStyle(baseClassName);
  return wrapSSR(
    <EditorStoreContext.Provider value={instance.store}>
      <div
        className={classNames('markdown-editor', baseClassName, hashId, {
          [baseClassName + '-readonly']: readonly,
          [baseClassName + '-report']: props.reportMode,
        })}
        style={{
          width: width || '400px',
          minWidth: readonly ? '200px' : '400px',
          height: height || 'auto',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          ...style,
        }}
        onClick={() => {
          if (readonly) {
            return;
          }
          const latest = instance.store.editor?.children?.at(-1);
          if (latest) {
            if (latest.type !== 'paragraph') {
              instance.store.editor.insertNode(
                {
                  type: 'paragraph',
                  children: [{ text: '' }],
                },
                {
                  at: [instance.store.editor.children.length],
                },
              );
            }
          }
        }}
      >
        {!readonly && toolBar?.enable ? (
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              position: 'sticky',
              zIndex: 1000,
              top: 0,
            }}
          >
            <ToolBar
              hideTools={toolBar.hideTools}
              extra={toolBar.extra}
              min={toolBar.min}
            />
          </div>
        ) : readonly ? null : (
          <FloatBar />
        )}
        <div
          style={{
            padding: props.readonly ? '8px' : '24px 24px',
            overflow: 'auto',
            display: 'flex',
            height: !readonly && toolBar?.enable ? `calc(100% - 56px)` : '100%',
            position: 'relative',
            gap: 24,
            ...contentStyle,
          }}
          ref={(dom) => {
            instance.store.setState((state) => (state.container = dom));
            setMount(true);
          }}
          key={instance.id}
        >
          <MEditor
            prefixCls={baseClassName}
            note={instance.current!}
            {...rest}
            instance={instance}
          />
          {instance.current &&
          mount &&
          toc !== false &&
          instance.store?.container ? (
            <TocHeading note={instance.current} />
          ) : null}
        </div>
        {readonly ? (
          <></>
        ) : (
          <>
            <InsertLink />
            <InsertAutocomplete {...props.insertAutocompleteProps} />
          </>
        )}
      </div>
    </EditorStoreContext.Provider>,
  );
};
