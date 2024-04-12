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
    chatType?: string;
    data?: { [key: string]: string }[];
    columns?: { title: string; dataIndex: string; key: string }[];
    dataSource?: { [key: string]: string }[];
  };
};

const nodeToSchema = (node: RootContent): NodeToSchema | undefined => {
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

    if (dataSource.at(0).chartType) {
      return {
        type: 'chart',
        otherProps: {
          chatType: dataSource.at(0).chartType,
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
      // @ts-ignore
      value: pref ? myRemark.stringify(pref) : myRemark.stringify(node),
      nodeType: node.type,
      originalNode: node,
    };
  }
};

export const mdToApassifySchema = (md: string) => {
  const processor = unified().use(parse).use(remarkGfm, { singleTilde: false });
  const ast = processor.parse(md);

  return ast.children.reduce(
    (preList, node) => {
      const preNode = preList.at(-1);
      let title = '';
      if (preNode?.type === 'heading' && node.type !== 'heading') {
        title = preNode.value || '';
        preList.pop();
      }

      const propSchema = nodeToSchema(node);

      if (propSchema) {
        if (title) {
          propSchema.title = title;
        }
        preList.push(propSchema);
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
      return preList;
    },

    [] as NodeToSchema[],
  );
};
