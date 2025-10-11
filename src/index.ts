export type { RenderElementProps } from 'slate-react';
export * from './AgentRunBar';
export * from './Bubble';
export * from './Bubble/List';
export type {
  BubbleMetaData,
  BubbleProps,
  MessageBubbleData,
} from './Bubble/type';
export * from './components/Button';
export * from './components/ChatFlowContainer';
export * from './components/Loading';
export { Loading } from './components/Loading';
export * from './components/SuggestionList';
export * from './components/VisualList';
export * from './hooks/useAutoScroll';
export { useLanguage } from './hooks/useLanguage';
export * from './hooks/useRefFunction';
export * from './hooks/useStyle';
export * from './hooks/useThrottleFn';
export * from './i18n';
export * from './MarkdownEditor';
export * from './MarkdownEditor/editor/components/index';
export { SlateTable as ReadonlyTable } from './MarkdownEditor/editor/elements/Table/Table';
export { TablePropsContext } from './MarkdownEditor/editor/elements/Table/TableContext';
export { default as partialParse } from './MarkdownEditor/editor/parser/json-parse';
export { parserMarkdownToSlateNode } from './MarkdownEditor/editor/parser/parserMarkdownToSlateNode';
export {
  parserSlateNodeToMarkdown,
  parserSlateNodeToMarkdown as schemaToMarkdown,
} from './MarkdownEditor/editor/parser/parserSlateNodeToMarkdown';
export { useEditorStore } from './MarkdownEditor/editor/store';
export * from './MarkdownEditor/editor/utils';
export * from './MarkdownEditor/editor/utils/docx/index';
export { markdownToHtmlSync } from './MarkdownEditor/editor/utils/markdownToHtml';
export { default as Workspace } from './Workspace';
// HTML to Markdown conversion utilities
export * from './AnswerAlert';
export * from './BackTo';
export * from './History';
export {
  batchHtmlToMarkdown,
  cleanHtml,
  extractTextFromHtml,
  htmlToMarkdown,
  isHtml,
  type HtmlToMarkdownOptions,
} from './MarkdownEditor/editor/utils/htmlToMarkdown';
export * from './MarkdownEditor/el';
export { useSelStatus } from './MarkdownEditor/hooks/editor';
export * from './MarkdownEditor/plugin';
export * from './MarkdownInputField/AttachmentButton';
export { ActionItemBox } from './MarkdownInputField/BeforeToolContainer/ActionItemBox';
export { ActionItemContainer } from './MarkdownInputField/BeforeToolContainer/BeforeToolContainer';
export * from './MarkdownInputField/FileMapView';
export * from './MarkdownInputField/MarkdownInputField';
export { MarkdownFormatter } from './plugins/formatter';
export * from './schema';
export * from './TaskList';
export * from './ThoughtChainList';
export * from './ToolUseBar';
export * from './Workspace';

// Robot 组件
export * from './components/Robot';
export { default as Robot } from './components/Robot';

// Quote 组件导出
export { default as Quote } from './Quote';

// 新增：图表插件对外导出
export * from './plugins/chart';

// ===== 类型导出 =====

