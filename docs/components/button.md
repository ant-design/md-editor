---
title: Button 按钮
group:
  title: 基础组件
  order: 2
---

# Button 按钮

按钮组件用于触发操作。

## 代码演示

```tsx
import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import React from 'react';
import {
  ThemeProvider,
  globalThemeToken,
  useCSSVariables,
} from '@ant-design/theme-token';

export default () => {
  useCSSVariables('ThemeExample', globalThemeToken);
  return (
    <Flex
      gap={12}
      vertical
      style={{
        padding: '24px',
      }}
    >
      <h1>Button</h1>
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button color="default" variant="solid" icon={<PlusOutlined />}>
          主按钮
        </Button>
        <Button
          color="default"
          variant="solid"
          disabled
          icon={<PlusOutlined />}
        >
          主按钮
        </Button>
        <Button
          loading
          color="default"
          variant="solid"
          style={{
            background: 'var(--color-gray-text-disabled)',
          }}
          icon={<PlusOutlined />}
        >
          主按钮
        </Button>
      </Flex>

      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button color="default" variant="filled" icon={<PlusOutlined />}>
          次按钮
        </Button>
        <Button
          color="default"
          variant="filled"
          disabled
          icon={<PlusOutlined />}
        >
          次按钮
        </Button>
        <Button
          loading
          color="default"
          variant="filled"
          icon={<PlusOutlined />}
        >
          次按钮
        </Button>
      </Flex>

      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button color="default" icon={<PlusOutlined />}>
          Ghost 按钮
        </Button>
        <Button color="default" disabled icon={<PlusOutlined />}>
          Ghost 按钮
        </Button>
        <Button loading color="default" icon={<PlusOutlined />}>
          Ghost 按钮
        </Button>
      </Flex>
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button type="text">Text按钮</Button>
        <Button type="text" disabled>
          Text(disabled)
        </Button>
        <Button type="text" loading>
          Text(loading)
        </Button>
      </Flex>

      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button type="primary">Primary按钮</Button>
        <Button type="primary" disabled>
          Primary(disabled)
        </Button>
        <Button type="primary" loading>
          Primary(loading)
        </Button>
      </Flex>

      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button icon={<PlusOutlined />} />
        <Button icon={<PlusOutlined />} disabled />
        <Button icon={<PlusOutlined />} loading />
      </Flex>
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button color="default" variant="filled" icon={<PlusOutlined />} />
        <Button
          color="default"
          variant="filled"
          icon={<PlusOutlined />}
          disabled
        />
        <Button
          color="default"
          variant="filled"
          icon={<PlusOutlined />}
          loading
        />
      </Flex>
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button color="default" variant="text" icon={<PlusOutlined />} />
        <Button
          color="default"
          variant="text"
          icon={<PlusOutlined />}
          disabled
        />
        <Button
          color="default"
          variant="text"
          icon={<PlusOutlined />}
          loading
        />
      </Flex>
    </Flex>
  );
};
```
