import { DocCards } from '@ant-design/agentic-ui';
import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

/**
 * 模拟 LLM 流式产出表格行 → 卡片栅格渐进渲染。
 *
 * 真实场景里，`MarkdownEditor` 配合 `chartType: "docCards"` 会自动随表格
 * 增量解析逐行追加；这里直接演示 `DocCards` 组件在数据增长时的表现。
 */
const allRows = [
  {
    名称: 'Tailwind CSS Docs',
    地址: 'https://tailwindcss.com/docs',
    简介: '结构清晰、搜索与导航强',
    亮点: '交互式示例, 深链, 暗色模式',
  },
  {
    名称: 'MDN Web Docs',
    地址: 'https://developer.mozilla.org',
    简介: '权威 Web 平台参考',
    亮点: '多语言, 可折叠, 示例可编辑',
  },
  {
    名称: 'React 官网',
    地址: 'https://react.dev',
    简介: 'React 最新文档与 RFC',
    亮点: '流程图, Hooks 速查, 暗色主题',
  },
  {
    名称: 'Next.js Docs',
    地址: 'https://nextjs.org/docs',
    简介: 'App Router 与渲染策略一站说明',
    亮点: '双语, App Router 全量, 示例多',
  },
  {
    名称: 'Vite',
    地址: 'https://vitejs.dev',
    简介: '前端构建工具',
    亮点: 'ESM, HMR, 极速冷启动',
  },
  {
    名称: 'Vitest',
    地址: 'https://vitest.dev',
    简介: '基于 Vite 的测试运行器',
    亮点: 'TS 原生, 多线程, 兼容 Jest',
  },
];

const columns = [
  { title: '名称', dataIndex: '名称', key: '名称' },
  { title: '地址', dataIndex: '地址', key: '地址' },
  { title: '简介', dataIndex: '简介', key: '简介' },
  { title: '亮点', dataIndex: '亮点', key: '亮点' },
];

const DocCardsStreamingDemo: React.FC = () => {
  const [count, setCount] = useState(1);
  const data = useMemo(() => allRows.slice(0, count), [count]);

  useEffect(() => {
    if (count >= allRows.length) return;
    const timer = setTimeout(() => setCount((current) => current + 1), 1200);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div style={{ padding: 16, background: '#fafafa' }}>
      <Button
        onClick={() => setCount(1)}
        disabled={count < allRows.length}
        style={{ marginBottom: 16 }}
      >
        重新播放
      </Button>
      <DocCards
        title={`已加载 ${count} / ${allRows.length} 条`}
        columns={columns}
        data={data}
        cardColumns={2}
      />
    </div>
  );
};

export default DocCardsStreamingDemo;
