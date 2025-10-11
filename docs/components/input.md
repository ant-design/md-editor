---
title: Input 输入框
group:
  title: 基础组件
  order: 4
---

# Input 输入框

输入框组件用于用户输入文本。

## 代码演示

```tsx
import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, Flex } from 'antd';
import React from 'react';

export default () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Input & Select</h1>

      <div style={{ marginBottom: '24px' }}>
        <h3>Input 输入框</h3>
        <Flex
          gap={12}
          vertical
          style={{
            border: '2px dashed #8358F6',
            padding: '24px',
          }}
        >
          <Input prefix={<SearchOutlined />} placeholder="请输入" />
          <Input
            prefix={<SearchOutlined />}
            value="已经输入值"
            placeholder="请输入"
          />
          <Input prefix={<SearchOutlined />} disabled placeholder="请输入" />
          <Input
            prefix={<SearchOutlined />}
            disabled
            value="已经输入值"
            placeholder="请输入"
          />
        </Flex>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Select 选择器</h3>
        <Flex
          gap={12}
          vertical
          style={{
            border: '2px dashed #8358F6',
            padding: '24px',
          }}
        >
          <Select prefix={<SearchOutlined />} placeholder="请输入" />
          <Select
            prefix={<SearchOutlined />}
            value="已经输入值"
            placeholder="请输入"
          />
          <Select prefix={<SearchOutlined />} disabled placeholder="请输入" />
          <Select
            prefix={<SearchOutlined />}
            disabled
            value="已经输入值"
            placeholder="请输入"
          />
        </Flex>
      </div>
    </div>
  );
};
```
