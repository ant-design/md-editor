import { CloseCircleFilled } from '@ant-design/icons';
import { ConfigProvider, Descriptions, Drawer, Typography } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { motion } from 'framer-motion';
import React, { useContext, useEffect, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MagicIcon } from '../components/icons/MagicIcon';
import { compileTemplate, I18nContext } from '../i18n';
import { FinishedIcon } from '../icons/FinishedIcon';
import { LoadingIcon } from '../icons/LoadingIcon';
import { ActionIconBox, MarkdownEditorProps, useAutoScroll } from '../index';
import { CollapseIcon, ExpandIcon } from './Collapse';
import { DotLoading } from './DotAni';
import { FlipText } from './FlipText';
import { useStyle } from './style';
import { ThoughtChainListItem } from './ThoughtChainListItem';

dayjs.extend(duration);

import { merge } from 'lodash-es';

export interface WhiteBoxProcessInterface {
  /** 分类类型
   * @example "TableSql"
   */
  category?:
    | 'TableSql'
    | 'ToolCall'
    | 'RagRetrieval'
    | 'DeepThink'
    | 'WebSearch'
    | 'other';
  isLoading?: boolean;
  /** 信息描述
   * @example "正在查询用户表数据"
   */
  info?: string;
  /** 执行耗时（毫秒）
   * @example 1500
   */
  costMillis?: number;
  input?: {
    /** SQL 查询语句
     * @example "SELECT * FROM users WHERE id = 1"
     */
    sql?: string;
    inputArgs?: {
      /** 请求体数据
       * @example { "name": "张三", "age": 25 }
       */
      requestBody?: Record<string, any>;
      /** URL 路径参数
       * @example { "id": "123", "type": "user" }
       */
      parameters?: Record<string, any>;
      /** URL 查询参数
       * @example { "page": 1, "size": 10 }
       */
      params?: Record<string, any>;
    };
    /** 搜索关键词列表
     * @example ["用户管理", "账户信息"]
     */
    searchQueries?: string[];
  };
  meta?: {
    /** 工具描述
     * @example "查询用户信息的接口"
     */
    description?: string;
    /** HTTP 请求方法
     * @example "GET"
     */
    method?: string;
    /** 工具名称
     * @example "getUserInfo"
     */
    name?: string;
    /** 接口路径
     * @example "/api/user/info"
     */
    path?: string;
    /** 请求数据
     * @example { "userId": 123 }
     */
    data?: Record<string, any>;
    /** 请求参数字符串
     * @example "userId=123&type=full"
     */
    requestParams?: string;
    /** 响应体
     * @example "{'code': 200, 'data': {...}}"
     */
    responseBody?: string;
    /** 响应状态
     * @example "success"
     */
    status?: string;
    /** 工具集唯一标识
     * @example "tool-set-001"
     */
    toolSetUuid?: string;
    /** 工具集版本号
     * @example 1
     */
    toolSetVersion?: number;
    /** 工具实例唯一标识
     * @example "tool-instance-001"
     */
    uuid?: string;
  };
  /**
   * 任务的 id，用于标识任务
   */
  runId?: string;
  output?: {
    type?: 'TOKEN' | 'TABLE' | 'CHUNK' | 'ERROR' | 'END' | 'RUNNING';
    data?: string;
    /** 错误信息
     * @example "查询失败：数据库连接超时"
     */
    errorMsg?: string;
    /** API 响应数据
     * @example { "status": "success", "data": { "id": 1, "name": "张三" } }
     */
    response?: Record<string, any>;
    /** 文档块数组
     * @example [{ "content": "产品介绍", "docMeta": { "doc_name": "产品手册" } }]
     */
    chunks?: Chunk[];
    /** 表格数据
     * @example { name: ['Tom', 'Jim', 'Lucy'],age: ['18', '20', '22'], address: ['Shanghai', 'Beijing', 'Hangzhou'] }
     */
    tableData?: Record<string, any>;
    /** 表格列名
     * @example ["id", "name", "age"]
     */
    columns?: string[];
  };
}

export interface Chunk {
  docMeta: DocMeta;
  content: string;
  originUrl: string;
}

