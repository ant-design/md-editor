import { ExportOutlined } from '@ant-design/icons';
import {
  Chunk,
  WhiteBoxProcessInterface,
} from '@ant-design/md-editor/ThoughtChainList';
import { Popover, Tooltip, Typography } from 'antd';
import React, { useContext, useMemo } from 'react';
import { I18nContext } from '../../i18n';
import { LoadingIcon } from '../../icons/LoadingIcon';
import { ActionIconBox, MarkdownEditor, useRefFunction } from '../../index';
import { FileMapView } from '../../MarkdownInputField/FileMapView';
import { BubbleConfigContext } from '../BubbleConfigProvide';
import { BubbleProps, MessageBubbleData } from '../type';
import { BubbleExtra } from './BubbleExtra';
import { DocInfoList } from './DocInfo';
import { EXCEPTION } from './EXCEPTION';
import { MarkdownPreview } from './MarkdownPreview';

export const LOADING_FLAT = '...';

/**
 * BubbleMessageDisplay 组件 - 聊天气泡消息显示组件
 *
 * 该组件负责渲染聊天气泡中的消息内容，支持多种内容类型的显示，
 * 包括Markdown、异常消息、加载状态等。提供完整的交互功能。
 *
 * @component
 * @description 聊天气泡消息显示组件，处理各种消息内容的渲染
 * @param {BubbleProps & {content: MessageBubbleData['content'], bubbleListItemExtraStyle?: React.CSSProperties}} props - 组件属性
 * @param {string} props.content - 消息内容
 * @param {React.CSSProperties} [props.bubbleListItemExtraStyle] - 额外样式
 * @param {MutableRefObject} [props.bubbleRef] - 气泡引用
 * @param {boolean} [props.readonly] - 是否只读模式
 * @param {BubbleRenderConfig} [props.bubbleRenderConfig] - 渲染配置
 * @param {BubbleMetaData} [props.avatar] - 头像元数据
 *
 * @example
 * ```tsx
 * <BubbleMessageDisplay
 *   content="这是一条消息内容"
 *   readonly={false}
 *   bubbleRef={bubbleRef}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的消息显示组件
 *
 * @remarks
 * - 组件会自动处理 Markdown 内容的渲染
 * - 支持异常消息的特殊展示
 * - 提供完整的交互操作（点赞、点踩、复制等）
 * - 可以通过 extraRender 完全自定义额外操作区域
 *
 * @see {@link BubbleProps} 了解更多关于聊天项属性的信息
 * @see {@link BaseChatProps} 了解更多关于基础聊天属性的信息
 */
export const BubbleMessageDisplay: React.FC<
  BubbleProps & {
    content: MessageBubbleData['content'];
    bubbleListItemExtraStyle?: React.CSSProperties;
    contentAfterDom?: React.ReactNode;
  }
