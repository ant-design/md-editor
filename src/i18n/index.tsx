import { ConfigProvider } from 'antd';
import React, { useContext, useState } from 'react';

/**
 * 中文标签映射对象
 *
 * 包含所有界面文本的中文翻译，用于国际化支持。
 * 提供完整的用户界面文本本地化。
 */
export const cnLabels = {
  table: '表格',
  column: '分栏',
  quote: '引用',
  code: '代码',
  localeImage: '本地图片',
  'b-list': '无序列表',
  'n-list': '有序列表',
  't-list': '任务列表',
  head1: '主标题',
  head2: '段标题',
  head3: '小标题',
  deleteMedia: '删除媒体',
  confirmDelete: '确定删除该媒体吗？',
  delete: '删除',
  assignTo: '指派给',
  previewTable: '预览表格',
  copy: '复制',
  copySuccess: '复制成功',
  uploadSuccess: '上传成功',
  uploading: '上传中...',
  pieChart: '饼图',
  configChart: '配置图表',
  updateChart: '更新',
  barChart: '条形图',
  lineChart: '折线图',
  columnChart: '柱状图',
  areaChart: '面积图',
  descriptions: '定义列表',
  TableSql: '表查询',
  ToolCall: '工具查询',
  RagRetrieval: '文档查询',
  DeepThink: '深度思考',
  WebSearch: '联网搜索',
  other: '',
  preview: '预览',
  expand: '展开',
  bold: '加粗',
  italic: '斜体',
  strikethrough: '删除线',
  'inline-code': '行内代码',
  'font-color': '字体颜色',
  collapse: '收起',
  fullScreen: '全屏',
  taskFinished: '任务完成',
  taskCost: '共耗时',
  taskComplete: '任务完成',
  taskAborted: '任务已取消',
  inProgressTask: '正在进行${taskName}任务',
  totalTimeUsed: '共耗时',
  edit: '修改',
  multipleKnowledgeBases: '多个知识库',
  multipleTables: '等多个表格',
  multipleTools: '等多个工具',
  multipleData: '等多个数据',
  executeSQL: '查询 SQL',
  cancel: '取消',
  retry: '重试',
  executing: 'SQL 执行中...',
  queryResults: '查询结果',
  queryFailed: '查询失败，需要修改',
  addComment: '添加评论',
  searchResults: '检索结果',
  thinking: '思考中',
  queryKeyWords: '查询关键词',
  executionResult: '执行结果',
  deepThinkingInProgress: '深度思考中',
  taskExecutionFailed: '任务执行失败，需要修改',
  executionParameters: '执行入参',
  apiCalling: 'API调用中',
  networkQuerying: '网络查询中',
  switchLanguage: '切换语言',
  insertLink: '插入链接',
  clearFormatting: '清除格式',
  undo: '撤销',
  redo: '重做',
  thoughtChainTitle: '思维链',
  thoughtChainDescription: 'AI思考过程',
  requestBody: '请求体数据',
  urlParameters: 'URL路径参数',
  queryParameters: 'URL查询参数',
  searchKeywords: '搜索关键词',
  toolDescription: '工具描述',
  httpMethod: 'HTTP方法',
  toolName: '工具名称',
  apiPath: '接口路径',
  requestData: '请求数据',
  requestParamsString: '请求参数字符串',
  responseBody: '响应体',
  responseStatus: '响应状态',
  toolSetId: '工具集ID',
  toolSetVersion: '工具集版本',
  toolInstanceId: '工具实例ID',
  errorMessage: '错误信息',
  apiResponse: 'API响应数据',
  documentChunks: '文档块',
  tableData: '表格数据',
  columnNames: '列名',
  documentPreview: '文档预览',
  loading: '加载中...',
  finished: '已完成',
  aborted: '已中止',
  timeUsed: '耗时',
  seconds: '秒',
  minutes: '分钟',
  hours: '小时',
  days: '天',
  inputPlaceholder: '请输入',
  emptyObjectConfig: '对象配置为空',
  close: '关闭',
  runCode: '运行代码',
  rerender: '重新渲染',
  download: '下载',
  dragToMove: '拖拽移动',
  format: '格式化',
  removeLink: '移除链接',
  largeTitle: '大标题',
  paragraphTitle: '段落标题',
  smallTitle: '小标题',
  bodyText: '正文',
  leftAlign: '左对齐',
  centerAlign: '居中对齐',
  rightAlign: '右对齐',
  inlineImage: '行内图片',
  blockImage: '单独一行',
  quickSettings: '快捷设置',
  elements: '元素',
  media: '媒体',
  list: '列表',
  heading: '标题',
  clickToPreview: '点击可查看预览',
  agentRunBar: {
    running: '正在运行中',
    timeUsedPrefix: '已耗时',
    calling: '正在调用',
    taskCompleted: '任务已完成',
    taskStopped: '任务已停止',
    taskReplaying: '正在回放任务中',
    createNewTask: '创建新任务',
    viewResult: '查看结果',
    replayTask: '重新回放',
  },
  // History 组件相关
  'chat.history': '历史记录',
  'chat.history.delete': '删除',
  'chat.history.delete.popconfirm': '确定删除该消息吗？',
  'chat.history.favorite': '收藏',
  'chat.history.unfavorite': '取消收藏',
  'chat.history.search': '搜索',
  'chat.history.search.placeholder': '历史任务',
  'chat.history.newChat': '新对话',
  'chat.history.loadMore': '查看更多',
  'chat.history.historyTasks': '历史任务',
  // TaskList 组件相关
  'taskList.expand': '展开',
  'taskList.collapse': '收起',
  'taskList.taskList': '任务列表',
  'taskList.taskComplete': '任务完成',
  'taskList.taskAborted': '任务已取消',
  'taskList.taskInProgress': '正在进行${taskName}任务',
  'taskList.totalTimeUsed': '共耗时',
  // Bubble 组件相关
  'chat.message.thinking': '正在思考中...',
  'chat.message.referenceDocument': '参考文档',
  'chat.message.viewOriginal': '查看原文',
  'chat.message.generateFailed': '生成回答失败，请重试',
  'chat.message.preview': '预览',
  // Workspace/File 组件相关
  'workspace.file.fileName': '文件名：',
  'workspace.file.fileSize': '文件大小：',
  'workspace.file.clickToDownload': '点击下载',
  'workspace.file.cannotGetImagePreview': '无法获取图片预览',
  'workspace.file.cannotGetVideoPreview': '无法获取视频预览',
  'workspace.file.cannotGetAudioPreview': '无法获取音频预览',
  'workspace.file.cannotGetPdfPreview': '无法获取PDF预览',
  'workspace.file.unknownFileType': '未知的文件类型',
  'workspace.file.generationTime': '生成时间：',
  'workspace.file.backToFileList': '返回文件列表',
  'workspace.file.downloadFile': '下载文件',
  // MarkdownInputField 组件相关
  'markdownInput.fileSizeExceeded': '文件大小超过 ${maxSize} KB',
  // 文档信息相关
  'docInfo.name': '名称',
  'docInfo.updateTime': '更新时间',
  'docInfo.type': '类型',
  'docInfo.content': '内容',
  'docInfo.referenceContent': '引用内容',
  'docInfo.items': '项',
  'docInfo.expand': '展开',
  'docInfo.collapse': '收起',
  // 幻灯片模式相关
  'slides.closeSlidesMode': '关闭幻灯片模式',
  // 任务相关
  'task.default': '任务',
  // 错误信息相关
  'error.unexpected': '出现点意外情况，请重新发送',
  // 聊天相关
  'chat.message.aborted': '回答已停止生成',
  'chat.message.retrySend': '重新生成',
  'chat.message.copy': '复制',
  'chat.message.like': '喜欢',
  'chat.message.cancel-like': '取消点赞',
  'chat.message.feedback-success': '已经反馈过了哦',
  'chat.message.dislike': '不喜欢',
  'chat.message.exception': '消息发送失败,请稍后重试',
  'chat.message.error': '消息发送失败,请稍后重试',
  'chat.message.error.retry': '重试',
  'chat.message.timeout': '消息发送超时,请稍后重试',
  'chat.message.copy.success': '复制成功',
  'chat.message.copy.error': '复制失败',
  'chat.inputArea.placeholder': '请输入问题',
  'chat.inputArea.max_input_length': '输入内容过长，请控制在1000字以内',
  'chat.list.helloMessage': '您好，我是您的专属客服，有什么可以帮助您的吗？',
  'chat.newsession.popconfirm': '您确定要结束当前会话吗？',
  'chat.newsession': '新建会话',
  'chat.close': '关闭',
  'chat.helloMessage.pre_hello_text': '您好，我是',
  // HtmlPreview 组件相关
  'htmlPreview.preview': '预览',
  'htmlPreview.code': '代码',
  'htmlPreview.renderFailed': '页面渲染失败',
  // Workspace 组件相关
  'workspace.realtimeFollow': '实时跟随',
  'workspace.browser': '浏览器',
  'workspace.task': '任务',
  'workspace.file': '文件',
  'workspace.custom': '自定义',
  'workspace.terminalExecution': '终端执行',
  'workspace.createHtmlFile': '创建 HTML 文件',
  'workspace.markdownContent': 'Markdown 内容',
  'workspace.closeWorkspace': '关闭工作空间',
  'workspace.expand': '展开',
  'workspace.collapse': '收起',
  'workspace.group': '分组',
  'workspace.loadingPreview': '正在加载预览...',
  'workspace.previewLoadFailed': '预览加载失败',
  'workspace.previewError': '获取预览内容时发生错误',
  'workspace.processingFile': '正在处理文件...',
  'workspace.fileProcessFailed': '文件处理失败',
  'workspace.loadingFileContent': '正在加载文件内容...',
  'workspace.textContentLoadFailed': '加载文本内容失败',
  'workspace.fileProcessError': '文件处理失败',
  'workspace.download': '下载',
};