export interface DocMeta {
  type?: string;
  doc_id?: string;
  upload_time?: string;
  doc_name?: string;
  origin_text?: string;
  answer?: string;
}

export interface ThoughtChainListProps {
  thoughtChainList: WhiteBoxProcessInterface[];
  loading?: boolean;
  bubble?: {
    isFinished?: boolean;
    endTime?: number;
    createAt?: number;
    isAborted?: boolean;
  };
  style?: React.CSSProperties;
  compact?: boolean;
  markdownRenderProps?: MarkdownEditorProps;
  finishAutoCollapse?: boolean;
  locale?: {
    thinking?: string;
    taskFinished?: string;
    taskCost?: string;
    taskAborted?: string;
    totalTimeUsed?: string;
    taskComplete?: string;
  };
  onDocMetaClick?: (docMeta: DocMeta | null) => void;
}

// 思维链标题组件 - 独立 memo
const ThoughtChainTitle = React.memo<{
  prefixCls: string;
  hashId: string;
  collapse: boolean;
  compact?: boolean;
  endStatusDisplay: React.ReactNode;
  onCollapseToggle: () => void;
  locale: any;
}>(
  ({
    prefixCls,
    hashId,
    collapse,
    compact,
    endStatusDisplay,
    onCollapseToggle,
    locale,
  }) => {
    return (
      <motion.div
        className={classNames(`${prefixCls}-title`, hashId, {
          [`${prefixCls}-title-collapse`]: collapse,
          [`${prefixCls}-title-compact`]: compact,
        })}
      >
        <div>
          <MagicIcon
            style={{
              width: 15,
              height: 15,
            }}
          />
          <span
            className={classNames(`${prefixCls}-title-progress`, hashId)}
            style={{
              fontSize: '1em',
            }}
          >
            {endStatusDisplay}
          </span>
        </div>

        <ActionIconBox
          title={
            collapse ? locale?.expand || '展开' : locale?.collapse || '收起'
          }
          onClick={onCollapseToggle}
        >
          {!collapse ? <ExpandIcon /> : <CollapseIcon />}
        </ActionIconBox>
      </motion.div>
    );
  },
);

// 文档预览抽屉组件 - 独立 memo
const DocumentDrawer = React.memo<{
  docMeta: Partial<DocMeta> | null;
  onClose: () => void;
  locale: any;
}>(({ docMeta, onClose, locale }) => {
  return (
    <Drawer
      title={locale?.preview + ' ' + docMeta?.doc_name}
      open={!!docMeta}
      onClose={onClose}
      width={'40vw'}
    >
      <Descriptions
        column={1}
        items={
          [
            {
              label: '名称',
              span: 1,
              children: docMeta?.doc_name || docMeta?.answer,
            },
            {
              label: '更新时间',
              span: 1,
              children: dayjs(docMeta?.upload_time).format(
                'YYYY-MM-DD HH:mm:ss',
              ),
            },
            {
              label: '类型',
              span: 1,
              children: docMeta?.type,
            },
            docMeta?.origin_text
              ? {
                  label: '内容',
                  span: 1,
                  children: docMeta?.origin_text,
                }
              : null,
          ].filter(Boolean) as any[]
        }
      />
    </Drawer>
  );
});

