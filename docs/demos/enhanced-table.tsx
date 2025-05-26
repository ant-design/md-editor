import React from 'react';
import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  const initValue = `# 增强表格功能演示

这个演示展示了集成了 TripDocs 表格操作功能的增强表格编辑器。

## 功能特性

- ✅ 插入行（上方/下方）
- ✅ 插入列（左侧/右侧）  
- ✅ 删除行
- ✅ 删除列
- ✅ 删除整个表格
- ✅ 悬浮工具栏（选中表格时显示）

## 使用方法

1. 点击下面的表格
2. 当表格被选中时，会在右上角显示操作工具栏
3. 点击工具栏按钮可以进行各种表格操作

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
| 王五 | 28   | 广州 |

## 技术说明

这个增强表格功能是从 TripDocs 项目中提取的核心表格操作能力，并适配到了当前的 md-editor 项目中。主要包括：

- 表格操作逻辑（插入/删除行列）
- 悬浮工具栏组件
- 与现有 Handsontable 的集成

`;

  return (
    <div style={{ padding: '20px' }}>
      <MarkdownEditor
        initValue={initValue}
        height={600}
        // 启用增强表格功能（默认已启用）
        // enableEnhancedOperations={true}
 