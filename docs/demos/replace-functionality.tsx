import React, { useRef, useState } from 'react';
import { BaseEditor, createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import { withMarkdown } from '../../src/MarkdownEditor/editor/plugins/withMarkdown';
import { EditorStore } from '../../src/MarkdownEditor/editor/store';

/**
 * EditorStore 替换功能演示
 *
 * 本演示展示了如何使用 EditorStore 的三种替换方法：
 * 1. replaceText - 全局文本替换
 * 2. replaceTextInSelection - 在选中区域内替换
 * 3. replaceAll - 替换所有匹配的文本（简化版本）
 */
export default function ReplaceFunctionalityDemo() {
  const editorRef = useRef<BaseEditor & ReactEditor & HistoryEditor>(
    withMarkdown(withHistory(withReact(createEditor()))),
  );

  const [store] = useState(() => new EditorStore(editorRef));
  const [searchText, setSearchText] = useState('hello');
  const [replaceText, setReplaceText] = useState('hi');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const handleReplaceAll = () => {
    const count = store.replaceText(searchText, replaceText, {
      caseSensitive,
      wholeWord,
      replaceAll: true,
    });
    alert(`替换了 ${count} 个匹配项`);
  };

  const handleReplaceFirst = () => {
    const count = store.replaceText(searchText, replaceText, {
      caseSensitive,
      wholeWord,
      replaceAll: false,
    });
    alert(`替换了 ${count} 个匹配项`);
  };

  const handleReplaceInSelection = () => {
    const count = store.replaceTextInSelection(searchText, replaceText, {
      caseSensitive,
      wholeWord,
      replaceAll: true,
    });
    alert(`在选中区域内替换了 ${count} 个匹配项`);
  };

  const handleReplaceAllSimple = () => {
    const count = store.replaceAll(searchText, replaceText, caseSensitive);
    alert(`替换了 ${count} 个匹配项`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>EditorStore 替换功能演示</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>替换选项</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>
            搜索文本:
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginLeft: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            替换文本:
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              style={{ marginLeft: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            区分大小写
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
            />
            完整单词匹配
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>替换操作</h3>
        <button
          type="button"
          onClick={handleReplaceAll}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          替换所有匹配项
        </button>
        <button
          type="button"
          onClick={handleReplaceFirst}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          只替换第一个匹配项
        </button>
        <button
          type="button"
          onClick={handleReplaceInSelection}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          在选中区域内替换
        </button>
        <button
          type="button"
          onClick={handleReplaceAllSimple}
          style={{ padding: '5px 10px' }}
        >
          简化替换所有 (replaceAll)
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>使用说明</h3>
        <ul>
          <li>
            <strong>replaceText</strong>: 最灵活的方法，支持所有选项
          </li>
          <li>
            <strong>replaceTextInSelection</strong>:
            只在选中的文本区域内进行替换
          </li>
          <li>
            <strong>replaceAll</strong>:
            简化的替换所有方法，只需要指定是否区分大小写
          </li>
          <li>
            <strong>完整单词匹配</strong>:
            只匹配完整的单词，不会匹配单词的一部分
          </li>
          <li>
            <strong>区分大小写</strong>: 精确匹配大小写
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>示例文本</h3>
        <p>Hello world, hello universe! Another hello message here.</p>
        <p>尝试用不同的选项替换 "hello" 为 "hi"。</p>
      </div>
    </div>
  );
}
