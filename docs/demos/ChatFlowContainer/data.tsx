import {
  AttachmentFile,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/agentic-ui';

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

export const mockInlineFileMap = new Map<string, AttachmentFile>([
  [
    'demo-spec.pdf',
    createMockFile(
      'demo-spec.pdf',
      'application/pdf',
      2048576,
      'https://example.com/demo-spec.pdf',
    ),
  ],
  [
    'preview.png',
    createMockFile(
      'preview.png',
      'image/png',
      1048576,
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
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

export const INITIAL_MESSAGES = {
  assistant: `### Ant Design 聊天助手
可协助解答问题、提供示例与文档说明。`,

  user: `请说明电商后台里长列表与实时推送的常见实现思路。`,

  bubbleDoc: `## Bubble 附件示例
下方为内联文件展示：`,
};

// 重试任务配置
export const RETRY_CONFIG = {
  MESSAGE_COUNT: 2,
  MAX_RETRY: 6, // 设置偶数
  INTERVAL: 2000,
};

// 首屏展示完整结果，流式追加仅在用户主动重播时运行。
export const createCompletedMessages = (): MessageBubbleData[] => [
  createMockMessage(
    'initial-assistant',
    'assistant',
    INITIAL_MESSAGES.assistant,
  ),
  createMockMessage('initial-user', 'user', INITIAL_MESSAGES.user),
  ...Array.from({ length: RETRY_CONFIG.MAX_RETRY }, (_, index) =>
    createMockMessage(
      `initial-result-${index}`,
      index % 2 === 0 ? 'user' : 'assistant',
      index === RETRY_CONFIG.MAX_RETRY - 1
        ? INITIAL_MESSAGES.bubbleDoc
        : `这是第 ${index + RETRY_CONFIG.MESSAGE_COUNT + 1} 条消息`,
      index === RETRY_CONFIG.MAX_RETRY - 1 ? mockInlineFileMap : undefined,
    ),
  ),
];

export default () => null;
