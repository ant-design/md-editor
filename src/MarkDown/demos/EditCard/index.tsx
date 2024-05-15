import { EditOutlined } from '@ant-design/icons';
import { NodeToSchemaType } from '@ant-design/md-to-json-schema';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const valueType = ['markdown', 'code'];

/**
 * EditCard component.
 *
 * @param node - The node object containing the report and ID.
 * @param dragHandle - The drag handle component.
 * @param defaultDom - The default DOM component.
 */
export const EditCard: React.FC<{
  node: NodeToSchemaType<{
    report_id?: number;
    id: number;
  }>;
  dragHandle?: React.ReactNode;
  defaultDom: React.ReactNode;
}> = ({ node, dragHandle, defaultDom }) => {
  const supportEdit =
    valueType.includes(node.type) &&
    !['schema', 'chart'].includes(node.lang || '');
  const [defaultTitle, setDefaultTitle] = useState<string | undefined>(() => {
    if (supportEdit) {
      return node.title;
    }
    return undefined;
  });
  const [defaultText, setDefaultText] = useState<string | undefined>(() => {
    if (supportEdit) {
      return node.value;
    }
    return '';
  });

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ModalForm<{
        title: string;
        content: string;
      }>
        open={open}
        onOpenChange={(changeOpen) => {
          setOpen(changeOpen);
        }}
        onFinish={async (values) => {
          message.success('Edit success');
          setDefaultTitle(values.title);
          setDefaultText(values.content);
          return true;
        }}
      >
        <ProFormText name="title" label="Title" initialValue={node.title} />
        <ProFormTextArea
          name="content"
          fieldProps={{
            rows: 5,
          }}
          label="Content"
          initialValue={defaultText}
        />
      </ModalForm>
      <Card
        bordered={false}
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {dragHandle}
            <div>{defaultTitle || node.title}</div>
          </div>
        }
        key={node.title}
        style={{
          background: 'transparent',
          boxShadow: 'none',
          width: '100%',
        }}
        styles={{
          header: {
            background: 'transparent',
            border: 'none',
            padding: 0,
          },
          body: {
            background: 'transparent',
            border: 'none',
            padding: 0,
          },
        }}
        extra={
          supportEdit ? (
            <EditOutlined
              onClick={() => {
                setOpen(true);
              }}
              style={{
                cursor: 'pointer',
              }}
            />
          ) : null
        }
      >
        {supportEdit ? (
          <Markdown remarkPlugins={[remarkGfm]}>{defaultText}</Markdown>
        ) : (
          defaultDom
        )}
      </Card>
    </>
  );
};
