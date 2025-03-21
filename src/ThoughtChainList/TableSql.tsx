import {
  CloseCircleFilled,
  CopyOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  MarkdownEditor,
  MarkdownEditorInstance,
  parserSlateNodeToMarkdown,
} from '@ant-design/md-editor';
import { Button, Popover, Table, Typography } from 'antd';
import React, { useMemo } from 'react';
import { WhiteBoxProcessInterface } from '.';
import { ActionIconBox } from '../index';
import { CostMillis } from './CostMillis';

/**
 * ToolCall 组件用于显示 SQL 查询的执行状态和结果。
 *
 * @param props - 组件的属性。
 * @param props.isFinished - 表示 SQL 查询是否已完成。
 * @param props.input - 包含 SQL 查询的输入数据。
 * @param props.output - 包含 SQL 查询的输出数据。
 * @param props.costMillis - SQL 查询执行的耗时。
 *
 * @returns 返回一个包含 SQL 查询状态和结果的 JSX 元素。
 *
 * 组件功能：
 * - 显示 SQL 查询语句，并提供复制功能。
 * - 在 SQL 查询执行中时，显示执行中的提示。
 * - 显示 SQL 查询结果，并提供复制功能。
 * - 如果 SQL 查询出错，显示错误信息，并提供复制功能。
 */
