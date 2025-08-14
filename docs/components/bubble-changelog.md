# Bubble 组件文档和测试更新日志

## 概述

本次更新主要针对 Bubble 组件的文档和测试进行了完善，特别是关于 `beforeMessageRender` 和 `afterMessageRender` 功能的文档修正和测试补充。

## 主要修改内容

### 1. 文档修正

#### 1.1 API 表格更新

- 在 `BubbleRenderConfig` 表格中添加了缺失的 `beforeMessageRender` 和 `afterMessageRender` 属性
- 明确了这两个属性的类型定义和说明

#### 1.2 功能特性文档更新

- 新增了 `beforeMessageRender 和 afterMessageRender 自定义消息前后渲染` 章节
- 提供了详细的使用示例和参数说明
- 明确了与 `beforeContentRender`/`afterContentRender` 的区别

#### 1.3 Render 方法优先级说明更新

- 更新了优先级列表，将 `beforeMessageRender` 和 `afterMessageRender` 添加到正确的位置
- 明确了各个 render 方法的执行顺序

#### 1.4 组合使用示例更新

- 修正了示例代码中的属性名使用
- 确保示例代码与实际 API 保持一致

### 2. 测试文件新增

#### 2.1 新增测试文件

- 创建了 `tests/Bubble/beforeMessage-afterMessage.test.tsx`
- 包含 8 个测试用例，覆盖了以下场景：
  - 基本渲染功能
  - 同时使用两个属性
  - 设置为 false 时的禁用功能
  - props 参数的正确传递
  - 在用户消息和 AI 消息中的适用性
  - 复杂渲染内容的处理

#### 2.2 测试覆盖范围

- ✅ 应该渲染 beforeMessageRender 的内容
- ✅ 应该渲染 afterMessageRender 的内容
- ✅ 应该同时渲染 beforeMessageRender 和 afterMessageRender 的内容
- ✅ 当 beforeMessageRender 为 false 时，不应该渲染前置内容
- ✅ 当 afterMessageRender 为 false 时，不应该渲染后置内容
- ✅ render 函数应该能访问到正确的 props
- ✅ 应该在用户消息和 AI 消息中都生效
- ✅ 应该能正确处理复杂的渲染内容

### 3. 演示文件新增

#### 3.1 新增演示文件

- 创建了 `docs/demos/bubble/beforeMessage-afterMessage-demo.tsx`
- 提供了完整的使用示例和说明文档

#### 3.2 演示内容

- 展示了如何使用 `beforeMessageRender` 和 `afterMessageRender`
- 提供了代码示例和功能说明
- 说明了与旧 API 的区别

## API 属性说明

### beforeMessageRender

- **类型**: `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`
- **说明**: 消息前渲染函数，用于在消息内容前面添加自定义内容
- **适用性**: 在所有消息类型中都生效（用户消息和 AI 消息）
- **参数**:
  - `props`: 当前气泡组件的所有属性
  - `defaultDom`: 默认为 `null`，可以忽略

### afterMessageRender

- **类型**: `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`
- **说明**: 消息后渲染函数，用于在消息内容后面添加自定义内容
- **适用性**: 在所有消息类型中都生效（用户消息和 AI 消息）
- **参数**:
  - `props`: 当前气泡组件的所有属性
  - `defaultDom`: 默认为 `null`，可以忽略

## 与旧 API 的区别

| 属性                                       | 适用性                | 建议使用    |
| ------------------------------------------ | --------------------- | ----------- |
| `beforeMessageRender`/`afterMessageRender` | 所有消息类型          | ✅ 优先使用 |
| `beforeContentRender`/`afterContentRender` | 仅左侧消息（AI 回复） | 向后兼容    |

## 测试结果

所有测试都通过，包括：

- 新增的 `beforeMessage-afterMessage.test.tsx` 测试文件（8/8 通过）
- 现有的 `afterContent-beforeContent.test.tsx` 测试文件（6/6 通过）
- 所有 Bubble 相关测试（162/162 通过）

## 总结

本次更新完善了 Bubble 组件的文档和测试，特别是：

1. **文档准确性**: 修正了 API 文档中的不一致之处，确保文档与实际实现保持一致
2. **功能完整性**: 补充了缺失的 `beforeMessageRender` 和 `afterMessageRender` 功能文档
3. **测试覆盖**: 新增了专门的测试文件，确保新功能的正确性
4. **向后兼容**: 保持了与现有 API 的兼容性，同时提供了更优的新 API

这些修改提高了组件的可维护性和用户体验，为开发者提供了更清晰的使用指导。
