import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import parse from 'remark-parse';
import { unified } from 'unified';

const myRemark = remark().use(remarkGfm);

export const mdToApassifySchema = (md: string) => {
  const processor = unified().use(parse).use(remarkGfm, { singleTilde: false });
  const ast = processor.parse(md);

  return ast.children.map((node) => {
    if (node.type === 'table') {
      const tableHeader = node.children?.at(0);
      const columns = tableHeader?.children
        // @ts-ignore
        ?.map((node) => myRemark.stringify(node)?.replace(/\n/g, '').trim())
        .map((title) => {
          return {
            title,
            dataIndex: title,
            key: title,
          };
        });

      const dataSource = node.children?.slice(1).map((row) => {
        return row.children?.reduce((acc, cell, index) => {
          // @ts-ignore
          acc[columns[index].dataIndex] = myRemark
            // @ts-ignore
            .stringify(cell)
            ?.replace(/\n/g, '')
            .trim();
          return acc;
        }, {} as any);
      });

      return {
        type: 'table',
        columns,
        dataSource,
      };
    }

    return {
      type: 'markdown',
      // @ts-ignore
      value: myRemark.stringify(node),
    };
  });
};
