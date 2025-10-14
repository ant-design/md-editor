/**
 * title: 代码编辑器主题配置
 * description: 演示如何为代码编辑器配置不同的主题，支持多种浅色和深色主题
 */
import { MarkdownEditor } from '@ant-design/md-editor';
import { Select, Space } from 'antd';
import { useState } from 'react';

export default () => {
  const [theme, setTheme] = useState('chrome');

  const themes = [
    { label: 'Chrome (默认浅色)', value: 'chrome' },
    { label: 'GitHub', value: 'github' },
    { label: 'Solarized Light', value: 'solarized_light' },
    { label: 'Textmate', value: 'textmate' },
    { label: 'XCode', value: 'xcode' },
    { label: 'Monokai (深色)', value: 'monokai' },
    { label: 'Dracula', value: 'dracula' },
    { label: 'Tomorrow Night', value: 'tomorrow_night' },
    { label: 'Twilight', value: 'twilight' },
    { label: 'Solarized Dark', value: 'solarized_dark' },
    { label: 'Nord Dark', value: 'nord_dark' },
    { label: 'Cobalt', value: 'cobalt' },
  ];

  const initValue = \`# 代码编辑器主题示例

通过 \\\`codeProps.theme\\\` 属性可以为代码块配置不同的主题。

## JavaScript 示例

\\\`\\\`\\\`javascript
// 斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log('斐波那契数列第10项:', result);
\\\`\\\`\\\`

## Python 示例

\\\`\\\`\\\`python
# 快速排序算法
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(numbers))
\\\`\\\`\\\`
\`;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div
        style={{
          padding: '12px 16px',
          background: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <Space>
          <span style={{ fontWeight: 500 }}>选择代码主题：</span>
          <Select
            value={theme}
            onChange={setTheme}
            options={themes}
            style={{ width: 220 }}
          />
        </Space>
      </div>
      <MarkdownEditor
        initValue={initValue}
        codeProps={{
          theme: theme,
          fontSize: 14,
          showLineNumbers: true,
          showGutter: true,
          wrap: true,
          tabSize: 2,
        }}
        height="600px"
      />
    </Space>
  );
};
