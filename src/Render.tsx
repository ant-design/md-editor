import { BetaSchemaForm } from '@ant-design/pro-components';
import { Table } from 'antd';
import React, { type FC } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mdToApassifySchema } from './utils';
/**
 * MarkdownParser component.
 *
 * @param value - The markdown content to be parsed.
 * @param dart - A boolean indicating whether to use the dark theme or not.
 * @returns The parsed markdown content.
 */
export const MdToJSONRender: FC<{
  value: string;
}> = (props) => {
  const apassifySchema = mdToApassifySchema(props.value);
  return apassifySchema.map((node, index) => {
    if (node.type === 'table') {
      return (
        <Table
          key={index}
          columns={node.columns}
          dataSource={node.dataSource}
          pagination={false}
        />
      );
    }
    if (node.type === 'code' && node.lang === 'json') {
      return (
        <pre key={index}>{JSON.stringify(JSON.parse(node.value), null, 2)}</pre>
      );
    }
    if (node.type === 'code' && node.lang === 'schema') {
      return (
        <BetaSchemaForm key={index} columns={JSON.parse(node.value.trim())} />
      );
    }
    return (
      <Markdown key={index} remarkPlugins={[remarkGfm]}>
        {node.value}
      </Markdown>
    );
  });
};
