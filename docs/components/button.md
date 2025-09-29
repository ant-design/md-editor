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
import { Button, Flex } from 'antd';
import React from 'react';
import {
  ThemeProvider,
  globalThemeToken,
  useCSSVariables,
} from '@ant-design/theme-token';
import { Plus } from '@ant-design/md-editor/dist/icons';

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
        <Button color="default" variant="solid" icon={<Plus />}>
          主按钮
        </Button>
        <Button color="default" variant="solid" disabled icon={<Plus />}>
          主按钮
        </Button>
        <Button
          loading
          color="default"
          variant="solid"
          style={{
            background: 'var(--color-gray-text-disabled)',
          }}
          icon={<Plus />}
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
        <Button color="default" variant="filled" icon={<Plus />}>
          次按钮
        </Button>
        <Button color="default" variant="filled" disabled icon={<Plus />}>
          次按钮
        </Button>
        <Button loading color="default" variant="filled" icon={<Plus />}>
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
        <Button color="default" icon={<Plus />}>
          Ghost 按钮
        </Button>
        <Button color="default" disabled icon={<Plus />}>
          Ghost 按钮
        </Button>
        <Button loading color="default" icon={<Plus />}>
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
        <Button icon={<Plus />} />
        <Button icon={<Plus />} disabled />
        <Button icon={<Plus />} loading />
      </Flex>
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button color="default" variant="filled" icon={<Plus />} />
        <Button color="default" variant="filled" icon={<Plus />} disabled />
        <Button color="default" variant="filled" icon={<Plus />} loading />
      </Flex>
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button color="default" variant="text" icon={<Plus />} />
        <Button color="default" variant="text" icon={<Plus />} disabled />
        <Button color="default" variant="text" icon={<Plus />} loading />
      </Flex>

      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button size="large" color="default" variant="solid" icon={<Plus />}>
          主按钮
        </Button>
        <Button
          size="large"
          color="default"
          variant="solid"
          disabled
          icon={<Plus />}
        >
          主按钮
        </Button>
        <Button
          loading
          size="large"
          color="default"
          variant="solid"
          style={{
            background: 'var(--color-gray-text-disabled)',
          }}
          icon={<Plus />}
        >
          主按钮
        </Button>
      </Flex>
    </Flex>
  );
};
```
