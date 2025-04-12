import { ConfigProvider } from 'antd';
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
  copySuccess: '复制成功',
  uploadSuccess: '上传成功',
  uploading: '上传中...',
  pieChart: '饼图',
  barChart: '条形图',
  lineChart: '折线图',
  columnChart: '柱状图',
  areaChart: '面积图',
  definitionList: '定义列表',
  tableQuery: '表查询',
  toolQuery: '工具查询',
  documentQuery: '文档查询',
  deepThinking: '深度思考',
  webSearch: '联网搜索',
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
  inProgressTask: '正在进行${taskName}任务',
  totalTimeUsed: '共耗时',
  edit: '修改',
  multipleKnowledgeBases: '多个知识库',
  multipleTables: '等多个表格',
  multipleTools: '等多个工具',
  multipleData: '等多个数据',
  addComment: '添加评论',
};

// 英文 key-label 映射
export const enLabels = {
  bold: 'Bold',
  italic: 'Italic',
  strikethrough: 'Strikethrough',
  'inline-code': 'Inline Code',
  column: 'Column',
  quote: 'Quote',
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
  definitionList: 'Definition List',
  tableQuery: 'Table Query',
  toolQuery: 'Tool Query',
  documentQuery: 'Document Query',
  deepThinking: 'Deep Thinking',
  webSearch: 'Web Search',
  preview: 'Preview',
  expand: 'Expand',
  collapse: 'Collapse',
  taskComplete: 'Task Complete',
  edit: 'Edit',
  multipleKnowledgeBases: 'Multiple Knowledge Bases',
  multipleTables: 'Multiple Tables',
  multipleTools: 'Multiple Tools',
  multipleData: 'Multiple Data',
  addComment: 'Add Comment',
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

export function compileTemplate(
  template: string,
  variables: Record<string, string> = {},
) {
  return template.replace(/\$\{(\w+)\}/g, (_, varName) => {
    // 优先使用传入变量，找不到时显示变量名
    return variables[varName] ?? `[${varName}]`;
  });
}
