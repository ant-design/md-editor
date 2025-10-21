import { IconButton, SwitchButton } from '@ant-design/md-editor';
import { globalThemeToken, useCSSVariables } from '@ant-design/theme-token';
import {
  ChevronDown,
  EllipsisVertical,
  ExpandAlt,
  Plug,
  Plus,
} from '@sofa-design/icons';
import { Button, Flex } from 'antd';
import React from 'react';

const InlineElevatedButton: React.FC<{
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ disabled, loading, icon, children }) => {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    height: 'var(--height-control-base)',
    borderRadius: '200px',
    font: 'var(--font-text-h6-base)',

    color: 'var(--color-gray-text-default)',
    background: 'var(--color-gray-bg-card-white)',
    boxShadow: 'var(--shadow-control-lg)',
    border: 'none',
    opacity: disabled ? 0.3 : 1,
  };

  let stateStyle: React.CSSProperties = {};
  if (!disabled && !loading) {
    if (active) {
      stateStyle = {
        background: 'var(--color-gray-bg-card-white)',
        boxShadow: 'var(--shadow-control-base)',
      };
    } else if (hovered) {
      stateStyle = {
        background: 'var(--color-gray-bg-card-white)',
        boxShadow: 'var(--shadow-popover-base)',
      };
    }
  } else if (disabled) {
    stateStyle = {
      background: 'var(--color-gray-bg-card-white)',
      boxShadow: 'var(--shadow-control-base)',
    };
  } else if (loading) {
    stateStyle = {
      background: 'var(--color-gray-bg-card-white)',
      boxShadow: 'var(--shadow-control-lg)',
      color: 'var(--color-gray-text-disabled)',
    };
  }

  const style: React.CSSProperties = { ...baseStyle, ...stateStyle };

  return (
    <Button
      icon={icon}
      disabled={disabled}
      loading={loading}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {children}
    </Button>
  );
};

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
      悬浮按钮
      <Flex
        gap={12}
        style={{
          border: '2px dashed #8358F6',
          padding: '24px',
        }}
      >
        <InlineElevatedButton icon={<ExpandAlt />}>
          悬浮按钮
        </InlineElevatedButton>
        <InlineElevatedButton icon={<ExpandAlt />} disabled>
          悬浮按钮
        </InlineElevatedButton>
        <InlineElevatedButton icon={<ExpandAlt />} loading>
          悬浮按钮
        </InlineElevatedButton>
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

export const SwitchButtonDemo = () => {
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
        <SwitchButton icon={<Plug />}>开关按钮</SwitchButton>
        <SwitchButton icon={<Plug />} triggerIcon={customIcon} active>
          开关按钮
        </SwitchButton>
        <SwitchButton icon={<Plug />} triggerIcon={<ChevronDown />} disabled>
          开关按钮
        </SwitchButton>
      </Flex>
    </Flex>
  );
};
