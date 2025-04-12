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

  const errorMsg =
    props.output?.errorMsg ||
    props.output?.response?.error ||
    props.output?.response?.errorMsg;
  const i18n = useContext(I18nContext);
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
              {i18n.locale?.executionParameters || '执行入参'}
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
              {i18n.locale?.cancel || '取消'}
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
              {i18n.locale?.retry || '重试'}
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
              {i18n.locale?.executionParameters || '执行入参'}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {!errorMsg ? (
                  <ActionIconBox
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
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    try {
                      navigator.clipboard.writeText(
                        JSON.stringify(props.input?.inputArgs || {}, null, 2),
                      );
                    } catch (error) {}
                  }}
                >
                  <CopyOutlined />
                </ActionIconBox>
              </div>
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
                style={{
                  padding: 0,
                  width: '100%',
                }}
                {...props.markdownRenderProps}
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
              {i18n.locale?.apiCalling || 'API调用中'}
              <DotLoading />
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
                  <span>{i18n.locale?.executionResult || '执行结果'}</span>
                  <CostMillis costMillis={props.costMillis} />
                </div>
                <ActionIconBox
                  title="复制"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    try {
                      await navigator.clipboard.writeText(
                        JSON.stringify(props.output?.response, null, 2),
                      );
                    } catch (error) {}
                  }}
                >
                  <CopyOutlined />
                </ActionIconBox>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  borderRadius: '12px',
                  opacity: 1,
                  wordBreak: 'break-all',
                  wordWrap: 'break-word',
                  flexDirection: 'column',
                  alignSelf: 'stretch',
                }}
                className="code-view"
              >
                <MarkdownEditor
                  style={{
                    padding: 0,
                    width: '100%',
                  }}
                  {...props.markdownRenderProps}
                  toc={false}
                  readonly
                  contentStyle={{
                    padding: 0,
                    width: '100%',
                  }}
                  initValue={`\`\`\`json\n${JSON.stringify(
                    props.output?.response,
                    null,
                    2,
                  )}\n\`\`\``}
                />
              </div>
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
                  <Typography.Text>
                    {i18n.locale?.taskExecutionFailed ||
                      '任务执行失败，需要修改'}
                  </Typography.Text>
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
                  {i18n.locale?.edit || '修改'}
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
