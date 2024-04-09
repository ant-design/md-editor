import { ConfigProvider, Table, TableProps, theme } from 'antd';
import React, { useMemo, type FC } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownParser component.
 *
 * @param value - The markdown content to be parsed.
 * @param dart - A boolean indicating whether to use the dark theme or not.
 * @returns The parsed markdown content.
 */
export const MarkDownRender: FC<{
  value: string;
  dart?: boolean;
  tableProps?: TableProps<any>;
}> = (props) => {
  const algorithm = useMemo(() => {
    if (props.dart) {
      return theme.darkAlgorithm;
    }
    if (props.dart === false) {
      return undefined;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? theme.darkAlgorithm
      : undefined;
  }, [props.dart]);

  return (
    <ConfigProvider
      theme={{
        algorithm: algorithm,
      }}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node }) => {
            const thead = node?.children.find((child) => {
              //@ts-ignore
              return child?.tagName === 'thead';
            });

            //@ts-ignore
            const columns = thead?.children
              //@ts-ignore
              .filter((item) => item.tagName === 'tr')
              //@ts-ignore
              .map((child) => {
                return (
                  child.children
                    //@ts-ignore
                    .filter((item) => item.tagName === 'th')
                    //@ts-ignore
                    .map((item) => {
                      const title = item.children[0].value;
                      return {
                        title,
                        dataIndex: title,
                        key: title,
                      };
                    })
                );
              })
              .flat(1);

            const tbody = node?.children.find((child) => {
              //@ts-ignore
              return child?.tagName === 'tbody';
            });
            //@ts-ignore
            const dataSource = tbody?.children
              //@ts-ignore
              .filter((item) => item.tagName === 'tr')
              //@ts-ignore
              .map((child) => {
                return (
                  child.children
                    //@ts-ignore
                    .filter((item) => item.tagName === 'td')
                    //@ts-ignore
                    .map((item) => {
                      const title = item.children[0].value;
                      return title;
                    })
                );
              })
              // @ts-ignore
              .reduce((acc, row) => {
                // @ts-ignore
                const obj = columns.reduce((acc, column, index) => {
                  acc[column.dataIndex] = row[index];
                  return acc;
                }, {});
                acc.push(obj);
                return acc;
              }, []);

            return (
              <Table
                size="small"
                bordered
                sticky
                pagination={false}
                {...props.tableProps}
                columns={columns}
                dataSource={dataSource}
              />
            );
          },
        }}
      >
        {props.value}
      </Markdown>
    </ConfigProvider>
  );
};
