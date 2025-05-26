# 增强表格功能

本项目已成功集成了来自 TripDocs 的增强表格操作功能，为用户提供更丰富的表格编辑体验。

## 功能特性

### 🎯 核心功能

- **插入行**: 在表格上方或下方插入新行
- **插入列**: 在表格左侧或右侧插入新列
- **删除行**: 删除选中的行
- **删除列**: 删除选中的列
- **删除表格**: 删除整个表格
- **悬浮工具栏**: 选中表格时自动显示操作工具栏

### 🎨 用户体验

- 直观的图标按钮
- 悬浮式工具栏设计
- 响应式操作反馈
- 与现有编辑器无缝集成

## 使用方法

### 基本使用

```tsx
import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <MarkdownEditor
      initValue="| 列1 | 列2 |\n|-----|-----|\n| 数据1 | 数据2 |"
      // 增强表格功能默认启用
    />
  );
};
```

### 禁用增强功能

如果需要禁用增强表格功能，可以通过 props 控制：

```tsx
<MarkdownEditor initValue="..." enableEnhancedOperations={false} />
```

### 自定义工具栏

可以单独使用表格工具栏组件：

```tsx
import { TableToolbar } from '@ant-design/md-editor';

// 在自定义组件中使用
<TableToolbar
  element={tableElement}
  onOperation={(operation) => {
    console.log('表格操作:', operation);
  }}
/>;
```

## 操作说明

### 1. 激活工具栏

- 点击表格任意位置
- 工具栏会自动出现在表格右上角

### 2. 插入操作

- **在上方插入行**: 在当前表格顶部添加新行
- **在下方插入行**: 在当前表格底部添加新行
- **在左侧插入列**: 在表格最左侧添加新列
- **在右侧插入列**: 在表格最右侧添加新列

### 3. 删除操作

- **删除行**: 删除表格的第一行
- **删除列**: 删除表格的第一列
- **删除表格**: 删除整个表格

## 技术实现

### 架构设计

```
src/MarkdownEditor/editor/elements/Table/enhanced/
├── TableToolbar.tsx          # 工具栏组件
├── EnhancedTable.tsx         # 增强表格组件
├── tableOperation.ts         # 表格操作逻辑
├── selection.ts              # 选择功能
├── config.ts                 # 配置文件
├── utils.ts                  # 工具函数
└── weak-maps.ts              # 状态存储
```

### 核心组件

#### TableToolbar

悬浮工具栏组件，提供表格操作按钮：

```tsx
interface TableToolbarProps {
  element: any;
  onOperation?: (operation: string) => void;
}
```

#### 表格操作类型

```tsx
type TableOperation =
  | 'insertRowAbove'
  | 'insertRowBelow'
  | 'insertColumnLeft'
  | 'insertColumnRight'
  | 'deleteRow'
  | 'deleteColumn'
  | 'deleteTable';
```

### 集成方式

增强功能通过以下方式集成到现有表格组件中：

1. **非侵入式设计**: 不影响现有 Handsontable 功能
2. **条件渲染**: 通过 props 控制是否启用
3. **事件处理**: 使用 Slate.js 的 Transforms API
4. **状态管理**: 利用 React hooks 管理组件状态

## 兼容性

- ✅ 与现有 Handsontable 功能兼容
- ✅ 支持只读模式自动隐藏
- ✅ 响应式设计适配
- ✅ TypeScript 类型支持

## 注意事项

1. **性能考虑**: 工具栏仅在表格选中时渲染
2. **操作限制**: 删除操作会检查表格最小尺寸
3. **状态同步**: 所有操作都会同步到 Slate.js 编辑器状态
4. **样式隔离**: 工具栏样式不会影响表格内容

## 未来规划

- [ ] 支持单元格合并/拆分
- [ ] 支持表格样式自定义
- [ ] 支持拖拽调整行高列宽
- [ ] 支持多单元格选择操作
- [ ] 支持表格数据导入导出

## 贡献

如需添加新的表格功能或改进现有功能，请参考 TripDocs 项目的实现方式，并确保与现有架构保持一致。
