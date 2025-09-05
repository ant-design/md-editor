import { Ace } from 'ace-builds';
import { AnchorProps, ConfigProvider, ImageProps } from 'antd';
import classNames from 'classnames';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { BaseEditor, createEditor, Editor, Selection } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { BubbleProps } from '../Bubble';
import { I18nProvide } from '../i18n';
import { CommentList } from './editor/components/CommentList';
import { SlateMarkdownEditor } from './editor/Editor';
import { TagPopupProps } from './editor/elements/TagPopup';
import { parserMdToSchema } from './editor/parser/parserMdToSchema';
import { parserSlateNodeToMarkdown } from './editor/parser/parserSlateNodeToMarkdown';
import { withMarkdown } from './editor/plugins';
import { withErrorReporting } from './editor/plugins/catchError';
import { ReactEditor, RenderLeafProps, withReact } from './editor/slate-react';
import { EditorStore, EditorStoreContext } from './editor/store';
import {
  InsertAutocomplete,
  InsertAutocompleteProps,
} from './editor/tools/InsertAutocomplete';
import { InsertLink } from './editor/tools/InsertLink';
import { TocHeading } from './editor/tools/Leading';
import { ToolsKeyType } from './editor/tools/ToolBar/BaseBar';
import { FloatBar } from './editor/tools/ToolBar/FloatBar';
import ToolBar from './editor/tools/ToolBar/ToolBar';
import { EditorUtils } from './editor/utils/editorUtils';
import {
  KeyboardTask,
  Methods,
  useSystemKeyboard,
} from './editor/utils/keyboard';
import { ElementProps, Elements, ListItemNode, SchemaNode } from './el';
import { MarkdownEditorPlugin, PluginContext } from './plugin';
import { useStyle } from './style';
import { exportHtml } from './utils/exportHtml';
import { withTable } from './utils/slate-table/with-table';
export { EditorUtils, parserMdToSchema };

export * from './editor/elements';
export * from './editor/utils';
export * from './el';

/**
 * @typedef CommentDataType
 * @description 表示评论数据的类型。
 *
 * @property {Selection} selection - 用户选择的文本范围。
 * @property {number[]} path - 文档中选择路径的数组。
 * @property {number} anchorOffset - 选择范围的起始偏移量。
 * @property {number} focusOffset - 选择范围的结束偏移量。
 * @property {string} refContent - 参考内容。
 * @property {string} commentType - 评论的类型。
 * @property {string} content - 评论的内容。
 * @property {number} time - 评论的时间戳。
 * @property {string | number} id - 评论的唯一标识符。
 * @property {Object} [user] - 用户信息（可选）。
 * @property {string} user.name - 用户名。
 * @property {string} [user.avatar] - 用户头像（可选）。
 */
export type CommentDataType = {
  selection: Selection;
  path: number[];
  updateTime?: number;
  anchorOffset: number;
  focusOffset: number;
  refContent: string;
  commentType: string;
  content: string;
  time: number | string;
  id: string | number;
  user?: {
    name: string;
    avatar?: string;
  };
};

/**
 * 编辑器接口定义
 * @interface IEditor
 *
 * @property {IEditor[]} [children] - 子编辑器列表
 * @property {boolean} [expand] - 是否展开
 * @property {any[]} [schema] - 编辑器模式配置
 * @property {any} [history] - 编辑器历史记录
 */
export type IEditor = {
  children?: IEditor[];
  expand?: boolean;
};

/**
 * MarkdownEditor 实例
 */
export interface MarkdownEditorInstance {
  range?: Range;
  store: EditorStore;
  markdownContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  markdownEditorRef: React.MutableRefObject<
    BaseEditor & ReactEditor & HistoryEditor
  >;
  exportHtml: (filename?: string) => void;
}

/**
 * MarkdownEditor 的 props
 * @param props
 */
