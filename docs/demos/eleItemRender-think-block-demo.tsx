import { CodeNode, MarkdownEditor } from '@ant-design/agentic-ui';
import React, { useState } from 'react';

/**
 * eleItemRender Think 块自定义渲染 Demo
 *
 * 这个 demo 展示了如何使用 eleItemRender 属性来自定义 ```think 代码块的渲染效果。
 *
 * 功能特性：
 * 1. 自定义 Think 块渲染
 *    - 拦截 ```think 类型的代码块
 *    - 应用自定义的样式和布局
 *    - 添加交互功能（展开/收起）
 *    - 增强视觉效果和动画
 *
 * 2. 条件渲染
 *    - 根据内容长度选择不同的渲染组件
 *    - 短内容使用简单渲染（CustomThinkBlock）
 *    - 长内容使用高级渲染（AdvancedThinkBlock）
 *
 * 3. 交互功能
 *    - 展开/收起按钮（当内容超过 3 行时显示）
 *    - 悬停效果
 *    - 动画效果（脉冲、弹跳）
 *
 * 实现要点：
 * - 使用 eleProps.attributes 保持 Slate 编辑器的属性
 * - 通过 eleProps.children 保持子元素渲染
 * - 自定义组件可以包含交互功能和动画效果
 * - 支持响应式设计和主题定制
 */

/**
 * 自定义 Think 块渲染组件
 *
 * 简单的思考块渲染，适用于短内容：
 * - 包含头部图标和标题
 * - 渐变底部装饰
 * - 现代化的 UI 风格
 */
const CustomThinkBlock: React.FC<{ element: CodeNode }> = ({ element }) => {
  const content = element?.value ? String(element.value).trim() : '';

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        border: '2px solid #e9ecef',
        borderRadius: '8px',
        padding: '16px',
        margin: '12px 0',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            animation: 'pulse 2s infinite',
          }}
        />
        <span
          style={{
            fontWeight: '600',
            color: '#495057',
            fontSize: '13px',
          }}
        >
          🤔 AI 思考过程
        </span>
      </div>

      <div
        style={{
          color: '#495057',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          fontSize: '13px',
        }}
      >
        {content}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'linear-gradient(90deg, #007bff, #28a745, #ffc107, #dc3545)',
          borderRadius: '0 0 6px 6px',
        }}
      />
    </div>
  );
};

/**
 * 高级自定义 Think 块渲染组件
 *
 * 高级思考块渲染，适用于长内容：
 * - 展开/收起功能
 * - 渐变遮罩效果
 * - 交互式按钮
 * - 动画效果
 */
