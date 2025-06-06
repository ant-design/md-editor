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
import { I18nProvide } from '../i18n';
import { CommentList } from './editor/components/CommentList';
import { SlateMarkdownEditor } from './editor/Editor';
import { TagPopupProps } from './editor/elements/TagPopup';
import { parserMdToSchema } from './editor/parser/parserMdToSchema';
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
import { ToolBar } from './editor/tools/ToolBar';
import { ToolsKeyType } from './editor/tools/ToolBar/BaseBar';
import { FloatBar } from './editor/tools/ToolBar/FloatBar';
import { parserSlateNodeToMarkdown } from './editor/utils';
import { EditorUtils } from './editor/utils/editorUtils';
import {
  KeyboardTask,
  Methods,
  useSystemKeyboard,
} from './editor/utils/keyboard';
import { ElementProps, Elements, ListItemNode, SchemaNode } from './el';
import './index.css';
import { MarkdownEditorPlugin, PluginContext } from './plugin';
import { useStyle } from './style';
import { exportHtml } from './utils/exportHtml';
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

  apassify?: {
    enable?: boolean;
    render?: (props: ElementProps<SchemaNode>) => React.ReactNode;
  } & Record<string, any>;

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
 * MarkdownEditor
 * @param props
 */
export const BaseMarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const {
    initValue,
    width,
    toolBar = {},
    editorRef,
    toc = true,
    readonly,
    style,
    contentStyle,
    editorStyle,
    height,
    ...rest
  } = props;
  // 是否挂载
  const [editorMountStatus, setMountedStatus] = useState(false);
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
      withMarkdown(withReact(withHistory(createEditor()))),
      props.plugins || [],
    ),
  );

  const markdownContainerRef = useRef<HTMLDivElement | null>(null);

  // 错误捕获
  useEffect(() => {
    withErrorReporting(markdownEditorRef.current);
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
    console.log(
      parserSlateNodeToMarkdown([
        {
          type: 'head',
          level: 2,
          children: [
            {
              text: '1.公司分析',
            },
          ],
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.1 公司基本信息，生意模式，创始人背景和公司发展',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药控股集团有限公司（Sihuan Pharmaceutical Holdings Group Ltd.，股票代码：0460.HK）成立于 2001 年，总部位于香港湾仔，是一家专注于医美、肿瘤、代谢、糖尿病、心脑血管、现代中药及工业大麻等高增长治疗领域的医药企业。公司于 2010 年在香港联合交易所主板上市。',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              bold: true,
              text: '创始人背景',
            },
            {
              text: '：公司创始人车冯升医生拥有丰富的医药行业经验，包括超过 8 年的医生/神经科医师经验和 20 多年的制药销售、营销和管理经验。创业前，他曾担任海南康通制药有限公司总经理，并在其他制药企业担任过多个管理职位。',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              bold: true,
              text: '业务模式',
            },
            {
              text: '：四环医药是一家国际化医美和生物制药公司，以创新为驱动，拥有完整的研发、生产和销售平台，业务涵盖创新药、仿制药、原料药和医美产品。公司正从传统的仿制药业务向高增长的医美和创新药业务转型。',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              bold: true,
              text: '主要业务板块',
            },
            {
              text: '：',
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '创新药',
                    },
                    {
                      text: '：公司拥有丰富的创新药管线，主要集中在肿瘤、代谢疾病和抗感染药物领域。核心产品包括用于乳腺癌治疗的 CDK4/6 抑制剂和新一代抗生素 plazomicin 等。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '医美产品',
                    },
                    {
                      text: '：公司在医美市场有显著存在感，主要代理销售韩国肉毒毒素 Letybo®，并计划推出透明质酸和 PLLA 填充产品。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '仿制药',
                    },
                    {
                      text: '：开发高技术壁垒仿制药，多个产品已完成试验并进入审批程序。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '原料药和 CDMO',
                    },
                    {
                      text: '：从事原料药生产，并实施 CDMO（合同研发生产组织）服务战略。',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'paragraph',
          children: [
            {
              bold: true,
              text: '战略发展方向',
            },
            {
              text: '：',
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '加强创新研发，扩大创新药管线',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '扩大医美业务，致力成为中国领先的医美平台',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '国际化和多元化发展，通过国际合作和收购增强产品组合和市场覆盖',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '原料药和 CDMO 整合，实施"原料药+CDMO+制剂"一体化战略',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.2 过去 5 年的财务数据',
            },
          ],
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              bold: true,
              text: 'Balance Sheet (bn CNY)',
            },
          ],
        },
        {
          type: 'card',
          block: false,
          children: [
            {
              type: 'card-before',
              children: [
                {
                  text: '',
                },
              ],
            },
            {
              type: 'card-after',
              children: [
                {
                  text: '',
                },
              ],
            },
          ],
        },
        {
          type: 'card',
          block: false,
          children: [
            {
              type: 'card-before',
              children: [
                {
                  text: '',
                },
              ],
            },
            {
              alt: '',
              block: null,
              type: 'image',
              url: '/api/spaces/images/cf3db60e-0f02-4a78-bea3-d9005d1d7c26.png',
              mediaType: 'image',
              children: [
                {
                  text: '',
                },
              ],
            },
            {
              type: 'card-after',
              children: [
                {
                  text: '',
                },
              ],
            },
          ],
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.3 最近重大事件与新闻',
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '子公司上市计划变更',
                    },
                    {
                      text: '：2024 年 5 月，四环医药子公司轩竹生物撤回科创板上市申请，随后向港交所递交上市申请。这表明公司资本运作策略的调整。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '业绩预亏公告',
                    },
                    {
                      text: '：2025 年 2 月，公司发布业绩预亏公告，表示尽管医美业务增速超 50%，但仿制药业务受国家集采政策拖累持续下滑，叠加创新药研发高投入及子公司股权激励费用，导致整体业绩亏损。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '大手回购股份',
                    },
                    {
                      text: '：2024 年 10 月，公司公布大手回购股份计划，股价应声上涨。这表明公司开始更加关注股东回报和股价表现。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '创新药获批',
                    },
                    {
                      text: '：轩竹生物的创新药 Xuanyuening®（比罗西尼片剂）获得双适应症批准，为乳腺癌治疗带来创新突破，表明公司创新药研发取得实质性进展。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '医美业务升级',
                    },
                    {
                      text: '：公司医美业务"渼颜空间"成功推进 2.0 营销业务升级，加强研产销一体化，产品线已拥有 40 多种产品，覆盖爱美人士全生命周期。',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.4 好生意：定量指标、定性指标',
            },
          ],
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '定量指标分析',
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '收入增长',
                    },
                    {
                      text: '：2019-2024 年间，四环医药的收入表现波动较大。2020 年收入下降 14.4%，2021 年反弹增长 33.6%，主要由医美业务增长驱动，但 2022 年又出现明显下滑。总体来看，收入增长不稳定，但医美板块表现突出，增速超过 50%。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '利润率',
                    },
                    {
                      text: '：公司保持较高的毛利率水平，2019 年为 79.5%，2020 年为 77.7%，虽然近年有所下滑，但仍维持在 65%以上，显示产品有较强的定价能力。然而，净利润率波动较大，多年出现亏损，特别是 2019 年和 2022 年的大幅亏损，2022 年亏损包含大额非现金减值损失。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '现金流',
                    },
                    {
                      text: '：公司经营活动现金流总体为正，但波动较大。2019 年经营现金流强劲（15.9 亿元），但 2020 年显著下降至 2.7 亿元，2021 年有所恢复，2022 年再次下降至 0.5 亿元。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: 'ROE',
                    },
                    {
                      text: '：由于多年亏损，ROE 表现不稳定，难以进行有效评估。',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '负债率',
                    },
                    {
                      text: '：公司保持较低的负债水平，2020 年的负债权益比为 8.2%，2021 年为 12.6%，虽然近年有所上升，但仍处于健康范围，财务风险可控。',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '波特五力分析',
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '现有竞争者的竞争程度',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医药行业竞争激烈，特别是仿制药领域，价格压力大',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美领域在中国快速增长，竞争者增多但市场空间也在扩大',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '公司在医美和创新药领域有差异化优势，如肉毒毒素产品在医美市场建立了良好的品牌形象',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: true,
          start: 2,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '新进入者的威胁',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医药行业有较高的技术、资金和监管壁垒',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '创新药研发需要大量资金和时间，进入门槛高',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美产品需要严格的监管审批和营销网络，新进入者面临挑战',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: true,
          start: 3,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '替代品的威胁',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美产品面临替代风险，消费者可能选择不同类型的医美产品或传统美容方法',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '创新药在专利保护期内替代风险相对较低',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '仿制药面临同质化严重、替代风险高的问题',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: true,
          start: 4,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '供应商的议价能力',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '公司具有自己的原料药业务，对上游供应链有一定控制力',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '与韩国 Hugel 公司等合作，在医美产品供应方面存在一定依赖性',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: true,
          start: 5,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '购买者的议价能力',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '仿制药受带量采购政策影响，政府和医院议价能力强',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美产品主要面向消费者，价格敏感度相对较低，购买者议价能力较弱',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '创新药如获得医保覆盖，将面临较强的价格压力',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '好生意评分：3.3/5',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药正从传统仿制药向高增长的医美和创新药业务转型，转型方向明确但过程中面临挑战。优势在于医美业务高速增长、毛利率高、创新药管线丰富；劣势在于整体业绩波动大、仿制药业务持续下滑、多年亏损。综合来看，给予"好生意"3.3 分（满分 5 分）的评价。',
            },
          ],
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.5 好管理',
            },
          ],
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '管理层背景与经验',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药的管理团队由具有丰富行业经验的专业人士组成：',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '创始人车冯升医生拥有 8 年医生/神经科医师经验和 20 多年制药销售、营销和管理经验',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'CFO Choi Yiau Chong 先生自 2006 年加入公司，拥有财务和会计经验',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '执行董事陈艳玲女士自 2006 年加入公司，负责董事会相关事务和投资者关系',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '管理团队稳定，核心成员在公司任职时间长，显示公司内部管理相对稳定。公司曾获得"最佳 IR 团队奖"等奖项，表明与投资者沟通透明有效。',
            },
          ],
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '股东回报与资本配置',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药在股东回报方面表现一般：',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '缺乏稳定的分红记录，文件中未提及明确的股息政策',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '2024 年 10 月公布了大手回购股份计划，表明开始关注股东回报，但这可能是近期才开始的政策',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '公司将大量资金投入研发，2021 年研发支出达 8.68 亿元，占收入的 26.4%，显示注重长期发展',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '资本结构与战略执行',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药的资本结构健康，负债率较低：',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '截至 2021 年底，现金及理财产品总额约 57.92 亿元，净现金约 47.47 亿元',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '2021 年负债权益比仅为 12.6%，财务风险可控',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '公司通过战略收购扩展业务，如收购百奥药业加强创新药研发能力',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '战略执行存在一定波动，如子公司轩竹生物上市计划从科创板转向港交所',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '好管理评分：3/5',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药的管理团队稳定且有丰富行业经验，战略转型方向明确，注重长期发展，财务风险可控。但在积极回馈股东方面存在不足，缺乏稳定的分红记录，战略执行中也存在一定波动。综合来看，给予"好管理"3 分（满分 5 分）的评价。',
            },
          ],
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.6 好价格',
            },
          ],
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '市场估值',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '根据获取的实时股票数据：',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '当前股价：1.03 港元',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '市值：约 97.66 亿港元',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '52 周价格区间：0.495-1.12 港元，目前处于区间上半部分',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '市净率：约 2.24 倍',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '市销率：约 5.14 倍',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '由于公司近期出现亏损，传统市盈率不适用',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '收益率分析',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '由于近期亏损，当前收益率为负或不适用',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '不满足收益率高于市场基准利率（约 4.7%）的要求',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '对于处于转型期的公司，需要考虑未来盈利能力恢复后的潜在收益率',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '成长性与估值匹配度',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美和创新药领域属于高增长赛道，公司医美业务增速超过 50%',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '高市销率 (5.14 倍 ) 反映了市场对公司未来增长的较高期望',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '考虑到公司的财务波动性和盈利不稳定，当前估值要求未来几年业绩显著改善',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '安全边际分析',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '考虑到公司处于业务转型期，财务波动较大，多年出现亏损',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '当前价格缺乏足够的安全边际，特别是对于价值投资者',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '如果转型不顺利或医美业务增长放缓，可能面临估值下调风险',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '好价格评分：2.3/5',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药的估值相对较高，尤其考虑到其近期的亏损和不稳定的财务表现。虽然公司有良好的战略方向和医美业务高增长，但当前价格缺乏足够的安全边际，更多反映了市场对未来的乐观预期而非当前的实际业绩。综合来看，给予"好价格"2.3 分（满分 5 分）的评价。',
            },
          ],
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.7 批判性思考与反驳',
            },
          ],
        },
        {
          type: 'list',
          order: true,
          start: 1,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '医美业务增长的可持续性存疑',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美行业竞争激烈，增速能否持续保持在 50%以上存在不确定性',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美市场受宏观经济影响大，消费者支出削减可能影响增长',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '反驳',
                    },
                    {
                      text: '：中国医美市场仍处于快速发展阶段，渗透率远低于韩国、美国等成熟市场，增长空间巨大。公司布局全面的产品线可以满足不同消费者需求，抵御单一产品风险。',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: true,
          start: 2,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '创新药研发的不确定性',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '药物研发具有高失败率，投入巨大但商业化成功率低',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '即使研发成功，能否获得市场认可也存在风险',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '反驳',
                    },
                    {
                      text: '：公司已有创新药获批（如比罗西尼片剂），证明研发能力。多元化的研发管线分散了单一产品失败的风险。',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: true,
          start: 3,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '财务状况不稳定',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '多年亏损，表明商业模式可能存在根本性问题',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '仿制药业务持续下滑，对整体业绩拖累明显',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '反驳',
                    },
                    {
                      text: '：亏损主要来自高研发投入和非现金减值损失，而非核心业务经营问题。医美业务增长强劲，逐渐能够弥补仿制药下滑的影响。',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: true,
          start: 4,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '管理层资本配置决策',
                    },
                    {
                      text: '：',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '高研发投入能否带来相应回报存疑',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '回购股份可能是短期行为，而非长期股东回报政策',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '反驳',
                    },
                    {
                      text: '：高研发投入是制药企业转型的必然选择，长期来看有利于建立竞争壁垒。回购计划表明管理层开始重视股东回报，是良好的开始。',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 3,
          children: [
            {
              text: '1.8 综合评估',
            },
          ],
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '综合评分',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '按照 40%、30%、30%的权重计算：',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '好生意（3.3 分）× 40% = 1.32 分',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '好管理（3.0 分）× 30% = 0.90 分',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '好价格（2.3 分）× 30% = 0.69 分',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '综合得分：2.91 分（满分 5 分）',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '关注要点',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '四环医药正处于从传统仿制药向创新药和医美转型的关键阶段',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '医美业务表现亮眼，增速超过 50%，未来有望成为主要增长驱动力',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '创新药研发投入大但进展良好，长期潜力可观',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: '财务表现波动较大，短期内业绩可能继续承压',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'head',
          level: 4,
          children: [
            {
              text: '风险提示',
            },
          ],
        },
        {
          type: 'list',
          order: false,
          start: null,
          children: [
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '政策风险',
                    },
                    {
                      text: '：医药政策变化，尤其是集采扩围可能进一步压缩仿制药利润',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '研发风险',
                    },
                    {
                      text: '：创新药研发失败可能导致巨额投入无法收回',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '市场风险',
                    },
                    {
                      text: '：医美市场竞争加剧，增长可能放缓',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list-item',
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      text: '财务风险',
                    },
                    {
                      text: '：短期内可能继续亏损，现金消耗加大',
                    },
                  ],
                },
              ],
            },
          ],
          task: false,
        },
        {
          type: 'paragraph',
          children: [
            {
              text: '四环医药展现出转型中的医药企业特征，具有中等偏上的投资价值。公司在医美领域的快速增长和创新药的研发进展是主要亮点，但财务波动性和估值水平也需要投资者谨慎对待。对于能够承受短期波动、着眼于公司长期转型成功的投资者，四环医药可作为投资组合中具有成长潜力的配置选择。',
            },
          ],
        },
      ]),
    );

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
  useSystemKeyboard(keyTask$, instance.store, props);

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
  const baseClassName = context.getPrefixCls(`md-editor`);
  const { wrapSSR, hashId } = useStyle(baseClassName);
  // --- css style end ---

  // 评论列表
  const [showCommentList, setShowComment] = useState<CommentDataType[]>([]);

  // schema 数据
  const [schema, setSchema] = useState<Elements[]>(initSchemaValue);
  const [openInsertCompletion, setOpenInsertCompletion] = useState(false);
  const [openLinkPanel, setOpenLinkPanel] = useState(false);
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
            openLinkPanel,
            setOpenLinkPanel,
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
              'markdown-editor',
              baseClassName,
              hashId,
              props.className,
              {
                [baseClassName + '-readonly']: readonly,
                [baseClassName + '-edit']: !readonly,
                [baseClassName + '-report']: props.reportMode,
                [baseClassName + '-slide']: props.slideMode,
              },
            )}
            style={{
              width: width || '400px',
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
                  position: 'sticky',
                  zIndex: 99,
                  top: 0,
                }}
                className={classNames('md-editor-toolbar-container', {
                  [baseClassName + '-min-toolbar']: toolBar.min,
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
                ...contentStyle,
              }}
              ref={(dom) => {
                markdownContainerRef.current = dom;
                setMountedStatus(true);
              }}
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
                  <FloatBar readonly />
                ) : null
              ) : toolBar?.enable || props.floatBar?.enable === false ? null : (
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
                  <TocHeading schema={schema} anchorProps={props.anchorProps} />
                )
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
