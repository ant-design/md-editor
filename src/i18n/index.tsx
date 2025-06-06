﻿import { ConfigProvider } from 'antd';
import React, { useContext, useState } from 'react';

// 中文 key-label 映射
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
  taskComplete: '任务完成',
  taskAborted: '任务中止',
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
  taskComplete: 'Task Complete',
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
};

export type LocalKeys = typeof cnLabels;

export const I18nContext = React.createContext<{
  locale: typeof cnLabels;
  setLocale?: (locale: typeof cnLabels) => void;
}>({
  locale: cnLabels,
});

export const I18nProvide: React.FC<{
  children: React.ReactNode;
  locale?: typeof cnLabels;
}> = (props) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const [locale, setLocale] = useState(() => {
    if (context?.locale) {
      return context.locale.locale?.toLocaleLowerCase() === 'zh-cn'
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