const AdvancedThinkBlock: React.FC<{ element: CodeNode }> = ({ element }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = element?.value ? String(element.value).trim() : '';

  const lineCount = content.split('\n').length;
  const shouldShowExpand = lineCount > 3;

  const previewContent =
    shouldShowExpand && !isExpanded
      ? content.split('\n').slice(0, 3).join('\n') + '\n...'
      : content;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e1e5e9',
        borderRadius: '12px',
        padding: '16px',
        margin: '16px 0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#667eea',
              animation: 'bounce 1.5s infinite',
            }}
          />
          <span
            style={{
              fontWeight: '600',
              color: '#2d3748',
              fontSize: '13px',
            }}
          >
            💭 深度思考
          </span>
        </div>

        {shouldShowExpand && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              padding: '4px 8px',
              borderRadius: '4px',
              transition:
                'background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        )}
      </div>

      <div
        style={{
          color: '#4a5568',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          fontSize: '13px',
          transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
          maxHeight: isExpanded ? 'none' : '120px',
          overflow: 'hidden',
        }}
      >
        {previewContent}
      </div>

      {shouldShowExpand && !isExpanded && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '16px',
            right: '16px',
            height: '20px',
            background: 'linear-gradient(transparent, #fff)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

/**
 * eleItemRender Think 块自定义渲染 Demo
 *
 * 样式特点：
 * - 使用 CSS 动画（pulse、bounce）
 * - 渐变背景和边框
 * - 响应式设计
 * - 现代化的 UI 风格
 *
 * 注意事项：
 * - 确保自定义渲染不会影响编辑器的其他功能
 * - 保持 Slate 编辑器的属性和子元素
 * - 考虑性能和可维护性
 * - 支持响应式设计
 */
const EleItemRenderThinkBlockDemo: React.FC = () => {
  const [value, setValue] = useState(`# eleItemRender Think 块自定义渲染 Demo

这是一个演示如何使用 \`eleItemRender\` 来自定义 think 代码块渲染的示例。

## 默认 Think 块

\`\`\`think
这是一个默认的 think 代码块
它会显示为灰色的思考内容
通常用于显示 AI 的思考过程
\`\`\`

## 自定义渲染的 Think 块

\`\`\`think
这是一个会被自定义渲染的 think 代码块
通过 eleItemRender 函数，我们可以：
1. 拦截 think 类型的代码块
2. 应用自定义的样式和布局
3. 添加交互功能（如展开/收起）
4. 增强视觉效果

这个块会被渲染为带有渐变背景和动画效果的组件
\`\`\`

## 长内容 Think 块

\`\`\`think
这是一个较长的 think 代码块，用于演示展开/收起功能。

第一行内容
第二行内容
第三行内容
第四行内容
第五行内容
第六行内容
第七行内容
第八行内容
第九行内容
第十行内容

当内容超过 3 行时，会自动显示展开/收起按钮。
\`\`\`

## 普通代码块（不受影响）

\`\`\`javascript
// 这是一个普通的 JavaScript 代码块
// 不会被 eleItemRender 修改
console.log('Hello World');
\`\`\`

## 使用说明

1. **eleItemRender 函数**：在 MarkdownEditor 组件中传入自定义的 eleItemRender 函数
2. **类型检查**：检查元素类型是否为 'code' 且 language 为 'think'
3. **条件渲染**：根据内容长度选择不同的渲染组件
4. **保持功能**：确保自定义渲染不会影响编辑器的其他功能

## 技术要点

- 使用 \`eleProps.attributes\` 保持 Slate 编辑器的属性
- 通过 \`eleProps.children\` 保持子元素渲染
- 自定义组件可以包含交互功能和动画效果
- 支持响应式设计和主题定制
`);

  /**
   * 自定义 eleItemRender 函数
   *
   * 实现原理：
   * 1. 类型检查：检查 element.type === 'code' 和 element.language === 'think'
   * 2. 保持属性：使用 {...eleProps.attributes} 保持 Slate 编辑器属性
   * 3. 保持子元素：通过 {eleProps.children} 保持子元素渲染
   * 4. 条件渲染：根据内容长度选择不同的自定义组件
   *
   * 使用方法：
   * 1. 在 MarkdownEditor 组件中传入 eleItemRender 属性
   * 2. 实现自定义的渲染函数
   * 3. 根据元素类型和属性进行条件判断
   * 4. 返回自定义的渲染结果
   */
  const customEleItemRender = (eleProps: any, defaultDom: any) => {
    // 检查是否为 think 类型的代码块
    if (
      eleProps.element.type === 'code' &&
      eleProps.element.language === 'think'
    ) {
      const codeElement = eleProps.element as CodeNode;
      const content = codeElement.value ? String(codeElement.value).trim() : '';
      const lineCount = content.split('\n').length;

      if (lineCount > 5) {
        // 长内容使用高级渲染
        return (
          <div {...eleProps.attributes}>
            <AdvancedThinkBlock element={codeElement} />
            {eleProps.children}
          </div>
        );
      } else {
        // 短内容使用简单渲染
        return (
          <div {...eleProps.attributes}>
            <CustomThinkBlock element={codeElement} />
            {eleProps.children}
          </div>
        );
      }
    }

    // 其他元素使用默认渲染
    return defaultDom;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d3748', marginBottom: '20px' }}>
        eleItemRender Think 块自定义渲染 Demo
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
          这个 demo 展示了如何使用 <code>eleItemRender</code> 属性来自定义
          <code>```think</code> 代码块的渲染效果。
        </p>
      </div>

      <div
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <MarkdownEditor
          initValue={value}
          onChange={setValue}
          eleItemRender={customEleItemRender}
          readonly={false}
          style={{
            minHeight: '600px',
            border: 'none',
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-8px,0); }
          70% { transform: translate3d(0,-4px,0); }
          90% { transform: translate3d(0,-2px,0); }
        }
      `}</style>
    </div>
  );
};

export default EleItemRenderThinkBlockDemo;