// 英文 key-label 映射
export const enLabels: typeof cnLabels = {
  undo: 'Undo',
  redo: 'Redo',
  switchLanguage: 'Switch Language',
  insertLink: 'Insert Link',
  clearFormatting: 'Clear Formatting',
  queryKeyWords: 'Query Keywords',
  searchResults: 'Search Results',
  taskFinished: 'Task Finished',
  taskCost: 'Time Used',
  taskComplete: 'Task Complete',
  taskAborted: 'Task Aborted',
  executionResult: 'Execution Result',
  thinking: 'Thinking...',
  other: '',
  TableSql: 'Table Query',
  ToolCall: 'Tool Call',
  RagRetrieval: 'Rag Retrieval',
  DeepThink: 'Deep Thinking...',
  WebSearch: 'Network Search',
  deepThinkingInProgress: 'Deep Thinking...',
  taskExecutionFailed: 'Task execution failed, modifications needed',
  executionParameters: 'Execution Parameters',
  apiCalling: 'API Calling...',
  networkQuerying: 'Network Querying...',
  bold: 'Bold',
  italic: 'Italic',
  strikethrough: 'Strikethrough',
  'inline-code': 'Inline Code',
  column: 'Column',
  updateChart: 'Update',
  quote: 'Quote',
  configChart: 'Configure Chart',
  totalTimeUsed: 'Total Time Used',
  inProgressTask: 'Task in progress: ${taskName}',
  code: 'Code',
  localeImage: 'Local image',
  'b-list': 'Bulleted list',
  'n-list': 'Numbered list',
  't-list': 'Todo list',
  fullScreen: 'FullScreen',
  'font-color': 'Font Color',
  head1: 'Heading 1',
  head2: 'Heading 2',
  head3: 'Heading 3',
  deleteMedia: 'Delete Media',
  confirmDelete: 'Are you sure to delete?',
  delete: 'Delete',
  assignTo: 'Assign to',
  previewTable: 'Preview Table',
  copySuccess: 'Copy succeeded',
  uploadSuccess: 'Upload succeeded',
  uploading: 'Uploading...',
  pieChart: 'Pie Chart',
  barChart: 'Bar Chart',
  lineChart: 'Line Chart',
  columnChart: 'Column Chart',
  areaChart: 'Area Chart',
  table: 'Table',
  descriptions: 'Definition List',
  preview: 'Preview',
  copy: 'Copy',
  expand: 'Expand',
  collapse: 'Collapse',
  edit: 'Edit',
  multipleKnowledgeBases: 'Multiple Knowledge Bases',
  multipleTables: 'Multiple Tables',
  multipleTools: 'Multiple Tools',
  multipleData: 'Multiple Data',
  addComment: 'Add Comment',
  executeSQL: 'Query SQL',
  cancel: 'Cancel',
  retry: 'Retry',
  executing: 'Executing SQL...',
  queryResults: 'Query Results',
  queryFailed: 'Query failed, modification required',
  thoughtChainTitle: 'Thought Chain',
  thoughtChainDescription: 'AI Thinking Process',
  requestBody: 'Request Body',
  urlParameters: 'URL Parameters',
  queryParameters: 'Query Parameters',
  searchKeywords: 'Search Keywords',
  toolDescription: 'Tool Description',
  httpMethod: 'HTTP Method',
  toolName: 'Tool Name',
  apiPath: 'API Path',
  requestData: 'Request Data',
  requestParamsString: 'Request Parameters String',
  responseBody: 'Response Body',
  responseStatus: 'Response Status',
  toolSetId: 'Tool Set ID',
  toolSetVersion: 'Tool Set Version',
  toolInstanceId: 'Tool Instance ID',
  errorMessage: 'Error Message',
  apiResponse: 'API Response',
  documentChunks: 'Document Chunks',
  tableData: 'Table Data',
  columnNames: 'Column Names',
  documentPreview: 'Document Preview',
  loading: 'Loading...',
  finished: 'Finished',
  aborted: 'Aborted',
  timeUsed: 'Time Used',
  seconds: 'seconds',
  minutes: 'minutes',
  hours: 'hours',
  days: 'days',
  inputPlaceholder: 'Please input',
  emptyObjectConfig: 'Empty object configuration',
  close: 'Close',
  runCode: 'Run Code',
  rerender: 'Rerender',
  download: 'Download',
  dragToMove: 'Drag to Move',
  format: 'Format',
  removeLink: 'Remove Link',
  largeTitle: 'Large Title',
  paragraphTitle: 'Paragraph Title',
  smallTitle: 'Small Title',
  bodyText: 'Body Text',
  leftAlign: 'Left Align',
  centerAlign: 'Center Align',
  rightAlign: 'Right Align',
  inlineImage: 'Inline Image',
  blockImage: 'Block Image',
  quickSettings: 'Quick Settings',
  elements: 'Elements',
  media: 'Media',
  list: 'List',
  heading: 'Heading',
  clickToPreview: 'Click to preview',
  agentRunBar: {
    running: 'Running',
    timeUsedPrefix: 'Time used:',
    calling: 'Calling',
    taskCompleted: 'Task completed',
    taskStopped: 'Task stopped',
    taskReplaying: 'Replaying task',
    createNewTask: 'Create new task',
    viewResult: 'View result',
    replayTask: 'Replay',
  },
  // History component related
  'chat.history': 'History',
  'chat.history.delete': 'Delete',
  'chat.history.delete.popconfirm': 'Are you sure to delete this message?',
  'chat.history.favorite': 'Favorite',
  'chat.history.unfavorite': 'Unfavorite',
  'chat.history.search': 'Search',
  'chat.history.search.placeholder': 'History tasks',
  'chat.history.newChat': 'New Chat',
  'chat.history.loadMore': 'Load More',
  'chat.history.historyTasks': 'History Tasks',
  // TaskList component related
  'taskList.expand': 'Expand',
  'taskList.collapse': 'Collapse',
  'taskList.taskList': 'Task List',
  'taskList.taskComplete': 'Task Complete',
  'taskList.taskAborted': 'Task Aborted',
  'taskList.taskInProgress': 'Task in progress: ${taskName}',
  'taskList.totalTimeUsed': 'Total Time Used',
  // Bubble component related
  'chat.message.thinking': 'Thinking...',
  'chat.message.referenceDocument': 'Reference Document',
  'chat.message.viewOriginal': 'View Original',
  'chat.message.generateFailed': 'Failed to generate answer, please retry',
  'chat.message.preview': 'Preview',
  // Workspace/File component related
  'workspace.file.fileName': 'File Name: ',
  'workspace.file.fileSize': 'File Size: ',
  'workspace.file.clickToDownload': 'Click to Download',
  'workspace.file.cannotGetImagePreview': 'Cannot get image preview',
  'workspace.file.cannotGetVideoPreview': 'Cannot get video preview',
  'workspace.file.cannotGetAudioPreview': 'Cannot get audio preview',
  'workspace.file.cannotGetPdfPreview': 'Cannot get PDF preview',
  'workspace.file.unknownFileType': 'Unknown file type',
  'workspace.file.generationTime': 'Generation Time: ',
  'workspace.file.backToFileList': 'Back to File List',
  'workspace.file.downloadFile': 'Download File',
  // MarkdownInputField component related
  'markdownInput.fileSizeExceeded': 'File size exceeds ${maxSize} KB',
  // Document info related
  'docInfo.name': 'Name',
  'docInfo.updateTime': 'Update Time',
  'docInfo.type': 'Type',
  'docInfo.content': 'Content',
  'docInfo.referenceContent': 'Reference Content',
  'docInfo.items': 'items',
  'docInfo.expand': 'Expand',
  'docInfo.collapse': 'Collapse',
  // Slides mode related
  'slides.closeSlidesMode': 'Close Slides Mode',
  // Task related
  'task.default': 'Task',
  // Error messages related
  'error.unexpected': 'Something unexpected happened, please resend',
  // Chat related
  'chat.message.aborted': 'Answer has stopped being generated',
  'chat.message.retrySend': 'Re-generate',
  'chat.message.copy': 'Copy',
  'chat.message.like': 'Like',
  'chat.message.cancel-like': 'Cancel Like',
  'chat.message.feedback-success': 'Feedback has been received',
  'chat.message.dislike': 'Dislike',
  'chat.message.exception': 'Message delivery failed, please try again later',
  'chat.message.error': 'Message delivery failed, please try again later',
  'chat.message.error.retry': 'Retry',
  'chat.message.timeout': 'Message delivery timeout, please try again later',
  'chat.message.copy.success': 'Copy successful',
  'chat.message.copy.error': 'Copy failed',
  'chat.inputArea.placeholder':
    'Please enter a question or "/" to get the template',
  'chat.inputArea.max_input_length':
    'Input content is too long, please keep it under 1000 characters',
  'chat.list.helloMessage':
    'Hello, I am your dedicated customer service, how can I help you?',
  'chat.newsession.popconfirm':
    'Are you sure you want to end the current session?',
  'chat.newsession': 'New session',
  'chat.close': 'Close',
  'chat.helloMessage.pre_hello_text': 'Hello, I am',
  // HtmlPreview 组件相关
  'htmlPreview.preview': 'Preview',
  'htmlPreview.code': 'Code',
  'htmlPreview.renderFailed': 'Page rendering failed',
  // Workspace 组件相关
  'workspace.realtimeFollow': 'Real-time follow',
  'workspace.browser': 'Browser',
  'workspace.task': 'Task',
  'workspace.file': 'File',
  'workspace.custom': 'Custom',
  'workspace.terminalExecution': 'Terminal execution',
  'workspace.createHtmlFile': 'Create HTML file',
  'workspace.markdownContent': 'Markdown content',
  'workspace.closeWorkspace': 'Close workspace',
  'workspace.expand': 'Expand',
  'workspace.collapse': 'Collapse',
  'workspace.group': 'Group',
  'workspace.loadingPreview': 'Loading preview...',
  'workspace.previewLoadFailed': 'Preview loading failed',
  'workspace.previewError': 'Error getting preview content',
  'workspace.processingFile': 'Processing file...',
  'workspace.fileProcessFailed': 'File processing failed',
  'workspace.loadingFileContent': 'Loading file content...',
  'workspace.textContentLoadFailed': 'Failed to load text content',
  'workspace.fileProcessError': 'File processing failed',
  'workspace.download': 'Download',
};

