# SchemaEditor 国际化支持

## 概述

SchemaEditor 组件现已完全支持国际化，提供中英文界面切换功能。所有用户界面文本、错误信息、提示信息都已实现多语言支持。

## 功能特性

### ✅ 已实现的国际化功能

1. **界面文本国际化**
   - 所有按钮文本（运行、复制等）
   - 所有标题文本（HTML模板、Schema JSON、实时预览等）
   - 所有提示信息

2. **错误信息国际化**
   - Schema 序列化错误信息
   - Schema 解析错误信息
   - 验证失败信息
   - 复制失败信息

3. **状态信息国际化**
   - 空状态提示信息
   - 预览加载失败信息
   - 复制成功/失败信息

4. **默认值国际化**
   - 默认 Schema 名称

## 使用方法

### 基本用法

```tsx
import { I18nProvide } from '@ant-design/md-editor';
import { SchemaEditor } from '@ant-design/md-editor';

function App() {
  return (
    <I18nProvide defaultLanguage="zh-CN">
      <SchemaEditor
        initialSchema={schema}
        initialValues={values}
        height={600}
      />
    </I18nProvide>
  );
}
```

### 语言切换

```tsx
import { useState } from 'react';
import { I18nProvide } from '@ant-design/md-editor';
import { SchemaEditor } from '@ant-design/md-editor';

function App() {
  const [language, setLanguage] = useState<'zh-CN' | 'en-US'>('zh-CN');

  return (
    <I18nProvide defaultLanguage={language} autoDetect={false}>
      <button
        onClick={() =>
          setLanguage((lang) => (lang === 'zh-CN' ? 'en-US' : 'zh-CN'))
        }
      >
        切换语言
      </button>
      <SchemaEditor
        initialSchema={schema}
        initialValues={values}
        height={600}
      />
    </I18nProvide>
  );
}
```

## 国际化标签

### 新增的国际化标签

在 `src/i18n/locales.ts` 中新增了以下 SchemaEditor 相关的国际化标签：

#### 中文标签 (cnLabels)

```typescript
// SchemaEditor 相关
'schemaEditor.realtimePreview': '实时预览',
'schemaEditor.htmlTemplate': 'HTML模板',
'schemaEditor.schemaJson': 'Schema JSON',
'schemaEditor.run': '运行',
'schemaEditor.copy': '复制',
'schemaEditor.copySuccess': '内容已复制到剪贴板',
'schemaEditor.copyFailed': '复制失败',
'schemaEditor.noContentToCopy': '无可复制的内容',
'schemaEditor.validationFailed': '验证失败',
'schemaEditor.schemaSerializationError': 'Schema序列化错误',
'schemaEditor.schemaParseError': 'Schema解析错误',
'schemaEditor.previewLoadFailed': '预览加载失败',
'schemaEditor.checkSchemaFormat': '请检查schema格式是否正确',
'schemaEditor.inputSchemaToPreview': '右侧输入schema后，在这里展示卡片预览',
'schemaEditor.untitledSchema': 'Untitled Schema',
```

#### 英文标签 (enLabels)

```typescript
// SchemaEditor related
'schemaEditor.realtimePreview': 'Real-time Preview',
'schemaEditor.htmlTemplate': 'HTML Template',
'schemaEditor.schemaJson': 'Schema JSON',
'schemaEditor.run': 'Run',
'schemaEditor.copy': 'Copy',
'schemaEditor.copySuccess': 'Content copied to clipboard',
'schemaEditor.copyFailed': 'Copy failed',
'schemaEditor.noContentToCopy': 'No content to copy',
'schemaEditor.validationFailed': 'Validation failed',
'schemaEditor.schemaSerializationError': 'Schema serialization error',
'schemaEditor.schemaParseError': 'Schema parse error',
'schemaEditor.previewLoadFailed': 'Preview load failed',
'schemaEditor.checkSchemaFormat': 'Please check if the schema format is correct',
'schemaEditor.inputSchemaToPreview': 'Enter schema on the right to show card preview here',
'schemaEditor.untitledSchema': 'Untitled Schema',
```

## 技术实现

### 组件修改

1. **导入国际化 Hook**

   ```tsx
   import { I18nContext } from '../../i18n';
   ```

2. **使用国际化上下文**

   ```tsx
   const { locale } = useContext(I18nContext);
   ```

3. **替换硬编码文本**

   ```tsx
   // 之前
   <h3>实时预览</h3>

   // 之后
   <h3>{locale['schemaEditor.realtimePreview']}</h3>
   ```

### 测试更新

更新了 `tests/SchemaEditor.test.tsx` 文件：

1. **添加国际化测试包装器**

   ```tsx
   const TestWrapper: React.FC<{
     children: React.ReactNode;
     language?: 'zh-CN' | 'en-US';
   }> = ({ children, language = 'zh-CN' }) => (
     <I18nProvide defaultLanguage={language} autoDetect={false}>
       {children}
     </I18nProvide>
   );
   ```

2. **添加国际化测试用例**
   - 中文界面显示测试
   - 英文界面显示测试
   - 中英文空状态信息测试

## 演示

查看 `docs/demos/SchemaEditorI18nDemo.tsx` 文件，其中包含了一个完整的国际化演示，展示了：

- 语言切换功能
- 中英文界面对比
- 所有国际化功能的使用示例

## 兼容性

- ✅ 完全向后兼容
- ✅ 不影响现有功能
- ✅ 默认使用中文界面
- ✅ 支持自动语言检测

## 注意事项

1. **依赖要求**：确保在使用 SchemaEditor 时，组件被 `I18nProvide` 包装
2. **语言检测**：组件会自动检测用户的语言偏好，也可以通过 `defaultLanguage` 属性手动指定
3. **测试覆盖**：所有国际化功能都有对应的测试用例覆盖

## 未来扩展

如需添加更多语言支持，只需：

1. 在 `src/i18n/locales.ts` 中添加新的语言标签对象
2. 更新 `getLocaleByLanguage` 函数
3. 添加相应的测试用例

国际化功能已完全集成到 SchemaEditor 组件中，提供了完整的用户体验。
