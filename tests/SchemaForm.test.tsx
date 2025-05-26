import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SchemaForm } from '../src/schema/SchemaForm';
import type { LowCodeSchema } from '../src/schema/types';

// Mock schema for testing
const mockSchema: LowCodeSchema = {
  version: '1.0.0',
  name: 'Test Schema',
  description: 'Test schema for SchemaForm',
  author: 'Test Author',
  createTime: '2024-01-01',
  updateTime: '2024-01-01',
  pageConfig: {
    layout: 'flex',
    router: {
      mode: 'hash',
      basePath: '/',
    },
    globalVariables: {
      colors: {
        sunny: '#FFD700',
        rainy: '#4682B4',
        cloudy: '#708090',
      },
      constants: {
        refreshInterval: 5000,
      },
    },
  },
  dataSources: {
    restAPI: {
      baseURL: 'https://api.example.com',
      defaultHeaders: {},
      timeout: 5000,
      interceptors: {
        request: false,
        response: false,
      },
    },
    mock: {
      enable: false,
      responseDelay: 1000,
      dataPath: '/mock',
    },
  },
  component: {
    properties: {
      title: {
        type: 'string',
        title: '标题',
        description: '组件标题',
        default: '默认标题',
        required: true,
      },
      count: {
        type: 'number',
        title: '数量',
        description: '数量值',
        default: 10,
        minimum: 0,
        maximum: 100,
        step: 1,
      },
      type: {
        type: 'string',
        title: '类型',
        description: '选择类型',
        default: 'primary',
        enum: ['primary', 'secondary', 'success', 'warning', 'error'],
      },
      tags: {
        type: 'array',
        title: '标签',
        description: '标签列表',
        default: [],
        items: {
          type: 'string',
          title: '标签',
          default: '',
        },
      },
      config: {
        type: 'object',
        title: '配置',
        description: '配置对象',
        default: {},
        properties: {
          width: {
            type: 'number',
            title: '宽度',
            default: 100,
            minimum: 0,
          },
          height: {
            type: 'number',
            title: '高度',
            default: 100,
            minimum: 0,
          },
          visible: {
            type: 'string',
            title: '可见性',
            default: 'visible',
            enum: ['visible', 'hidden'],
          },
        },
      },
      items: {
        type: 'array',
        title: '项目列表',
        description: '对象数组',
        default: [],
        items: {
          type: 'object',
          title: '项目',
          default: {},
          properties: {
            name: {
              type: 'string',
              title: '名称',
              default: '',
              required: true,
            },
            value: {
              type: 'number',
              title: '值',
              default: 0,
            },
          },
        },
      },
    },
  },
};

