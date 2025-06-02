import { Popover } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext, useMemo } from 'react';
import { DocMeta } from '.';
import { I18nContext } from '../i18n';
import { ActionIconBox } from '../index';
import { CollapseIcon, ExpandIcon } from './Collapse';
import { CostMillis } from './CostMillis';
import { FlipText } from './FlipText';

/**
 * TitleInfo 组件用于显示带有元数据的标题信息。
 *
 * @param props - 组件的属性对象。
 * @param props.costMillis - 可选的耗时信息，以毫秒为单位。
 * @param props.category - 标题所属的类别。
 * @param props.title - 标题文本，可能包含元数据标签。
 * @param props.prefixCls - 样式前缀。
 * @param props.hashId - 样式哈希ID。
 * @param props.onMetaClick - 可选的元数据点击事件处理函数。
 * @param props.meta - 元数据对象，键为元数据标签，值为元数据数组。
 *
 * @returns 返回一个包含标题信息的 JSX 元素。
 */
export const TitleInfo = (props: {
  costMillis?: number;
  category: string;
  title: string;
  prefixCls: string;
  setCollapse: (collapse: boolean) => void;
  collapse: boolean;
  hashId: string;
  onMetaClick?: (meta: Partial<DocMeta>) => void;
  meta: Record<
    string,
    {
      name: string;
      icon: string;
      uuid: string;
      type: string;
      description: string;
    }[]
  >;
}) => {
  const { collapse, setCollapse } = props;
  const i18n = useContext(I18nContext);
  const titleDom = useMemo(() => {
    const titleSegments = props.title.split(/(\$\{.*})/);

    return titleSegments?.map((tag, index) => {
      const meta = props.meta || {};
      if (tag.startsWith('${') && tag.endsWith('}')) {
        let infoTitle = tag;
        const metaList =
          [meta[tag.replaceAll('${', '')?.replaceAll('}', '')]].flat(1) || [];

        if (Array.isArray(metaList)) {
          if (metaList.length > 1) {
            if (props.category === 'RagRetrieval') {
              infoTitle = i18n.locale?.multipleKnowledgeBases || '多个知识库';
            } else if (props.category === 'TableSql') {
              infoTitle =
                metaList.at(0)?.name +
                (i18n.locale?.multipleTables || '多个表格');
            } else if (props.category === 'ToolCall') {
              infoTitle =
                metaList.at(0)?.name +
                (i18n.locale?.multipleTools || '等多个工具');
            } else {
              infoTitle =
                metaList.at(0)?.name +
                (i18n.locale?.multipleData || '等多个数据');
            }
          }
          if (metaList.length === 1) {
            infoTitle = metaList.at(0)?.name || tag;
          }
        }
        return (
          <Popover
            key={index}
            open={metaList.length > 1 ? undefined : false}
            trigger="hover"
            content={
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                  gap: '4px',
                  maxHeight: 400,
                  overflow: 'auto',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {[metaList]
                  ?.flat(1)
                  .filter((item) => item)
                  .map((item, subIndex) => {
                    return (
                      <motion.span
                        key={subIndex}
                        className={classNames(
                          `${props.prefixCls}-content-list-item-info`,
                          props.hashId,
                        )}
                        onClick={() => {
                          props?.onMetaClick?.({
                            doc_name: item.name,
                            doc_id: item.uuid,
                            type: item.type,
                            origin_text: item.description,
                          });
                        }}
                      >
                        <img
                          width={22}
                          src={
                            item.icon ||
                            'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*owExQ60sdmAAAAAAAAAAAAAADkN6AQ/original'
                          }
                        />
                        <span
                          style={{
                            overflow: 'hidden',
                            textWrap: 'nowrap',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'left',
                          }}
                        >
                          {item.name}
                        </span>
                      </motion.span>
                    );
                  })}
              </div>
            }
          >
            <motion.span
              key={index}
              className={classNames(
                `${props.prefixCls}-content-list-item-info`,
                props.hashId,
              )}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0px 6px',
                gap: '6px',
                borderRadius: '12px',
                height: '2em',
                wordBreak: 'break-all',
                wordWrap: 'break-word',
                maxWidth: '100%',
                background:
                  'radial-gradient(22% 66% at 96% 113%, rgba(255, 255, 245, 0.52) 0%, rgba(230, 238, 255, 0) 100%), radial-gradient(14% 234% at 100% 50%, rgba(162, 255, 255, 0.28) 0%, rgba(153, 202, 255, 0.1193) 13%, rgba(229, 189, 255, 0.0826) 38%, rgba(235, 255, 245, 0) 100%), #FFFFFF',
                border: '1px solid rgba(227, 230, 234, 0.65)',
                lineHeight: '26px',
              }}
            >
              {props.category === 'ToolCall' ? (
                <img
                  width={18}
                  src="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*owExQ60sdmAAAAAAAAAAAAAADkN6AQ/original"
                />
              ) : null}
              {props.category === 'RagRetrieval' ? (
                <img
                  width={18}
                  src="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*TzR2R6uohL0AAAAAAAAAAAAADkN6AQ/original"
                />
              ) : null}
              {props.category === 'TableSql' ? (
                <img
                  width={18}
                  src="https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*Np4tQ6SDSEsAAAAAAAAAAAAADkN6AQ/original"
                />
              ) : null}
              <span
                style={{
                  overflow: 'hidden',
                  textWrap: 'nowrap',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: '26px',
                }}
              >
                <FlipText word={infoTitle || tag} />
              </span>
            </motion.span>
          </Popover>
        );
      }
      return (
        <span
          key={index}
          style={{
            overflow: 'hidden',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <FlipText word={tag} />
        </span>
      );
    });
  }, [props.title]);

  return useMemo(
    () => (
      <div
        className={classNames(
          `${props.prefixCls}-content-list-item-info`,
          props.hashId,
        )}
      >
        <div
          className={classNames(
            `${props.prefixCls}-content-list-item-info-title`,
            props.hashId,
          )}
        >
          {titleDom}
          <CostMillis costMillis={props.costMillis} />
        </div>
        <div
          className={classNames(
            `${props.prefixCls}-content-list-item-info-action`,
            props.hashId,
          )}
        >
          <ActionIconBox
            title={
              collapse
                ? i18n?.locale?.expand || '展开'
                : i18n?.locale?.collapse || '收起'
            }
            onClick={() => {
              setCollapse?.(!collapse);
            }}
          >
            {!collapse ? <ExpandIcon /> : <CollapseIcon />}
          </ActionIconBox>
        </div>
      </div>
    ),
    [titleDom, collapse, props.costMillis],
  );
};
