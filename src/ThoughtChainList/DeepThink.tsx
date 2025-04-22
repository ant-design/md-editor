import { CloseCircleFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import React, { useContext, useMemo } from 'react';
import { WhiteBoxProcessInterface } from '.';
import { I18nContext } from '../i18n';
import { MarkdownEditorProps } from '../MarkdownEditor';
import { DotLoading } from './DotAni';
import { MarkdownEditorUpdate } from './MarkdownEditor';

export const DeepThink = (
  props: {
    isFinished?: boolean;
    markdownRenderProps?: MarkdownEditorProps;
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
  const errorMsg =
    props.output?.errorMsg ||
    props.output?.response?.error ||
    props.output?.response?.errorMsg;
  const i18n = useContext(I18nContext);

  console.log(props, 'DeepThink');
  return useMemo(() => {
    return (
      <>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column',
          }}
        >
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
              {i18n?.locale?.deepThinkingInProgress || '正在深度思考中'}
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
                <MarkdownEditorUpdate
                  {...props.markdownRenderProps}
                  typewriter={
                    !props.output?.response?.error &&
                    !props.isFinished &&
                    props.output?.type === 'TOKEN'
                  }
                  isFinished={
                    props.isFinished || props.output?.type !== 'TOKEN'
                  }
                  initValue={props.output?.data
                    ?.replaceAll('<font color=#898989>[', '')
                    ?.replaceAll(']</font>', '\n')
                    ?.replaceAll('<font color=#898989>', '')
                    ?.replaceAll('</font>', '')
                    ?.replaceAll('</think>', '')
                    ?.replaceAll('<think>', '')}
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
                    {i18n?.locale?.taskExecutionFailed ||
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
            </div>
          ) : null}
        </div>
      </>
    );
  }, [props.category, JSON.stringify(props.output), props.costMillis]);
};