describe('SchemaForm', () => {
  it('renders form with all property types', () => {
    render(<SchemaForm schema={mockSchema} />);

    // Check if all form fields are rendered
    expect(screen.getByLabelText('标题')).toBeInTheDocument();
    expect(screen.getByLabelText('数量')).toBeInTheDocument();
    expect(screen.getByLabelText('类型')).toBeInTheDocument();
    expect(screen.getByText('添加 标签')).toBeInTheDocument();
    expect(screen.getByText('配置')).toBeInTheDocument();
    expect(screen.getByText('添加 项目列表')).toBeInTheDocument();
  });

  it('displays default values correctly', () => {
    render(<SchemaForm schema={mockSchema} />);

    // Check default values
    expect(screen.getByDisplayValue('默认标题')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    // For Select component, check the selected value differently
    expect(screen.getByText('primary')).toBeInTheDocument();
  });

  it('handles form value changes', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(<SchemaForm schema={mockSchema} onValuesChange={onValuesChange} />);

    // Change title input
    const titleInput = screen.getByLabelText('标题');
    await user.clear(titleInput);
    await user.type(titleInput, '新标题');

    await waitFor(() => {
      expect(onValuesChange).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<SchemaForm schema={mockSchema} />);

    // Clear required field and trigger validation by blurring the field
    const titleInput = screen.getByLabelText('标题');
    await user.clear(titleInput);
    await user.tab(); // This will blur the field and trigger validation

    await waitFor(() => {
      expect(screen.getByText('请输入标题')).toBeInTheDocument();
    });
  });

  it('handles number input with min/max validation', async () => {
    const user = userEvent.setup();
    render(<SchemaForm schema={mockSchema} />);

    const numberInput = screen.getByLabelText('数量');

    // Test that we can input numbers
    await user.clear(numberInput);
    await user.type(numberInput, '50');

    await waitFor(() => {
      expect(numberInput).toHaveValue('50');
    });

    // Test that the input has the correct min/max attributes
    expect(numberInput).toHaveAttribute('aria-valuemin', '0');
    expect(numberInput).toHaveAttribute('aria-valuemax', '100');
  });

  it('handles select dropdown', async () => {
    const user = userEvent.setup();
    render(<SchemaForm schema={mockSchema} />);

    const selectElement = screen.getByLabelText('类型');
    await user.click(selectElement);

    await waitFor(() => {
      // Use getAllByText to handle multiple elements with same text
      const secondaryOptions = screen.getAllByText('secondary');
      expect(secondaryOptions.length).toBeGreaterThan(0);
      const successOptions = screen.getAllByText('success');
      expect(successOptions.length).toBeGreaterThan(0);
    });
  });

  it('handles array operations', async () => {
    const user = userEvent.setup();
    render(<SchemaForm schema={mockSchema} />);

    // Add array item
    const addButton = screen.getByText('添加 标签');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('请输入值')).toBeInTheDocument();
    });

    // Check if remove button appears
    expect(
      screen.getByRole('button', { name: /minus-circle/i }),
    ).toBeInTheDocument();
  });

  it('handles object properties', () => {
    render(<SchemaForm schema={mockSchema} />);

    // Check if object properties are rendered
    expect(screen.getByLabelText('宽度')).toBeInTheDocument();
    expect(screen.getByLabelText('高度')).toBeInTheDocument();
    expect(screen.getByLabelText('可见性')).toBeInTheDocument();
  });

  it('handles complex array with object items', async () => {
    const user = userEvent.setup();
    render(<SchemaForm schema={mockSchema} />);

    // Add complex array item
    const addItemButton = screen.getByText('添加 项目列表');
    await user.click(addItemButton);

    await waitFor(() => {
      expect(screen.getByLabelText('名称')).toBeInTheDocument();
      expect(screen.getByLabelText('值')).toBeInTheDocument();
    });
  });

  it('applies readonly mode correctly', () => {
    render(<SchemaForm schema={mockSchema} readonly={true} />);

    // Check if inputs are disabled/readonly
    expect(screen.getByLabelText('标题')).toBeDisabled();
    expect(screen.getByLabelText('数量')).toBeDisabled();
    expect(screen.getByLabelText('类型')).toBeDisabled();

    // Check if add buttons are hidden
    expect(screen.queryByText('添加 标签')).not.toBeInTheDocument();
    expect(screen.queryByText('添加 项目列表')).not.toBeInTheDocument();
  });

  it('applies readonly mode to nested object properties', () => {
    render(<SchemaForm schema={mockSchema} readonly={true} />);

    // Check if nested object properties are disabled
    expect(screen.getByLabelText('宽度')).toBeDisabled();
    expect(screen.getByLabelText('高度')).toBeDisabled();
    expect(screen.getByLabelText('可见性')).toBeDisabled();
  });

  it('handles initial values correctly', () => {
    const initialValues = {
      title: '初始标题',
      count: 50,
      type: 'success',
      config: {
        width: 200,
        height: 150,
      },
    };

    render(<SchemaForm schema={mockSchema} initialValues={initialValues} />);

    expect(screen.getByDisplayValue('初始标题')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    // For Select component, check the selected value text
    expect(screen.getByText('success')).toBeInTheDocument();
    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150')).toBeInTheDocument();
  });

  it('handles array with initial values', async () => {
    const user = userEvent.setup();
    const initialValues = {
      tags: ['tag1', 'tag2'],
    };

    render(<SchemaForm schema={mockSchema} initialValues={initialValues} />);

    // Add an item to see the existing structure
    const addButton = screen.getByText('添加 标签');
    await user.click(addButton);

    // Should have 3 items total (2 initial + 1 new)
    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('请输入值');
      expect(inputs).toHaveLength(3);
    });
  });

  it('handles form submission and validation', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(<SchemaForm schema={mockSchema} onValuesChange={onValuesChange} />);

    // Fill out form
    const titleInput = screen.getByLabelText('标题');
    await user.clear(titleInput);
    await user.type(titleInput, '测试标题');

    const numberInput = screen.getByLabelText('数量');
    await user.clear(numberInput);
    await user.type(numberInput, '25');

    await waitFor(() => {
      expect(onValuesChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          title: '测试标题',
          count: 25,
        }),
      );
    });
  });

  it('handles empty schema gracefully', () => {
    const emptySchema: LowCodeSchema = {
      ...mockSchema,
      component: {
        properties: {},
      },
    };

    render(<SchemaForm schema={emptySchema} />);

    // Should render form without errors - check for form element by tag
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('handles schema without component property', () => {
    const schemaWithoutComponent: LowCodeSchema = {
      ...mockSchema,
      component: undefined,
    };

    render(<SchemaForm schema={schemaWithoutComponent} />);

    // Should render form without errors - check for form element by tag
    expect(document.querySelector('form')).toBeInTheDocument();
  });
});
