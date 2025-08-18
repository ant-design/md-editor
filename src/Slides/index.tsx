import React, { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import { BaseMarkdownEditor } from '../MarkdownEditor';

import './white.css';

/**
 * 将Markdown内容分割为幻灯片
 *
 * 该函数根据Markdown内容的结构将其分割为多个幻灯片页面。
 * 优先按二级标题分割，如果没有二级标题则按段落分割。
 *
 * @param {string} markdown - 要分割的Markdown内容
 * @returns {string[]} 分割后的Markdown片段数组
 *
 * @example
 * ```tsx
 * const slides = splitMarkdown('# 标题\n## 第一页\n内容1\n## 第二页\n内容2');
 * // 返回: ['# 标题', '## 第一页\n内容1', '## 第二页\n内容2']
 * ```
 */
const splitMarkdown = (markdown: string) => {
  if (markdown.includes('\n##')) {
    return markdown.split('\n##').map((line, index) => {
      if (!line?.startsWith('#') && index !== 0) {
        return `##` + line;
      }
      return line;
    });
  }
  if (markdown.length > 100) {
    return markdown.split('\n\n');
  }
  return [markdown];
};

/**
 * Slides 组件 - 幻灯片演示组件
 *
 * 该组件基于Reveal.js实现幻灯片演示功能，支持Markdown内容的自动分割和渲染。
 * 提供完整的幻灯片展示功能，包括过渡动画、导航控制等。
 *
 * @component
 * @description 幻灯片演示组件，基于Reveal.js实现
 * @param {Object} props - 组件属性
 * @param {string} props.initValue - 初始Markdown内容
 *
 * @example
 * ```tsx
 * <Slides
 *   initValue="# 欢迎\n## 第一页\n这是第一页内容\n## 第二页\n这是第二页内容"
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的幻灯片演示组件
 *
 * @remarks
 * - 基于Reveal.js实现幻灯片功能
 * - 自动将Markdown内容分割为幻灯片
 * - 支持二级标题自动分页
 * - 提供幻灯片过渡动画
 * - 集成BaseMarkdownEditor渲染
 * - 支持全屏显示
 * - 响应式布局适配
 * - 自动初始化Reveal.js
 */
export function Slides(props: { initValue: string }) {
  const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
  const deckRef = useRef<any | null>(null); // reference to deck reveal instance

  useEffect(() => {
    const init = async () => {
      if (deckRef.current) return;
      deckRef.current = new Reveal(deckDivRef.current!, {
        transition: 'slide',
      });
      deckRef.current.initialize({}).then(() => {
        console.log('Reveal.js initialized.');
      });
      return () => {
        try {
          if (deckRef.current) {
            deckRef.current.destroy();
            deckRef.current = null;
          }
        } catch (e) {
          console.warn('Reveal.js destroy call failed.');
        }
      };
    };
    init();
  }, []);

  return (
    <div
      className="reveal"
      ref={deckDivRef}
      style={{
        height: '100vh',
      }}
    >
      <div className="slides">
        {
          splitMarkdown(props.initValue)?.map((line, index) => {
            return (
              <section key={index}>
                <BaseMarkdownEditor
                  readonly
                  toc={false}
                  reportMode
                  style={{
                    height: '100%',
                    padding: 0,
                    margin: 0,
                    width: '100%',
                  }}
                  editorStyle={{
                    maxHeight: '80vh',
                    overflow: 'auto',
                  }}
                  contentStyle={{
                    width: '100%',
                    padding: 0,
                    margin: 0,
                    height: '100%',
                    overflow: 'hidden',
                  }}
                  initValue={line}
                />
              </section>
            );
          }) as React.ReactNode[]
        }
      </div>
    </div>
  );
}
