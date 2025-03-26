import React, { useMemo } from 'react';
import { DocMeta, WhiteBoxProcessInterface } from '.';
import { MarkdownEditorProps } from '../MarkdownEditor';
import { CostMillis } from './CostMillis';

/**
 * RagRetrievalInfo 组件显示搜索查询和检索结果。
 *
 * @param props - 组件的属性。
 * @param props.onMetaClick - 当元数据项被点击时的回调函数。
 * @param props.input - 包含搜索查询的输入数据。
 * @param props.category - 类别类型，用于确定是否显示检索结果。
 * @param props.output - 包含检索块的输出数据。
 * @param props.costMillis - 检索过程的耗时（毫秒）。
 *
 * @returns 显示搜索查询和检索结果的 JSX 元素。
 */
export const RagRetrievalInfo = (
  props: {
    onMetaClick: (meta: DocMeta) => void;
    isFinished?: boolean;
    markdownRenderProps?: MarkdownEditorProps;
  } & WhiteBoxProcessInterface,
) => {
  return useMemo(
    () => (
      <>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '8px 12px',
            gap: '10px',
            alignSelf: 'stretch',
            background: '#FBFCFD',
            zIndex: 1,
            borderRadius: '12px',
            flexWrap: 'wrap',
          }}
        >
          查询关键词
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              borderRadius: '12px',
              flexWrap: 'wrap',
              maxWidth: '100%',
            }}
          >
            {props.input?.searchQueries?.map((query, index) => {
              return (
                <div
                  key={index}
                  style={{
                    height: '24px',
                    borderRadius: '12px',
                    opacity: 1,
                    display: 'flex',
                    lineHeight: '24px',
                    padding: '1px 10px',
                    gap: '4px',
                    maxWidth: '100%',
                    background: '#FFFFFF',
                    zIndex: 0,
                    overflow: 'hidden',
                    textWrap: 'nowrap',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {query}
                </div>
              );
            })}
          </div>
        </div>
        {props.output?.chunks?.length ? (
          <pre
            style={{
              display: 'flex',
              flexDirection: 'column',
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
                alignItems: 'center',
              }}
            >
              <span>检索结果 </span>
              <CostMillis costMillis={props.costMillis} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '4px',
                flexWrap: 'wrap',
                borderRadius: '12px',
              }}
            >
              {Array.from(
                new Set(
                  props.output?.chunks?.map((query) => query.docMeta?.doc_name),
                ),
              )?.map((query, index) => {
                const chunk = props.output?.chunks?.find(
                  (item) => item.docMeta?.doc_name === query,
                );
                return (
                  <div
                    key={index}
                    style={{
                      height: '32px',
                      borderRadius: '6px',
                      opacity: 1,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '4px 10px',
                      gap: '8px',
                      background: '#FFFFFF',
                      zIndex: 0,
                      width: 'max-content',
                    }}
                    onClick={() => {
                      if (!chunk) return;
                      props.onMetaClick?.(chunk.docMeta);
                    }}
                  >
                    <img
                      src="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*1vi5SZ5lqbsAAAAAAAAAAAAADkN6AQ/original"
                      width={16}
                      style={{
                        minWidth: 16,
                      }}
                    />
                    <span>{query || chunk?.docMeta?.answer}</span>
                  </div>
                );
              })}
            </div>
          </pre>
        ) : null}
      </>
    ),
    [
      props.category,
      JSON.stringify(props.info),
      JSON.stringify(props.output),
      JSON.stringify(props.input),
      props.costMillis,
      props.isFinished,
    ],
  );
};
