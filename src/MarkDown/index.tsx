import json5 from 'json5';
import { RootContent, TableCell, TableRow } from 'mdast';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import parse from 'remark-parse';
import { unified } from 'unified';

const myRemark = remark().use(remarkGfm);

export type NodeToSchemaType<T = any> = {
  type: string;
  value?: string;
  lang?: string;
  nodeType: string;
  title?: string;
  originalNode?: RootContent;
  contextProps?: T;
  otherProps?: {
    chartType?: string;
    pureTitle?: string;
    x?: string;
    id?: string;
    y?: string;
    columns?: { title: string; dataIndex: string; key: string }[];
    dataSource?: { [key: string]: string }[];
  } & T;
};

const nodeToSchema = (
  node: RootContent,
  config: NodeToSchemaType['otherProps'],
  contextProps?: NodeToSchemaType['contextProps'],
): NodeToSchemaType | undefined | null => {
  if (node.type === 'table') {
    const tableHeader = node?.children?.at(0);
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
      node?.children?.slice(1).map((row) => {
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
          columns,
          chartType: config?.chartType,
          dataSource: dataSource.map((item) => {
            delete item?.chartType;
            return {
              ...item,
            };
          }),
        },
        contextProps: contextProps,
        nodeType: node?.type,
        originalNode: node,
      };
    }
    return {
      type: 'table',
      otherProps: { ...(config || {}), columns, dataSource },
      nodeType: node?.type,
      originalNode: node,
      contextProps: contextProps,
    };
  }
  if (node.type === 'code') {
    return {
      type: 'code',
      value: node?.value,
      lang: node?.lang || 'text',
      nodeType: node?.type,
      originalNode: node,
      contextProps: contextProps,
      otherProps: config,
    };
  }

  if (node.type === 'heading' && node.depth === 2) {
    const pref = node.children?.at(0);
    return {
      type: 'heading',
      otherProps: {
        ...config,

        // @ts-ignore
        pureTitle: pref ? myRemark.stringify(pref) : myRemark.stringify(node),
      },
      // @ts-ignore
      value: myRemark.stringify(node),
      nodeType: node?.type,
      originalNode: node,
      contextProps: contextProps,
    };
  }
  if (node.type === 'html') {
    const value =
      node?.value?.replace('<!--', '').replace(' -->', '').trim() || '{}';
    try {
      try {
        return {
          type: 'config',
          otherProps: json5.parse(value),
          nodeType: node?.type,
          originalNode: node,
          contextProps: contextProps,
        };
      } catch (error) {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
};

const getTitle = (
  preNode: NodeToSchemaType | undefined,
  node: RootContent | undefined,
) => {
  if (preNode?.type === 'heading' && node?.type !== 'heading') {
    return preNode?.otherProps?.pureTitle || '';
  }
  return '';
};

export const mdToJsonSchema = (md: string) => {
  try {
    const processor = unified()
      .use(parse)
      .use(remarkGfm, { singleTilde: false });
    const ast = processor.parse(md);
    return ast.children.reduce(
      (preList, node) => {
        let preNode = preList.at(-1);

        let title = getTitle(preNode, node);

        let config = undefined;

        if (preNode?.type === 'config' || node?.type === 'heading') {
          config = config || preNode?.otherProps;
        }
        if (preNode?.type === 'config') {
          title = preNode?.title || title;
          preList.pop();
        }

        if (title && preNode?.type === 'heading') {
          preList.pop();
        }

        try {
          const propSchema = nodeToSchema(
            node,
            config,
            config || preNode?.contextProps,
          );
          const contextProps = config || preNode?.contextProps;
          if (propSchema) {
            if (title) {
              propSchema.title = title;
            }
            preList.push(propSchema);
          } else if (propSchema === undefined) {
            if (preNode?.nodeType === 'paragraph') {
              if (preNode?.value) {
                preList.pop();
                preList.push({
                  type: 'markdown',
                  nodeType: node?.type,
                  originalNode: node,
                  otherProps: config,
                  contextProps,
                  title: title || preNode?.title,
                  // @ts-ignore
                  value: preNode?.value + '\n' + myRemark.stringify(node),
                });
              } else {
                preList.push({
                  type: 'markdown',
                  nodeType: node?.type,
                  originalNode: node,
                  contextProps,
                  otherProps: config,
                  title: title || preNode?.title,
                  // @ts-ignore
                  value: myRemark.stringify(node),
                });
              }
            } else if (
              node?.type === 'paragraph' &&
              preNode?.nodeType !== 'heading' &&
              !preNode?.lang &&
              preNode?.value
            ) {
              preList.pop();
              preList.push({
                type: 'markdown',
                nodeType: node?.type,
                contextProps:
                  config || preNode?.contextProps || preNode.otherProps,
                originalNode: node,
                otherProps: config,
                title: title || preNode?.title,
                // @ts-ignore
                value: preNode?.value + '\n' + myRemark.stringify(node),
              });
            } else {
              preList.push({
                type: 'markdown',
                nodeType: node?.type,
                originalNode: node,
                contextProps:
                  config || preNode?.contextProps || preNode?.otherProps,
                otherProps: config,
                title,
                // @ts-ignore
                value: myRemark.stringify(node),
              });
            }
          }
        } catch (error) {}

        return preList;
      },

      [] as NodeToSchemaType[],
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const jsonSchemaToMd = (jsonSchema: NodeToSchemaType[]) => {
  return jsonSchema
    .map((node) => {
      const otherProps = { ...node.otherProps } || {};

      if (node.type === 'heading') {
        return [
          Object.keys(otherProps).length > 0
            ? '<!--' + json5.stringify(otherProps) + '-->'
            : '',
          node.value,
        ];
      }
      if (node.type === 'table') {
        const columns: any[] = node.otherProps?.columns || [];
        const dataSource: any[] = node.otherProps?.dataSource || [];
        const tableHeader = columns.map((column) => {
          return {
            type: 'tableCell',
            children: [
              {
                type: 'text',
                value: column.title,
              },
            ],
          } as TableCell;
        });
        const tableBody = dataSource.map((row) => {
          return {
            type: 'tableRow',
            children: columns.map((column) => {
              return {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: row[column.dataIndex],
                  },
                ],
              };
            }),
          } as TableRow;
        });
        delete otherProps.dataSource;
        delete otherProps.columns;
        return [
          Object.keys(otherProps).length > 0
            ? '<!--' + json5.stringify(otherProps) + '-->'
            : '',
          node?.title ? '## ' + node?.title || '' : '',
          myRemark.stringify({
            type: 'root',
            children: [
              {
                type: 'table',
                children: [
                  {
                    type: 'tableRow',
                    children: tableHeader,
                  },
                  ...tableBody,
                ],
              },
            ],
          }),
        ];
      }
      if (node.type === 'code') {
        return [
          node?.title ? '## ' + node?.title || '' : '',
          Object.keys(otherProps).length > 0
            ? '<!--' + json5.stringify(otherProps) + '-->'
            : '',
          '```' + node.lang + '\n' + node.value + '\n```',
        ];
      }
      if (node.type === 'markdown') {
        return [
          Object.keys(otherProps).length > 0
            ? '<!--' + json5.stringify(otherProps) + '-->'
            : '',
          node?.title ? '## ' + node?.title || '' : '',
          node.value,
        ];
      }
      if (node.type === 'chart') {
        const columns: any[] = node.otherProps?.columns || [];
        const dataSource: any[] = node.otherProps?.dataSource || [];
        const tableHeader = columns.map((column) => {
          return {
            type: 'tableCell',
            children: [
              {
                type: 'text',
                value: column.title,
              },
            ],
          } as TableCell;
        });
        const tableBody = dataSource.map((row) => {
          return {
            type: 'tableRow',
            children: columns.map((column) => {
              return {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: row[column.dataIndex],
                  },
                ],
              };
            }),
          } as TableRow;
        });
        const otherProps = node.otherProps;
        delete otherProps.dataSource;
        delete otherProps.columns;
        return [
          Object.keys(otherProps).length > 0
            ? '<!--' + json5.stringify(otherProps) + '-->'
            : '',
          node?.title ? '## ' + node?.title || '' : '',
          myRemark.stringify({
            type: 'root',
            children: [
              {
                type: 'table',
                children: [
                  {
                    type: 'tableRow',
                    children: tableHeader,
                  },
                  ...tableBody,
                ],
              },
            ],
          }),
        ];
      }
      if (node.type === 'config') {
        return [
          Object.keys(otherProps).length > 0
            ? '<!--' + json5.stringify(otherProps) + '-->'
            : '',
          '<!--' + json5.stringify(node.otherProps) + '-->',
        ];
      }
      return [
        Object.keys(otherProps).length > 0
          ? '<!--' + json5.stringify(otherProps) + '-->'
          : '',
        node.value,
      ];
    })
    .flat()
    .filter(Boolean)
    .join('\n\n');
};