// 思维链列表内容组件 - 独立 memo
const ThoughtChainContent = React.memo<{
  prefixCls: string;
  hashId: string;
  collapse: boolean;
  compact?: boolean;
  thoughtChainList: WhiteBoxProcessInterface[];
  bubble?: {
    isFinished?: boolean;
    endTime?: number;
    createAt?: number;
    isAborted?: boolean;
  };
  loading?: boolean;
  markdownRenderProps?: MarkdownEditorProps;
  onDocMetaClick: (docMeta: DocMeta) => void;
}>(
  ({
    prefixCls,
    hashId,
    collapse,
    compact,
    thoughtChainList,
    bubble,
    loading,
    markdownRenderProps,
    onDocMetaClick,
  }) => {
    const { containerRef } = useAutoScroll({
      SCROLL_TOLERANCE: 30,
    });

    const processedItems = useMemo(() => {
      if (collapse) return [];

      return thoughtChainList.map((item, index) => {
        let info = item.info;
        let icon = <LoadingIcon />;
        let isFinished = false;

        if (
          (item.output || bubble?.isFinished) &&
          item.output?.type !== 'TOKEN' &&
          item.output?.type !== 'RUNNING'
        ) {
          isFinished = true;
          icon = <FinishedIcon />;
        }

        if (item.output?.errorMsg) {
          icon = (
            <CloseCircleFilled
              style={{
                color: 'red',
              }}
            />
          );
        }

        return {
          key: index.toString(),
          ...item,
          info,
          isFinished,
          status:
            !item.output ||
            item.output?.type === 'RUNNING' ||
            item.output?.type === 'TOKEN'
              ? 'loading'
              : 'success',
          icon: icon,
        } as WhiteBoxProcessInterface & {
          icon: React.ReactNode;
          isFinished?: boolean;
        };
      });
    }, [thoughtChainList, bubble?.isFinished, collapse]);

    return (
      <motion.div
        className={classNames(
          `${prefixCls}-content`,
          {
            [`${prefixCls}-content-collapse`]: collapse,
            [`${prefixCls}-content-compact`]: compact,
          },
          hashId,
        )}
        ref={containerRef}
      >
        <motion.div
          role="list"
          className={classNames(`${prefixCls}-content-list`, hashId)}
          variants={{
            hidden: {
              opacity: 0,
              transition: {
                when: 'afterChildren',
              },
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                when: 'beforeChildren',
              },
            },
          }}
          whileInView="visible"
          initial="hidden"
          animate="visible"
        >
          {processedItems.map((item, index) => {
            const info = item.info?.split(/(\$\{\w+\})/);
            if (!info) return null;

            return (
              <ErrorBoundary
                fallback={
                  <Typography.Paragraph code>
                    <pre>
                      <code>
                        {JSON.stringify(
                          thoughtChainList.at(index) || {
                            message: 'error',
                          },
                          null,
                          2,
                        )}
                      </code>
                    </pre>
                  </Typography.Paragraph>
                }
                key={(item.runId || '') + '' + index}
              >
                <ThoughtChainListItem
                  index={index}
                  markdownRenderProps={merge(markdownRenderProps, {
                    codeProps: {
                      hideToolBar: true,
                      showLineNumbers: false,
                      showGutter: false,
                      fontSize: 12,
                    },
                  })}
                  bubble={bubble}
                  key={(item.runId || '') + '' + index}
                  thoughtChainListItem={item}
                  hashId={hashId}
                  isFinished={
                    item.isFinished || (!loading && !!bubble?.endTime)
                  }
                  setDocMeta={onDocMetaClick}
                  prefixCls={prefixCls}
                />
              </ErrorBoundary>
            );
          })}
        </motion.div>
      </motion.div>
    );
  },
);

/**
 * 思维链展示组件
 *
 * 该组件用于展示AI思考过程中的思维链列表，以可视化方式呈现AI推理及处理步骤。
 *
 * 功能特点:
 * - 支持折叠/展开显示思维链详情
 * - 自动滚动到最新内容
 * - 显示任务进度和耗时信息
 * - 提供文档预览抽屉功能
 * - 思维链项状态可视化（加载中、完成、错误）
 * - 完成后自动折叠思维链
 * - 细粒度性能优化，减少不必要的重新渲染
 *
 * @component
 * @param {object} props - 组件属性
 * @param {Array<WhiteBoxProcessInterface>} props.thoughtChainList - 思维链数据列表
 * @param {object} props.bubble - 聊天项数据，包含状态信息
 * @param {boolean} props.bubble.isFinished - 聊天是否已完成
 * @param {number} props.bubble.endTime - 聊天结束时间戳
 * @param {number} props.bubble.createAt - 聊天创建时间戳
 * @param {boolean} props.loading - 是否正在加载中
 * @param {CSSProperties} props.style - 自定义样式
 *
 * @example
 * <ThoughtChainList
 *   thoughtChainList={thoughtChainData}
 *   bubble={currentBubble}
 *   loading={isLoading}
 *   style={{ marginBottom: 16 }}
 * />
 *
 * @returns {ReactNode} 渲染的思维链列表组件
 */
