import {
  AttachmentFile,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';

// 用户和助手的元数据配置
export const assistantMeta: BubbleMetaData = {
  avatar:
    'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
  title: 'AI助手',
};

export const userMeta: BubbleMetaData = {
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  title: '用户',
};

// 创建模拟文件的辅助函数
export const createMockFile = (
  name: string,
  type: string,
  size: number,
  url: string,
): AttachmentFile => ({
  name,
  type,
  size,
  url,
  lastModified: Date.now(),
  webkitRelativePath: '',
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  bytes: () => Promise.resolve(new Uint8Array(0)),
  text: () => Promise.resolve(''),
  stream: () => new ReadableStream(),
  slice: () => new Blob(),
});

// 用于在回答内容中内联展示的文件列表（不挂载到 originData.fileMap）
export const mockInlineFileMap = new Map<string, AttachmentFile>([
  [
    'bubble-design-spec.pdf',
    createMockFile(
      'bubble-design-spec.pdf',
      'application/pdf',
      2048576,
      'https://example.com/bubble-design-spec.pdf',
    ),
  ],
  [
    'component-preview.png',
    createMockFile(
      'component-preview.png',
      'image/png',
      1048576,
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    ),
  ],
  [
    'api-reference-henchangehnchangmingzichang.json',
    createMockFile(
      'api-reference-henchangehnchangmingzichang.json',
      'application/json',
      512000,
      'https://example.com/api-reference-henchangehnchangmingzichang.json',
    ),
  ],
  [
    'more-example.docx',
    createMockFile(
      'more-example.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      8847360,
      'https://example.com/more-example.docx',
    ),
  ],
  [
    'more-example.xlsx',
    createMockFile(
      'more-example.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      6647360,
      'https://example.com/more-example.xlsx',
    ),
  ],
  [
    'more-example.pptx',
    createMockFile(
      'more-example.pptx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      7747360,
      'https://example.com/more-example.pptx',
    ),
  ],
]);

// 创建模拟消息的辅助函数
export const createMockMessage = (
  id: string,
  role: 'user' | 'assistant',
  content: string,
  fileMap?: MessageBubbleData['fileMap'],
): MessageBubbleData => ({
  id,
  role,
  content,
  createAt: Date.now(),
  updateAt: Date.now(),
  isFinished: true,
  meta: {
    avatar: role === 'assistant' ? assistantMeta.avatar : userMeta.avatar,
    title: role === 'assistant' ? assistantMeta.title : userMeta.title,
  } as BubbleMetaData,
  fileMap: fileMap || new Map(),
});

// 初始消息内容模板
export const INITIAL_MESSAGES = {
  assistant: `### 我是 Ant Design 聊天助手
可以帮你：

- **回答问题** - 解答技术相关疑问
- **代码示例** - 提供组件使用示例  
- **设计建议** - 给出设计方案建议
- **文档说明** - 解释 API 和功能

你想了解什么呢？`,

  user: `这是第 2 条消息, 生成式 AI 可以用于自动化迄今只有人类能够完成的创造性任务，这样可以为个人和公司节省时间和金钱。如果你能向生成式 AI 描述你的任务，它很可能为你完成任务或者为你提供一个良好的起点。生成式 AI 可以用于自动化迄今只有人类能够完成的创造性任务，这样可以为个人和公司节省时间和金钱。如果你能向生成式 AI 描述你的任务，它很可能为你完成任务或者为你提供一个良好的起点。生成式 AI 可以用于自动化迄今只有人类能够完成的创造性任务，这样可以为个人和公司节省时间和金钱。如果你能向生成式 AI 描述你的任务，它很可能为你完成任务或者为你提供一个良好的起点。生成式 AI 可以用于自动化迄今只有人类能够完成的创造性任务，这样可以为个人和公司节省时间和金钱。如果你能向生成式 AI 描述你的任务，它很可能为你完成任务或者为你提供一个良好的起点。`,

  bubbleDoc: `## Bubble 组件功能文档

Bubble 组件是一个功能丰富的聊天气泡组件，支持：

- 多种消息类型（文本、文件、图片等）
- 自定义渲染配置
- 左右布局切换
- 文件附件展示

以下是相关的设计文档和示例图片：`,
};

// 重试任务配置
export const RETRY_CONFIG = {
  MESSAGE_COUNT: 2,
  MAX_RETRY: 6, // 设置偶数
  INTERVAL: 2000,
};

export default () => null;