> = ({ content, bubbleRef, readonly, contentAfterDom, ...props }) => {
  /**
   * 获取聊天配置上下文
   * @type {ChatConfigContext}
   */
  const context = useContext(BubbleConfigContext);
  const { locale } = useContext(I18nContext);

  const [isExtraNull, setIsExtraNull] = React.useState(false);

  const [nodeList, setNodeList] = React.useState<
    {
      id: any;
      placeholder: any;
      origin_text: any;
      url: any;
      origin_url: any;
    }[]
  >([]);

  const funRender = useRefFunction((props: { identifier?: any }) => {
    const node = nodeList.find((item) => item.placeholder === props.identifier);
    return node;
  });

  const typing = useMemo(() => {
    return (
      props.originData?.isAborted !== true &&
      props.originData?.isFinished === false &&
      props?.originData?.extra?.isHistory === undefined &&
      props.originData?.isFinished !== undefined
    );
  }, [
    props.originData?.isAborted,
    props.originData?.isFinished,
    props.originData?.extra?.isHistory,
  ]);

  // 处理 beforeContent 和 afterContent
  const beforeContent = useMemo(() => {
    return props.bubbleRenderConfig?.beforeMessageRender
      ? props.bubbleRenderConfig.beforeMessageRender(props, null)
      : null;
  }, [props.bubbleRenderConfig?.beforeMessageRender, typing, props.originData]);

  const filesMap = useMemo(() => {
    if (props.originData?.fileMap && props.originData.fileMap.size > 0) {
      return props.originData.fileMap;
    }
    return undefined;
  }, [props.originData?.fileMap]);

  const attachmentsDom = useMemo(() => {
    if (!filesMap || filesMap.size === 0) return null;
    const defaultHandlers = {
      onPreview: (_file: any) => {},
      onDownload: (_file: any) => {},
      onMore: (_file: any) => {},
      onViewAll: (_files: any[]) => {},
    } as const;
    const override = props.onFileConfig?.(defaultHandlers) || {};
    const handlers = {
      onPreview: override.onPreview || defaultHandlers.onPreview,
      onDownload: override.onDownload || defaultHandlers.onDownload,
      onMore: override.onMore || defaultHandlers.onMore,
      onViewAll: override.onViewAll || defaultHandlers.onViewAll,
    };
    return (
      <FileMapView
        fileMap={filesMap}
        onPreview={(file) => handlers.onPreview(file)}
        onDownload={(file) => handlers.onDownload(file)}
        onMore={(file) => handlers.onMore(file)}
        renderMoreAction={props.renderFileMoreAction}
        onViewAll={() => handlers.onViewAll(Array.from(filesMap.values()))}
        data-testid="file-item"
      />
    );
  }, [filesMap, props.onFileConfig, props.renderFileMoreAction]);

  const afterContent = useMemo(() => {
    const userAfter = props.bubbleRenderConfig?.afterMessageRender
      ? props.bubbleRenderConfig.afterMessageRender(props, contentAfterDom)
      : contentAfterDom;
    return <>{userAfter}</>;
  }, [
    props.bubbleRenderConfig?.afterMessageRender,
    typing,
    props.originData,
    props.bubbleRenderConfig?.afterMessageRender,
    contentAfterDom,
    typing,
  ]);

  const memo = useMemo(() => {
    if (
      content === LOADING_FLAT ||
      (!props.originData?.isFinished && !content)
    ) {
      if (context?.thoughtChain?.alwaysRender !== true) {
        return (
          <div
            style={{
              padding: context?.compact ? '8px' : '12px',
              lineHeight: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            className="agent-item-default-content"
            data-testid="message-content"
          >
            <LoadingIcon />
            {locale?.['chat.message.thinking'] || '思考中...'}
          </div>
        );
      }
      return null;
    }

    const defaultExtra =
      props?.bubbleRenderConfig?.extraRender === false ? null : (
        <BubbleExtra
          placement={props.placement}
          style={props.bubbleListItemExtraStyle}
          readonly={readonly}
          rightRender={props?.bubbleRenderConfig?.extraRightRender}
          onReply={props.onReply}
          onCancelLike={props.onCancelLike}
          shouldShowCopy={props.shouldShowCopy}
          useSpeech={props.useSpeech}
          shouldShowVoice={props.shouldShowVoice}
          onDisLike={
            props.onDisLike
              ? async () => {
                  try {
                    await props.onDisLike?.(props.originData as any);
                    bubbleRef?.current?.setMessageItem?.(props.id!, {
                      feedback: 'thumbsDown',
                    } as any);
                  } catch (error) {}
                }
              : undefined
          }
          bubble={props as any}
          onRenderExtraNull={(isNull) => setIsExtraNull(isNull)}
          onLike={
            props.onLike
              ? async () => {
                  try {
                    await props.onLike?.(props.originData as any);
                    bubbleRef?.current?.setMessageItem?.(props.id!, {
                      feedback: 'thumbsUp',
                    } as any);
                  } catch (error) {}
                }
              : undefined
          }
        />
      );

    const extra =
      props?.bubbleRenderConfig?.extraRender !== false &&
      props?.bubbleRenderConfig?.extraRender
        ? props?.bubbleRenderConfig?.extraRender?.(
            props as BubbleProps,
            defaultExtra,
          )
        : defaultExtra;

    if (
      content === '...' ||
      React.isValidElement(content) ||
      props.placement !== 'left' ||
      props?.originData?.extra?.tags?.includes?.('REJECT_TO_ANSWER') ||
      props.originData?.role === 'bot'
    ) {
      return (
        <div
          style={{
            lineHeight: '24px',
          }}
          className="agent-item-default-content"
          data-testid="message-box-content"
          onDoubleClick={props.onDoubleClick}
        >
          <MarkdownPreview
            beforeContent={beforeContent}
            afterContent={afterContent}
            {...props.markdownRenderConfig}
            placement={props.placement}
            markdownRenderConfig={props.markdownRenderConfig}
            isFinished={true}
            style={
              props.originData?.role === 'bot'
                ? {}
                : {
                    color: '#343A45',
                  }
            }
            extra={extra}
            typing={false}
            originData={props.originData}
            content={props.originData?.content as string}
          />
        </div>
      );
    }
    // answerStatus= 'EXCEPTION'时 一定是异常情况
    if (
      props.originData?.extra?.answerStatus === 'EXCEPTION' ||
      (props.originData?.extra?.answerStatus && !props.originData?.content)
    ) {
      return (
        <EXCEPTION
          content={props.originData.content as string}
          originData={props.originData}
          extra={isExtraNull ? null : extra}
        />
      );
    }

    const docInfoList = [props?.originData?.extra?.white_box_process].flat(
      1,
    ) as WhiteBoxProcessInterface[];
    let docInfoDom = null;

    if (
      Array.isArray(docInfoList) &&
      docInfoList.length > 0 &&
      docInfoList?.some((item) => (item?.output?.chunks?.length || 0) > 0) &&
      props.docListProps?.enable !== false
    ) {
      docInfoDom = (
        <DocInfoList
          options={
            docInfoList
              .map((item) => item.output?.chunks)
              .flat(1)
              .filter((item) => item) as Chunk[]
          }
          {...props.docListProps}
          reference_url_info_list={
            props.docListProps?.reference_url_info_list ||
            props.originData?.extra?.reference_url_info_list ||
            []
          }
        />
      );
    }

    return (
      <MarkdownPreview
        markdownRenderConfig={props.markdownRenderConfig}
        isFinished={props.originData?.isFinished}
        beforeContent={beforeContent}
        afterContent={afterContent}
        fncProps={{
          render: (mdProps, _) => {
            const reference_url_info_list =
              props.originData?.extra?.reference_url_info_list || [];
            const item =
              reference_url_info_list.find(
                (item: { placeholder: string; docId: string }) =>
                  item.placeholder === `[${mdProps.children}]` ||
                  item.placeholder === `[^${mdProps.children}]`,
              ) || funRender(mdProps as any);

            if (!item) return;
            if (!item?.origin_text) return null;
            return (
              <Popover
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '1em',
                      ...(props?.customConfig?.PopoverProps?.titleStyle || {}),
                    }}
                  >
                    <div>
                      {locale?.['chat.message.referenceDocument'] || '参考文档'}
                    </div>
                    {item?.origin_url ? (
                      <ActionIconBox
                        title={
                          locale?.['chat.message.viewOriginal'] || '查看原文'
                        }
                        tooltipProps={props?.customConfig?.TooltipProps}
                        onClick={() => {
                          if (
                            props.markdownRenderConfig?.fncProps
                              ?.onOriginUrlClick
                          ) {
                            props.markdownRenderConfig?.fncProps?.onOriginUrlClick(
                              item.origin_url,
                            );
                            return;
                          }
                          window.open(item.origin_url);
                        }}
                      >
                        <ExportOutlined />
                      </ActionIconBox>
                    ) : null}
                  </div>
                }
                content={
                  <div
                    style={{
                      width: 400,
                      display: 'flex',
                      maxHeight: 400,
                      overflow: 'auto',
                      flexDirection: 'column',
                      gap: 12,
                      ...(props?.customConfig?.PopoverProps?.contentStyle ||
                        {}),
                    }}
                  >
                    <MarkdownEditor
                      style={{
                        padding: 0,
                        width: '100%',
                      }}
                      tableConfig={{
                        actions: {
                          fullScreen: 'modal',
                        },
                      }}
                      readonly
                      contentStyle={{
                        padding: 0,
                        width: '100%',
                      }}
                      initValue={item?.origin_text?.trim()}
                    />
                    {item?.docId && item.doc_name ? (
                      <Tooltip
                        title={
                          <Typography.Text copyable={{ text: item.docId }}>
                            {item.docId}
                          </Typography.Text>
                        }
                      >
                        <div
                          style={{
                            borderRadius: '20px',
                            opacity: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '10px',
                            gap: '10px',
                            alignSelf: 'stretch',
                            background: '#FBFCFD',
                            cursor: 'pointer',
                            zIndex: 1,
                          }}
                        >
                          <img
                            style={{
                              width: 24,
                            }}
                            src={
                              'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*kF_GTppRbp4AAAAAAAAAAAAADkN6AQ/original'
                            }
                          />
                          <div
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                              display: '-webkit-box',
                            }}
                          >
                            {item?.doc_name}
                          </div>
                        </div>
                      </Tooltip>
                    ) : null}
                  </div>
                }
              >
                {_}
              </Popover>
            );
          },
          onFootnoteDefinitionChange: (nodeList) => {
            setNodeList(nodeList);
          },
          ...(props.markdownRenderConfig?.fncProps || {}),
        }}
        typing={typing}
        placement={props.placement}
        docListNode={docInfoDom}
        extra={isExtraNull ? null : extra}
        htmlRef={props.bubbleListRef}
        content={
          props.originData?.isFinished
            ? (props.originData?.content as string) ||
              locale?.['chat.message.generateFailed'] ||
              '生成回答失败，请重试'
            : (props.originData?.content as string) || ''
        }
        originData={props.originData}
      />
    );
  }, [
    content,
    props?.originData?.feedback,
    props.originData?.isFinished,
    props.originData?.isAborted,
    isExtraNull,
    props.deps,
    props.bubbleRenderConfig?.beforeMessageRender,
    props.bubbleRenderConfig?.afterMessageRender,
  ]);

  return memo;
};