export const ThoughtChainList: React.FC<ThoughtChainListProps> = React.memo(
  (props) => {
    const { locale } = useContext(I18nContext);
    const {
      thoughtChainList,
      loading,
      //@ts-ignore
      bubble = props.chatItem,
      style,
      compact,
      markdownRenderProps,
      finishAutoCollapse = true,
      onDocMetaClick,
    } = props;
    const context = useContext(ConfigProvider.ConfigContext);
    const [collapse, setCollapse] = React.useState<boolean>(false);
    const prefixCls = context.getPrefixCls('thought-chain-list');
    const { wrapSSR, hashId } = useStyle(prefixCls);
    const [docMeta, setDocMeta] = React.useState<Partial<DocMeta> | null>(null);

    useEffect(() => {
      if (bubble?.isFinished && finishAutoCollapse !== false) {
        setCollapse(true);
      }
    }, [bubble?.isFinished, finishAutoCollapse]);

    // memo 化的回调函数
    const handleCollapseToggle = React.useCallback(() => {
      setCollapse(!collapse);
    }, [collapse]);

    const handleDocMetaClose = React.useCallback(() => {
      setDocMeta(null);
      onDocMetaClick?.(null);
    }, [onDocMetaClick]);

    const handleDocMetaClick = React.useCallback(
      (meta: DocMeta) => {
        setDocMeta(meta);
        onDocMetaClick?.(meta);
      },
      [onDocMetaClick],
    );

    const endStatusDisplay = useMemo(() => {
      const time = ((bubble?.endTime || 0) - (bubble?.createAt || 0)) / 1000;

      if (!loading && bubble?.isAborted) {
        if (time > 0) {
          return (
            <FlipText
              word={`${locale.taskAborted}, ${locale.totalTimeUsed} ${time.toFixed(2)}s`}
            />
          );
        }
        return <FlipText word={locale.taskAborted} />;
      }

      if (!loading && bubble?.isFinished) {
        if (time > 0) {
          return (
            <FlipText
              word={`${locale.taskComplete}, ${locale.totalTimeUsed} ${time.toFixed(2)}s`}
            />
          );
        }
        return <FlipText word={locale.taskComplete} />;
      }

      return (
        <div>
          {thoughtChainList.at(-1) && collapse ? (
            compileTemplate(locale.inProgressTask, {
              taskName:
                locale[thoughtChainList.at(-1)?.category || 'other'] || '',
            })
          ) : (
            <div>
              {locale.thinking}
              <DotLoading />
            </div>
          )}
        </div>
      );
    }, [
      loading,
      thoughtChainList?.at?.(-1)?.category,
      bubble?.isFinished,
      bubble?.isAborted,
      bubble?.endTime,
      bubble?.createAt,
      collapse,
      locale,
    ]);

    return wrapSSR(
      <>
        <DocumentDrawer
          docMeta={docMeta}
          onClose={handleDocMetaClose}
          locale={locale}
        />

        <div className={classNames(`${prefixCls}`, hashId)} style={style}>
          <motion.div
            transition={{ duration: 0.3 }}
            className={classNames(`${prefixCls}-container`, hashId, {
              [`${prefixCls}-container-loading`]: !bubble?.isFinished,
            })}
          >
            <ThoughtChainTitle
              prefixCls={prefixCls}
              hashId={hashId}
              collapse={collapse}
              compact={compact}
              endStatusDisplay={endStatusDisplay}
              onCollapseToggle={handleCollapseToggle}
              locale={locale}
            />

            <div
              style={{
                backgroundColor: '#FFF',
                position: 'relative',
                borderRadius: '6px 12px 12px 12px',
                zIndex: 9,
              }}
            >
              <ThoughtChainContent
                prefixCls={prefixCls}
                hashId={hashId}
                collapse={collapse}
                compact={compact}
                thoughtChainList={thoughtChainList}
                bubble={bubble}
                loading={loading}
                markdownRenderProps={markdownRenderProps}
                onDocMetaClick={handleDocMetaClick}
              />
            </div>
          </motion.div>
        </div>
      </>,
    );
  },
);
