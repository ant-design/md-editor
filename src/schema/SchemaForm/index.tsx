import { Form, Input, InputNumber, Select } from 'antd';
import type { Rule } from 'antd/es/form';
import React, { useEffect } from 'react';
import { LowCodeSchema, SchemaProperty } from '../../schema/types';

interface SchemaFormProps {
  schema: LowCodeSchema;
  onValuesChange?: (
    _: Record<string, any>,
    values: Record<string, any>,
  ) => void;
  initialValues?: Record<string, any>;
}

export const SchemaForm: React.FC<SchemaFormProps> = ({
  schema,
  onValuesChange,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { properties } = schema.component;

  // 根据属性类型返回对应的表单组件
  const renderFormItem = (key: string, property: SchemaProperty) => {
    const commonProps = {
      placeholder: `请输入${property.title}`,
    };

    switch (property.type) {
      case 'number':
        return (
          <InputNumber
            {...commonProps}
            style={{ width: '100%' }}
            min={property.minimum}
            max={property.maximum}
            step={property.step || 1}
          />
        );
      case 'string':
        if (property.enum) {
          return (
            <Select {...commonProps}>
              {property.enum.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          );
        }
        return <Input {...commonProps} />;
      default:
        return <Input {...commonProps} />;
    }
  };

  // 生成表单验证规则
  const generateRules = (property: SchemaProperty): Rule[] => {
    const rules: Rule[] = [];

    if (property.required) {
      rules.push({
        required: true,
        message: `请输入${property.title}`,
      });
    }

    if (property.type === 'string' && property.pattern) {
      rules.push({
        pattern: new RegExp(property.pattern),
        message: property.patternMessage || `${property.title}格式不正确`,
      });
    }

    if (property.type === 'number') {
      rules.push({
        type: 'number',
        message: `${property.title}必须是数字`,
      });

      if (typeof property.minimum === 'number') {
        rules.push({
          type: 'number',
          min: property.minimum,
          message: `${property.title}不能小于 ${property.minimum}`,
        });
      }

      if (typeof property.maximum === 'number') {
        rules.push({
          type: 'number',
          max: property.maximum,
          message: `${property.title}不能大于 ${property.maximum}`,
        });
      }
    }

    return rules;
  };

  useEffect(() => {
    form.setFieldsValue(
      initialValues ||
        Object.entries(properties).reduce(
          (acc, [key, prop]) => {
            acc[key] = prop.default;
            return acc;
          },
          {} as Record<string, any>,
        ),
    );
  }, [initialValues, properties, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        initialValues ||
        Object.entries(properties).reduce(
          (acc, [key, prop]) => {
            acc[key] = prop.default;
            return acc;
          },
          {} as Record<string, any>,
        )
      }
      onValuesChange={(_, allValues) => {
        onValuesChange?.(_, allValues);
      }}
      style={{
        maxWidth: 400,
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {Object.entries(properties).map(([key, property]) => (
        <Form.Item
          key={key}
          label={property.title}
          name={key}
          rules={generateRules(property)}
        >
          {renderFormItem(key, property)}
        </Form.Item>
      ))}
    </Form>
  );
};
