# CSS 到 style.ts 迁移任务清单

## 已完成的任务 ✅

### 1. 重构AceEditorWrapper为独立组件

- [x] 重新实现 `src/schema/SchemaEditor/AceEditorWrapper.tsx`
- [x] 完全独立，不依赖其他组件
- [x] 直接使用 ace-builds，减少依赖层级
- [x] 只接收 `value` props，简化API

### 2. 创建样式文件迁移

- [x] 创建 `src/MarkdownEditor/index.style.ts` - 迁移 `index.css`
- [x] 创建 `src/ThoughtChainList/DotAni/style.ts` - 迁移 `index.css`
- [x] 创建 `src/Slides/style.ts` - 迁移 `white.css`
- [x] 创建 `src/schema/SchemaEditor/style.ts` - 迁移 `style.css`

### 3. 更新组件引用

- [x] 更新 `src/ThoughtChainList/DotAni/index.tsx` 使用新的样式文件
- [x] 更新 `src/Slides/index.tsx` 使用新的样式文件
- [x] 更新 `src/schema/SchemaEditor/index.tsx` 使用新的样式文件
- [x] 更新 `src/MarkdownEditor/BaseMarkdownEditor.tsx` 使用新的样式文件

## 待完成的任务 ⏳

### 1. 删除旧的CSS文件

- [ ] 删除 `src/MarkdownEditor/index.css`
- [ ] 删除 `src/MarkdownEditor/editor/keyframes.css`
- [ ] 删除 `src/ThoughtChainList/DotAni/index.css`
- [ ] 删除 `src/Slides/white.css`
- [ ] 删除 `src/schema/SchemaEditor/style.css`

### 2. 测试验证

- [ ] 验证所有组件样式正常显示
- [ ] 验证动画效果正常工作
- [ ] 验证响应式布局正常
- [ ] 运行测试确保无回归

### 3. 清理工作

- [ ] 检查是否还有其他CSS文件需要迁移
- [ ] 更新相关文档
- [ ] 清理未使用的依赖

## 技术要点

### 样式迁移原则

1. 使用 `@ant-design/cssinjs` 的 `Keyframes` 处理动画
2. 使用项目的 `useEditorStyleRegister` 统一管理样式
3. 保持原有的样式效果和功能
4. 减少依赖，提高组件独立性

### 组件重构原则

1. 简化API，只保留必要的props
2. 减少外部依赖
3. 提高组件的可复用性
4. 保持向后兼容性

## 注意事项

- 确保所有动画关键帧正确迁移
- 保持CSS变量的定义和使用
- 确保媒体查询正常工作
- 验证所有伪元素和伪类样式
