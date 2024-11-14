import { MarkdownEditor, parserMdToSchema } from '@ant-design/md-editor';

const defaultValue = `- [2021 版的 SOFAStack 白皮书](https://gw.alipayobjects.com/os/bmw-prod/348b61a4-034f-4f01-8bd8-4bb2876b63d5.pdf)
- [SOFAStack 解决方案白皮书](https://gw.alipayobjects.com/os/bmw-prod/06b77ee6-82a9-4d8a-aee4-72ddef60cb23.pdf)
- [单元化解决方案白皮书](http://docs-aliyun.cn-hangzhou.oss.aliyun-inc.com/assets/attach/160617/AntCloud_zh/1585895792638/%E8%9A%82%E8%9A%81%E5%8D%95%E5%85%83%E5%8C%96%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf)`;

export default () => {
  console.log(parserMdToSchema(defaultValue));
  return (
    <MarkdownEditor width={'100vw'} height={'100vh'} initValue={defaultValue} />
  );
};