export type LocalKeys = typeof cnLabels;

/**
 * 国际化上下文
 *
 * 提供国际化功能的React Context，包含当前语言环境和设置语言的方法。
 */
export const I18nContext = React.createContext<{
  locale: LocalKeys;
  setLocale?: (locale: LocalKeys) => void;
}>({
  locale: cnLabels,
});

/**
 * I18nProvide 组件 - 国际化提供者组件
 *
 * 该组件提供国际化功能，支持中英文切换，自动检测用户语言偏好。
 * 集成Ant Design的ConfigProvider，提供完整的国际化支持。
 *
 * @component
 * @description 国际化提供者组件，支持多语言切换
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {typeof cnLabels} [props.locale] - 自定义语言环境
 *
 * @example
 * ```tsx
 * <I18nProvide locale={cnLabels}>
 *   <App />
 * </I18nProvide>
 * ```
 *
 * @returns {React.ReactElement} 渲染的国际化提供者组件
 *
 * @remarks
 * - 支持中英文语言切换
 * - 自动检测用户浏览器语言
 * - 集成Ant Design国际化
 * - 提供语言环境上下文
 * - 支持自定义语言配置
 * - 响应式语言切换
 * - 提供模板字符串编译功能
 */
export const I18nProvide: React.FC<{
  children: React.ReactNode;
  locale?: typeof cnLabels;
}> = (props) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const [locale, setLocale] = useState(() => {
    if (context?.locale) {
      return context.locale?.locale?.toLocaleLowerCase() === 'zh-cn'
        ? cnLabels
        : enLabels;
    }
    if (typeof navigator !== 'undefined') {
      const userLang = navigator.language;
      if (!userLang) {
        return cnLabels;
      }
      return userLang.startsWith('zh') ? cnLabels : enLabels;
    }
    return props.locale || cnLabels;
  });
  return (
    <I18nContext.Provider value={{ locale: props.locale || locale, setLocale }}>
      {props.children}
    </I18nContext.Provider>
  );
};

/**
 * 编译模板字符串，将其中的变量占位符替换为对应的值
 *
 * @param template - 包含变量占位符的模板字符串，格式为 ${variableName}
 * @param variables - 变量名和对应值的键值对对象，默认为空对象
 * @returns 替换变量后的字符串。如果变量在variables中不存在，则显示为[variableName]
 *
 * @example
 * // 返回 "你好，世界！"
 * compileTemplate("你好，${name}！", { name: "世界" });
 *
 * // 返回 "你好，[name]！"（当变量未提供时）
 * compileTemplate("你好，${name}！");
 */
export function compileTemplate(
  template: string,
  variables: Record<string, string> = {},
) {
  return template.replace(/\$\{(\w+)\}/g, (_, varName) => {
    // 优先使用传入变量，找不到时显示变量名
    return variables[varName] ?? `[${varName}]`;
  });
}