export type MarkdownEditorProps = {
  className?: string;
  width?: string | number;
  height?: string | number;

  /**
   * 代码高亮配置
   */
  codeProps?: {
    Languages?: string[];
    hideToolBar?: boolean;
  } & Partial<Ace.EditorOptions>;

  anchorProps?: AnchorProps;
  /**
   * 配置图片数据
   */
  image?: {
    upload?: (file: File[] | string[]) => Promise<string[] | string>;
    render?: (
      props: ImageProps,
      defaultDom: React.ReactNode,
    ) => React.ReactNode;
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
  editorStyle?: React.CSSProperties;
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
  floatBar?: {
    enable?: boolean;
  };
  drag?: {
    enable: boolean;
  };

  /**
   * markdown 编辑器的根容器，用于外部获取实例
   * @default document.body
   */
  rootContainer?: React.MutableRefObject<HTMLDivElement | undefined>;

  fncProps?: {
    render: (
      props: { children: string; identifier?: string },
      defaultDom: React.ReactNode,
    ) => React.ReactNode;
    onFootnoteDefinitionChange?: (
      value: {
        id: any;
        placeholder: any;
        origin_text: any;
        url: any;
        origin_url: any;
      }[],
    ) => void;
    onOriginUrlClick?: (url?: string) => void;
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

  /**
   * 自定义渲染叶子节点
   * @description 用于自定义 MLeaf 的渲染，可以控制文本节点的样式和行为
   * @param props - 叶子节点渲染属性，包含 leaf、children 等信息
   * @param defaultDom - 默认的叶子节点渲染结果
   * @returns 自定义的叶子节点渲染结果
   * @example
   * ```tsx
   * <MarkdownEditor
   *   leafRender={(props, defaultDom) => {
   *     if (props.leaf.customStyle) {
   *       return <span style={{ color: 'red' }}>{props.children}</span>;
   *     }
   *     return defaultDom;
   *   }}
   * />
   * ```
   */
  leafRender?: (
    props: RenderLeafProps & {
      hashId: string;
      comment: MarkdownEditorProps['comment'];
      fncProps: MarkdownEditorProps['fncProps'];
      tagInputProps: MarkdownEditorProps['tagInputProps'];
    },
    defaultDom: React.ReactNode,
  ) => React.ReactElement;

  apaasify?: {
    enable?: boolean;
    render?: (
      props: ElementProps<SchemaNode>,
      bubble?: BubbleProps,
    ) => React.ReactNode;
  } & Record<string, any>;

  /**
   * @deprecated 请使用 apaasify 代替
   */
  apassify?: any;

  initSchemaValue?: Elements[];
  /**
   * 内容变化回调
   * @param value:string
   * @param schema:Elements[]
   * @returns
   */
  onChange?: (value: string, schema: Elements[]) => void;

  /**
   * 焦点事件回调
   * @description 当编辑器失去焦点时触发
   * @param value
   * @param schema
   * @returns
   */
  onBlur?: (
    value: string,
    schema: Elements[],
    e: React.MouseEvent<HTMLDivElement, Element>,
  ) => void;
  /**
   * 焦点事件回调
   * @description 当编辑器获得焦点时触发
   * @param value
   * @param schema
   * @returns
   */
  onFocus?: (
    value: string,
    schema: Elements[],
    e: React.FocusEvent<HTMLDivElement, Element>,
  ) => void;

  /**
   * 是否开启报告模式,展示效果会发生变化
   * @default false
   */
  reportMode?: boolean;

  id?: string | number;

  /**
   * ppt 模式
   * @default false
   */
  slideMode?: boolean;
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

  /**
   * 评论配置
   * @param enable 是否开启评论功能
   * @param onSubmit 提交评论的回调
   * @param commentList 评论列表
   * @param deleteConfirmText 删除评论的确认文本
   * @param loadMentions 加载评论的回调
   * @param mentionsPlaceholder 提及的 placeholder
   * @param editorRender 编辑器模式渲染
   * @param previewRender 预览渲染
   * @param onDelete 删除评论的回调
   * @param listItemRender 评论列表渲染
   * @returns
   */
  comment?: {
    enable?: boolean;
    onSubmit?: (id: string, comment: CommentDataType) => void;
    commentList?: CommentDataType[];
    deleteConfirmText?: string;
    loadMentions?: (
      keyword: string,
    ) => Promise<{ name: string; avatar?: string }[]>;
    mentionsPlaceholder?: string;
    editorRender?: (defaultDom: ReactNode) => ReactNode;
    previewRender?: (
      props: {
        comment: CommentDataType[];
      },
      defaultDom: ReactNode,
    ) => React.ReactElement;
    onDelete?: (id: string | number, item: CommentDataType) => void;
    listItemRender?: (
      doms: {
        checkbox: React.ReactNode;
        mentionsUser: React.ReactNode;
        children: React.ReactNode;
      },
      props: ElementProps<ListItemNode>,
    ) => React.ReactNode;
    onEdit?: (id: string | number, item: CommentDataType) => void;
    onClick?: (id: string | number, item: CommentDataType) => void;
  };

  /**
   * 表格配置
   * @param minRows 最小行数
   * @param minColumn 最小列数
   * @param excelMode 是否启用Excel模式
   * @param previewTitle 预览标题
   * @param actions 操作配置
   */
  tableConfig?: {
    minRows?: number;
    minColumn?: number;
    excelMode?: boolean;
    previewTitle?: ReactNode;
    actions?: {
      download?: ['csv'];
      fullScreen?: 'modal';
      copy?: 'md' | 'html' | 'csv';
    };
  };

  /**
   * Markdown配置
   * @param enable 是否启用Markdown
   * @param matchInputToNode 是否匹配输入到节点
   */
  markdown?: {
    enable: boolean;
    matchInputToNode?: boolean;
  };

  /**
   * 编辑器插件配置
   */
  plugins?: MarkdownEditorPlugin[];

  /**
   * 文本区域配置
   * @param enable 是否启用文本区域
   * @param placeholder 占位符文本
   * @param triggerSendKey 触发发送的按键
   */
  textAreaProps?: {
    enable: boolean;
    placeholder?: string;
    triggerSendKey?: 'Enter' | 'Mod+Enter';
  };

  /**
   * 标签输入配置
   * @param enable 是否启用标签输入
   */
  tagInputProps?: {
    enable: boolean;
  } & TagPopupProps;

  /**
   * 紧凑模式
   * @default false
   */
  compact?: boolean;

  /**
   * 粘贴配置
   * @description 配置粘贴到编辑器时支持的内容类型
   * @example
   * ```tsx
   * <BaseMarkdownEditor
   *   pasteConfig={{
   *     enabled: true,
   *     allowedTypes: ['text/plain', 'text/html', 'text/markdown']
   *   }}
   * />
   * ```
   */
  pasteConfig?: {
    /**
     * 是否启用粘贴功能
     * @default true
     */
    enabled?: boolean;
    /**
     * 允许的粘贴内容类型
     * @default ['application/x-slate-md-fragment', 'text/html', 'Files', 'text/markdown', 'text/plain']
     */
    allowedTypes?: Array<
      | 'application/x-slate-md-fragment'
      | 'text/html'
      | 'Files'
      | 'text/markdown'
      | 'text/plain'
    >;
  };
};

// 组合器函数
const composeEditors = (editor: Editor, plugins: MarkdownEditorPlugin[]) => {
  if (plugins.length > 1) {
    return plugins.reduce((acc, plugin) => {
      return plugin.withEditor ? plugin.withEditor(acc) : acc;
    }, editor);
  }
  return editor;
};

/**
 * BaseMarkdownEditor 组件 - 基础Markdown编辑器组件
 *
 * 该组件是Markdown编辑器的核心实现，基于Slate.js构建，提供完整的Markdown编辑功能。
 * 支持插件系统、工具栏、目录、只读模式等功能，是MarkdownEditor的基础组件。
 *
 * @component
 * @description 基础Markdown编辑器组件，提供核心的Markdown编辑功能
 * @param {MarkdownEditorProps} props - 组件属性
 * @param {string} [props.initValue] - 初始值
 * @param {(value: string) => void} [props.onChange] - 内容变化回调
 * @param {React.RefObject} [props.editorRef] - 编辑器引用
 * @param {boolean} [props.readonly] - 是否只读模式
 * @param {Plugin[]} [props.plugins] - 插件列表
 * @param {ToolBarConfig} [props.toolBar] - 工具栏配置
 * @param {boolean} [props.toc] - 是否显示目录
 * @param {string|number} [props.width] - 编辑器宽度
 * @param {string|number} [props.height] - 编辑器高度
 * @param {React.CSSProperties} [props.style] - 容器样式
 * @param {React.CSSProperties} [props.contentStyle] - 内容区域样式
 * @param {React.CSSProperties} [props.editorStyle] - 编辑器样式
 * @param {MarkdownRenderConfig} [props.markdownRenderConfig] - Markdown渲染配置
 * @param {Function} [props.onBlur] - 失焦回调
 * @param {Function} [props.onFocus] - 聚焦回调
 *
 * @example
 * ```tsx
 * <BaseMarkdownEditor
 *   initValue="# Hello World"
 *   onChange={(value) => console.log('内容变化:', value)}
 *   editorRef={editorRef}
 *   readonly={false}
 *   toc={true}
 *   toolBar={{ show: true }}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的基础Markdown编辑器组件
 *
 * @remarks
 * - 基于Slate.js构建
 * - 支持插件系统扩展
 * - 提供完整的工具栏功能
 * - 支持目录生成
 * - 支持只读模式
 * - 提供焦点管理
 * - 支持错误捕获
 * - 支持键盘事件处理
 * - 提供Markdown解析和渲染
 */
export const BaseMarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const {
    initValue,
    width,
    toolBar = {},
    editorRef,
    toc = false,
    readonly,
    style,
    contentStyle = {
      height: '100%',
    },
    editorStyle,
    height,
    ...rest
  } = props;
  // 是否挂载
  const [editorMountStatus, setMountedStatus] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  // 键盘事件
  const keyTask$ = useMemo(
    () =>
      new Subject<{
        key: Methods<KeyboardTask>;
        args?: any[];
      }>(),
    [],
  );

  // markdown 编辑器实例
  const markdownEditorRef = useRef(
    composeEditors(
      withMarkdown(
        withTable(withReact(withHistory(createEditor())), {
          blocks: {
            table: 'table',
            thead: 'table-head',
            tfoot: 'table-footer',
            tr: 'table-row',
            th: 'header-cell',
            td: 'table-cell',
            content: 'paragraph',
          },
          withDelete: true,
          withFragments: true,
          withInsertText: true,
          withNormalization: true,
          withSelection: true,
          withSelectionAdjustment: true,
        }),
      ),
      props.plugins || [],
    ),
  );

  const markdownContainerRef = useRef<HTMLDivElement | null>(null);

  // 错误捕获
  useEffect(() => {
    withErrorReporting(markdownEditorRef.current);
  }, []);

  // 处理点击外部区域
  useEffect(() => {
    if (!rest?.onBlur) return;
    if (readonly) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditorFocused &&
        markdownContainerRef.current &&
        !markdownContainerRef.current.contains(event.target as Node)
      ) {
        EditorUtils.blur(markdownEditorRef.current);
        rest?.onBlur?.(
          parserSlateNodeToMarkdown(
            markdownEditorRef.current?.children || [],
            '',
            [],
            props.plugins,
          ),
          markdownEditorRef.current?.children,
          event as any,
        );
        setIsEditorFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [readonly, rest?.onBlur, props.plugins, isEditorFocused]);

  // 监听编辑器焦点
  useEffect(() => {
    const handleEditorFocus = () => {
      if (
        markdownContainerRef.current?.contains(document.activeElement) ||
        markdownContainerRef.current === document.activeElement
      ) {
        setIsEditorFocused(true);
      }
    };

    markdownContainerRef.current?.addEventListener(
      'focusin',
      handleEditorFocus,
    );
    return () => {
      markdownContainerRef.current?.removeEventListener(
        'focusin',
        handleEditorFocus,
      );
    };
  }, []);

  const store = useMemo(
    () => new EditorStore(markdownEditorRef, props.plugins),
    [props.plugins],
  );

  /**
   * 初始化 schema
   */
  const initSchemaValue = useMemo(() => {
    let list = parserMdToSchema(initValue!, props.plugins)?.schema;
    if (!props.readonly) {
      list.push(EditorUtils.p);
    }
    const schema =
      props.initSchemaValue ||
      (initValue ? list : JSON.parse(JSON.stringify([EditorUtils.p])));

    return schema?.filter((item: any) => {
      if (item.type === 'p' && item.children.length === 0) {
        return false;
      }
      if (item.type === 'list' && item.children.length === 0) {
        return false;
      }
      if (item.type === 'listItem' && item.children.length === 0) {
        return false;
      }
      return true;
    });
  }, []);

  // 初始化实例
  const instance = useMemo(() => {
    return {
      store,
      markdownContainerRef,
      markdownEditorRef,
      exportHtml: (filename?: string) => {
        const htmlContent = store.getHtmlContent();
        exportHtml(htmlContent, filename);
      },
    } as MarkdownEditorInstance;
  }, []);

  // 初始化键盘事件
  useSystemKeyboard(keyTask$, instance.store, props, markdownContainerRef);

  // 导入外部 hooks
  useImperativeHandle(editorRef, () => {
    return {
      store: instance.store,
      markdownContainerRef,
      markdownEditorRef,
      exportHtml: instance.exportHtml,
    };
  }, [instance, editorMountStatus]);

  const context = useContext(ConfigProvider.ConfigContext);
  // ---- css style ----
  const baseClassName = context?.getPrefixCls(`md-editor`);
  const { wrapSSR, hashId } = useStyle(baseClassName);
  // --- css style end ---

  // 评论列表
  const [showCommentList, setShowComment] = useState<CommentDataType[]>([]);

  // schema 数据
  const [schema, setSchema] = useState<Elements[]>(initSchemaValue);
  const [openInsertCompletion, setOpenInsertCompletion] = useState(false);
  const [refreshFloatBar, setRefreshFloatBar] = useState(false);

  const insertCompletionText$ = useMemo(() => new Subject<string>(), []);
  const openInsertLink$ = useMemo(() => new Subject<Selection>(), []);

  const [domRect, setDomRect] = useState<DOMRect | null>(null);

  return wrapSSR(
    <I18nProvide>
      <PluginContext.Provider value={props.plugins || []}>
        <EditorStoreContext.Provider
          value={{
            keyTask$,
            insertCompletionText$,
            openInsertLink$,
            openInsertCompletion,
            setOpenInsertCompletion,
            setRefreshFloatBar,
            refreshFloatBar,
            rootContainer: props.rootContainer,
            setShowComment,
            store: instance.store,
            domRect,
            setDomRect,
            typewriter: props.typewriter ?? false,
            readonly: props.readonly ?? false,
            editorProps: props || {},
            markdownEditorRef,
            markdownContainerRef,
          }}
        >
          <div
            id={props.id ? String(props.id) || undefined : undefined}
            className={classNames(
              baseClassName,
              'markdown-editor',
              hashId,
              props.className,
              {
                [`${baseClassName}-readonly`]: readonly,
                [`${baseClassName}-edit`]: !readonly,
                [`${baseClassName}-report`]: props.reportMode,
                [`${baseClassName}-slide`]: props.slideMode,
              },
            )}
            style={{
              width: width || '100%',
              height: height || 'auto',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%',
              ...style,
            }}
          >
            {!readonly && toolBar?.enable === true ? (
              <div
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  position: 'sticky',
                  zIndex: 99,
                  top: 0,
                }}
                className={classNames(`${baseClassName}-toolbar-container`, {
                  [`${baseClassName}-min-toolbar`]: toolBar.min,
                })}
              >
                <ToolBar
                  hideTools={toolBar.hideTools}
                  extra={toolBar.extra}
                  min={toolBar.min}
                />
              </div>
            ) : readonly ? null : null}
            <div
              style={{
                padding: '12px 20px',
                overflow: 'auto',
                display: 'flex',
                height:
                  !readonly && toolBar?.enable ? `calc(100% - 56px)` : '100%',
                position: 'relative',
                gap: 24,
                outline: 'none',
                ...contentStyle,
              }}
              ref={(dom) => {
                markdownContainerRef.current = dom;
                setMountedStatus(true);
              }}
              tabIndex={-1}
            >
              <SlateMarkdownEditor
                prefixCls={baseClassName}
                {...rest}
                onChange={(value, schema) => {
                  setSchema(schema);
                  rest?.onChange?.(value, schema);
                }}
                initSchemaValue={initSchemaValue}
                style={editorStyle}
                instance={instance}
              />
              {readonly ? (
                props.reportMode ? (
                  props.floatBar?.enable === false ? null : (
                    <FloatBar readonly />
                  )
                ) : null
              ) : props.floatBar?.enable !== true ? null : (
                <FloatBar readonly={false} />
              )}
              {editorMountStatus &&
              toc !== false &&
              markdownContainerRef.current ? (
                showCommentList?.length ? (
                  <CommentList
                    commentList={showCommentList}
                    comment={props.comment}
                  />
                ) : (
                  <TocHeading
                    schema={schema}
                    anchorProps={props.anchorProps}
                    useCustomContainer={true}
                  />
                )
              ) : showCommentList?.length ? (
                <CommentList
                  pure
                  commentList={showCommentList}
                  comment={props.comment}
                />
              ) : null}
            </div>
            {readonly || props?.textAreaProps?.enable ? null : (
              <div
                className={`${baseClassName}-focus`}
                style={{
                  height: 64,
                }}
              />
            )}
            {readonly ? (
              <></>
            ) : (
              <>
                <InsertLink />
                <InsertAutocomplete
                  {...(props?.insertAutocompleteProps || {})}
                />
              </>
            )}
          </div>
        </EditorStoreContext.Provider>
      </PluginContext.Provider>
    </I18nProvide>,
  );
};
