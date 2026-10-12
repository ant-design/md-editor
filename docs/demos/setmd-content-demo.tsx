/**
 * title: setMDContent 动态加载示例
 * description: 演示如何使用 setMDContent 方法动态加载长文档，并使用 options 优化性能
 */
import {
  BaseMarkdownEditor,
  MarkdownEditorInstance,
} from '@ant-design/agentic-ui';
import { Button, Progress, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const TOTAL_CHAPTERS = 200;
const GENERATION_BATCH_SIZE = 25;

/** 按帧生成演示文档；取消时释放累积内容，阻止后续帧继续工作。 */
export const generateVeryLongContent = (
  signal: AbortSignal,
  onProgress?: (progress: number) => void,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const sections: string[] = [];
    let frame: number | undefined;
    let chapter = 1;

    const handleAbort = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      signal.removeEventListener('abort', handleAbort);
      sections.length = 0;
      reject(new DOMException('Operation was cancelled', 'AbortError'));
    };

    const generateBatch = () => {
      frame = undefined;
      if (signal.aborted) return;
      const end = Math.min(chapter + GENERATION_BATCH_SIZE, TOTAL_CHAPTERS + 1);
      for (; chapter < end; chapter++) {
        sections.push(`# 第 ${chapter} 章\n\n`);
        sections.push(
          `这是第 ${chapter} 章的内容。包含大量的文本内容用于测试性能优化。\n\n`,
        );
        sections.push(`## ${chapter}.1 第一节\n\n`);
        sections.push(`这是第一节的内容。**加粗文本**和*斜体文本*的示例。\n\n`);
        sections.push(`> 这是一个引用块，包含重要的提示信息。\n\n`);
        sections.push(
          `\`\`\`javascript\n// 代码块示例\nconst chapter = ${chapter};\nconsole.log('Chapter:', chapter);\nfor (let j = 0; j < 100; j++) {\n  console.log('Line:', j);\n}\n\`\`\`\n\n`,
        );
        sections.push(`## ${chapter}.2 第二节\n\n`);
        sections.push(
          `- 列表项 1 - 重要内容\n- 列表项 2 - 关键信息\n- 列表项 3 - 核心概念\n\n`,
        );
        sections.push(`1. 有序列表 1\n2. 有序列表 2\n3. 有序列表 3\n\n`);
        sections.push(`-----------------------------------\n\n`);
      }
      onProgress?.((chapter - 1) / TOTAL_CHAPTERS);
      if (signal.aborted) return;
      if (chapter <= TOTAL_CHAPTERS) {
        frame = requestAnimationFrame(generateBatch);
      } else {
        signal.removeEventListener('abort', handleAbort);
        resolve(sections.join(''));
      }
    };

    if (signal.aborted) {
      handleAbort();
      return;
    }
    signal.addEventListener('abort', handleAbort, { once: true });
    frame = requestAnimationFrame(generateBatch);
  });

interface LoadOperation {
  controller: AbortController;
  store: MarkdownEditorInstance['store'];
}

