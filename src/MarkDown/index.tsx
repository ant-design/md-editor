import { RootContent } from 'mdast';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import parse from 'remark-parse';
import { unified } from 'unified';

const myRemark = remark().use(remarkGfm);

export type NodeToSchema = {
  type: string;
  value?: string;
  lang?: string;
  nodeType: string;
  title?: string;
  originalNode?: RootContent;
  otherProps?: {
    chartType?: string;
    pureTitle?: string;
    data?: { [key: string]: string }[];
    columns?: { title: string; dataIndex: string; key: string }[];
    dataSource?: { [key: string]: string }[];
  };
};

const nodeToSchema = (
  node: RootContent,
  config: NodeToSchema['otherProps'],
): NodeToSchema | undefined | null => {
  if (node.type === 'table') {
    const tableHeader = node.children?.at(0);
    const columns =
      tableHeader?.children
        // @ts-ignore
        ?.map((node) => myRemark.stringify(node)?.replace(/\n/g, '').trim())
        .map((title) => {
          return {
            title,
            dataIndex: title,
            key: title,
          };
        }) || [];

    const dataSource =
      node.children?.slice(1).map((row) => {
        return row.children?.reduce((acc, cell, index) => {
          // @ts-ignore
          acc[columns[index].dataIndex] = myRemark
            // @ts-ignore
            .stringify(cell)
            ?.replace(/\n/g, '')
            .trim();
          return acc;
        }, {} as any);
      }) || [];

    if (config?.chartType) {
      return {
        type: 'chart',
        otherProps: {
          ...(config || {}),
          chartType: config?.chartType,
          data: dataSource.map((item) => {
            delete item?.chartType;
            return {
              ...item,
            };
          }),
        },
        nodeType: node.type,
        originalNode: node,
      };
    }
    return {
      type: 'table',
      otherProps: {
        columns,
        dataSource,
      },
      nodeType: node.type,
      originalNode: node,
    };
  }
  if (node.type === 'code') {
    return {
      type: 'code',
      value: node.value,
      lang: node.lang || 'text',
      nodeType: node.type,
      originalNode: node,
    };
  }
  if (node.type === 'heading') {
    const pref = node.children.at(0);
    return {
      type: 'heading',
      otherProps: {
        // @ts-ignore
        pureTitle: pref ? myRemark.stringify(pref) : myRemark.stringify(node),
      },
      // @ts-ignore
      value: myRemark.stringify(node),
      nodeType: node.type,
      originalNode: node,
    };
  }
  if (node.type === 'html') {
    const value = node.value?.match(/\{[^\{\}]*\}/)?.at(0) || '{}';
    try {
      return {
        type: 'config',
        otherProps: JSON.parse(value),
        nodeType: node.type,
        originalNode: node,
      };
    } catch (error) {
      return null;
    }
  }
};

const getTitle = (
  preNode: NodeToSchema | undefined,
  node: RootContent | undefined,
) => {
  if (preNode?.type === 'heading' && node?.type !== 'heading') {
    return preNode?.otherProps?.pureTitle || '';
  }
  return '';
};

export const mdToApassifySchema = (md: string) => {
  const processor = unified().use(parse).use(remarkGfm, { singleTilde: false });
  const ast = processor.parse(md);

  return ast.children.reduce(
    (preList, node) => {
      let preNode = preList.at(-1);

      let title = getTitle(preNode, node);
      if (title) {
        preList.pop();
      }
      let config = undefined;

      if (preNode?.type === 'config') {
        title = preNode.title || '';
        config = preNode.otherProps;
        if (config) {
          preList.pop();
        }
      }

      const propSchema = nodeToSchema(node, config);

      if (propSchema) {
        if (title) {
          propSchema.title = title;
        }
        preList.push(propSchema);
      } else if (propSchema === undefined) {
        if (preNode?.nodeType === 'paragraph') {
          preList.pop();
          preList.push({
            type: 'markdown',
            nodeType: node.type,
            originalNode: node,
            title: title || preNode?.title,
            // @ts-ignore
            value: preNode.value + '\n' + myRemark.stringify(node),
          });
        } else if (
          node.type === 'paragraph' &&
          preNode?.nodeType !== 'heading'
        ) {
          preList.pop();
          preList.push({
            type: 'markdown',
            nodeType: node.type,
            originalNode: node,
            title: title || preNode?.title,
            // @ts-ignore
            value: preNode.value + '\n' + myRemark.stringify(node),
          });
        } else {
          preList.push({
            type: 'markdown',
            nodeType: node.type,
            originalNode: node,
            title,
            // @ts-ignore
            value: myRemark.stringify(node),
          });
        }
      }

      return preList;
    },

    [] as NodeToSchema[],
  );
};
