import { describe, expect, it, vi } from 'vitest';

// Mock useEditorStyleRegister
vi.mock('../../src/Hooks/useStyle', () => ({
  useEditorStyleRegister: vi.fn(),
}));

import { useStyle } from '../../src/ChatBoot/style';
import { useEditorStyleRegister } from '../../src/Hooks/useStyle';

const mockUseEditorStyleRegister = vi.mocked(useEditorStyleRegister);

describe('ChatBoot style', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该调用 useEditorStyleRegister 并返回结果', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    const result = useStyle('test-prefix');

    expect(mockUseEditorStyleRegister).toHaveBeenCalledWith(
      'ChatBootTitle',
      expect.any(Function),
    );
    expect(result).toBe(mockResult);
  });

  it('应该使用默认前缀类名', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle();

    expect(mockUseEditorStyleRegister).toHaveBeenCalledWith(
      'ChatBootTitle',
      expect.any(Function),
    );
  });

  it('应该生成正确的样式配置', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('test-prefix');

    // 获取传递给 useEditorStyleRegister 的样式生成函数
    const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
    const mockToken = {
      componentCls: '.test-prefix',
    };

    const generatedStyles = styleGenerator(mockToken);

    expect(generatedStyles).toHaveLength(1);
    expect(generatedStyles[0]).toHaveProperty('.test-prefix');
    expect(generatedStyles[0]['.test-prefix']).toHaveProperty(
      'textAlign',
      'center',
    );
    expect(generatedStyles[0]['.test-prefix']).toHaveProperty(
      'marginBottom',
      24,
    );
  });

  it('应该生成正确的子元素样式', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('test-prefix');

    const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
    const mockToken = {
      componentCls: '.test-prefix',
    };

    const generatedStyles = styleGenerator(mockToken);
    const mainStyles = generatedStyles[0]['.test-prefix']['&-main'];
    const subtitleStyles = generatedStyles[0]['.test-prefix']['&-subtitle'];

    // 验证主标题样式
    expect(mainStyles).toHaveProperty('fontSize', 30);
    expect(mainStyles).toHaveProperty('fontWeight', 600);
    expect(mainStyles).toHaveProperty('lineHeight', '38px');
    expect(mainStyles).toHaveProperty('marginBottom', 8);
    expect(mainStyles).toHaveProperty(
      'color',
      'var(--color-gray-text-default)',
    );

    // 验证副标题样式
    expect(subtitleStyles).toHaveProperty('fontSize', 15);
    expect(subtitleStyles).toHaveProperty('lineHeight', '24px');
    expect(subtitleStyles).toHaveProperty(
      'color',
      'var(--color-gray-text-default)',
    );
  });

  it('应该处理不同的前缀类名', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('custom-prefix');

    const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
    const mockToken = {
      componentCls: '.custom-prefix',
    };

    const generatedStyles = styleGenerator(mockToken);

    expect(generatedStyles[0]).toHaveProperty('.custom-prefix');
    expect(generatedStyles[0]['.custom-prefix']).toHaveProperty(
      'textAlign',
      'center',
    );
  });

  it('应该处理空字符串前缀', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('');

    const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
    const mockToken = {
      componentCls: '.',
    };

    const generatedStyles = styleGenerator(mockToken);

    expect(generatedStyles[0]).toHaveProperty('.');
    expect(generatedStyles[0]['.']).toHaveProperty('textAlign', 'center');
  });

  it('应该处理特殊字符前缀', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('prefix-with-dashes');

    const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
    const mockToken = {
      componentCls: '.prefix-with-dashes',
    };

    const generatedStyles = styleGenerator(mockToken);

    expect(generatedStyles[0]).toHaveProperty('.prefix-with-dashes');
    expect(generatedStyles[0]['.prefix-with-dashes']).toHaveProperty(
      'textAlign',
      'center',
    );
  });

  it('应该返回正确的样式结构', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('test-prefix');

    const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
    const mockToken = {
      componentCls: '.test-prefix',
    };

    const generatedStyles = styleGenerator(mockToken);
    const rootStyles = generatedStyles[0]['.test-prefix'];

    // 验证根样式结构
    expect(rootStyles).toHaveProperty('textAlign');
    expect(rootStyles).toHaveProperty('marginBottom');
    expect(rootStyles).toHaveProperty('&-main');
    expect(rootStyles).toHaveProperty('&-subtitle');

    // 验证子样式结构
    expect(rootStyles['&-main']).toHaveProperty('fontSize');
    expect(rootStyles['&-main']).toHaveProperty('fontWeight');
    expect(rootStyles['&-main']).toHaveProperty('lineHeight');
    expect(rootStyles['&-main']).toHaveProperty('marginBottom');
    expect(rootStyles['&-main']).toHaveProperty('color');

    expect(rootStyles['&-subtitle']).toHaveProperty('fontSize');
    expect(rootStyles['&-subtitle']).toHaveProperty('lineHeight');
    expect(rootStyles['&-subtitle']).toHaveProperty('color');
  });

  it('应该处理多次调用', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('prefix1');
    useStyle('prefix2');
    useStyle('prefix3');

    expect(mockUseEditorStyleRegister).toHaveBeenCalledTimes(3);
    expect(mockUseEditorStyleRegister).toHaveBeenNthCalledWith(
      1,
      'ChatBootTitle',
      expect.any(Function),
    );
    expect(mockUseEditorStyleRegister).toHaveBeenNthCalledWith(
      2,
      'ChatBootTitle',
      expect.any(Function),
    );
    expect(mockUseEditorStyleRegister).toHaveBeenNthCalledWith(
      3,
      'ChatBootTitle',
      expect.any(Function),
    );
  });

  it('应该正确处理样式生成函数的参数', () => {
    const mockResult = { wrapSSR: vi.fn(), hashId: 'test-hash' };
    mockUseEditorStyleRegister.mockReturnValue(mockResult);

    useStyle('test-prefix');

    const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
    const mockToken = {
      componentCls: '.test-prefix',
      otherProperty: 'test',
    };

    const generatedStyles = styleGenerator(mockToken);

    // 验证样式生成函数正确处理了 token 参数
    expect(generatedStyles).toHaveLength(1);
    expect(generatedStyles[0]).toHaveProperty('.test-prefix');
  });
});
