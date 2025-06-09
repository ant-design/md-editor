import {
  CloseCircleFilled,
  CopyOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React, { useContext, useMemo } from 'react';
import { WhiteBoxProcessInterface } from '.';
import { I18nContext } from '../i18n';
import { ActionIconBox } from '../index';
import {
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
  parserSlateNodeToMarkdown,
} from '../MarkdownEditor';
import { CostMillis } from './CostMillis';
import { DotLoading } from './DotAni';

/**
 * ToolCall 组件用于显示 API 调用的输入参数、输出参数以及调用状态。
 *
 * @param props - 组件的属性。
 * @param props.isFinished - 表示 API 调用是否完成。
 * @param props.input - 包含输入参数的对象。
 * @param props.input.inputArgs - 输入参数对象。
 * @param props.input.inputArgs.parameters - 输入参数的具体值。
 * @param props.input.inputArgs.params - 输入参数的备用值。
 * @param props.output - 包含输出参数的对象。
 * @param props.output.response - 输出参数的具体值。
 * @param props.output.response.error - 输出参数中的错误信息。
 * @param props.costMillis - API 调用耗时。
 *
 * @returns 返回一个包含 API 调用输入参数、输出参数及调用状态的 JSX 元素。
 */
export const ToolCall = (
  props: {
    isFinished?: boolean;
    onChangeItem?: (
      item: WhiteBoxProcessInterface,
      changeProps: {
        feedbackContent: string;
        feedbackType: 'sql' | 'toolArg';
        feedbackRunId: string;
      },
    ) => void;
    markdownRenderProps?: MarkdownEditorProps;
  } & WhiteBoxProcessInterface,
) => {
  const [editor, setEditor] = React.useState<boolean>(false);
  const editorRef = React.useRef<MarkdownEditorInstance | undefined>(undefined);
  const { locale } = useContext(I18nContext);

  const errorMsg =
    props.output?.errorMsg ||
    props.output?.response?.error ||
    props.output?.response?.errorMsg;

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
              {locale.executionParameters}
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                borderRadius: '12px',
                opacity: 1,
                flexDirection: 'column',
                alignSelf: 'stretch',
              }}
              className="code-view"
            >
              <MarkdownEditor
                editorRef={editorRef}
                {...props.markdownRenderProps}
                style={{
                  padding: 0,
                  width: '100%',
                  background: '#FFF',
                }}
                toc={false}
                readonly={false}
                contentStyle={{
                  padding: 0,
                  width: '100%',
                }}
                initValue={`\`\`\`json\n${JSON.stringify(
                  props.input?.inputArgs || {},
                  null,
                  2,
                ).trim()}\n\`\`\``.trim()}
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
                  `\`\`\`json\n${JSON.stringify(
                    props.input?.inputArgs || {},
                    null,
                    2,
                  ).trim()}\n\`\`\``.trim(),
                );
              }}
            >
              {locale.cancel}
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
                const schema = editorRef?.current?.store?.editor.children;
                const value = parserSlateNodeToMarkdown(schema || [])
                  ?.replaceAll('```json\n', '')
                  .replaceAll('\n```', '')
                  .replaceAll('<!--{}-->\n', '');
                props.onChangeItem?.(props, {
                  feedbackContent: value || '',
                  feedbackType: 'toolArg',
                  feedbackRunId: props.runId || '',
                });
              }}
            >
              {locale.retry}
            </Button>
          </div>
        </div>
      );
    }

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
              {locale.executionParameters}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                {props.costMillis ? (
                  <CostMillis costMillis={props.costMillis} />
                ) : null}
                <ActionIconBox
                  title={locale.copy}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(props.input?.inputArgs || {}, null, 2),
                    );
                  }}
                >
                  <CopyOutlined />
                </ActionIconBox>
                {props.onChangeItem ? (
                  <ActionIconBox
                    title={locale.edit}
                    onClick={() => {
                      setEditor(true);
                    }}
                  >
                    <EditOutlined />
                  </ActionIconBox>
                ) : null}
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
                {...props.markdownRenderProps}
                style={{
                  padding: 0,
                  width: '100%',
                }}
                toc={false}
                readonly
                contentStyle={{
                  padding: 0,
                  width: '100%',
                }}
                initValue={`\`\`\`json\n${JSON.stringify(
                  props.input?.inputArgs || {},
                  null,
                  2,
                ).trim()}\n\`\`\``.trim()}
              />
            </div>
          </div>
          {!props.isFinished ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                alignSelf: 'stretch',
                wordBreak: 'break-all',
                wordWrap: 'break-word',
                background: '#FBFCFD',
                zIndex: 1,
                borderRadius: '12px',
              }}
            >
              {locale.apiCalling}
              <DotLoading />
            </div>
          ) : null}
          {props.isFinished && !errorMsg ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '8px 12px',
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
                {locale.executionResult}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <ActionIconBox
                    title={locale.copy}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(props.output?.response || {}, null, 2),
                      );
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
              >
                <MarkdownEditor
                  {...props.markdownRenderProps}
                  style={{
                    padding: 0,
                    width: '100%',
                  }}
                  toc={false}
                  readonly
                  contentStyle={{
                    padding: 0,
                    width: '100%',
                  }}
                  initValue={`\`\`\`json\n${JSON.stringify(
                    props.output?.response || {},
                    null,
                    2,
                  ).trim()}\n\`\`\``.trim()}
                />
              </div>
            </div>
          ) : null}
          {props.isFinished && errorMsg ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '8px 12px',
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                  {locale.taskExecutionFailed}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <ActionIconBox
                    title={locale.copy}
                    onClick={() => {
                      navigator.clipboard.writeText(errorMsg);
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
              >
                <Typography.Text type="danger">{errorMsg}</Typography.Text>
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }, [
    editor,
    props.input?.inputArgs,
    props.output,
    props.isFinished,
    props.costMillis,
  ]);
};
