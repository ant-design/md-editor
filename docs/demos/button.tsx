import { IconButton, ToggleButton } from '@ant-design/md-editor';
import { globalThemeToken, useCSSVariables } from '@ant-design/theme-token';
import { ChevronDown, CloseCircleFill, Plug, Plus } from '@sofa-design/icons';
import { Button, Flex } from 'antd';
import React from 'react';

export const BaseButtonDemo = () => {
  useCSSVariables('ThemeExample', globalThemeToken);
  return (
    <Flex
      gap={12}
      vertical
      style={{
        padding: '24px',
      }}
    >
      主按钮
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
      次按钮
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
      Ghost 按钮
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
      文本按钮
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button type="text">Text按钮</Button>
        <Button type="text" disabled>
          Text
        </Button>
        <Button type="text" loading>
          Text
        </Button>
      </Flex>
      CTA 按钮
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button type="primary">CTA 按钮</Button>
        <Button type="primary" disabled>
          CTA 按钮
        </Button>
        <Button type="primary" loading>
          CTA 按钮
        </Button>
      </Flex>
      按钮 - SM尺寸
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <Button size="small" color="default" variant="solid" icon={<Plus />}>
          主按钮
        </Button>
        <Button
          size="small"
          color="default"
          variant="solid"
          disabled
          icon={<Plus />}
        >
          主按钮
        </Button>
        <Button
          loading
          size="small"
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

export const IconButtonDemo = () => {
  useCSSVariables('ThemeExample', globalThemeToken);
  return (
    <Flex
      gap={12}
      vertical
      style={{
        padding: '24px',
      }}
    >
      主按钮
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <IconButton icon={<Plus />} />
        <IconButton icon={<Plus />} disabled />
        <IconButton icon={<Plus />} loading />
      </Flex>
      次按钮
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
      无边框按钮
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
    </Flex>
  );
};

export const ToggleButtonDemo = () => {
  useCSSVariables('ThemeExample', globalThemeToken);
  return (
    <Flex
      gap={12}
      vertical
      style={{
        padding: '24px',
      }}
    >
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <ToggleButton icon={<Plug />} triggerIcon={<ChevronDown />}>
          正常状态
        </ToggleButton>
        <ToggleButton icon={<Plug />} triggerIcon={<ChevronDown />} active>
          激活状态
        </ToggleButton>
        <ToggleButton icon={<Plug />} triggerIcon={<ChevronDown />} disabled>
          禁用状态
        </ToggleButton>
      </Flex>
    </Flex>
  );
};

export const CloseButtonDemo = () => {
  return (
    <Flex>
      <Button icon={<CloseCircleFill />} />
    </Flex>
  );
};

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexDirection: 'column',
      }}
    >
      <BaseButtonDemo /> <IconButtonDemo /> <ToggleButtonDemo />{' '}
      <CloseButtonDemo />
    </div>
  );
};
