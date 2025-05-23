import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Select, Space } from 'antd';
import type { Rule } from 'antd/es/form';
import { merge } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
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
  const { properties = {} } = schema?.component || {};

  // 生成表单验证规则
  const generateRules = useCallback((property: SchemaProperty): Rule[] => {
    const rules: Rule[] = [];

    if (property.required) {
      rules.push({
        required: true,
        message: `请输入${property.title || property.description || ''}`,
      });
    }

    if (property.type === 'string' && property.pattern) {
      rules.push({
        pattern: new RegExp(property.pattern),
        message:
          property.patternMessage ||
          `${property.title || property.description || ''}格式不正确`,
      });
    }

    if (property.type === 'number') {
      rules.push({
        type: 'number',
        message: `${property.title || property.description || ''}必须是数字`,
      });

      if (typeof property.minimum === 'number') {
        rules.push({
          type: 'number',
          min: property.minimum,
          message: `${property.title || property.description || ''}不能小于 ${property.minimum}`,
        });
      }

      if (typeof property.maximum === 'number') {
        rules.push({
          type: 'number',
          max: property.maximum,
          message: `${property.title || property.description || ''}不能大于 ${property.maximum}`,
        });
      }
    }

    if (property.type === 'array') {
      if (typeof property.minItems === 'number') {
        rules.push({
          type: 'array',
          min: property.minItems,
          message: `${property.title || property.description || ''}至少需要 ${property.minItems} 项`,
        });
      }

      if (typeof property.maxItems === 'number') {
        rules.push({
          type: 'array',
          max: property.maxItems,
          message: `${property.title || property.description || ''}最多只能有 ${property.maxItems} 项`,
        });
      }
    }

    return rules;
  }, []);

  // 渲染嵌套表单项（用于数组内的对象）
  function renderNestedFormItem(
    baseName: string,
    property: SchemaProperty,
  ): React.ReactNode {
    if (property.type === 'object' && property.properties) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          {Object.entries(property.properties).map(([objKey, objProperty]) => (
            <Form.Item
              key={objKey}
              label={objProperty.title || objProperty.description || objKey}
              name={[baseName, objKey]}
              rules={generateRules(objProperty)}
              style={{ margin: 0 }}
            >
              {(() => {
                // 内联渲染逻辑避免循环依赖
                const commonProps = {
                  placeholder: `请输入${objProperty.title}`,
                };

                switch (objProperty.type) {
                  case 'number':
                    return (
                      <InputNumber
                        {...commonProps}
                        style={{ width: '100%' }}
                        min={objProperty.minimum}
                        max={objProperty.maximum}
                        step={objProperty.step || 1}
                      />
                    );
                  case 'string':
                    if (objProperty.enum) {
                      return (
                        <Select {...commonProps}>
                          {objProperty.enum.map((option) => (
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
              })()}
            </Form.Item>
          ))}
        </Space>
      );
    } else {
      return (
        <Form.Item name={baseName} style={{ margin: 0 }}>
          <Input placeholder="请输入值" />
        </Form.Item>
      );
    }
  }

  // 根据属性类型返回对应的表单组件
  function renderFormItem(
    key: string,
    property: SchemaProperty,
  ): React.ReactNode {
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
      case 'array':
        return (
          <Form.List name={key}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key: fieldKey, name, ...restField }) => (
                  <Card
                    key={fieldKey}
                    size="small"
                    style={{ marginBottom: 8 }}
                    extra={
                      <Button
                        type="link"
                        danger
                        size="small"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    {property.items ? (
                      renderNestedFormItem(`${name}`, property.items)
                    ) : (
                      <Form.Item
                        {...restField}
                        name={name}
                        style={{ margin: 0 }}
                      >
                        <Input placeholder="请输入值" />
                      </Form.Item>
                    )}
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加 {property.title}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        );
      case 'object':
        console.log(
          'property',
          property.properties &&
            Object.entries(property.properties).map(([objKey, objProperty]) => [
              key,
              objKey,
            ]),
        );

        return (
          <Card size="small" style={{ marginTop: 8 }}>
            {property.properties &&
              Object.entries(property.properties).map(
                ([objKey, objProperty]) => (
                  <Form.Item
                    key={objKey}
                    label={
                      objProperty.title || objProperty.description || objKey
                    }
                    name={[key, objKey]}
                    rules={generateRules(objProperty)}
                    style={{ marginBottom: 16 }}
                  >
                    {renderFormItem(objKey, objProperty)}
                  </Form.Item>
                ),
              )}
          </Card>
        );
      default:
        return <Input {...commonProps} />;
    }
  }

  const defaultValues = useMemo(() => {
    return Object.entries(properties).reduce(
      (acc, [key, prop]) => {
        acc[key] = prop.default;
        return acc;
      },
      {} as Record<string, any>,
    );
  }, [JSON.stringify(properties)]);

  useEffect(() => {
    form.setFieldsValue(merge(defaultValues, initialValues));
  }, [initialValues]);

  const formItems = useMemo(() => {
    return Object.entries(properties).map(([key, property]) => {
      return (
        <Form.Item
          key={key}
          label={property.title || property.description || key}
          name={
            property?.type === 'object' || property?.type === 'array'
              ? undefined
              : key
          }
          rules={generateRules(property)}
        >
          {renderFormItem(key, property)}
        </Form.Item>
      );
    });
  }, [JSON.stringify(properties)]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={defaultValues}
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
      {formItems}
    </Form>
  );
};