export default () => {
  const editorRef = useRef<MarkdownEditorInstance>(null);
  const operationRef = useRef<LoadOperation | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [loadTime, setLoadTime] = useState(0);
  const [generateTime, setGenerateTime] = useState(0);
  const [firstDisplayTime, setFirstDisplayTime] = useState(0);

  const cancelCurrentOperation = () => {
    const operation = operationRef.current;
    operationRef.current = null;
    operation?.controller.abort();
    operation?.store.cancelSetMDContent();
  };

  useEffect(() => () => cancelCurrentOperation(), []);

  const handleCancel = () => {
    cancelCurrentOperation();
    setLoading(false);
    setGenerating(false);
    setProgress(0);
    setGenerateProgress(0);
    setLoadTime(0);
  };

  const handleLoad = async (optimized: boolean) => {
    const store = editorRef.current?.store;
    if (!store) return;
    cancelCurrentOperation();
    const operation = { controller: new AbortController(), store };
    operationRef.current = operation;
    const isCurrent = () =>
      operationRef.current === operation &&
      !operation.controller.signal.aborted;
    setLoading(true);
    setGenerating(true);
    setProgress(0);
    setGenerateProgress(0);
    setLoadTime(0);
    setGenerateTime(0);
    setFirstDisplayTime(0);
    const startGenerateTime = performance.now();

    try {
      const longContent = await generateVeryLongContent(
        operation.controller.signal,
        (p) => {
          if (isCurrent()) setGenerateProgress(Math.round(p * 100));
        },
      );
      if (!isCurrent()) return;
      setGenerateTime(Math.round(performance.now() - startGenerateTime));
      setGenerating(false);

      const startLoadTime = performance.now();
      let firstDisplayed = false;
      await store.setMDContent(
        longContent,
        undefined,
        optimized
          ? {
              chunkSize: 5000,
              separator: '\n\n',
              useRAF: true,
              batchSize: 20,
              onProgress: (p) => {
                if (!isCurrent()) return;
                setProgress(Math.round(p * 10000) / 100);
                if (p > 0 && !firstDisplayed) {
                  firstDisplayed = true;
                  setFirstDisplayTime(
                    Math.round(performance.now() - startLoadTime),
                  );
                }
              },
            }
          : undefined,
      );
      if (!isCurrent()) return;
      const elapsed = Math.round(performance.now() - startLoadTime);
      setLoadTime(elapsed);
      setProgress(100);
      if (!optimized) setFirstDisplayTime(elapsed);
    } catch (error) {
      if (isCurrent()) console.error('加载失败:', error);
    } finally {
      if (isCurrent()) {
        operationRef.current = null;
        setLoading(false);
        setGenerating(false);
      }
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
            <strong>加载长文档（{TOTAL_CHAPTERS} 个章节）</strong>
          </div>

          <Space wrap>
            <Button
              type="primary"
              onClick={() => handleLoad(true)}
              disabled={loading}
              loading={loading}
            >
              使用优化加载
            </Button>
            <Button
              onClick={() => handleLoad(false)}
              loading={loading}
              disabled={loading}
            >
              不使用优化加载
            </Button>
            <Button danger onClick={handleCancel} disabled={!loading}>
              取消加载
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
                  首次显示耗时: <strong>{firstDisplayTime}ms</strong>
                </div>
                <div style={{ marginTop: 4 }}>
                  编辑器加载时间: <strong>{loadTime}ms</strong>
                </div>
                <div style={{ marginTop: 4 }}>
                  总耗时: <strong>{generateTime + loadTime}ms</strong>
                </div>
              </div>
              <div style={{ marginTop: 8, color: '#666' }}>
                {firstDisplayTime < 500
                  ? '✅ 首次显示速度很快，用户体验优秀'
                  : firstDisplayTime < 1000
                    ? '✅ 首次显示速度良好，用户体验流畅'
                    : '⚠️ 首次显示时间较长，建议使用优化选项'}
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
            <strong>💡 优化说明：</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              <li>
                <strong>内容生成阶段</strong>：使用 RAF 分批生成（每批{' '}
                {GENERATION_BATCH_SIZE} 个章节）
              </li>
              <li>
                <strong>编辑器加载阶段</strong>（使用优化）：
                <ul style={{ marginTop: 4, paddingLeft: 16 }}>
                  <li>RAF 边解析边插入，实时显示内容</li>
                  <li>每帧处理少量 chunks，避免阻塞主线程</li>
                  <li>用户可以看到内容逐步加载，体验更好</li>
                  <li>首次显示耗时：从开始加载到用户首次看到内容的时间</li>
                  <li>支持取消操作：可以中断正在进行的加载过程</li>
                </ul>
              </li>
              <li>
                <strong>不使用优化</strong>：一次性同步解析和插入，会卡住页面
              </li>
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
            <strong>⚠️ 性能对比：</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              <li>
                <strong>使用优化</strong>：生成 + 边解析边插入 全程使用
                RAF，页面流畅，内容实时显示，首次显示耗时更短
              </li>
              <li>
                <strong>不使用优化</strong>
                ：解析和插入阶段会卡住主线程，页面冻结，首次显示耗时等于总加载时间
              </li>
              <li>建议首次测试使用"优化加载"观察效果</li>
              <li>注意观察浏览器的响应性和进度条的流畅度</li>
              <li>对比两种方式的首次显示耗时差异</li>
            </ul>
          </div>
        </Space>
      </div>

      <BaseMarkdownEditor editorRef={editorRef} readonly={true} height={480} />
    </div>
  );
};
