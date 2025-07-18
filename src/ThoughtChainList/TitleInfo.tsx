import { Popover } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext, useMemo } from 'react';
import { DocMeta } from '.';
import { RagIcon, ToolCallIcon } from '../components/icons';
import { DatabaseIcon } from '../components/icons/DatabaseIcon';
import { DocumentIcon } from '../components/icons/DocumentIcon';
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
  isFinished?: boolean;
  onMetaClick?: (meta: Partial<DocMeta>) => void;
  instanceId?: string;
  titleExtraRender?: (defaultDom: React.ReactNode) => React.ReactNode;
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
  const { collapse, isFinished, setCollapse } = props;
  const { locale } = useContext(I18nContext);
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
              infoTitle = locale.multipleKnowledgeBases;
            } else if (props.category === 'TableSql') {
              infoTitle = metaList.at(0)?.name + locale.multipleTables;
            } else if (props.category === 'ToolCall') {
              infoTitle = metaList.at(0)?.name + locale.multipleTools;
            } else {
              infoTitle = metaList.at(0)?.name + locale.multipleData;
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
                        key={`${index}-${subIndex}`}
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
                        <DocumentIcon
                          size={22}
                          style={{
                            minWidth: 22,
                          }}
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
                `${props.prefixCls}-content-list-item-info-tag`,
                props.hashId,
              )}
            >
              {props.category === 'ToolCall' && (
                <ToolCallIcon width={18} height={18} />
              )}
              {props.category === 'RagRetrieval' && (
                <RagIcon width={18} height={18} />
              )}
              {props.category === 'TableSql' ? (
                <DatabaseIcon size={18} />
              ) : null}
              <span
                className={classNames(
                  `${props.prefixCls}-content-list-item-info-tag-text`,
                  props.hashId,
                )}
              >
                {isFinished ? (
                  infoTitle || tag
                ) : (
                  <FlipText word={infoTitle || tag} />
                )}
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
          {isFinished ? tag : <FlipText word={tag} />}
        </span>
      );
    });
  }, [props.title]);

  const extraTitleDom = (
    <ActionIconBox
      title={collapse ? locale.expand : locale.collapse}
      onClick={() => {
        setCollapse?.(!collapse);
      }}
    >
      {!collapse ? <ExpandIcon /> : <CollapseIcon />}
    </ActionIconBox>
  );

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
          {props.titleExtraRender
            ? props.titleExtraRender(extraTitleDom)
            : extraTitleDom}
        </div>
      </div>
    ),
    [titleDom, isFinished, collapse, props.costMillis],
  );
};
