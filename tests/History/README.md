# History 组件测试用例

## 概述

本目录包含 History 组件的完整测试用例，包括组件测试和 Hook 测试。

## 测试文件

### 1. `History.test.tsx` - 组件测试

测试 History 组件的核心功能：

- **基础功能测试**
  - 下拉菜单模式渲染
  - 独立模式渲染
  - 数据请求和加载
  - sessionId 变化重新加载

- **回调函数测试**
  - onInit 和 onShow 回调
  - 点击历史记录项处理

- **Agent 模式测试**
  - 搜索功能
  - 新对话功能

- **错误处理测试**
  - 请求失败处理
  - 空数据处理

### 2. `useHistory.test.tsx` - Hook 测试

测试 useHistory Hook 的状态管理：

- **基础状态管理**
  - 状态初始化
  - 数据加载
  - sessionId 变化处理

- **功能测试**
  - 搜索功能
  - 收藏功能
  - 多选功能
  - 菜单状态控制

- **Agent 模式回调**
  - 加载更多
  - 新对话

- **错误处理**
  - 请求失败处理

- **性能优化**
  - 函数引用稳定性

## 测试覆盖率

- **组件测试**: 10 个测试用例
- **Hook 测试**: 15 个测试用例
- **总测试数**: 25 个测试用例
- **通过率**: 100%

## 运行测试

```bash
# 运行所有 History 测试
pnpm test tests/History/

# 运行特定测试文件
pnpm test tests/History/History.test.tsx
pnpm test tests/History/useHistory.test.tsx
```

## 测试策略

1. **Mock 策略**: 使用 vi.mock 模拟外部依赖
2. **异步处理**: 使用 act 和 waitFor 处理异步操作
3. **错误处理**: 测试各种错误场景
4. **状态管理**: 验证状态变化和回调函数调用

## 注意事项

- 测试中使用了 ConfigProvider 提供必要的上下文
- 模拟了复杂的组件交互，专注于核心功能测试
- 遵循 Linus Torvalds 的简洁哲学，保持测试代码清晰易懂
