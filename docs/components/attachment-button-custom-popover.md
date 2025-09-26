---
title: AttachmentButton 自定义 Popover
atomId: AttachmentButtonCustomPopover
group:
  title: 组件
  order: 2
---

# 自定义附件按钮 Popover

通过 `customPopover` 属性，您可以完全替换默认的 `AttachmentButtonPopover` 组件，实现自定义的附件按钮交互体验。

## 代码演示

<code src="../demos/markdownInputField/custom-attachment-popover.tsx" background="var(--main-bg-color)" iframe=800></code>

## 属性定义

## 基础用法

### customPopover

| 参数          | 说明                    | 类型                                                | 默认值 | 版本 |
| ------------- | ----------------------- | --------------------------------------------------- | ------ | ---- |
| customPopover | 自定义 Popover 组件函数 | `(props: CustomPopoverProps) => React.ReactElement` | -      | -    |

### CustomPopoverProps

| 参数            | 说明                                    | 类型                                              | 默认值 | 版本 |
| --------------- | --------------------------------------- | ------------------------------------------------- | ------ | ---- |
| children        | 需要包装的子元素，通常是 Paperclip 图标 | `React.ReactNode`                                 | -      | -    |
| supportedFormat | 支持的文件格式配置                      | `AttachmentButtonPopoverProps['supportedFormat']` | -      | -    |

### supportedFormat

| 参数       | 说明                 | 类型              | 默认值 | 版本 |
| ---------- | -------------------- | ----------------- | ------ | ---- |
| type       | 文件类型名称         | `string`          | -      | -    |
| maxSize    | 最大文件大小（KB）   | `number`          | -      | -    |
| extensions | 支持的文件扩展名数组 | `string[]`        | -      | -    |
| icon       | 文件类型图标         | `React.ReactNode` | -      | -    |

## 兼容性

- 完全向后兼容，不使用 `customPopover` 时保持原有行为
- 支持所有现有的 `AttachmentButton` 属性
- 可与其他附件配置选项（如 `supportedFormat`、`maxFileSize` 等）配合使用
