/**
 * title: setMDContent 动态加载示例
 * description: 演示如何使用 setMDContent 方法动态加载长文档，并使用 options 优化性能
 */
import {
  BaseMarkdownEditor,
  MarkdownEditorInstance,
} from '@ant-design/md-editor';
import { Button, Progress, Space } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * 生成超长文档内容（异步分批生成）
 * 使用 requestAnimationFrame 避免阻塞主线程
 * @param onProgress - 进度回调函数
 * @returns Promise<string> - 生成的文档内容
 */
const generateVeryLongContent = async (
  onProgress?: (progress: number) => void,
): Promise<string> => {
  const sections: string[] = [];
  const totalChapters = 1000;
  const batchSize = 100; // 每批生成 100 章
  const totalBatches = Math.ceil(totalChapters / batchSize);

  return new Promise((resolve) => {
    let currentBatch = 0;

    const generateBatch = () => {
      const start = currentBatch * batchSize + 1;
      const end = Math.min((currentBatch + 1) * batchSize, totalChapters);

      // 生成当前批次的内容
      for (let i = start; i <= end; i++) {
        sections.push(`# 第 ${i} 章\n\n`);
        sections.push(
          `这是第 ${i} 章的内容。包含大量的文本内容用于测试性能优化。\n\n`,
        );
        sections.push(`## ${i}.1 第一节\n\n`);
        sections.push(`这是第一节的内容。**加粗文本**和*斜体文本*的示例。\n\n`);
        sections.push(`> 这是一个引用块，包含重要的提示信息。\n\n`);
        sections.push(
          `\`\`\`javascript\n// 代码块示例\nconst chapter = ${i};\nconsole.log('Chapter:', chapter);\nfor (let j = 0; j < 100; j++) {\n  console.log('Line:', j);\n}\n\`\`\`\n\n`,
        );
        sections.push(`## ${i}.2 第二节\n\n`);
        sections.push(
          `- 列表项 1 - 重要内容\n- 列表项 2 - 关键信息\n- 列表项 3 - 核心概念\n\n`,
        );
        sections.push(`1. 有序列表 1\n2. 有序列表 2\n3. 有序列表 3\n\n`);
        sections.push(`---\n\n`);
      }

      currentBatch++;

      // 更新进度
      if (onProgress) {
        onProgress(currentBatch / totalBatches);
      }

      // 如果还有批次，继续下一批
      if (currentBatch < totalBatches) {
        requestAnimationFrame(generateBatch);
      } else {
        // 所有批次完成，返回结果
        resolve(sections.join(''));
      }
    };

    // 开始生成第一批
    requestAnimationFrame(generateBatch);
  });
};

