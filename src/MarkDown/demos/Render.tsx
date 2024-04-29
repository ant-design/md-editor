import { Bar, Pie } from '@ant-design/charts';
import { BetaSchemaForm } from '@ant-design/pro-components';
import {
  NodeToSchema,
  mdToApassifySchema,
} from '@chenshuai2144/md-to-json-schema';
import { Table } from 'antd';
import React, { type FC } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const defaultPieConfig = {
  angleField: 'value',
  colorField: 'type',

  legend: {
    color: {
      title: false,
      position: 'right',
      rowPadding: 5,
    },
  },
};
/**
 * MarkdownParser component.
 *
 * @param value - The markdown content to be parsed.
 * @param dart - A boolean indicating whether to use the dark theme or not.
 * @returns The parsed markdown content.
 */

export const MdToJSONRender: FC<{
  value: string;
  itemRender?: (props: React.ReactNode, node: NodeToSchema) => React.ReactNode;
}> = (props) => {
  const apassifySchema = mdToApassifySchema(props.value);

  const defaultRender = (
    node: NodeToSchema,
    index: React.Key | null | undefined,
  ) => {
    if (node?.type === 'table') {
      return (
        <Table
          key={index}
          size="small"
          bordered
          pagination={false}
          {...node?.otherProps}
        />
      );
    }
    if (node?.type === 'code' && node?.lang === 'json') {
      return (
        <pre key={index}>
          {JSON.stringify(JSON.parse(node?.value || '{}'), null, 2)}
        </pre>
      );
    }
    if (node?.type === 'code' && node?.lang === 'schema') {
      return (
        <BetaSchemaForm
          key={index}
          columns={JSON.parse(node?.value?.trim() || '{}')}
        />
      );
    }
    if (node?.type === 'chart') {
      if (node?.otherProps?.chartType === 'pie') {
        return (
          <Pie
            data={
              node?.otherProps?.data?.map((item) => {
                return {
                  type: item.type,
                  value: parseFloat(item.value),
                };
              }) || []
            }
            {...defaultPieConfig}
            label={{
              text: 'type',
              position: 'outside',
              textAlign: 'center',
            }}
          />
        );
      }
      if (node?.otherProps?.chartType === 'bar') {
        return (
          <Bar
            data={node?.otherProps?.data || []}
            yField={node?.otherProps?.y}
            xField={node?.otherProps?.x}
            label={{
              position: 'outside',
              textAlign: 'center',
            }}
          />
        );
      }
    }

    if (node?.type === 'heading') {
      return (
        <Markdown key={index} remarkPlugins={[remarkGfm]}>
          {node?.value}
        </Markdown>
      );
    }
    return (
      <Markdown
        key={index}
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => {
            return (
              <img
                {...props}
                style={{ maxWidth: '100%' }}
                crossOrigin="anonymous"
              />
            );
          },
        }}
      >
        {node?.value || ''}
      </Markdown>
    );
  };
  return apassifySchema.map((node, index) => {
    const dom = defaultRender(node, index);
    if (props.itemRender) {
      return props.itemRender(dom, node);
    }
    return dom;
  });
};
