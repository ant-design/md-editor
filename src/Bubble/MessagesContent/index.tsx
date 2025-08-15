import { ExportOutlined } from '@ant-design/icons';
import {
  Chunk,
  WhiteBoxProcessInterface,
} from '@ant-design/md-editor/ThoughtChainList';
import { Popover, Tooltip, Typography } from 'antd';
import React, { useContext, useMemo } from 'react';
import { LoadingIcon } from '../../icons/LoadingIcon';
import { ActionIconBox, MarkdownEditor, useRefFunction } from '../../index';
import { BubbleConfigContext } from '../BubbleConfigProvide';
import { BubbleProps, MessageBubbleData } from '../type';
import { BubbleExtra } from './BubbleExtra';
import { DocInfoList } from './DocInfo';
import { EXCEPTION } from './EXCEPTION';
import { MarkdownPreview } from './MarkdownPreview';

export const LOADING_FLAT = '...';

/**
 * MessageComponent 组件
 *
 * 用于渲染单条聊天消息的组件，支持以下功能：
 * 1. 渲染文本内容（支持 Markdown）
 * 2. 显示文档信息列表
 * 3. 提供点赞、点踩、复制等交互操作
 * 4. 支持幻灯片模式
 * 5. 支持自定义渲染
 *
 * @component
 * @example
 * // 基础用法
 * ```tsx
 * <MessageComponent
 *   content="Hello World"
 *    bubbleRef={ bubbleRef}
 *   readonly={false}
 * />
 * ```
 *
 * @example
 * // 带 Markdown 的用法
 * ```tsx
 * <MessageComponent
 *   content="# 标题\n这是**加粗**的文本"
 *    bubbleRef={ bubbleRef}
 *   markdownRenderConfig={{
 *     fncProps: {
 *       enableCopy: true,
 *       enablePreview: true
 *     }
 *   }}
 * />
 * ```
 *
 * @example
 * // 带文档列表的用法
 * ```tsx
 * <MessageComponent
 *   content="相关文档："
 *    bubbleRef={ bubbleRef}
 *   docListProps={{
 *     enable: true,
 *     docList: [
 *       { title: "文档1", url: "https://example.com/doc1" },
 *       { title: "文档2", url: "https://example.com/doc2" }
 *     ]
 *   }}
 * />
 * ```
 *
 * @example
 * // 带自定义渲染的用法
 * ```tsx
 * <MessageComponent
 *   content="自定义消息"
 *    bubbleRef={ bubbleRef}
 *   extraRender={(props, defaultDom) => (
 *     <div>
 *       {defaultDom}
 *       <button>自定义按钮</button>
 *     </div>
 *   )}
 * />
 * ```
 *
 * @param {MessageComponentProps} props - 组件属性
 * @param {string | ReactNode} props.content - 消息内容，可以是字符串或 React 节点
 * @param {MutableRefObject<BubbleChatInstance>} props. bubbleRef - 聊天实例的引用
 * @param {boolean} [props.readonly] - 是否为只读模式，默认为 false
 * @param {BaseChatProps['markdownRenderConfig']} [props.markdownRenderConfig] - Markdown 渲染配置
 * @param {CustomConfig} [props.customConfig] - 自定义配置
 * @param {any[]} [props.deps] - 依赖项数组
 * @param {BaseChatProps['onDisLike']} [props.onDisLike] - 点踩的回调函数
 * @param {BaseChatProps['onLike']} [props.onLike] - 点赞的回调函数
 * @param {BaseChatProps['onReply']} [props.onReply] - 回复的回调函数
 * @param {BaseChatProps['slidesModeProps']} props.slidesModeProps - 幻灯片模式的配置属性
 * @param {BaseChatProps['docListProps']} [props.docListProps] - 文档列表的属性
 * @param {WithFalse<(props: BubbleProps, defaultDom: ReactNode) => ReactNode>} [props.extraRender] - 额外内容的渲染函数
 * @param {React.CSSProperties} [props.bubbleListItemExtraStyle] - 聊天项额外操作区域的样式
 *
 * @returns {JSX.Element} 返回渲染后的消息组件
 *
 * @remarks
 * - 组件会自动处理 Markdown 内容的渲染
 * - 支持异常消息的特殊展示
 * - 提供完整的交互操作（点赞、点踩、复制等）
 * - 支持幻灯片模式，可以全屏查看内容
 * - 可以通过 extraRender 完全自定义额外操作区域
 *
 * @see {@link BubbleProps} 了解更多关于聊天项属性的信息
 * @see {@link BaseChatProps} 了解更多关于基础聊天属性的信息
 */
export const BubbleMessageDisplay: React.FC<
  BubbleProps & {
    content: MessageBubbleData['content'];
    bubbleListItemExtraStyle?: React.CSSProperties;
  }
> = ({ content, bubbleRef, readonly, ...props }) => {
  /**
   * 获取聊天配置上下文
   * @type {ChatConfigContext}
   */
  const context = useContext(BubbleConfigContext);

  /**
   * 幻灯片模式状态
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [slidesMode, setSlidesMode] = React.useState(false);

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

  const afterContent = useMemo(() => {
    return props.bubbleRenderConfig?.afterMessageRender
      ? props.bubbleRenderConfig.afterMessageRender(props, null)
      : null;
  }, [props.bubbleRenderConfig?.afterMessageRender, typing, props.originData]);

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
            {context?.locale?.['chat.message.thinking'] || '正在思考中...'}
          </div>
        );
      }
      return null;
    }

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
          data-testid="message-content"
          onDoubleClick={props.onDoubleClick}
        >
          <MarkdownPreview
            beforeContent={beforeContent}
            afterContent={afterContent}
            {...props.markdownRenderConfig}
            isFinished={true}
            style={
              props.originData?.role === 'bot'
                ? {}
                : {
                    color: '#FFF',
                  }
            }
            extra={null}
            typing={false}
            originData={props.originData}
            content={props.originData?.content as string}
          />
        </div>
      );
    }

    const defaultExtra =
      props?.bubbleRenderConfig?.extraRender === false ? null : (
        <BubbleExtra
          style={props.bubbleListItemExtraStyle}
          readonly={readonly}
          render={props?.bubbleRenderConfig?.extraRender}
          rightRender={props?.bubbleRenderConfig?.extraRightRender}
          onReply={props.onReply}
          onCancelLike={props.onCancelLike}
          shouldShowCopy={props.shouldShowCopy}
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
          onOpenSlidesMode={() => setSlidesMode(true)}
          slidesModeProps={props.slidesModeProps}
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
              ) || funRender(mdProps);

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
                    <div>参考文档</div>
                    {item?.origin_url ? (
                      <ActionIconBox
                        title="查看原文"
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
        slidesMode={slidesMode}
        onCloseSlides={() => setSlidesMode(false)}
        typing={typing}
        docListNode={docInfoDom}
        extra={isExtraNull ? null : extra}
        htmlRef={props.bubbleListRef}
        content={
          props.originData?.isFinished
            ? (props.originData?.content as string) ||
              context?.locale?.['chat.message.error'] ||
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
    slidesMode,
    isExtraNull,
    props.deps,
    props.bubbleRenderConfig?.beforeMessageRender,
    props.bubbleRenderConfig?.afterMessageRender,
  ]);

  return memo;
};