export default () => {
  const editorRef = useRef<MarkdownEditorInstance>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [loadTime, setLoadTime] = useState(0);
  const [generateTime, setGenerateTime] = useState(0);
  const [useOptimization, setUseOptimization] = useState(true);

  const handleLoadWithOptimization = async () => {
    setLoading(true);
    setGenerating(true);
    setProgress(0);
    setGenerateProgress(0);
    setGenerateTime(0);
    const startGenerateTime = performance.now();

    try {
      // 异步生成内容
      const longContent = await generateVeryLongContent((p) => {
        setGenerateProgress(Math.round(p * 100));
      });

      const endGenerateTime = performance.now();
      setGenerateTime(Math.round(endGenerateTime - startGenerateTime));
      setGenerating(false);

      // 加载到编辑器
      const startLoadTime = performance.now();
      await editorRef.current?.store.setMDContent(longContent, undefined, {
        chunkSize: 5000,
        separator: '\n\n',
        useRAF: true,
        batchSize: 50,
        onProgress: (p) => {
          setProgress(Math.round(p * 100));
        },
      });

      const endLoadTime = performance.now();
      setLoadTime(Math.round(endLoadTime - startLoadTime));
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
      setGenerating(false);
      setProgress(100);
      setGenerateProgress(100);
    }
  };

  const handleLoadWithoutOptimization = async () => {
    setLoading(true);
    setGenerating(true);
    setProgress(0);
    setGenerateProgress(0);
    setGenerateTime(0);
    const startGenerateTime = performance.now();

    try {
      // 异步生成内容
      const longContent = await generateVeryLongContent((p) => {
        setGenerateProgress(Math.round(p * 100));
      });

      const endGenerateTime = performance.now();
      setGenerateTime(Math.round(endGenerateTime - startGenerateTime));
      setGenerating(false);

      // 不使用 options，直接同步加载
      const startLoadTime = performance.now();
      editorRef.current?.store.setMDContent(longContent);

      const endLoadTime = performance.now();
      setLoadTime(Math.round(endLoadTime - startLoadTime));
      setProgress(100);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <strong>加载超长文档（约 100000 章节，50000000+ 字符）</strong>
          </div>

          <Space>
            <Button
              type="primary"
              onClick={handleLoadWithOptimization}
              loading={loading && useOptimization}
              disabled={loading}
            >
              使用优化加载
            </Button>
            <Button
              onClick={handleLoadWithoutOptimization}
              loading={loading && !useOptimization}
              disabled={loading}
            >
              不使用优化加载
            </Button>
          </Space>

          {generating && (
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500 }}>
                正在生成文档内容...
              </div>
              <Progress percent={generateProgress} status="active" />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                已生成 {generateProgress}%
              </div>
            </div>
          )}

          {loading && !generating && (
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500 }}>
                正在加载到编辑器...
              </div>
              <Progress percent={progress} status="active" />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                已加载 {progress}%
              </div>
            </div>
          )}

          {loadTime > 0 && !loading && (
            <div
              style={{
                padding: 12,
                background: loadTime < 1000 ? '#f6ffed' : '#fff7e6',
                border: `1px solid ${loadTime < 1000 ? '#b7eb8f' : '#ffd591'}`,
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              <div>
                <strong>✅ 加载完成！</strong>
              </div>
              <div style={{ marginTop: 8 }}>
                <div>
                  内容生成时间: <strong>{generateTime}ms</strong>
                </div>
                <div style={{ marginTop: 4 }}>
                  编辑器加载时间: <strong>{loadTime}ms</strong>
                </div>
                <div style={{ marginTop: 4 }}>
                  总耗时: <strong>{generateTime + loadTime}ms</strong>
                </div>
              </div>
              <div style={{ marginTop: 8, color: '#666' }}>
                {loadTime < 1000
                  ? '✅ 性能优异，用户体验流畅'
                  : '⚠️ 加载时间较长，建议使用优化选项'}
              </div>
            </div>
          )}

          <div
            style={{
              fontSize: 12,
              color: '#666',
              padding: 8,
              background: '#e6f7ff',
              borderRadius: 4,
            }}
          >
            <strong>💡 提示：</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              <li>内容生成使用 RAF 分批生成，避免阻塞（每批 100 章节）</li>
              <li>使用优化加载会分批处理，避免主线程阻塞</li>
              <li>不使用优化会一次性加载，可能导致页面卡顿</li>
              <li>观察两个阶段的加载时间和页面流畅度的差异</li>
            </ul>
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#ff4d4f',
              padding: 8,
              background: '#fff2e8',
              border: '1px solid #ffbb96',
              borderRadius: 4,
            }}
          >
            <strong>⚠️ 性能警告：</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              <li>生成 100000 章节需要较长时间（约 10-30 秒），请耐心等待</li>
              <li>建议首次测试使用"优化加载"选项</li>
              <li>低配置设备可能会遇到性能问题</li>
              <li>整个过程分为两个阶段：内容生成 + 编辑器加载</li>
            </ul>
          </div>
        </Space>
      </div>

      <BaseMarkdownEditor
        editorRef={editorRef}
        lazy={{
          enable: true,
          placeholderHeight: 100,
          rootMargin: '200px',
        }}
        readonly={true}
        height={600}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 8,
        }}
      />
    </div>
  );
};
