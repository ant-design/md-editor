# AttachmentButton 国际化支持

## 概述

`AttachmentButton` 组件现在完全支持国际化，所有用户界面文本都可以根据语言环境自动切换。

## 支持的语言

- 简体中文 (zh-CN)
- 英文 (en-US)

## 使用方法

### 基础用法

在应用的根组件中使用 `I18nProvide` 包裹：

```tsx
import { I18nProvide } from '@ant-design/md-editor';
import { AttachmentButton } from '@ant-design/md-editor';

function App() {
  return (
    <I18nProvide defaultLanguage="zh-CN">
      <AttachmentButton
        fileMap={fileMap}
        onFileMapChange={handleFileMapChange}
        upload={uploadFileToServer}
      />
    </I18nProvide>
  );
}
```

### 切换语言

使用 `I18nContext` 来切换语言：

```tsx
import { I18nContext } from '@ant-design/md-editor';
import { useContext } from 'react';

function LanguageSwitcher() {
  const { language, setLanguage } = useContext(I18nContext);
  
  return (
    <button onClick={() => setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}>
      切换语言 / Switch Language
    </button>
  );
}
```

### 自动检测语言

`I18nProvide` 默认会自动检测用户的语言偏好，检测优先级：

1. localStorage 中保存的用户选择
2. Ant Design ConfigProvider 的 locale
3. 浏览器语言设置
4. 默认语言（zh-CN）

```tsx
<I18nProvide autoDetect={true}>
  <App />
</I18nProvide>
```

## 国际化文本

### 新增的翻译 Key

本次更新为 `AttachmentButton` 组件添加了以下翻译 key：

| Key | 中文 | 英文 | 说明 |
|-----|------|------|------|
| `markdownInput.maxFileCountExceeded` | 最多只能上传 ${maxFileCount} 个文件 | Maximum ${maxFileCount} files allowed | 超过最大文件数量限制 |
| `markdownInput.minFileCountRequired` | 至少需要上传 ${minFileCount} 个文件 | At least ${minFileCount} files required | 未达到最小文件数量要求 |
| `uploadFailed` | 上传失败 | Upload failed | 文件上传失败 |

### 已有的相关翻译

- `uploading`: 上传中... / Uploading...
- `uploadSuccess`: 上传成功 / Upload succeeded
- `markdownInput.fileSizeExceeded`: 文件大小超过 ${maxSize} KB / File size exceeds ${maxSize} KB

## 实现细节

### 模板变量替换

使用 `compileTemplate` 函数进行模板变量替换：

```typescript
import { compileTemplate } from '@ant-design/md-editor';

const message = compileTemplate(
  locale['markdownInput.maxFileCountExceeded'],
  { maxFileCount: '5' }
);
// 中文: "最多只能上传 5 个文件"
// 英文: "Maximum 5 files allowed"
```

### 向后兼容

所有国际化文本都提供了默认值（fallback），确保在没有提供 locale 的情况下仍能正常工作：

```typescript
message.error(
  props.locale?.uploadFailed || 'Upload failed'
);
```

## 自定义语言包

你可以提供自定义的语言包：

```tsx
import { I18nProvide, cnLabels } from '@ant-design/md-editor';

const customLocale = {
  ...cnLabels,
  uploadFailed: '上传出错了！',
  'markdownInput.maxFileCountExceeded': '文件太多了，最多 ${maxFileCount} 个',
};

<I18nProvide locale={customLocale}>
  <App />
</I18nProvide>
```

## 注意事项

1. 确保在应用的根组件使用 `I18nProvide` 包裹
2. 使用 `compileTemplate` 函数替换模板中的变量
3. 所有用户可见的文本都应该使用国际化
4. 提供合理的默认值以确保向后兼容

## 测试

运行以下命令测试国际化功能：

```bash
npm test AttachmentButton
```

所有 17 个 `AttachmentButtonPopover` 测试应该全部通过。

