import {
  cleanHtml,
  extractTextFromHtml,
  htmlToMarkdown,
  isHtml,
} from '@ant-design/md-editor';
import React, { useState } from 'react';

const HtmlToMarkdownDemo: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState(`
    <h1>HTML 到 Markdown 转换演示</h1>
    <p>这是一个<strong>粗体</strong>和<em>斜体</em>文本的示例。</p>
    <blockquote>
      这是一个引用块，用于展示引用功能。
    </blockquote>
    <ul>
      <li>无序列表项 1</li>
      <li>无序列表项 2</li>
    </ul>
    <ol>
      <li>有序列表项 1</li>
      <li>有序列表项 2</li>
    </ol>
    <p>这是一个<a href="https://example.com">链接</a>的示例。</p>
    <img src="image.jpg" alt="示例图片" title="图片标题">
    <pre><code class="language-javascript">console.log("Hello, World!");</code></pre>
  `);

  const [markdownOutput, setMarkdownOutput] = useState('');
  const [isHtmlText, setIsHtmlText] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const handleConvert = () => {
    const markdown = htmlToMarkdown(htmlInput);
    setMarkdownOutput(markdown);
  };

  const handleCheckHtml = () => {
    const isHtmlResult = isHtml(htmlInput);
    setIsHtmlText(isHtmlResult);
  };

  const handleExtractText = () => {
    const text = extractTextFromHtml(htmlInput);
    setExtractedText(text);
  };

  const handleCleanHtml = () => {
    const cleaned = cleanHtml(htmlInput);
    setHtmlInput(cleaned);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>HTML 到 Markdown 转换工具演示</h1>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        <div>
          <h3>HTML 输入</h3>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            style={{
              width: '100%',
              height: '400px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="输入 HTML 内容..."
          />

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleConvert}
              style={{ padding: '8px 16px' }}
            >
              转换为 Markdown
            </button>
            <button
              type="button"
              onClick={handleCheckHtml}
              style={{ padding: '8px 16px' }}
            >
              检测是否为 HTML
            </button>
            <button
              type="button"
              onClick={handleExtractText}
              style={{ padding: '8px 16px' }}
            >
              提取纯文本
            </button>
            <button
              type="button"
              onClick={handleCleanHtml}
              style={{ padding: '8px 16px' }}
            >
              清理 HTML
            </button>
          </div>

          {isHtmlText !== null && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: isHtmlText ? '#d4edda' : '#f8d7da',
                borderRadius: '4px',
              }}
            >
              {isHtmlText ? '✅ 检测到 HTML 内容' : '❌ 未检测到 HTML 内容'}
            </div>
          )}

          {extractedText && (
            <div style={{ marginTop: '10px' }}>
              <h4>提取的纯文本：</h4>
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
              >
                {extractedText}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3>Markdown 输出</h3>
          <textarea
            value={markdownOutput}
            readOnly
            style={{
              width: '100%',
              height: '400px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
            }}
            placeholder="转换后的 Markdown 将显示在这里..."
          />

          <div style={{ marginTop: '10px' }}>
            <h4>功能说明：</h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <li>
                <strong>转换为 Markdown</strong>：将 HTML 内容转换为 Markdown
                格式
              </li>
              <li>
                <strong>检测是否为 HTML</strong>：检查输入内容是否包含 HTML 标签
              </li>
              <li>
                <strong>提取纯文本</strong>：从 HTML 中提取纯文本内容
              </li>
              <li>
                <strong>清理 HTML</strong>：移除 HTML 中的多余空白和换行
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h3>支持的 HTML 标签</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
          }}
        >
          <div>
            <h4>块级元素</h4>
            <ul style={{ fontSize: '13px' }}>
              <li>&lt;h1&gt; - &lt;h6&gt; → # - ######</li>
              <li>&lt;p&gt; → 段落</li>
              <li>&lt;blockquote&gt; → &gt;</li>
              <li>&lt;pre&gt; → 代码块</li>
              <li>&lt;ul&gt;, &lt;ol&gt; → 列表</li>
              <li>&lt;table&gt; → 表格</li>
              <li>&lt;hr&gt; → 分隔线</li>
            </ul>
          </div>
          <div>
            <h4>内联元素</h4>
            <ul style={{ fontSize: '13px' }}>
              <li>&lt;strong&gt;, &lt;b&gt; → **粗体**</li>
              <li>&lt;em&gt;, &lt;i&gt; → *斜体*</li>
              <li>&lt;del&gt;, &lt;s&gt; → ~~删除线~~</li>
              <li>&lt;code&gt; → 内联代码</li>
              <li>&lt;a&gt; → [链接](URL)</li>
              <li>&lt;img&gt; → ![图片](URL)</li>
              <li>&lt;br&gt; → 换行</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>htmlToMarkdown(html)</strong>: 将 HTML 字符串转换为 Markdown
            格式
          </li>
          <li>
            <strong>isHtml(text)</strong>: 检测文本是否包含 HTML 标签
          </li>
          <li>
            <strong>extractTextFromHtml(html)</strong>: 从 HTML 中提取纯文本内容
          </li>
          <li>
            <strong>cleanHtml(html)</strong>: 清理 HTML 中的多余空白和换行
          </li>
          <li>
            <strong>htmlInput</strong>: HTML 输入内容的状态变量
          </li>
          <li>
            <strong>markdownOutput</strong>: Markdown 输出内容的状态变量
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HtmlToMarkdownDemo;