// MarkdownEditor 相关类型
export type {
  CommentDataType,
  IEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from './MarkdownEditor/types';

// Bubble 相关类型
export type {
  BubbleItemStyleProps,
  BubbleRenderConfig,
  BubbleStyleProps,
  CustomConfig,
  WithFalse,
} from './Bubble/type';

// Bubble 额外类型
export type { CustomConfig as BubbleCustomConfig } from './Bubble/MessagesContent/types';
export type {
  BubbleExtraProps,
  MessageBubbleData as MessageBubbleDataExtra,
  SimpleBubbleProps,
} from './Bubble/types/BubbleExtra';
export type { DocInfoListProps } from './Bubble/types/DocInfo';

// ThoughtChainList 相关类型
export type {
  Chunk,
  DocMeta,
  ThoughtChainListProps,
  WhiteBoxProcessInterface,
} from './ThoughtChainList/types';

// History 相关类型
export type {
  ActionsBoxProps,
  HistoryActionsBoxProps,
  HistoryProps,
} from './History/types';
export type {
  HistoryChatType,
  HistoryDataType,
} from './History/types/HistoryData';
export type { HistoryListConfig } from './History/types/HistoryList';

// Schema 相关类型
export type {
  ArrayProperty,
  BaseProperty,
  ComponentConfig,
  ComponentProperties,
  DataSourceConfig,
  LowCodeSchema,
  NumberProperty,
  ObjectProperty,
  PageConfig,
  PreviewSettings,
  SchemaProperty,
  StringProperty,
  ThemeConfig,
} from './schema/types';

// Workspace 相关类型
export {
  FILE_TYPES,
  FileCategory,
  getFileCategory,
  getFileType,
  getMimeType,
} from './Workspace/types';
export type {
  BaseChildProps,
  BaseNode,
  BrowserProps,
  CustomProps,
  FileActionRef,
  FileNode,
  FileProps,
  FileType,
  FileTypeDefinition,
  GroupNode,
  RealtimeProps,
  TabConfiguration,
  TabItem,
  TaskProps,
  WorkspaceProps,
} from './Workspace/types';

// AttachmentButton 相关类型
export type { AttachmentFile } from './MarkdownInputField/AttachmentButton/types';

// ProxySandbox 相关类型
export type {
  SandboxConfig,
  SandboxResult,
} from './utils/proxySandbox/ProxySandbox';
export type {
  ExecutionContext,
  MonitoringConfig,
  PermissionConfig,
  ResourceLimits,
  SecurityContextConfig,
} from './utils/proxySandbox/SecurityContextManager';
export { SandboxError, SandboxErrorType } from './utils/proxySandbox/types';
export type {
  CodeExecutionContext,
  ExtendedSandboxConfig,
  GlobalSandboxSettings,
  ICodeValidator,
  ISandboxManager,
  MonitoringEvent,
  MonitoringEventListener,
  PerformanceConfig,
  ResourceUsageStats,
  SandboxConfigType,
  SandboxFactoryOptions,
  SandboxInstanceState,
  SecurityPolicy,
} from './utils/proxySandbox/types';

// ProxySandbox 额外枚举类型
export {
  ExecutionStatus,
  MonitoringEventType,
  PermissionLevel,
} from './utils/proxySandbox/types';

// 代理沙箱相关类型别名
export type { SandboxInstance, SecurityManager } from './utils/proxySandbox';

// 代码插件相关类型
export type {
  CodeToolbarProps,
  LanguageSelectorProps,
} from './plugins/code/components';

// Slate Table 相关类型
export type {
  CellElement,
  Edge,
  NodeEntryWithContext,
  SelectionMode,
  WithType,
} from './MarkdownEditor/utils/native-table/native-table-editor';

// MarkdownEditor 元素类型
export type {
  AttachNode,
  BlockQuoteNode,
  BreakNode,
  CardAfterNode,
  CardBeforeNode,
  CardNode,
  ChartNode,
  ChartTypeConfig,
  CodeNode,
  CustomLeaf,
  DetailedSettings,
  ElementProps,
  Elements,
  FootnoteDefinitionNode,
  HeadNode,
  HrNode,
  InlineKatexNode,
  LinkCardNode,
  ListItemNode,
  ListNode,
  MapValue,
  MediaNode,
  NodeTypes,
  ParagraphNode,
  SchemaNode,
  TableCellNode,
  TableNode,
  TableRowNode,
} from './MarkdownEditor/el';

// 语音相关类型
export type {
  UseSpeechAdapter,
  UseSpeechSynthesisOptions,
  UseSpeechSynthesisResult,
} from './Bubble/MessagesContent/VoiceButton/types';

// MarkdownInputField 语音识别相关类型
export type {
  CreateRecognizer,
  VoiceRecognizer,
} from './MarkdownInputField/VoiceInput';

// 模板引擎类
export { TemplateEngine } from './schema/SchemaRenderer/templateEngine';

// Schema 验证器类
export { SchemaValidator } from './schema/validator';

// 沙箱健康检查器
export { SandboxHealthChecker } from './utils/proxySandbox';

export * from './MarkdownInputField/AttachmentButton/AttachmentFileList/AttachmentFileListItem';

export * from './MarkdownInputField/AttachmentButton/AttachmentFileList';
export * from './MarkdownInputField/AttachmentButton/utils';
