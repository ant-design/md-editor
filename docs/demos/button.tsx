import { IconButton, TogalButton } from '@ant-design/md-editor';
import { globalThemeToken, useCSSVariables } from '@ant-design/theme-token';
import { ChevronDown, EllipsisVertical, Plug, Plus } from '@sofa-design/icons';
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
      Base
      <Flex
        vertical
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        悬浮按钮
        <Flex
          gap={12}
          style={{
            border: '2px dashed #8358F6',
            padding: '24px',
          }}
        >
          <IconButton elevated icon={<EllipsisVertical />} />
          <IconButton elevated icon={<EllipsisVertical />} disabled />
          <IconButton elevated icon={<EllipsisVertical />} loading />
        </Flex>
        次按钮
        <Flex
          gap={12}
          style={{
            border: '2px dashed #8358F6',
            padding: '24px',
          }}
        >
          <Button
            color="default"
            variant="filled"
            icon={<EllipsisVertical />}
          />
          <Button
            color="default"
            variant="filled"
            icon={<EllipsisVertical />}
            disabled
          />
          <Button
            color="default"
            variant="filled"
            icon={<EllipsisVertical />}
            loading
          />
        </Flex>
        无边框按钮
        <Flex
          gap={12}
          style={{
            border: '2px dashed #8358F6',
            padding: '24px',
          }}
        >
          <Button color="default" variant="text" icon={<EllipsisVertical />} />
          <Button
            color="default"
            variant="text"
            icon={<EllipsisVertical />}
            disabled
          />
          <Button
            color="default"
            variant="text"
            icon={<EllipsisVertical />}
            loading
          />
        </Flex>
      </Flex>
      SM尺寸
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <IconButton size="sm" elevated icon={<EllipsisVertical />} />
        <IconButton size="sm" elevated icon={<EllipsisVertical />} disabled />
        <IconButton size="sm" elevated icon={<EllipsisVertical />} loading />
      </Flex>
      XS尺寸
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <IconButton size="xs" elevated icon={<EllipsisVertical />} />
        <IconButton size="xs" elevated icon={<EllipsisVertical />} disabled />
        <IconButton size="xs" elevated icon={<EllipsisVertical />} loading />
      </Flex>
    </Flex>
  );
};

export const TogalButtonDemo = () => {
  useCSSVariables('ThemeExample', globalThemeToken);

  const customIcon = (
    <div
      style={{
        width: '100%',
        height: 16,
        padding: '4px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '200px',
        background: 'var(--color-primary-control-fill-secondary-active)',
        color: 'var(--color-primary-text-secondary)',
      }}
    >
      134
    </div>
  );

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
        <TogalButton icon={<Plug />}>开关按钮</TogalButton>
        <TogalButton icon={<Plug />} triggerIcon={customIcon} active>
          开关按钮
        </TogalButton>
        <TogalButton icon={<Plug />} triggerIcon={<ChevronDown />} disabled>
          开关按钮
        </TogalButton>
      </Flex>
    </Flex>
  );
};

export const CloseButtonDemo = () => {
  return (
    <Flex>
      <Button />
    </Flex>
  );
};