export const TableSql = (
  props: {
    isFinished: boolean;
    onChangeItem?: (
      item: WhiteBoxProcessInterface,
      changeProps: {
        feedbackContent: string;
        feedbackType: 'sql' | 'toolArg';
        feedbackRunId: string;
      },
    ) => void;
  } & WhiteBoxProcessInterface,
) => {
  const [editor, setEditor] = React.useState<boolean>(false);
  const editorRef = React.useRef<MarkdownEditorInstance | undefined>(undefined);

  return useMemo(() => {
    if (editor) {
      return (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '8px 12px',
              gap: '10px',
              alignSelf: 'stretch',
              wordBreak: 'break-all',
              wordWrap: 'break-word',
              background: '#FBFCFD',
              zIndex: 1,
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              查询 SQL
            </div>
            <div
              style={{
                display: 'flex',
                borderRadius: '12px',
                alignSelf: 'stretch',
                background: '#FFFFFF',
              }}
              className="code-view"
            >
              <MarkdownEditor
                style={{
                  padding: 0,
                  width: '100%',
                }}
                editorRef={editorRef}
                contentStyle={{
                  padding: 0,
                  width: '100%',
                }}
                initValue={`\`\`\`sql\n${props.input?.sql?.trim()}\n\`\`\``.trim()}
              />
            </div>
          </div>
          <div
            style={{
              gap: 12,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Button
              style={{
                border: '1px solid #F0F2F5',
                background: '#FFFFFF',
                padding: '4px 24px',
                borderRadius: '12px 12px 12px 12px',
              }}
              onClick={() => {
                setEditor(false);
                editorRef.current?.store?.setMDContent(
                  `\`\`\`sql\n${props.input?.sql?.trim()}\n\`\`\``,
                );
              }}
            >
              取消
            </Button>
            <Button
              style={{
                border: '1px solid #F0F2F5',
                padding: '4px 24px',
                borderRadius: '12px 12px 12px 12px',
              }}
              type="primary"
              onClick={() => {
                setEditor(false);
                const schema = editorRef?.current?.store.editor?.children;
                const value = parserSlateNodeToMarkdown(schema || [])
                  ?.replaceAll('```sql\n', '')
                  .replaceAll('\n```', '')
                  .replaceAll('<!--{}-->\n', '');
                props.onChangeItem?.(props, {
                  feedbackContent: value || '',
                  feedbackType: 'sql',
                  feedbackRunId: props.runId || '',
                });
              }}
            >
              重试
            </Button>
          </div>
        </div>
      );
    }
    const sourceData = props.output?.tableData as any;
    const keys = Object.keys(sourceData || {});
    let fistKey = keys[0];

    const dataSource = (sourceData?.[fistKey] as any)?.map(
      (_: any, index: number) => {
        return keys?.reduce((prev, key) => {
          return {
            ...prev,
            [key]: sourceData[key][index],
          };
        }, {});
      },
    );

    const columns = ((props.output?.columns as any) ||
      Object.keys(dataSource?.at(0) || {})) as string[];

    const errorMsg = props.output?.errorMsg || props.output?.response?.errorMsg;
    return (
      <>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '8px 12px',
              gap: '10px',
              alignSelf: 'stretch',
              wordBreak: 'break-all',
              wordWrap: 'break-word',
              background: '#FBFCFD',
              zIndex: 1,
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              查询 SQL
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                }}
              >
                {!errorMsg ? (
                  <ActionIconBox
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setEditor(true);
                    }}
                    title={'修改'}
                  >
                    <EditOutlined />
                  </ActionIconBox>
                ) : null}
                <ActionIconBox
                  title="复制"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigator.clipboard.writeText(props.input?.sql || '');
                  }}
                >
                  <CopyOutlined />
                </ActionIconBox>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                borderRadius: '12px',
                alignSelf: 'stretch',
                background: '#FFFFFF',
              }}
              className="code-view"
            >
              <MarkdownEditor
                style={{
                  padding: 0,
                  width: '100%',
                }}
                readonly
                contentStyle={{
                  padding: 0,
                  width: '100%',
                }}
                initValue={`\`\`\`sql\n${props.input?.sql?.trim()}\n\`\`\``.trim()}
              />
            </div>
          </div>
          {!props.output && !props?.isFinished ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '38px',
                borderRadius: '12px',
                opacity: 1,
                wordBreak: 'break-all',
                wordWrap: 'break-word',
                flexDirection: 'row',
                padding: '8px',
                gap: '10px',
                alignSelf: 'stretch',
                background: '#FBFCFD',
                zIndex: 2,
              }}
            >
              <img src="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*diUaQrwVBVYAAAAAAAAAAAAADkN6AQ/original" />
              SQL 执行中...
            </div>
          ) : null}
          {!errorMsg && props.output ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                wordBreak: 'break-all',
                wordWrap: 'break-word',
                padding: '8px 12px',
                gap: '10px',
                alignSelf: 'stretch',
                background: '#FBFCFD',
                zIndex: 1,
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <span>查询结果</span>
                  <CostMillis costMillis={props.costMillis} />
                </div>
                <ActionIconBox
                  title="复制"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    await navigator.clipboard.writeText(
                      JSON.stringify(dataSource, null, 2),
                    );
                  }}
                >
                  <CopyOutlined />
                </ActionIconBox>
              </div>

              <Table
                size="small"
                bordered
                pagination={
                  dataSource?.length > 5
                    ? {
                        pageSize: 5,
                        hideOnSinglePage: true,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条`,
                      }
                    : false
                }
                scroll={{ x: 'max-content' }}
                dataSource={dataSource as Record<string, any>[]}
                columns={(columns || []).map((key) => ({
                  title: key,
                  dataIndex: key,
                  key: key,
                  render: (text: any) => {
                    return (
                      <Popover
                        trigger="click"
                        title={
                          <div
                            style={{
                              maxWidth: 400,
                              maxHeight: 400,
                              fontWeight: 400,
                              fontSize: '1em',
                              overflow: 'auto',
                            }}
                          >
                            <Typography.Text copyable={{ text: text }}>
                              {text}
                            </Typography.Text>
                          </div>
                        }
                      >
                        <div
                          style={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            maxHeight: 40,
                          }}
                        >
                          {text}
                        </div>
                      </Popover>
                    );
                  },
                }))}
              />
            </div>
          ) : null}
          {errorMsg ? (
            <div
              style={{
                borderRadius: '12px',
                opacity: 1,
                display: 'flex',
                padding: '12px 12px',
                alignSelf: 'stretch',
                background: '#FFEDEC',
                wordBreak: 'break-all',
                minHeight: 18,
                wordWrap: 'break-word',
                zIndex: 2,
                backgroundColor: '#FFEDEC',
                border: '1px solid rgba(244, 244, 247, 0.7473)',
                gap: 8,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div>
                  <CloseCircleFilled
                    style={{
                      color: '#FF4141',
                      marginRight: 8,
                    }}
                  />
                  <Typography.Text>Table 查询失败，需要修改</Typography.Text>
                </div>
                <Typography
                  style={{
                    color: '#FF4141',
                    wordBreak: 'break-all',
                    wordWrap: 'break-word',
                  }}
                >
                  {JSON.stringify(errorMsg)}
                </Typography>
              </div>
              {props.onChangeItem ? (
                <Button
                  style={{
                    border: '1px solid #F0F2F5',
                    background: '#FFFFFF',
                    borderRadius: '12px 12px 12px 12px',
                  }}
                  onClick={() => {
                    setEditor(true);
                  }}
                >
                  修改
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </>
    );
  }, [
    props.category,
    JSON.stringify(props.info),
    JSON.stringify(props.output),
    JSON.stringify(props.input),
    props.costMillis,
    editor,
  ]);
};
