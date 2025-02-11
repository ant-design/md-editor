/* eslint-disable @typescript-eslint/no-loop-func */
import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import React, { useEffect, useRef } from 'react';
import { parserMarkdown } from '../editor/parser/parserMarkdown';

const defaultValue =
  '\'\n\n在 Python 中遍历数组（通常指列表 `list`）有以下常用方法：\n\n---\n\n### 一、基础遍历方法\n1. **直接遍历元素**  \n   使用 `for-in` 循环直接访问每个元素：\n   ```python\n   arr = [1, 2, 3, 4]\n   for num in arr:\n       print(num)  # 输出每个元素的值\n   ```  \n   这是最简洁直观的方式 [^DOC_1] [^DOC_2] [^DOC_7]。\n\n2. **通过索引遍历**  \n   结合 `range(len())` 获取索引：\n   ```python\n   for i in range(len(arr)):\n       print(arr[i])  # 通过索引访问元素\n   ```  \n   适用于需要修改元素或根据索引操作的情况 [^DOC_1] [^DOC_8]。\n\n3. **同时获取索引和值（`enumerate`）**  \n   ```python\n   for index, value in enumerate(arr):\n       print(f"索引 {index} 的值是 {value}")\n   ```  \n   适合需要索引和元素的场景 [^DOC_5] [^DOC_8]。\n\n---\n\n### 二、其他遍历方式\n4. **使用 `while` 循环**  \n   通过计数器手动控制遍历：\n   ```python\n   i = 0\n   while i < len(arr):\n       print(arr[i])\n       i += 1  # 必须手动递增\n   ```  \n   灵活性高但需注意避免无限循环 [^DOC_1] [^DOC_9] [^DOC_10]。\n\n5. **列表推导式**  \n   快速生成新列表的同时遍历：\n   ```python\n   squared = [x**2 for x in arr]  # 遍历并计算平方\n   ```  \n   适用于需要转换元素的场景 [^DOC_4] [^DOC_7] [^DOC_9]。\n\n---\n\n### 三、特殊场景方法\n6. **递归遍历**（不常用）  \n   ```python\n   def traverse(arr, i=0):\n       if i < len(arr):\n           print(arr[i])\n\';';

export default () => {
  const instance = useRef<MarkdownEditorInstance>();
  useEffect(() => {
    let md = '';
    const list = defaultValue.split('');
    const html = document.getElementById('container');
    const run = async () => {
      if (process.env.NODE_ENV === 'test') {
        instance.current?.store.updateNodeList(
          parserMarkdown(defaultValue).schema,
        );
        return;
      }
      for await (const item of list) {
        md += item;
        await new Promise((resolve) => {
          setTimeout(() => {
            instance.current?.store.updateNodeList(parserMarkdown(md).schema);
            resolve(true);
            html?.scrollTo?.({
              top: 99999999999999,
              behavior: 'smooth',
            });
          }, 1);
        });
      }
    };
    run();
  }, []);
  return (
    <>
      <MarkdownEditor
        editorRef={instance}
        style={{
          width: '100vw',
        }}
        readonly
      />
    </>
  );
};
