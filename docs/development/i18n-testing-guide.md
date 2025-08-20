# 国际化测试指南

## 概述

本文档描述了项目中国际化功能的测试策略和测试用例。我们为国际化功能创建了全面的测试覆盖，确保所有组件都能正确支持中英文切换。

## 测试文件结构

```
tests/i18n/
├── internationalization.test.tsx    # 基础国际化功能测试
├── component-integration.test.tsx   # 组件集成测试
└── SchemaForm.test.tsx             # SchemaForm 组件测试
```

## 测试覆盖范围

### 1. 基础国际化功能测试 (`internationalization.test.tsx`)

#### 测试组件

- **TestI18nComponent**: 模拟组件，用于测试所有国际化文本

#### 测试场景

- **中文标签测试**: 验证所有中文国际化文本正确显示
- **英文标签测试**: 验证所有英文国际化文本正确显示
- **模板字符串支持**: 测试动态变量替换功能
- **回退行为**: 测试缺失国际化文本时的默认行为
- **Context 集成**: 测试 I18nContext 的正确使用

#### 覆盖的国际化文本

- **Bubble 组件**: 消息显示、文档引用、错误提示等
- **Workspace/File 组件**: 文件预览、下载、错误信息等
- **MarkdownInputField 组件**: 文件上传错误提示等
- **History 组件**: 历史记录、搜索、新对话等功能
- **TaskList 组件**: 任务列表、展开收起等功能

### 2. 组件集成测试 (`component-integration.test.tsx`)

#### 测试组件

- **HistoryNewChat**: 新对话按钮组件
- **HistorySearch**: 搜索组件
- **HistoryLoadMore**: 加载更多组件
- **TaskList**: 任务列表组件

#### 测试场景

- **组件渲染**: 验证组件在不同语言环境下的正确渲染
- **交互功能**: 测试组件的点击事件和状态变化
- **自定义语言**: 测试自定义国际化配置
- **模板字符串**: 测试动态文本替换功能

### 3. SchemaForm 组件测试 (`SchemaForm.test.tsx`)

#### 测试场景

- **表单标签**: 验证表单字段标签的国际化
- **占位符文本**: 测试输入框占位符的国际化

## 测试技术栈

- **测试框架**: Vitest
- **测试库**: @testing-library/react
- **断言库**: Vitest 内置断言
- **模拟**: Vitest 的 vi.mock()

## 运行测试

### 运行所有国际化测试

```bash
npm test -- tests/i18n/
```

### 运行特定测试文件

```bash
# 基础国际化功能测试
npm test -- tests/i18n/internationalization.test.tsx

# 组件集成测试
npm test -- tests/i18n/component-integration.test.tsx

# SchemaForm 测试
npm test -- tests/i18n/SchemaForm.test.tsx
```

### 运行特定测试用例

```bash
# 运行包含 "Chinese" 的测试
npm test -- tests/i18n/ -t "Chinese"

# 运行包含 "Template" 的测试
npm test -- tests/i18n/ -t "Template"
```

## 测试最佳实践

### 1. 测试结构

```typescript
describe('Component Name', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Chinese Labels', () => {
    it('should render component in Chinese', () => {
      // 测试实现
    });
  });

  describe('English Labels', () => {
    it('should render component in English', () => {
      // 测试实现
    });
  });
});
```

### 2. 使用 I18nContext

```typescript
render(
  <I18nContext.Provider value={{ locale: cnLabels }}>
    <Component />
  </I18nContext.Provider>,
);
```

### 3. 测试模板字符串

```typescript
it('should support template string replacement', () => {
  const templateText = cnLabels['key.with.variable'];
  const replacedText = templateText.replace('${variable}', 'value');
  expect(replacedText).toBe('expected result');
});
```

### 4. 测试回退行为

```typescript
it('should use fallback text when locale is missing', () => {
  render(<Component locale={undefined} />);
  expect(screen.getByText('默认文本')).toBeInTheDocument();
});
```

## 测试覆盖率

当前测试覆盖了以下方面：

- ✅ **35 个国际化文本键**的测试
- ✅ **5 个主要组件**的集成测试
- ✅ **中英文切换**功能测试
- ✅ **模板字符串**支持测试
- ✅ **回退机制**测试
- ✅ **Context 集成**测试

## 添加新测试

### 1. 为新组件添加国际化测试

```typescript
// 在 component-integration.test.tsx 中添加
describe('NewComponent', () => {
  it('should render in Chinese', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <NewComponent />
      </I18nContext.Provider>,
    );
    expect(screen.getByText('中文文本')).toBeInTheDocument();
  });

  it('should render in English', () => {
    render(
      <I18nContext.Provider value={{ locale: enLabels }}>
        <NewComponent />
      </I18nContext.Provider>,
    );
    expect(screen.getByText('English text')).toBeInTheDocument();
  });
});
```

### 2. 为新国际化文本添加测试

```typescript
// 在 internationalization.test.tsx 中添加
<div data-testid="new-component-text">
  {locale?.['newComponent.text'] || '默认文本'}
</div>

// 在测试用例中添加
expect(screen.getByTestId('new-component-text')).toHaveTextContent('期望的文本');
```

## 常见问题

### 1. 测试失败：找不到元素

- 检查组件是否正确渲染
- 确认国际化文本键是否正确
- 验证测试环境中的模拟是否正确

### 2. 测试失败：文本不匹配

- 检查国际化文本中是否有额外的空格
- 确认中英文文本是否完全匹配
- 验证模板字符串替换是否正确

### 3. 测试失败：组件依赖问题

- 确保所有依赖组件都已正确模拟
- 检查导入路径是否正确
- 验证测试环境配置

## 持续集成

国际化测试已集成到项目的 CI/CD 流程中：

- **提交前检查**: 运行所有国际化测试
- **构建验证**: 确保国际化功能正常工作
- **回归测试**: 防止国际化功能被意外破坏

## 总结

通过这套完整的国际化测试体系，我们确保了：

1. **功能完整性**: 所有国际化文本都能正确显示
2. **语言切换**: 中英文切换功能正常工作
3. **组件集成**: 国际化功能与组件正确集成
4. **错误处理**: 缺失文本时的回退机制正常
5. **维护性**: 新功能添加时有清晰的测试指导

这套测试体系为项目的国际化功能提供了可靠的保障，确保用户在不同语言环境下都能获得一致的使用体验。
